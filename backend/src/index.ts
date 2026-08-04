import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { connectDB, disconnectDB } from './config/db';
import dashboardRoutes from './routes/dashboardRoutes';
import memberRoutes from './routes/memberRoutes';
import authRoutes from './routes/authRoutes';
import { errorHandler } from './middlewares/errorHandler';
import './config/passport';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:3001'
  ],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use(passport.initialize());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/members', memberRoutes);
import activityRoutes from './routes/activityRoutes';
app.use('/api/activities', activityRoutes);
import eventRoutes from './routes/eventRoutes';
app.use('/api/events', eventRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Database connection and server start
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: any) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  disconnectDB().then(() => process.exit(1));
});
