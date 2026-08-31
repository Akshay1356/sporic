import request from 'supertest';
import app from '../src/app.js';

describe('Faculty Funding & Research Grant Workflow', () => {
  let adminToken;
  let facultyToken;
  let opportunityId;

  beforeAll(async () => {
    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@vit.ac.in', password: 'Admin@VIT2026' });
    adminToken = adminLogin.body.data.token;

    const facultyLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'faculty@vit.ac.in', password: 'Faculty@VIT2026' });
    facultyToken = facultyLogin.body.data.token;

    const oppRes = await request(app).get('/api/funding/opportunities');
    opportunityId = oppRes.body.data[0].id;
  });

  it('POST /api/funding/applications - Faculty should submit funding application', async () => {
    const res = await request(app)
      .post('/api/funding/applications')
      .set('Authorization', `Bearer ${facultyToken}`)
      .send({
        fundingOpportunityId: opportunityId,
        title: 'Thermal Modeling of Solid State Li-Ion Cells for EV Fast Charging',
        researchArea: 'Electric Vehicles / Energy Storage',
        problemStatement: 'Thermal runaway risks during ultra-fast DC charging (350kW).',
        objectives: 'Build 3D multi-physics heat dissipation model and phase change material cooling jacket.',
        methodology: 'Experimental calorimeter tests + ANSYS Fluent thermal simulations.',
        expectedOutcomes: '1 Prototype Cooling Module, 2 High-Impact Papers.',
        budget: 1800000,
        durationMonths: 18,
        isDraft: false,
      });

    expect(res.status).toBe(201);
    expect(res.body.data.applicationNumber).toContain('SPORIC-APP');
    expect(res.body.data.status).toBe('SUBMITTED');
  });

  it('GET /api/funding/my-applications - Faculty should view their own submitted grants', async () => {
    const res = await request(app)
      .get('/api/funding/my-applications')
      .set('Authorization', `Bearer ${facultyToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('POST /api/funding/admin/applications/:id/review - Admin should review and approve application', async () => {
    const appsRes = await request(app)
      .get('/api/funding/admin/applications')
      .set('Authorization', `Bearer ${adminToken}`);

    const targetApp = appsRes.body.data[0];

    const reviewRes = await request(app)
      .post(`/api/funding/admin/applications/${targetApp.id}/review`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: 'APPROVED',
        reviewerComments: 'Approved by SpoRIC expert scientific committee. Sanction order released.',
      });

    expect(reviewRes.status).toBe(200);
    expect(reviewRes.body.data.status).toBe('APPROVED');
    expect(reviewRes.body.data.reviewerComments).toContain('Approved');
  });
});
