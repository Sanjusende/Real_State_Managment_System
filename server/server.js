import dotenv from 'dotenv';
import dns from 'dns';

try {
  dns.setServers(["1.1.1.1", "8.8.8.8"]);
} catch {}
dotenv.config();

import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

// Connect to MongoDB Database
connectDB();

const server = app.listen(PORT, () => {
  console.log(`[Server] Real Estate API server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`[UnhandledRejection Error]: ${err.message}`);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`[UncaughtException Error]: ${err.message}`);
  process.exit(1);
});
