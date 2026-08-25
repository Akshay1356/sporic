import { verifyCertificateByNumber, generateCertificate } from '../services/certificate.service.js';
import { successResponse, errorResponse } from '../utils/response.js';
import prisma from '../config/prisma.js';

export async function verifyCertificate(req, res, next) {
  try {
    const { certificateId } = req.params;
    if (!certificateId) {
      return errorResponse(res, 'Certificate identifier is required.', 400, 'MISSING_CERTIFICATE_ID');
    }

    const verificationResult = await verifyCertificateByNumber(certificateId);
    return successResponse(res, verificationResult, 'Certificate verified successfully');
  } catch (err) {
    next(err);
  }
}

export async function issueCertificate(req, res, next) {
  try {
    const { studentId, courseId } = req.body;
    if (!studentId || !courseId) {
      return errorResponse(res, 'studentId and courseId are required.', 400, 'MISSING_FIELDS');
    }

    const certificate = await generateCertificate({ studentId, courseId });
    return successResponse(res, certificate, 'Certificate issued successfully', 201);
  } catch (err) {
    next(err);
  }
}

export async function getAllCertificates(req, res, next) {
  try {
    const certificates = await prisma.certificate.findMany({
      orderBy: { issueDate: 'desc' },
      include: {
        student: { select: { id: true, name: true, email: true, organization: true } },
        course: { select: { id: true, courseCode: true, title: true } },
      },
    });

    return successResponse(res, certificates, 'All issued certificates retrieved');
  } catch (err) {
    next(err);
  }
}
