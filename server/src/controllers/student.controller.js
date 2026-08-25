import prisma from '../config/prisma.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { AppError } from '../utils/errors.js';
import { generateCertificate } from '../services/certificate.service.js';
import { createNotification } from '../services/notification.service.js';

export async function getStudentDashboard(req, res, next) {
  try {
    const studentId = req.user.id;

    const [enrollments, certificatesCount, paymentsCount, notificationsCount] = await Promise.all([
      prisma.enrollment.findMany({
        where: { studentId },
        include: {
          course: {
            select: {
              id: true,
              courseCode: true,
              title: true,
              durationHours: true,
              trainingMode: true,
              category: { select: { name: true, domain: true } },
              _count: { select: { modules: true } },
            },
          },
          batch: true,
        },
        orderBy: { enrolledAt: 'desc' },
      }),
      prisma.certificate.count({ where: { studentId } }),
      prisma.payment.count({ where: { studentId, status: 'SUCCESS' } }),
      prisma.notification.count({ where: { userId: studentId, isRead: false } }),
    ]);

    const activeEnrollments = enrollments.filter((e) => e.status === 'ACTIVE');
    const completedEnrollments = enrollments.filter((e) => e.status === 'COMPLETED');

    return successResponse(res, {
      summary: {
        totalEnrolled: enrollments.length,
        activeCourses: activeEnrollments.length,
        completedCourses: completedEnrollments.length,
        certificatesEarned: certificatesCount,
        verifiedPayments: paymentsCount,
        unreadNotifications: notificationsCount,
      },
      enrollments,
    }, 'Student dashboard data retrieved');
  } catch (err) {
    next(err);
  }
}

export async function getEnrolledCourseContent(req, res, next) {
  try {
    const studentId = req.user.id;
    const { courseId } = req.params;

    // Verify course exists
    const course = await prisma.course.findFirst({
      where: {
        OR: [{ id: courseId }, { courseCode: courseId }],
      },
      include: {
        category: true,
        modules: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!course) {
      throw new AppError('Course not found.', 404, 'COURSE_NOT_FOUND');
    }

    // Check active enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId,
          courseId: course.id,
        },
      },
    });

    if (!enrollment && req.user.role !== 'ADMIN') {
      return errorResponse(res, 'You are not enrolled in this course. Please enroll to view full learning content.', 403, 'NOT_ENROLLED');
    }

    const completedLessonIds = enrollment ? JSON.parse(enrollment.completedLessons || '[]') : [];

    return successResponse(res, {
      course: {
        id: course.id,
        courseCode: course.courseCode,
        title: course.title,
        domain: course.category.domain,
        category: course.category.name,
        durationHours: course.durationHours,
      },
      enrollment: enrollment
        ? {
            id: enrollment.id,
            status: enrollment.status,
            progressPercent: enrollment.progressPercent,
            completedLessons: completedLessonIds,
            enrolledAt: enrollment.enrolledAt,
            completedAt: enrollment.completedAt,
          }
        : null,
      modules: course.modules,
    }, 'Course learning content retrieved');
  } catch (err) {
    next(err);
  }
}

export async function completeLesson(req, res, next) {
  try {
    const studentId = req.user.id;
    const { lessonId } = req.params;

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            course: {
              include: {
                modules: {
                  include: {
                    lessons: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!lesson) {
      throw new AppError('Lesson not found.', 404, 'LESSON_NOT_FOUND');
    }

    const course = lesson.module.course;

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId,
          courseId: course.id,
        },
      },
    });

    if (!enrollment) {
      return errorResponse(res, 'Student is not enrolled in this course.', 403, 'NOT_ENROLLED');
    }

    // Calculate total lessons in course
    let totalLessonsCount = 0;
    for (const m of course.modules) {
      totalLessonsCount += m.lessons.length;
    }

    let completedList = JSON.parse(enrollment.completedLessons || '[]');
    if (!completedList.includes(lessonId)) {
      completedList.push(lessonId);
    }

    const progressPercent = totalLessonsCount > 0
      ? Math.min(100, Math.round((completedList.length / totalLessonsCount) * 100))
      : 100;

    const isFinished = progressPercent >= 100;

    const updated = await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: {
        completedLessons: JSON.stringify(completedList),
        progressPercent,
        status: isFinished ? 'COMPLETED' : 'ACTIVE',
        completedAt: isFinished ? new Date() : null,
      },
    });

    // Auto issue certificate if finished
    let certificate = null;
    if (isFinished) {
      certificate = await generateCertificate({ studentId, courseId: course.id });
      await createNotification({
        userId: studentId,
        title: '🎉 Course Completed & Certificate Issued!',
        message: `Congratulations! You have completed ${course.title}. Your certificate (${certificate.certificateNumber}) is ready for download.`,
        type: 'ENROLLMENT',
      });
    }

    return successResponse(res, {
      enrollment: updated,
      certificate,
      completedLessonsCount: completedList.length,
      totalLessonsCount,
    }, isFinished ? 'Course completed and certificate issued!' : 'Lesson marked complete');
  } catch (err) {
    next(err);
  }
}

export async function getMyCertificates(req, res, next) {
  try {
    const studentId = req.user.id;
    const certificates = await prisma.certificate.findMany({
      where: { studentId },
      orderBy: { issueDate: 'desc' },
      include: {
        course: {
          select: {
            courseCode: true,
            title: true,
            durationHours: true,
            trainingMode: true,
          },
        },
      },
    });

    return successResponse(res, certificates, 'Certificates retrieved successfully');
  } catch (err) {
    next(err);
  }
}
