import api from './api';

/**
 * Submit an enquiry for a property
 */
export const submitEnquiry = async (enquiryData) => {
  return await api.post('/enquiries', enquiryData);
};

/**
 * Get user's submitted enquiries
 */
export const getMyEnquiries = async (params = {}) => {
  return await api.get('/enquiries/my-enquiries', { params });
};

/**
 * Get enquiries received by agent/seller
 */
export const getReceivedEnquiries = async (params = {}) => {
  return await api.get('/enquiries/received', { params });
};

/**
 * Update enquiry status and notes
 */
export const updateEnquiryStatus = async (id, statusData) => {
  return await api.patch(`/enquiries/${id}/status`, statusData);
};
