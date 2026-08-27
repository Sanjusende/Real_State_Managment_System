import api from './api';

/**
 * Notification API Client Service
 */

export const getUserNotifications = async (params = {}) => {
  return await api.get('/notifications', { params });
};

export const getUnreadCount = async () => {
  return await api.get('/notifications/unread-count');
};

export const markAsRead = async (id) => {
  return await api.patch(`/notifications/${id}/read`);
};

export const markAllAsRead = async () => {
  return await api.patch('/notifications/mark-all-read');
};

export const deleteNotification = async (id) => {
  return await api.delete(`/notifications/${id}`);
};
