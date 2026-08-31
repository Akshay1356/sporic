import { Router } from 'express';
import { handleFileUpload } from '../controllers/upload.controller.js';
import { uploadMiddleware } from '../middleware/upload.middleware.js';
import { authenticateUser } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', authenticateUser, uploadMiddleware.single('file'), handleFileUpload);

export default router;
