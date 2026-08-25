import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  jwt: {
    secret: process.env.JWT_SECRET || 'sporic_jwt_fallback_secret_key_2026',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackUrl: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
  },
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_SPORIC2026Key',
    keySecret: process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_SPORIC2026SecretKey',
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || 'sporic_webhook_secret_2026',
  },
  upload: {
    dir: process.env.UPLOAD_DIR || 'uploads',
    maxSizeMb: parseInt(process.env.MAX_FILE_SIZE_MB || '15', 10),
  },
  admin: {
    initialEmail: process.env.INITIAL_ADMIN_EMAIL || 'admin@vit.ac.in',
    bootstrapSecret: process.env.ADMIN_BOOTSTRAP_SECRET || 'sporic_admin_bootstrap_secret_key_2026',
  },
};
