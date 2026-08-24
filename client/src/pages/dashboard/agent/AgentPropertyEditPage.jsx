import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Building2, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import Button from '../../../components/common/Button';
import FormInput from '../../../components/common/FormInput';
import FormSelect from '../../../components/common/FormSelect';
import ImageUploader from '../../../components/common/ImageUploader';
import { getPropertyById } from '../../../services/propertyService';
import { updateProperty } from '../../../services/dashboardService';

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

export default function AgentPropertyEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState([]);

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
    floor: '1',
    totalFloors: '5',
    furnishingStatus: 'SEMI_FURNISHED',
    constructionStatus: 'READY_TO_MOVE',
    address: '',
    city: '',
    state: '',
    pincode: '',
    amenities: [],
  });

  useEffect(() => {
    const fetchExisting = async () => {
      setLoading(true);
      try {
        const res = await getPropertyById(id);
        if (res?.data) {
          const p = res.data;
          setForm({
            title: p.title || '',
            description: p.description || '',
            propertyType: p.propertyType || 'APARTMENT',
            listingType: p.listingType || 'SALE',
            price: p.price?.toString() || '',
            priceUnit: p.priceUnit || 'INR',
            area: p.area?.toString() || '',
            areaUnit: p.areaUnit || 'sqft',
            bedrooms: p.bedrooms?.toString() || '0',
            bathrooms: p.bathrooms?.toString() || '0',
            balconies: p.balconies?.toString() || '0',
            floor: p.floor?.toString() || '0',
            totalFloors: p.totalFloors?.toString() || '1',
            furnishingStatus: p.furnishingStatus || 'UNFURNISHED',
            constructionStatus: p.constructionStatus || 'READY_TO_MOVE',
            address: p.address || '',
            city: p.city || '',
            state: p.state || '',
            pincode: p.pincode || '',
            amenities: p.amenities || [],
          });

          if (p.images && p.images.length > 0) {
            setImages(p.images.map((img, idx) => ({
              url: img.url || img,
              publicId: img.publicId || '',
              isThumbnail: img.isThumbnail || idx === 0,
              alt: img.alt || '',
              order: img.order !== undefined ? img.order : idx,
            })));
          } else if (p.thumbnail) {
            setImages([{ url: p.thumbnail, isThumbnail: true, alt: 'Thumbnail', order: 0 }]);
          }
        }
      } catch (err) {
        console.error('Failed to load property:', err);
        toast.error('Failed to fetch property details.');
      } finally {
        setLoading(false);
      }
    };
    fetchExisting();
  }, [id]);

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
    setSubmitting(true);
    try {
      const thumbnailImg = images.find((img) => img.isThumbnail) || images[0];

      const payload = {
        ...form,
        price: Number(form.price),
        area: Number(form.area),
        bedrooms: Number(form.bedrooms) || 0,
        bathrooms: Number(form.bathrooms) || 0,
        balconies: Number(form.balconies) || 0,
        floor: Number(form.floor) || 0,
        totalFloors: Number(form.totalFloors) || 1,
        images: images.length > 0 ? images : undefined,
        thumbnail: thumbnailImg?.url || form.thumbnail,
      };

      await updateProperty(id, payload);
      toast.success('Property updated successfully!');
      navigate('/agent/properties');
    } catch (err) {
      toast.error(err.message || 'Failed to update property.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Edit Listing Details">
        <div className="space-y-4">
          <div className="h-64 bg-white rounded-3xl animate-pulse border border-slate-200" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={`Edit Listing: "${form.title}"`}
      subtitle="Modify specifications, pricing, locality parameters, and amenities for this property."
    >
      <div className="mb-6">
        <Link
          to="/agent/properties"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portfolio</span>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
        {/* Basic Info */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Listing Specifications
          </h2>

          <FormInput
            label="Property Title"
            name="title"
            value={form.title}
            onChange={handleChange}
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
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              className="w-full text-xs rounded-xl border border-slate-200 p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Pricing & Dimensions */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Pricing & Area
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Asking Price (₹)"
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              required
            />

            <FormInput
              label="Area (sq.ft)"
              name="area"
              type="number"
              value={form.area}
              onChange={handleChange}
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
              label="Floor"
              name="floor"
              type="number"
              value={form.floor}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Location
          </h2>

          <FormInput
            label="Address"
            name="address"
            value={form.address}
            onChange={handleChange}
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
        </div>

        {/* Amenities */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Amenities
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {AMENITIES_LIST.map((amenity) => {
              const isChecked = form.amenities.includes(amenity);
              return (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => handleAmenityToggle(amenity)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold text-left transition cursor-pointer ${
                    isChecked
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-500'
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

        {/* Photo Gallery & Cloudinary Upload */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Property Photos & Gallery
          </h2>
          <ImageUploader images={images} onChange={setImages} maxImages={10} />
        </div>

        {/* Action Buttons */}
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
            Save Listing Changes
          </Button>
        </div>
      </form>
    </DashboardLayout>
  );
}
