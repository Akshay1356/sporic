import { Router } from 'express';
import { submitInquiry, getInquiries } from '../controllers/contact.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/rbac.middleware.js';

const router = Router();

router.post('/', submitInquiry);
router.get('/', authenticateUser, requireAdmin, getInquiries);

export default router;
