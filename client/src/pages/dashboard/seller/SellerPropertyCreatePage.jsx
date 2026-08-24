import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Building2, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import Button from '../../../components/common/Button';
import FormInput from '../../../components/common/FormInput';
import FormSelect from '../../../components/common/FormSelect';
import { createProperty } from '../../../services/dashboardService';

const PROPERTY_TYPES = [
  { value: 'APARTMENT', label: 'Apartment / Flat' },
  { value: 'VILLA', label: 'Luxury Villa' },
  { value: 'HOUSE', label: 'Independent House' },
  { value: 'COMMERCIAL', label: 'Commercial Space' },
  { value: 'PLOT', label: 'Residential Plot' },
];

const LISTING_TYPES = [
  { value: 'SALE', label: 'For Sale' },
  { value: 'RENT', label: 'For Rent' },
];

export default function SellerPropertyCreatePage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    propertyType: 'HOUSE',
    listingType: 'SALE',
    price: '',
    area: '',
    bedrooms: '3',
    bathrooms: '2',
    address: '',
    city: 'Bhopal',
    state: 'Madhya Pradesh',
    pincode: '462016',
    thumbnail: '',
    amenities: ['24/7 Security', 'Parking', 'Power Backup'],
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.area || !form.address) {
      toast.error('Please fill required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        area: Number(form.area),
        bedrooms: Number(form.bedrooms) || 0,
        bathrooms: Number(form.bathrooms) || 0,
        thumbnail: form.thumbnail || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
      };
      await createProperty(payload);
      toast.success('Property published successfully!');
      navigate('/seller/properties');
    } catch (err) {
      toast.error(err.message || 'Failed to list property.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout
      title="Direct Owner Property Listing"
      subtitle="Publish your residential or commercial property to thousands of prospective buyers."
    >
      <div className="mb-6">
        <Link
          to="/seller/properties"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Listings</span>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            Listing Overview
          </h2>

          <FormInput
            label="Property Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. 3 BHK Independent House with Car Parking"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormSelect
              label="Property Type"
              name="propertyType"
              value={form.propertyType}
              onChange={handleChange}
              options={PROPERTY_TYPES}
            />

            <FormSelect
              label="Intent"
              name="listingType"
              value={form.listingType}
              onChange={handleChange}
              options={LISTING_TYPES}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Expected Price (₹)"
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="e.g. 6000000"
              required
            />

            <FormInput
              label="Carpet / Built-up Area (sq.ft)"
              name="area"
              type="number"
              value={form.area}
              onChange={handleChange}
              placeholder="e.g. 1500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Bedrooms"
              name="bedrooms"
              type="number"
              value={form.bedrooms}
              onChange={handleChange}
            />
            <FormInput
              label="Bathrooms"
              name="bathrooms"
              type="number"
              value={form.bathrooms}
              onChange={handleChange}
            />
          </div>

          <FormInput
            label="Street Address / Area"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="e.g. H.No 45, Kolar Road"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormInput
              label="City"
              name="city"
              value={form.city}
              onChange={handleChange}
              required
            />
            <FormInput
              label="State"
              name="state"
              value={form.state}
              onChange={handleChange}
              required
            />
            <FormInput
              label="Pincode"
              name="pincode"
              value={form.pincode}
              onChange={handleChange}
            />
          </div>

          <FormInput
            label="Photo URL"
            name="thumbnail"
            value={form.thumbnail}
            onChange={handleChange}
            placeholder="https://images.unsplash.com/..."
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              value={form.description}
              onChange={handleChange}
              placeholder="Provide key details about ownership, water supply, modular kitchen..."
              className="w-full text-xs rounded-xl border border-slate-200 p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Link to="/seller/properties">
              <Button variant="outline" size="md">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={Save}
              loading={submitting}
            >
              List Property
            </Button>
          </div>
        </div>
      </form>
    </DashboardLayout>
  );
}
