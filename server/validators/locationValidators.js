export const validateCreateLocation = (data) => {
  const errors = [];

  if (!data.city || typeof data.city !== 'string' || data.city.trim().length === 0) {
    errors.push({ field: 'city', message: 'City is required' });
  }

  if (!data.state || typeof data.state !== 'string' || data.state.trim().length === 0) {
    errors.push({ field: 'state', message: 'State is required' });
  }

  if (data.isPopular !== undefined && typeof data.isPopular !== 'boolean') {
    errors.push({ field: 'isPopular', message: 'isPopular must be a boolean' });
  }

  if (data.isActive !== undefined && typeof data.isActive !== 'boolean') {
    errors.push({ field: 'isActive', message: 'isActive must be a boolean' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateUpdateLocation = (data) => {
  const errors = [];

  if (data.city !== undefined && (typeof data.city !== 'string' || data.city.trim().length === 0)) {
    errors.push({ field: 'city', message: 'City cannot be empty' });
  }

  if (data.state !== undefined && (typeof data.state !== 'string' || data.state.trim().length === 0)) {
    errors.push({ field: 'state', message: 'State cannot be empty' });
  }

  if (data.isPopular !== undefined && typeof data.isPopular !== 'boolean') {
    errors.push({ field: 'isPopular', message: 'isPopular must be a boolean' });
  }

  if (data.isActive !== undefined && typeof data.isActive !== 'boolean') {
    errors.push({ field: 'isActive', message: 'isActive must be a boolean' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
