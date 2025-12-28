/**
 * MCP Hub Backend Server
 * AI-Powered MCP Server Management Platform
 */

import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { Server as SocketIOServer } from 'socket.io';
import { createServer } from 'http';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import configurations
import { logger } from './config/logger';
import { prisma } from './config/database';
import { redisClient } from './config/redis';

// Import routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import mcpRoutes from './routes/mcp.routes';
import aiRoutes from './routes/ai.routes';
import analyticsRoutes from './routes/analytics.routes';

// Import middleware
import { errorHandler } from './middleware/error.middleware';
import { rateLimiter } from './middleware/rateLimit.middleware';
import { authenticate } from './middleware/auth.middleware';

// Initialize Express app
const app: Application = express();
const httpServer = createServer(app);

// Initialize Socket.IO for real-time features
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },
});

// Configuration
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';
const API_VERSION = process.env.API_VERSION || 'v1';

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
}));

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Compression middleware
app.use(compression());

// Request logging
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
  }));
}

// Health check endpoint
app.get('/health', async (req: Request, res: Response) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    // Check Redis connection
    const redisPing = await redisClient.ping();

    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: NODE_ENV,
      services: {
        database: 'connected',
        redis: redisPing === 'PONG' ? 'connected' : 'disconnected',
      },
    });
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Service unavailable',
    });
  }
});

// API routes
const apiRouter = express.Router();

// Public routes
apiRouter.use('/auth', authRoutes);

// Protected routes
apiRouter.use('/users', authenticate, userRoutes);
apiRouter.use('/mcp', authenticate, mcpRoutes);
apiRouter.use('/ai', authenticate, aiRoutes);
apiRouter.use('/analytics', authenticate, analyticsRoutes);

// Mount API router
app.use(`/api/${API_VERSION}`, rateLimiter, apiRouter);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'MCP Hub API',
    version: API_VERSION,
    description: 'AI-Powered MCP Server Management Platform',
    documentation: `${process.env.BACKEND_URL}/api/${API_VERSION}/docs`,
    health: `${process.env.BACKEND_URL}/health`,
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    timestamp: new Date().toISOString(),
  });
});

// Global error handler
app.use(errorHandler);

// Socket.IO connection handling
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);

  socket.on('subscribe:server', (serverId: string) => {
    socket.join(`server:${serverId}`);
    logger.debug(`Client ${socket.id} subscribed to server ${serverId}`);
  });

  socket.on('unsubscribe:server', (serverId: string) => {
    socket.leave(`server:${serverId}`);
    logger.debug(`Client ${socket.id} unsubscribed from server ${serverId}`);
  });

  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Make io accessible to routes
app.set('io', io);

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);

  // Close HTTP server
  httpServer.close(() => {
    logger.info('HTTP server closed');
  });

  try {
    // Disconnect from database
    await prisma.$disconnect();
    logger.info('Database disconnected');

    // Disconnect from Redis
    await redisClient.quit();
    logger.info('Redis disconnected');

    logger.info('Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown:', error);
    process.exit(1);
  }
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await prisma.$connect();
    logger.info('Database connected successfully');

    // Connect to Redis
    await redisClient.connect();
    logger.info('Redis connected successfully');

    // Start HTTP server
    httpServer.listen(PORT, () => {
      logger.info(`🚀 MCP Hub API Server running on port ${PORT}`);
      logger.info(`📚 Environment: ${NODE_ENV}`);
      logger.info(`🔗 Health check: http://${process.env.HOST || 'localhost'}:${PORT}/health`);
      logger.info(`🌐 API Base URL: http://${process.env.HOST || 'localhost'}:${PORT}/api/${API_VERSION}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the application
startServer();

export { app, io };
