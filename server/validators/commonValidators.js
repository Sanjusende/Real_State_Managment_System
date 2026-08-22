import mongoose from 'mongoose';

/**
 * Validates pagination query parameters (page, limit)
 */
export const validatePagination = (query) => {
  const errors = [];
  const page = query.page !== undefined ? Number(query.page) : 1;
  const limit = query.limit !== undefined ? Number(query.limit) : 10;

  if (isNaN(page) || page < 1) {
    errors.push({ field: 'page', message: 'Page must be a positive integer greater than or equal to 1' });
  }

  if (isNaN(limit) || limit < 1 || limit > 100) {
    errors.push({ field: 'limit', message: 'Limit must be a positive integer between 1 and 100' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validates a standard 24-character hex MongoDB ObjectId in params
 */
export const validateObjectId = (params, paramName = 'id') => {
  const errors = [];
  const id = params[paramName];

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    errors.push({ field: paramName, message: `Invalid ObjectId format for parameter '${paramName}'` });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validates a generic object against required fields
 */
export const validateRequiredFields = (data, requiredFields = []) => {
  const errors = [];

  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      errors.push({ field, message: `Field '${field}' is required and cannot be empty` });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
