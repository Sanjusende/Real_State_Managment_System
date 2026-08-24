import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  ArrowRight,
  ShieldCheck,
  Award,
  Sparkles,
  MapPin,
  TrendingUp,
  Search,
  Star,
  CheckCircle2,
  Users,
  Compass,
  Key,
  Home as HomeIcon,
} from 'lucide-react';
import SearchBar from '../../components/search/SearchBar';
import PropertyCard from '../../components/property/PropertyCard';
import { PropertyGridSkeleton } from '../../components/common/LoadingSkeleton';
import Button from '../../components/common/Button';
import { getFeaturedProperties, getLatestProperties } from '../../services/propertyService';
import { getCategories, getPopularLocations } from '../../services/taxonomyService';

const DEFAULT_CATEGORIES = [
  { name: 'Apartment', slug: 'apartment', count: '120+ Listings', icon: '🏢' },
  { name: 'Luxury Villa', slug: 'villa', count: '45+ Listings', icon: '🏡' },
  { name: 'Commercial Hub', slug: 'commercial', count: '30+ Listings', icon: '🏬' },
  { name: 'Corporate Office', slug: 'office', count: '25+ Listings', icon: '💼' },
  { name: 'Residential Plot', slug: 'plot', count: '60+ Listings', icon: '📐' },
  { name: 'Penthouse', slug: 'penthouse', count: '18+ Listings', icon: '🌆' },
];

const POPULAR_CITIES = [
  {
    name: 'Bhopal',
    state: 'Madhya Pradesh',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&q=80',
    tag: 'Lake City Corridor',
  },
  {
    name: 'Indore',
    state: 'Madhya Pradesh',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
    tag: 'Super Corridor Hub',
  },
  {
    name: 'Mumbai',
    state: 'Maharashtra',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80',
    tag: 'BKC & Luxury Coast',
  },
  {
    name: 'Pune',
    state: 'Maharashtra',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80',
    tag: 'IT Corridor & Greens',
  },
];

