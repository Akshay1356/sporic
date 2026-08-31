import { Router } from 'express';
import { getMyNotifications, markAsRead, markAllAsRead } from '../controllers/notification.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', authenticateUser, getMyNotifications);
router.patch('/:id/read', authenticateUser, markAsRead);
router.post('/mark-all-read', authenticateUser, markAllAsRead);

export default router;
