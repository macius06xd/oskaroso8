const express = require('express');
const {
  register,
  login,
  getMe,
  updateDetails,
  updatePassword,
  logout
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const {
  validateRequest,
  registerSchema,
  loginSchema,
  updateUserSchema,
  updatePasswordSchema
} = require('../utils/validation');

const router = express.Router();

// Public routes
router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, validateRequest(updateUserSchema), updateDetails);
router.put('/updatepassword', protect, validateRequest(updatePasswordSchema), updatePassword);
router.post('/logout', protect, logout);

module.exports = router;
