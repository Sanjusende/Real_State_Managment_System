import { Router } from 'express';
import {
  getLocations,
  getPopular,
  getLocation,
  getLocationSlug,
  addLocation,
  editLocation,
  removeLocation,
} from '../controllers/locationController.js';

const router = Router();

router.route('/')
  .get(getLocations)
  .post(addLocation);

router.route('/popular')
  .get(getPopular);

router.route('/slug/:slug')
  .get(getLocationSlug);

router.route('/:id')
  .get(getLocation)
  .put(editLocation)
  .delete(removeLocation);

export default router;
