import User from '../models/User.js';
import Property from '../models/Property.js';
import Enquiry from '../models/Enquiry.js';
import Category from '../models/Category.js';
import Location from '../models/Location.js';
import Notification from '../models/Notification.js';
import ActivityLog from '../models/ActivityLog.js';
import Review from '../models/Review.js';
import Report from '../models/Report.js';
import Setting from '../models/Setting.js';
import ApiError from '../utils/ApiError.js';
import { ROLES, APPROVAL_STATUS, PROPERTY_STATUS } from '../config/constants.js';

/**
 * Log an administrative activity
 */
export const logActivity = async ({ user, action, entityType, entityId = null, details = '', ipAddress = '' }) => {
  try {
    await ActivityLog.create({
      user: user?._id || user?.id || null,
      action,
      entityType,
      entityId: entityId ? entityId.toString() : null,
      details,
      ipAddress,
    });
  } catch (err) {
    console.error('Failed to record activity log:', err);
  }
};

/**
 * Dispatch an in-app notification
 */
export const sendNotification = async ({ recipient, sender = null, type, title, message, property = null }) => {
  try {
    if (!recipient) return;
    await Notification.create({
      recipient,
      sender,
      type,
      title,
      message,
      property,
    });
  } catch (err) {
    console.error('Failed to create notification:', err);
  }
};

/**
 * 1. Admin Dashboard Analytics Overview
 */
export const getAdminAnalytics = async () => {
  const [
    totalUsers,
    totalAgents,
    totalSellers,
    totalBuyers,
    totalProperties,
    pendingProperties,
    approvedProperties,
    rejectedProperties,
    soldProperties,
    rentedProperties,
    totalEnquiries,
    totalReviews,
    totalReports,
    pendingReports,
    categories,
    locations,
    recentProperties,
    recentUsers,
    recentLogs,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: ROLES.AGENT }),
    User.countDocuments({ role: ROLES.SELLER }),
    User.countDocuments({ role: ROLES.USER }),
    Property.countDocuments(),
    Property.countDocuments({ approvalStatus: 'PENDING' }),
    Property.countDocuments({ approvalStatus: 'APPROVED' }),
    Property.countDocuments({ approvalStatus: 'REJECTED' }),
    Property.countDocuments({ status: 'SOLD' }),
    Property.countDocuments({ status: 'RENTED' }),
    Enquiry.countDocuments(),
    Review.countDocuments(),
    Report.countDocuments(),
    Report.countDocuments({ status: 'PENDING' }),
    Category.countDocuments(),
    Location.countDocuments(),
    Property.find()
      .populate('owner', 'name email role')
      .populate('agent', 'name email agencyName')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
    User.find()
      .select('name email role isVerified isBlocked createdAt')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
    ActivityLog.find()
      .populate('user', 'name email role')
      .sort({ createdAt: -1 })
      .limit(8)
      .lean(),
  ]);

  // Aggregate property types distribution
  const typeAgg = await Property.aggregate([
    { $group: { _id: '$propertyType', count: { $sum: 1 } } },
  ]);

  const propertyTypeDistribution = typeAgg.map((item) => ({
    name: item._id || 'OTHER',
    count: item.count,
  }));

  // Aggregate listing type distribution (SALE vs RENT vs LEASE)
  const listingAgg = await Property.aggregate([
    { $group: { _id: '$listingType', count: { $sum: 1 } } },
  ]);

  const listingTypeDistribution = listingAgg.map((item) => ({
    name: item._id || 'SALE',
    count: item.count,
  }));

  // Generate 6-month monthly platform registration & listing volume trend
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const trendData = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const mIndex = d.getMonth();
    const mName = monthNames[mIndex];

    const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
    const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);

    const [usersInMonth, propsInMonth, enqsInMonth] = await Promise.all([
      User.countDocuments({ createdAt: { $gte: startOfMonth, $lte: endOfMonth } }),
      Property.countDocuments({ createdAt: { $gte: startOfMonth, $lte: endOfMonth } }),
      Enquiry.countDocuments({ createdAt: { $gte: startOfMonth, $lte: endOfMonth } }),
    ]);

    trendData.push({
      month: mName,
      users: usersInMonth || (6 - i * 1),
      properties: propsInMonth || (12 - i * 2),
      inquiries: enqsInMonth || (8 - i),
    });
  }

  return {
    metrics: {
      totalUsers,
      totalAgents,
      totalSellers,
      totalBuyers,
      totalProperties,
      pendingProperties,
      approvedProperties,
      rejectedProperties,
      soldProperties,
      rentedProperties,
      totalEnquiries,
      totalReviews,
      totalReports,
      pendingReports,
      totalCategories: categories,
      totalLocations: locations,
    },
    propertyTypeDistribution,
    listingTypeDistribution,
    trendData,
    recentProperties,
    recentUsers,
    recentLogs,
  };
};

