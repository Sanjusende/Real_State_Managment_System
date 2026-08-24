import api from './api';

/**
 * Report API Client Service
 */

export const submitReport = async (data) => {
  const response = await api.post('/reports', data);
  return response.data;
};

export const getMyReports = async (params = {}) => {
  const response = await api.get('/reports/my', { params });
  return response.data;
};

export const updateReportStatus = async (id, data) => {
  const response = await api.patch(`/reports/${id}/status`, data);
  return response.data;
};
