import ApiError from '../utils/ApiError.js';

/**
 * Reusable request validation middleware.
 * Supports functional validator definitions: (data) => { errors: [...] }
 * 
 * @param {Function} validatorFn - Function that validates input data and returns { isValid, errors }
 * @param {'body' | 'query' | 'params'} source - Request property to validate
 */
export const validate = (validatorFn, source = 'body') => {
  return (req, res, next) => {
    const dataToValidate = req[source] || {};
    const { isValid, errors } = validatorFn(dataToValidate);

    if (!isValid && errors && errors.length > 0) {
      const message = `Validation failed for request ${source}: ${errors.map(e => e.message || e).join(', ')}`;
      return next(new ApiError(400, message, errors));
    }

    next();
  };
};

export default validate;
