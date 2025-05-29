import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/authRoutes';
import callRoutes from './routes/callRoutes';
import notificationRoutes from './routes/notificationRoutes';
import watchlistRoutes from './routes/watchlistRoutes';
import stockRoutes from './routes/stockRoutes';
import { env, isProd } from './config/env';
import cookieParser from 'cookie-parser';
import './utils/priceTrackerJob';
import session from 'express-session';
import passport from 'passport';
import './config/passport';

// Create Express app
const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: env.corsOrigin,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// Database connection
mongoose
  .connect(env.mongoUri)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/calls', callRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/watchlists', watchlistRoutes);
app.use('/api/stocks', stockRoutes);
// app.use('/api/brokers', brokerRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(env.port, () => {
  console.log(`Server is running in ${env.nodeEnv} mode on port ${env.port}`);
  if (!isProd) {
    console.log(`API Documentation available at http://localhost:${env.port}/api-docs`);
  }
}); 