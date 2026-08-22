import { Router } from 'express';
import authRoutes from './authRoutes.js';
import propertyRoutes from './propertyRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import locationRoutes from './locationRoutes.js';
import testRoutes from './testRoutes.js';
import rbacTestRoutes from './rbacTestRoutes.js';

const router = Router();

// Authentication Module Routes
router.use('/auth', authRoutes);

// Property Management Module Routes
router.use('/properties', propertyRoutes);

// Taxonomy Module Routes
router.use('/taxonomy/categories', categoryRoutes);
router.use('/taxonomy/locations', locationRoutes);

// RBAC & Ownership Security Verification Routes
router.use('/rbac-test', rbacTestRoutes);

// Foundation Diagnostic & Test Routes
router.use('/test', testRoutes);

export default router;
