import api from './api';

/**
 * Upload multiple property images
 * @param {File[]} files
 * @returns {Promise<{ images: Array<{ url: string, publicId: string, isThumbnail: boolean, alt: string, order: number }> }>}
 */
export const uploadPropertyImages = async (files) => {
  const formData = new FormData();
  Array.from(files).forEach((file) => {
    formData.append('images', file);
  });

  const response = await api.post('/upload/property', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/**
 * Upload single user profile avatar
 * @param {File} file
 * @returns {Promise<{ avatar: string, avatarPublicId: string }>}
 */
export const uploadUserAvatar = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await api.post('/upload/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/**
 * Delete image from property and Cloudinary
 * @param {string} propertyId
 * @param {string} publicId
 */
export const deletePropertyImage = async (propertyId, publicId) => {
  const response = await api.delete(`/upload/property/${propertyId}`, {
    data: { publicId },
  });

  return response.data;
};
