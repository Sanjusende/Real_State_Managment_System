import { Router } from 'express';
import {
  getPropertyReviews,
  addOrUpdateReview,
  deleteReview,
} from '../controllers/reviewController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = Router();

// Publicly view property reviews
router.get('/property/:propertyId', getPropertyReviews);

// Protected review interactions (Requires logged in user)
router.post('/property/:propertyId', verifyToken, addOrUpdateReview);
router.delete('/:id', verifyToken, deleteReview);

export default router;
