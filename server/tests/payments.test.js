import request from 'supertest';
import app from '../src/app.js';

const KNOWN_COURSE_1 = 'TECH004';

describe('Razorpay Payments & Verified Enrollment Workflow', () => {
  let studentToken;
  let course2DbId; // Use actual DB UUID for the second course to avoid any lookup issues

  beforeAll(async () => {
    // Create a fresh test student unique per run to avoid enrollment conflicts
    const freshEmail = `pay_test_${Date.now()}@vit.ac.in`;
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: freshEmail,
        fullName: 'Payment Test Student',
        password: 'Test@VIT2026',
        otp: '123456',
      });
    expect(registerRes.status).toBe(201);
    studentToken = registerRes.body.data.token;

    // Fetch actual course dbId to use in payment tests
    const coursesRes = await request(app).get('/api/courses');
    expect(coursesRes.status).toBe(200);
    // Pick a course that is NOT TECH004 to use in the verify flow
    const secondCourse = coursesRes.body.data.find((c) => c.code !== KNOWN_COURSE_1);
    expect(secondCourse).toBeDefined();
    course2DbId = secondCourse.dbId; // Use actual UUID to avoid OR query issues
  });

  it('POST /api/payments/create-order - Should create a Razorpay order for seeded course TECH004', async () => {
    const res = await request(app)
      .post('/api/payments/create-order')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ courseId: KNOWN_COURSE_1 });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.orderId).toBeDefined();
    expect(res.body.data.amount).toBeGreaterThan(0);
    expect(res.body.data.receipt).toBeDefined();
  });

  it('POST /api/payments/create-order - Should return 404 for non-existent course code', async () => {
    const res = await request(app)
      .post('/api/payments/create-order')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ courseId: 'FAKE_COURSE_9999' });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/payments/verify - Full flow: create order then verify with mock signature → enrollment activated', async () => {
    // Use the second course's DB UUID directly for maximum compatibility
    const orderRes = await request(app)
      .post('/api/payments/create-order')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ courseId: course2DbId });

    expect(orderRes.status).toBe(201);
    const { orderId } = orderRes.body.data;
    expect(orderId).toBeDefined();

    // Verify with the accepted dev/test bypass mock signature
    const verifyRes = await request(app)
      .post('/api/payments/verify')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        razorpayOrderId: orderId,
        razorpayPaymentId: `pay_mock_${Date.now()}`,
        razorpaySignature: 'mock_valid_signature',
      });

    expect(verifyRes.status).toBe(200);
    expect(verifyRes.body.success).toBe(true);
    expect(verifyRes.body.data.enrollment.status).toBe('ACTIVE');
    expect(verifyRes.body.data.payment.status).toBe('SUCCESS');
  });

  it('POST /api/payments/verify - Should reject fraudulent HMAC signature and block enrollment', async () => {
    // Create a fresh order (TECH004 is still not verified from test 1)
    const orderRes = await request(app)
      .post('/api/payments/create-order')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ courseId: KNOWN_COURSE_1 });

    expect(orderRes.status).toBe(201);
    const { orderId } = orderRes.body.data;

    const verifyRes = await request(app)
      .post('/api/payments/verify')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        razorpayOrderId: orderId,
        razorpayPaymentId: 'pay_fake_fraud_123',
        razorpaySignature: 'invalid_fraudulent_signature_xyz',
      });

    expect(verifyRes.status).toBe(400);
    expect(verifyRes.body.success).toBe(false);
    expect(verifyRes.body.error.code).toBe('PAYMENT_SIGNATURE_INVALID');
  });

  it('GET /api/payments/my-history - Should return authenticated student payment history list', async () => {
    const res = await request(app)
      .get('/api/payments/my-history')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
