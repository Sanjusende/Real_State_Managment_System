import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Search,
  Clock,
  Sparkles,
  Trash2,
} from 'lucide-react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import PropertyCard from '../../../components/property/PropertyCard';
import Button from '../../../components/common/Button';
import { getLatestProperties } from '../../../services/propertyService';
import { getRecentlyViewed, clearRecentlyViewed } from '../../../utils/recentViews';

export default function UserPropertiesPage() {
  const [activeTab, setActiveTab] = useState('recent'); // 'recent' | 'recommended'
  const [recommended, setRecommended] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setRecentlyViewed(getRecentlyViewed());
      try {
        const res = await getLatestProperties(9);
        if (res?.data?.properties) setRecommended(res.data.properties);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleClearRecent = () => {
    clearRecentlyViewed();
    setRecentlyViewed([]);
  };

  return (
    <DashboardLayout
      title="Property Browsing & History"
      subtitle="View your recently inspected homes, personalized recommendations, and saved market feeds."
    >
      {/* Top Filter and Actions */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 mb-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-0.5 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('recent')}
            className={`px-4 py-2 rounded-lg transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'recent'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Recently Viewed ({recentlyViewed.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('recommended')}
            className={`px-4 py-2 rounded-lg transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'recommended'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Recommended Feed ({recommended.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          {activeTab === 'recent' && recentlyViewed.length > 0 && (
            <button
              type="button"
              onClick={handleClearRecent}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 hover:underline cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}

          <Link to="/properties">
            <Button variant="outline" size="sm" icon={Search}>
              Browse All Properties
            </Button>
          </Link>
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === 'recent' ? (
        recentlyViewed.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
            <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 mb-1">No Recently Viewed Properties</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
              When you open and explore property details in the catalog, they will appear here automatically for quick return.
            </p>
            <Link to="/properties">
              <Button variant="primary" size="md" icon={Search}>
                Explore Listings
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentlyViewed.map((p) => (
              <PropertyCard key={p._id} property={p} />
            ))}
          </div>
        )
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommended.map((p) => (
            <PropertyCard key={p._id} property={p} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
