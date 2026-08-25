import rateLimit from 'express-rate-limit';
import { ENV } from '../config/env.js';

export const globalLimiter = rateLimit({
  windowMs: ENV.RATE_LIMIT.WINDOW_MS,
  max: ENV.RATE_LIMIT.MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message: 'Too many requests from this IP. Please try again after 15 minutes.',
  },
});

export const authLimiter = rateLimit({
  windowMs: ENV.RATE_LIMIT.WINDOW_MS,
  max: ENV.RATE_LIMIT.AUTH_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message: 'Too many authentication attempts. Please try again after 15 minutes for security.',
  },
});

export const contactLimiter = rateLimit({
  windowMs: ENV.RATE_LIMIT.WINDOW_MS,
  max: ENV.RATE_LIMIT.CONTACT_MAX_REQUESTS || 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message: 'Too many contact enquiries submitted from this IP. Please try again after 15 minutes.',
  },
});

export default globalLimiter;
