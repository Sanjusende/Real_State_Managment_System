import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  Building,
  Phone,
  Mail,
  Save,
  Award,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import Button from '../../../components/common/Button';
import FormInput from '../../../components/common/FormInput';
import * as authService from '../../../services/authService';

export default function AgentProfilePage() {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    agencyName: user?.agencyName || 'Apex Realty Partners',
    bio: user?.bio || 'Experienced real estate advisor specializing in premium residential flats, luxury duplexes, and commercial hubs.',
    avatar: user?.avatar || '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await authService.updateProfile(form);
      toast.success('Agent profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update agent profile.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout
      title="Agent Professional Profile"
      subtitle="Public consultant details, agency branding, and contact channels visible on property listings."
    >
      <form onSubmit={handleSave} className="max-w-3xl space-y-8">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
            <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-2xl font-bold shadow-md shadow-emerald-600/20">
              {form.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base font-bold text-slate-900">{form.name}</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Verified Consultant
                </span>
              </div>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <FormInput
              label="Agency Name"
              name="agencyName"
              value={form.agencyName}
              onChange={handleChange}
              placeholder="e.g. Apex Realty Partners"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Contact Phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              required
            />

            <FormInput
              label="Profile Photo URL"
              name="avatar"
              value={form.avatar}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Professional Biography
            </label>
            <textarea
              name="bio"
              rows={4}
              value={form.bio}
              onChange={handleChange}
              className="w-full text-xs rounded-xl border border-slate-200 p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
            />
          </div>

          <div className="pt-2">
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
        </div>
      </form>
    </DashboardLayout>
  );
}
