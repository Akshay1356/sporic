import { Router } from 'express';
import {
  getResearchProjects,
  createResearchProject,
  getPatents,
  createPatent,
  getPublications,
  createPublication,
} from '../controllers/research.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';
import { requireFaculty } from '../middleware/rbac.middleware.js';

export const researchRouter = Router();
researchRouter.get('/', getResearchProjects);
researchRouter.post('/', authenticateUser, requireFaculty, createResearchProject);

export const patentRouter = Router();
patentRouter.get('/', getPatents);
patentRouter.post('/', authenticateUser, requireFaculty, createPatent);

export const publicationRouter = Router();
publicationRouter.get('/', getPublications);
publicationRouter.post('/', authenticateUser, requireFaculty, createPublication);
