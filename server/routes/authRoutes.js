import { Router } from 'express';
import {
  register,
  login,
  logout,
  refreshToken,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import validate from '../middlewares/validationMiddleware.js';
import { authLimiter } from '../middlewares/rateLimiterMiddleware.js';
import {
  validateRegister,
  validateLogin,
  validateChangePassword,
  validateForgotPassword,
  validateResetPassword,
  validateUpdateProfile,
} from '../validators/authValidators.js';

const router = Router();

// Public Authentication Endpoints (Rate Limited)
router.post('/register', authLimiter, validate(validateRegister, 'body'), register);
router.post('/login', authLimiter, validate(validateLogin, 'body'), login);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', authLimiter, validate(validateForgotPassword, 'body'), forgotPassword);
router.post('/reset-password', validate(validateResetPassword, 'body'), resetPassword);

// Authenticated Endpoints (Protected by verifyToken)
router.get('/me', verifyToken, getMe);
router.post('/logout', verifyToken, logout);
router.put('/profile', verifyToken, validate(validateUpdateProfile, 'body'), updateProfile);
router.put('/change-password', verifyToken, validate(validateChangePassword, 'body'), changePassword);

export default router;
