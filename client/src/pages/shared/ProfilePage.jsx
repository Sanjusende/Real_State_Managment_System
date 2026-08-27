import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  User,
  Mail,
  Phone,
  Briefcase,
  KeyRound,
  Edit3,
  Check,
  Loader2,
  Camera,
  Upload,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import * as authService from '../../services/authService';
import { uploadUserAvatar } from '../../services/uploadService';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    agencyName: user?.agencyName || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAvatarFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const res = await uploadUserAvatar(file);
      const newAvatarUrl = res?.data?.avatar || res?.data?.data?.avatar;
      if (newAvatarUrl) {
        setFormData((prev) => ({ ...prev, avatar: newAvatarUrl }));
        updateUser({ ...user, avatar: newAvatarUrl });
        toast.success('Profile photo updated successfully!');
      }
    } catch (err) {
      console.error('Avatar upload failed:', err);
      toast.error(err.message || 'Failed to upload photo. Max 5MB allowed.');
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
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
      {/* Hidden file input for avatar */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleAvatarFileChange}
        className="hidden"
      />

      {/* Header Banner */}
      <div className="bg-[#0b1528] border border-white/10 rounded-3xl p-8 mb-8 shadow-2xl text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,90,60,0.18),transparent)] pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
          {/* Avatar Upload Container */}
          <div
            onClick={() => !uploadingAvatar && fileInputRef.current?.click()}
            className="relative w-28 h-28 rounded-3xl bg-[#152542] border-2 border-white/15 flex items-center justify-center text-4xl font-black text-white shadow-xl shadow-black/40 overflow-hidden flex-shrink-0 group cursor-pointer"
            title="Click to change profile photo"
          >
            {user?.avatar || formData.avatar ? (
              <img
                src={user?.avatar || formData.avatar}
                alt={user?.name}
                className="w-full h-full object-cover"
              />
            ) : (
              user?.name?.charAt(0)?.toUpperCase() || 'U'
            )}

            {/* Hover Camera Overlay */}
            <div className="absolute inset-0 bg-[#0b1528]/80 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
              {uploadingAvatar ? (
                <Loader2 className="w-6 h-6 animate-spin text-[#ff5a3c]" />
              ) : (
                <>
                  <Camera className="w-6 h-6 mb-1 text-[#ff5a3c]" />
                  <span className="text-[10px] font-bold tracking-wider uppercase">Change</span>
                </>
              )}
            </div>
          </div>

          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-1.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{user?.name}</h1>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#ff5a3c]/20 text-[#ff5a3c] border border-[#ff5a3c]/30 uppercase tracking-wider">
                {user?.role}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 flex items-center justify-center sm:justify-start gap-1.5 mb-2">
              <Mail className="w-4 h-4 text-slate-400" />
              {user?.email}
            </p>
            {user?.agencyName && (
              <p className="text-xs text-slate-300 flex items-center justify-center sm:justify-start gap-1.5 mb-2">
                <Briefcase className="w-3.5 h-3.5 text-[#ff5a3c]" />
                <span>
                  Agency: <strong className="text-white">{user.agencyName}</strong>
                </span>
              </p>
            )}
            <button
              type="button"
              disabled={uploadingAvatar}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ff5a3c] hover:underline cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{uploadingAvatar ? 'Uploading Photo...' : 'Upload Profile Photo'}</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/change-password"
              className="px-4 py-2.5 rounded-2xl bg-white/10 border border-white/10 hover:border-white/20 text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-2 transition"
            >
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span>Change Password</span>
            </Link>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-5 py-2.5 rounded-2xl bg-[#ff5a3c] hover:bg-[#e04b30] text-xs font-bold text-white flex items-center gap-2 shadow-lg shadow-[#ff5a3c]/30 transition cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Details Form / View */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-md">
        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-[#ff5a3c]" />
          <span>Account Information</span>
        </h2>

        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff5a3c]/20 focus:border-[#ff5a3c]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff5a3c]/20 focus:border-[#ff5a3c]"
                />
              </div>

              {user?.role === 'AGENT' && (
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Agency / Brokerage Name
                  </label>
                  <input
                    type="text"
                    name="agencyName"
                    value={formData.agencyName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff5a3c]/20 focus:border-[#ff5a3c]"
                  />
                </div>
              )}

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Bio / About Me
                </label>
                <textarea
                  name="bio"
                  rows="3"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Share a short bio..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff5a3c]/20 focus:border-[#ff5a3c]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 rounded-2xl bg-slate-100 text-sm font-bold text-slate-700 hover:bg-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-2xl bg-[#ff5a3c] hover:bg-[#e04b30] text-sm font-bold text-white flex items-center gap-2 shadow-lg shadow-[#ff5a3c]/30 cursor-pointer"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-xs text-slate-400 block mb-1 font-bold">Email Address</span>
              <span className="font-semibold text-slate-900">{user?.email}</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-xs text-slate-400 block mb-1 font-bold">Phone Number</span>
              <span className="font-semibold text-slate-900">{user?.phone || 'Not provided'}</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-xs text-slate-400 block mb-1 font-bold">Account Role</span>
              <span className="font-semibold text-slate-900">{user?.role}</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-xs text-slate-400 block mb-1 font-bold">Member Since</span>
              <span className="font-semibold text-slate-900">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active Member'}
              </span>
            </div>

            {user?.bio && (
              <div className="sm:col-span-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-xs text-slate-400 block mb-1 font-bold">About</span>
                <p className="text-slate-700 leading-relaxed">{user.bio}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


