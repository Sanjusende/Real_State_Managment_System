import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as notificationService from '../services/notificationService.js';

export const getUserNotifications = asyncHandler(async (req, res) => {
  const result = await notificationService.getUserNotifications(req.user.id, req.query);
  res.status(200).json(new ApiResponse(200, 'Notifications retrieved', result));
});

export const getUnreadCount = asyncHandler(async (req, res) => {
  const result = await notificationService.getUnreadCount(req.user.id);
  res.status(200).json(new ApiResponse(200, 'Unread notification count retrieved', result));
});

export const markAsRead = asyncHandler(async (req, res) => {
  const result = await notificationService.markAsRead(req.params.id, req.user.id);
  res.status(200).json(new ApiResponse(200, 'Notification marked as read', result));
});

export const markAllAsRead = asyncHandler(async (req, res) => {
  const result = await notificationService.markAllAsRead(req.user.id);
  res.status(200).json(new ApiResponse(200, 'All notifications marked as read', result));
});

export const deleteNotification = asyncHandler(async (req, res) => {
  const result = await notificationService.deleteNotification(req.params.id, req.user.id);
  res.status(200).json(new ApiResponse(200, 'Notification deleted', result));
});
