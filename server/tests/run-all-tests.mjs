import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';

console.log('🚀 Starting Comprehensive Functional & API Tests...\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

async function test(name, fn) {
  totalTests++;
  process.stdout.write(`  ⏳ Testing: ${name}... `);
  try {
    await fn();
    passedTests++;
    console.log('✅ PASS');
  } catch (err) {
    failedTests++;
    console.log(`❌ FAIL\n     Error: ${err.message}`);
  }
}

async function runSuite() {
  console.log('--- 1. System Health & Diagnostics ---');
  await test('GET /health returns 200 operational', async () => {
    const res = await request(app).get('/health');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.status, 'healthy');
  });

  await test('GET /api/non-existent returns 404 NOT_FOUND', async () => {
    const res = await request(app).get('/api/unknown-route-xyz');
    assert.equal(res.status, 404);
    assert.equal(res.body.success, false);
    assert.equal(res.body.error.code, 'NOT_FOUND');
  });

  console.log('\n--- 2. Categories API ---');
  await test('GET /api/categories returns category catalog', async () => {
    const res = await request(app).get('/api/categories');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
    assert.ok(res.body.data.length > 0);
  });

  await test('GET /api/categories?domain=Technology filters correctly', async () => {
    const res = await request(app).get('/api/categories?domain=Technology');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
    assert.ok(res.body.data.every((c) => c.domain === 'Technology'));
  });

  console.log('\n--- 3. Courses API ---');
  await test('GET /api/courses returns course catalog', async () => {
    const res = await request(app).get('/api/courses');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
    assert.ok(res.body.data.length > 0);
  });

  await test('GET /api/courses with domain filter', async () => {
    const res = await request(app).get('/api/courses?domain=Technology');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
  });

  await test('GET /api/courses/:id returns 404 for nonexistent course', async () => {
    const res = await request(app).get('/api/courses/NON_EXISTENT_CODE_XYZ_999');
    assert.equal(res.status, 404);
    assert.equal(res.body.success, false);
  });

  console.log('\n--- 4. Research, Patents & Publications ---');
  await test('GET /api/research returns research projects', async () => {
    const res = await request(app).get('/api/research');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
  });

  await test('GET /api/patents returns patents list', async () => {
    const res = await request(app).get('/api/patents');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
  });

  await test('GET /api/publications returns publications', async () => {
    const res = await request(app).get('/api/publications');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
  });

  console.log('\n--- 5. Funding Opportunities ---');
  await test('GET /api/funding/opportunities returns open calls', async () => {
    const res = await request(app).get('/api/funding/opportunities');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
  });

  console.log('\n--- 6. Gallery ---');
  await test('GET /api/gallery returns photo collection', async () => {
    const res = await request(app).get('/api/gallery');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(Array.isArray(res.body.photos));
    assert.ok(res.body.photos.length > 0);
  });

  console.log('\n--- 7. Contact Inquiries ---');
  await test('POST /api/contact validates required fields', async () => {
    const res = await request(app).post('/api/contact').send({
      name: 'Tester',
    });
    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
  });

  await test('POST /api/contact submits contact inquiry successfully', async () => {
    const res = await request(app).post('/api/contact').send({
      name: 'Verification Bot',
      email: 'verify@vit.ac.in',
      subject: 'Automated Test Message',
      message: 'Testing inquiry submission flow.',
    });
    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.email, 'verify@vit.ac.in');
  });

  console.log('\n--- 8. Certificate Verification ---');
  await test('GET /api/certificates/verify/:hash returns 404 for invalid hash', async () => {
    const res = await request(app).get('/api/certificates/verify/INVALID_HASH_XYZ');
    assert.equal(res.status, 404);
    assert.equal(res.body.success, false);
  });

  console.log('\n--- 9. Security & Role-Based Access Control Guards ---');
  await test('GET /api/student/dashboard blocks unauthenticated requests (401)', async () => {
    const res = await request(app).get('/api/student/dashboard');
    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
  });

  await test('GET /api/admin/stats blocks unauthenticated requests (401)', async () => {
    const res = await request(app).get('/api/admin/stats');
    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
  });

  await test('POST /api/funding/applications blocks unauthenticated requests (401)', async () => {
    const res = await request(app).post('/api/funding/applications').send({});
    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
  });

  await test('POST /api/payments/create-order blocks unauthenticated requests (401)', async () => {
    const res = await request(app).post('/api/payments/create-order').send({ courseId: 'dummy' });
    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
  });

  console.log('\n======================================================');
  console.log(`🎉 TEST SUMMARY: Total: ${totalTests} | Passed: ${passedTests} | Failed: ${failedTests}`);
  console.log('======================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runSuite().catch((e) => {
  console.error('Fatal test error:', e);
  process.exit(1);
});
