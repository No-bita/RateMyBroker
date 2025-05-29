import express from 'express';
import { body } from 'express-validator';
import { register, login, getCurrentUser, logout } from '../controllers/authController';
import { protect } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import { authLimiter } from '../middleware/rateLimiter';
import passport from 'passport';

const router = express.Router();

// Validation rules
const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/\d/)
    .withMessage('Password must contain a number')
    .matches(/[A-Z]/)
    .withMessage('Password must contain an uppercase letter'),
  body('name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),
];

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// Public routes with rate limiting and validation
router.post('/register', authLimiter, validateRequest(registerValidation), register);
router.post('/login', authLimiter, validateRequest(loginValidation), login);

// Protected routes
router.get('/me', protect, getCurrentUser);
router.post('/logout', protect, logout);

// Google OAuth routes - commented out until credentials are available
/*
// Google OAuth login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: true }),
  (req, res) => {
    // Redirect or respond with user info/token
    res.redirect('/dashboard');
  }
);
*/

export default router; 