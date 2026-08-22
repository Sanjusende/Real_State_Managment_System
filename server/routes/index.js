import { Router } from 'express';
import categoryRoutes from './categoryRoutes.js';
import locationRoutes from './locationRoutes.js';
import testRoutes from './testRoutes.js';

const router = Router();

// Taxonomy Module Routes
router.use('/taxonomy/categories', categoryRoutes);
router.use('/taxonomy/locations', locationRoutes);

// Foundation Diagnostic & Test Routes
router.use('/test', testRoutes);

export default router;
