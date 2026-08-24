import { v2 as cloudinary } from 'cloudinary';
import ENV from './env.js';

// Configure Cloudinary SDK with environment variables
cloudinary.config({
  cloud_name: ENV.CLOUDINARY.CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
  api_key: ENV.CLOUDINARY.API_KEY || process.env.CLOUDINARY_API_KEY,
  api_secret: ENV.CLOUDINARY.API_SECRET || process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const isCloudinaryConfigured = () => {
  const name = ENV.CLOUDINARY.CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME || '';
  const key = ENV.CLOUDINARY.API_KEY || process.env.CLOUDINARY_API_KEY || '';
  const secret = ENV.CLOUDINARY.API_SECRET || process.env.CLOUDINARY_API_SECRET || '';

  return (
    Boolean(name && key && secret) &&
    !name.startsWith('dev_') &&
    !key.startsWith('dev_') &&
    !secret.startsWith('dev_')
  );
};

export default cloudinary;
