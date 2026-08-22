import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { ENV } from './config/env.js';
import { getDbState, isDbConnected } from './config/db.js';
import { globalLimiter } from './middlewares/rateLimiterMiddleware.js';
import { sanitizeNoSql } from './middlewares/securityMiddleware.js';
import masterRouter from './routes/index.js';
import errorHandlerMiddleware from './middlewares/errorHandlerMiddleware.js';

const app = express();

// Security Headers
app.use(helmet());

// CORS Configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, postman) or matching CLIENT_URL
      if (!origin || origin === ENV.CLIENT_URL || origin.startsWith('http://localhost:')) {
        callback(null, true);
      } else {
        callback(new Error('CORS policy: Access denied for this origin.'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Logging Middleware
if (ENV.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Global Rate Limiting
app.use('/api', globalLimiter);

// Body Parser Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// NoSQL Query Injection Sanitizer
app.use(sanitizeNoSql);

// Enhanced Health Check & Diagnostic API
app.get('/api/v1/health', (req, res) => {
  const memoryUsage = process.memoryUsage();
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Real Estate Management API is healthy and running',
    environment: ENV.NODE_ENV,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      status: getDbState(),
      isConnected: isDbConnected(),
    },
    memory: {
      heapUsedMB: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      heapTotalMB: Math.round(memoryUsage.heapTotal / 1024 / 1024),
    },
  });
});

// Master API Routes
app.use('/api/v1', masterRouter);

// Fallback 404 Route
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: `API Route not found: ${req.originalUrl}`,
  });
});

// Central Global Error Handler
app.use(errorHandlerMiddleware);

export default app;
