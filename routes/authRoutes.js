const express = require('express');
const {
  register,
  login,
  forgotPassword,
  verifyEmail,
  resetPassword,
  verifyOtp,
  updatePassword
} = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify-email/:token', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/update-password', updatePassword);

module.exports = router;
