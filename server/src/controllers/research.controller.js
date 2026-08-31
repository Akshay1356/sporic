import prisma from '../config/prisma.js';
import { successResponse, errorResponse } from '../utils/response.js';

// --- Research Projects ---
export async function getResearchProjects(req, res, next) {
  try {
    const { area, status } = req.query;
    const where = {};
    if (area) where.researchArea = { contains: area };
    if (status) where.status = status;

    const projects = await prisma.researchProject.findMany({
      where,
      orderBy: { startDate: 'desc' },
      include: {
        principalInvestigator: {
          select: { id: true, name: true, department: true, designation: true },
        },
        publications: true,
      },
    });

    return successResponse(res, projects, 'Research projects retrieved');
  } catch (err) {
    next(err);
  }
}

export async function createResearchProject(req, res, next) {
  try {
    const { title, description, researchArea, principalInvestigatorId, startDate, endDate, fundingSource, budget, objectives, methodology, outcomes } = req.body;

    if (!title || !description || !researchArea) {
      return errorResponse(res, 'Title, description, and researchArea are required.', 400, 'MISSING_FIELDS');
    }

    const piId = principalInvestigatorId || req.user.id;

    const project = await prisma.researchProject.create({
      data: {
        title,
        description,
        researchArea,
        principalInvestigatorId: piId,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
        fundingSource: fundingSource || 'SpoRIC Industry Partner',
        budget: budget ? parseFloat(budget) : null,
        objectives,
        methodology,
        outcomes,
        status: 'ONGOING',
      },
    });

    return successResponse(res, project, 'Research project created successfully', 201);
  } catch (err) {
    next(err);
  }
}

// --- Patents ---
export async function getPatents(req, res, next) {
  try {
    const { status, search } = req.query;
    const where = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { applicationNumber: { contains: search } },
        { patentNumber: { contains: search } },
      ];
    }

    const patents = await prisma.patent.findMany({
      where,
      orderBy: { filingDate: 'desc' },
    });

    return successResponse(res, patents, 'Patents retrieved');
  } catch (err) {
    next(err);
  }
}

export async function createPatent(req, res, next) {
  try {
    const { title, patentNumber, applicationNumber, filingDate, grantDate, status = 'PENDING', inventors, assignee, abstract, documentUrl } = req.body;

    if (!title || !applicationNumber || !filingDate || !inventors || !abstract) {
      return errorResponse(res, 'Mandatory patent registration details missing.', 400, 'MISSING_PATENT_FIELDS');
    }

    const patent = await prisma.patent.create({
      data: {
        title,
        patentNumber,
        applicationNumber,
        filingDate: new Date(filingDate),
        grantDate: grantDate ? new Date(grantDate) : null,
        status,
        inventors,
        assignee: assignee || 'Vellore Institute of Technology',
        abstract,
        documentUrl,
      },
    });

    return successResponse(res, patent, 'Patent recorded successfully', 201);
  } catch (err) {
    next(err);
  }
}

// --- Publications ---
export async function getPublications(req, res, next) {
  try {
    const { search } = req.query;
    const where = {};
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { authors: { contains: search } },
        { journalName: { contains: search } },
      ];
    }

    const publications = await prisma.publication.findMany({
      where,
      orderBy: { publicationDate: 'desc' },
      include: {
        project: { select: { title: true, researchArea: true } },
      },
    });

    return successResponse(res, publications, 'Publications retrieved');
  } catch (err) {
    next(err);
  }
}

export async function createPublication(req, res, next) {
  try {
    const { title, authors, journalName, publicationDate, doi, abstract, link, projectId } = req.body;

    if (!title || !authors || !journalName || !publicationDate) {
      return errorResponse(res, 'Title, authors, journalName, and publicationDate are required.', 400, 'MISSING_FIELDS');
    }

    const publication = await prisma.publication.create({
      data: {
        title,
        authors,
        journalName,
        publicationDate: new Date(publicationDate),
        doi,
        abstract,
        link,
        projectId: projectId || null,
      },
    });

    return successResponse(res, publication, 'Publication recorded successfully', 201);
  } catch (err) {
    next(err);
  }
}
