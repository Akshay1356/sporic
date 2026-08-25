import { Router } from 'express';
import { createOrder, verifyPayment, getMyPaymentHistory } from '../controllers/payment.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/create-order', authenticateUser, createOrder);
router.post('/verify', authenticateUser, verifyPayment);
router.get('/my-history', authenticateUser, getMyPaymentHistory);

export default router;