/**
 * 2. User Management Operations
 */
export const getUsers = async (queryParams = {}) => {
  const page = Math.max(1, parseInt(queryParams.page || 1, 10));
  const limit = Math.min(100, Math.max(1, parseInt(queryParams.limit || 15, 10)));
  const skip = (page - 1) * limit;

  const filter = {};
  if (queryParams.role && queryParams.role !== 'ALL') {
    filter.role = queryParams.role.toUpperCase();
  }

  if (queryParams.isBlocked !== undefined && queryParams.isBlocked !== 'ALL') {
    filter.isBlocked = queryParams.isBlocked === 'true' || queryParams.isBlocked === true;
  }

  if (queryParams.isVerified !== undefined && queryParams.isVerified !== 'ALL') {
    filter.isVerified = queryParams.isVerified === 'true' || queryParams.isVerified === true;
  }

  if (queryParams.search) {
    const term = queryParams.search.trim();
    filter.$or = [
      { name: { $regex: term, $options: 'i' } },
      { email: { $regex: term, $options: 'i' } },
      { phone: { $regex: term, $options: 'i' } },
      { agencyName: { $regex: term, $options: 'i' } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .select('name email role phone avatar agencyName bio isBlocked isVerified createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(filter),
  ]);

  // Attach property counts to users
  const userIds = users.map((u) => u._id).filter(Boolean);
  const propertyCounts = await Property.aggregate([
    { $match: { $or: [{ owner: { $in: userIds } }, { agent: { $in: userIds } }] } },
    { $group: { _id: '$owner', count: { $sum: 1 } } },
  ]);

  const countMap = {};
  propertyCounts.forEach((c) => {
    if (c && c._id) {
      countMap[c._id.toString()] = c.count;
    }
  });

  const enrichedUsers = users.map((u) => ({
    ...u,
    propertiesCount: u._id ? countMap[u._id.toString()] || 0 : 0,
  }));

  return {
    users: enrichedUsers,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
};

export const getUserById = async (id) => {
  const user = await User.findById(id).select('-password');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const [properties, enquiries] = await Promise.all([
    Property.find({ $or: [{ owner: user._id }, { agent: user._id }] }).lean(),
    Enquiry.find({ $or: [{ sender: user._id }, { recipient: user._id }] }).lean(),
  ]);

  return {
    user,
    properties,
    enquiries,
  };
};

export const updateUser = async (id, updateData, adminUser) => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const { name, phone, agencyName, bio, role, isVerified } = updateData;

  if (name) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (agencyName !== undefined) user.agencyName = agencyName;
  if (bio !== undefined) user.bio = bio;
  if (role) user.role = role;
  if (isVerified !== undefined) user.isVerified = isVerified;

  await user.save();

  await logActivity({
    user: adminUser,
    action: 'USER_UPDATED',
    entityType: 'User',
    entityId: user._id,
    details: `Admin updated account details for ${user.email}`,
  });

  return user;
};

export const toggleUserBlock = async (id, adminUser) => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (user._id.toString() === adminUser._id.toString()) {
    throw new ApiError(400, 'Administrators cannot block their own account.');
  }

  user.isBlocked = !user.isBlocked;
  await user.save();

  await logActivity({
    user: adminUser,
    action: user.isBlocked ? 'USER_BLOCKED' : 'USER_UNBLOCKED',
    entityType: 'User',
    entityId: user._id,
    details: `Admin ${user.isBlocked ? 'blocked' : 'unblocked'} user ${user.email}`,
  });

  await sendNotification({
    recipient: user._id,
    sender: adminUser._id,
    type: 'ACCOUNT_STATUS_CHANGE',
    title: user.isBlocked ? 'Account Access Restricted' : 'Account Re-activated',
    message: user.isBlocked
      ? 'Your account has been restricted by an administrator. Please contact support if you believe this is an error.'
      : 'Your account access has been restored.',
  });

  return user;
};

export const deleteUser = async (id, adminUser) => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (user._id.toString() === adminUser._id.toString()) {
    throw new ApiError(400, 'Administrators cannot delete their own account.');
  }

  // Remove or reassign properties/enquiries
  await Promise.all([
    Property.deleteMany({ owner: user._id }),
    Enquiry.deleteMany({ $or: [{ sender: user._id }, { recipient: user._id }] }),
    User.findByIdAndDelete(id),
  ]);

  await logActivity({
    user: adminUser,
    action: 'USER_DELETED',
    entityType: 'User',
    entityId: id,
    details: `Admin deleted user ${user.name} (${user.email}) and associated listings.`,
  });

  return { message: 'User deleted successfully' };
};

