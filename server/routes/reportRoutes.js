import { Router } from 'express';
import {
  createReport,
  getUserReports,
  updateReportStatus,
} from '../controllers/reportController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/rbacMiddleware.js';
import { ROLES } from '../config/constants.js';

const router = Router();

// All report endpoints require authentication
router.use(verifyToken);

// User endpoints
router.post('/', createReport);
router.get('/my', getUserReports);

// Admin-only review and status update endpoint
router.patch('/:id/status', authorizeRoles(ROLES.ADMIN), updateReportStatus);

export default router;
