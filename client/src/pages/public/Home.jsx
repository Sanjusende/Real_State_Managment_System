import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  ArrowRight,
  ShieldCheck,
  Award,
  Sparkles,
  MapPin,
  Search,
  Star,
  Home as HomeIcon,
  Play,
  X,
  Warehouse,
  Store,
  Hotel,
  Key,
  Compass,
  CheckCircle2,
  Layers,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import SearchBar from '../../components/search/SearchBar';
import PropertyCard from '../../components/property/PropertyCard';
import { PropertyGridSkeleton } from '../../components/common/LoadingSkeleton';
import Button from '../../components/common/Button';
import { getFeaturedProperties, getLatestProperties } from '../../services/propertyService';
import clsx from 'clsx';

// 5 Main Apartment / Property Categories matching Reference UI exactly
const REQUIREMENT_TYPES = [
  {
    name: 'Commercial',
    slug: 'COMMERCIAL',
    count: '6 Properties',
    icon: Store,
  },
  {
    name: 'Warehouse',
    slug: 'OFFICE',
    count: '6 Properties',
    icon: Warehouse,
  },
  {
    name: 'Villa',
    slug: 'VILLA',
    count: '6 Properties',
    icon: HomeIcon,
  },
  {
    name: 'Apartment',
    slug: 'APARTMENT',
    count: '6 Properties',
    icon: Hotel,
  },
  {
    name: 'Homestay',
    slug: 'PENTHOUSE',
    count: '6 Properties',
    icon: Sparkles,
  },
];

// Top Locations matching Reference UI & User Specifications
const TOP_LOCATIONS = [
  {
    name: 'Bhopal',
    tagline: 'Lakefront Villas & VIP Residential Corridors',
    propertiesCount: '18 Properties',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Indore',
    tagline: 'Super Corridor Townships & Smart City Penthouses',
    propertiesCount: '24 Properties',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Jabalpur',
    tagline: 'Marble City Residencies & Modern Commercial Hubs',
    propertiesCount: '14 Properties',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Balaghat',
    tagline: 'Green Valley Estates & Prime Residential Plots',
    propertiesCount: '8 Properties',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Ujjain',
    tagline: 'Heritage Townships & Spiritual Living Enclaves',
    propertiesCount: '11 Properties',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Mumbai',
    tagline: 'Sea-Facing Suites & High-Rise Skyline Penthouses',
    propertiesCount: '28 Properties',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'California',
    tagline: 'Luxury Properties With Conveniences',
    propertiesCount: '7 Properties',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Florida',
    tagline: 'Coastal Living & Beachfront Villas',
    propertiesCount: '9 Properties',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'New York',
    tagline: 'Skyline Penthouses & Duplexes',
    propertiesCount: '12 Properties',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
  },
];


