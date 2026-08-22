import ApiError from '../utils/ApiError.js';
import { ROLES } from '../config/constants.js';

/**
 * Role-Based Access Control (RBAC) middleware.
 * Verifies that the authenticated user possesses one of the allowed roles.
 * 
 * @param {...string} allowedRoles - Authorized roles (e.g. 'ADMIN', 'AGENT', 'SELLER', 'USER')
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
          `Forbidden: Role '${userRole}' is not authorized to access this resource. Required role(s): [${allowedRoles.join(', ')}]`
        )
      );
    }

    next();
  };
};

/**
 * Resource Ownership Verification Middleware (prevents IDOR).
 * Ensures that the authenticated user owns the target resource, unless they are an ADMIN.
 * 
 * @param {Function} fetchResourceFn - Async function (id, req) => Promise<resourceDoc>
 * @param {string} ownerField - The property on resourceDoc representing owner ID (default: 'owner' or 'agent' or 'user')
 * @param {string} idParamKey - The route parameter key holding the resource ID (default: 'id')
 */
export const checkOwnership = (fetchResourceFn, ownerField = 'owner', idParamKey = 'id') => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return next(new ApiError(401, 'Authentication required'));
      }

      const resourceId = req.params[idParamKey];
      if (!resourceId) {
        return next(new ApiError(400, `Missing required route parameter '${idParamKey}'`));
      }

      const resource = await fetchResourceFn(resourceId, req);
      if (!resource) {
        return next(new ApiError(404, 'Requested resource not found'));
      }

      // If user is ADMIN, grant override access
      if (req.user.role === ROLES.ADMIN) {
        req.resource = resource;
        return next();
      }

      // Check ownership match
      const resourceOwnerId = resource[ownerField]?.toString() || resource[ownerField]?._id?.toString();
      const currentUserId = req.user.id?.toString() || req.user._id?.toString();

      if (!resourceOwnerId || resourceOwnerId !== currentUserId) {
        return next(
          new ApiError(403, 'Forbidden: You do not have permission to modify or access this resource.')
        );
      }

      // Attach resource for downstream handler to avoid duplicate database queries
      req.resource = resource;
      next();
    } catch (err) {
      next(err);
    }
  };
};

/**
 * Self or Admin Verification Middleware.
 * Ensures a user can only view/modify their own user record, unless they are an ADMIN.
 * 
 * @param {string} paramKey - Route parameter holding target user ID (default: 'id')
 */
export const requireSelfOrAdmin = (paramKey = 'id') => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required'));
    }

    const targetUserId = req.params[paramKey];
    const currentUserId = req.user.id || req.user._id;

    if (req.user.role === ROLES.ADMIN || targetUserId === currentUserId?.toString()) {
      return next();
    }

    return next(
      new ApiError(403, 'Forbidden: You can only access or modify your own account data.')
    );
  };
};

export default {
  authorizeRoles,
  checkOwnership,
  requireSelfOrAdmin,
};
