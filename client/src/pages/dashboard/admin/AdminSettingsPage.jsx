import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Save,
  ShieldCheck,
  AlertTriangle,
  DollarSign,
  Mail,
  Phone,
  Building,
} from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import Button from '../../../components/common/Button';
import FormInput from '../../../components/common/FormInput';
import { getAdminSettings, updateAdminSettings } from '../../../services/adminService';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    siteName: 'EstateCraft Real Estate',
    supportEmail: 'support@estatecraft.com',
    supportPhone: '+91 98765 43210',
    autoApproveVerifiedAgents: false,
    maintenanceMode: false,
    featuredPropertyFee: 4999,
    maxImagesPerListing: 15,
    currencySymbol: '₹',
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAdminSettings();
        if (res?.data) {
          setForm({
            siteName: res.data.siteName || 'EstateCraft Real Estate',
            supportEmail: res.data.supportEmail || 'support@estatecraft.com',
            supportPhone: res.data.supportPhone || '+91 98765 43210',
            autoApproveVerifiedAgents: Boolean(res.data.autoApproveVerifiedAgents),
            maintenanceMode: Boolean(res.data.maintenanceMode),
            featuredPropertyFee: res.data.featuredPropertyFee || 4999,
            maxImagesPerListing: res.data.maxImagesPerListing || 15,
            currencySymbol: res.data.currencySymbol || '₹',
          });
        }
      } catch {
        toast.error('Failed to load platform settings');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateAdminSettings({
        ...form,
        featuredPropertyFee: Number(form.featuredPropertyFee),
        maxImagesPerListing: Number(form.maxImagesPerListing),
      });
      toast.success('Platform settings saved successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout
      title="Platform Governance & System Settings"
      subtitle="Configure global parameters, moderation policies, customer support touchpoints, and billing presets."
    >
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        {/* 1. General Branding */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Building className="w-4 h-4 text-purple-600" />
            <span>1. General Platform Information</span>
          </h3>

          <FormInput
            label="Platform Title / Brand Name"
            name="siteName"
            value={form.siteName}
            onChange={handleChange}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Support Email"
              name="supportEmail"
              type="email"
              value={form.supportEmail}
              onChange={handleChange}
              required
            />

            <FormInput
              label="Support Phone"
              name="supportPhone"
              value={form.supportPhone}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* 2. Moderation Policies */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>2. Moderation & Listing Verification Rules</span>
          </h3>

          <label className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer">
            <input
              type="checkbox"
              name="autoApproveVerifiedAgents"
              checked={form.autoApproveVerifiedAgents}
              onChange={handleChange}
              className="w-4 h-4 mt-0.5 rounded text-purple-600 accent-purple-600 cursor-pointer"
            />
            <div>
              <span className="text-xs font-bold text-slate-900 block">Auto-Approve Verified Consultant Listings</span>
              <span className="text-[11px] text-slate-500">
                When checked, submissions from agents with a verified badge bypass the manual approval queue.
              </span>
            </div>
          </label>

          <label className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer">
            <input
              type="checkbox"
              name="maintenanceMode"
              checked={form.maintenanceMode}
              onChange={handleChange}
              className="w-4 h-4 mt-0.5 rounded text-purple-600 accent-purple-600 cursor-pointer"
            />
            <div>
              <span className="text-xs font-bold text-red-600 block">System Maintenance Mode</span>
              <span className="text-[11px] text-slate-500">
                Temporary read-only mode across public listings.
              </span>
            </div>
          </label>
        </div>

        {/* 3. Catalog Parameters */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-amber-600" />
            <span>3. Monetary & Media Defaults</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormInput
              label="Featured Listing Fee (₹)"
              name="featuredPropertyFee"
              type="number"
              value={form.featuredPropertyFee}
              onChange={handleChange}
            />

            <FormInput
              label="Max Images Per Listing"
              name="maxImagesPerListing"
              type="number"
              value={form.maxImagesPerListing}
              onChange={handleChange}
            />

            <FormInput
              label="Currency Symbol"
              name="currencySymbol"
              value={form.currencySymbol}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={Save}
            loading={saving}
          >
            Save Global Settings
          </Button>
        </div>
      </form>
    </DashboardLayout>
  );
}
