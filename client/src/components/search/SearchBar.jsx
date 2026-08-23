import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Home,
  IndianRupee,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';
import Button from '../common/Button';
import clsx from 'clsx';

const CITIES = ['Bhopal', 'Indore', 'Mumbai', 'Pune', 'Bengaluru', 'Delhi'];
const PROPERTY_TYPES = [
  { value: '', label: 'All Property Types' },
  { value: 'APARTMENT', label: 'Apartment / Flat' },
  { value: 'VILLA', label: 'Luxury Villa' },
  { value: 'HOUSE', label: 'Independent House' },
  { value: 'COMMERCIAL', label: 'Commercial Space' },
  { value: 'OFFICE', label: 'Corporate Office' },
  { value: 'PLOT', label: 'Residential Plot' },
  { value: 'PENTHOUSE', label: 'Penthouse' },
  { value: 'STUDIO', label: 'Studio Apartment' },
];

const PRICE_RANGES = [
  { label: 'Any Price Range', min: '', max: '' },
  { label: 'Under ₹ 30 Lakh', min: '', max: '3000000' },
  { label: '₹ 30 L - ₹ 60 L', min: '3000000', max: '6000000' },
  { label: '₹ 60 L - ₹ 1.5 Cr', min: '6000000', max: '15000000' },
  { label: '₹ 1.5 Cr - ₹ 3 Cr', min: '15000000', max: '30000000' },
  { label: 'Above ₹ 3 Cr', min: '30000000', max: '' },
];

export default function SearchBar({
  initialValues = {},
  onSearch,
  showTabs = true,
  className = '',
}) {
  const navigate = useNavigate();
  const [listingType, setListingType] = useState(initialValues.listingType || 'SALE');
  const [keyword, setKeyword] = useState(initialValues.keyword || '');
  const [city, setCity] = useState(initialValues.city || '');
  const [propertyType, setPropertyType] = useState(initialValues.propertyType || '');
  const [priceIndex, setPriceIndex] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();

    const selectedRange = PRICE_RANGES[priceIndex];
    const params = {
      keyword: keyword.trim() || undefined,
      city: city || undefined,
      propertyType: propertyType || undefined,
      listingType: listingType || undefined,
      minPrice: selectedRange?.min || undefined,
      maxPrice: selectedRange?.max || undefined,
    };

    // Remove undefined
    const cleanQuery = Object.entries(params).reduce((acc, [k, v]) => {
      if (v) acc[k] = v;
      return acc;
    }, {});

    if (onSearch) {
      onSearch(cleanQuery);
    } else {
      const searchStr = new URLSearchParams(cleanQuery).toString();
      navigate(`/properties${searchStr ? `?${searchStr}` : ''}`);
    }
  };

  return (
    <div
      className={clsx(
        'w-full max-w-4xl mx-auto rounded-3xl bg-white p-3 md:p-4 shadow-2xl shadow-slate-900/10 border border-slate-100',
        className
      )}
    >
      {/* Search Tabs: Buy, Rent, Commercial */}
      {showTabs && (
        <div className="flex items-center gap-2 mb-3 px-2">
          <button
            type="button"
            onClick={() => setListingType('SALE')}
            className={clsx(
              'px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer',
              listingType === 'SALE'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            )}
          >
            Buy Property
          </button>
          <button
            type="button"
            onClick={() => setListingType('RENT')}
            className={clsx(
              'px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer',
              listingType === 'RENT'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            )}
          >
            Rent Flat / Villa
          </button>
          <button
            type="button"
            onClick={() => setListingType('LEASE')}
            className={clsx(
              'px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer',
              listingType === 'LEASE'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            )}
          >
            Commercial Lease
          </button>
        </div>
      )}

      {/* Main Search Inputs Grid */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 items-center">
          {/* Keyword / Location Search */}
          <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100 transition">
            <Search className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search address, project, or title..."
              className="w-full text-xs md:text-sm bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none"
            />
          </div>

          {/* City Selection */}
          <div className="relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100 transition">
            <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full text-xs md:text-sm bg-transparent text-slate-800 focus:outline-none appearance-none cursor-pointer"
            >
              <option value="">All Cities</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-3" />
          </div>

          {/* Property Type Selection */}
          <div className="relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100 transition">
            <Home className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full text-xs md:text-sm bg-transparent text-slate-800 focus:outline-none appearance-none cursor-pointer"
            >
              {PROPERTY_TYPES.map((pt) => (
                <option key={pt.value} value={pt.value}>
                  {pt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-3" />
          </div>

          {/* Submit Search Button */}
          <div>
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={Search}
              className="w-full !rounded-2xl !py-3 font-bold"
            >
              Search Properties
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
