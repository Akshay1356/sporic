import nodemailer from 'nodemailer';

// In-memory OTP storage for serverless lifespan
global.__SPORIC_OTPS = global.__SPORIC_OTPS || {};

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { email, purpose = 'LOGIN' } = req.body || {};

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in global memory (10 minutes)
    global.__SPORIC_OTPS[normalizedEmail] = {
      otp,
      purpose,
      expiresAt: Date.now() + 10 * 60 * 1000,
    };

    // Check if SMTP environment credentials exist
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
    const smtpSecure = smtpPort === 465;

    let emailDelivered = false;
    let errorMessage = null;

    if (smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpSecure,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        const subject = `Your VIT-TEC Verification Code: ${otp}`;
        const text = `Your VIT-TEC / SpoRIC One-Time Password (OTP) is: ${otp}\n\nThis code will expire in 10 minutes.`;

        const html = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAFAFA; margin: 0; padding: 20px; }
                .container { max-width: 520px; margin: 0 auto; background: #FFFFFF; border: 1px solid #E5E5E5; border-radius: 12px; padding: 32px; box-shadow: 0 4px 16px rgba(0,0,0,0.05); }
                .header { text-align: center; border-bottom: 2px solid #0B2A6F; padding-bottom: 16px; margin-bottom: 24px; }
                .title { font-size: 20px; font-weight: 800; color: #0B2A6F; margin: 0 0 4px 0; }
                .subtitle { font-size: 13px; color: #666666; margin: 0; }
                .otp-box { background: #F0F4FF; border: 1.5px dashed #0B2A6F; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0; }
                .otp-code { font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #0B2A6F; font-family: monospace; }
                .instructions { font-size: 14px; color: #333333; line-height: 1.6; }
                .footer { margin-top: 32px; pt: 16px; border-top: 1px solid #EEEEEE; font-size: 11px; color: #888888; text-align: center; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1 class="title">VIT Technology Enhancement Centre</h1>
                  <p class="subtitle">Sponsored Research & Industrial Consultancy (SpoRIC)</p>
                </div>
                <p class="instructions">Hello,</p>
                <p class="instructions">Use the following One-Time Password (OTP) to complete your <strong>${purpose}</strong> request on the VIT-TEC platform:</p>
                <div class="otp-box">
                  <div class="otp-code">${otp}</div>
                </div>
                <p class="instructions">This code is valid for <strong>10 minutes</strong>. Do not share this OTP with anyone.</p>
                <div class="footer">
                  <p>© ${new Date().getFullYear()} VIT-TEC / SpoRIC, Vellore Institute of Technology. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `;

        await transporter.sendMail({
          from: process.env.SMTP_FROM || `"VIT-TEC SpoRIC" <${smtpUser}>`,
          to: normalizedEmail,
          subject,
          text,
          html,
        });

        emailDelivered = true;
      } catch (err) {
        console.error('SMTP Mail Dispatch Error:', err);
        errorMessage = err.message;
      }
    }

    return res.status(200).json({
      success: true,
      message: emailDelivered
        ? `A 6-digit verification code has been sent directly to ${normalizedEmail}. Please check your inbox or spam folder.`
        : `Verification code generated for ${normalizedEmail}. ${errorMessage ? `(SMTP note: ${errorMessage})` : ''}`,
      emailDelivered,
      otpPreview: !emailDelivered ? otp : undefined,
    });
  } catch (err) {
    console.error('Serverless send-otp error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Internal server error' });
  }
}
