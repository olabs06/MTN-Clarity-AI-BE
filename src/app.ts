import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import { seedDatabase } from './services/mockData';

// Middleware
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { apiLimiter } from './middleware/rateLimiter';

// Routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import planRoutes from './routes/plan.routes';
import usageRoutes from './routes/usage.routes';
import recommendationRoutes from './routes/recommendation.routes';
import savingsRoutes from './routes/savings.routes';
import chatRoutes from './routes/chat.routes';

dotenv.config();

const app = express();

// Basic middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Allow frontend to connect
  credentials: true
}));
app.use(express.json());
app.use(requestLogger);

// Global API rate limiting
app.use('/api', apiLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/usage', usageRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/savings', savingsRoutes);
app.use('/api/chat', chatRoutes);

// Global error handler MUST be the last middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to DB and start server
connectDB().then(async () => {
  // Seed the database with mock plans and test user
  await seedDatabase();
  
  app.listen(PORT, () => {
    console.log(`[Server] Running on port ${PORT}`);
    console.log(`[Server] Health check: http://localhost:${PORT}/health`);
  });
}).catch(err => {
  console.error('[Server] Failed to start:', err);
});