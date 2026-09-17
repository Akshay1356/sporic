import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '../lib/auth.js';
import { errorResponse } from '../utils/response.js';

export async function authenticateUser(req, res, next) {
  try {
    const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });

    if (!session) {
      return errorResponse(res, 'Authentication required. Please log in.', 401, 'AUTH_TOKEN_REQUIRED');
    }

    if (session.user.accountStatus === 'SUSPENDED') {
      return errorResponse(res, 'Your account is suspended. Contact SpoRIC administration.', 403, 'ACCOUNT_SUSPENDED');
    }

    req.user = session.user;
    req.session = session.session;
    next();
  } catch (err) {
    return errorResponse(res, `Authentication error: ${err.message}`, 500, 'AUTH_MIDDLEWARE_ERROR');
  }
}

// Optional Auth (e.g. for course previews where logged-in user gets extra info)
export async function optionalAuthenticateUser(req, res, next) {
  try {
    const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
    if (session) {
      req.user = session.user;
      req.session = session.session;
    }
  } catch {
    // ignore errors for optional auth
  }
  next();
}
