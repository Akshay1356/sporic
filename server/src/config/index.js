import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
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
  },
};
