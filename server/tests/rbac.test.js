import request from 'supertest';
import app from '../src/app.js';

describe('Role-Based Access Control (RBAC) Security', () => {
  let adminToken;
  let facultyToken;
  let studentToken;

  beforeAll(async () => {
    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@vit.ac.in', password: 'Admin@VIT2026' });
    adminToken = adminLogin.body.data.token;

    const facultyLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'faculty@vit.ac.in', password: 'Faculty@VIT2026' });
    facultyToken = facultyLogin.body.data.token;

    const studentLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'student1@vit.ac.in', password: 'Student@VIT2026' });
    studentToken = studentLogin.body.data.token;
  });

  it('GET /api/admin/analytics - ADMIN should succeed', async () => {
    const res = await request(app)
      .get('/api/admin/analytics')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.finance).toBeDefined();
    expect(res.body.data.users).toBeDefined();
  });

  it('GET /api/admin/analytics - STUDENT should be rejected with 403 Forbidden', async () => {
    const res = await request(app)
      .get('/api/admin/analytics')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/admin/analytics - FACULTY should be rejected with 403 Forbidden', async () => {
    const res = await request(app)
      .get('/api/admin/analytics')
      .set('Authorization', `Bearer ${facultyToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/admin/users - Only ADMIN should access user management list', async () => {
    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
