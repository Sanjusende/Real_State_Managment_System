import { Router } from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { authorizeRoles, checkOwnership, requireSelfOrAdmin } from '../middlewares/rbacMiddleware.js';
import { ROLES } from '../config/constants.js';

const router = Router();

// In-memory mock resource store for testing ownership verification
export const mockResourceStore = {
  properties: new Map([
    [
      'prop-101',
      {
        id: 'prop-101',
        title: 'Seaside Villa',
        owner: 'agent-1-id',
        status: 'AVAILABLE',
      },
    ],
    [
      'prop-102',
      {
        id: 'prop-102',
        title: 'Downtown Apartment',
        owner: 'seller-1-id',
        status: 'AVAILABLE',
      },
    ],
  ]),
};

// Helper mock fetcher
const fetchMockProperty = async (id) => {
  return mockResourceStore.properties.get(id) || null;
};

// 1. ADMIN Only Operations (User management, system configs, moderation)
router.get(
  '/admin-only',
  verifyToken,
  authorizeRoles(ROLES.ADMIN),
  asyncHandler(async (req, res) => {
    res.status(200).json(
      new ApiResponse(200, 'Admin operation authorized successfully', {
        adminUser: req.user.email,
        accessGranted: true,
      })
    );
  })
);

// 2. AGENT Analytics & Lead Insights (AGENT and ADMIN)
router.get(
  '/agent-analytics',
  verifyToken,
  authorizeRoles(ROLES.AGENT, ROLES.ADMIN),
  asyncHandler(async (req, res) => {
    res.status(200).json(
      new ApiResponse(200, 'Agent analytics retrieved successfully', {
        user: req.user.email,
        role: req.user.role,
        viewsCount: 1420,
        leadsCount: 18,
      })
    );
  })
);

// 3. Property Management Endpoint (SELLER, AGENT, ADMIN)
router.post(
  '/seller-property',
  verifyToken,
  authorizeRoles(ROLES.SELLER, ROLES.AGENT, ROLES.ADMIN),
  asyncHandler(async (req, res) => {
    res.status(201).json(
      new ApiResponse(201, 'Property creation authorized for listing manager', {
        createdBy: req.user.email,
        role: req.user.role,
      })
    );
  })
);

// 4. Buyer Enquiry & Review Operations (USER / Buyer, ADMIN)
router.post(
  '/user-enquiry',
  verifyToken,
  authorizeRoles(ROLES.USER, ROLES.ADMIN),
  asyncHandler(async (req, res) => {
    res.status(201).json(
      new ApiResponse(201, 'Buyer enquiry submitted successfully', {
        buyer: req.user.email,
        role: req.user.role,
      })
    );
  })
);

// 5. Resource Ownership Modification Guard (Owner or ADMIN only)
router.put(
  '/property/:propertyId',
  verifyToken,
  checkOwnership(fetchMockProperty, 'owner', 'propertyId'),
  asyncHandler(async (req, res) => {
    const property = req.resource;
    property.title = req.body.title || property.title;
    res.status(200).json(
      new ApiResponse(200, 'Property updated successfully by authorized owner / admin', {
        property,
        updatedBy: req.user.email,
        userRole: req.user.role,
      })
    );
  })
);

// 6. User Account Privacy Guard (Self or ADMIN only)
router.get(
  '/user/:id/private-data',
  verifyToken,
  requireSelfOrAdmin('id'),
  asyncHandler(async (req, res) => {
    res.status(200).json(
      new ApiResponse(200, 'User private data accessed by authorized self/admin', {
        targetId: req.params.id,
        viewer: req.user.email,
      })
    );
  })
);

export default router;