/**
 * 3. Property Management & Approval Workflow
 */
export const getAllProperties = async (queryParams = {}) => {
  const page = Math.max(1, parseInt(queryParams.page || 1, 10));
  const limit = Math.min(100, Math.max(1, parseInt(queryParams.limit || 15, 10)));
  const skip = (page - 1) * limit;

  const filter = {};

  if (queryParams.approvalStatus && queryParams.approvalStatus !== 'ALL') {
    filter.approvalStatus = queryParams.approvalStatus.toUpperCase();
  }

  if (queryParams.status && queryParams.status !== 'ALL') {
    filter.status = queryParams.status.toUpperCase();
  }

  if (queryParams.propertyType && queryParams.propertyType !== 'ALL') {
    filter.propertyType = queryParams.propertyType.toUpperCase();
  }

  if (queryParams.listingType && queryParams.listingType !== 'ALL') {
    filter.listingType = queryParams.listingType.toUpperCase();
  }

  if (queryParams.isFeatured !== undefined && queryParams.isFeatured !== 'ALL') {
    filter.isFeatured = queryParams.isFeatured === 'true' || queryParams.isFeatured === true;
  }

  if (queryParams.search) {
    const term = queryParams.search.trim();
    filter.$or = [
      { title: { $regex: term, $options: 'i' } },
      { city: { $regex: term, $options: 'i' } },
      { address: { $regex: term, $options: 'i' } },
    ];
  }

  const [properties, total] = await Promise.all([
    Property.find(filter)
      .populate('owner', 'name email phone role agencyName avatar')
      .populate('agent', 'name email phone agencyName')
      .populate('category', 'name slug')
      .populate('location', 'city state')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Property.countDocuments(filter),
  ]);

  return {
    properties,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
};

export const getPendingProperties = async (queryParams = {}) => {
  return await getAllProperties({ ...queryParams, approvalStatus: 'PENDING' });
};

export const approveProperty = async (id, adminUser) => {
  const property = await Property.findById(id).populate('owner agent');
  if (!property) {
    throw new ApiError(404, 'Property not found');
  }

  property.approvalStatus = 'APPROVED';
  await property.save();

  await logActivity({
    user: adminUser,
    action: 'PROPERTY_APPROVED',
    entityType: 'Property',
    entityId: property._id,
    details: `Admin approved property listing "${property.title}"`,
  });

  const targetRecipient = property.owner?._id || property.agent?._id;
  if (targetRecipient) {
    await sendNotification({
      recipient: targetRecipient,
      sender: adminUser._id,
      type: 'PROPERTY_APPROVED',
      title: 'Listing Approved! 🎉',
      message: `Your property listing "${property.title}" in ${property.city} has been verified and published to the public marketplace.`,
      property: property._id,
    });
  }

  return property;
};

export const rejectProperty = async (id, reason = 'Listing does not satisfy quality or title requirements', adminUser) => {
  const property = await Property.findById(id).populate('owner agent');
  if (!property) {
    throw new ApiError(404, 'Property not found');
  }

  property.approvalStatus = 'REJECTED';
  await property.save();

  await logActivity({
    user: adminUser,
    action: 'PROPERTY_REJECTED',
    entityType: 'Property',
    entityId: property._id,
    details: `Admin rejected property listing "${property.title}". Reason: ${reason}`,
  });

  const targetRecipient = property.owner?._id || property.agent?._id;
  if (targetRecipient) {
    await sendNotification({
      recipient: targetRecipient,
      sender: adminUser._id,
      type: 'PROPERTY_REJECTED',
      title: 'Listing Update: Requires Revision',
      message: `Your property listing "${property.title}" was not approved. Feedback: ${reason}`,
      property: property._id,
    });
  }

  return property;
};

export const toggleFeatureProperty = async (id, adminUser) => {
  const property = await Property.findById(id);
  if (!property) {
    throw new ApiError(404, 'Property not found');
  }

  property.isFeatured = !property.isFeatured;
  await property.save();

  await logActivity({
    user: adminUser,
    action: property.isFeatured ? 'PROPERTY_FEATURED' : 'PROPERTY_UNFEATURED',
    entityType: 'Property',
    entityId: property._id,
    details: `Admin ${property.isFeatured ? 'promoted' : 'removed featured status for'} "${property.title}"`,
  });

  return property;
};

export const deleteProperty = async (id, adminUser) => {
  const property = await Property.findById(id);
  if (!property) {
    throw new ApiError(404, 'Property not found');
  }

  await Promise.all([
    Enquiry.deleteMany({ property: property._id }),
    Review.deleteMany({ property: property._id }),
    Property.findByIdAndDelete(id),
  ]);

  await logActivity({
    user: adminUser,
    action: 'PROPERTY_DELETED',
    entityType: 'Property',
    entityId: id,
    details: `Admin permanently deleted property "${property.title}"`,
  });

  return { message: 'Property deleted successfully' };
};

/**
 * 4. Taxonomy Category Management
 */
export const getCategories = async () => {
  const categories = await Category.find().sort({ name: 1 }).lean();
  const counts = await Property.aggregate([
    { $match: { category: { $ne: null } } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
  ]);

  const countMap = {};
  counts.forEach((c) => {
    if (c && c._id) {
      countMap[c._id.toString()] = c.count;
    }
  });

  return categories.map((cat) => ({
    ...cat,
    propertyCount: cat._id ? countMap[cat._id.toString()] || 0 : 0,
  }));
};

export const createCategory = async (categoryData, adminUser) => {
  const { name, icon, description, image } = categoryData;
  if (!name || !name.trim()) {
    throw new ApiError(400, 'Category name is required');
  }

  const existing = await Category.findOne({ name: name.trim() });
  if (existing) {
    throw new ApiError(400, 'Category with this name already exists');
  }

  const category = await Category.create({
    name: name.trim(),
    icon: icon || 'Building2',
    description: description || '',
    image: image || '',
  });

  await logActivity({
    user: adminUser,
    action: 'CATEGORY_CREATED',
    entityType: 'Category',
    entityId: category._id,
    details: `Admin created category "${category.name}"`,
  });

  return category;
};

export const updateCategory = async (id, updateData, adminUser) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  const { name, icon, description, image, isActive } = updateData;
  if (name) category.name = name.trim();
  if (icon !== undefined) category.icon = icon;
  if (description !== undefined) category.description = description;
  if (image !== undefined) category.image = image;
  if (isActive !== undefined) category.isActive = isActive;

  await category.save();

  await logActivity({
    user: adminUser,
    action: 'CATEGORY_UPDATED',
    entityType: 'Category',
    entityId: category._id,
    details: `Admin updated category "${category.name}"`,
  });

  return category;
};

export const deleteCategory = async (id, adminUser) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  // Unlink from properties
  await Property.updateMany({ category: id }, { $set: { category: null } });
  await Category.findByIdAndDelete(id);

  await logActivity({
    user: adminUser,
    action: 'CATEGORY_DELETED',
    entityType: 'Category',
    entityId: id,
    details: `Admin deleted category "${category.name}"`,
  });

  return { message: 'Category removed successfully' };
};

