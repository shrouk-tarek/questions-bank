const User = require('../models/User');
const ErrorResponse = require('../utils/errorHandler');
const sendEmail = require('../utils/emailService');
const crypto = require('crypto');

// @desc    Register user with email verification
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const emailVerificationToken = crypto.randomBytes(20).toString('hex');
    const user = await User.create({
      email,
      password,
      emailVerificationToken
    });

    const verificationUrl = `${req.protocol}://${req.get('host')}/api/auth/verify-email/${emailVerificationToken}`;
    const message = `Verify your email by clicking the link: ${verificationUrl}`;

    await sendEmail({
      email: user.email,
      subject: 'Email Verification',
      message
    });

    res.status(200).json({
      success: true,
      message: 'Verification email sent'
    });
  } catch (err) {
    if (err.code === 11000) {
      // Handle duplicate key error
      return res.status(400).json({
        success: false,
        error: 'Email already exists'
      });
    }

    // Handle other errors
    return res.status(500).json({
      success: false,
      error: err.message || 'Server Error'
    });
  }
};

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
exports.verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ emailVerificationToken: token });

    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid token' });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Email verified' });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Server Error'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide an email and password'
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        error: 'Email not verified. Please verify your email to log in.'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Server Error'
    });
  }
};

// @desc    Forgot password with OTP
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, error: 'No user with that email' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    const message = `Your OTP is: ${otp}`;
    await sendEmail({
      email: user.email,
      subject: 'Password Reset OTP',
      message
    });

    res.status(200).json({ success: true, message: 'OTP sent to email' });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Server Error'
    });
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email, otp, otpExpire: { $gt: Date.now() } });

    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
    }

    // Mark OTP as verified
    user.isOtpVerified = true; // Add this flag
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'OTP verified successfully' });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Server Error'
    });
  }
};

// @desc    Reset password
// @route   POST /api/auth/update-password
// @access  Public
exports.updatePassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Check if OTP was verified
    if (!user.isOtpVerified) {
      return res.status(400).json({ success: false, error: 'OTP not verified' });
    }

    user.password = newPassword;
    user.isOtpVerified = false; // Reset the flag after password update
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Server Error'
    });
  }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      userId: user._id,
      role: user.role
    });
};
