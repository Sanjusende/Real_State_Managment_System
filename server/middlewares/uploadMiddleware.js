import multer from 'multer';
import ApiError from '../utils/ApiError.js';

// Configure in-memory storage buffer
const storage = multer.memoryStorage();

// Allowed MIME types for production image uploads
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new ApiError(
        400,
        `Invalid file type "${file.mimetype}". Only JPEG, JPG, PNG, and WebP images are permitted.`
      ),
      false
    );
  }
};

const limits = {
  fileSize: 5 * 1024 * 1024, // 5MB max per file
};

const upload = multer({
  storage,
  fileFilter,
  limits,
});

/**
 * Middleware for single avatar image upload
 */
export const uploadSingleImage = (req, res, next) => {
  const single = upload.single('image');
  single(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(new ApiError(400, 'File too large. Maximum allowed size is 5MB.'));
      }
      return next(new ApiError(400, `Upload error: ${err.message}`));
    }
    if (err) {
      return next(err);
    }
    next();
  });
};

/**
 * Middleware for multiple property images upload (up to 10 images)
 */
export const uploadMultipleImages = (req, res, next) => {
  const multiple = upload.array('images', 10);
  multiple(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(
          new ApiError(400, 'One or more files exceed the 5MB size limit.')
        );
      }
      if (err.code === 'LIMIT_UNEXPECTED_FILE' || err.code === 'LIMIT_FILE_COUNT') {
        return next(
          new ApiError(400, 'Too many files uploaded. Maximum 10 images per batch.')
        );
      }
      return next(new ApiError(400, `Upload error: ${err.message}`));
    }
    if (err) {
      return next(err);
    }
    next();
  });
};
