import request from 'supertest';
import app from '../src/app.js';

describe('OTP Verification & Role Enforcement APIs', () => {
  const testOtpEmail = `otp_user_${Date.now()}@vit.ac.in`;
  let receivedOtp = '';

  it('POST /api/auth/send-otp - Should dispatch an OTP code to given email', async () => {
    const res = await request(app)
      .post('/api/auth/send-otp')
      .send({
        email: testOtpEmail,
        purpose: 'LOGIN',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.otpPreview).toBeDefined();
    receivedOtp = res.body.data.otpPreview;
  });

  it('POST /api/auth/verify-otp - Should reject invalid OTP code', async () => {
    const res = await request(app)
      .post('/api/auth/verify-otp')
      .send({
        email: testOtpEmail,
        otp: '000000',
        purpose: 'LOGIN',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/auth/verify-otp - Should verify valid OTP code', async () => {
    const res = await request(app)
      .post('/api/auth/verify-otp')
      .send({
        email: testOtpEmail,
        otp: receivedOtp,
        purpose: 'LOGIN',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.verified).toBe(true);
  });

  it('POST /api/auth/login-otp - Should authenticate user via OTP code', async () => {
    // Dispatch a fresh login OTP
    const sendRes = await request(app)
      .post('/api/auth/send-otp')
      .send({ email: testOtpEmail, purpose: 'LOGIN' });

    const newOtp = sendRes.body.data.otpPreview;

    const loginRes = await request(app)
      .post('/api/auth/login-otp')
      .send({
        email: testOtpEmail,
        otp: newOtp,
        expectedRole: 'STUDENT',
      });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.success).toBe(true);
    expect(loginRes.body.data.user.role).toBe('STUDENT');
    expect(loginRes.body.data.token).toBeDefined();
  });

  it('POST /api/auth/login - Role Gatekeeper should reject student logging in to Admin portal', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'student1@vit.ac.in',
        password: 'Student@VIT2026',
        expectedRole: 'ADMIN',
      });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('ROLE_MISMATCH');
  });

  it('POST /api/auth/login - Role Gatekeeper should reject student logging in to Faculty portal', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'student1@vit.ac.in',
        password: 'Student@VIT2026',
        expectedRole: 'FACULTY',
      });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('ROLE_MISMATCH');
  });

  it('POST /api/auth/login - Role Gatekeeper should allow Admin to log in via Admin portal', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@vit.ac.in',
        password: 'Admin@VIT2026',
        expectedRole: 'ADMIN',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.role).toBe('ADMIN');
  });

  it('POST /api/auth/login - Role Gatekeeper should allow Faculty to log in via Faculty portal', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'faculty@vit.ac.in',
        password: 'Faculty@VIT2026',
        expectedRole: 'FACULTY',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.role).toBe('FACULTY');
  });
});
