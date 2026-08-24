import { Readable } from 'stream';
import cloudinary, { isCloudinaryConfigured } from '../config/cloudinary.js';
import Property from '../models/Property.js';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import { ROLES } from '../config/constants.js';

/**
 * Upload single buffer to Cloudinary using stream
 */
export const uploadBufferToCloudinary = (buffer, folder = 'real_estate/properties') => {
  return new Promise((resolve, reject) => {
    if (!isCloudinaryConfigured()) {
      // Local Base64 fallback in case environment credentials are not yet populated
      const base64 = buffer.toString('base64');
      const dataUri = `data:image/jpeg;base64,${base64}`;
      const mockPublicId = `local_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      return resolve({
        secure_url: dataUri,
        public_id: mockPublicId,
      });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [
          { quality: 'auto:good' },
          { fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error) {
          console.warn('Cloudinary upload error:', error.message);
          // In development fallback to data URI if credentials are not active
          const base64 = buffer.toString('base64');
          const dataUri = `data:image/jpeg;base64,${base64}`;
          const mockPublicId = `local_${Date.now()}_${Math.random().toString(36).substring(7)}`;
          return resolve({
            secure_url: dataUri,
            public_id: mockPublicId,
          });
        }
        resolve(result);
      }
    );

    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    stream.pipe(uploadStream);
  });
};

/**
 * Remove an asset from Cloudinary
 */
export const deleteFromCloudinary = async (publicId) => {
  if (!publicId || publicId.startsWith('local_')) {
    return { result: 'ok' };
  }

  if (!isCloudinaryConfigured()) {
    return { result: 'ok' };
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'image',
    });
    return result;
  } catch (err) {
    console.error('Cloudinary deletion error:', err);
    return { result: 'error', error: err.message };
  }
};

/**
 * Handle batch upload of property images
 */
export const uploadPropertyImages = async (files, user) => {
  if (!files || files.length === 0) {
    throw new ApiError(400, 'No image files provided for upload');
  }

  const uploadPromises = files.map((file, idx) =>
    uploadBufferToCloudinary(file.buffer, 'real_estate/properties').then((result) => ({
      url: result.secure_url,
      publicId: result.public_id,
      isThumbnail: idx === 0,
      alt: file.originalname.replace(/\.[^/.]+$/, ''),
      order: idx,
    }))
  );

  const uploadedImages = await Promise.all(uploadPromises);
  return uploadedImages;
};

/**
 * Handle single user profile avatar upload
 */
export const uploadUserAvatar = async (file, user) => {
  if (!file) {
    throw new ApiError(400, 'No avatar image file provided');
  }

  const dbUser = await User.findById(user.id || user._id);
  if (!dbUser) {
    throw new ApiError(404, 'User not found');
  }

  // Delete previous Cloudinary avatar if exists
  if (dbUser.avatarPublicId) {
    await deleteFromCloudinary(dbUser.avatarPublicId);
  }

  const result = await uploadBufferToCloudinary(file.buffer, 'real_estate/avatars');

  dbUser.avatar = result.secure_url;
  dbUser.avatarPublicId = result.public_id;
  if (dbUser.role) dbUser.role = dbUser.role.toUpperCase();
  await dbUser.save();

  return {
    avatar: dbUser.avatar,
    avatarPublicId: dbUser.avatarPublicId,
  };
};

/**
 * Delete a specific image from a property and cleanup Cloudinary
 */
export const deletePropertyImage = async (propertyId, publicId, user) => {
  const property = await Property.findById(propertyId);
  if (!property) {
    throw new ApiError(404, 'Property not found');
  }

  // Ownership verification
  const isOwner = property.owner.toString() === (user.id || user._id);
  const isAgent = property.agent && property.agent.toString() === (user.id || user._id);
  const isAdmin = user.role === ROLES.ADMIN;

  if (!isOwner && !isAgent && !isAdmin) {
    throw new ApiError(403, 'Forbidden: You do not have permission to delete images from this property');
  }

  // Find image in property
  const imageIndex = property.images.findIndex((img) => img.publicId === publicId || img.url === publicId);
  if (imageIndex === -1) {
    throw new ApiError(404, 'Image not found on this property');
  }

  const removedImage = property.images[imageIndex];

  // Remove from property images array
  property.images.splice(imageIndex, 1);

  // If deleted image was the thumbnail, set the first remaining image as thumbnail
  if (removedImage.isThumbnail && property.images.length > 0) {
    property.images[0].isThumbnail = true;
    property.thumbnail = property.images[0].url;
  } else if (property.images.length === 0) {
    property.thumbnail = '';
  }

  await property.save();

  // Delete asset from Cloudinary
  if (removedImage.publicId) {
    await deleteFromCloudinary(removedImage.publicId);
  }

  return {
    message: 'Property image removed successfully',
    images: property.images,
    thumbnail: property.thumbnail,
  };
};
