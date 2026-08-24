import { Router } from 'express';
import {
  uploadPropertyImages,
  uploadAvatar,
  deletePropertyImage,
} from '../controllers/uploadController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import {
  uploadSingleImage,
  uploadMultipleImages,
} from '../middlewares/uploadMiddleware.js';

const router = Router();

// All upload operations require an authenticated user
router.use(verifyToken);

// Property multi-image batch upload
router.post('/property', uploadMultipleImages, uploadPropertyImages);

// User profile avatar upload
router.post('/avatar', uploadSingleImage, uploadAvatar);

// Delete image from property and Cloudinary
router.delete('/property/:propertyId', deletePropertyImage);

export default router;
