import express from 'express';
const router = express.Router();
import { 
  register,
  verifyOtp,
  login,
  forgotPassword,
  resetPassword,
  resendOtp
} from '../controllers/authcontroller.js';

router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/resend-otp/:email', resendOtp);

export default router;