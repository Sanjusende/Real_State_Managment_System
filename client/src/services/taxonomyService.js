import api from './api';

export const getCategories = async (params = {}) => {
  return await api.get('/taxonomy/categories', { params });
};

export const getCategoryBySlug = async (slug) => {
  return await api.get(`/taxonomy/categories/slug/${slug}`);
};

export const getLocations = async (params = {}) => {
  return await api.get('/taxonomy/locations', { params });
};

export const getPopularLocations = async (limit = 8) => {
  return await api.get('/taxonomy/locations/popular', { params: { limit } });
};

export const getLocationBySlug = async (slug) => {
  return await api.get(`/taxonomy/locations/slug/${slug}`);
};
