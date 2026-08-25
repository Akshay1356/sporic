import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import { fileURLToPath } from 'url';

import apiRouter from './routes/index.js';
import { apiLimiter } from './middleware/rateLimiter.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';
import { config } from './config/index.js';
import { errorResponse, successResponse } from './utils/response.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS configuration
app.use(
  cors({
    origin: [config.clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiter
app.use('/api', apiLimiter);

// Serve static uploads
const uploadsDir = path.resolve(config.upload.dir);
app.use('/uploads', express.static(uploadsDir));

// Swagger UI Documentation
try {
  const openapiPath = path.join(__dirname, 'docs', 'openapi.json');
  if (fs.existsSync(openapiPath)) {
    const openapiDoc = JSON.parse(fs.readFileSync(openapiPath, 'utf8'));
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiDoc));
  }
} catch (e) {
  console.warn('⚠️ Swagger UI loading warning:', e.message);
}

// Health check endpoint
app.get('/health', (req, res) => {
  return successResponse(res, { status: 'healthy', timestamp: new Date().toISOString() }, 'SPORIC backend operational');
});

// API Routes
app.use('/api', apiRouter);

// 404 Handler
app.use('*', (req, res) => {
  return errorResponse(res, `Route ${req.originalUrl} not found on this server.`, 404, 'NOT_FOUND');
});

// Central Error Handler
app.use(errorHandler);

export default app;
