import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const FavoritesContext = createContext(null);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem('estate_favorites');
      return stored ? JSON.parse(stored) : [];
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
    return favorites.includes(propertyId);
  };

  const toggleFavorite = (property) => {
    const id = typeof property === 'string' ? property : property._id;
    const title = typeof property === 'object' ? property.title : 'Property';

    if (favorites.includes(id)) {
      setFavorites((prev) => prev.filter((item) => item !== id));
      toast.success(`Removed from saved properties`);
    } else {
      setFavorites((prev) => [...prev, id]);
      toast.success(`Saved "${title.length > 25 ? title.substring(0, 25) + '...' : title}" to favorites!`);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite }}>
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
