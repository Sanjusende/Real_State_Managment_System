import api from './api';

/**
 * Submit an enquiry for a property
 */
export const submitEnquiry = async (enquiryData) => {
  const response = await api.post('/enquiries', enquiryData);
  return response.data;
};

/**
 * Get user's submitted enquiries
 */
export const getMyEnquiries = async (params = {}) => {
  const response = await api.get('/enquiries/my-enquiries', { params });
  return response.data;
};

/**
 * Get enquiries received by agent/seller
 */
export const getReceivedEnquiries = async (params = {}) => {
  const response = await api.get('/enquiries/received', { params });
  return response.data;
};

/**
 * Update enquiry status and notes
 */
export const updateEnquiryStatus = async (id, statusData) => {
  const response = await api.patch(`/enquiries/${id}/status`, statusData);
  return response.data;
};
