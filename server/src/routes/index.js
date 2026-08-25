import { Router } from 'express';
import authRoutes from './auth.routes.js';
import categoryRoutes from './category.routes.js';
import courseRoutes from './course.routes.js';
import paymentRoutes from './payment.routes.js';
import studentRoutes from './student.routes.js';
import fundingRoutes from './funding.routes.js';
import { researchRouter, patentRouter, publicationRouter } from './research.routes.js';
import certificateRoutes from './certificate.routes.js';
import notificationRoutes from './notification.routes.js';
import uploadRoutes from './upload.routes.js';
import adminRoutes from './admin.routes.js';
import contactRoutes from './contact.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/courses', courseRoutes);
router.use('/payments', paymentRoutes);
router.use('/student', studentRoutes);
router.use('/funding', fundingRoutes);
router.use('/research', researchRouter);
router.use('/patents', patentRouter);
router.use('/publications', publicationRouter);
router.use('/certificates', certificateRoutes);
router.use('/notifications', notificationRoutes);
router.use('/uploads', uploadRoutes);
router.use('/admin', adminRoutes);
router.use('/contact', contactRoutes);

export default router;
