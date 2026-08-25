import bcrypt from 'bcryptjs';
import prisma from '../config/prisma.js';
import { generateToken } from '../utils/jwt.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { verifyGoogleIdToken, authenticateGoogleUser } from '../services/oauth.service.js';
import { createNotification, notifyAdmins } from '../services/notification.service.js';
import { generateAndSendOtp, verifyOtpCode } from '../services/otp.service.js';

/**
 * Send OTP verification code to user email
 * POST /api/auth/send-otp
 */
export async function sendOtp(req, res, next) {
  try {
    const { email, purpose = 'LOGIN' } = req.body;

    if (!email) {
      return errorResponse(res, 'Email address is required.', 400, 'MISSING_EMAIL');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return errorResponse(res, 'Please provide a valid email address.', 400, 'INVALID_EMAIL');
    }

    const result = await generateAndSendOtp(email, purpose);
    return successResponse(res, result, result.message, 200);
  } catch (err) {
    next(err);
  }
}

/**
 * Verify submitted OTP code
 * POST /api/auth/verify-otp
 */
export async function verifyOtp(req, res, next) {
  try {
    const { email, otp, purpose = 'LOGIN' } = req.body;

    if (!email || !otp) {
      return errorResponse(res, 'Email and OTP code are required.', 400, 'MISSING_FIELDS');
    }

    const isValid = await verifyOtpCode(email, otp, purpose);
    if (!isValid) {
      return errorResponse(res, 'Invalid or expired OTP verification code.', 400, 'INVALID_OTP');
    }

    return successResponse(res, { verified: true, email: email.toLowerCase().trim() }, 'OTP verified successfully', 200);
  } catch (err) {
    next(err);
  }
}

/**
 * Passwordless Login via verified Email OTP
 * POST /api/auth/login-otp
 */
export async function loginWithOtp(req, res, next) {
  try {
    const { email, otp, expectedRole } = req.body;

    if (!email || !otp) {
      return errorResponse(res, 'Email and OTP code are required.', 400, 'MISSING_CREDENTIALS');
    }

    const isValid = await verifyOtpCode(email, otp, 'LOGIN');
    if (!isValid) {
      return errorResponse(res, 'Invalid or expired OTP code.', 401, 'INVALID_OTP');
    }

    let user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    // If user does not exist yet and logging in via student portal, auto-create as student
    if (!user) {
      if (expectedRole === 'ADMIN' || expectedRole === 'FACULTY') {
        return errorResponse(
          res,
          `No existing ${expectedRole} account found for ${email}. Please register or contact SpoRIC administration.`,
          404,
          'USER_NOT_FOUND'
        );
      }

      user = await prisma.user.create({
        data: {
          email: email.toLowerCase().trim(),
          name: email.split('@')[0].replace('.', ' '),
          role: 'STUDENT',
          accountStatus: 'ACTIVE',
          lastLoginAt: new Date(),
        },
      });
    }

    // Role Enforcement check if portal expected a specific role
    if (expectedRole && user.role !== expectedRole) {
      return errorResponse(
        res,
        `Role mismatch: This portal is reserved for ${expectedRole} accounts. Your account has the role ${user.role}.`,
        403,
        'ROLE_MISMATCH'
      );
    }

    if (user.accountStatus === 'SUSPENDED') {
      return errorResponse(res, 'Your account is suspended. Please contact SpoRIC administration.', 403, 'ACCOUNT_SUSPENDED');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return successResponse(
      res,
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          phone: user.phone,
          profileImage: user.profileImage,
          organization: user.organization,
          department: user.department,
          designation: user.designation,
        },
        token,
      },
      'Authenticated successfully via OTP'
    );
  } catch (err) {
    next(err);
  }
}

export async function googleLogin(req, res, next) {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return errorResponse(res, 'Google idToken is required in request body.', 400, 'MISSING_ID_TOKEN');
    }

    const oauthPayload = await verifyGoogleIdToken(idToken);
    const authResult = await authenticateGoogleUser(oauthPayload);

    return successResponse(res, authResult, 'Successfully authenticated via Google OAuth', 200);
  } catch (err) {
    next(err);
  }
}

export async function register(req, res, next) {
  try {
    const { email, password, fullName, phone, organization, role, department, designation, otp } = req.body;

    if (!email || !fullName) {
      return errorResponse(res, 'Email and Full Name are required.', 400, 'MISSING_REQUIRED_FIELDS');
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return errorResponse(res, 'An account with this email address already exists.', 409, 'USER_EXISTS');
    }

    // OTP verification if provided
    if (otp) {
      const isValid = await verifyOtpCode(email, otp, 'REGISTER');
      if (!isValid) {
        return errorResponse(res, 'Invalid or expired OTP code for registration.', 400, 'INVALID_OTP');
      }
    }

    const passwordHash = password ? await bcrypt.hash(password, 10) : await bcrypt.hash('Student@VIT2026', 10);
    const assignedRole = role === 'FACULTY' ? 'FACULTY' : 'STUDENT'; // ADMIN cannot be set directly from registration

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        name: fullName,
        passwordHash,
        phone,
        organization,
        department,
        designation,
        role: assignedRole,
        accountStatus: 'ACTIVE',
        lastLoginAt: new Date(),
      },
    });

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    await createNotification({
      userId: user.id,
      title: 'Welcome to VIT-TEC',
      message: `Welcome ${user.name}! Your academic account has been registered under ${user.role} role.`,
      type: 'SYSTEM',
    });

    await notifyAdmins({
      title: 'New User Registered',
      message: `${user.name} (${user.email}) registered as ${user.role}.`,
      type: 'SYSTEM',
    });

    return successResponse(
      res,
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          phone: user.phone,
          organization: user.organization,
          department: user.department,
          designation: user.designation,
        },
        token,
      },
      'User registered successfully',
      201
    );
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password, expectedRole } = req.body;

    if (!email || !password) {
      return errorResponse(res, 'Email and password are required.', 400, 'MISSING_CREDENTIALS');
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user || !user.passwordHash) {
      return errorResponse(res, 'Invalid email or password.', 401, 'INVALID_CREDENTIALS');
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return errorResponse(res, 'Invalid email or password.', 401, 'INVALID_CREDENTIALS');
    }

    // Role Enforcement check if portal expected a specific role
    if (expectedRole && user.role !== expectedRole) {
      return errorResponse(
        res,
        `Role mismatch: This portal is reserved for ${expectedRole} accounts. Your account has the role ${user.role}.`,
        403,
        'ROLE_MISMATCH'
      );
    }

    if (user.accountStatus === 'SUSPENDED') {
      return errorResponse(res, 'Your account is suspended. Please contact SpoRIC administration.', 403, 'ACCOUNT_SUSPENDED');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return successResponse(
      res,
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          phone: user.phone,
          profileImage: user.profileImage,
          organization: user.organization,
          department: user.department,
          designation: user.designation,
        },
        token,
      },
      'Login successful'
    );
  } catch (err) {
    next(err);
  }
}

export async function getMe(req, res) {
  return successResponse(res, { user: req.user }, 'Current user profile');
}

export async function logout(req, res) {
  return successResponse(res, null, 'Logged out successfully');
}
