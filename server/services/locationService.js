import Location from '../models/Location.js';
import ApiError from '../utils/ApiError.js';

export const getAllLocations = async (query = {}) => {
  const filter = { isActive: true, ...query };
  const locations = await Location.find(filter).sort({ isPopular: -1, city: 1 });
  return locations;
};

export const getPopularLocations = async (limit = 8) => {
  const locations = await Location.find({ isActive: true, isPopular: true })
    .sort({ propertyCount: -1 })
    .limit(Number(limit));
  return locations;
};

export const getLocationById = async (id) => {
  const location = await Location.findById(id);
  if (!location) {
    throw new ApiError(404, 'Location not found');
  }
  return location;
};

export const getLocationBySlug = async (slug) => {
  const location = await Location.findOne({ slug, isActive: true });
  if (!location) {
    throw new ApiError(404, 'Location not found');
  }
  return location;
};

export const createLocation = async (locationData) => {
  const existing = await Location.findOne({
    city: locationData.city.trim(),
    state: locationData.state.trim(),
  });
  if (existing) {
    throw new ApiError(409, `Location '${locationData.city}, ${locationData.state}' already exists`);
  }
  const location = await Location.create(locationData);
  return location;
};

export const updateLocation = async (id, updateData) => {
  const location = await Location.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
  if (!location) {
    throw new ApiError(404, 'Location not found');
  }
  return location;
};

export const deleteLocation = async (id) => {
  const location = await Location.findByIdAndDelete(id);
  if (!location) {
    throw new ApiError(404, 'Location not found');
  }
  return location;
};
