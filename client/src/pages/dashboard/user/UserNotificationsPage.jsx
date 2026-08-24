import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  Sparkles,
  Tag,
  ShieldCheck,
  Building2,
  Trash2,
} from 'lucide-react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import Button from '../../../components/common/Button';
import clsx from 'clsx';

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: 'Price Drop Alert',
    message: 'A 3 BHK Luxury Apartment in Arera Colony, Bhopal has reduced its asking price by ₹ 5 Lakh.',
    time: '2 hours ago',
    read: false,
    type: 'price',
  },
  {
    id: 2,
    title: 'Site Visit Confirmation',
    message: 'Your inquiry for Duplex Villa on Hoshangabad Road was accepted by Agent Vikram Sharma.',
    time: '1 day ago',
    read: false,
    type: 'inquiry',
  },
  {
    id: 3,
    title: 'New Listing in Your Favorite Corridor',
    message: '4 new verified plots and independent houses are available in Indore Super Corridor.',
    time: '3 days ago',
    read: true,
    type: 'new',
  },
];

export default function UserNotificationsPage() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <DashboardLayout
      title="Notifications & Activity Alerts"
      subtitle="Stay updated on price drops, agent replies, and newly cataloged properties in your area."
    >
      <div className="flex items-center justify-between gap-4 mb-6">
        <span className="text-xs font-bold text-slate-500">
          {notifications.filter((n) => !n.read).length} unread updates
        </span>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={markAllRead}
            className="text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
          >
            Mark all as read
          </button>
          <button
            type="button"
            onClick={clearAll}
            className="text-xs font-semibold text-slate-400 hover:text-red-600 cursor-pointer"
          >
            Clear all
          </button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
          <Bell className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">No Notifications</h3>
          <p className="text-xs text-slate-500">You're all caught up with recent property activity!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={clsx(
                'p-5 rounded-2xl border transition-all flex items-start gap-4',
                n.read
                  ? 'bg-white border-slate-200/90 text-slate-700'
                  : 'bg-emerald-50/40 border-emerald-200/80 shadow-xs'
              )}
            >
              <div
                className={clsx(
                  'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5',
                  n.type === 'price'
                    ? 'bg-amber-100 text-amber-700'
                    : n.type === 'inquiry'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-emerald-100 text-emerald-700'
                )}
              >
                <Bell className="w-5 h-5" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                  <span className="text-[11px] text-slate-400">{n.time}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
