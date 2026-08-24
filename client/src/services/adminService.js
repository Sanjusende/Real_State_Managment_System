import api from './api';

/**
 * Admin API Client Service
 */

// 1. Dashboard Analytics
export const getAdminAnalytics = async () => {
  const response = await api.get('/admin/analytics');
  return response.data;
};

// 2. User Management
export const getAdminUsers = async (params = {}) => {
  const response = await api.get('/admin/users', { params });
  return response.data;
};

export const getAdminUserById = async (id) => {
  const response = await api.get(`/admin/users/${id}`);
  return response.data;
};

export const updateAdminUser = async (id, data) => {
  const response = await api.put(`/admin/users/${id}`, data);
  return response.data;
};

export const toggleUserBlock = async (id) => {
  const response = await api.patch(`/admin/users/${id}/block`);
  return response.data;
};

export const deleteAdminUser = async (id) => {
  const response = await api.delete(`/admin/users/${id}`);
  return response.data;
};

// 3. Property Management & Approvals
export const getAdminProperties = async (params = {}) => {
  const response = await api.get('/admin/properties', { params });
  return response.data;
};

export const getPendingProperties = async (params = {}) => {
  const response = await api.get('/admin/properties/pending', { params });
  return response.data;
};

export const approveProperty = async (id) => {
  const response = await api.patch(`/admin/properties/${id}/approve`);
  return response.data;
};

export const rejectProperty = async (id, reason) => {
  const response = await api.patch(`/admin/properties/${id}/reject`, { reason });
  return response.data;
};

export const toggleFeatureProperty = async (id) => {
  const response = await api.patch(`/admin/properties/${id}/feature`);
  return response.data;
};

export const deleteAdminProperty = async (id) => {
  const response = await api.delete(`/admin/properties/${id}`);
  return response.data;
};

// 4. Category Management
export const getAdminCategories = async () => {
  const response = await api.get('/admin/categories');
  return response.data;
};

export const createAdminCategory = async (data) => {
  const response = await api.post('/admin/categories', data);
  return response.data;
};

export const updateAdminCategory = async (id, data) => {
  const response = await api.put(`/admin/categories/${id}`, data);
  return response.data;
};

export const deleteAdminCategory = async (id) => {
  const response = await api.delete(`/admin/categories/${id}`);
  return response.data;
};

// 5. Location Management
export const getAdminLocations = async () => {
  const response = await api.get('/admin/locations');
  return response.data;
};

export const createAdminLocation = async (data) => {
  const response = await api.post('/admin/locations', data);
  return response.data;
};

export const updateAdminLocation = async (id, data) => {
  const response = await api.put(`/admin/locations/${id}`, data);
  return response.data;
};

export const deleteAdminLocation = async (id) => {
  const response = await api.delete(`/admin/locations/${id}`);
  return response.data;
};

// 6. Enquiry Management
export const getAdminEnquiries = async (params = {}) => {
  const response = await api.get('/admin/enquiries', { params });
  return response.data;
};

export const updateAdminEnquiry = async (id, data) => {
  const response = await api.patch(`/admin/enquiries/${id}`, data);
  return response.data;
};

export const deleteAdminEnquiry = async (id) => {
  const response = await api.delete(`/admin/enquiries/${id}`);
  return response.data;
};

// 7. Review Moderation
export const getAdminReviews = async (params = {}) => {
  const response = await api.get('/admin/reviews', { params });
  return response.data;
};

export const updateAdminReviewStatus = async (id, status) => {
  const response = await api.patch(`/admin/reviews/${id}/status`, { status });
  return response.data;
};

export const deleteAdminReview = async (id) => {
  const response = await api.delete(`/admin/reviews/${id}`);
  return response.data;
};

// 8. Report Management
export const getAdminReports = async (params = {}) => {
  const response = await api.get('/admin/reports', { params });
  return response.data;
};

export const updateAdminReportStatus = async (id, data) => {
  const response = await api.patch(`/admin/reports/${id}/status`, data);
  return response.data;
};

export const deleteAdminReport = async (id) => {
  const response = await api.delete(`/admin/reports/${id}`);
  return response.data;
};

// 9. Activity Logs
export const getAdminActivityLogs = async (params = {}) => {
  const response = await api.get('/admin/activity-logs', { params });
  return response.data;
};

// 10. Platform Settings
export const getAdminSettings = async () => {
  const response = await api.get('/admin/settings');
  return response.data;
};

export const updateAdminSettings = async (data) => {
  const response = await api.put('/admin/settings', data);
  return response.data;
};
