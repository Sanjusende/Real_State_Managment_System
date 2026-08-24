import { Router } from 'express';
import authRoutes from './authRoutes.js';
import propertyRoutes from './propertyRoutes.js';
import agentRoutes from './agentRoutes.js';
import enquiryRoutes from './enquiryRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import locationRoutes from './locationRoutes.js';
import adminRoutes from './adminRoutes.js';
import testRoutes from './testRoutes.js';
import rbacTestRoutes from './rbacTestRoutes.js';

const router = Router();

// Administrative Core Module Routes (Strict RBAC Protected)
router.use('/admin', adminRoutes);

// Authentication Module Routes
router.use('/auth', authRoutes);

// Property Management Module Routes
router.use('/properties', propertyRoutes);

// Enquiry Module Routes
router.use('/enquiries', enquiryRoutes);

// Agent Directory Module Routes
router.use('/agents', agentRoutes);

// Taxonomy Module Routes
router.use('/taxonomy/categories', categoryRoutes);
router.use('/taxonomy/locations', locationRoutes);

// RBAC & Ownership Security Verification Routes
router.use('/rbac-test', rbacTestRoutes);

// Foundation Diagnostic & Test Routes
router.use('/test', testRoutes);

export default router;
