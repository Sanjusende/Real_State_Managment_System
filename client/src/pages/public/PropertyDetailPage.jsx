import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Bed,
  Bath,
  Maximize2,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
  ShieldCheck,
  Heart,
  Share2,
  Phone,
  Mail,
  Building,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Send,
  ArrowLeft,
  Compass,
  Check,
  Star,
  Flag,
  Trash2,
  MessageSquare,
  AlertTriangle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { formatPrice, formatArea, formatDate, formatStatus } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import { PropertyDetailSkeleton } from '../../components/common/LoadingSkeleton';
import PropertyCard from '../../components/property/PropertyCard';
import Button from '../../components/common/Button';
import FormInput from '../../components/common/FormInput';
import Modal from '../../components/common/Modal';
import { recordRecentlyViewed } from '../../utils/recentViews';
import {
  getPropertyBySlug,
  getProperties,
  sendPropertyEnquiry,
} from '../../services/propertyService';
import {
  getPropertyReviews,
  submitReview,
  deleteReview,
} from '../../services/reviewService';
import { submitReport } from '../../services/reportService';
import clsx from 'clsx';

export default function PropertyDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [property, setProperty] = useState(null);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);

  // Enquiry form state
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submittingEnquiry, setSubmittingEnquiry] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingBreakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  // Report listing state
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportForm, setReportForm] = useState({
    reason: 'INCORRECT_INFORMATION',
    description: '',
  });
  const [submittingReport, setSubmittingReport] = useState(false);

  const loadReviews = async (propertyIdOrSlug) => {
    setLoadingReviews(true);
    try {
      const res = await getPropertyReviews(propertyIdOrSlug);
      if (res?.data) {
        setReviews(res.data.reviews || []);
        if (res.data.stats) {
          setReviewStats(res.data.stats);
        }
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getPropertyBySlug(slug);
        if (res?.data) {
          const propData = res.data;
          setProperty(propData);
          setActiveImageIndex(0);
          recordRecentlyViewed(propData);
          loadReviews(propData._id || slug);

          // Set default enquiry message
          setEnquiryForm((prev) => ({
            ...prev,
            message: `Hi, I am interested in "${propData.title}" in ${propData.city}. Please share more details and arrange a site visit.`,
          }));

          // Fetch similar properties in the same city or category
          try {
            const simRes = await getProperties({
              city: propData.city,
              propertyType: propData.propertyType,
              limit: 3,
            });
            if (simRes?.data?.properties) {
              setSimilarProperties(
                simRes.data.properties.filter((p) => p._id !== propData._id)
              );
            }
          } catch {}
        } else {
          setError('Property not found');
        }
      } catch (err) {
        console.error('Failed to load property details:', err);
        setError(err.message || 'Property not found or pending approval.');
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property?.title || 'Real Estate Listing',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Property link copied to clipboard!');
    }
  };

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    if (!enquiryForm.name || !enquiryForm.email || !enquiryForm.phone) {
      toast.error('Please fill in your name, email, and phone number.');
      return;
    }

    setSubmittingEnquiry(true);
    try {
      await sendPropertyEnquiry(property._id, enquiryForm);
      toast.success('Your inquiry has been sent to the verified agent!');
      setEnquiryModalOpen(false);
    } catch {
      toast.error('Failed to submit enquiry. Please try again.');
    } finally {
      setSubmittingEnquiry(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please sign in to rate and review this property.');
      navigate('/login');
      return;
    }

    if (!reviewForm.comment.trim()) {
      toast.error('Please write a short review comment.');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await submitReview(property._id, reviewForm);
      toast.success(res?.message || 'Review submitted successfully!');
      setReviewForm({ rating: 5, comment: '' });
      loadReviews(property._id);
    } catch (err) {
      toast.error(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      toast.success('Your review has been removed.');
      loadReviews(property._id);
    } catch (err) {
      toast.error(err.message || 'Failed to delete review');
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please sign in to report a listing issue.');
      navigate('/login');
      return;
    }

    if (!reportForm.description.trim()) {
      toast.error('Please explain the issue.');
      return;
    }

    setSubmittingReport(true);
    try {
      await submitReport({
        propertyId: property._id,
        reason: reportForm.reason,
        description: reportForm.description,
      });
      toast.success('Report submitted. EstateCraft moderation will review this listing.');
      setReportModalOpen(false);
      setReportForm({ reason: 'INCORRECT_INFORMATION', description: '' });
    } catch (err) {
      toast.error(err.message || 'Failed to submit report');
    } finally {
      setSubmittingReport(false);
    }
  };

  if (loading) {
    return <PropertyDetailSkeleton />;
  }

  if (error || !property) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Property Unavailable</h2>
        <p className="text-sm text-slate-500 mb-6">{error || 'This listing does not exist.'}</p>
        <Link to="/properties">
          <Button variant="primary" size="md">
            Browse Other Properties
          </Button>
        </Link>
      </div>
    );
  }

  const images = property.images && property.images.length > 0
    ? property.images.map((img) => img.url || img)
    : [property.thumbnail || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80'];

  const agentContact = property.agent || property.owner;
  const favorite = isFavorite(property._id);

  return (
    <div className="min-h-screen bg-slate-50 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Navigation Bar */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-700 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Listings</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setReportModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:text-red-600 hover:border-red-200 hover:bg-red-50/50 transition cursor-pointer"
              title="Report listing issues"
            >
              <Flag className="w-3.5 h-3.5 text-slate-400" />
              <span>Report</span>
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
            <button
              type="button"
              onClick={() => toggleFavorite(property)}
              className={clsx(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer',
                favorite
                  ? 'bg-red-50 text-red-600 border-red-200'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              )}
            >
              <Heart className={clsx('w-3.5 h-3.5', favorite && 'fill-current text-red-500')} />
              <span>{favorite ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* Top Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-emerald-600 text-white shadow-xs">
                  For {property.listingType}
                </span>
                <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-slate-900 text-white shadow-xs">
                  {property.propertyType}
                </span>
                {property.isFeatured && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold uppercase bg-amber-400 text-slate-900">
                    <Sparkles className="w-3.5 h-3.5" /> Featured
                  </span>
                )}
                {property.isVerified && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold uppercase bg-emerald-500 text-white">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Listing
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-2">
                {property.title}
              </h1>

              {/* Location */}
              <p className="flex items-center gap-1.5 text-sm text-slate-500">
                <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>
                  {property.address ? `${property.address}, ` : ''}
                  {property.city}, {property.state} {property.pincode ? `- ${property.pincode}` : ''}
                </span>
              </p>
            </div>

            {/* Price Box */}
            <div className="lg:text-right flex-shrink-0 bg-emerald-50/60 border border-emerald-100 p-5 rounded-2xl">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                {property.listingType === 'RENT' ? 'Rental Price' : 'Asking Price'}
              </span>
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 block">
                {formatPrice(property.price, property.priceUnit)}
                {property.listingType === 'RENT' && (
                  <span className="text-sm font-normal text-slate-500"> /month</span>
                )}
              </span>
              <span className="text-xs text-slate-500 mt-1 block">
                Estimated ₹{Math.round(property.price / (property.area || 1)).toLocaleString('en-IN')} / {property.areaUnit || 'sqft'}
              </span>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="mb-10">
          <div className="relative rounded-3xl overflow-hidden bg-slate-950 h-[360px] md:h-[500px] shadow-lg group">
            <img
              src={images[activeImageIndex]}
              alt={property.title}
              className="w-full h-full object-cover cursor-pointer transition-all duration-300"
              onClick={() => setGalleryModalOpen(true)}
            />

            {/* Left/Right Arrow Overlays */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/60 text-white hover:bg-slate-900 backdrop-blur-md transition cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/60 text-white hover:bg-slate-900 backdrop-blur-md transition cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Image Counter & Fullscreen trigger */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold shadow-md">
                {activeImageIndex + 1} / {images.length} Photos
              </span>
              <button
                type="button"
                onClick={() => setGalleryModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition cursor-pointer"
              >
                View Full Gallery
              </button>
            </div>
          </div>

          {/* Thumbnails Row */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto py-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={clsx(
                    'w-20 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition cursor-pointer',
                    activeImageIndex === idx
                      ? 'border-emerald-600 scale-105 shadow-sm'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  )}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Content Layout: Specs & Content vs Agent Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Left 2 Columns: Specs, Description, Amenities */}
          <div className="lg:col-span-2 space-y-10">
            {/* Key Specifications Grid */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-6">Property Overview</h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <Bed className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Bedrooms</span>
                    <span className="text-sm font-bold text-slate-900">
                      {property.bedrooms > 0 ? `${property.bedrooms} BHK` : 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <Bath className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Bathrooms</span>
                    <span className="text-sm font-bold text-slate-900">
                      {property.bathrooms > 0 ? `${property.bathrooms} Baths` : 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <Maximize2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Super Area</span>
                    <span className="text-sm font-bold text-slate-900">
                      {formatArea(property.area, property.areaUnit)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Floor</span>
                    <span className="text-sm font-bold text-slate-900">
                      {property.floor || 'G'} of {property.totalFloors || 1}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Furnishing</span>
                    <span className="text-sm font-bold text-slate-900">
                      {formatStatus(property.furnishingStatus)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Construction</span>
                    <span className="text-sm font-bold text-slate-900">
                      {formatStatus(property.constructionStatus)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Possession</span>
                    <span className="text-sm font-bold text-slate-900">
                      {property.possessionDate ? formatDate(property.possessionDate) : 'Immediate'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                    <Eye className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Listing Views</span>
                    <span className="text-sm font-bold text-slate-900">
                      {property.views || 1} Views
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Detailed Description</h2>
              <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {property.description}
              </div>
            </div>

            {/* Amenities Grid */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Features & Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.map((amenity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-800"
                    >
                      <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ratings & Reviews Section */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-sm space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500 fill-current" />
                    <span>Client Ratings & Reviews ({reviewStats.totalReviews})</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Authentic feedback from verified buyers, tenants, and property visitors.
                  </p>
                </div>
              </div>

              {/* Rating Summary & Breakdown Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-2xl bg-slate-50 border border-slate-100 items-center">
                {/* Score */}
                <div className="text-center md:border-r border-slate-200/80 pr-4">
                  <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 block leading-tight">
                    {reviewStats.averageRating > 0 ? reviewStats.averageRating : '—'}
                  </span>
                  <div className="flex items-center justify-center text-amber-500 my-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={clsx(
                          'w-4 h-4',
                          star <= Math.round(reviewStats.averageRating)
                            ? 'fill-current text-amber-500'
                            : 'text-slate-300'
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-slate-500">
                    Based on {reviewStats.totalReviews} {reviewStats.totalReviews === 1 ? 'review' : 'reviews'}
                  </span>
                </div>

                {/* Star Percentage Bars */}
                <div className="md:col-span-2 space-y-2 text-xs">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = reviewStats.ratingBreakdown?.[star] || 0;
                    const percent =
                      reviewStats.totalReviews > 0
                        ? Math.round((count / reviewStats.totalReviews) * 100)
                        : 0;
                    return (
                      <div key={star} className="flex items-center gap-3">
                        <span className="w-12 font-bold text-slate-600 flex items-center gap-1">
                          {star} <Star className="w-3 h-3 fill-current text-amber-500" />
                        </span>
                        <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="w-12 text-right text-slate-400 font-semibold">{percent}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Add / Update Review Form */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  {isAuthenticated ? 'Leave Your Rating & Experience' : 'Sign In to Review This Property'}
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Rate your inspection experience, pricing transparency, or neighbourhood impressions.
                </p>

                {isAuthenticated ? (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Your Rating
                      </label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                            className="p-1 text-slate-300 hover:text-amber-400 transition cursor-pointer"
                          >
                            <Star
                              className={clsx(
                                'w-6 h-6 transition-transform hover:scale-110',
                                star <= reviewForm.rating
                                  ? 'text-amber-500 fill-current'
                                  : 'text-slate-300'
                              )}
                            />
                          </button>
                        ))}
                        <span className="text-xs font-bold text-slate-700 ml-2">
                          {reviewForm.rating} of 5 Stars
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Review Comment
                      </label>
                      <textarea
                        rows={3}
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                        placeholder="Describe your tour, locality advantages, building maintenance, or agent support..."
                        className="w-full text-xs rounded-xl border border-slate-200 bg-white p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
                        required
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        variant="primary"
                        size="sm"
                        loading={submittingReview}
                      >
                        Submit Review
                      </Button>
                    </div>
                  </form>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/login')}
                  >
                    Sign In to Write a Review
                  </Button>
                )}
              </div>

              {/* Reviews List */}
              <div className="space-y-4 pt-2">
                {loadingReviews ? (
                  <div className="space-y-3">
                    {[1, 2].map((i) => (
                      <div key={i} className="h-20 bg-slate-50 rounded-2xl animate-pulse" />
                    ))}
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs">
                    No reviews yet for this listing. Be the first to leave feedback!
                  </div>
                ) : (
                  reviews.map((rev) => (
                    <div
                      key={rev._id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 hover:border-slate-200 transition"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                            {rev.user?.avatar ? (
                              <img src={rev.user.avatar} alt="" className="w-full h-full object-cover rounded-full" />
                            ) : (
                              rev.user?.name?.charAt(0)?.toUpperCase() || 'U'
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 text-xs block">{rev.user?.name || 'Verified Buyer'}</span>
                            <span className="text-[10px] text-slate-400 block">{formatDate(rev.createdAt)}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center text-amber-500">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={clsx(
                                  'w-3.5 h-3.5',
                                  star <= rev.rating ? 'fill-current text-amber-500' : 'text-slate-300'
                                )}
                              />
                            ))}
                          </div>

                          {(user?._id === rev.user?._id || user?.role === 'ADMIN') && (
                            <button
                              type="button"
                              onClick={() => handleDeleteReview(rev._id)}
                              className="p-1 text-slate-400 hover:text-red-600 rounded-lg transition cursor-pointer"
                              title="Delete Review"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed pl-11">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar: Agent Contact & Direct Action */}
          <div className="lg:col-span-1 space-y-6 sticky top-28">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-5 pb-5 border-b border-slate-100">
                <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white flex items-center justify-center text-xl font-bold flex-shrink-0 shadow-sm">
                  {agentContact?.name?.charAt(0)?.toUpperCase() || 'A'}
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider block">
                    Verified Agent / Owner
                  </span>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {agentContact?.name || 'EstateCraft Advisor'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {agentContact?.agencyName || 'EstateCraft Premier Partner'}
                  </p>
                </div>
              </div>

              {/* Direct Info */}
              <div className="space-y-3 mb-6 text-xs text-slate-700">
                {agentContact?.phone && (
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50">
                    <Phone className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold">{agentContact.phone}</span>
                  </div>
                )}
                {agentContact?.email && (
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50">
                    <Mail className="w-4 h-4 text-emerald-600" />
                    <span className="truncate">{agentContact.email}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <Button
                  onClick={() => setEnquiryModalOpen(true)}
                  variant="primary"
                  size="md"
                  icon={Send}
                  className="w-full"
                >
                  Send Inquiry / Book Visit
                </Button>

                {agentContact?._id && (
                  <Link
                    to={`/agents/${agentContact._id}`}
                    className="block w-full text-center py-2.5 text-xs font-bold text-slate-700 hover:text-emerald-700 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
                  >
                    View Agent Profile
                  </Link>
                )}
              </div>
            </div>

            {/* Trust Assurance Card */}
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 text-xs text-emerald-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Buyer Protection Guarantee</span>
              </div>
              <p className="text-[11px] text-emerald-700 leading-relaxed">
                Direct transparent negotiations, zero advance fees, and guaranteed property verification by EstateCraft legal consultants.
              </p>
            </div>
          </div>
        </div>

        {/* Similar Properties Section */}
        {similarProperties.length > 0 && (
          <div className="mt-20 pt-12 border-t border-slate-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block mb-1">
                  Recommendations
                </span>
                <h2 className="text-2xl font-bold text-slate-900">Similar Properties in {property.city}</h2>
              </div>
              <Link
                to={`/properties?city=${property.city}`}
                className="text-xs font-bold text-emerald-700 hover:underline"
              >
                View More in {property.city} &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarProperties.map((p) => (
                <PropertyCard key={p._id} property={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Gallery Modal */}
      <Modal
        isOpen={galleryModalOpen}
        onClose={() => setGalleryModalOpen(false)}
        title={`${property.title} - Photo Gallery`}
        maxWidth="max-w-4xl"
      >
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 h-[450px]">
            <img
              src={images[activeImageIndex]}
              alt=""
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto py-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={clsx(
                  'w-20 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 cursor-pointer',
                  activeImageIndex === idx ? 'border-emerald-500 scale-105' : 'opacity-60 hover:opacity-100'
                )}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </Modal>

      {/* Contact / Inquiry Modal */}
      <Modal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        title="Schedule Site Visit & Inquiry"
        subtitle={`Connecting you directly with ${agentContact?.name || 'verified listing agent'}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleEnquirySubmit} className="space-y-4">
          <FormInput
            label="Your Full Name"
            name="name"
            value={enquiryForm.name}
            onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
            placeholder="John Doe"
            required
          />

          <FormInput
            label="Email Address"
            name="email"
            type="email"
            value={enquiryForm.email}
            onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
            placeholder="john@example.com"
            required
          />

          <FormInput
            label="Phone Number"
            name="phone"
            type="tel"
            value={enquiryForm.phone}
            onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
            placeholder="+91 98765 43210"
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Custom Message
            </label>
            <textarea
              rows={3}
              value={enquiryForm.message}
              onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
              className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={submittingEnquiry}
              className="w-full"
            >
              Submit Inquiry
            </Button>
          </div>
        </form>
      </Modal>

      {/* Report Listing Modal */}
      <Modal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        title="Report Property Listing"
        subtitle="Help EstateCraft maintain marketplace trust & safety"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleReportSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Reason for Report
            </label>
            <select
              value={reportForm.reason}
              onChange={(e) => setReportForm({ ...reportForm, reason: e.target.value })}
              className="w-full text-xs font-bold rounded-xl border border-slate-200 p-2.5 text-slate-900 cursor-pointer"
            >
              <option value="INCORRECT_INFORMATION">Incorrect Price, Area, or Photos</option>
              <option value="FRAUD_OR_SCAM">Suspected Fraud or Scam</option>
              <option value="SPAM_OR_DUPLICATE">Duplicate or Spam Listing</option>
              <option value="OFFENSIVE_CONTENT">Inappropriate or Offensive Details</option>
              <option value="UNRESPONSIVE_AGENT">Unresponsive Agent / Wrong Phone</option>
              <option value="ALREADY_SOLD">Property is Already Sold / Rented</option>
              <option value="OTHER">Other Issues</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Explanation & Details
            </label>
            <textarea
              rows={4}
              value={reportForm.description}
              onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
              placeholder="Please provide specific details explaining the issue so our moderation team can investigate..."
              className="w-full text-xs rounded-xl border border-slate-200 p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setReportModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="danger"
              size="sm"
              loading={submittingReport}
            >
              Submit Report
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
