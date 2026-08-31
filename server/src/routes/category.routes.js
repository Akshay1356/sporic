import { Router } from 'express';
import { getAllCategories, createCategory, deleteCategory } from '../controllers/category.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/rbac.middleware.js';

const router = Router();

router.get('/', getAllCategories);
router.post('/', authenticateUser, requireAdmin, createCategory);
router.delete('/:id', authenticateUser, requireAdmin, deleteCategory);

export default router;
