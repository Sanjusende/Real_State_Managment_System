import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as reportService from '../services/reportService.js';

export const createReport = asyncHandler(async (req, res) => {
  const result = await reportService.createReport(req.user.id, req.body);
  res.status(201).json(new ApiResponse(201, 'Report submitted for administrative review', result));
});

export const getUserReports = asyncHandler(async (req, res) => {
  const result = await reportService.getUserReports(req.user.id, req.query);
  res.status(200).json(new ApiResponse(200, 'Your submitted reports retrieved', result));
});

export const updateReportStatus = asyncHandler(async (req, res) => {
  const result = await reportService.updateReportStatus(req.params.id, req.user, req.body);
  res.status(200).json(new ApiResponse(200, 'Report status updated', result));
});
