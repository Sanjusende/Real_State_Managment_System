import mongoose from 'mongoose';
import dns from 'dns';
import { ENV } from './env.js';

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch {}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(ENV.MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`[MongoDB Warning] Could not connect to MongoDB: ${error.message}`);
    console.warn(`[MongoDB Warning] Server will remain online with simulated database resilience.`);
    return null;
  }
};

export const isDbConnected = () => {
  return mongoose.connection.readyState === 1;
};

export const getDbState = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  return states[mongoose.connection.readyState] || 'unknown';
};

mongoose.connection.on('disconnected', () => {
  console.log('[MongoDB] Connection disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error(`[MongoDB Error]: ${err.message}`);
});

export default connectDB;
