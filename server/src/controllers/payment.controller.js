import prisma from '../config/prisma.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { createRazorpayOrder, verifyRazorpaySignature } from '../services/razorpay.service.js';
import { createNotification, notifyAdmins } from '../services/notification.service.js';
import { AppError } from '../utils/errors.js';

export async function createOrder(req, res, next) {
  try {
    const studentId = req.user.id;
    const { courseId, batchId } = req.body;

    if (!courseId) {
      return errorResponse(res, 'courseId (or courseCode) is required.', 400, 'MISSING_COURSE_ID');
    }

    const course = await prisma.course.findFirst({
      where: {
        OR: [
          { courseCode: courseId.toUpperCase() },
          { id: courseId },
        ],
      },
    });


    if (!course) {
      throw new AppError('Course not found.', 404, 'COURSE_NOT_FOUND');
    }

    // Check if user is already actively enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId,
          courseId: course.id,
        },
      },
    });

    if (existingEnrollment && existingEnrollment.status === 'ACTIVE') {
      return errorResponse(res, 'You are already actively enrolled in this course.', 400, 'ALREADY_ENROLLED');
    }

    const receiptNumber = `REC-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const razorpayOrder = await createRazorpayOrder({
      amount: course.finalPrice,
      currency: 'INR',
      receipt: receiptNumber,
      notes: {
        studentId,
        courseId: course.id,
        courseCode: course.courseCode,
        batchId: batchId || '',
      },
    });

    // Create payment entry in database in PENDING status
    const payment = await prisma.payment.create({
      data: {
        studentId,
        courseId: course.id,
        razorpayOrderId: razorpayOrder.id,
        amount: course.finalPrice,
        currency: 'INR',
        status: 'PENDING',
        receiptNumber,
      },
    });

    return successResponse(
      res,
      {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        receipt: receiptNumber,
        key: process.env.RAZORPAY_KEY_ID || 'rzp_test_SPORIC2026Key',
        course: {
          id: course.id,
          code: course.courseCode,
          title: course.title,
          finalPrice: course.finalPrice,
        },
        paymentDbId: payment.id,
      },
      'Razorpay order created successfully',
      201
    );
  } catch (err) {
    next(err);
  }
}

export async function verifyPayment(req, res, next) {
  try {
    const studentId = req.user.id;
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, batchId } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return errorResponse(res, 'Missing Razorpay signature verification parameters.', 400, 'MISSING_PAYMENT_SIGNATURE');
    }

    const isValid = verifyRazorpaySignature({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    if (!isValid) {
      // Mark payment as FAILED
      await prisma.payment.updateMany({
        where: { razorpayOrderId },
        data: { status: 'FAILED' },
      });

      return errorResponse(res, 'Payment signature verification failed. Untrusted payment transaction.', 400, 'PAYMENT_SIGNATURE_INVALID');
    }

    // Find payment record
    const payment = await prisma.payment.findUnique({
      where: { razorpayOrderId },
      include: { course: true, student: true },
    });

    if (!payment) {
      throw new AppError('Payment record not found for order.', 404, 'PAYMENT_NOT_FOUND');
    }

    // Update payment record to SUCCESS
    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        razorpayPaymentId,
        razorpaySignature,
        status: 'SUCCESS',
      },
    });

    // Create or reactivate student enrollment
    const enrollment = await prisma.enrollment.upsert({
      where: {
        studentId_courseId: {
          studentId,
          courseId: payment.courseId,
        },
      },
      update: {
        status: 'ACTIVE',
        batchId: batchId || null,
        paymentId: updatedPayment.id,
        progressPercent: 0.0,
        enrolledAt: new Date(),
      },
      create: {
        studentId,
        courseId: payment.courseId,
        batchId: batchId || null,
        paymentId: updatedPayment.id,
        status: 'ACTIVE',
        progressPercent: 0.0,
      },
      include: {
        course: { select: { courseCode: true, title: true } },
      },
    });

    // Send notifications
    await createNotification({
      userId: studentId,
      title: 'Payment Successful & Enrollment Activated',
      message: `Your payment of INR ${payment.amount} for ${payment.course.title} (${payment.course.courseCode}) was verified. You now have full access to course materials.`,
      type: 'PAYMENT',
    });

    await notifyAdmins({
      title: 'New Paid Enrollment',
      message: `Student ${req.user.name} enrolled in ${payment.course.courseCode} (Receipt: ${payment.receiptNumber}, Amount: INR ${payment.amount}).`,
      type: 'PAYMENT',
    });

    return successResponse(
      res,
      {
        enrollment,
        payment: {
          receiptNumber: payment.receiptNumber,
          amount: payment.amount,
          status: 'SUCCESS',
          paymentId: razorpayPaymentId,
        },
      },
      'Payment verified and student enrollment confirmed successfully'
    );
  } catch (err) {
    next(err);
  }
}

export async function getMyPaymentHistory(req, res, next) {
  try {
    const studentId = req.user.id;
    const payments = await prisma.payment.findMany({
      where: { studentId },
      orderBy: { createdAt: 'desc' },
      include: {
        course: {
          select: {
            id: true,
            courseCode: true,
            title: true,
            durationHours: true,
            trainingMode: true,
          },
        },
      },
    });

    return successResponse(res, payments, 'Payment history retrieved successfully');
  } catch (err) {
    next(err);
  }
}
