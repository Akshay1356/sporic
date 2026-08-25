import { verifyToken } from '../utils/jwt.js';
import prisma from '../config/prisma.js';
import { errorResponse } from '../utils/response.js';

export async function authenticateUser(req, res, next) {
  try {
    let token = null;

    // Check Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return errorResponse(res, 'Authentication token missing. Please log in.', 401, 'AUTH_TOKEN_REQUIRED');
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) {
      return errorResponse(res, 'Invalid or expired session token.', 401, 'INVALID_TOKEN');
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        accountStatus: true,
        department: true,
        organization: true,
        designation: true,
      },
    });

    if (!user) {
      return errorResponse(res, 'User associated with this token no longer exists.', 401, 'USER_NOT_FOUND');
    }

    if (user.accountStatus === 'SUSPENDED') {
      return errorResponse(res, 'Your account is suspended. Contact SpoRIC administration.', 403, 'ACCOUNT_SUSPENDED');
    }

    req.user = user;
    next();
  } catch (err) {
    return errorResponse(res, `Authentication error: ${err.message}`, 500, 'AUTH_MIDDLEWARE_ERROR');
  }
}

// Optional Auth (e.g. for course previews where logged-in user gets extra info)
export async function optionalAuthenticateUser(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = verifyToken(token);
      if (decoded && decoded.id) {
        const user = await prisma.user.findUnique({
          where: { id: decoded.id },
          select: { id: true, email: true, name: true, role: true },
        });
        if (user) req.user = user;
      }
    }
  } catch {
    // ignore errors for optional auth
  }
  next();
}
