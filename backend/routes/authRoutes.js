const express = require('express');
const { register, login, resetPassword, forgotPassword } = require('../controllers/authController');
const router = express.Router();
const { body } = require('express-validator');

router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('age').isInt({ min: 0 }).withMessage('Age must be a valid number'),
    body('gender').isIn(['male', 'female', 'other']).withMessage('Gender must be male, female, or other'),
  ],
  register
);

router.post('/login', login);

// Forgot password route
router.post(
  '/forgot-password',
  [body('email').isEmail().withMessage('Enter a valid email')],
  forgotPassword
);

// Reset password route
router.post(
  '/reset-password',
  [
    body('token').notEmpty().withMessage('Token is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  resetPassword
);

module.exports = router;
