import request from 'supertest';
import app from '../src/app.js';

describe('Certificates & Public Verification APIs', () => {
  it('GET /api/certificates/verify/:certificateId - Should verify existing certificate publicly', async () => {
    const res = await request(app).get('/api/certificates/verify/VITTEC-CERT-2026-1001');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.certificateNumber).toBe('VITTEC-CERT-2026-1001');
    expect(res.body.data.studentName).toBe('Arun Kumar');
    expect(res.body.data.courseCode).toBe('TECH004');
    expect(res.body.data.status).toBe('VALID');
    expect(res.body.data.verificationHash).toBeDefined();
  });

  it('GET /api/certificates/verify/:certificateId - Should return 404 for invalid/tampered certificate ID', async () => {
    const res = await request(app).get('/api/certificates/verify/FAKE-CERT-9999');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
