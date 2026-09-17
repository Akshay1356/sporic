import request from 'supertest';
import app from '../src/app.js';

describe('SPORIC API System & Functionality Tests', () => {
  // ----------------------------------------------------
  // 1. Health & Server Diagnostics
  // ----------------------------------------------------
  describe('System & Health Checks', () => {
    it('should return 200 and healthy status from /health', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('healthy');
      expect(res.body.message).toContain('operational');
    });

    it('should return 404 for unknown endpoints', async () => {
      const res = await request(app).get('/api/unknown-route-12345');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.errorCode).toBe('NOT_FOUND');
    });
  });

  // ----------------------------------------------------
  // 2. Categories
  // ----------------------------------------------------
  describe('Category Endpoints (/api/categories)', () => {
    it('should return list of categories', async () => {
      const res = await request(app).get('/api/categories');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should support filtering categories by domain', async () => {
      const res = await request(app).get('/api/categories?domain=Technology');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      if (res.body.data.length > 0) {
        expect(res.body.data[0].domain).toBe('Technology');
      }
    });
  });

  // ----------------------------------------------------
  // 3. Courses
  // ----------------------------------------------------
  describe('Course Endpoints (/api/courses)', () => {
    it('should return courses catalog', async () => {
      const res = await request(app).get('/api/courses');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should filter courses by domain or query', async () => {
      const res = await request(app).get('/api/courses?domain=Technology');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should return 404 for nonexistent course code/slug', async () => {
      const res = await request(app).get('/api/courses/NON_EXISTENT_CODE_XYZ_999');
      expect([404, 400]).toContain(res.status);
      expect(res.body.success).toBe(false);
    });
  });

  // ----------------------------------------------------
  // 4. Research, Patents & Publications
  // ----------------------------------------------------
  describe('Research & IPR Endpoints', () => {
    it('should get research projects list (/api/research)', async () => {
      const res = await request(app).get('/api/research');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should get patents overview statistics (/api/patents/stats/overview)', async () => {
      const res = await request(app).get('/api/patents/stats/overview');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
    });

    it('should get patents list (/api/patents)', async () => {
      const res = await request(app).get('/api/patents');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should get publications list (/api/publications)', async () => {
      const res = await request(app).get('/api/publications');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  // ----------------------------------------------------
  // 5. Funding Opportunities
  // ----------------------------------------------------
  describe('Funding Opportunities (/api/funding)', () => {
    it('should return public funding opportunities', async () => {
      const res = await request(app).get('/api/funding/opportunities');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  // ----------------------------------------------------
  // 6. Gallery
  // ----------------------------------------------------
  describe('Gallery Endpoints (/api/gallery)', () => {
    it('should return gallery photo items', async () => {
      const res = await request(app).get('/api/gallery');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  // ----------------------------------------------------
  // 7. Contact Inquiries & Validation
  // ----------------------------------------------------
  describe('Contact Inquiries (/api/contact)', () => {
    it('should reject contact form with missing fields (400)', async () => {
      const res = await request(app).post('/api/contact').send({
        name: 'Test User',
      });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should successfully submit contact inquiry', async () => {
      const res = await request(app).post('/api/contact').send({
        name: 'Automation Tester',
        email: 'tester@vit.ac.in',
        subject: 'API Automation Verification',
        message: 'Testing contact inquiry submission functionality',
      });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe('tester@vit.ac.in');
    });
  });

  // ----------------------------------------------------
  // 8. Certificate Verification
  // ----------------------------------------------------
  describe('Certificate Verification (/api/certificates)', () => {
    it('should return 404 for invalid verification hash', async () => {
      const res = await request(app).get('/api/certificates/verify/INVALID_HASH_12345');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  // ----------------------------------------------------
  // 9. Auth & Role-Based Access Control Guards
  // ----------------------------------------------------
  describe('RBAC & Auth Guard Protection', () => {
    it('should block unauthenticated access to student dashboard (/api/student/dashboard)', async () => {
      const res = await request(app).get('/api/student/dashboard');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should block unauthenticated access to admin stats (/api/admin/stats)', async () => {
      const res = await request(app).get('/api/admin/stats');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should block unauthenticated access to funding applications (/api/funding/applications)', async () => {
      const res = await request(app).get('/api/funding/applications');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should block unauthenticated payment order creation (/api/payments/create-order)', async () => {
      const res = await request(app).post('/api/payments/create-order').send({
        courseId: 'sample-course-id',
      });
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
