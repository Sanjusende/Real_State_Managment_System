import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
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
  { value: 'PLOT', label: 'Residential Plot' },
];

const LISTING_TYPES = [
  { value: 'SALE', label: 'For Sale' },
  { value: 'RENT', label: 'For Rent' },
];

export default function SellerPropertyEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState([]);

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
    city: '',
    state: '',
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getPropertyById(id);
        if (res?.data) {
          const p = res.data;
          setForm({
            title: p.title || '',
            description: p.description || '',
            propertyType: p.propertyType || 'HOUSE',
            listingType: p.listingType || 'SALE',
            price: p.price?.toString() || '',
            area: p.area?.toString() || '',
            bedrooms: p.bedrooms?.toString() || '0',
            bathrooms: p.bathrooms?.toString() || '0',
            address: p.address || '',
            city: p.city || '',
            state: p.state || '',
          });

          if (p.images && p.images.length > 0) {
            setImages(
              p.images.map((img, idx) => ({
                url: img.url || img,
                publicId: img.publicId || '',
                isThumbnail: img.isThumbnail || idx === 0,
                alt: img.alt || '',
                order: img.order !== undefined ? img.order : idx,
              }))
            );
          } else if (p.thumbnail) {
            setImages([{ url: p.thumbnail, isThumbnail: true, alt: 'Thumbnail', order: 0 }]);
          }
        }
      } catch (err) {
        toast.error('Failed to load property details.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
        images: images.length > 0 ? images : undefined,
        thumbnail: thumbnailImg?.url || undefined,
      };
      await updateProperty(id, payload);
      toast.success('Property updated successfully!');
      navigate('/seller/properties');
    } catch {
      toast.error('Failed to update property.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Edit Listing">
        <div className="h-64 bg-white rounded-3xl animate-pulse border border-slate-200" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={`Edit Property: ${form.title}`}
      subtitle="Modify price, description, or photos."
    >
      <div className="mb-6">
        <Link
          to="/seller/properties"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Properties</span>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-xs space-y-4">
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
              label="Intent"
              name="listingType"
              value={form.listingType}
              onChange={handleChange}
              options={LISTING_TYPES}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Price (₹)"
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
            label="Address"
            name="address"
            value={form.address}
            onChange={handleChange}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          </div>

          {/* Property Photos & Gallery */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Property Photos & Gallery
            </label>
            <ImageUploader images={images} onChange={setImages} maxImages={8} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              value={form.description}
              onChange={handleChange}
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
              Save Changes
            </Button>
          </div>
        </div>
      </form>
    </DashboardLayout>
  );
}
