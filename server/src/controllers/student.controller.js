import { and, eq, or, sql } from 'drizzle-orm';
import { db } from '../db/index.js';
import { certificate, course, enrollment, lesson, notification, payment } from '../db/schema/index.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { AppError } from '../utils/errors.js';
import { generateCertificate } from '../services/certificate.service.js';
import { createNotification } from '../services/notification.service.js';

async function countRows(table, whereClause) {
  const rows = await db.select({ count: sql`count(*)`.mapWith(Number) }).from(table).where(whereClause);
  return rows[0]?.count ?? 0;
}

export async function getStudentDashboard(req, res, next) {
  try {
    const studentId = req.user.id;

    const [enrollments, certificatesCount, paymentsCount, notificationsCount] = await Promise.all([
      db.query.enrollment.findMany({
        where: eq(enrollment.studentId, studentId),
        orderBy: (e, { desc }) => [desc(e.enrolledAt)],
        with: {
          course: {
            columns: { id: true, courseCode: true, title: true, durationHours: true, trainingMode: true },
            with: {
              category: { columns: { name: true, domain: true } },
              modules: { columns: { id: true } },
            },
          },
          batch: true,
        },
      }),
      countRows(certificate, eq(certificate.studentId, studentId)),
      countRows(payment, and(eq(payment.studentId, studentId), eq(payment.status, 'SUCCESS'))),
      countRows(notification, and(eq(notification.userId, studentId), eq(notification.isRead, false))),
    ]);

    const formattedEnrollments = enrollments.map((e) => ({
      ...e,
      course: {
        ...e.course,
        _count: { modules: e.course.modules.length },
        modules: undefined,
      },
    }));

    const activeEnrollments = formattedEnrollments.filter((e) => e.status === 'ACTIVE');
    const completedEnrollments = formattedEnrollments.filter((e) => e.status === 'COMPLETED');

    return successResponse(
      res,
      {
        summary: {
          totalEnrolled: formattedEnrollments.length,
          activeCourses: activeEnrollments.length,
          completedCourses: completedEnrollments.length,
          certificatesEarned: certificatesCount,
          verifiedPayments: paymentsCount,
          unreadNotifications: notificationsCount,
        },
        enrollments: formattedEnrollments,
      },
      'Student dashboard data retrieved'
    );
  } catch (err) {
    next(err);
  }
}

export async function getEnrolledCourseContent(req, res, next) {
  try {
    const studentId = req.user.id;
    const { courseId } = req.params;

    // Verify course exists
    const foundCourse = await db.query.course.findFirst({
      where: or(eq(course.id, courseId), eq(course.courseCode, courseId)),
      with: {
        category: true,
        modules: {
          orderBy: (m, { asc }) => [asc(m.order)],
          with: {
            lessons: { orderBy: (l, { asc }) => [asc(l.order)] },
          },
        },
      },
    });

    if (!foundCourse) {
      throw new AppError('Course not found.', 404, 'COURSE_NOT_FOUND');
    }

    // Check active enrollment
    const foundEnrollment = await db.query.enrollment.findFirst({
      where: and(eq(enrollment.studentId, studentId), eq(enrollment.courseId, foundCourse.id)),
    });

    if (!foundEnrollment && req.user.role !== 'ADMIN') {
      return errorResponse(res, 'You are not enrolled in this course. Please enroll to view full learning content.', 403, 'NOT_ENROLLED');
    }

    const completedLessonIds = foundEnrollment ? JSON.parse(foundEnrollment.completedLessons || '[]') : [];

    return successResponse(
      res,
      {
        course: {
          id: foundCourse.id,
          courseCode: foundCourse.courseCode,
          title: foundCourse.title,
          domain: foundCourse.category.domain,
          category: foundCourse.category.name,
          durationHours: foundCourse.durationHours,
        },
        enrollment: foundEnrollment
          ? {
              id: foundEnrollment.id,
              status: foundEnrollment.status,
              progressPercent: foundEnrollment.progressPercent,
              completedLessons: completedLessonIds,
              enrolledAt: foundEnrollment.enrolledAt,
              completedAt: foundEnrollment.completedAt,
            }
          : null,
        modules: foundCourse.modules,
      },
      'Course learning content retrieved'
    );
  } catch (err) {
    next(err);
  }
}

export async function completeLesson(req, res, next) {
  try {
    const studentId = req.user.id;
    const { lessonId } = req.params;

    const foundLesson = await db.query.lesson.findFirst({
      where: eq(lesson.id, lessonId),
      with: {
        module: {
          with: {
            course: {
              with: {
                modules: { with: { lessons: true } },
              },
            },
          },
        },
      },
    });

    if (!foundLesson) {
      throw new AppError('Lesson not found.', 404, 'LESSON_NOT_FOUND');
    }

    const parentCourse = foundLesson.module.course;

    const foundEnrollment = await db.query.enrollment.findFirst({
      where: and(eq(enrollment.studentId, studentId), eq(enrollment.courseId, parentCourse.id)),
    });

    if (!foundEnrollment) {
      return errorResponse(res, 'Student is not enrolled in this course.', 403, 'NOT_ENROLLED');
    }

    // Calculate total lessons in course
    let totalLessonsCount = 0;
    for (const m of parentCourse.modules) {
      totalLessonsCount += m.lessons.length;
    }

    let completedList = JSON.parse(foundEnrollment.completedLessons || '[]');
    if (!completedList.includes(lessonId)) {
      completedList.push(lessonId);
    }

    const progressPercent = totalLessonsCount > 0 ? Math.min(100, Math.round((completedList.length / totalLessonsCount) * 100)) : 100;

    const isFinished = progressPercent >= 100;

    const [updated] = await db
      .update(enrollment)
      .set({
        completedLessons: JSON.stringify(completedList),
        progressPercent,
        status: isFinished ? 'COMPLETED' : 'ACTIVE',
        completedAt: isFinished ? new Date() : null,
      })
      .where(eq(enrollment.id, foundEnrollment.id))
      .returning();

    // Auto issue certificate if finished
    let issuedCertificate = null;
    if (isFinished) {
      issuedCertificate = await generateCertificate({ studentId, courseId: parentCourse.id });
      await createNotification({
        userId: studentId,
        title: '🎉 Course Completed & Certificate Issued!',
        message: `Congratulations! You have completed ${parentCourse.title}. Your certificate (${issuedCertificate.certificateNumber}) is ready for download.`,
        type: 'ENROLLMENT',
      });
    }

    return successResponse(
      res,
      {
        enrollment: updated,
        certificate: issuedCertificate,
        completedLessonsCount: completedList.length,
        totalLessonsCount,
      },
      isFinished ? 'Course completed and certificate issued!' : 'Lesson marked complete'
    );
  } catch (err) {
    next(err);
  }
}

export async function getMyCertificates(req, res, next) {
  try {
    const studentId = req.user.id;
    const certificates = await db.query.certificate.findMany({
      where: eq(certificate.studentId, studentId),
      orderBy: (c, { desc }) => [desc(c.issueDate)],
      with: {
        course: {
          columns: { courseCode: true, title: true, durationHours: true, trainingMode: true },
        },
      },
    });

    return successResponse(res, certificates, 'Certificates retrieved successfully');
  } catch (err) {
    next(err);
  }
}
