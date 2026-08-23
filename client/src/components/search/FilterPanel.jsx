import React, { useState } from 'react';
import {
  SlidersHorizontal,
  X,
  RotateCcw,
  Check,
  ChevronDown,
  Building,
  MapPin,
  IndianRupee,
  Bed,
  Bath,
  Maximize2,
  Sparkles,
} from 'lucide-react';
import Button from '../common/Button';
import clsx from 'clsx';

const PROPERTY_TYPES = [
  'APARTMENT',
  'VILLA',
  'HOUSE',
  'COMMERCIAL',
  'OFFICE',
  'PLOT',
  'PENTHOUSE',
  'STUDIO',
];

const LISTING_TYPES = [
  { value: '', label: 'All Listings' },
  { value: 'SALE', label: 'For Sale' },
  { value: 'RENT', label: 'For Rent' },
  { value: 'LEASE', label: 'For Lease' },
];

const FURNISHING_OPTIONS = [
  { value: '', label: 'Any Furnishing' },
  { value: 'UNFURNISHED', label: 'Unfurnished' },
  { value: 'SEMI_FURNISHED', label: 'Semi-Furnished' },
  { value: 'FULLY_FURNISHED', label: 'Fully Furnished' },
];

const CONSTRUCTION_OPTIONS = [
  { value: '', label: 'Any Status' },
  { value: 'READY_TO_MOVE', label: 'Ready to Move' },
  { value: 'UNDER_CONSTRUCTION', label: 'Under Construction' },
];

const POPULAR_AMENITIES = [
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
];

