import React, { useState, useRef } from 'react';
import { User, ShieldCheck, Phone, Mail, Save, Camera, Loader2, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import Button from '../../../components/common/Button';
import FormInput from '../../../components/common/FormInput';
import * as authService from '../../../services/authService';
import { uploadUserAvatar } from '../../../services/uploadService';

export default function SellerProfilePage() {
  const { user, updateUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
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
      const newAvatarUrl = res?.data?.avatar || res?.data?.data?.avatar;
      if (newAvatarUrl) {
        setForm((prev) => ({ ...prev, avatar: newAvatarUrl }));
        updateUser({ ...user, avatar: newAvatarUrl });
        toast.success('Seller profile photo updated successfully!');
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
    setSubmitting(true);
    try {
      const res = await authService.updateProfile(form);
      if (res?.data?.user) {
        updateUser(res.data.user);
      }
      toast.success('Seller profile updated successfully!');
    } catch {
      toast.error('Failed to update profile.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout
      title="Seller Profile & Contact"
      subtitle="Your contact details and profile photo visible to verified buyers contacting your listings."
    >
      {/* Hidden file input for avatar */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleAvatarFileChange}
        className="hidden"
      />

      <form onSubmit={handleSave} className="max-w-2xl bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-slate-100 text-center sm:text-left">
          {/* Interactive Avatar Container */}
          <div
            onClick={() => !uploadingAvatar && fileInputRef.current?.click()}
            className="relative w-24 h-24 rounded-3xl bg-[#0b1528] text-white flex items-center justify-center text-3xl font-black shadow-lg shadow-slate-900/15 overflow-hidden flex-shrink-0 group cursor-pointer"
            title="Click to upload seller photo"
          >
            {form.avatar ? (
              <img src={form.avatar} alt={form.name} className="w-full h-full object-cover" />
            ) : (
              form.name?.charAt(0)?.toUpperCase() || 'S'
            )}

            {/* Upload Overlay */}
            <div className="absolute inset-0 bg-[#0b1528]/75 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
              {uploadingAvatar ? (
                <Loader2 className="w-6 h-6 animate-spin text-[#ff5a3c]" />
              ) : (
                <>
                  <Camera className="w-5 h-5 mb-1 text-[#ff5a3c]" />
                  <span className="text-[10px] font-bold tracking-wider uppercase">Change</span>
                </>
              )}
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
              <span className="text-xl font-extrabold text-slate-950 block">{form.name || 'Seller'}</span>
              <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#ff5a3c]/10 text-[#ff5a3c] border border-[#ff5a3c]/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Seller
              </span>
            </div>
            <span className="text-xs text-slate-500 block mb-2">{user?.email}</span>
            <button
              type="button"
              disabled={uploadingAvatar}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ff5a3c] hover:underline cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{uploadingAvatar ? 'Uploading...' : 'Upload Seller Photo'}</span>
            </button>
          </div>
        </div>

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
          required
        />

        <FormInput
          label="Avatar URL (Optional)"
          name="avatar"
          value={form.avatar}
          onChange={handleChange}
          placeholder="https://..."
        />

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={Save}
            loading={submitting}
            className="!rounded-2xl !py-3 !px-6 shadow-lg shadow-[#ff5a3c]/30 font-bold"
          >
            Save Profile
          </Button>
        </div>
      </form>
    </DashboardLayout>
  );
}

