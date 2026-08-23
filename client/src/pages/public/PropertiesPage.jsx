import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  SlidersHorizontal,
  Grid,
  List,
  Search,
  RotateCcw,
  Sparkles,
  ChevronDown,
  X,
} from 'lucide-react';
import PropertyCard from '../../components/property/PropertyCard';
import FilterPanel from '../../components/search/FilterPanel';
import Pagination from '../../components/common/Pagination';
import { PropertyGridSkeleton } from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { getProperties } from '../../services/propertyService';
import clsx from 'clsx';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest Listed' },
  { value: 'oldest', label: 'Oldest Listed' },
  { value: 'price-low-high', label: 'Price: Low to High' },
  { value: 'price-high-low', label: 'Price: High to Low' },
  { value: 'most-viewed', label: 'Most Popular / Viewed' },
];

export default function PropertiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract initial filters from searchParams
  const getFilterParams = useCallback(() => {
    return {
      keyword: searchParams.get('keyword') || searchParams.get('search') || '',
      city: searchParams.get('city') || '',
      state: searchParams.get('state') || '',
      propertyType: searchParams.get('propertyType') || '',
      listingType: searchParams.get('listingType') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      bedrooms: searchParams.get('bedrooms') || '',
      bathrooms: searchParams.get('bathrooms') || '',
      furnishingStatus: searchParams.get('furnishingStatus') || '',
      constructionStatus: searchParams.get('constructionStatus') || '',
      minArea: searchParams.get('minArea') || '',
      maxArea: searchParams.get('maxArea') || '',
      amenities: searchParams.get('amenities') || '',
      isFeatured: searchParams.get('isFeatured') || '',
      sort: searchParams.get('sort') || 'newest',
      page: parseInt(searchParams.get('page') || '1', 10),
      limit: parseInt(searchParams.get('limit') || '12', 10),
    };
  }, [searchParams]);

  const [filters, setFilters] = useState(getFilterParams());
  const [properties, setProperties] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0, page: 1, limit: 12 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [layout, setLayout] = useState('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state whenever URL searchParams change
  useEffect(() => {
    setFilters(getFilterParams());
  }, [searchParams, getFilterParams]);

  // Load properties based on current filters
  const loadProperties = useCallback(async (currentFilters) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getProperties(currentFilters);
      if (res?.data) {
        setProperties(res.data.properties || []);
        setPagination({
          total: res.data.total || 0,
          totalPages: res.data.totalPages || 0,
          page: res.data.page || 1,
          limit: res.data.limit || 12,
        });
      }
    } catch (err) {
      console.error('Failed to fetch properties:', err);
      setError(err.message || 'Failed to load properties. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProperties(filters);
  }, [filters, loadProperties]);

  // Handle filter changes and update URL search params
  const handleFilterChange = (newFilters) => {
    const updated = { ...filters, ...newFilters, page: 1 };
    const cleanParams = Object.entries(updated).reduce((acc, [k, v]) => {
      if (v !== '' && v !== undefined && v !== null) {
        acc[k] = v;
      }
      return acc;
    }, {});

    setSearchParams(cleanParams);
  };

  const handlePageChange = (newPage) => {
    const updated = { ...filters, page: newPage };
    const cleanParams = Object.entries(updated).reduce((acc, [k, v]) => {
      if (v !== '' && v !== undefined && v !== null) {
        acc[k] = v;
      }
      return acc;
    }, {});

    setSearchParams(cleanParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setSearchParams({});
  };

  const removeFilterTag = (key) => {
    const updated = { ...filters, [key]: '', page: 1 };
    const cleanParams = Object.entries(updated).reduce((acc, [k, v]) => {
      if (v !== '' && v !== undefined && v !== null) {
        acc[k] = v;
      }
      return acc;
    }, {});
    setSearchParams(cleanParams);
  };

  // Compute active filter pills
  const activeTags = [];
  if (filters.keyword) activeTags.push({ key: 'keyword', label: `Keyword: "${filters.keyword}"` });
  if (filters.city) activeTags.push({ key: 'city', label: `City: ${filters.city}` });
  if (filters.state) activeTags.push({ key: 'state', label: `State: ${filters.state}` });
  if (filters.propertyType) activeTags.push({ key: 'propertyType', label: `Type: ${filters.propertyType}` });
  if (filters.listingType) activeTags.push({ key: 'listingType', label: `For ${filters.listingType}` });
  if (filters.minPrice || filters.maxPrice) {
    activeTags.push({
      key: 'price',
      label: `Price: ${filters.minPrice ? `₹${filters.minPrice}` : '0'} - ${
        filters.maxPrice ? `₹${filters.maxPrice}` : 'Any'
      }`,
    });
  }
  if (filters.bedrooms) activeTags.push({ key: 'bedrooms', label: `${filters.bedrooms}+ Beds` });
  if (filters.bathrooms) activeTags.push({ key: 'bathrooms', label: `${filters.bathrooms}+ Baths` });
  if (filters.furnishingStatus) activeTags.push({ key: 'furnishingStatus', label: `Furnish: ${filters.furnishingStatus}` });
  if (filters.constructionStatus) activeTags.push({ key: 'constructionStatus', label: `Status: ${filters.constructionStatus}` });
  if (filters.amenities) activeTags.push({ key: 'amenities', label: `Amenities: ${filters.amenities}` });
  if (filters.isFeatured) activeTags.push({ key: 'isFeatured', label: `Featured Only` });

  return (
    <div className="min-h-screen bg-slate-50 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Properties for Sale & Rent
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            Browse our comprehensive database of verified residential homes, luxury duplexes, commercial offices, and clear-title plots.
          </p>
        </div>

        {/* Top Control Bar (Search, Count, Layout, Sort, Mobile Filter Button) */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 mb-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left: Quick Search Input & Count */}
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={filters.keyword || ''}
                onChange={(e) => handleFilterChange({ keyword: e.target.value })}
                placeholder="Search by city, title, or address..."
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 transition"
              />
            </div>

            <div className="hidden sm:block text-xs font-semibold text-slate-500 whitespace-nowrap">
              <span className="text-slate-900 font-bold">{pagination.total}</span> listings found
            </div>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center justify-between md:justify-end gap-3">
            {/* Mobile Filter Drawer Trigger */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-800 transition cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
              <span>Filters {activeTags.length > 0 && `(${activeTags.length})`}</span>
            </button>

            {/* Sorting Select */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500 hidden sm:inline">Sort:</span>
              <select
                value={filters.sort || 'newest'}
                onChange={(e) => handleFilterChange({ sort: e.target.value })}
                className="text-xs font-semibold text-slate-800 rounded-xl border border-slate-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Layout Toggle (Grid / List) */}
            <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-0.5">
              <button
                type="button"
                onClick={() => setLayout('grid')}
                className={clsx(
                  'p-1.5 rounded-lg transition cursor-pointer',
                  layout === 'grid'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-400 hover:text-slate-700'
                )}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setLayout('list')}
                className={clsx(
                  'p-1.5 rounded-lg transition cursor-pointer',
                  layout === 'list'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-400 hover:text-slate-700'
                )}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Pills Bar */}
        {activeTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-white rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-700 mr-1">Active Filters:</span>
            {activeTags.map((tag) => (
              <span
                key={tag.key}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/80"
              >
                <span>{tag.label}</span>
                <button
                  type="button"
                  onClick={() => removeFilterTag(tag.key)}
                  className="hover:text-red-600 transition cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-semibold text-slate-500 hover:text-red-600 underline ml-auto transition cursor-pointer"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Main Content Layout: Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-1 sticky top-28">
            <FilterPanel
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </div>

          {/* Properties Grid / List Area */}
          <div className="lg:col-span-3 space-y-6">
            {loading ? (
              <PropertyGridSkeleton count={6} />
            ) : error ? (
              <ErrorState message={error} onRetry={() => loadProperties(filters)} />
            ) : properties.length === 0 ? (
              <EmptyState onAction={handleResetFilters} />
            ) : (
              <>
                <div
                  className={clsx(
                    layout === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                      : 'flex flex-col space-y-4'
                  )}
                >
                  {properties.map((property) => (
                    <PropertyCard
                      key={property._id}
                      property={property}
                      layout={layout}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  totalItems={pagination.total}
                  limit={pagination.limit}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      <Modal
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        title="Search & Filter Listings"
        maxWidth="max-w-xl"
      >
        <FilterPanel
          filters={filters}
          onChange={(newFilters) => {
            handleFilterChange(newFilters);
          }}
          onReset={handleResetFilters}
          onCloseMobile={() => setMobileFilterOpen(false)}
          className="!border-0 !p-0 !shadow-none"
        />
        <div className="pt-4 mt-6 border-t border-slate-100">
          <Button
            onClick={() => setMobileFilterOpen(false)}
            variant="primary"
            size="md"
            className="w-full"
          >
            Apply Filters ({pagination.total} Found)
          </Button>
        </div>
      </Modal>
    </div>
  );
}
