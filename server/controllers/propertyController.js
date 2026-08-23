import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as propertyService from '../services/propertyService.js';

export const createProperty = asyncHandler(async (req, res) => {
  const property = await propertyService.createProperty(req.body, req.user);
  res.status(201).json(new ApiResponse(201, 'Property created successfully (Pending Approval)', property));
});

export const getProperties = asyncHandler(async (req, res) => {
  const result = await propertyService.getAllProperties(req.query, req.user);
  res.status(200).json(new ApiResponse(200, 'Properties retrieved successfully', result));
});

export const getProperty = asyncHandler(async (req, res) => {
  const property = await propertyService.getPropertyById(req.params.id, req.user);
  res.status(200).json(new ApiResponse(200, 'Property details retrieved successfully', property));
});

export const getPropertyBySlug = asyncHandler(async (req, res) => {
  const property = await propertyService.getPropertyBySlug(req.params.slug, req.user);
  res.status(200).json(new ApiResponse(200, 'Property details retrieved successfully', property));
});

export const getMyProperties = asyncHandler(async (req, res) => {
  const result = await propertyService.getMyProperties(req.user, req.query);
  res.status(200).json(new ApiResponse(200, 'My properties retrieved successfully', result));
});

export const updateProperty = asyncHandler(async (req, res) => {
  const property = await propertyService.updateProperty(req.params.id, req.body, req.user);
  res.status(200).json(new ApiResponse(200, 'Property updated successfully', property));
});

export const deleteProperty = asyncHandler(async (req, res) => {
  await propertyService.deleteProperty(req.params.id, req.user);
  res.status(200).json(new ApiResponse(200, 'Property deleted successfully'));
});

export const updateStatus = asyncHandler(async (req, res) => {
  const property = await propertyService.updatePropertyStatus(req.params.id, req.body.status, req.user);
  res.status(200).json(new ApiResponse(200, 'Property status updated successfully', property));
});

export const updateApproval = asyncHandler(async (req, res) => {
  const property = await propertyService.updatePropertyApproval(req.params.id, req.body.approvalStatus, req.user);
  res.status(200).json(new ApiResponse(200, `Property approval status updated to '${req.body.approvalStatus}'`, property));
});

export const toggleFeatured = asyncHandler(async (req, res) => {
  const property = await propertyService.togglePropertyFeatured(req.params.id, req.body.isFeatured, req.user);
  res.status(200).json(new ApiResponse(200, `Property featured status updated`, property));
});
