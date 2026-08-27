import api from './api';

/**
 * Upload multiple property images
 * @param {File[]} files
 */
export const uploadPropertyImages = async (files) => {
  const formData = new FormData();
  Array.from(files).forEach((file) => {
    formData.append('images', file);
  });

  return await api.post('/upload/property', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * Upload single user profile avatar
 * @param {File} file
 */
export const uploadUserAvatar = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  return await api.post('/upload/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * Delete image from property and Cloudinary
 * @param {string} propertyId
 * @param {string} publicId
 */
export const deletePropertyImage = async (propertyId, publicId) => {
  return await api.delete(`/upload/property/${propertyId}`, {
    data: { publicId },
  });
};
