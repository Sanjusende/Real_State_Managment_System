import {
  PROPERTY_TYPES,
  LISTING_TYPES,
  PROPERTY_STATUS,
  APPROVAL_STATUS,
} from '../config/constants.js';

export const validateCreateProperty = (data) => {
  const errors = [];

  if (!data.title || typeof data.title !== 'string' || data.title.trim().length < 3) {
    errors.push({ field: 'title', message: 'Property title is required (minimum 3 characters)' });
  }

  if (!data.description || typeof data.description !== 'string' || data.description.trim().length < 10) {
    errors.push({ field: 'description', message: 'Description is required (minimum 10 characters)' });
  }

  if (!data.propertyType || !PROPERTY_TYPES.includes(data.propertyType)) {
    errors.push({
      field: 'propertyType',
      message: `Invalid property type. Allowed values: ${PROPERTY_TYPES.join(', ')}`,
    });
  }

  if (data.listingType && !LISTING_TYPES.includes(data.listingType)) {
    errors.push({
      field: 'listingType',
      message: `Invalid listing type. Allowed values: ${LISTING_TYPES.join(', ')}`,
    });
  }

  const price = Number(data.price);
  if (isNaN(price) || price <= 0) {
    errors.push({ field: 'price', message: 'Price must be a valid positive number' });
  }

  const area = Number(data.area);
  if (isNaN(area) || area <= 0) {
    errors.push({ field: 'area', message: 'Property area must be a valid positive number' });
  }

  if (!data.address || typeof data.address !== 'string' || data.address.trim().length === 0) {
    errors.push({ field: 'address', message: 'Street address is required' });
  }

  if (!data.city || typeof data.city !== 'string' || data.city.trim().length === 0) {
    errors.push({ field: 'city', message: 'City is required' });
  }

  if (!data.state || typeof data.state !== 'string' || data.state.trim().length === 0) {
    errors.push({ field: 'state', message: 'State is required' });
  }

  if (!data.pincode || typeof data.pincode !== 'string' || data.pincode.trim().length === 0) {
    errors.push({ field: 'pincode', message: 'Pincode is required' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateUpdateProperty = (data) => {
  const errors = [];

  if (data.title !== undefined && (typeof data.title !== 'string' || data.title.trim().length < 3)) {
    errors.push({ field: 'title', message: 'Title must be at least 3 characters long' });
  }

  if (data.propertyType !== undefined && !PROPERTY_TYPES.includes(data.propertyType)) {
    errors.push({
      field: 'propertyType',
      message: `Invalid property type. Allowed values: ${PROPERTY_TYPES.join(', ')}`,
    });
  }

  if (data.listingType !== undefined && !LISTING_TYPES.includes(data.listingType)) {
    errors.push({
      field: 'listingType',
      message: `Invalid listing type. Allowed values: ${LISTING_TYPES.join(', ')}`,
    });
  }

  if (data.price !== undefined && (isNaN(Number(data.price)) || Number(data.price) <= 0)) {
    errors.push({ field: 'price', message: 'Price must be a positive number' });
  }

  if (data.area !== undefined && (isNaN(Number(data.area)) || Number(data.area) <= 0)) {
    errors.push({ field: 'area', message: 'Area must be a positive number' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validatePropertyStatus = (data) => {
  const errors = [];
  if (!data.status || !PROPERTY_STATUS.includes(data.status)) {
    errors.push({
      field: 'status',
      message: `Invalid property status. Allowed values: ${PROPERTY_STATUS.join(', ')}`,
    });
  }
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validatePropertyApproval = (data) => {
  const errors = [];
  if (!data.approvalStatus || !APPROVAL_STATUS.includes(data.approvalStatus)) {
    errors.push({
      field: 'approvalStatus',
      message: `Invalid approval status. Allowed values: ${APPROVAL_STATUS.join(', ')}`,
    });
  }
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validatePropertyFeatured = (data) => {
  const errors = [];
  if (data.isFeatured === undefined || typeof data.isFeatured !== 'boolean') {
    errors.push({
      field: 'isFeatured',
      message: 'isFeatured must be a boolean (true or false)',
    });
  }
  return {
    isValid: errors.length === 0,
    errors,
  };
};
