import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as locationService from '../services/locationService.js';

export const getLocations = asyncHandler(async (req, res) => {
  const locations = await locationService.getAllLocations(req.query);
  res.status(200).json(new ApiResponse(200, 'Locations retrieved successfully', locations));
});

export const getPopular = asyncHandler(async (req, res) => {
  const locations = await locationService.getPopularLocations(req.query.limit || 8);
  res.status(200).json(new ApiResponse(200, 'Popular locations retrieved successfully', locations));
});

export const getLocation = asyncHandler(async (req, res) => {
  const location = await locationService.getLocationById(req.params.id);
  res.status(200).json(new ApiResponse(200, 'Location details retrieved successfully', location));
});

export const getLocationSlug = asyncHandler(async (req, res) => {
  const location = await locationService.getLocationBySlug(req.params.slug);
  res.status(200).json(new ApiResponse(200, 'Location details retrieved successfully', location));
});

export const addLocation = asyncHandler(async (req, res) => {
  const location = await locationService.createLocation(req.body);
  res.status(201).json(new ApiResponse(201, 'Location created successfully', location));
});

export const editLocation = asyncHandler(async (req, res) => {
  const location = await locationService.updateLocation(req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, 'Location updated successfully', location));
});

export const removeLocation = asyncHandler(async (req, res) => {
  await locationService.deleteLocation(req.params.id);
  res.status(200).json(new ApiResponse(200, 'Location deleted successfully'));
});