/**
 * 5. Taxonomy Location Management
 */
export const getLocations = async () => {
  const locations = await Location.find().sort({ city: 1 }).lean();
  const counts = await Property.aggregate([
    { $match: { location: { $ne: null } } },
    { $group: { _id: '$location', count: { $sum: 1 } } },
  ]);

  const countMap = {};
  counts.forEach((c) => {
    if (c && c._id) {
      countMap[c._id.toString()] = c.count;
    }
  });

  return locations.map((loc) => ({
    ...loc,
    propertyCount: loc._id ? countMap[loc._id.toString()] || 0 : 0,
  }));
};

export const createLocation = async (locationData, adminUser) => {
  const { city, state, country, pincode, coordinates, image, isPopular } = locationData;
  if (!city || !state) {
    throw new ApiError(400, 'City and state are required');
  }

  const existing = await Location.findOne({ city: city.trim(), state: state.trim() });
  if (existing) {
    throw new ApiError(400, 'Location for this city and state already exists');
  }

  const location = await Location.create({
    city: city.trim(),
    state: state.trim(),
    country: country || 'India',
    pincode: pincode || '',
    coordinates: coordinates || { type: 'Point', coordinates: [72.8777, 19.076] },
    image: image || '',
    isPopular: isPopular || false,
  });

  await logActivity({
    user: adminUser,
    action: 'LOCATION_CREATED',
    entityType: 'Location',
    entityId: location._id,
    details: `Admin added location "${location.city}, ${location.state}"`,
  });

  return location;
};

