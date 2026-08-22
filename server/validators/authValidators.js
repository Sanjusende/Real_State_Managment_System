import { ROLE_LIST } from '../config/constants.js';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Validate Registration Payload
 */
export const validateRegister = (data) => {
  const errors = [];

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Full name is required and cannot be empty' });
  } else if (data.name.trim().length > 100) {
    errors.push({ field: 'name', message: 'Full name cannot exceed 100 characters' });
  }

  if (!data.email || !emailRegex.test(data.email.trim())) {
    errors.push({ field: 'email', message: 'A valid email address is required' });
  }

  if (!data.password || typeof data.password !== 'string' || data.password.length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters long' });
  }

  if (data.role && !ROLE_LIST.includes(data.role)) {
    errors.push({
      field: 'role',
      message: `Invalid role '${data.role}'. Allowed roles are: ${ROLE_LIST.join(', ')}`,
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate Login Payload
 */
export const validateLogin = (data) => {
  const errors = [];

  if (!data.email || !emailRegex.test(data.email.trim())) {
    errors.push({ field: 'email', message: 'Please provide a valid email address' });
  }

  if (!data.password || typeof data.password !== 'string' || data.password.length === 0) {
    errors.push({ field: 'password', message: 'Password is required' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate Change Password Payload
 */
export const validateChangePassword = (data) => {
  const errors = [];

  if (!data.oldPassword || typeof data.oldPassword !== 'string' || data.oldPassword.length === 0) {
    errors.push({ field: 'oldPassword', message: 'Current password is required' });
  }

  if (!data.newPassword || typeof data.newPassword !== 'string' || data.newPassword.length < 6) {
    errors.push({ field: 'newPassword', message: 'New password must be at least 6 characters long' });
  }

  if (data.oldPassword && data.newPassword && data.oldPassword === data.newPassword) {
    errors.push({ field: 'newPassword', message: 'New password must be different from current password' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate Forgot Password Payload
 */
export const validateForgotPassword = (data) => {
  const errors = [];

  if (!data.email || !emailRegex.test(data.email.trim())) {
    errors.push({ field: 'email', message: 'Please provide a valid registered email address' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate Reset Password Payload
 */
export const validateResetPassword = (data) => {
  const errors = [];

  if (!data.token || typeof data.token !== 'string' || data.token.trim().length === 0) {
    errors.push({ field: 'token', message: 'Reset token is required' });
  }

  if (!data.newPassword || typeof data.newPassword !== 'string' || data.newPassword.length < 6) {
    errors.push({ field: 'newPassword', message: 'New password must be at least 6 characters long' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate Profile Update Payload
 */
export const validateUpdateProfile = (data) => {
  const errors = [];

  if (data.name !== undefined && (typeof data.name !== 'string' || data.name.trim().length === 0)) {
    errors.push({ field: 'name', message: 'Name cannot be empty' });
  }

  if (data.phone !== undefined && typeof data.phone !== 'string') {
    errors.push({ field: 'phone', message: 'Phone must be a valid string' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
