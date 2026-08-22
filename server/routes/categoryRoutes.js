import { Router } from 'express';
import {
  getCategories,
  getCategory,
  getCategorySlug,
  addCategory,
  editCategory,
  removeCategory,
} from '../controllers/categoryController.js';

const router = Router();

router.route('/')
  .get(getCategories)
  .post(addCategory);

router.route('/slug/:slug')
  .get(getCategorySlug);

router.route('/:id')
  .get(getCategory)
  .put(editCategory)
  .delete(removeCategory);

export default router;
