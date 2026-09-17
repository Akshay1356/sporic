import { and, eq, or } from 'drizzle-orm';
import { db } from '../db/index.js';
import { course, enrollment, payment } from '../db/schema/index.js';
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

    const foundCourse = await db.query.course.findFirst({
      where: or(eq(course.courseCode, courseId.toUpperCase()), eq(course.id, courseId)),
    });

    if (!foundCourse) {
      throw new AppError('Course not found.', 404, 'COURSE_NOT_FOUND');
    }

    // Check if user is already actively enrolled
    const existingEnrollment = await db.query.enrollment.findFirst({
      where: and(eq(enrollment.studentId, studentId), eq(enrollment.courseId, foundCourse.id)),
    });

    if (existingEnrollment && existingEnrollment.status === 'ACTIVE') {
      return errorResponse(res, 'You are already actively enrolled in this course.', 400, 'ALREADY_ENROLLED');
    }

    const receiptNumber = `REC-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const razorpayOrder = await createRazorpayOrder({
      amount: foundCourse.finalPrice,
      currency: 'INR',
      receipt: receiptNumber,
      notes: {
        studentId,
        courseId: foundCourse.id,
        courseCode: foundCourse.courseCode,
        batchId: batchId || '',
      },
    });

    // Create payment entry in database in PENDING status
    const [createdPayment] = await db
      .insert(payment)
      .values({
        studentId,
        courseId: foundCourse.id,
        razorpayOrderId: razorpayOrder.id,
        amount: foundCourse.finalPrice,
        currency: 'INR',
        status: 'PENDING',
        receiptNumber,
      })
      .returning();

    return successResponse(
      res,
      {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        receipt: receiptNumber,
        key: process.env.RAZORPAY_KEY_ID || 'rzp_test_SPORIC2026Key',
        course: {
          id: foundCourse.id,
          code: foundCourse.courseCode,
          title: foundCourse.title,
          finalPrice: foundCourse.finalPrice,
        },
        paymentDbId: createdPayment.id,
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

    const isValid = verifyRazorpaySignature({ razorpayOrderId, razorpayPaymentId, razorpaySignature });

    if (!isValid) {
      await db.update(payment).set({ status: 'FAILED' }).where(eq(payment.razorpayOrderId, razorpayOrderId));
      return errorResponse(res, 'Payment signature verification failed. Untrusted payment transaction.', 400, 'PAYMENT_SIGNATURE_INVALID');
    }

    // Find payment record
    const foundPayment = await db.query.payment.findFirst({
      where: eq(payment.razorpayOrderId, razorpayOrderId),
      with: { course: true, student: true },
    });

    if (!foundPayment) {
      throw new AppError('Payment record not found for order.', 404, 'PAYMENT_NOT_FOUND');
    }

    // Update payment record to SUCCESS
    const [updatedPayment] = await db
      .update(payment)
      .set({ razorpayPaymentId, razorpaySignature, status: 'SUCCESS' })
      .where(eq(payment.id, foundPayment.id))
      .returning();

    // Create or reactivate student enrollment (upsert on studentId+courseId)
    const existingEnrollment = await db.query.enrollment.findFirst({
      where: and(eq(enrollment.studentId, studentId), eq(enrollment.courseId, foundPayment.courseId)),
    });

    let enrollmentRecord;
    if (existingEnrollment) {
      [enrollmentRecord] = await db
        .update(enrollment)
        .set({
          status: 'ACTIVE',
          batchId: batchId || null,
          paymentId: updatedPayment.id,
          progressPercent: 0.0,
          enrolledAt: new Date(),
        })
        .where(eq(enrollment.id, existingEnrollment.id))
        .returning();
    } else {
      [enrollmentRecord] = await db
        .insert(enrollment)
        .values({
          studentId,
          courseId: foundPayment.courseId,
          batchId: batchId || null,
          paymentId: updatedPayment.id,
          status: 'ACTIVE',
          progressPercent: 0.0,
        })
        .returning();
    }

    const enrollmentResult = {
      ...enrollmentRecord,
      course: { courseCode: foundPayment.course.courseCode, title: foundPayment.course.title },
    };

    // Send notifications
    await createNotification({
      userId: studentId,
      title: 'Payment Successful & Enrollment Activated',
      message: `Your payment of INR ${foundPayment.amount} for ${foundPayment.course.title} (${foundPayment.course.courseCode}) was verified. You now have full access to course materials.`,
      type: 'PAYMENT',
    });

    await notifyAdmins({
      title: 'New Paid Enrollment',
      message: `Student ${req.user.name} enrolled in ${foundPayment.course.courseCode} (Receipt: ${foundPayment.receiptNumber}, Amount: INR ${foundPayment.amount}).`,
      type: 'PAYMENT',
    });

    return successResponse(
      res,
      {
        enrollment: enrollmentResult,
        payment: {
          receiptNumber: foundPayment.receiptNumber,
          amount: foundPayment.amount,
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
    const payments = await db.query.payment.findMany({
      where: eq(payment.studentId, studentId),
      orderBy: (p, { desc }) => [desc(p.createdAt)],
      with: {
        course: {
          columns: { id: true, courseCode: true, title: true, durationHours: true, trainingMode: true },
        },
      },
    });

    return successResponse(res, payments, 'Payment history retrieved successfully');
  } catch (err) {
    next(err);
  }
}
