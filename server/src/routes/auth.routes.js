import { Router } from 'express';
import {
  googleLogin,
  register,
  login,
  sendOtp,
  verifyOtp,
  loginWithOtp,
  getMe,
  logout,
} from '../controllers/auth.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';
import { authLimiter } from '../middleware/rateLimiter.middleware.js';

const router = Router();

router.post('/send-otp', authLimiter, sendOtp);
router.post('/verify-otp', authLimiter, verifyOtp);
router.post('/login-otp', authLimiter, loginWithOtp);
router.post('/google', authLimiter, googleLogin);
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/logout', logout);
router.get('/me', authenticateUser, getMe);

export default router;
