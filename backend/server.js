//imorts
import express from "express";
import cors from "cors";
import helmet from "helmet";

import { env } from "./src/config/env.js";
import apiRouter from "./src/routes/index.js";
import log from "./src/middleware/logger.middleware.js";
import error from "./src/middleware/error.middleware.js";
import { setupSwagger } from "./src/config/swagger.js";
import { rateLimit } from "./src/middleware/rate-limit.middleware.js";

const app = express();

// Global middlewares
// Configure Helmet with CORS-friendly settings
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginEmbedderPolicy: false,
  })
);

// CORS configuration - must be before other middleware
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://192.168.31.215:3000',
    ];

    // In development, allow all origins
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies and credentials
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Cache-Control', 'Pragma', 'Origin', 'X-Requested-With'],
  exposedHeaders: ['X-Request-Id', 'Content-Type'],
  maxAge: 86400, // 24 hours
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// Preserve raw body for webhook signature verification
// Store raw body in req.rawBody for webhook routes
app.use(express.json({
  verify: (req, res, buf) => {
    // Store raw body for webhook signature verification
    if (req.path && req.path.includes('/webhook')) {
      req.rawBody = buf.toString('utf8');
    }
  }
}));

app.use(rateLimit);
app.use(log);

// Swagger
setupSwagger(app);

// API routes
app.use("/api/v1", apiRouter);

// Error handler
app.use(error);

app.listen(env.port, '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${env.port}`);
  console.log(`Local: http://localhost:${env.port}`);
  console.log(`Network: http://192.168.31.215:${env.port}`);
});
