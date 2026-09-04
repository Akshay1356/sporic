import { Router } from 'express';
import { getPublicGallery, uploadGalleryPhoto, deleteGalleryPhoto, updateGalleryPhoto } from '../controllers/gallery.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/rbac.middleware.js';

const router = Router();

// Public route
router.get('/', getPublicGallery);

// Admin authenticated routes
router.post('/admin', authenticateUser, requireAdmin, uploadGalleryPhoto);
router.put('/admin/:id', authenticateUser, requireAdmin, updateGalleryPhoto);
router.put('/admin', authenticateUser, requireAdmin, updateGalleryPhoto);
router.delete('/admin/:id', authenticateUser, requireAdmin, deleteGalleryPhoto);
router.delete('/admin', authenticateUser, requireAdmin, deleteGalleryPhoto);

export default router;
