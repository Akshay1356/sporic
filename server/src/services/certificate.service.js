import crypto from 'crypto';
import prisma from '../config/prisma.js';
import { AppError } from '../utils/errors.js';

export async function generateCertificate({ studentId, courseId }) {
  // Check if enrollment exists and is 100% complete
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      studentId_courseId: {
        studentId,
        courseId,
      },
    },
    include: {
      student: true,
      course: true,
    },
  });

  if (!enrollment) {
    throw new AppError('Student is not enrolled in this course', 404, 'ENROLLMENT_NOT_FOUND');
  }

  // Check if certificate already exists
  const existingCert = await prisma.certificate.findFirst({
    where: { studentId, courseId },
  });

  if (existingCert) {
    return existingCert;
  }

  const certificateNumber = `VITTEC-CERT-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
  const rawHashString = `${certificateNumber}|${studentId}|${courseId}|${Date.now()}`;
  const verificationHash = crypto.createHash('sha256').update(rawHashString).digest('hex');

  const certificate = await prisma.certificate.create({
    data: {
      certificateNumber,
      studentId,
      courseId,
      studentName: enrollment.student.name,
      courseName: enrollment.course.title,
      verificationHash,
      certificateUrl: `/api/certificates/verify/${certificateNumber}`,
      status: 'VALID',
    },
  });

  // Mark enrollment completed
  await prisma.enrollment.update({
    where: { id: enrollment.id },
    data: {
      status: 'COMPLETED',
      progressPercent: 100.0,
      completedAt: new Date(),
    },
  });

  return certificate;
}

export async function verifyCertificateByNumber(certificateNumber) {
  const certificate = await prisma.certificate.findUnique({
    where: { certificateNumber },
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

  if (!certificate) {
    throw new AppError('Certificate not found or invalid certificate number', 404, 'CERTIFICATE_NOT_FOUND');
  }

  return {
    certificateNumber: certificate.certificateNumber,
    studentName: certificate.studentName,
    courseName: certificate.courseName,
    courseCode: certificate.course.courseCode,
    durationHours: certificate.course.durationHours,
    trainingMode: certificate.course.trainingMode,
    issueDate: certificate.issueDate,
    verificationHash: certificate.verificationHash,
    status: certificate.status,
    issuingAuthority: 'Dean, Sponsored Research & Industrial Consultancy (SpoRIC), VIT Chennai',
  };
}
