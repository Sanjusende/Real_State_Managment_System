/**
 * Utilities to store and retrieve recently viewed properties in localStorage
 */

const STORAGE_KEY = 'estatecraft_recently_viewed';
const MAX_ITEMS = 12;

export const recordRecentlyViewed = (property) => {
  if (!property || !property._id) return;
  try {
    const existing = getRecentlyViewed();
    const filtered = existing.filter((p) => p._id !== property._id);
    const updated = [
      {
        _id: property._id,
        title: property.title,
        slug: property.slug,
        price: property.price,
        priceUnit: property.priceUnit,
        city: property.city,
        state: property.state,
        propertyType: property.propertyType,
        listingType: property.listingType,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        area: property.area,
        areaUnit: property.areaUnit,
        thumbnail: property.thumbnail || property.images?.[0]?.url,
        viewedAt: new Date().toISOString(),
      },
      ...filtered,
    ].slice(0, MAX_ITEMS);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save recently viewed property:', err);
  }
};

export const getRecentlyViewed = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
};

export const clearRecentlyViewed = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error(err);
  }
};
