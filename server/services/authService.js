import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import { generateAuthTokens, generateAccessToken } from '../utils/generateTokens.js';
import { ENV } from '../config/env.js';

/**
 * Register a new user with hashed password and initial tokens
 */
export const registerUser = async (userData) => {
  const { name, email, password, role, phone, agencyName, bio } = userData;

  // Check if email already registered
  const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
  if (existingUser) {
    throw new ApiError(409, `An account with email '${email}' already exists. Please login.`);
  }

  // Create user
  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password,
    role: role || 'USER',
    phone: phone ? phone.trim() : '',
    agencyName: agencyName ? agencyName.trim() : '',
    bio: bio ? bio.trim() : '',
  });

  // Generate tokens
  const tokens = generateAuthTokens(user);

  // Save refresh token on user record
  user.refreshToken = tokens.refreshToken;
  await user.save({ validateBeforeSave: false });

  return {
    user: user.toJSON(),
    tokens,
  };
};

/**
 * Login user with email & password verification
 */
export const loginUser = async (email, password) => {
  // Find user and explicitly select password and refreshToken
  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password +refreshToken');

  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (user.isBlocked) {
    throw new ApiError(403, 'Your account has been suspended. Please contact support.');
  }

  // Verify password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // Generate new tokens
  const tokens = generateAuthTokens(user);

  // Store refresh token
  user.refreshToken = tokens.refreshToken;
  await user.save({ validateBeforeSave: false });

  return {
    user: user.toJSON(),
    tokens,
  };
};

/**
 * Invalidate refresh token on logout
 */
export const logoutUser = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
  return true;
};

/**
 * Generate a new access token using a valid refresh token
 */
export const refreshAccessToken = async (incomingRefreshToken) => {
  if (!incomingRefreshToken) {
    throw new ApiError(400, 'Refresh token is required');
  }

  try {
    // Verify refresh token signature
    const decoded = jwt.verify(incomingRefreshToken, ENV.JWT.SECRET);

    // Find user with matching refresh token
    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user || user.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, 'Invalid or expired refresh token. Please login again.');
    }

    if (user.isBlocked) {
      throw new ApiError(403, 'Account is blocked');
    }

    // Issue new access token
    const accessToken = generateAccessToken(user);

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: ENV.JWT.EXPIRES_IN || '7d',
    };
  } catch (err) {
    throw new ApiError(401, 'Invalid or expired refresh token. Please login again.');
  }
};

/**
 * Get current authenticated user profile
 */
export const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User account not found');
  }
  if (user.isBlocked) {
    throw new ApiError(403, 'Your account has been suspended');
  }
  return user.toJSON();
};

/**
 * Update authenticated user profile
 */
export const updateUserProfile = async (userId, updateData) => {
  const allowedUpdates = ['name', 'phone', 'avatar', 'bio', 'agencyName'];
  const sanitizedUpdates = {};

  for (const key of allowedUpdates) {
    if (updateData[key] !== undefined) {
      sanitizedUpdates[key] = typeof updateData[key] === 'string' ? updateData[key].trim() : updateData[key];
    }
  }

  const user = await User.findByIdAndUpdate(userId, sanitizedUpdates, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return user.toJSON();
};

/**
 * Change user password with current password verification
 */
export const changePassword = async (userId, oldPassword, newPassword) => {
  const user = await User.findById(userId).select('+password');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) {
    throw new ApiError(400, 'Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();

  return true;
};

/**
 * Generate password reset token
 */
export const forgotPassword = async (email) => {
  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    // Return standard success to prevent user enumeration attacks
    return {
      message: 'If that email is registered, a password reset token has been generated.',
    };
  }

  // Generate crypto token and save
  const resetToken = user.generateResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  return {
    message: 'Password reset token generated successfully',
    resetToken, // Returned in dev/testing; in prod this would be dispatched via email
  };
};

/**
 * Reset password using valid reset token
 */
export const resetPassword = async (token, newPassword) => {
  // Hash the incoming token to match the database stored hash
  const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  }).select('+resetPasswordToken +resetPasswordExpire');

  if (!user) {
    throw new ApiError(400, 'Password reset token is invalid or has expired');
  }

  // Set new password
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  return true;
};
