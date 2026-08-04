import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { protect, AuthRequest } from '../middlewares/authMiddleware';

const router = express.Router();

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

// @route   GET /api/auth/google
// @desc    Authenticate with Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @route   GET /api/auth/google/callback
// @desc    Google auth callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req: any, res) => {
    const token = generateToken(req.user._id);
    
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.redirect(process.env.FRONTEND_URL || 'http://localhost:3000');
  }
);

import User from '../models/User';

// @route   GET /api/auth/dev-login
// @desc    Developer login bypass
router.get('/dev-login', async (req, res) => {
  if (process.env.NODE_ENV === 'production') return res.status(403).json({ message: 'Forbidden' });
  
  let user = await User.findOne({ email: 'dev@example.com' });
  if (!user) {
    user = await User.create({
      googleId: 'dev_123',
      name: 'Developer User',
      email: 'dev@example.com',
      avatar: 'https://i.pravatar.cc/150?u=dev',
    });
  }
  
  const token = generateToken(user._id as string);
  res.cookie('jwt', token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
  res.redirect(process.env.FRONTEND_URL || 'http://localhost:3000');
});

// @route   GET /api/auth/me
// @desc    Get current logged in user
router.get('/me', protect, (req: AuthRequest, res) => {
  res.json(req.user);
});

// @route   POST /api/auth/logout
// @desc    Logout user / clear cookie
router.post('/logout', (req, res) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.json({ message: 'Logged out successfully' });
});

export default router;
