import { Router } from 'express';
import {
  getAnalytics,
  getUsers,
  updateUserRole,
  updateUserStatus,
  getAllPayments,
} from '../controllers/admin.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/rbac.middleware.js';

const router = Router();

router.use(authenticateUser, requireAdmin);

router.get('/analytics', getAnalytics);
router.get('/users', getUsers);
router.patch('/users/:id/role', updateUserRole);
router.patch('/users/:id/status', updateUserStatus);
router.get('/payments', getAllPayments);

export default router;
