import { and, desc, eq, ilike, or } from 'drizzle-orm';
import { db } from '../db/index.js';
import { patent, publication, researchProject } from '../db/schema/index.js';
import { successResponse, errorResponse } from '../utils/response.js';

// --- Research Projects ---
export async function getResearchProjects(req, res, next) {
  try {
    const { area, status } = req.query;
    const conditions = [];
    if (area) conditions.push(ilike(researchProject.researchArea, `%${area}%`));
    if (status) conditions.push(eq(researchProject.status, status));

    const projects = await db.query.researchProject.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      orderBy: (p, { desc }) => [desc(p.startDate)],
      with: {
        principalInvestigator: { columns: { id: true, name: true, department: true, designation: true } },
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

    const [project] = await db
      .insert(researchProject)
      .values({
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
      })
      .returning();

    return successResponse(res, project, 'Research project created successfully', 201);
  } catch (err) {
    next(err);
  }
}

// --- Patents ---
export async function getPatents(req, res, next) {
  try {
    const { status, search } = req.query;
    const conditions = [];
    if (status) conditions.push(eq(patent.status, status));
    if (search) {
      conditions.push(
        or(
          ilike(patent.title, `%${search}%`),
          ilike(patent.applicationNumber, `%${search}%`),
          ilike(patent.patentNumber, `%${search}%`)
        )
      );
    }

    const patents = await db
      .select()
      .from(patent)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(patent.filingDate));

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

    const [createdPatent] = await db
      .insert(patent)
      .values({
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
      })
      .returning();

    return successResponse(res, createdPatent, 'Patent recorded successfully', 201);
  } catch (err) {
    next(err);
  }
}

// --- Publications ---
export async function getPublications(req, res, next) {
  try {
    const { search } = req.query;
    const conditions = [];
    if (search) {
      conditions.push(
        or(
          ilike(publication.title, `%${search}%`),
          ilike(publication.authors, `%${search}%`),
          ilike(publication.journalName, `%${search}%`)
        )
      );
    }

    const publications = await db.query.publication.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      orderBy: (p, { desc }) => [desc(p.publicationDate)],
      with: {
        project: { columns: { title: true, researchArea: true } },
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

    const [createdPublication] = await db
      .insert(publication)
      .values({
        title,
        authors,
        journalName,
        publicationDate: new Date(publicationDate),
        doi,
        abstract,
        link,
        projectId: projectId || null,
      })
      .returning();

    return successResponse(res, createdPublication, 'Publication recorded successfully', 201);
  } catch (err) {
    next(err);
  }
}
