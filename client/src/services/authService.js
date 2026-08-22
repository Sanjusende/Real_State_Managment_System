import api from './api';

export const register = async (userData) => {
  return await api.post('/auth/register', userData);
};

export const login = async (credentials) => {
  return await api.post('/auth/login', credentials);
};

export const logout = async () => {
  return await api.post('/auth/logout');
};

export const getMe = async () => {
  return await api.get('/auth/me');
};

export const updateProfile = async (profileData) => {
  return await api.put('/auth/profile', profileData);
};

export const changePassword = async (passwords) => {
  return await api.put('/auth/change-password', passwords);
};

export const forgotPassword = async (emailData) => {
  return await api.post('/auth/forgot-password', emailData);
};

export const resetPassword = async (resetData) => {
  return await api.post('/auth/reset-password', resetData);
};

export const refreshToken = async (refreshTokenValue) => {
  return await api.post('/auth/refresh-token', { refreshToken: refreshTokenValue });
};
