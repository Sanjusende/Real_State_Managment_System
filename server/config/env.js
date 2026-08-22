import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/real_estate_db',
  
  JWT: {
    SECRET: process.env.JWT_SECRET || 'dev_jwt_secret_key_super_secure_123456789_real_estate',
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  },

  CLOUDINARY: {
    CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
    API_KEY: process.env.CLOUDINARY_API_KEY || '',
    API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
  },

  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100, // max 100 requests per window
    AUTH_MAX_REQUESTS: 10, // max 10 auth requests per window
  },
};

export default ENV;
