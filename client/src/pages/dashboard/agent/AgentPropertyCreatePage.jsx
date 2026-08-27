import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Building2,
  ArrowLeft,
  Save,
  Image as ImageIcon,
  MapPin,
  Sparkles,
  Check,
} from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import Button from '../../../components/common/Button';
import FormInput from '../../../components/common/FormInput';
import FormSelect from '../../../components/common/FormSelect';
import ImageUploader from '../../../components/common/ImageUploader';
import { createProperty } from '../../../services/dashboardService';

const PROPERTY_TYPES = [
  { value: 'APARTMENT', label: 'Apartment / Flat' },
  { value: 'VILLA', label: 'Luxury Villa' },
  { value: 'HOUSE', label: 'Independent House' },
  { value: 'COMMERCIAL', label: 'Commercial Space' },
  { value: 'OFFICE', label: 'Corporate Office' },
  { value: 'PLOT', label: 'Residential Plot' },
  { value: 'PENTHOUSE', label: 'Penthouse' },
  { value: 'STUDIO', label: 'Studio Apartment' },
];

const LISTING_TYPES = [
  { value: 'SALE', label: 'For Sale' },
  { value: 'RENT', label: 'For Rent' },
  { value: 'LEASE', label: 'For Lease' },
];

const FURNISHING_OPTIONS = [
  { value: 'UNFURNISHED', label: 'Unfurnished' },
  { value: 'SEMI_FURNISHED', label: 'Semi-Furnished' },
  { value: 'FULLY_FURNISHED', label: 'Fully Furnished' },
];

const CONSTRUCTION_OPTIONS = [
  { value: 'READY_TO_MOVE', label: 'Ready to Move' },
  { value: 'UNDER_CONSTRUCTION', label: 'Under Construction' },
];

const AMENITIES_LIST = [
  'Swimming Pool',
  'Gym',
  'Clubhouse',
  '24/7 Security',
  'Power Backup',
  'Lift',
  'Parking',
  'Private Garden',
  'Children Play Area',
  'Cafeteria',
  'Jogging Track',
  'Intercom Facility',
];

export default function AgentPropertyCreatePage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    propertyType: 'APARTMENT',
    listingType: 'SALE',
    price: '',
    priceUnit: 'INR',
    area: '',
    areaUnit: 'sqft',
    bedrooms: '2',
    bathrooms: '2',
    balconies: '1',
    floor: '2',
    totalFloors: '8',
    furnishingStatus: 'SEMI_FURNISHED',
    constructionStatus: 'READY_TO_MOVE',
    possessionDate: '',
    yearBuilt: '2024',
    address: '',
    city: 'Bhopal',
    state: 'Madhya Pradesh',
    pincode: '462016',
    amenities: ['24/7 Security', 'Lift', 'Parking', 'Power Backup'],
  });

  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmenityToggle = (amenity) => {
    setForm((prev) => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((a) => a !== amenity)
          : [...prev.amenities, amenity],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.price || !form.area || !form.city || !form.address) {
      toast.error('Please fill in all mandatory fields.');
      return;
    }

    setSubmitting(true);
    try {
      const thumbnailImg = images.find((img) => img.isThumbnail) || images[0];

      const autoDescription = form.description?.trim().length >= 10
        ? form.description.trim()
        : `Prime ${form.bedrooms || '2'} BHK ${form.propertyType} available for ${form.listingType === 'RENT' ? 'rent' : 'sale'} in ${form.city}, ${form.state}. Features modern architecture, verified title, and prime connectivity.`;

      const payload = {
        ...form,
        description: autoDescription,
        price: Number(form.price),
        area: Number(form.area),
        bedrooms: Number(form.bedrooms) || 0,
        bathrooms: Number(form.bathrooms) || 0,
        balconies: Number(form.balconies) || 0,
        floor: Number(form.floor) || 0,
        totalFloors: Number(form.totalFloors) || 1,
        yearBuilt: Number(form.yearBuilt) || new Date().getFullYear(),
        images: images.length > 0 ? images : undefined,
        thumbnail: thumbnailImg?.url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
      };

      await createProperty(payload);
      toast.success('Property listing created successfully!');
      navigate('/agent/properties');
    } catch (err) {
      console.error('Failed to create property:', err);
      toast.error(err.message || 'Failed to publish property.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout
      title="Post New Property Listing"
      subtitle="Publish a verified residential, commercial, or plot listing to the public catalog."
    >
      <div className="mb-6">
        <Link
          to="/agent/properties"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Properties</span>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
        {/* 1. Basic Information Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            1. Basic Listing Information
          </h2>

          <FormInput
            label="Property Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. 3 BHK Luxury Duplex Villa with Garden"
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
              label="Listing Intent"
              name="listingType"
              value={form.listingType}
              onChange={handleChange}
              options={LISTING_TYPES}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Property Description
            </label>
            <textarea
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              placeholder="Highlight special architectural highlights, orientation, nearby schools, hospitals..."
              className="w-full text-xs rounded-xl border border-slate-200 p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* 2. Pricing & Dimensions */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            2. Price & Area Dimensions
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Asking Price (₹)"
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="e.g. 7500000"
              required
            />

            <FormInput
              label="Super Built-up Area (sq.ft)"
              name="area"
              type="number"
              value={form.area}
              onChange={handleChange}
              placeholder="e.g. 1850"
              required
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
            <FormInput
              label="Balconies"
              name="balconies"
              type="number"
              value={form.balconies}
              onChange={handleChange}
            />
            <FormInput
              label="Floor / Total"
              name="floor"
              type="number"
              value={form.floor}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormSelect
              label="Furnishing Status"
              name="furnishingStatus"
              value={form.furnishingStatus}
              onChange={handleChange}
              options={FURNISHING_OPTIONS}
            />

            <FormSelect
              label="Construction Status"
              name="constructionStatus"
              value={form.constructionStatus}
              onChange={handleChange}
              options={CONSTRUCTION_OPTIONS}
            />
          </div>
        </div>

        {/* 3. Location Details */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            3. Address & Locality
          </h2>

          <FormInput
            label="Street Address / Project Name"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="e.g. Plot 14, Emerald Greens, Arera Colony"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormInput
              label="City"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="Bhopal"
              required
            />

            <FormInput
              label="State"
              name="state"
              value={form.state}
              onChange={handleChange}
              placeholder="Madhya Pradesh"
              required
            />

            <FormInput
              label="Pincode"
              name="pincode"
              value={form.pincode}
              onChange={handleChange}
              placeholder="462016"
            />
          </div>
        </div>

        {/* 4. Amenities Checklist */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            4. Features & Amenities
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {AMENITIES_LIST.map((amenity) => {
              const isChecked = form.amenities.includes(amenity);
              return (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => handleAmenityToggle(amenity)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold text-left transition cursor-pointer ${
                    isChecked
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-500 shadow-2xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-white ${
                      isChecked ? 'bg-emerald-600 border-emerald-600' : 'border-slate-300'
                    }`}
                  >
                    {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                  <span className="truncate">{amenity}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Production Image Upload */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            5. Property Photos & Gallery
          </h2>

          <ImageUploader images={images} onChange={setImages} maxImages={10} />
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link to="/agent/properties">
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
            Publish Property Listing
          </Button>
        </div>
      </form>
    </DashboardLayout>
  );
}
