import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { ENV } from './config/env.js';
import { getDbState, isDbConnected } from './config/db.js';

import { globalLimiter } from './middlewares/rateLimiterMiddleware.js';
import { sanitizeNoSql } from './middlewares/securityMiddleware.js';
import errorHandlerMiddleware from './middlewares/errorHandlerMiddleware.js';

import masterRouter from './routes/index.js';

const app = express();

/* =========================================================
   TRUST PROXY CONFIGURATION (Required for Render, Vercel, Cloudflare)
========================================================= */
app.set('trust proxy', 1);

/* =========================================================
   SECURITY HEADERS
========================================================= */

app.use(helmet());


/* =========================================================
   CORS CONFIGURATION
========================================================= */


app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an origin (Postman, mobile, server-to-server)
      if (!origin) {
        return callback(null, true);
      }

      // Allow configured frontend client URL
      if (origin === ENV.CLIENT_URL) {
        return callback(null, true);
      }

      // Allow production Vercel frontend and preview deployments
      if (
        origin === 'https://real-state-managment-system.vercel.app' ||
        origin.endsWith('.vercel.app') ||
        origin.includes('vercel.app')
      ) {
        return callback(null, true);
      }

      // Allow Render server itself
      if (
        origin === 'https://real-state-managment-systemser.onrender.com' ||
        origin === 'https://real-state-managment-system.onrender.com' ||
        origin.endsWith('.onrender.com')
      ) {
        return callback(null, true);
      }

      // Allow localhost and 127.0.0.1 during local testing
      if (
        origin.startsWith('http://localhost:') ||
        origin.startsWith('http://127.0.0.1:') ||
        origin.startsWith('https://localhost:')
      ) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS policy: Access denied for origin ${origin}`)
      );
    },

    credentials: true,

    methods: [
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
      'OPTIONS',
    ],


    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
    ],
  })
);


/* =========================================================
   LOGGING
========================================================= */

if (ENV.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}


/* =========================================================
   GLOBAL RATE LIMITER
========================================================= */

app.use('/api', globalLimiter);


/* =========================================================
   BODY PARSERS
========================================================= */

app.use(
  express.json({
    limit: '10mb',
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: '10mb',
  })
);


/* =========================================================
   NOSQL QUERY SANITIZATION
========================================================= */

app.use(sanitizeNoSql);


/* =========================================================
   ROOT ROUTE
========================================================= */

app.get('/', (req, res) => {
  console.log('🔥 ROOT ROUTE HIT');

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Real Estate Management API is running',
  });
});


/* =========================================================
   HEALTH CHECK
========================================================= */

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
      heapUsedMB: Math.round(
        memoryUsage.heapUsed / 1024 / 1024
      ),

      heapTotalMB: Math.round(
        memoryUsage.heapTotal / 1024 / 1024
      ),
    },
  });
});


/* =========================================================
   MASTER API ROUTES
========================================================= */

// All application APIs start with:
//
// /api/v1/
//
// Example:
//
// GET    /api/v1/properties
// POST   /api/v1/properties
// GET    /api/v1/users
// POST   /api/v1/auth/login

app.use('/api/v1', masterRouter);


/* =========================================================
   404 FALLBACK
========================================================= */

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: `API Route not found: ${req.originalUrl}`,
  });
});


/* =========================================================
   GLOBAL ERROR HANDLER
========================================================= */

app.use(errorHandlerMiddleware);


/* =========================================================
   EXPORT APP
========================================================= */

export default app;