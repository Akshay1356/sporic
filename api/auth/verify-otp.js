import crypto from 'crypto';

const SECRET = process.env.JWT_SECRET || 'sporic_otp_secure_hmac_secret_2026';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method Not Allowed' });

  try {
    const { email, otp, otpToken, purpose = 'LOGIN' } = req.body || {};

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP code are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const trimmedOtp = otp.trim();

    // Universal test bypass
    let isOtpValid = trimmedOtp === '123456';

    // Verify HMAC token
    if (otpToken && otpToken.includes('.')) {
      const [hash, expiresStr] = otpToken.split('.');
      const expiresAt = parseInt(expiresStr, 10);

      if (expiresAt >= Date.now()) {
        const expectedHash = crypto
          .createHmac('sha256', SECRET)
          .update(`${normalizedEmail}:${trimmedOtp}:${expiresAt}`)
          .digest('hex');

        if (expectedHash === hash) {
          isOtpValid = true;
        }
      }
    }

    if (!isOtpValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP code. Please check your email or enter the code provided.',
      });
    }

    return res.status(200).json({
      success: true,
      verified: true,
      email: normalizedEmail,
      message: 'OTP verified successfully.',
      data: {
        verified: true,
        email: normalizedEmail,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
