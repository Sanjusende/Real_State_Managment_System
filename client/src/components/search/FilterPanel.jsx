import React, { useState } from 'react';
import {
  SlidersHorizontal,
  X,
  RotateCcw,
  Check,
} from 'lucide-react';
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
  { value: '', label: 'All' },
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
        'rounded-3xl bg-white border border-slate-200/90 p-5 md:p-6 shadow-sm space-y-6',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#0b1528] text-[#ff5a3c] flex items-center justify-center">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Refine Assets</h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetAll}
            className="text-xs font-bold text-slate-500 hover:text-[#ff5a3c] flex items-center gap-1 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
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
        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
          Intent
        </label>
        <div className="grid grid-cols-2 gap-1.5 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/60">
          {LISTING_TYPES.map((lt) => {
            const isSelected = (localFilters.listingType || '') === lt.value;
            return (
              <button
                key={lt.label}
                type="button"
                onClick={() => handleChange('listingType', lt.value)}
                className={clsx(
                  'py-2 px-3 rounded-xl text-xs font-bold text-center transition cursor-pointer',
                  isSelected
                    ? 'bg-[#0b1528] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-950'
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
        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
          Asset Classification
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
                  'px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer',
                  isSelected
                    ? 'bg-[#ff5a3c] text-white border-[#ff5a3c] shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-white hover:text-slate-900'
                )}
              >
                {pt.charAt(0) + pt.slice(1).toLowerCase()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Location (City & State) */}
      <div className="space-y-2">
        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
          Territory / City
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="City"
            value={localFilters.city || ''}
            onChange={(e) => handleChange('city', e.target.value)}
            className="w-full text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5a3c]/20 focus:border-[#ff5a3c]"
          />
          <input
            type="text"
            placeholder="State"
            value={localFilters.state || ''}
            onChange={(e) => handleChange('state', e.target.value)}
            className="w-full text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5a3c]/20 focus:border-[#ff5a3c]"
          />
        </div>
      </div>

      {/* Price Range (Min - Max) */}
      <div>
        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
          Budget Ceiling (₹)
        </label>
        <div className="grid grid-cols-2 gap-2 items-center">
          <input
            type="number"
            placeholder="Min ₹"
            value={localFilters.minPrice || ''}
            onChange={(e) => handleChange('minPrice', e.target.value)}
            className="w-full text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5a3c]/20 focus:border-[#ff5a3c]"
          />
          <input
            type="number"
            placeholder="Max ₹"
            value={localFilters.maxPrice || ''}
            onChange={(e) => handleChange('maxPrice', e.target.value)}
            className="w-full text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5a3c]/20 focus:border-[#ff5a3c]"
          />
        </div>
      </div>

      {/* Bedrooms & Bathrooms */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
            Min Bedrooms
          </label>
          <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-0.5">
            {[0, 1, 2, 3, 4].map((bed) => (
              <button
                key={`bed-${bed}`}
                type="button"
                onClick={() => handleChange('bedrooms', bed === 0 ? '' : bed.toString())}
                className={clsx(
                  'flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer text-center',
                  (localFilters.bedrooms || '0') === bed.toString() ||
                    (!localFilters.bedrooms && bed === 0)
                    ? 'bg-[#0b1528] text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                )}
              >
                {bed === 0 ? 'Any' : `${bed}+`}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
            Min Bathrooms
          </label>
          <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-0.5">
            {[0, 1, 2, 3, 4].map((bath) => (
              <button
                key={`bath-${bath}`}
                type="button"
                onClick={() => handleChange('bathrooms', bath === 0 ? '' : bath.toString())}
                className={clsx(
                  'flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer text-center',
                  (localFilters.bathrooms || '0') === bath.toString() ||
                    (!localFilters.bathrooms && bath === 0)
                    ? 'bg-[#0b1528] text-white shadow-xs'
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
          <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
            Furnishing
          </label>
          <select
            value={localFilters.furnishingStatus || ''}
            onChange={(e) => handleChange('furnishingStatus', e.target.value)}
            className="w-full text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5a3c]/20 focus:border-[#ff5a3c] cursor-pointer"
          >
            {FURNISHING_OPTIONS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
            Possession Status
          </label>
          <select
            value={localFilters.constructionStatus || ''}
            onChange={(e) => handleChange('constructionStatus', e.target.value)}
            className="w-full text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5a3c]/20 focus:border-[#ff5a3c] cursor-pointer"
          >
            {CONSTRUCTION_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Amenities Multi-Checkboxes */}
      <div>
        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
          Key Amenities
        </label>
        <div className="grid grid-cols-2 gap-2">
          {POPULAR_AMENITIES.map((amenity) => {
            const isChecked = selectedAmenities.includes(amenity);
            return (
              <label
                key={amenity}
                onClick={() => handleAmenityToggle(amenity)}
                className={clsx(
                  'flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition select-none',
                  isChecked
                    ? 'bg-[#ff5a3c]/10 text-slate-950 border-[#ff5a3c] font-bold'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-white'
                )}
              >
                <div
                  className={clsx(
                    'w-3.5 h-3.5 rounded-md border flex items-center justify-center text-white',
                    isChecked ? 'bg-[#ff5a3c] border-[#ff5a3c]' : 'border-slate-300 bg-white'
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

