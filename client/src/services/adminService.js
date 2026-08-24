import api from './api';

/**
 * Admin API Client Service
 */

// 1. Dashboard Analytics
export const getAdminAnalytics = async () => {
  return await api.get('/admin/analytics');
};

// 2. User Management
export const getAdminUsers = async (params = {}) => {
  return await api.get('/admin/users', { params });
};

export const getAdminUserById = async (id) => {
  return await api.get(`/admin/users/${id}`);
};

export const updateAdminUser = async (id, data) => {
  return await api.put(`/admin/users/${id}`, data);
};

export const toggleUserBlock = async (id) => {
  return await api.patch(`/admin/users/${id}/block`);
};

export const deleteAdminUser = async (id) => {
  return await api.delete(`/admin/users/${id}`);
};

// 3. Property Management & Approvals
export const getAdminProperties = async (params = {}) => {
  return await api.get('/admin/properties', { params });
};

export const getPendingProperties = async (params = {}) => {
  return await api.get('/admin/properties/pending', { params });
};

export const approveProperty = async (id) => {
  return await api.patch(`/admin/properties/${id}/approve`);
};

export const rejectProperty = async (id, reason) => {
  return await api.patch(`/admin/properties/${id}/reject`, { reason });
};

export const toggleFeatureProperty = async (id) => {
  return await api.patch(`/admin/properties/${id}/feature`);
};

export const deleteAdminProperty = async (id) => {
  return await api.delete(`/admin/properties/${id}`);
};

// 4. Category Management
export const getAdminCategories = async () => {
  return await api.get('/admin/categories');
};

export const createAdminCategory = async (data) => {
  return await api.post('/admin/categories', data);
};

export const updateAdminCategory = async (id, data) => {
  return await api.put(`/admin/categories/${id}`, data);
};

export const deleteAdminCategory = async (id) => {
  return await api.delete(`/admin/categories/${id}`);
};

// 5. Location Management
export const getAdminLocations = async () => {
  return await api.get('/admin/locations');
};

export const createAdminLocation = async (data) => {
  return await api.post('/admin/locations', data);
};

export const updateAdminLocation = async (id, data) => {
  return await api.put(`/admin/locations/${id}`, data);
};

export const deleteAdminLocation = async (id) => {
  return await api.delete(`/admin/locations/${id}`);
};

// 6. Enquiry Management
export const getAdminEnquiries = async (params = {}) => {
  return await api.get('/admin/enquiries', { params });
};

export const updateAdminEnquiry = async (id, data) => {
  return await api.patch(`/admin/enquiries/${id}`, data);
};

export const deleteAdminEnquiry = async (id) => {
  return await api.delete(`/admin/enquiries/${id}`);
};

// 7. Review Moderation
export const getAdminReviews = async (params = {}) => {
  return await api.get('/admin/reviews', { params });
};

export const updateAdminReviewStatus = async (id, status) => {
  return await api.patch(`/admin/reviews/${id}/status`, { status });
};

export const deleteAdminReview = async (id) => {
  return await api.delete(`/admin/reviews/${id}`);
};

// 8. Report Management
export const getAdminReports = async (params = {}) => {
  return await api.get('/admin/reports', { params });
};

export const updateAdminReportStatus = async (id, data) => {
  return await api.patch(`/admin/reports/${id}/status`, data);
};

export const deleteAdminReport = async (id) => {
  return await api.delete(`/admin/reports/${id}`);
};

// 9. Activity Logs
export const getAdminActivityLogs = async (params = {}) => {
  return await api.get('/admin/activity-logs', { params });
};

// 10. Platform Settings
export const getAdminSettings = async () => {
  return await api.get('/admin/settings');
};

export const updateAdminSettings = async (data) => {
  return await api.put('/admin/settings', data);
};
