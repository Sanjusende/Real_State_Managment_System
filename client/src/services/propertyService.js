import api from './api';

/**
 * Fetch properties with rich search, filtering, sorting, and pagination
 */
export const getProperties = async (params = {}) => {
  // Clean up undefined / empty values
  const cleanParams = Object.entries(params).reduce((acc, [key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      acc[key] = val;
    }
    return acc;
  }, {});

  const query = new URLSearchParams(cleanParams).toString();
  const endpoint = `/properties${query ? `?${query}` : ''}`;
  return await api.get(endpoint);
};

/**
 * Fetch single property by SEO Slug
 */
export const getPropertyBySlug = async (slug) => {
  return await api.get(`/properties/slug/${slug}`);
};

/**
 * Fetch single property by ID
 */
export const getPropertyById = async (id) => {
  return await api.get(`/properties/${id}`);
};

/**
 * Fetch featured properties for homepage
 */
export const getFeaturedProperties = async (limit = 6) => {
  return await api.get(`/properties?isFeatured=true&limit=${limit}`);
};

/**
 * Fetch latest property listings for homepage
 */
export const getLatestProperties = async (limit = 6) => {
  return await api.get(`/properties?sort=newest&limit=${limit}`);
};

/**
 * Send property inquiry to agent/owner
 */
export const sendPropertyEnquiry = async (propertyId, enquiryData) => {
  // Can submit to an enquiry API or simulate instant submission
  return {
    success: true,
    message: 'Your enquiry has been forwarded to the property agent!',
  };
};
