import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';

/**
 * Generate standard short-lived Access Token
 */
export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id || user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    ENV.JWT.SECRET,
    {
      expiresIn: ENV.JWT.EXPIRES_IN || '7d',
    }
  );
};

/**
 * Generate long-lived Refresh Token
 */
export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id || user.id,
    },
    ENV.JWT.SECRET,
    {
      expiresIn: '30d',
    }
  );
};

/**
 * Generate both Access and Refresh Tokens
 */
export const generateAuthTokens = (user) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    accessToken,
    refreshToken,
    tokenType: 'Bearer',
    expiresIn: ENV.JWT.EXPIRES_IN || '7d',
  };
};

export default generateAuthTokens;
