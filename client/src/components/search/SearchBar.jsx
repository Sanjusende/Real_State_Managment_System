import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Home,
  ChevronDown,
  SlidersHorizontal,
  ArrowRight,
  Building,
} from 'lucide-react';
import clsx from 'clsx';

const CITIES = [
  'Bhopal',
  'Indore',
  'Jabalpur',
  'Balaghat',
  'Ujjain',
  'Mumbai',
  'California',
  'Florida',
  'New York',
  'Pune',
  'Bengaluru',
  'Delhi',
];

const CATEGORY_OPTIONS = [
  { value: '', label: 'Select Category' },
  { value: 'APARTMENT', label: 'Apartment' },
  { value: 'VILLA', label: 'Villa' },
  { value: 'COMMERCIAL', label: 'Commercial' },
  { value: 'OFFICE', label: 'Office' },
  { value: 'PLOT', label: 'Residential Plot' },
  { value: 'PENTHOUSE', label: 'Penthouse' },
  { value: 'STUDIO', label: 'Studio' },
];

export default function SearchBar({
  initialValues = {},
  onSearch,
  showTabs = true,
  showQuickPills = true,
  className = '',
}) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(initialValues.propertyType || 'VILLA');
  const [keyword, setKeyword] = useState(initialValues.keyword || '');
  const [category, setCategory] = useState(initialValues.propertyType || '');
  const [city, setCity] = useState(initialValues.city || '');
  const [listingType, setListingType] = useState(initialValues.listingType || 'SALE');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e) => {
    e?.preventDefault();

    const selectedType = category || (activeTab !== 'GENERAL' ? activeTab : undefined);

    const params = {
      keyword: keyword.trim() || undefined,
      city: city || undefined,
      propertyType: selectedType || undefined,
      listingType: listingType || undefined,
    };

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

  const handleTabClick = (tabKey) => {
    setActiveTab(tabKey);
    if (tabKey === 'GENERAL') {
      setCategory('');
    } else {
      setCategory(tabKey);
    }
  };

  const handleQuickPill = (typeKey, listingKey = 'SALE') => {
    navigate(`/properties?propertyType=${typeKey}&listingType=${listingKey}`);
  };

  return (
    <div className={clsx('w-full max-w-4xl mx-auto', className)}>
      {/* Search Container Card */}
      <div className="hero-search-glass rounded-3xl p-4 sm:p-6 shadow-2xl shadow-black/40 text-white">
        {/* Top Category Tabs matching reference: General | Villa | Apartment | Commercial */}
        {showTabs && (
          <div className="flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar">
            {[
              { label: 'General', key: 'GENERAL' },
              { label: 'Villa', key: 'VILLA' },
              { label: 'Apartment', key: 'APARTMENT' },
              { label: 'Commercial', key: 'COMMERCIAL' },
            ].map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => handleTabClick(tab.key)}
                  className={clsx(
                    'px-4 sm:px-5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex-shrink-0',
                    isActive
                      ? 'bg-[#ff5a3c] text-white shadow-md shadow-[#ff5a3c]/30'
                      : 'bg-white/10 text-slate-300 hover:bg-white/15 hover:text-white'
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Main Search Inputs in 1 Row */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
            {/* 1. Keyword / Looking For */}
            <div className="lg:col-span-4 bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 focus-within:border-[#ff5a3c] focus-within:bg-white/10 transition">
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-0.5">
                Keyword
              </label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Looking For?"
                className="w-full bg-transparent text-white placeholder-slate-400 text-xs sm:text-sm font-semibold focus:outline-none"
              />
            </div>

            {/* 2. Select Category Dropdown */}
            <div className="relative lg:col-span-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 focus-within:border-[#ff5a3c] focus-within:bg-white/10 transition">
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-0.5">
                Category
              </label>
              <div className="flex items-center justify-between">
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    if (e.target.value) setActiveTab(e.target.value);
                  }}
                  className="w-full bg-transparent text-white text-xs sm:text-sm font-semibold focus:outline-none appearance-none cursor-pointer"
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c.value} value={c.value} className="bg-[#0f1c34] text-white">
                      {c.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-3.5 bottom-3" />
              </div>
            </div>

            {/* 3. Location Dropdown / Input */}
            <div className="relative lg:col-span-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 focus-within:border-[#ff5a3c] focus-within:bg-white/10 transition">
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-0.5">
                Location
              </label>
              <div className="flex items-center justify-between">
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-transparent text-white text-xs sm:text-sm font-semibold focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="" className="bg-[#0f1c34] text-white">
                    Select Location
                  </option>
                  {CITIES.map((c) => (
                    <option key={c} value={c} className="bg-[#0f1c34] text-white">
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-3.5 bottom-3" />
              </div>
            </div>

            {/* 4. Action Buttons (More + Search) */}
            <div className="lg:col-span-2 flex items-center gap-2">
              {/* More Filter Toggle */}
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                title="More Filters"
                className={clsx(
                  'p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-center flex-shrink-0',
                  showAdvanced
                    ? 'bg-[#ff5a3c]/20 border-[#ff5a3c] text-[#ff5a3c]'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300'
                )}
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>

              {/* High-contrast Coral Orange Search Button */}
              <button
                type="submit"
                className="flex-1 py-3.5 px-4 rounded-2xl bg-[#ff5a3c] hover:bg-[#e04b30] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-[#ff5a3c]/30 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>
          </div>

          {/* Advanced Filter drawer */}
          {showAdvanced && (
            <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fade-in text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Listing Type</label>
                <div className="flex gap-2">
                  {['SALE', 'RENT', 'LEASE'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setListingType(type)}
                      className={clsx(
                        'px-3 py-1.5 rounded-xl font-bold flex-1 transition',
                        listingType === type
                          ? 'bg-[#ff5a3c] text-white'
                          : 'bg-white/5 text-slate-300 hover:bg-white/10'
                      )}
                    >
                      {type === 'SALE' ? 'Buy' : type === 'RENT' ? 'Rent' : 'Lease'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Quick Pills below Search Box matching reference: Commercial ->, Villa ->, Sales -> */}
      {showQuickPills && (
        <div className="flex items-center gap-3 mt-4 justify-start sm:justify-center overflow-x-auto no-scrollbar py-1">
          <button
            type="button"
            onClick={() => handleQuickPill('COMMERCIAL')}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-semibold backdrop-blur-md transition cursor-pointer flex-shrink-0"
          >
            <span>Commercial</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
          </button>
          <button
            type="button"
            onClick={() => handleQuickPill('VILLA')}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-semibold backdrop-blur-md transition cursor-pointer flex-shrink-0"
          >
            <span>Villa</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
          </button>
          <button
            type="button"
            onClick={() => handleQuickPill('APARTMENT', 'SALE')}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-semibold backdrop-blur-md transition cursor-pointer flex-shrink-0"
          >
            <span>Sales</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
          </button>
          <button
            type="button"
            onClick={() => handleQuickPill('APARTMENT', 'RENT')}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-semibold backdrop-blur-md transition cursor-pointer flex-shrink-0"
          >
            <span>Rentals</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
          </button>
        </div>
      )}
    </div>
  );
}

