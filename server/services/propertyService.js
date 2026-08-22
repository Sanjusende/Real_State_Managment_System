import Property from '../models/Property.js';
import ApiError from '../utils/ApiError.js';
import { generateUniquePropertySlug } from '../utils/slugifyProperty.js';
import { ROLES, PAGINATION } from '../config/constants.js';

/**
 * Create a new property listing
 */
export const createProperty = async (propertyData, user) => {
  const {
    title,
    description,
    propertyType,
    listingType,
    price,
    priceUnit,
    area,
    areaUnit,
    bedrooms,
    bathrooms,
    balconies,
    floor,
    totalFloors,
    furnishingStatus,
    constructionStatus,
    possessionDate,
    yearBuilt,
    parking,
    amenities,
    images,
    thumbnail,
    address,
    city,
    state,
    country,
    pincode,
    coordinates,
    category,
    location,
  } = propertyData;

  // Generate unique SEO slug
  const slug = await generateUniquePropertySlug(title);

  // Set ownership relationships
  const owner = user.id || user._id;
  const agent = user.role === ROLES.AGENT ? (user.id || user._id) : (propertyData.agent || null);

  // Admin creations can be automatically approved; Agent/Seller creations start as PENDING
  const approvalStatus = user.role === ROLES.ADMIN ? (propertyData.approvalStatus || 'APPROVED') : 'PENDING';

  const property = await Property.create({
    title: title.trim(),
    slug,
    description: description.trim(),
    propertyType,
    listingType: listingType || 'SALE',
    price: Number(price),
    priceUnit: priceUnit || 'INR',
    area: Number(area),
    areaUnit: areaUnit || 'sqft',
    bedrooms: Number(bedrooms) || 0,
    bathrooms: Number(bathrooms) || 0,
    balconies: Number(balconies) || 0,
    floor: Number(floor) || 0,
    totalFloors: Number(totalFloors) || 1,
    furnishingStatus: furnishingStatus || 'UNFURNISHED',
    constructionStatus: constructionStatus || 'READY_TO_MOVE',
    possessionDate: possessionDate || null,
    yearBuilt: yearBuilt || null,
    parking: Number(parking) || 0,
    amenities: Array.isArray(amenities) ? amenities : [],
    images: Array.isArray(images) ? images : [],
    thumbnail: thumbnail || (images && images.length > 0 ? images[0].url : ''),
    address: address.trim(),
    city: city.trim(),
    state: state.trim(),
    country: country ? country.trim() : 'India',
    pincode: pincode.trim(),
    coordinates: coordinates || { type: 'Point', coordinates: [72.8777, 19.0760] },
    category: category || null,
    location: location || null,
    owner,
    agent,
    approvalStatus,
    status: 'AVAILABLE',
  });

  return await Property.findById(property._id)
    .populate('owner', 'name email phone avatar agencyName')
    .populate('agent', 'name email phone avatar agencyName')
    .populate('category', 'name slug icon')
    .populate('location', 'city state');
};

/**
 * Query all properties with public filtering, sorting, and pagination
 */
