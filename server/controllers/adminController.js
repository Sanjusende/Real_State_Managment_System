import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as adminService from '../services/adminService.js';

// Analytics
export const getAdminAnalytics = asyncHandler(async (req, res) => {
  const result = await adminService.getAdminAnalytics();
  res.status(200).json(new ApiResponse(200, 'Admin analytics retrieved', result));
});

// Users
export const getUsers = asyncHandler(async (req, res) => {
  const result = await adminService.getUsers(req.query);
  res.status(200).json(new ApiResponse(200, 'Users retrieved successfully', result));
});

export const getUserById = asyncHandler(async (req, res) => {
  const result = await adminService.getUserById(req.params.id);
  res.status(200).json(new ApiResponse(200, 'User details retrieved', result));
});

export const updateUser = asyncHandler(async (req, res) => {
  const result = await adminService.updateUser(req.params.id, req.body, req.user);
  res.status(200).json(new ApiResponse(200, 'User updated successfully', result));
});

export const toggleUserBlock = asyncHandler(async (req, res) => {
  const result = await adminService.toggleUserBlock(req.params.id, req.user);
  res.status(200).json(new ApiResponse(200, 'User status updated', result));
});

export const deleteUser = asyncHandler(async (req, res) => {
  const result = await adminService.deleteUser(req.params.id, req.user);
  res.status(200).json(new ApiResponse(200, 'User removed successfully', result));
});

// Properties
export const getAllProperties = asyncHandler(async (req, res) => {
  const result = await adminService.getAllProperties(req.query);
  res.status(200).json(new ApiResponse(200, 'Properties retrieved successfully', result));
});

export const getPendingProperties = asyncHandler(async (req, res) => {
  const result = await adminService.getPendingProperties(req.query);
  res.status(200).json(new ApiResponse(200, 'Pending properties retrieved', result));
});

export const approveProperty = asyncHandler(async (req, res) => {
  const result = await adminService.approveProperty(req.params.id, req.user);
  res.status(200).json(new ApiResponse(200, 'Property approved successfully', result));
});

export const rejectProperty = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  const result = await adminService.rejectProperty(req.params.id, reason, req.user);
  res.status(200).json(new ApiResponse(200, 'Property rejected', result));
});

export const toggleFeatureProperty = asyncHandler(async (req, res) => {
  const result = await adminService.toggleFeatureProperty(req.params.id, req.user);
  res.status(200).json(new ApiResponse(200, 'Property featured status toggled', result));
});

export const deleteProperty = asyncHandler(async (req, res) => {
  const result = await adminService.deleteProperty(req.params.id, req.user);
  res.status(200).json(new ApiResponse(200, 'Property deleted successfully', result));
});

// Categories
export const getCategories = asyncHandler(async (req, res) => {
  const result = await adminService.getCategories();
  res.status(200).json(new ApiResponse(200, 'Categories retrieved', result));
});

export const createCategory = asyncHandler(async (req, res) => {
  const result = await adminService.createCategory(req.body, req.user);
  res.status(201).json(new ApiResponse(201, 'Category created', result));
});

export const updateCategory = asyncHandler(async (req, res) => {
  const result = await adminService.updateCategory(req.params.id, req.body, req.user);
  res.status(200).json(new ApiResponse(200, 'Category updated', result));
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const result = await adminService.deleteCategory(req.params.id, req.user);
  res.status(200).json(new ApiResponse(200, 'Category deleted', result));
});

// Locations
export const getLocations = asyncHandler(async (req, res) => {
  const result = await adminService.getLocations();
  res.status(200).json(new ApiResponse(200, 'Locations retrieved', result));
});

export const createLocation = asyncHandler(async (req, res) => {
  const result = await adminService.createLocation(req.body, req.user);
  res.status(201).json(new ApiResponse(201, 'Location created', result));
});

export const updateLocation = asyncHandler(async (req, res) => {
  const result = await adminService.updateLocation(req.params.id, req.body, req.user);
  res.status(200).json(new ApiResponse(200, 'Location updated', result));
});

export const deleteLocation = asyncHandler(async (req, res) => {
  const result = await adminService.deleteLocation(req.params.id, req.user);
  res.status(200).json(new ApiResponse(200, 'Location deleted', result));
});

// Enquiries
export const getAllEnquiries = asyncHandler(async (req, res) => {
  const result = await adminService.getAllEnquiries(req.query);
  res.status(200).json(new ApiResponse(200, 'All enquiries retrieved', result));
});

export const updateEnquiry = asyncHandler(async (req, res) => {
  const result = await adminService.updateEnquiry(req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, 'Enquiry updated', result));
});

export const deleteEnquiry = asyncHandler(async (req, res) => {
  const result = await adminService.deleteEnquiry(req.params.id);
  res.status(200).json(new ApiResponse(200, 'Enquiry deleted', result));
});

// Reviews
export const getAllReviews = asyncHandler(async (req, res) => {
  const result = await adminService.getAllReviews(req.query);
  res.status(200).json(new ApiResponse(200, 'Reviews retrieved', result));
});

export const updateReviewStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const result = await adminService.updateReviewStatus(req.params.id, status, req.user);
  res.status(200).json(new ApiResponse(200, 'Review status updated', result));
});

export const deleteReview = asyncHandler(async (req, res) => {
  const result = await adminService.deleteReview(req.params.id, req.user);
  res.status(200).json(new ApiResponse(200, 'Review deleted', result));
});

// Reports
export const getAllReports = asyncHandler(async (req, res) => {
  const result = await adminService.getAllReports(req.query);
  res.status(200).json(new ApiResponse(200, 'Reports retrieved', result));
});

export const updateReportStatus = asyncHandler(async (req, res) => {
  const { status, adminNotes } = req.body;
  const result = await adminService.updateReportStatus(req.params.id, status, adminNotes, req.user);
  res.status(200).json(new ApiResponse(200, 'Report status updated', result));
});

export const deleteReport = asyncHandler(async (req, res) => {
  const result = await adminService.deleteReport(req.params.id, req.user);
  res.status(200).json(new ApiResponse(200, 'Report deleted', result));
});

// Activity Logs
export const getActivityLogs = asyncHandler(async (req, res) => {
  const result = await adminService.getActivityLogs(req.query);
  res.status(200).json(new ApiResponse(200, 'Activity logs retrieved', result));
});

// Settings
export const getSettings = asyncHandler(async (req, res) => {
  const result = await adminService.getSettings();
  res.status(200).json(new ApiResponse(200, 'Platform settings retrieved', result));
});

export const updateSettings = asyncHandler(async (req, res) => {
  const result = await adminService.updateSettings(req.body, req.user);
  res.status(200).json(new ApiResponse(200, 'Platform settings updated', result));
});
