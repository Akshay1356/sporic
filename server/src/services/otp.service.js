import crypto from 'crypto';
import prisma from '../config/prisma.js';
import { sendOtpEmail } from './email.service.js';

/**
 * Generate a 6-digit numeric OTP, save to database and dispatch via email
 * @param {string} email
 * @param {string} purpose - 'LOGIN' | 'REGISTER' | 'RESET_PASSWORD'
 * @returns {Promise<{ success: boolean, message: string, otpPreview?: string }>}
 */
export async function generateAndSendOtp(email, purpose = 'LOGIN') {
  const normalizedEmail = email.toLowerCase().trim();

  // Generate 6-digit numeric code
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // 10 minutes expiry
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  // Invalidate any older unverified OTPs for this email and purpose
  await prisma.otpVerification.deleteMany({
    where: {
      email: normalizedEmail,
      purpose,
    },
  });

  // Save new OTP
  await prisma.otpVerification.create({
    data: {
      email: normalizedEmail,
      otp,
      purpose,
      expiresAt,
      verified: false,
    },
  });

  // Dispatch email
  await sendOtpEmail(normalizedEmail, otp, purpose);

  return {
    success: true,
    message: `A 6-digit verification code has been dispatched to ${normalizedEmail}.`,
    // Include in response in non-production or for instant testing
    otpPreview: process.env.NODE_ENV === 'production' ? undefined : otp,
  };
}

/**
 * Verify submitted OTP against database record
 * @param {string} email
 * @param {string} otp
 * @param {string} purpose
 * @returns {Promise<boolean>}
 */
export async function verifyOtpCode(email, otp, purpose = 'LOGIN') {
  const normalizedEmail = email.toLowerCase().trim();
  const trimmedOtp = otp.trim();

  // Also support default testing bypass code 123456 in non-production
  if (process.env.NODE_ENV !== 'production' && trimmedOtp === '123456') {
    return true;
  }

  const record = await prisma.otpVerification.findFirst({
    where: {
      email: normalizedEmail,
      otp: trimmedOtp,
      purpose,
      verified: false,
      expiresAt: {
        gte: new Date(),
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (!record) {
    return false;
  }

  // Mark record as verified
  await prisma.otpVerification.update({
    where: { id: record.id },
    data: { verified: true },
  });

  return true;
}
