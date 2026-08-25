import { OAuth2Client } from 'google-auth-library';
import { config } from '../config/index.js';
import prisma from '../config/prisma.js';
import { generateToken } from '../utils/jwt.js';
import { AppError } from '../utils/errors.js';

const googleClient = new OAuth2Client(config.google.clientId);

export async function verifyGoogleIdToken(idToken) {
  try {
    // Allow mock token bypass in development and test environments
    if (
      (config.nodeEnv === 'development' || config.nodeEnv === 'test' || process.env.NODE_ENV === 'test') &&
      idToken.startsWith('mock_google_token_')
    ) {
      const email = idToken.replace('mock_google_token_', '');
      return {
        googleId: `google_mock_${email}`,
        email,
        name: email.split('@')[0].replace(/[._]/g, ' '),
        picture: null,
      };
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: config.google.clientId,
    });
    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      throw new AppError('Invalid Google ID token payload', 400, 'INVALID_OAUTH_TOKEN');
    }

    return {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name || payload.email.split('@')[0],
      picture: payload.picture,
    };
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError(`Google OAuth token verification failed: ${err.message}`, 401, 'OAUTH_VERIFICATION_FAILED');
  }
}

export async function authenticateGoogleUser(oauthPayload) {
  const { googleId, email, name, picture } = oauthPayload;

  // 1. Find existing user by googleId or email
  let user = await prisma.user.findFirst({
    where: {
      OR: [{ googleId }, { email }],
    },
  });

  if (user) {
    // Update last login & profile image if missing
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        googleId: user.googleId || googleId,
        profileImage: user.profileImage || picture,
        lastLoginAt: new Date(),
      },
    });
  } else {
    // Determine default role: Only predefined initial admin email gets ADMIN, else safe STUDENT
    const role = email.toLowerCase() === config.admin.initialEmail.toLowerCase() ? 'ADMIN' : 'STUDENT';

    user = await prisma.user.create({
      data: {
        googleId,
        email,
        name,
        profileImage: picture,
        role,
        accountStatus: 'ACTIVE',
        lastLoginAt: new Date(),
      },
    });
  }

  if (user.accountStatus === 'SUSPENDED') {
    throw new AppError('This account has been suspended. Please contact SpoRIC administration.', 403, 'ACCOUNT_SUSPENDED');
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      profileImage: user.profileImage,
      department: user.department,
      organization: user.organization,
    },
    token,
  };
}
