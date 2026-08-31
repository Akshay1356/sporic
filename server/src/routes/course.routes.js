import { Router } from 'express';
import {
  getCourses,
  getCourseByCodeOrId,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../controllers/course.controller.js';
import { authenticateUser, optionalAuthenticateUser } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/rbac.middleware.js';

const router = Router();

router.get('/', optionalAuthenticateUser, getCourses);
router.get('/:identifier', optionalAuthenticateUser, getCourseByCodeOrId);
router.post('/', authenticateUser, requireAdmin, createCourse);
router.put('/:id', authenticateUser, requireAdmin, updateCourse);
router.delete('/:id', authenticateUser, requireAdmin, deleteCourse);

export default router;
