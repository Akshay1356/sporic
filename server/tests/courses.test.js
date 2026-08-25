import request from 'supertest';
import app from '../src/app.js';

describe('Courses & Catalog APIs', () => {
  let adminToken;
  let studentToken;

  beforeAll(async () => {
    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@vit.ac.in', password: 'Admin@VIT2026' });
    adminToken = adminLogin.body.data.token;

    const studentLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'student1@vit.ac.in', password: 'Student@VIT2026' });
    studentToken = studentLogin.body.data.token;
  });

  it('GET /api/courses - Should retrieve published courses list', async () => {
    const res = await request(app).get('/api/courses');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('GET /api/courses - Should filter by category', async () => {
    const res = await request(app).get('/api/courses?category=Industry%204.0');
    expect(res.status).toBe(200);
    expect(res.body.data.every((c) => c.category === 'Industry 4.0')).toBe(true);
  });

  it('GET /api/courses/:identifier - Should get course by code (TECH004)', async () => {
    const res = await request(app).get('/api/courses/TECH004');
    expect(res.status).toBe(200);
    expect(res.body.data.code).toBe('TECH004');
    expect(res.body.data.title).toContain('Digital Tools for Industry 4.0');
    expect(Array.isArray(res.body.data.learn)).toBe(true);
    expect(Array.isArray(res.body.data.features)).toBe(true);
  });

  it('POST /api/courses - Admin should create new course', async () => {
    const categoriesRes = await request(app).get('/api/categories');
    const categoryId = categoriesRes.body.data[0].id;

    const newCode = `TEST${Date.now().toString().slice(-4)}`;
    const res = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        courseCode: newCode,
        title: 'Quantum Neural Networks',
        categoryId,
        shortDescription: 'Advanced deep learning on quantum circuits',
        durationHours: 25,
        trainingMode: 'ONLINE',
        price: 7999,
        discountPercent: 10,
        learn: ['Quantum Gates', 'Variational Quantum Circuits'],
        features: ['Hands-on Qiskit', 'IBM Quantum Access'],
      });

    expect(res.status).toBe(201);
    expect(res.body.data.courseCode).toBe(newCode);
  });

  it('POST /api/courses - Student should be rejected from creating a course', async () => {
    const res = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        courseCode: 'HACK001',
        title: 'Unauthorized Course',
        categoryId: 'some-id',
        shortDescription: 'Should fail',
      });

    expect(res.status).toBe(403);
  });
});
