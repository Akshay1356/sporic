import { Router } from 'express';
import {
  getFundingOpportunities,
  createFundingOpportunity,
  submitApplication,
  getMyApplications,
  updateApplication,
  getAllApplications,
  reviewApplication,
} from '../controllers/funding.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';
import { requireAdmin, requireFaculty } from '../middleware/rbac.middleware.js';

const router = Router();

// Opportunities
router.get('/opportunities', getFundingOpportunities);
router.post('/opportunities', authenticateUser, requireAdmin, createFundingOpportunity);

// Applications
router.post('/applications', authenticateUser, requireFaculty, submitApplication);
router.get('/my-applications', authenticateUser, requireFaculty, getMyApplications);
router.put('/applications/:id', authenticateUser, requireFaculty, updateApplication);

// Admin review
router.get('/admin/applications', authenticateUser, requireAdmin, getAllApplications);
router.post('/admin/applications/:id/review', authenticateUser, requireAdmin, reviewApplication);

export default router;