const TESTIMONIALS = [
  {
    name: 'Rajesh & Meera Sharma',
    role: 'Homeowners in Arera Colony',
    comment:
      'EstateCraft made our dream 3BHK flat purchase completely stress-free. Every paper was legally verified before we even stepped foot on the property.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  },
  {
    name: 'Vikramaditya Oberoi',
    role: 'Commercial Real Estate Investor',
    comment:
      'Found a high-yield corporate floor in Bandra Kurla Complex within 2 weeks. The transparent zero-brokerage model saved us considerable capital.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  },
  {
    name: 'Ananya Deshmukh',
    role: 'Villa Owner in Indore',
    comment:
      'Sold our luxury duplex through a verified agent in under 20 days at full market valuation. Professional closure!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [latestProperties, setLatestProperties] = useState([]);
  const [listingFilterTab, setListingFilterTab] = useState('APARTMENT');
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingLatest, setLoadingLatest] = useState(true);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  useEffect(() => {
    // 1. Fetch Featured Properties
    const fetchFeatured = async () => {
      try {
        const res = await getFeaturedProperties(6);
        if (res?.data?.properties) {
          setFeaturedProperties(res.data.properties);
        }
      } catch (err) {
        console.error('Failed to load featured properties', err);
      } finally {
        setLoadingFeatured(false);
      }
    };

    // 2. Fetch Latest Properties
    const fetchLatest = async () => {
      try {
        const res = await getLatestProperties(6);
        if (res?.data?.properties) {
          setLatestProperties(res.data.properties);
        }
      } catch (err) {
        console.error('Failed to load latest properties', err);
      } finally {
        setLoadingLatest(false);
      }
    };

    fetchFeatured();
    fetchLatest();
  }, []);

  // Filter listings for the "Find Home Listing in Your Area" section
  const displayProperties = featuredProperties.length > 0 ? featuredProperties : latestProperties;
  const filteredListings = displayProperties.filter((p) => {
    if (listingFilterTab === 'GENERAL') return true;
    return (p.propertyType || '').toUpperCase() === listingFilterTab;
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#0b1528] text-white font-sans overflow-hidden">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Exact Reference UI: Luxury Villa Background + Play Video)*/}
      {/* ========================================================================= */}
      <section className="relative min-h-[90vh] lg:min-h-[95vh] pt-32 pb-20 flex flex-col justify-between overflow-hidden">
        {/* Full-width Luxury Villa Background with Gradient Overlays */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2071&q=80"
            alt="Luxury Architecture"
            className="w-full h-full object-cover object-center"
          />
          {/* Multi-tier dark gradient overlay for crystal clear contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b1528]/85 via-[#0b1528]/60 to-[#0b1528]" />
          <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#0b1528]/40 to-[#0b1528]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex-1 flex flex-col justify-center">
          {/* Top Row: Headline on Left, Rotating Play Video Badge on Right */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12 sm:mb-16">
            <div className="max-w-2xl space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08]">
                Let's Find Your <br />
                <span className="text-white">Dream House.</span>
              </h1>
            </div>

            {/* Circular Rotating "PLAY INTRO VIDEO" Badge matching Reference UI */}
            <div className="flex items-center justify-start md:justify-end">
              <button
                type="button"
                onClick={() => setVideoModalOpen(true)}
                className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center group cursor-pointer"
                title="Play Intro Video"
              >
                {/* SVG with Curved Rotating Text */}
                <svg
                  className="absolute inset-0 w-full h-full animate-spin-slow text-slate-300 group-hover:text-white transition-colors duration-300"
                  viewBox="0 0 100 100"
                >
                  <defs>
                    <path
                      id="circlePath"
                      d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                    />
                  </defs>
                  <text className="text-[9.5px] uppercase font-black tracking-[0.24em] fill-current">
                    <textPath href="#circlePath" startOffset="0%">
                      • PLAY INTRO VIDEO • PLAY INTRO VIDEO
                    </textPath>
                  </text>
                </svg>

                {/* Center Play Button with Glow */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-xl shadow-black/40 group-hover:scale-110 group-hover:bg-[#ff5a3c] group-hover:border-[#ff5a3c] transition-all duration-300">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
              </button>
            </div>
          </div>

          {/* Floating Dark Search & Filter Box */}
          <div className="w-full">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. SECTION 1: EXPLORE APARTMENT TYPES (Dark Section with 5 Category Cards)*/}
      {/* ========================================================================= */}
      <section className="py-20 bg-[#0b1528] border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Eyebrow and Heading matching Reference UI */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#ff5a3c] block mb-2">
              Property By Requirement
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Explore Apartment <span className="text-[#84cc16]">Types</span>
            </h2>
          </div>

          {/* 5 Category Outlined Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {REQUIREMENT_TYPES.map((item) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.name}
                  onClick={() => {
                    setListingFilterTab(item.slug);
                    navigate(`/properties?propertyType=${item.slug}`);
                  }}
                  className="group p-6 sm:p-8 rounded-3xl bg-[#0f1c34]/70 border border-white/10 hover:border-[#ff5a3c]/60 hover:bg-[#132342] transition-all duration-300 cursor-pointer flex flex-col items-center text-center shadow-lg hover:shadow-2xl hover:shadow-[#ff5a3c]/10 hover:-translate-y-1"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 group-hover:border-[#ff5a3c]/50 group-hover:bg-[#ff5a3c]/10 flex items-center justify-center text-slate-300 group-hover:text-[#ff5a3c] transition-all duration-300 mb-5">
                    <IconComp className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1 group-hover:text-[#ff5a3c] transition">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">{item.count}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SECTION 2: FIND HOME LISTING IN YOUR AREA (Light Section with 3 Cards) */}
      {/* ========================================================================= */}
      <section className="py-24 bg-[#ffffff] text-slate-900 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Row with Title on Left and Filter Tabs on Right */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#ff5a3c] block mb-1">
                Our Listing
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
                Find Home Listing <br className="hidden sm:inline" />
                in Your Area
              </h2>
            </div>

            {/* Filter Tabs matching Reference UI */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {[
                { label: 'Apartment', key: 'APARTMENT' },
                { label: 'General', key: 'GENERAL' },
                { label: 'Villa', key: 'VILLA' },
                { label: 'Commercial', key: 'COMMERCIAL' },
              ].map((tab) => {
                const isActive = listingFilterTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setListingFilterTab(tab.key)}
                    className={clsx(
                      'px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer flex-shrink-0 border',
                      isActive
                        ? 'bg-[#ff5a3c] text-white border-[#ff5a3c] shadow-md shadow-[#ff5a3c]/30'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                    )}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3-Column Property Cards Grid */}
          {loadingFeatured ? (
            <PropertyGridSkeleton count={3} />
          ) : filteredListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredListings.slice(0, 3).map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-slate-200 rounded-3xl bg-slate-50">
              <p className="text-sm font-semibold text-slate-500 mb-3">
                No listings currently found for this category tab.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setListingFilterTab('GENERAL')}
              >
                Show All Listings
              </Button>
            </div>
          )}

          {/* Explore More Link */}
          <div className="mt-12 text-center">
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#0b1528] hover:bg-[#ff5a3c] text-white text-xs font-bold transition-all shadow-md"
            >
              <span>Explore All Properties</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SECTION 3: TOP LOCATION FOR YOU PROPERTY (Dark Section with Locations) */}
      {/* ========================================================================= */}
      <section className="py-24 bg-[#0b1528] border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#ff5a3c] block mb-2">
              Our Property List
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Our Top Location For You Property
            </h2>
          </div>

          {/* Dynamic Top Location Gallery Grid (3x3 Layout for 9 Featured Cities) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {TOP_LOCATIONS.map((loc) => (
              <div
                key={loc.name}
                onClick={() => navigate(`/properties?city=${loc.name}`)}
                className="group relative h-96 rounded-3xl overflow-hidden border border-white/10 shadow-2xl cursor-pointer flex flex-col justify-end p-7 hover:border-[#ff5a3c]/60 transition-all duration-500"
              >
                <img
                  src={loc.image}
                  alt={loc.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1528] via-[#0b1528]/55 to-transparent" />

                <div className="relative z-10">
                  <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-wider mb-2 border border-white/15 shadow-sm">
                    {loc.propertiesCount}
                  </span>
                  <h3 className="text-2xl font-extrabold text-white group-hover:text-[#ff5a3c] transition mb-1">
                    {loc.name}
                  </h3>
                  <p className="text-xs text-slate-300 font-medium">{loc.tagline}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. WHY CHOOSE US & VALUE PROPOSITIONS                                     */}
      {/* ========================================================================= */}
      <section className="py-20 bg-[#0f1c34] border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#ff5a3c] block mb-2">
              WHY CHOOSE US
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Giving You Complete Control & Legal Peace
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-[#0b1528] border border-white/10 hover:border-[#ff5a3c]/50 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-[#ff5a3c]/10 text-[#ff5a3c] flex items-center justify-center mb-6">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">100% Legal Title Audits</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Every residential and commercial listing undergoes strict ownership validation and encumbrance verification.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#0b1528] border border-white/10 hover:border-[#ff5a3c]/50 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-[#ff5a3c]/10 text-[#ff5a3c] flex items-center justify-center mb-6">
                <Award className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Zero Brokerage Deals</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Direct negotiations between verified buyers, owners, and certified real estate advisors without hidden costs.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#0b1528] border border-white/10 hover:border-[#ff5a3c]/50 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-[#ff5a3c]/10 text-[#ff5a3c] flex items-center justify-center mb-6">
                <Key className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Instant Site Walkthroughs</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Schedule physical property walkthroughs, compare neighborhood infrastructures, and lock in terms seamlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. TESTIMONIALS SECTION                                                   */}
      {/* ========================================================================= */}
      <section className="py-20 bg-[#0b1528]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#ff5a3c] block mb-2">
              REAL EXPERIENCES
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Trusted by Discerning Buyers & Investors
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-[#0f1c34] border border-white/10 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed mb-6 font-normal">
                    "{t.comment}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-white/20"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">{t.name}</h4>
                    <p className="text-[11px] text-slate-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. CALL TO ACTION (CTA) BANNER                                            */}
      {/* ========================================================================= */}
      <section className="py-16 bg-[#0b1528] pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left bg-gradient-to-r from-[#0f1c34] to-[#152542] p-8 sm:p-12 rounded-3xl border border-white/15 shadow-2xl">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#ff5a3c] block mb-2">
                LIST WITH ZERO BROKERAGE
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-2 text-white">
                Looking to Sell or Lease Your Asset?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-normal">
                Connect directly with verified homebuyers and commercial investors across top high-growth corridors.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                onClick={() => navigate('/register?role=SELLER')}
                variant="primary"
                size="lg"
                className="font-bold !rounded-full !bg-[#ff5a3c] hover:!bg-[#e04b30] text-white shadow-lg shadow-[#ff5a3c]/30"
              >
                Post Your Property
              </Button>
              <Button
                onClick={() => navigate('/agents')}
                variant="outline"
                size="lg"
                className="bg-white/10 text-white border-white/20 hover:bg-white/20 font-bold !rounded-full"
              >
                Find an Agent
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* VIDEO MODAL (Architectural Walkthrough Triggered by Play Button)          */}
      {/* ========================================================================= */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-4xl bg-[#0b1528] rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
            {/* Header with Close */}
            <div className="flex items-center justify-between p-4 px-6 border-b border-white/10">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Play className="w-4 h-4 text-[#ff5a3c] fill-current" />
                <span>Luxury Real Estate Tour Experience</span>
              </h3>
              <button
                type="button"
                onClick={() => setVideoModalOpen(false)}
                className="p-1 rounded-full bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Frame */}
            <div className="aspect-video w-full bg-black">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=0"
                title="Property Walkthrough Tour"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
