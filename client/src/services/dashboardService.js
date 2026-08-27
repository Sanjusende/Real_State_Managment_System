import api from './api';

/**
 * Fetch analytics data for Agent/Seller dashboard
 */
export const getDashboardAnalytics = async () => {
  return await api.get('/properties/analytics');
};

/**
 * Fetch properties created/managed by the logged in agent/seller
 */
export const getMyProperties = async (params = {}) => {
  return await api.get('/properties/my-properties', { params });
};

/**
 * Create a new property
 */
export const createProperty = async (propertyData) => {
  return await api.post('/properties', propertyData);
};

/**
 * Update an existing property
 */
export const updateProperty = async (id, propertyData) => {
  return await api.put(`/properties/${id}`, propertyData);
};

/**
 * Delete a property
 */
export const deleteProperty = async (id) => {
  return await api.delete(`/properties/${id}`);
};

/**
 * Update property listing status (AVAILABLE, SOLD, RENTED, INACTIVE)
 */
export const updatePropertyStatus = async (id, status) => {
  return await api.patch(`/properties/${id}/status`, { status });
};
