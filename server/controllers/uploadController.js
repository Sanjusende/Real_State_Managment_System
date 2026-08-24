import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as uploadService from '../services/uploadService.js';

export const uploadPropertyImages = asyncHandler(async (req, res) => {
  const images = await uploadService.uploadPropertyImages(req.files, req.user);
  res.status(200).json(
    new ApiResponse(200, 'Property images uploaded successfully', { images })
  );
});

export const uploadAvatar = asyncHandler(async (req, res) => {
  const result = await uploadService.uploadUserAvatar(req.file, req.user);
  res.status(200).json(
    new ApiResponse(200, 'Profile avatar uploaded successfully', result)
  );
});

export const deletePropertyImage = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;
  const { publicId } = req.body;
  const result = await uploadService.deletePropertyImage(
    propertyId,
    publicId,
    req.user
  );
  res.status(200).json(new ApiResponse(200, result.message, result));
});
