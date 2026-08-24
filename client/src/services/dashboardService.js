import api from './api';

/**
 * Fetch analytics data for Agent/Seller dashboard
 */
export const getDashboardAnalytics = async () => {
  const response = await api.get('/properties/analytics');
  return response.data;
};

/**
 * Fetch properties created/managed by the logged in agent/seller
 */
export const getMyProperties = async (params = {}) => {
  const response = await api.get('/properties/my-properties', { params });
  return response.data;
};

/**
 * Create a new property
 */
export const createProperty = async (propertyData) => {
  const response = await api.post('/properties', propertyData);
  return response.data;
};

/**
 * Update an existing property
 */
export const updateProperty = async (id, propertyData) => {
  const response = await api.put(`/properties/${id}`, propertyData);
  return response.data;
};

/**
 * Delete a property
 */
export const deleteProperty = async (id) => {
  const response = await api.delete(`/properties/${id}`);
  return response.data;
};

/**
 * Update property listing status (AVAILABLE, SOLD, RENTED, INACTIVE)
 */
export const updatePropertyStatus = async (id, status) => {
  const response = await api.patch(`/properties/${id}/status`, { status });
  return response.data;
};
