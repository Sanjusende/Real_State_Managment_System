import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  KeyRound,
  Bell,
  ShieldCheck,
  Smartphone,
  Save,
  Check,
} from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import Button from '../../../components/common/Button';

export default function UserSettingsPage() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [priceDrops, setPriceDrops] = useState(true);

  const handleSavePreferences = () => {
    toast.success('Notification preferences updated successfully!');
  };

  return (
    <DashboardLayout
      title="Account Settings & Security"
      subtitle="Manage your communication preferences, password updates, and account security controls."
    >
      <div className="max-w-3xl space-y-8">
        {/* 1. Security & Password Update Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-xs">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Security Credentials</h3>
              <p className="text-xs text-slate-500">Update your account password and security tokens</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-slate-800 block">Password Authentication</span>
              <span className="text-[11px] text-slate-500">Last changed recently</span>
            </div>
            <Link to="/change-password">
              <Button variant="outline" size="sm">
                Change Password
              </Button>
            </Link>
          </div>
        </div>

        {/* 2. Notification Preferences */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-xs">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Notification Channels</h3>
              <p className="text-xs text-slate-500">Configure how and when EstateCraft contacts you</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Email Inquiries & Reports</span>
                <span className="text-[11px] text-slate-500">Receive email alerts when listing agents reply</span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded cursor-pointer accent-emerald-600"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-slate-900 block">SMS Site Visit Reminders</span>
                <span className="text-[11px] text-slate-500">Receive SMS notifications before scheduled visits</span>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded cursor-pointer accent-emerald-600"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Price Drop & New Listings Alerts</span>
                <span className="text-[11px] text-slate-500">Get notified when bookmarked homes drop in asking price</span>
              </div>
              <input
                type="checkbox"
                checked={priceDrops}
                onChange={(e) => setPriceDrops(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded cursor-pointer accent-emerald-600"
              />
            </label>

            <div className="pt-2">
              <Button
                onClick={handleSavePreferences}
                variant="primary"
                size="md"
                icon={Save}
              >
                Save Preferences
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
