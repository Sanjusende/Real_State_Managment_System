import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

const app = express();

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Logging Middleware
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Body Parser Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check API
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Real Estate Management API is healthy and running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Fallback 404 Route
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: `API Route not found: ${req.originalUrl}`,
  });
});

export default app;