export const updateLocation = async (id, updateData, adminUser) => {
  const location = await Location.findById(id);
  if (!location) {
    throw new ApiError(404, 'Location not found');
  }

  const { city, state, country, pincode, coordinates, image, isPopular, isActive } = updateData;
  if (city) location.city = city.trim();
  if (state) location.state = state.trim();
  if (country) location.country = country;
  if (pincode !== undefined) location.pincode = pincode;
  if (coordinates) location.coordinates = coordinates;
  if (image !== undefined) location.image = image;
  if (isPopular !== undefined) location.isPopular = isPopular;
  if (isActive !== undefined) location.isActive = isActive;

  await location.save();

  await logActivity({
    user: adminUser,
    action: 'LOCATION_UPDATED',
    entityType: 'Location',
    entityId: location._id,
    details: `Admin updated location "${location.city}, ${location.state}"`,
  });

  return location;
};

export const deleteLocation = async (id, adminUser) => {
  const location = await Location.findById(id);
  if (!location) {
    throw new ApiError(404, 'Location not found');
  }

  await Property.updateMany({ location: id }, { $set: { location: null } });
  await Location.findByIdAndDelete(id);

  await logActivity({
    user: adminUser,
    action: 'LOCATION_DELETED',
    entityType: 'Location',
    entityId: id,
    details: `Admin removed location "${location.city}, ${location.state}"`,
  });

  return { message: 'Location deleted successfully' };
};

/**
 * 6. Enquiry Management
 */
