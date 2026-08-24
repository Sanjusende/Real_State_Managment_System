import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as reviewService from '../services/reviewService.js';

export const getPropertyReviews = asyncHandler(async (req, res) => {
  const result = await reviewService.getPropertyReviews(req.params.propertyId, req.query);
  res.status(200).json(new ApiResponse(200, 'Property reviews retrieved', result));
});

export const addOrUpdateReview = asyncHandler(async (req, res) => {
  const result = await reviewService.addOrUpdateReview(
    req.params.propertyId,
    req.user,
    req.body
  );
  res.status(200).json(new ApiResponse(200, result.message, result));
});

export const deleteReview = asyncHandler(async (req, res) => {
  const result = await reviewService.deleteReview(req.params.id, req.user);
  res.status(200).json(new ApiResponse(200, 'Review deleted', result));
});
