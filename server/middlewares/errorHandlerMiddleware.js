import ApiError from '../utils/ApiError.js';
import { ENV } from '../config/env.js';

const errorHandlerMiddleware = (err, req, res, next) => {
  let error = err;

  // If error is not an instance of ApiError, normalize it
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || (error.name === 'ValidationError' ? 400 : 500);
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }

  // Handle Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    const message = `Resource not found with invalid id: ${err.value}`;
    error = new ApiError(404, message);
  }

  // Handle Mongoose Duplicate Key Error (11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const message = `Duplicate value entered for '${field}'. Please use another unique value.`;
    error = new ApiError(409, message);
  }

  // Handle Mongoose Validation Errors
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors || {}).map((val) => ({
      field: val.path,
      message: val.message,
    }));
    const message = `Validation Error: ${errors.map(e => e.message).join(', ')}`;
    error = new ApiError(400, message, errors);
  }

  // Handle JWT Malformed Error
  if (err.name === 'JsonWebTokenError') {
    error = new ApiError(401, 'Invalid authentication token. Please log in again.');
  }

  // Handle JWT Expired Error
  if (err.name === 'TokenExpiredError') {
    error = new ApiError(401, 'Authentication token has expired. Please log in again.');
  }

  const response = {
    success: false,
    statusCode: error.statusCode || 500,
    message: error.message || 'An unexpected error occurred',
    ...(error.errors && error.errors.length > 0 && { errors: error.errors }),
    ...(ENV.NODE_ENV === 'development' && { stack: error.stack }),
  };

  return res.status(error.statusCode || 500).json(response);
};

export default errorHandlerMiddleware;
