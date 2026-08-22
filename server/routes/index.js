import { Router } from 'express';
import categoryRoutes from './categoryRoutes.js';
import locationRoutes from './locationRoutes.js';

const router = Router();

// Taxonomy Module Routes
router.use('/taxonomy/categories', categoryRoutes);
router.use('/taxonomy/locations', locationRoutes);

export default router;
