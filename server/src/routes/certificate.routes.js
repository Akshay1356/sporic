import { Router } from 'express';
import { verifyCertificate, issueCertificate, getAllCertificates } from '../controllers/certificate.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/rbac.middleware.js';

const router = Router();

router.get('/verify/:certificateId', verifyCertificate);
router.post('/generate', authenticateUser, requireAdmin, issueCertificate);
router.get('/all', authenticateUser, requireAdmin, getAllCertificates);

export default router;