const TESTIMONIALS = [
  {
    name: 'Rajesh & Meera Sharma',
    role: 'Homeowners in Arera Colony',
    comment:
      'EstateCraft made our dream 3BHK flat purchase completely stress-free. Every paper was legally verified before we even visited.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  },
  {
    name: 'Vikramaditya Oberoi',
    role: 'Commercial Investor',
    comment:
      'Found a high-yield corporate floor in Bandra Kurla Complex within 2 weeks. The zero-hidden-brokerage policy is truly refreshing.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  },
  {
    name: 'Ananya Deshmukh',
    role: 'Villa Owner in Indore',
    comment:
      'Sold our luxury duplex through a verified EstateCraft agent in under 20 days at full market valuation. Outstanding service!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [latestProperties, setLatestProperties] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingLatest, setLoadingLatest] = useState(true);

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

    // 3. Fetch Categories
    const fetchTaxonomies = async () => {
      try {
        const res = await getCategories();
        if (res?.data && res.data.length > 0) {
          setCategories(res.data);
        }
      } catch {}
    };

    fetchFeatured();
    fetchLatest();
    fetchTaxonomies();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* 1. Hero Section */}
      <section className="relative bg-slate-950 text-white pt-16 pb-28 md:pt-24 md:pb-36 overflow-hidden">
        {/* Decorative Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
          <div className="absolute top-10 left-1/4 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl" />
          <div className="absolute top-20 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-6 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            <span>India's Most Trusted Verified Real Estate Network</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight mb-6">
            Find Your Dream Home With Confidence & Clarity.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Explore verified luxury flats, independent duplex villas, commercial hubs, and clear-title plots with zero hidden commissions.
          </p>

          {/* SearchBar Container */}
          <div className="relative z-20 max-w-4xl mx-auto">
            <SearchBar />
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mt-12 pt-8 border-t border-slate-800/80 text-center">
            <div>
              <span className="block text-2xl md:text-3xl font-extrabold text-white">5,000+</span>
              <span className="text-xs text-slate-400">Verified Listings</span>
            </div>
            <div>
              <span className="block text-2xl md:text-3xl font-extrabold text-white">12+</span>
              <span className="text-xs text-slate-400">Major Cities</span>
            </div>
            <div>
              <span className="block text-2xl md:text-3xl font-extrabold text-white">1,200+</span>
              <span className="text-xs text-slate-400">Licensed Agents</span>
            </div>
            <div>
              <span className="block text-2xl md:text-3xl font-extrabold text-emerald-400">99.8%</span>
              <span className="text-xs text-slate-400">Satisfaction Rate</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Properties Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Handpicked Exclusives</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Featured Properties
              </h2>
            </div>

            <Link
              to="/properties?isFeatured=true"
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition group"
            >
              <span>Explore All Featured</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loadingFeatured ? (
            <PropertyGridSkeleton count={3} />
          ) : featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.slice(0, 3).map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 border border-dashed border-slate-200 rounded-3xl bg-slate-50">
              <p className="text-sm text-slate-500 mb-3">Featured properties will appear here as soon as approved.</p>
              <Link to="/properties" className="text-xs font-bold text-emerald-700 hover:underline">
                Browse Public Property Catalog &rarr;
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 3. Browse by Property Categories */}
      <section className="py-16 bg-slate-50 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block mb-1.5">
              Curated Catalog
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Explore by Property Type
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Select a specialized category tailored to your residential comfort or commercial investment goals.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.slice(0, 6).map((cat) => {
              const nameUpper = (cat.name || '').toUpperCase();
              const slugUpper = (cat.slug || '').toUpperCase();
              let pType = 'APARTMENT';
              if (slugUpper === 'OFFICE' || nameUpper.includes('OFFICE')) pType = 'OFFICE';
              else if (slugUpper === 'VILLA' || nameUpper.includes('VILLA')) pType = 'VILLA';
              else if (slugUpper === 'COMMERCIAL' || nameUpper.includes('COMMERCIAL')) pType = 'COMMERCIAL';
              else if (slugUpper === 'PLOT' || nameUpper.includes('PLOT')) pType = 'PLOT';
              else if (slugUpper === 'PENTHOUSE' || nameUpper.includes('PENTHOUSE')) pType = 'PENTHOUSE';
              else if (slugUpper === 'STUDIO' || nameUpper.includes('STUDIO')) pType = 'STUDIO';
              else if (slugUpper === 'HOUSE' || nameUpper.includes('HOUSE')) pType = 'HOUSE';
              else pType = slugUpper || nameUpper;

              return (
                <Link
                  key={cat.name}
                  to={`/properties?propertyType=${pType}`}
                  className="group rounded-2xl bg-white border border-slate-200 p-5 text-center shadow-xs hover:border-emerald-500 hover:shadow-md transition-all duration-200 flex flex-col items-center justify-center"
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl mb-3 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-200">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] text-slate-400 mt-1">Explore Deals</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Latest Property Listings Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1.5">
                <TrendingUp className="w-4 h-4" />
                <span>Newly Listed</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Latest Properties On Market
              </h2>
            </div>

            <Link
              to="/properties?sort=newest"
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition group"
            >
              <span>View All Listings</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loadingLatest ? (
            <PropertyGridSkeleton count={6} />
          ) : latestProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestProperties.slice(0, 6).map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-slate-200 rounded-3xl bg-slate-50">
              <p className="text-sm text-slate-500">No properties available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* 5. Popular Locations */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1.5">
              High Growth Regions
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Popular Cities & Neighborhoods
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Discover verified homes, offices, and plots in prime metro regions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {POPULAR_CITIES.map((city) => (
              <Link
                key={city.name}
                to={`/properties?city=${city.name}`}
                className="group relative h-72 rounded-3xl overflow-hidden shadow-lg border border-slate-800 flex flex-col justify-end p-5"
              >
                {/* Background Image with Dark Gradient */}
                <img
                  src={city.image}
                  alt={city.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

                {/* Content */}
                <div className="relative z-10">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase mb-1.5">
                    {city.tag}
                  </span>
                  <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition">
                    {city.name}
                  </h3>
                  <p className="text-xs text-slate-300">{city.state}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block mb-1.5">
              The EstateCraft Advantage
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Why Homebuyers & Investors Choose Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-300 transition">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5 shadow-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Verified Titles</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Rigorous multi-point ownership validation ensuring complete peace of mind on all documentation.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-300 transition">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-5 shadow-xs">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Zero Hidden Charges</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Direct transparent negotiations without surprise brokerage fees or inflated commission rates.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-300 transition">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-5 shadow-xs">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Top Licensed Agents</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Direct access to seasoned neighborhood specialists who know regional valuation and master plans.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-300 transition">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-5 shadow-xs">
                <Key className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">End-to-End Escrow</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Seamless coordination from property selection and physical walkthroughs to final registry transfer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. How It Works */}
      <section className="py-20 bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1.5">
              Simple 3-Step Journey
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              How EstateCraft Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="p-8 rounded-3xl bg-slate-800/80 border border-slate-700 text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-xl font-extrabold mb-5 shadow-lg shadow-emerald-600/30">
                1
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Search & Filter</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Filter by verified price, exact city, room requirements, furnishing status, and amenities in seconds.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-800/80 border border-slate-700 text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-xl font-extrabold mb-5 shadow-lg shadow-emerald-600/30">
                2
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Connect & Visit</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Send an instant inquiry or call the verified listing agent directly to book a physical walkthrough.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-800/80 border border-slate-700 text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-xl font-extrabold mb-5 shadow-lg shadow-emerald-600/30">
                3
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Seal the Deal</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Finalize negotiations, review digital paperwork, and complete legal ownership transfer with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block mb-1.5">
              Client Feedback
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Loved by Thousands of Homeowners
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed mb-6">
                    "{t.comment}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-200/60">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{t.name}</h4>
                    <p className="text-[11px] text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Call to Action (CTA) Banner */}
      <section className="py-16 bg-gradient-to-r from-emerald-800 to-emerald-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 text-white">
                Looking to Sell or Lease Your Property?
              </h2>
              <p className="text-sm text-emerald-100 max-w-xl font-normal">
                Join our network of verified owners and agents to showcase your listings to over 50,000 active monthly buyers.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                onClick={() => navigate('/register?role=SELLER')}
                variant="secondary"
                size="lg"
                className="bg-slate-950 hover:bg-slate-900 text-white"
              >
                Post Your Property
              </Button>
              <Button
                onClick={() => navigate('/agents')}
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10"
              >
                Find an Agent
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
