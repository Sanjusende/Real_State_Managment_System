import api from './api';

/**
 * Report API Client Service
 */

export const submitReport = async (data) => {
  return await api.post('/reports', data);
};

export const getMyReports = async (params = {}) => {
  return await api.get('/reports/my', { params });
};

export const updateReportStatus = async (id, data) => {
  return await api.patch(`/reports/${id}/status`, data);
};
