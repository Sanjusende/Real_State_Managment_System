import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bed,
  Bath,
  Maximize2,
  MapPin,
  Heart,
  Sparkles,
  ShieldCheck,
  Eye,
  ArrowUpRight,
} from 'lucide-react';
import { formatPrice, formatArea } from '../../utils/formatters';
import { useFavorites } from '../../context/FavoritesContext';
import clsx from 'clsx';

export default function PropertyCard({
  property,
  layout = 'grid', // 'grid' or 'list'
  className = '',
}) {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();

  if (!property) return null;

  const {
    _id,
    title,
    slug,
    propertyType,
    listingType,
    price,
    priceUnit,
    area,
    areaUnit,
    bedrooms,
    bathrooms,
    address,
    city,
    state,
    thumbnail,
    images = [],
    isFeatured,
    isVerified,
    views = 0,
  } = property;

  const favorite = isFavorite(_id);
  const imageUrl =
    thumbnail ||
    (images && images.length > 0 ? images[0].url || images[0] : null) ||
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80';

  const destination = slug ? `/properties/${slug}` : `/properties/${_id}`;

  const listingBadgeColors = {
    SALE: 'bg-emerald-600 text-white',
    RENT: 'bg-blue-600 text-white',
    LEASE: 'bg-purple-600 text-white',
  }[listingType] || 'bg-slate-700 text-white';

  if (layout === 'list') {
    return (
      <div
        className={clsx(
          'group rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-md hover:border-emerald-300/80 transition-all duration-200 flex flex-col md:flex-row',
          className
        )}
      >
        {/* Image Container */}
        <div className="relative md:w-72 h-56 md:h-auto flex-shrink-0 overflow-hidden bg-slate-100">
          <img
            src={imageUrl}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src =
                'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80';
            }}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
            <span
              className={clsx(
                'px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm',
                listingBadgeColors
              )}
            >
              For {listingType}
            </span>
            {isFeatured && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold uppercase bg-amber-500 text-slate-900 shadow-sm">
                <Sparkles className="w-3 h-3" /> Featured
              </span>
            )}
            {isVerified && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold uppercase bg-emerald-500 text-white shadow-sm">
                <ShieldCheck className="w-3 h-3" /> Verified
              </span>
            )}
          </div>

          {/* Favorite Toggle Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(property);
            }}
            className={clsx(
              'absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-150 z-10 cursor-pointer',
              favorite
                ? 'bg-red-500 text-white shadow-md'
                : 'bg-slate-900/40 text-white hover:bg-slate-900/70'
            )}
            title={favorite ? 'Remove from favorites' : 'Save property'}
          >
            <Heart className={clsx('w-4 h-4', favorite && 'fill-current')} />
          </button>
        </div>

        {/* Content Details */}
        <div className="p-5 flex flex-col flex-1 justify-between gap-4">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
                {propertyType}
              </span>
              <span className="text-lg font-extrabold text-slate-900">
                {formatPrice(price, priceUnit)}
                {listingType === 'RENT' && (
                  <span className="text-xs font-normal text-slate-500"> /mo</span>
                )}
              </span>
            </div>

            <Link to={destination} className="block group-hover:text-emerald-700 transition">
              <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-1 mb-1.5">
                {title}
              </h3>
            </Link>

            <p className="flex items-center gap-1.5 text-xs text-slate-500 line-clamp-1 mb-3">
              <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span>
                {address ? `${address}, ` : ''}
                {city}, {state}
              </span>
            </p>
          </div>

          {/* Specs & Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-xs text-slate-600">
              {bedrooms > 0 && (
                <div className="flex items-center gap-1" title={`${bedrooms} Bedrooms`}>
                  <Bed className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold text-slate-800">{bedrooms}</span>
                  <span className="text-slate-400 hidden sm:inline">Beds</span>
                </div>
              )}
              {bathrooms > 0 && (
                <div className="flex items-center gap-1" title={`${bathrooms} Bathrooms`}>
                  <Bath className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold text-slate-800">{bathrooms}</span>
                  <span className="text-slate-400 hidden sm:inline">Baths</span>
                </div>
              )}
              <div className="flex items-center gap-1" title="Property Area">
                <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-slate-800">
                  {formatArea(area, areaUnit)}
                </span>
              </div>
            </div>

            <Link
              to={destination}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white text-xs font-semibold transition"
            >
              <span>Details</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Default Grid Layout
  return (
    <div
      className={clsx(
        'group rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-lg hover:border-emerald-300/80 transition-all duration-200 flex flex-col justify-between h-full',
        className
      )}
    >
      {/* Top Image Section */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-100">
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src =
              'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Badges Over Image */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
          <span
            className={clsx(
              'px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm',
              listingBadgeColors
            )}
          >
            For {listingType}
          </span>
          {isFeatured && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-amber-400 text-slate-900 shadow-sm">
              <Sparkles className="w-3 h-3" /> Featured
            </span>
          )}
          {isVerified && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-emerald-500 text-white shadow-sm">
              <ShieldCheck className="w-3 h-3" /> Verified
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(property);
          }}
          className={clsx(
            'absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-150 z-10 cursor-pointer shadow-sm',
            favorite
              ? 'bg-red-500 text-white'
              : 'bg-slate-900/40 text-white hover:bg-slate-900/70'
          )}
          title={favorite ? 'Remove from favorites' : 'Save property'}
        >
          <Heart className={clsx('w-4 h-4', favorite && 'fill-current')} />
        </button>

        {/* Category Pill on bottom right of image */}
        <div className="absolute bottom-2.5 right-2.5 z-10">
          <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold tracking-wide uppercase">
            {propertyType}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Price */}
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-xl font-extrabold text-slate-900">
              {formatPrice(price, priceUnit)}
              {listingType === 'RENT' && (
                <span className="text-xs font-normal text-slate-500"> /month</span>
              )}
            </span>
          </div>

          {/* Title */}
          <Link to={destination} className="block group-hover:text-emerald-700 transition">
            <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-1 mb-1.5">
              {title}
            </h3>
          </Link>

          {/* Location */}
          <p className="flex items-center gap-1.5 text-xs text-slate-500 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span>
              {address ? `${address}, ` : ''}
              {city}, {state}
            </span>
          </p>
        </div>

        {/* Specs and Details Button */}
        <div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 mb-3">
            {bedrooms > 0 && (
              <div className="flex items-center gap-1" title={`${bedrooms} Bedrooms`}>
                <Bed className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-slate-800">{bedrooms}</span> Beds
              </div>
            )}
            {bathrooms > 0 && (
              <div className="flex items-center gap-1" title={`${bathrooms} Bathrooms`}>
                <Bath className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-slate-800">{bathrooms}</span> Baths
              </div>
            )}
            <div className="flex items-center gap-1" title="Property Area">
              <Maximize2 className="w-3 h-3 text-slate-400" />
              <span className="font-semibold text-slate-800">
                {formatArea(area, areaUnit)}
              </span>
            </div>
          </div>

          <Link
            to={destination}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-emerald-600 text-slate-700 hover:text-white border border-slate-200 hover:border-emerald-600 font-semibold text-xs transition flex items-center justify-center gap-1.5"
          >
            <span>View Property</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
