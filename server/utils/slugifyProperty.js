import slugify from 'slugify';
import Property from '../models/Property.js';

/**
 * Generates a unique SEO slug for properties, handling collisions gracefully.
 * 
 * @param {string} title - Property title
 * @param {string} existingId - Optional existing property ID to ignore during collision checks
 * @returns {Promise<string>} Unique slug
 */
export const generateUniquePropertySlug = async (title, existingId = null) => {
  const baseSlug = slugify(title, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  }) || 'property';

  let slug = baseSlug;
  let counter = 1;
  let isUnique = false;

  while (!isUnique) {
    const query = { slug };
    if (existingId) {
      query._id = { $ne: existingId };
    }

    const existing = await Property.findOne(query).select('_id');
    if (!existing) {
      isUnique = true;
    } else {
      slug = `${baseSlug}-${counter}`;
      counter += 1;
    }
  }

  return slug;
};

export default generateUniquePropertySlug;
