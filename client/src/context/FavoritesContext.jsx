import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const FavoritesContext = createContext(null);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem('estate_favorites');
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('estate_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites to localStorage', e);
    }
  }, [favorites]);

  const isFavorite = (propertyId) => {
    if (!propertyId || !Array.isArray(favorites)) return false;
    return favorites.some((item) =>
      typeof item === 'string' ? item === propertyId : item?._id === propertyId
    );
  };

  const toggleFavorite = (property) => {
    if (!property) return;
    const id = typeof property === 'string' ? property : property._id;
    const title = typeof property === 'object' ? property.title || 'Property' : 'Property';

    if (isFavorite(id)) {
      setFavorites((prev) =>
        prev.filter((item) => (typeof item === 'string' ? item !== id : item?._id !== id))
      );
      toast.success('Removed from saved properties');
    } else {
      const itemToSave = typeof property === 'object' ? property : { _id: id, title };
      setFavorites((prev) => [...prev, itemToSave]);
      toast.success(
        `Saved "${title.length > 25 ? title.substring(0, 25) + '...' : title}" to favorites!`
      );
    }
  };

  const clearFavorites = () => {
    setFavorites([]);
    toast.success('Cleared all saved properties');
  };

  const favoritesCount = Array.isArray(favorites) ? favorites.length : 0;

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoritesCount,
        isFavorite,
        toggleFavorite,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export default FavoritesContext;
