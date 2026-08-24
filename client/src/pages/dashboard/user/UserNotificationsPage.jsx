import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Mail,
  MessageSquare,
  ShieldAlert,
  Star,
  Tag,
  Trash2,
  Check,
  ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import Button from '../../../components/common/Button';
import {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from '../../../services/notificationService';
import { formatDate } from '../../../utils/formatters';
import clsx from 'clsx';

const NOTIFICATION_ICONS = {
  PROPERTY_APPROVED: { icon: CheckCircle2, bg: 'bg-emerald-100 text-emerald-700' },
  PROPERTY_REJECTED: { icon: AlertTriangle, bg: 'bg-red-100 text-red-700' },
  NEW_ENQUIRY: { icon: Mail, bg: 'bg-blue-100 text-blue-700' },
  ENQUIRY_RESPONSE: { icon: MessageSquare, bg: 'bg-purple-100 text-purple-700' },
  ACCOUNT_BLOCKED: { icon: ShieldAlert, bg: 'bg-red-100 text-red-700' },
  REVIEW_ADDED: { icon: Star, bg: 'bg-amber-100 text-amber-700' },
  PROPERTY_SOLD: { icon: Tag, bg: 'bg-emerald-100 text-emerald-700' },
  SYSTEM_ANNOUNCEMENT: { icon: Bell, bg: 'bg-indigo-100 text-indigo-700' },
};

export default function UserNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'UNREAD'
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (filterType === 'UNREAD') {
        params.isRead = false;
      }
      const res = await getUserNotifications(params);
      if (res?.data) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [page, filterType]);

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (err) {
      toast.error('Failed to mark all as read');
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      toast.success('Notification removed');
    } catch (err) {
      toast.error('Failed to delete notification');
    }
  };

  return (
    <DashboardLayout
      title="Notifications & Activity Alerts"
      subtitle="Real-time updates on approvals, leads, reviews, and transaction activity."
    >
      {/* Filter and Global Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setFilterType('ALL');
              setPage(1);
            }}
            className={clsx(
              'px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer',
              filterType === 'ALL'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            )}
          >
            All Updates
          </button>
          <button
            type="button"
            onClick={() => {
              setFilterType('UNREAD');
              setPage(1);
            }}
            className={clsx(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer',
              filterType === 'UNREAD'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            )}
          >
            <span>Unread</span>
            {unreadCount > 0 && (
              <span
                className={clsx(
                  'px-1.5 py-0.5 rounded-full text-[10px] font-extrabold',
                  filterType === 'UNREAD' ? 'bg-white text-emerald-800' : 'bg-emerald-600 text-white'
                )}
              >
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {notifications.length > 0 && unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {/* Notifications Feed */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-white rounded-2xl border border-slate-100 animate-pulse" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Bell className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">No Notifications</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {filterType === 'UNREAD'
              ? 'You have read all your latest notifications!'
              : 'You are all caught up with your property and account activity.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => {
            const iconConfig = NOTIFICATION_ICONS[n.type] || NOTIFICATION_ICONS.SYSTEM_ANNOUNCEMENT;
            const Icon = iconConfig.icon;

            return (
              <div
                key={n._id}
                onClick={() => !n.isRead && handleMarkAsRead(n._id)}
                className={clsx(
                  'p-5 rounded-2xl border transition-all flex items-start gap-4 cursor-pointer relative group',
                  n.isRead
                    ? 'bg-white border-slate-200/90 text-slate-700 hover:border-slate-300'
                    : 'bg-emerald-50/50 border-emerald-200 shadow-xs hover:border-emerald-300'
                )}
              >
                {/* Icon Container */}
                <div
                  className={clsx(
                    'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs',
                    iconConfig.bg
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Body */}
                <div className="flex-1 min-w-0 pr-8">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">{n.title}</h4>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-emerald-600 flex-shrink-0" />
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {formatDate(n.createdAt)}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-2">{n.message}</p>

                  {/* Related Property Link */}
                  {n.relatedProperty && (
                    <Link
                      to={`/properties/${n.relatedProperty.slug || n.relatedProperty._id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 hover:underline mt-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100"
                    >
                      <span>View Property: {n.relatedProperty.title}</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                </div>

                {/* Actions */}
                <button
                  type="button"
                  onClick={(e) => handleDelete(n._id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all absolute top-4 right-4 cursor-pointer"
                  title="Delete notification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
