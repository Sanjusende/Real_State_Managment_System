import { Router } from 'express';
import {
  createProperty,
  getProperties,
  getProperty,
  getPropertyBySlug,
  getMyProperties,
  updateProperty,
  deleteProperty,
  updateStatus,
  updateApproval,
  toggleFeatured,
} from '../controllers/propertyController.js';
import { verifyToken, optionalAuth } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/rbacMiddleware.js';
import validate from '../middlewares/validationMiddleware.js';
import {
  validateCreateProperty,
  validateUpdateProperty,
  validatePropertyStatus,
  validatePropertyApproval,
  validatePropertyFeatured,
} from '../validators/propertyValidators.js';
import { validatePropertyQuery } from '../validators/searchValidators.js';
import { ROLES } from '../config/constants.js';

const router = Router();

// Public / General Catalog Queries with Query Validation
router.get('/', optionalAuth, validate(validatePropertyQuery, 'query'), getProperties);
router.get('/slug/:slug', optionalAuth, getPropertyBySlug);

// Authenticated Agent / Seller My-Properties
router.get('/my-properties', verifyToken, authorizeRoles(ROLES.AGENT, ROLES.SELLER, ROLES.ADMIN), getMyProperties);

// Property Creation (AGENT, SELLER, ADMIN)
router.post(
  '/',
  verifyToken,
  authorizeRoles(ROLES.AGENT, ROLES.SELLER, ROLES.ADMIN),
  validate(validateCreateProperty, 'body'),
  createProperty
);

// Specific Property Operations
router.get('/:id', optionalAuth, getProperty);

router.put(
  '/:id',
  verifyToken,
  authorizeRoles(ROLES.AGENT, ROLES.SELLER, ROLES.ADMIN),
  validate(validateUpdateProperty, 'body'),
  updateProperty
);

router.delete(
  '/:id',
  verifyToken,
  authorizeRoles(ROLES.AGENT, ROLES.SELLER, ROLES.ADMIN),
  deleteProperty
);

router.patch(
  '/:id/status',
  verifyToken,
  authorizeRoles(ROLES.AGENT, ROLES.SELLER, ROLES.ADMIN),
  validate(validatePropertyStatus, 'body'),
  updateStatus
);

// Admin-Only Moderation Routes
router.patch(
  '/:id/approval',
  verifyToken,
  authorizeRoles(ROLES.ADMIN),
  validate(validatePropertyApproval, 'body'),
  updateApproval
);

router.patch(
  '/:id/featured',
  verifyToken,
  authorizeRoles(ROLES.ADMIN),
  validate(validatePropertyFeatured, 'body'),
  toggleFeatured
);

export default router;
