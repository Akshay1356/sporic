import { Router } from 'express';
import {
  getAnalytics,
  getUsers,
  updateUserRole,
  updateUserStatus,
  getAllPayments,
} from '../controllers/admin.controller.js';
import { uploadGalleryPhoto, deleteGalleryPhoto, updateGalleryPhoto } from '../controllers/gallery.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/rbac.middleware.js';

const router = Router();

router.use(authenticateUser, requireAdmin);

router.get('/analytics', getAnalytics);
router.get('/users', getUsers);
router.patch('/users/:id/role', updateUserRole);
router.patch('/users/:id/status', updateUserStatus);
router.get('/payments', getAllPayments);

// Gallery Admin Routes (/api/admin/gallery)
router.post('/gallery', uploadGalleryPhoto);
router.put('/gallery/:id', updateGalleryPhoto);
router.put('/gallery', updateGalleryPhoto);
router.delete('/gallery/:id', deleteGalleryPhoto);
router.delete('/gallery', deleteGalleryPhoto);

export default router;