export const getAllProperties = async (queryParams = {}, user = null) => {
  const page = Math.max(1, parseInt(queryParams.page || PAGINATION.DEFAULT_PAGE, 10));
  const limit = Math.min(PAGINATION.MAX_LIMIT, Math.max(1, parseInt(queryParams.limit || PAGINATION.DEFAULT_LIMIT, 10)));
  const skip = (page - 1) * limit;

  const filter = {};

  // Public access only sees APPROVED properties
  const isAdmin = user && user.role === ROLES.ADMIN;
  if (!isAdmin) {
    filter.approvalStatus = 'APPROVED';
    filter.status = queryParams.status || 'AVAILABLE';
  } else if (queryParams.approvalStatus) {
    filter.approvalStatus = queryParams.approvalStatus;
  }

  // Filter by listing type (SALE, RENT, LEASE)
  if (queryParams.listingType) {
    filter.listingType = queryParams.listingType.toUpperCase();
  }

  // Filter by property type
  if (queryParams.propertyType) {
    filter.propertyType = queryParams.propertyType.toUpperCase();
  }

  // Filter by city
  if (queryParams.city) {
    filter.city = new RegExp(`^${queryParams.city.trim()}$`, 'i');
  }

  // Filter by price range
  if (queryParams.minPrice || queryParams.maxPrice) {
    filter.price = {};
    if (queryParams.minPrice) filter.price.$gte = Number(queryParams.minPrice);
    if (queryParams.maxPrice) filter.price.$lte = Number(queryParams.maxPrice);
  }

  // Filter by bedrooms
  if (queryParams.bedrooms) {
    filter.bedrooms = { $gte: Number(queryParams.bedrooms) };
  }

  // Filter by featured
  if (queryParams.isFeatured !== undefined) {
    filter.isFeatured = queryParams.isFeatured === 'true' || queryParams.isFeatured === true;
  }

  // Text search
  if (queryParams.search) {
    filter.$text = { $search: queryParams.search.trim() };
  }

  // Sort criteria
  let sort = { createdAt: -1 }; // Default newest
  if (queryParams.sort === 'price-asc') sort = { price: 1 };
  if (queryParams.sort === 'price-desc') sort = { price: -1 };
  if (queryParams.sort === 'popular') sort = { views: -1 };
  if (queryParams.sort === 'featured') sort = { isFeatured: -1, createdAt: -1 };

  const [properties, total] = await Promise.all([
    Property.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('owner', 'name email phone avatar agencyName')
      .populate('agent', 'name email phone avatar agencyName')
      .populate('category', 'name slug icon')
      .populate('location', 'city state'),
    Property.countDocuments(filter),
  ]);

  return {
    properties,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

/**
 * Get single property by unique MongoDB ObjectId
 */
export const getPropertyById = async (id, user = null) => {
  const property = await Property.findById(id)
    .populate('owner', 'name email phone avatar agencyName')
    .populate('agent', 'name email phone avatar agencyName')
    .populate('category', 'name slug icon')
    .populate('location', 'city state');

  if (!property) {
    throw new ApiError(404, 'Property not found');
  }

  // Check access for unapproved listings
  const isOwner = user && property.owner && property.owner._id.toString() === user.id;
  const isAgent = user && property.agent && property.agent._id.toString() === user.id;
  const isAdmin = user && user.role === ROLES.ADMIN;

  if (property.approvalStatus !== 'APPROVED' && !isOwner && !isAgent && !isAdmin) {
    throw new ApiError(404, 'Property is pending administrative approval');
  }

  return property;
};

/**
 * Get property by SEO slug and increment view counter atomically
 */
export const getPropertyBySlug = async (slug, user = null) => {
  const property = await Property.findOneAndUpdate(
    { slug },
    { $inc: { views: 1 } },
    { new: true }
  )
    .populate('owner', 'name email phone avatar agencyName')
    .populate('agent', 'name email phone avatar agencyName')
    .populate('category', 'name slug icon')
    .populate('location', 'city state');

  if (!property) {
    throw new ApiError(404, 'Property not found');
  }

  const isOwner = user && property.owner && property.owner._id.toString() === user.id;
  const isAgent = user && property.agent && property.agent._id.toString() === user.id;
  const isAdmin = user && user.role === ROLES.ADMIN;

  if (property.approvalStatus !== 'APPROVED' && !isOwner && !isAgent && !isAdmin) {
    throw new ApiError(404, 'Property is pending administrative approval');
  }

  return property;
};

/**
 * Get listings belonging to the authenticated Agent / Seller / Admin
 */
export const getMyProperties = async (user, queryParams = {}) => {
  const page = Math.max(1, parseInt(queryParams.page || 1, 10));
  const limit = Math.min(50, Math.max(1, parseInt(queryParams.limit || 10, 10)));
  const skip = (page - 1) * limit;

  const userId = user.id || user._id;
  const filter = {
    $or: [{ owner: userId }, { agent: userId }],
  };

  if (queryParams.status) filter.status = queryParams.status;
  if (queryParams.approvalStatus) filter.approvalStatus = queryParams.approvalStatus;

  const [properties, total] = await Promise.all([
    Property.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('category', 'name slug')
      .populate('location', 'city state'),
    Property.countDocuments(filter),
  ]);

  return {
    properties,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

/**
 * Update property listing
 */
export const updateProperty = async (id, updateData, user) => {
  const property = await Property.findById(id);
  if (!property) {
    throw new ApiError(404, 'Property not found');
  }

  // Verify ownership
  const isOwner = property.owner.toString() === (user.id || user._id);
  const isAgent = property.agent && property.agent.toString() === (user.id || user._id);
  const isAdmin = user.role === ROLES.ADMIN;

  if (!isOwner && !isAgent && !isAdmin) {
    throw new ApiError(403, 'Forbidden: You do not have permission to modify this listing');
  }

  // If title changed, recalculate unique slug
  if (updateData.title && updateData.title.trim() !== property.title) {
    updateData.slug = await generateUniquePropertySlug(updateData.title, property._id);
  }

  // Prevent regular users from modifying approvalStatus or isFeatured directly via general update
  if (!isAdmin) {
    delete updateData.approvalStatus;
    delete updateData.isFeatured;
    delete updateData.views;
  }

  const updatedProperty = await Property.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  })
    .populate('owner', 'name email phone avatar agencyName')
    .populate('agent', 'name email phone avatar agencyName')
    .populate('category', 'name slug icon')
    .populate('location', 'city state');

  return updatedProperty;
};

/**
 * Delete property listing
 */
export const deleteProperty = async (id, user) => {
  const property = await Property.findById(id);
  if (!property) {
    throw new ApiError(404, 'Property not found');
  }

  const isOwner = property.owner.toString() === (user.id || user._id);
  const isAgent = property.agent && property.agent.toString() === (user.id || user._id);
  const isAdmin = user.role === ROLES.ADMIN;

  if (!isOwner && !isAgent && !isAdmin) {
    throw new ApiError(403, 'Forbidden: You do not have permission to delete this listing');
  }

  await Property.findByIdAndDelete(id);
  return true;
};

/**
 * Update property listing status (AVAILABLE, SOLD, RENTED, etc.)
 */
export const updatePropertyStatus = async (id, status, user) => {
  const property = await Property.findById(id);
  if (!property) {
    throw new ApiError(404, 'Property not found');
  }

  const isOwner = property.owner.toString() === (user.id || user._id);
  const isAgent = property.agent && property.agent.toString() === (user.id || user._id);
  const isAdmin = user.role === ROLES.ADMIN;

  if (!isOwner && !isAgent && !isAdmin) {
    throw new ApiError(403, 'Forbidden: You do not have permission to update status for this listing');
  }

  property.status = status;
  await property.save();

  return property;
};

/**
 * Approve or reject property listing (Admin only)
 */
export const updatePropertyApproval = async (id, approvalStatus, adminUser) => {
  if (adminUser.role !== ROLES.ADMIN) {
    throw new ApiError(403, 'Forbidden: Only administrators can approve or reject properties');
  }

  const property = await Property.findByIdAndUpdate(
    id,
    { approvalStatus },
    { new: true, runValidators: true }
  )
    .populate('owner', 'name email phone avatar agencyName')
    .populate('agent', 'name email phone avatar agencyName');

  if (!property) {
    throw new ApiError(404, 'Property not found');
  }

  return property;
};

/**
 * Toggle featured listing status (Admin only)
 */
export const togglePropertyFeatured = async (id, isFeatured, adminUser) => {
  if (adminUser.role !== ROLES.ADMIN) {
    throw new ApiError(403, 'Forbidden: Only administrators can feature listings');
  }

  const property = await Property.findByIdAndUpdate(
    id,
    { isFeatured },
    { new: true, runValidators: true }
  );

  if (!property) {
    throw new ApiError(404, 'Property not found');
  }

  return property;
};
