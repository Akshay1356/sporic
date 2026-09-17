import crypto from 'crypto';
import { and, eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { enrollment, certificate } from '../db/schema/index.js';
import { AppError } from '../utils/errors.js';

export async function generateCertificate({ studentId, courseId }) {
  // Check if enrollment exists and is complete
  const existingEnrollment = await db.query.enrollment.findFirst({
    where: and(eq(enrollment.studentId, studentId), eq(enrollment.courseId, courseId)),
    with: {
      student: true,
      course: true,
    },
  });

  if (!existingEnrollment) {
    throw new AppError('Student is not enrolled in this course', 404, 'ENROLLMENT_NOT_FOUND');
  }

  // Check if certificate already exists
  const existingCert = await db.query.certificate.findFirst({
    where: and(eq(certificate.studentId, studentId), eq(certificate.courseId, courseId)),
  });

  if (existingCert) {
    return existingCert;
  }

  const certificateNumber = `VITTEC-CERT-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
  const rawHashString = `${certificateNumber}|${studentId}|${courseId}|${Date.now()}`;
  const verificationHash = crypto.createHash('sha256').update(rawHashString).digest('hex');

  const [createdCertificate] = await db
    .insert(certificate)
    .values({
      certificateNumber,
      studentId,
      courseId,
      studentName: existingEnrollment.student.name,
      courseName: existingEnrollment.course.title,
      verificationHash,
      certificateUrl: `/api/certificates/verify/${certificateNumber}`,
      status: 'VALID',
    })
    .returning();

  // Mark enrollment completed
  await db
    .update(enrollment)
    .set({
      status: 'COMPLETED',
      progressPercent: 100.0,
      completedAt: new Date(),
    })
    .where(eq(enrollment.id, existingEnrollment.id));

  return createdCertificate;
}

export async function verifyCertificateByNumber(certificateNumber) {
  const cert = await db.query.certificate.findFirst({
    where: eq(certificate.certificateNumber, certificateNumber),
    with: {
      course: {
        columns: {
          courseCode: true,
          title: true,
          durationHours: true,
          trainingMode: true,
        },
      },
    },
  });

  if (!cert) {
    throw new AppError('Certificate not found or invalid certificate number', 404, 'CERTIFICATE_NOT_FOUND');
  }

  return {
    certificateNumber: cert.certificateNumber,
    studentName: cert.studentName,
    courseName: cert.courseName,
    courseCode: cert.course.courseCode,
    durationHours: cert.course.durationHours,
    trainingMode: cert.course.trainingMode,
    issueDate: cert.issueDate,
    verificationHash: cert.verificationHash,
    status: cert.status,
    issuingAuthority: 'Dean, Sponsored Research & Industrial Consultancy (SpoRIC), VIT Chennai',
  };
}
