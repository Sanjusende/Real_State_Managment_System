import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, Briefcase, Shield, Calendar, Edit3, Check, KeyRound, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import * as authService from '../../services/authService';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    agencyName: user?.agencyName || '',
    bio: user?.bio || '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await authService.updateProfile(formData);
      if (res?.data?.user) {
        updateUser(res.data.user);
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header Banner */}
      <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-8 mb-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-3xl font-extrabold text-white shadow-xl shadow-blue-500/20">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-1">
              <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase tracking-wider">
                {user?.role}
              </span>
            </div>
            <p className="text-sm text-slate-400 flex items-center justify-center sm:justify-start gap-1.5 mb-2">
              <Mail className="w-4 h-4 text-slate-500" />
              {user?.email}
            </p>
            {user?.agencyName && (
              <p className="text-xs text-slate-300 flex items-center justify-center sm:justify-start gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                <span>Agency: <strong className="text-white">{user.agencyName}</strong></span>
              </p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/change-password"
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-2 transition"
            >
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span>Change Password</span>
            </Link>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white flex items-center gap-2 shadow-lg shadow-blue-600/30 transition"
            >
              <Edit3 className="w-4 h-4" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Details Form / View */}
      <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-8 shadow-2xl">
        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-400" />
          <span>Account Information</span>
        </h2>

        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {user?.role === 'AGENT' && (
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Agency / Brokerage Name
                  </label>
                  <input
                    type="text"
                    name="agencyName"
                    value={formData.agencyName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Bio / About Me
                </label>
                <textarea
                  name="bio"
                  rows="3"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Share a short bio..."
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm font-medium text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-semibold text-white flex items-center gap-2 shadow-lg shadow-blue-600/30"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Email Address</span>
              <span className="font-semibold text-white">{user?.email}</span>
            </div>

            <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Phone Number</span>
              <span className="font-semibold text-white">{user?.phone || 'Not provided'}</span>
            </div>

            <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Account Role</span>
              <span className="font-semibold text-white">{user?.role}</span>
            </div>

            <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Member Since</span>
              <span className="font-semibold text-white">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active Member'}
              </span>
            </div>

            {user?.bio && (
              <div className="sm:col-span-2 p-4 bg-slate-900/60 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">About</span>
                <p className="text-slate-300 leading-relaxed">{user.bio}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
