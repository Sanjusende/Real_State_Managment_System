import { Router } from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import validate from '../middlewares/validationMiddleware.js';
import { validateRequiredFields, validatePagination } from '../validators/commonValidators.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/rbacMiddleware.js';

const router = Router();

// Test error handling middleware
router.get(
  '/error-handling',
  asyncHandler(async (req, res) => {
    const errorType = req.query.type || 'operational';
    if (errorType === 'operational') {
      throw new ApiError(400, 'Test operational bad request error', [
        { field: 'testField', message: 'Test error message' },
      ]);
    } else if (errorType === 'unhandled') {
      throw new Error('Test unhandled runtime exception');
    }
    res.status(200).json(new ApiResponse(200, 'No error triggered'));
  })
);

// Test validation middleware
router.post(
  '/validation-test',
  validate((data) => validateRequiredFields(data, ['title', 'category']), 'body'),
  asyncHandler(async (req, res) => {
    res.status(200).json(new ApiResponse(200, 'Validation passed successfully', req.body));
  })
);

// Test query pagination validation
router.get(
  '/pagination-test',
  validate((query) => validatePagination(query), 'query'),
  asyncHandler(async (req, res) => {
    res.status(200).json(new ApiResponse(200, 'Pagination validated successfully', req.query));
  })
);

// Test auth guard middleware
router.get(
  '/auth-guard',
  verifyToken,
  asyncHandler(async (req, res) => {
    res.status(200).json(new ApiResponse(200, 'Authenticated route accessed successfully', { user: req.user }));
  })
);

// Test RBAC guard middleware
router.get(
  '/rbac-guard',
  verifyToken,
  authorizeRoles('ADMIN'),
  asyncHandler(async (req, res) => {
    res.status(200).json(new ApiResponse(200, 'Admin-only route accessed successfully', { user: req.user }));
  })
);

export default router;
