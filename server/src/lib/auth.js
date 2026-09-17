import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { emailOTP, bearer } from 'better-auth/plugins';
import { db } from '../db/index.js';
import * as authSchema from '../db/schema/auth.schema.js';
import { config } from '../config/index.js';
import { sendOtpEmail } from '../services/email.service.js';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: authSchema,
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || `http://localhost:${config.port}`,
  basePath: '/api/auth',
  trustedOrigins: [config.clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: config.google.clientId
    ? {
        google: {
          clientId: config.google.clientId,
          clientSecret: config.google.clientSecret,
        },
      }
    : undefined,

  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'STUDENT',
        input: false, // never trust the client to set its own role
      },
      accountStatus: {
        type: 'string',
        defaultValue: 'ACTIVE',
        input: false,
      },
      phone: { type: 'string', required: false },
      organization: { type: 'string', required: false },
      department: { type: 'string', required: false },
      designation: { type: 'string', required: false },
    },
  },

  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: 10 * 60, // 10 minutes, matches the previous OTP flow
      sendVerificationOTP: async ({ email, otp, type }) => {
        // type: 'sign-in' | 'email-verification' | 'forget-password'
        await sendOtpEmail(email, otp, type);
      },
    }),
    bearer(), // lets SPA clients authenticate with `Authorization: Bearer <token>` instead of cookies
  ],
});
