import Notification from '../models/Notification.js';
import ApiError from '../utils/ApiError.js';

/**
 * Dispatch a notification
 */
export const createNotification = async ({
  recipient,
  sender = null,
  type,
  title,
  message,
  relatedProperty = null,
}) => {
  try {
    if (!recipient) return null;
    const notification = await Notification.create({
      recipient,
      sender,
      type,
      title,
      message,
      relatedProperty,
    });
    return notification;
  } catch (err) {
    console.error('Error creating notification:', err);
    return null;
  }
};

/**
 * Get paginated notifications for an authenticated user
 */
export const getUserNotifications = async (userId, query = {}) => {
  const page = Math.max(1, parseInt(query.page || 1, 10));
  const limit = Math.min(100, Math.max(1, parseInt(query.limit || 20, 10)));
  const skip = (page - 1) * limit;

  const filter = { recipient: userId };
  if (query.isRead !== undefined && query.isRead !== 'ALL') {
    filter.isRead = query.isRead === 'true' || query.isRead === true;
  }

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(filter)
      .populate('sender', 'name email avatar role')
      .populate('relatedProperty', 'title slug thumbnail price priceUnit city')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Notification.countDocuments(filter),
    Notification.countDocuments({ recipient: userId, isRead: false }),
  ]);

  return {
    notifications,
    total,
    unreadCount,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
};

/**
 * Get count of unread notifications for a user
 */
export const getUnreadCount = async (userId) => {
  const unreadCount = await Notification.countDocuments({
    recipient: userId,
    isRead: false,
  });
  return { unreadCount };
};

/**
 * Mark a single notification as read
 */
export const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, recipient: userId },
    { $set: { isRead: true } },
    { new: true }
  );

  if (!notification) {
    throw new ApiError(404, 'Notification not found');
  }

  const unreadCount = await Notification.countDocuments({
    recipient: userId,
    isRead: false,
  });

  return { notification, unreadCount };
};

/**
 * Mark all notifications as read for a user
 */
export const markAllAsRead = async (userId) => {
  await Notification.updateMany(
    { recipient: userId, isRead: false },
    { $set: { isRead: true } }
  );

  return { message: 'All notifications marked as read', unreadCount: 0 };
};

/**
 * Delete a notification
 */
export const deleteNotification = async (notificationId, userId) => {
  const notification = await Notification.findOneAndDelete({
    _id: notificationId,
    recipient: userId,
  });

  if (!notification) {
    throw new ApiError(404, 'Notification not found');
  }

  return { message: 'Notification deleted' };
};
