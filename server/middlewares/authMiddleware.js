import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import ApiError from '../utils/ApiError.js';

/**
 * Authentication verification middleware.
 * Verifies standard JWT Bearer token and attaches decoded payload to req.user.
 */
export const verifyToken = (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return next(new ApiError(401, 'Authentication required. No token provided.'));
  }

  try {
    const decoded = jwt.verify(token, ENV.JWT.SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Authentication token has expired. Please log in again.'));
    }
    return next(new ApiError(401, 'Invalid authentication token.'));
  }
};

/**
 * Optional authentication middleware.
 * If token is present and valid, attaches req.user; otherwise proceeds without throwing.
 */
export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, ENV.JWT.SECRET);
      req.user = decoded;
    } catch {
      // Proceed unauthenticated if token is invalid or expired
      req.user = null;
    }
  } else {
    req.user = null;
  }

  next();
};

export default verifyToken;
