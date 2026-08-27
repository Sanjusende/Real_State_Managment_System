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
  Star,
  Home as HomeIcon,
  ArrowRight,
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
    description,
    thumbnail,
    images = [],
    isFeatured,
    isVerified,
    agent,
    owner,
  } = property;

  const favorite = isFavorite(_id);
  const imageUrl =
    thumbnail ||
    (images && images.length > 0 ? images[0].url || images[0] : null) ||
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';

  const destination = slug ? `/properties/${slug}` : `/properties/${_id}`;

  const agentAvatar =
    agent?.avatar ||
    owner?.avatar ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';

  const agentName = agent?.name || owner?.name || 'Verified Advisor';

  const shortDesc =
    description ||
    'It is a long established fact that a reader will be distracted by readable content.';

  if (layout === 'list') {
    return (
      <div
        className={clsx(
          'group rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-[#ff5a3c]/40 transition-all duration-300 flex flex-col md:flex-row items-stretch',
          className
        )}
      >
        {/* Image Container */}
        <div className="relative md:w-80 h-64 md:h-auto flex-shrink-0 overflow-hidden bg-slate-100">
          <img
            src={imageUrl}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            onError={(e) => {
              e.target.src =
                'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';
            }}
          />

          {/* Favorite Toggle Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(property);
            }}
            className={clsx(
              'absolute top-3.5 right-3.5 w-9 h-9 rounded-full backdrop-blur-md transition-all duration-200 z-10 cursor-pointer flex items-center justify-center shadow-md',
              favorite
                ? 'bg-[#ff5a3c] text-white'
                : 'bg-white/80 text-slate-700 hover:bg-white hover:scale-105'
            )}
            title={favorite ? 'Remove from favorites' : 'Save property'}
          >
            <Heart className={clsx('w-4 h-4', favorite && 'fill-current text-white')} />
          </button>
        </div>

        {/* Content Details */}
        <div className="p-6 flex flex-col flex-1 justify-between gap-4">
          <div>
            {/* Rating Stars matching reference */}
            <div className="flex items-center gap-1.5 text-amber-400 mb-1.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-3.5 h-3.5 fill-current" />
              ))}
              <span className="text-xs font-bold text-slate-500 ml-1">5.0 (1)</span>
            </div>

            <Link to={destination} className="block group-hover:text-[#ff5a3c] transition">
              <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-1 mb-1">
                {title}
              </h3>
            </Link>

            <p className="flex items-center gap-1.5 text-xs font-medium text-slate-400 line-clamp-1 mb-2">
              <MapPin className="w-3.5 h-3.5 text-[#ff5a3c] flex-shrink-0" />
              <span>
                {address ? `${address}, ` : ''}
                {city}, {state}
              </span>
            </p>

            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
              {shortDesc}
            </p>
          </div>

          {/* Specs & Bottom Row */}
          <div>
            <div className="pt-3 border-t border-slate-100 flex items-center gap-6 text-xs text-slate-600 mb-4 font-medium">
              <div className="flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-bold text-slate-900">{formatArea(area, areaUnit)}</span>
              </div>
              {bedrooms > 0 && (
                <div className="flex items-center gap-1.5">
                  <Bed className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-bold text-slate-900">{bedrooms}</span>
                  <span className="text-slate-400">Bed</span>
                </div>
              )}
              {bathrooms > 0 && (
                <div className="flex items-center gap-1.5">
                  <Bath className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-bold text-slate-900">{bathrooms}</span>
                  <span className="text-slate-400">Bath</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-lg font-extrabold text-slate-900">
                {formatPrice(price, priceUnit)}
                {listingType === 'RENT' && <span className="text-xs text-slate-400 font-normal"> /mo</span>}
              </span>

              <Link
                to={destination}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0b1528] hover:bg-[#ff5a3c] text-white text-xs font-bold transition shadow-sm"
              >
                <HomeIcon className="w-3.5 h-3.5" />
                <span>Details</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default Grid Layout - Exactly matching Reference UI Card
  return (
    <div
      className={clsx(
        'group rounded-3xl bg-white border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-[#ff5a3c]/30 transition-all duration-300 flex flex-col justify-between h-full relative',
        className
      )}
    >
      {/* Top Image Section */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100 rounded-t-3xl">
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          onError={(e) => {
            e.target.src =
              'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Favorite Button on top right */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(property);
          }}
          className={clsx(
            'absolute top-3.5 right-3.5 w-8 h-8 rounded-full backdrop-blur-md transition-all duration-200 z-10 cursor-pointer flex items-center justify-center shadow-md',
            favorite
              ? 'bg-[#ff5a3c] text-white'
              : 'bg-white/70 text-slate-700 hover:bg-white hover:scale-105'
          )}
          title={favorite ? 'Remove from favorites' : 'Save property'}
        >
          <Heart className={clsx('w-3.5 h-3.5', favorite && 'fill-current text-white')} />
        </button>

        {/* Overlapping Agent Avatar in bottom right corner of image */}
        <div className="absolute -bottom-4 right-4 z-10">
          <div className="relative group/agent">
            <img
              src={agentAvatar}
              alt={agentName}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-md"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full ring-1 ring-white" />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 pt-6 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Star Rating Row */}
          <div className="flex items-center gap-1 text-amber-400 mb-1.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-3 h-3 fill-current" />
            ))}
            <span className="text-[11px] font-bold text-slate-400 ml-1">5.0 (1)</span>
          </div>

          {/* Title */}
          <Link to={destination} className="block group-hover:text-[#ff5a3c] transition">
            <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-1 mb-1">
              {title}
            </h3>
          </Link>

          {/* Location */}
          <p className="flex items-center gap-1 text-xs text-slate-400 line-clamp-1 mb-2">
            <MapPin className="w-3.5 h-3.5 text-[#ff5a3c] flex-shrink-0" />
            <span>
              {address ? `${address}, ` : ''}
              {city}, {state}
            </span>
          </p>

          {/* Short Description */}
          <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed font-normal">
            {shortDesc}
          </p>
        </div>

        {/* Specs and Details Button */}
        <div>
          {/* Specs Row: sqft, Bed, Bath with clean icons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 mb-3 font-medium">
            <div className="flex items-center gap-1" title="Property Area">
              <Maximize2 className="w-3 h-3 text-slate-400" />
              <span className="font-bold text-slate-900">{formatArea(area, areaUnit)}</span>
            </div>
            {bedrooms > 0 && (
              <div className="flex items-center gap-1" title={`${bedrooms} Bedrooms`}>
                <Bed className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-bold text-slate-900">{bedrooms}</span>
                <span className="text-slate-400">Bed</span>
              </div>
            )}
            {bathrooms > 0 && (
              <div className="flex items-center gap-1" title={`${bathrooms} Bathrooms`}>
                <Bath className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-bold text-slate-900">{bathrooms}</span>
                <span className="text-slate-400">Bath</span>
              </div>
            )}
          </div>

          {/* Bottom Bar: Price on Left, Dark Navy Details Button on Right */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-base font-extrabold text-slate-950">
              {formatPrice(price, priceUnit)}
              {listingType === 'RENT' && <span className="text-[10px] text-slate-400 font-normal"> /mo</span>}
            </span>

            <Link
              to={destination}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-[#0b1528] hover:bg-[#ff5a3c] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <HomeIcon className="w-3 h-3" />
              <span>Details</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

