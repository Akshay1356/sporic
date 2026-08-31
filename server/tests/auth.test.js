import request from 'supertest';
import app from '../src/app.js';

describe('Authentication & OAuth APIs', () => {
  const testEmail = `test_student_${Date.now()}@vit.ac.in`;

  it('POST /api/auth/register - Should register a new student account', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: testEmail,
        fullName: 'Test Student',
        password: 'Student@VIT2026',
        organization: 'VIT Chennai',
        otp: '123456',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(testEmail.toLowerCase());
    expect(res.body.data.user.role).toBe('STUDENT');
    expect(res.body.data.token).toBeDefined();
  });

  it('POST /api/auth/register - Should reject duplicate email registration', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: testEmail,
        fullName: 'Test Duplicate',
        password: 'Student@VIT2026',
      });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/auth/login - Should authenticate valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@vit.ac.in',
        password: 'Admin@VIT2026',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.role).toBe('ADMIN');
    expect(res.body.data.token).toBeDefined();
  });

  it('POST /api/auth/login - Should reject invalid password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@vit.ac.in',
        password: 'WrongPassword123',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/auth/google - Should authenticate and assign default STUDENT role for Google OAuth', async () => {
    const googleMockEmail = `google_user_${Date.now()}@gmail.com`;
    const res = await request(app)
      .post('/api/auth/google')
      .send({
        idToken: `mock_google_token_${googleMockEmail}`,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(googleMockEmail);
    expect(res.body.data.user.role).toBe('STUDENT'); // Safe default
    expect(res.body.data.token).toBeDefined();
  });

  it('GET /api/auth/me - Should return profile for authenticated user', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@vit.ac.in', password: 'Admin@VIT2026' });

    const token = loginRes.body.data.token;

    const meRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(meRes.status).toBe(200);
    expect(meRes.body.data.user.email).toBe('admin@vit.ac.in');
    expect(meRes.body.data.user.role).toBe('ADMIN');
  });

  it('GET /api/auth/me - Should reject request without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});
