import React, { useState } from 'react';
import { User, ShieldCheck, Phone, Mail, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import Button from '../../../components/common/Button';
import FormInput from '../../../components/common/FormInput';
import * as authService from '../../../services/authService';

export default function SellerProfilePage() {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
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
      subtitle="Your contact details visible to verified buyers contacting your listings."
    >
      <form onSubmit={handleSave} className="max-w-2xl bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-amber-600 text-white flex items-center justify-center text-2xl font-bold">
            {form.name?.charAt(0)?.toUpperCase() || 'S'}
          </div>
          <div>
            <span className="text-base font-bold text-slate-900 block">{form.name}</span>
            <span className="text-xs text-slate-500">{user?.email}</span>
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
          label="Avatar URL"
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
          >
            Save Profile
          </Button>
        </div>
      </form>
    </DashboardLayout>
  );
}
