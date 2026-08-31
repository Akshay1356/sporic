import nodemailer from 'nodemailer';

// Configure Nodemailer transporter with environment SMTP credentials or fallback
let transporter = null;

if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

/**
 * Send an email using SMTP or log to console in development
 * @param {Object} options
 * @param {string} options.to
 * @param {string} options.subject
 * @param {string} options.text
 * @param {string} options.html
 * @returns {Promise<Object>}
 */
export async function sendEmail({ to, subject, text, html }) {
  const from = process.env.SMTP_FROM || 'VIT-TEC SpoRIC <noreply.sporic@vit.ac.in>';

  console.log(`\n================== [EMAIL DISPATCH] ==================`);
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Content:\n${text}`);
  console.log(`======================================================\n`);

  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from,
        to,
        subject,
        text,
        html,
      });
      return { success: true, messageId: info.messageId, delivered: true };
    } catch (err) {
      console.error('SMTP Delivery error (falling back to logged OTP):', err.message);
      return { success: true, delivered: false, error: err.message };
    }
  }

  return { success: true, delivered: false, simulated: true };
}

/**
 * Send an OTP verification email formatted with VIT-TEC branding
 * @param {string} email
 * @param {string} otp
 * @param {string} purpose
 */
export async function sendOtpEmail(email, otp, purpose = 'VERIFICATION') {
  const subject = `Your VIT-TEC Verification Code: ${otp}`;
  const text = `Your VIT-TEC / SpoRIC One-Time Password (OTP) is: ${otp}\n\nThis code will expire in 10 minutes. If you did not request this verification code, please ignore this email.`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAFAFA; margin: 0; padding: 20px; }
          .container { max-width: 520px; margin: 0 auto; background: #FFFFFF; border: 1px solid #E5E5E5; border-radius: 12px; padding: 32px; }
          .header { text-align: center; border-bottom: 1px solid #EEEEEE; padding-bottom: 20px; margin-bottom: 24px; }
          .title { font-size: 20px; font-weight: 800; color: #111111; margin: 0 0 6px 0; }
          .subtitle { font-size: 13px; color: #666666; margin: 0; }
          .otp-box { background: #F5F5F5; border: 1px solid #E5E5E5; border-radius: 8px; padding: 18px; text-align: center; margin: 24px 0; }
          .otp-code { font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #000000; font-family: monospace; }
          .instructions { font-size: 14px; color: #444444; line-height: 1.6; }
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

  return sendEmail({ to: email, subject, text, html });
}
