import { Router } from 'express';
import {
  getStudentDashboard,
  getEnrolledCourseContent,
  completeLesson,
  getMyCertificates,
} from '../controllers/student.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';
import { requireStudent } from '../middleware/rbac.middleware.js';

const router = Router();

router.get('/dashboard', authenticateUser, requireStudent, getStudentDashboard);
router.get('/courses/:courseId/learn', authenticateUser, getEnrolledCourseContent);
router.post('/lessons/:lessonId/complete', authenticateUser, requireStudent, completeLesson);
router.get('/certificates', authenticateUser, requireStudent, getMyCertificates);

export default router;
