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
    CONTACT_MAX_REQUESTS: process.env.NODE_ENV === 'production' ? 5 : 500,
  },

  // Contact / Email Configuration
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@estatecraft.com',
  SMTP: {
    HOST: process.env.SMTP_HOST || '',
    PORT: parseInt(process.env.SMTP_PORT || '587', 10),
    USER: process.env.SMTP_USER || '',
    PASSWORD: process.env.SMTP_PASSWORD || '',
    FROM_NAME: process.env.SMTP_FROM_NAME || 'EstateCraft Support',
    FROM_EMAIL: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || 'no-reply@estatecraft.com',
  },

  // WhatsApp (Meta Cloud API & CallMeBot Free Gateway)
  WHATSAPP: {
    ACCESS_TOKEN: process.env.WHATSAPP_ACCESS_TOKEN || '',
    PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
    ADMIN_NUMBER: process.env.WHATSAPP_ADMIN_NUMBER || '',
    API_VERSION: process.env.WHATSAPP_API_VERSION || 'v21.0',
    CALLMEBOT_API_KEY: process.env.CALLMEBOT_API_KEY || '',
  },

  // Contact Settings
  CONTACT: {
    AUTO_REPLY_ENABLED: process.env.CONTACT_AUTO_REPLY_ENABLED === 'true',
  },
};

export default ENV;
