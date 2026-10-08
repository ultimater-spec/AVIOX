import express from 'express';
import { register, login, getMe, updateProfile, sendMobileOtp, verifyMobileOtp } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/send-mobile-otp', protect, sendMobileOtp);
router.post('/verify-mobile-otp', protect, verifyMobileOtp);

export default router;
