import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  MessageSquare,
  Building2,
  Bell,
  Search,
  ArrowRight,
  ShieldCheck,
  User,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useFavorites } from '../../../context/FavoritesContext';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import PropertyCard from '../../../components/property/PropertyCard';
import Button from '../../../components/common/Button';
import { getMyEnquiries } from '../../../services/enquiryService';
import { getLatestProperties } from '../../../services/propertyService';
import { getRecentlyViewed } from '../../../utils/recentViews';

export default function UserDashboard() {
  const { user } = useAuth();
  const { favorites, favoritesCount } = useFavorites();
  const [enquiries, setEnquiries] = useState([]);
  const [recommendedProperties, setRecommendedProperties] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const [enqRes, propRes] = await Promise.all([
          getMyEnquiries({ limit: 4 }),
          getLatestProperties(3),
        ]);
        if (enqRes?.data?.enquiries) setEnquiries(enqRes.data.enquiries);
        if (propRes?.data?.properties) setRecommendedProperties(propRes.data.properties);
        setRecentlyViewed(getRecentlyViewed().slice(0, 3));
      } catch (err) {
        console.error('Failed to load user dashboard info:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <DashboardLayout
      title={`Welcome back, ${user?.name || 'Home Seeker'} 👋`}
      subtitle="Track your saved properties, active inquiries, and personalized home recommendations."
    >
      {/* 1. Quick Stats Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link
          to="/dashboard/favorites"
          className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500">Saved Favorites</span>
            <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-110 transition">
              <Heart className="w-5 h-5 fill-current" />
            </div>
          </div>
          <span className="text-2xl font-extrabold text-slate-900 block">{favoritesCount || 0}</span>
          <span className="text-[11px] text-slate-400 mt-1 block">Properties bookmarked</span>
        </Link>

        <Link
          to="/dashboard/enquiries"
          className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500">Submitted Inquiries</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl font-extrabold text-slate-900 block">{enquiries.length}</span>
          <span className="text-[11px] text-slate-400 mt-1 block">Active agent conversations</span>
        </Link>

        <Link
          to="/dashboard/notifications"
          className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500">Unread Alerts</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition">
              <Bell className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl font-extrabold text-slate-900 block">2</span>
          <span className="text-[11px] text-slate-400 mt-1 block">Market price updates</span>
        </Link>

        <Link
          to="/dashboard/profile"
          className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500">Profile Status</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <span className="text-xl font-extrabold text-emerald-700 block">Verified User</span>
          <span className="text-[11px] text-slate-400 mt-1 block">Phone & Email active</span>
        </Link>
      </div>

      {/* 2. Main Content Grid: Recent Inquiries vs Saved Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10 items-start">
        {/* Left 2 Columns: Inquiries Feed */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Inquiries & Site Visits</h2>
              <p className="text-xs text-slate-500 mt-0.5">Properties you reached out to agents for</p>
            </div>
            <Link
              to="/dashboard/enquiries"
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {enquiries.length === 0 ? (
            <div className="text-center py-10">
              <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500 mb-3">No active inquiries submitted yet.</p>
              <Link to="/properties">
                <Button variant="primary" size="sm">
                  Search Properties
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {enquiries.map((enq) => (
                <div
                  key={enq._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 gap-3 hover:bg-slate-100/70 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-200 overflow-hidden flex-shrink-0">
                      <img
                        src={enq.property?.thumbnail || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=300&q=80'}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-1">
                        {enq.property?.title || 'Property Inquiry'}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Agent: <span className="font-semibold text-slate-700">{enq.recipient?.name || 'Assigned Consultant'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        enq.status === 'RESOLVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : enq.status === 'CONTACTED'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {enq.status}
                    </span>
                    <Link
                      to={enq.property?.slug ? `/properties/${enq.property.slug}` : '/dashboard/enquiries'}
                      className="text-xs font-semibold text-emerald-700 hover:underline"
                    >
                      Details &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Column: Quick Profile & Search Shortcut */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
            <div className="relative z-10">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider mb-2">
                Fast Property Finder
              </span>
              <h3 className="text-base font-bold mb-1">Looking for a new locality?</h3>
              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                Filter verified luxury flats and clear-title plots by exact city and budget.
              </p>
              <Link to="/properties">
                <Button variant="primary" size="sm" className="w-full">
                  Browse Catalog
                </Button>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Saved Favorites ({favorites.length})</h3>
            {favorites.length === 0 ? (
              <p className="text-xs text-slate-400 leading-relaxed">
                You haven't bookmarked any listings yet. Tap the heart icon on any property card to save it here.
              </p>
            ) : (
              <div className="space-y-2.5">
                {favorites.slice(0, 3).map((f) => (
                  <Link
                    key={f._id}
                    to={f.slug ? `/properties/${f.slug}` : `/properties/${f._id}`}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition group border border-slate-100"
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                      <img src={f.thumbnail || f.images?.[0]?.url || ''} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="overflow-hidden flex-1">
                      <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-emerald-700">
                        {f.title}
                      </h4>
                      <p className="text-[11px] text-slate-500">{f.city}, {f.state}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Recently Viewed Properties */}
      {recentlyViewed.length > 0 && (
        <div className="pt-8 border-t border-slate-200 mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600" />
                <span>Recently Viewed Properties</span>
              </h2>
              <p className="text-xs text-slate-500">Listings you inspected during this or recent sessions</p>
            </div>
            <Link to="/dashboard/properties" className="text-xs font-bold text-emerald-700 hover:underline">
              View History &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentlyViewed.map((p) => (
              <PropertyCard key={p._id} property={p} />
            ))}
          </div>
        </div>
      )}

      {/* 4. Recommended Properties Grid */}
      {recommendedProperties.length > 0 && (
        <div className="pt-8 border-t border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>Recommended for You</span>
              </h2>
              <p className="text-xs text-slate-500">Newly approved high-growth corridor properties</p>
            </div>
            <Link to="/properties" className="text-xs font-bold text-emerald-700 hover:underline">
              Explore All Listings &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedProperties.map((p) => (
              <PropertyCard key={p._id} property={p} />
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
