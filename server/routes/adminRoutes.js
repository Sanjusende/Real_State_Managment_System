import { Router } from 'express';
import {
  getAdminAnalytics,
  getUsers,
  getUserById,
  updateUser,
  toggleUserBlock,
  deleteUser,
  getAllProperties,
  getPendingProperties,
  approveProperty,
  rejectProperty,
  toggleFeatureProperty,
  deleteProperty,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation,
  getAllEnquiries,
  updateEnquiry,
  deleteEnquiry,
  getAllReviews,
  updateReviewStatus,
  deleteReview,
  getAllReports,
  updateReportStatus,
  deleteReport,
  getActivityLogs,
  getSettings,
  updateSettings,
} from '../controllers/adminController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/rbacMiddleware.js';
import { ROLES } from '../config/constants.js';

const router = Router();

// Strict Security Barrier: All routes require a valid JWT token and ADMIN role authorization
router.use(verifyToken, authorizeRoles(ROLES.ADMIN));

// Analytics Overview
router.get('/analytics', getAdminAnalytics);

// User Management
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.patch('/users/:id/block', toggleUserBlock);
router.delete('/users/:id', deleteUser);

// Property Management & Approvals
router.get('/properties', getAllProperties);
router.get('/properties/pending', getPendingProperties);
router.patch('/properties/:id/approve', approveProperty);
router.patch('/properties/:id/reject', rejectProperty);
router.patch('/properties/:id/feature', toggleFeatureProperty);
router.delete('/properties/:id', deleteProperty);

// Category Management
router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Location Management
router.get('/locations', getLocations);
router.post('/locations', createLocation);
router.put('/locations/:id', updateLocation);
router.delete('/locations/:id', deleteLocation);

// Enquiry Management
router.get('/enquiries', getAllEnquiries);
router.patch('/enquiries/:id', updateEnquiry);
router.delete('/enquiries/:id', deleteEnquiry);

// Review Management
router.get('/reviews', getAllReviews);
router.patch('/reviews/:id/status', updateReviewStatus);
router.delete('/reviews/:id', deleteReview);

// Report Management
router.get('/reports', getAllReports);
router.patch('/reports/:id/status', updateReportStatus);
router.delete('/reports/:id', deleteReport);

// Audit Activity Logs
router.get('/activity-logs', getActivityLogs);

// Platform Global Settings
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

export default router;
