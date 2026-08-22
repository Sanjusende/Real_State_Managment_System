import ApiError from '../utils/ApiError.js';

/**
 * Role-Based Access Control (RBAC) authorization middleware.
 * Verifies that the authenticated user possesses one of the allowed roles.
 * 
 * @param  {...string} allowedRoles - List of authorized roles (e.g. 'ADMIN', 'AGENT', 'SELLER')
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Unauthorized. Please authenticate first.'));
    }

    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      return next(
        new ApiError(
          403,
          `Forbidden: Role '${userRole}' does not have permission to access this resource. Required role(s): [${allowedRoles.join(', ')}]`
        )
      );
    }

    next();
  };
};

export default authorizeRoles;