export default function FilterPanel({
  filters = {},
  onChange,
  onReset,
  onCloseMobile,
  className = '',
}) {
  // Local active filters state
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (key, value) => {
    const updated = { ...localFilters, [key]: value };
    setLocalFilters(updated);
    if (onChange) onChange(updated);
  };

  const handleAmenityToggle = (amenity) => {
    const currentList = localFilters.amenities
      ? localFilters.amenities.split(',').map((a) => a.trim()).filter(Boolean)
      : [];

    let updatedList;
    if (currentList.includes(amenity)) {
      updatedList = currentList.filter((a) => a !== amenity);
    } else {
      updatedList = [...currentList, amenity];
    }

    const updated = {
      ...localFilters,
      amenities: updatedList.length > 0 ? updatedList.join(',') : '',
    };
    setLocalFilters(updated);
    if (onChange) onChange(updated);
  };

  const handlePropertyTypeToggle = (type) => {
    const currentTypes = localFilters.propertyType
      ? localFilters.propertyType.split(',').map((t) => t.trim().toUpperCase()).filter(Boolean)
      : [];

    let updatedTypes;
    if (currentTypes.includes(type)) {
      updatedTypes = currentTypes.filter((t) => t !== type);
    } else {
      updatedTypes = [...currentTypes, type];
    }

    const updated = {
      ...localFilters,
      propertyType: updatedTypes.length > 0 ? updatedTypes.join(',') : '',
    };
    setLocalFilters(updated);
    if (onChange) onChange(updated);
  };

  const handleResetAll = () => {
    const cleared = {
      keyword: '',
      city: '',
      state: '',
      propertyType: '',
      listingType: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      furnishingStatus: '',
      constructionStatus: '',
      minArea: '',
      maxArea: '',
      amenities: '',
      sort: 'newest',
    };
    setLocalFilters(cleared);
    if (onReset) onReset();
  };

  const selectedAmenities = localFilters.amenities
    ? localFilters.amenities.split(',').map((a) => a.trim()).filter(Boolean)
    : [];

  const selectedPropertyTypes = localFilters.propertyType
    ? localFilters.propertyType.split(',').map((t) => t.trim().toUpperCase()).filter(Boolean)
    : [];

  return (
    <div
      className={clsx(
        'rounded-3xl bg-white border border-slate-200/80 p-5 md:p-6 shadow-sm space-y-6',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-emerald-600" />
          <h3 className="text-base font-bold text-slate-900">Filters</h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetAll}
            className="text-xs font-semibold text-slate-500 hover:text-emerald-700 flex items-center gap-1 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All</span>
          </button>

          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Listing Type (Buy / Rent / Lease) */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          Listing Intent
        </label>
        <div className="grid grid-cols-2 gap-2">
          {LISTING_TYPES.map((lt) => {
            const isSelected = (localFilters.listingType || '') === lt.value;
            return (
              <button
                key={lt.label}
                type="button"
                onClick={() => handleChange('listingType', lt.value)}
                className={clsx(
                  'py-2 px-3 rounded-xl text-xs font-semibold text-center border transition cursor-pointer',
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                )}
              >
                {lt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Property Types Multi-Selector */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          Property Types
        </label>
        <div className="flex flex-wrap gap-1.5">
          {PROPERTY_TYPES.map((pt) => {
            const isSelected = selectedPropertyTypes.includes(pt);
            return (
              <button
                key={pt}
                type="button"
                onClick={() => handlePropertyTypeToggle(pt)}
                className={clsx(
                  'px-3 py-1.5 rounded-xl text-xs font-medium border transition cursor-pointer',
                  isSelected
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-500 font-bold'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                )}
              >
                {pt.charAt(0) + pt.slice(1).toLowerCase()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Location (City & State) */}
      <div className="space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          Location
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="City (e.g. Bhopal)"
            value={localFilters.city || ''}
            onChange={(e) => handleChange('city', e.target.value)}
            className="w-full text-xs rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
          />
          <input
            type="text"
            placeholder="State (e.g. MP)"
            value={localFilters.state || ''}
            onChange={(e) => handleChange('state', e.target.value)}
            className="w-full text-xs rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Price Range (Min - Max) */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          Price Range (₹)
        </label>
        <div className="grid grid-cols-2 gap-2 items-center">
          <input
            type="number"
            placeholder="Min Price"
            value={localFilters.minPrice || ''}
            onChange={(e) => handleChange('minPrice', e.target.value)}
            className="w-full text-xs rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={localFilters.maxPrice || ''}
            onChange={(e) => handleChange('maxPrice', e.target.value)}
            className="w-full text-xs rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Bedrooms & Bathrooms */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Min Bedrooms
          </label>
          <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-0.5">
            {[0, 1, 2, 3, 4].map((bed) => (
              <button
                key={`bed-${bed}`}
                type="button"
                onClick={() => handleChange('bedrooms', bed === 0 ? '' : bed.toString())}
                className={clsx(
                  'flex-1 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer text-center',
                  (localFilters.bedrooms || '0') === bed.toString() ||
                    (!localFilters.bedrooms && bed === 0)
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                )}
              >
                {bed === 0 ? 'Any' : `${bed}+`}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Min Bathrooms
          </label>
          <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-0.5">
            {[0, 1, 2, 3, 4].map((bath) => (
              <button
                key={`bath-${bath}`}
                type="button"
                onClick={() => handleChange('bathrooms', bath === 0 ? '' : bath.toString())}
                className={clsx(
                  'flex-1 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer text-center',
                  (localFilters.bathrooms || '0') === bath.toString() ||
                    (!localFilters.bathrooms && bath === 0)
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                )}
              >
                {bath === 0 ? 'Any' : `${bath}+`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Furnishing & Construction Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Furnishing
          </label>
          <select
            value={localFilters.furnishingStatus || ''}
            onChange={(e) => handleChange('furnishingStatus', e.target.value)}
            className="w-full text-xs rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 cursor-pointer"
          >
            {FURNISHING_OPTIONS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Construction
          </label>
          <select
            value={localFilters.constructionStatus || ''}
            onChange={(e) => handleChange('constructionStatus', e.target.value)}
            className="w-full text-xs rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 cursor-pointer"
          >
            {CONSTRUCTION_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Area Range (Min Area - Max Area) */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          Area (sq.ft)
        </label>
        <div className="grid grid-cols-2 gap-2 items-center">
          <input
            type="number"
            placeholder="Min sqft"
            value={localFilters.minArea || ''}
            onChange={(e) => handleChange('minArea', e.target.value)}
            className="w-full text-xs rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
          />
          <input
            type="number"
            placeholder="Max sqft"
            value={localFilters.maxArea || ''}
            onChange={(e) => handleChange('maxArea', e.target.value)}
            className="w-full text-xs rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Amenities Multi-Checkboxes */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          Amenities
        </label>
        <div className="grid grid-cols-2 gap-2">
          {POPULAR_AMENITIES.map((amenity) => {
            const isChecked = selectedAmenities.includes(amenity);
            return (
              <label
                key={amenity}
                onClick={() => handleAmenityToggle(amenity)}
                className={clsx(
                  'flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-xs font-medium cursor-pointer transition select-none',
                  isChecked
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-500 font-semibold'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                )}
              >
                <div
                  className={clsx(
                    'w-3.5 h-3.5 rounded border flex items-center justify-center text-white',
                    isChecked ? 'bg-emerald-600 border-emerald-600' : 'border-slate-300'
                  )}
                >
                  {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
                <span className="truncate">{amenity}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
