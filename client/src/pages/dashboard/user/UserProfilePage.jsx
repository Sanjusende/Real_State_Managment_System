import React, { useState, useRef } from 'react';
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Calendar,
  Save,
  KeyRound,
  Sparkles,
  Camera,
  Loader2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import Button from '../../../components/common/Button';
import FormInput from '../../../components/common/FormInput';
import * as authService from '../../../services/authService';
import { uploadUserAvatar } from '../../../services/uploadService';

export default function UserProfilePage() {
  const { user, updateUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvatarFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const res = await uploadUserAvatar(file);
      if (res?.data?.avatar) {
        setForm((prev) => ({ ...prev, avatar: res.data.avatar }));
        updateUser({ ...user, avatar: res.data.avatar });
        toast.success('Profile avatar updated successfully!');
      }
    } catch (err) {
      console.error('Avatar upload failed:', err);
      toast.error(err.message || 'Failed to upload avatar. Max 5MB allowed.');
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await authService.updateProfile(form);
      if (res?.data?.user) {
        updateUser(res.data.user);
      }
      toast.success('Profile information updated successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout
      title="My Personal Profile"
      subtitle="Manage your contact details, personal bio, and view your verified account status."
    >
      <div className="max-w-4xl space-y-8">
        {/* Hidden file input for avatar */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleAvatarFileChange}
          className="hidden"
        />

        {/* Profile Overview Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
              {/* Interactive Avatar Container */}
              <div
                onClick={() => !uploadingAvatar && fileInputRef.current?.click()}
                className="relative w-20 h-20 rounded-3xl bg-emerald-600 text-white flex items-center justify-center text-3xl font-extrabold shadow-lg shadow-emerald-600/20 overflow-hidden flex-shrink-0 group cursor-pointer"
                title="Click to upload profile photo"
              >
                {form.avatar ? (
                  <img src={form.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  form.name?.charAt(0)?.toUpperCase() || 'U'
                )}

                {/* Upload Overlay */}
                <div className="absolute inset-0 bg-slate-950/60 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  {uploadingAvatar ? (
                    <Loader2 className="w-6 h-6 animate-spin text-white" />
                  ) : (
                    <>
                      <Camera className="w-5 h-5 mb-0.5" />
                      <span className="text-[9px] font-bold">Change</span>
                    </>
                  )}
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                  <h2 className="text-xl font-bold text-slate-900">{form.name || 'User'}</h2>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    {user?.role || 'USER'} Account
                  </span>
                </div>
                <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{user?.email}</span>
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[11px] font-bold text-emerald-700 hover:underline cursor-pointer"
                  >
                    Upload Avatar (JPEG, PNG, WebP)
                  </button>
                </div>
              </div>
            </div>

            <Link to="/change-password">
              <Button variant="outline" size="sm" icon={KeyRound}>
                Change Password
              </Button>
            </Link>
          </div>

          {/* Edit Form */}
          <form onSubmit={handleSave} className="space-y-6 pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Full Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />

              <FormInput
                label="Phone Number"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                About / Property Preferences
              </label>
              <textarea
                name="bio"
                rows={3}
                value={form.bio}
                onChange={handleChange}
                placeholder="Tell agents about your preferred locations, budget range, or property interests..."
                className="w-full text-xs rounded-xl border border-slate-200 p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="md"
                icon={Save}
                loading={submitting}
              >
                Save Profile Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
