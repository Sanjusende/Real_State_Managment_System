import { Router } from 'express';
import {
  createEnquiry,
  getMyEnquiries,
  getReceivedEnquiries,
  updateEnquiryStatus,
} from '../controllers/enquiryController.js';
import { verifyToken, optionalAuth } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/rbacMiddleware.js';
import { ROLES } from '../config/constants.js';

const router = Router();

// Submit enquiry
router.post('/', optionalAuth, createEnquiry);

// User's submitted enquiries
router.get('/my-enquiries', verifyToken, getMyEnquiries);

// Agent/Seller received enquiries
router.get(
  '/received',
  verifyToken,
  authorizeRoles(ROLES.AGENT, ROLES.SELLER, ROLES.ADMIN),
  getReceivedEnquiries
);

// Update status/notes
router.patch(
  '/:id/status',
  verifyToken,
  authorizeRoles(ROLES.AGENT, ROLES.SELLER, ROLES.ADMIN),
  updateEnquiryStatus
);

export default router;
