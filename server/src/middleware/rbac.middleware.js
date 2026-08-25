import { errorResponse } from '../utils/response.js';

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Unauthenticated user.', 401, 'UNAUTHENTICATED');
    }

    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(
        res,
        `Access denied. Requires one of [${allowedRoles.join(', ')}] roles, but user has role [${req.user.role}].`,
        403,
        'FORBIDDEN_ROLE'
      );
    }

    next();
  };
}

export const requireAdmin = requireRole('ADMIN');
export const requireFaculty = requireRole('FACULTY', 'ADMIN');
export const requireStudent = requireRole('STUDENT', 'ADMIN');
