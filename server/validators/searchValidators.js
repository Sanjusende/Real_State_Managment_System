import {
  PROPERTY_TYPES,
  LISTING_TYPES,
} from '../config/constants.js';

const ALLOWED_FURNISHING_STATUS = ['UNFURNISHED', 'SEMI_FURNISHED', 'FULLY_FURNISHED'];
const ALLOWED_CONSTRUCTION_STATUS = ['READY_TO_MOVE', 'UNDER_CONSTRUCTION'];

const ALLOWED_SORT_OPTIONS = [
  'newest',
  'oldest',
  'price-low-high',
  'price-high-low',
  'price-asc',
  'price-desc',
  'most-viewed',
  'popular',
  'featured',
];

/**
 * Validates query parameters for property search & filtering
 */
export const validatePropertyQuery = (query) => {
  const errors = [];

  // 1. Pagination Validation
  if (query.page !== undefined) {
    const page = Number(query.page);
    if (isNaN(page) || page < 1 || !Number.isInteger(page)) {
      errors.push({ field: 'page', message: 'Page must be an integer greater than or equal to 1' });
    }
  }

  if (query.limit !== undefined) {
    const limit = Number(query.limit);
    if (isNaN(limit) || limit < 1 || limit > 100 || !Number.isInteger(limit)) {
      errors.push({ field: 'limit', message: 'Limit must be an integer between 1 and 100' });
    }
  }

  // 2. Price Range Validation
  let minPrice, maxPrice;
  if (query.minPrice !== undefined) {
    minPrice = Number(query.minPrice);
    if (isNaN(minPrice) || minPrice < 0) {
      errors.push({ field: 'minPrice', message: 'minPrice must be a non-negative number' });
    }
  }

  if (query.maxPrice !== undefined) {
    maxPrice = Number(query.maxPrice);
    if (isNaN(maxPrice) || maxPrice < 0) {
      errors.push({ field: 'maxPrice', message: 'maxPrice must be a non-negative number' });
    }
  }

  if (minPrice !== undefined && maxPrice !== undefined && !isNaN(minPrice) && !isNaN(maxPrice) && minPrice > maxPrice) {
    errors.push({
      field: 'minPrice',
      message: 'minPrice cannot be greater than maxPrice',
    });
  }

  // 3. Area Range Validation
  let minArea, maxArea;
  if (query.minArea !== undefined) {
    minArea = Number(query.minArea);
    if (isNaN(minArea) || minArea < 0) {
      errors.push({ field: 'minArea', message: 'minArea must be a non-negative number' });
    }
  }

  if (query.maxArea !== undefined) {
    maxArea = Number(query.maxArea);
    if (isNaN(maxArea) || maxArea < 0) {
      errors.push({ field: 'maxArea', message: 'maxArea must be a non-negative number' });
    }
  }

  if (query.area !== undefined) {
    const area = Number(query.area);
    if (isNaN(area) || area <= 0) {
      errors.push({ field: 'area', message: 'area must be a positive number' });
    }
  }

  if (minArea !== undefined && maxArea !== undefined && !isNaN(minArea) && !isNaN(maxArea) && minArea > maxArea) {
    errors.push({
      field: 'minArea',
      message: 'minArea cannot be greater than maxArea',
    });
  }

  // 4. Bedrooms & Bathrooms Validation
  let minBedrooms, maxBedrooms;
  if (query.bedrooms !== undefined) {
    const bedrooms = Number(query.bedrooms);
    if (isNaN(bedrooms) || bedrooms < 0 || !Number.isInteger(bedrooms)) {
      errors.push({ field: 'bedrooms', message: 'bedrooms must be a non-negative integer' });
    }
  }

  if (query.minBedrooms !== undefined) {
    minBedrooms = Number(query.minBedrooms);
    if (isNaN(minBedrooms) || minBedrooms < 0 || !Number.isInteger(minBedrooms)) {
      errors.push({ field: 'minBedrooms', message: 'minBedrooms must be a non-negative integer' });
    }
  }

  if (query.maxBedrooms !== undefined) {
    maxBedrooms = Number(query.maxBedrooms);
    if (isNaN(maxBedrooms) || maxBedrooms < 0 || !Number.isInteger(maxBedrooms)) {
      errors.push({ field: 'maxBedrooms', message: 'maxBedrooms must be a non-negative integer' });
    }
  }

  if (minBedrooms !== undefined && maxBedrooms !== undefined && !isNaN(minBedrooms) && !isNaN(maxBedrooms) && minBedrooms > maxBedrooms) {
    errors.push({
      field: 'minBedrooms',
      message: 'minBedrooms cannot be greater than maxBedrooms',
    });
  }

  let minBathrooms, maxBathrooms;
  if (query.bathrooms !== undefined) {
    const bathrooms = Number(query.bathrooms);
    if (isNaN(bathrooms) || bathrooms < 0 || !Number.isInteger(bathrooms)) {
      errors.push({ field: 'bathrooms', message: 'bathrooms must be a non-negative integer' });
    }
  }

  if (query.minBathrooms !== undefined) {
    minBathrooms = Number(query.minBathrooms);
    if (isNaN(minBathrooms) || minBathrooms < 0 || !Number.isInteger(minBathrooms)) {
      errors.push({ field: 'minBathrooms', message: 'minBathrooms must be a non-negative integer' });
    }
  }

  if (query.maxBathrooms !== undefined) {
    maxBathrooms = Number(query.maxBathrooms);
    if (isNaN(maxBathrooms) || maxBathrooms < 0 || !Number.isInteger(maxBathrooms)) {
      errors.push({ field: 'maxBathrooms', message: 'maxBathrooms must be a non-negative integer' });
    }
  }

  if (minBathrooms !== undefined && maxBathrooms !== undefined && !isNaN(minBathrooms) && !isNaN(maxBathrooms) && minBathrooms > maxBathrooms) {
    errors.push({
      field: 'minBathrooms',
      message: 'minBathrooms cannot be greater than maxBathrooms',
    });
  }

  // 5. Property Type Validation (Single or Comma-separated)
  if (query.propertyType !== undefined) {
    const types = query.propertyType
      .split(',')
      .map((t) => t.trim().toUpperCase())
      .filter(Boolean);

    if (types.length === 0) {
      errors.push({ field: 'propertyType', message: 'propertyType cannot be empty' });
    } else {
      const invalidTypes = types.filter((t) => !PROPERTY_TYPES.includes(t));
      if (invalidTypes.length > 0) {
        errors.push({
          field: 'propertyType',
          message: `Invalid property type(s): ${invalidTypes.join(', ')}. Allowed: ${PROPERTY_TYPES.join(', ')}`,
        });
      }
    }
  }

  // 6. Listing Type Validation (Single or Comma-separated)
  if (query.listingType !== undefined) {
    const listingTypes = query.listingType
      .split(',')
      .map((l) => l.trim().toUpperCase())
      .filter(Boolean);

    if (listingTypes.length === 0) {
      errors.push({ field: 'listingType', message: 'listingType cannot be empty' });
    } else {
      const invalidTypes = listingTypes.filter((l) => !LISTING_TYPES.includes(l));
      if (invalidTypes.length > 0) {
        errors.push({
          field: 'listingType',
          message: `Invalid listing type(s): ${invalidTypes.join(', ')}. Allowed: ${LISTING_TYPES.join(', ')}`,
        });
      }
    }
  }

  // 7. Furnishing Status Validation
  if (query.furnishingStatus !== undefined) {
    const statuses = query.furnishingStatus
      .split(',')
      .map((s) => s.trim().toUpperCase().replace(/[-\s]/g, '_'))
      .filter(Boolean);

    if (statuses.length === 0) {
      errors.push({ field: 'furnishingStatus', message: 'furnishingStatus cannot be empty' });
    } else {
      const invalidStatuses = statuses.filter((s) => !ALLOWED_FURNISHING_STATUS.includes(s));
      if (invalidStatuses.length > 0) {
        errors.push({
          field: 'furnishingStatus',
          message: `Invalid furnishing status: ${invalidStatuses.join(', ')}. Allowed: ${ALLOWED_FURNISHING_STATUS.join(', ')}`,
        });
      }
    }
  }

  // 8. Construction Status Validation
  if (query.constructionStatus !== undefined) {
    const statuses = query.constructionStatus
      .split(',')
      .map((s) => s.trim().toUpperCase().replace(/[-\s]/g, '_'))
      .filter(Boolean);

    if (statuses.length === 0) {
      errors.push({ field: 'constructionStatus', message: 'constructionStatus cannot be empty' });
    } else {
      const invalidStatuses = statuses.filter((s) => !ALLOWED_CONSTRUCTION_STATUS.includes(s));
      if (invalidStatuses.length > 0) {
        errors.push({
          field: 'constructionStatus',
          message: `Invalid construction status: ${invalidStatuses.join(', ')}. Allowed: ${ALLOWED_CONSTRUCTION_STATUS.join(', ')}`,
        });
      }
    }
  }

  // 9. Sort Validation
  if (query.sort !== undefined && !ALLOWED_SORT_OPTIONS.includes(query.sort.toLowerCase().trim())) {
    errors.push({
      field: 'sort',
      message: `Invalid sort option '${query.sort}'. Allowed values: ${ALLOWED_SORT_OPTIONS.join(', ')}`,
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export default validatePropertyQuery;
