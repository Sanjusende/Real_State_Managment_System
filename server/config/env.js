import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

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
    MAX_REQUESTS: process.env.NODE_ENV === 'production' ? 100 : 10000,
    AUTH_MAX_REQUESTS: process.env.NODE_ENV === 'production' ? 20 : 5000,
  },
};

export default ENV;
