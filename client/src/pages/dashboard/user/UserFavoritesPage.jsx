import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ArrowRight, Search } from 'lucide-react';
import { useFavorites } from '../../../context/FavoritesContext';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import PropertyCard from '../../../components/property/PropertyCard';
import Button from '../../../components/common/Button';

export default function UserFavoritesPage() {
  const { favorites, clearFavorites } = useFavorites();

  return (
    <DashboardLayout
      title={`Saved Favorites (${favorites.length})`}
      subtitle="Properties you have bookmarked for comparison, site visits, or future investment."
    >
      {/* Header Actions */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <span className="text-xs text-slate-500 font-semibold">
          {favorites.length} {favorites.length === 1 ? 'property' : 'properties'} in your saved collection
        </span>

        {favorites.length > 0 && (
          <button
            type="button"
            onClick={clearFavorites}
            className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 hover:underline cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All Saved</span>
          </button>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No Saved Properties Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
            When browsing verified listings, tap the heart icon on any property card to save it here for quick access.
          </p>
          <Link to="/properties">
            <Button variant="primary" size="md" icon={Search}>
              Browse Properties Catalog
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
