import { Router } from 'express';
import { createContactEnquiry } from '../controllers/contactController.js';
import { validateContact } from '../validators/contactValidator.js';
import { validate } from '../middlewares/validationMiddleware.js';
import { contactLimiter } from '../middlewares/rateLimiterMiddleware.js';

const router = Router();

// Public Contact Form submission endpoint
router.post('/', contactLimiter, validate(validateContact, 'body'), createContactEnquiry);

export default router;
