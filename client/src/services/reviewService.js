import api from './api';

/**
 * Review API Client Service
 */

export const getPropertyReviews = async (propertyId, params = {}) => {
  const response = await api.get(`/reviews/property/${propertyId}`, { params });
  return response.data;
};

export const submitReview = async (propertyId, data) => {
  const response = await api.post(`/reviews/property/${propertyId}`, data);
  return response.data;
};

export const deleteReview = async (id) => {
  const response = await api.delete(`/reviews/${id}`);
  return response.data;
};
