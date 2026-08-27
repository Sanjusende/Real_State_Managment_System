import api from './api';

/**
 * Review API Client Service
 */

export const getPropertyReviews = async (propertyId, params = {}) => {
  return await api.get(`/reviews/property/${propertyId}`, { params });
};

export const submitReview = async (propertyId, data) => {
  return await api.post(`/reviews/property/${propertyId}`, data);
};

export const deleteReview = async (id) => {
  return await api.delete(`/reviews/${id}`);
};