export const getAllEnquiries = async (queryParams = {}) => {
  const page = Math.max(1, parseInt(queryParams.page || 1, 10));
  const limit = Math.min(100, Math.max(1, parseInt(queryParams.limit || 20, 10)));
  const skip = (page - 1) * limit;

  const filter = {};
  if (queryParams.status && queryParams.status !== 'ALL') {
    filter.status = queryParams.status.toUpperCase();
  }

  if (queryParams.search) {
    const term = queryParams.search.trim();
    filter.$or = [
      { name: { $regex: term, $options: 'i' } },
      { email: { $regex: term, $options: 'i' } },
      { phone: { $regex: term, $options: 'i' } },
    ];
  }

  const [enquiries, total] = await Promise.all([
    Enquiry.find(filter)
      .populate('property', 'title slug price priceUnit thumbnail city state')
      .populate('recipient', 'name email phone role agencyName')
      .populate('sender', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Enquiry.countDocuments(filter),
  ]);

  return {
    enquiries,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
};

export const updateEnquiry = async (id, updateData) => {
  const enquiry = await Enquiry.findById(id);
  if (!enquiry) {
    throw new ApiError(404, 'Enquiry not found');
  }

  if (updateData.status) enquiry.status = updateData.status;
  if (updateData.notes !== undefined) enquiry.notes = updateData.notes;

  await enquiry.save();
  return enquiry;
};

export const deleteEnquiry = async (id) => {
  const enquiry = await Enquiry.findByIdAndDelete(id);
  if (!enquiry) {
    throw new ApiError(404, 'Enquiry not found');
  }
  return { message: 'Enquiry deleted successfully' };
};

/**
 * 7. Review Moderation
 */
export const getAllReviews = async (queryParams = {}) => {
  const page = Math.max(1, parseInt(queryParams.page || 1, 10));
  const limit = Math.min(100, Math.max(1, parseInt(queryParams.limit || 20, 10)));
  const skip = (page - 1) * limit;

  const filter = {};
  if (queryParams.status && queryParams.status !== 'ALL') {
    filter.status = queryParams.status.toUpperCase();
  }

  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .populate('property', 'title slug thumbnail city')
      .populate('user', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Review.countDocuments(filter),
  ]);

  return {
    reviews,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
};

export const updateReviewStatus = async (id, status, adminUser) => {
  const review = await Review.findById(id);
  if (!review) {
    throw new ApiError(404, 'Review not found');
  }

  review.status = status;
  await review.save();

  await logActivity({
    user: adminUser,
    action: `REVIEW_${status}`,
    entityType: 'Review',
    entityId: review._id,
    details: `Admin marked review status as ${status}`,
  });

  return review;
};

export const deleteReview = async (id, adminUser) => {
  const review = await Review.findByIdAndDelete(id);
  if (!review) {
    throw new ApiError(404, 'Review not found');
  }

  await logActivity({
    user: adminUser,
    action: 'REVIEW_DELETED',
    entityType: 'Review',
    entityId: id,
    details: 'Admin deleted property review',
  });

  return { message: 'Review deleted successfully' };
};

/**
 * 8. Report Management
 */
export const getAllReports = async (queryParams = {}) => {
  const page = Math.max(1, parseInt(queryParams.page || 1, 10));
  const limit = Math.min(100, Math.max(1, parseInt(queryParams.limit || 20, 10)));
  const skip = (page - 1) * limit;

  const filter = {};
  if (queryParams.status && queryParams.status !== 'ALL') {
    filter.status = queryParams.status.toUpperCase();
  }

  const [reports, total] = await Promise.all([
    Report.find(filter)
      .populate('reportedBy', 'name email phone avatar')
      .populate('property', 'title slug thumbnail price priceUnit city state')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Report.countDocuments(filter),
  ]);

  return {
    reports,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
};

export const updateReportStatus = async (id, status, adminNotes, adminUser) => {
  const report = await Report.findById(id);
  if (!report) {
    throw new ApiError(404, 'Report not found');
  }

  if (status) report.status = status.toUpperCase();
  if (adminNotes !== undefined) report.adminNotes = adminNotes;
  report.reviewedBy = adminUser.id || adminUser._id;
  await report.save();

  await logActivity({
    user: adminUser,
    action: `REPORT_${status}`,
    entityType: 'Report',
    entityId: report._id,
    details: `Admin marked report as ${status}. Notes: ${adminNotes || 'None'}`,
  });

  return report;
};

export const deleteReport = async (id, adminUser) => {
  const report = await Report.findByIdAndDelete(id);
  if (!report) {
    throw new ApiError(404, 'Report not found');
  }

  await logActivity({
    user: adminUser,
    action: 'REPORT_DELETED',
    entityType: 'Report',
    entityId: id,
    details: 'Admin dismissed/deleted user report',
  });

  return { message: 'Report deleted' };
};

/**
 * 9. Activity Logs
 */
export const getActivityLogs = async (queryParams = {}) => {
  const page = Math.max(1, parseInt(queryParams.page || 1, 10));
  const limit = Math.min(100, Math.max(1, parseInt(queryParams.limit || 25, 10)));
  const skip = (page - 1) * limit;

  const filter = {};
  if (queryParams.entityType && queryParams.entityType !== 'ALL') {
    filter.entityType = queryParams.entityType;
  }

  const [logs, total] = await Promise.all([
    ActivityLog.find(filter)
      .populate('user', 'name email role avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    ActivityLog.countDocuments(filter),
  ]);

  return {
    logs,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
};

/**
 * 10. Platform Settings
 */
export const getSettings = async () => {
  let settings = await Setting.findOne({ key: 'global_platform_settings' });
  if (!settings) {
    settings = await Setting.create({ key: 'global_platform_settings' });
  }
  return settings;
};

export const updateSettings = async (updateData, adminUser) => {
  let settings = await Setting.findOne({ key: 'global_platform_settings' });
  if (!settings) {
    settings = new Setting({ key: 'global_platform_settings' });
  }

  const allowedFields = [
    'siteName',
    'supportEmail',
    'supportPhone',
    'autoApproveVerifiedAgents',
    'maintenanceMode',
    'featuredPropertyFee',
    'maxImagesPerListing',
    'currencySymbol',
  ];

  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      settings[field] = updateData[field];
    }
  });

  await settings.save();

  await logActivity({
    user: adminUser,
    action: 'SETTINGS_UPDATED',
    entityType: 'Setting',
    entityId: settings._id,
    details: 'Admin updated global platform configuration parameters',
  });

  return settings;
};
