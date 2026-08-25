import api from './api';

/**
 * Submit general Contact Us enquiry
 * @param {Object} contactData - { name, email, phone, subject, message, website }
 * @returns {Promise<Object>} API Response
 */
export const submitContact = async (contactData) => {
  const response = await api.post('/contact', contactData);
  return response;
};

export default {
  submitContact,
};
