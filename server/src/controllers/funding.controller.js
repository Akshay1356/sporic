import { eq, sql } from 'drizzle-orm';
import { db } from '../db/index.js';
import { fundingApplication, fundingOpportunity } from '../db/schema/index.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { AppError } from '../utils/errors.js';
import { createNotification, notifyAdmins } from '../services/notification.service.js';

export async function getFundingOpportunities(req, res, next) {
  try {
    const { status = 'OPEN' } = req.query;
    const whereClause = status === 'ALL' && req.user?.role === 'ADMIN' ? undefined : eq(fundingOpportunity.status, 'OPEN');

    const rows = await db
      .select({
        id: fundingOpportunity.id,
        title: fundingOpportunity.title,
        description: fundingOpportunity.description,
        eligibility: fundingOpportunity.eligibility,
        guidelines: fundingOpportunity.guidelines,
        deadline: fundingOpportunity.deadline,
        fundingAmount: fundingOpportunity.fundingAmount,
        status: fundingOpportunity.status,
        createdAt: fundingOpportunity.createdAt,
        updatedAt: fundingOpportunity.updatedAt,
        applicationCount: sql`count(${fundingApplication.id})`.mapWith(Number),
      })
      .from(fundingOpportunity)
      .leftJoin(fundingApplication, eq(fundingApplication.fundingOpportunityId, fundingOpportunity.id))
      .where(whereClause)
      .groupBy(fundingOpportunity.id)
      .orderBy(fundingOpportunity.deadline);

    const opportunities = rows.map(({ applicationCount, ...rest }) => ({
      ...rest,
      _count: { applications: applicationCount },
    }));

    return successResponse(res, opportunities, 'Funding opportunities retrieved');
  } catch (err) {
    next(err);
  }
}

export async function createFundingOpportunity(req, res, next) {
  try {
    const { title, description, eligibility, guidelines, deadline, fundingAmount } = req.body;

    if (!title || !description || !eligibility || !guidelines || !deadline || !fundingAmount) {
      return errorResponse(res, 'All opportunity details are required.', 400, 'MISSING_FIELDS');
    }

    const [opportunity] = await db
      .insert(fundingOpportunity)
      .values({
        title,
        description,
        eligibility,
        guidelines,
        deadline: new Date(deadline),
        fundingAmount: parseFloat(fundingAmount),
        status: 'OPEN',
      })
      .returning();

    return successResponse(res, opportunity, 'Funding opportunity created successfully', 201);
  } catch (err) {
    next(err);
  }
}

export async function submitApplication(req, res, next) {
  try {
    const facultyId = req.user.id;
    const {
      fundingOpportunityId,
      title,
      researchArea,
      problemStatement,
      objectives,
      methodology,
      expectedOutcomes,
      durationMonths = 12,
      budget,
      equipmentRequirements,
      teamMembers,
      previousResearch,
      patentInformation,
      documentsUrl,
      isDraft = false,
    } = req.body;

    if (!fundingOpportunityId || !title || !researchArea || !problemStatement) {
      return errorResponse(res, 'Mandatory proposal information is missing.', 400, 'MISSING_PROPOSAL_DATA');
    }

    const opportunity = await db.query.fundingOpportunity.findFirst({
      where: eq(fundingOpportunity.id, fundingOpportunityId),
    });

    if (!opportunity) {
      throw new AppError('Target funding opportunity does not exist.', 404, 'OPPORTUNITY_NOT_FOUND');
    }

    const applicationNumber = `SPORIC-APP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const status = isDraft ? 'DRAFT' : 'SUBMITTED';

    const [application] = await db
      .insert(fundingApplication)
      .values({
        applicationNumber,
        facultyId,
        fundingOpportunityId,
        title,
        researchArea,
        problemStatement,
        objectives: objectives || '',
        methodology: methodology || '',
        expectedOutcomes: expectedOutcomes || '',
        durationMonths: parseInt(durationMonths, 10),
        budget: parseFloat(budget || 0),
        equipmentRequirements,
        teamMembers,
        previousResearch,
        patentInformation,
        documentsUrl,
        status,
        submittedAt: isDraft ? null : new Date(),
      })
      .returning();

    if (!isDraft) {
      await notifyAdmins({
        title: 'New Grant Proposal Submitted',
        message: `Faculty ${req.user.name} submitted grant application ${application.applicationNumber} for '${opportunity.title}'.`,
        type: 'FUNDING',
      });

      await createNotification({
        userId: facultyId,
        title: 'Application Submitted',
        message: `Your grant proposal (${application.applicationNumber}) has been submitted for administrative review.`,
        type: 'FUNDING',
      });
    }

    return successResponse(res, application, isDraft ? 'Draft saved successfully' : 'Proposal submitted successfully', 201);
  } catch (err) {
    next(err);
  }
}

export async function getMyApplications(req, res, next) {
  try {
    const facultyId = req.user.id;
    const applications = await db.query.fundingApplication.findMany({
      where: eq(fundingApplication.facultyId, facultyId),
      orderBy: (a, { desc }) => [desc(a.createdAt)],
      with: {
        fundingOpportunity: {
          columns: { title: true, fundingAmount: true, deadline: true, status: true },
        },
      },
    });

    return successResponse(res, applications, 'Faculty grant applications retrieved');
  } catch (err) {
    next(err);
  }
}

export async function updateApplication(req, res, next) {
  try {
    const facultyId = req.user.id;
    const { id } = req.params;
    const updateData = req.body;

    const existing = await db.query.fundingApplication.findFirst({
      where: eq(fundingApplication.id, id),
    });

    if (!existing) {
      throw new AppError('Application not found.', 404, 'APPLICATION_NOT_FOUND');
    }

    if (existing.facultyId !== facultyId && req.user.role !== 'ADMIN') {
      return errorResponse(res, 'Access denied: You can only edit your own applications.', 403, 'FORBIDDEN');
    }

    if (existing.status !== 'DRAFT' && req.user.role !== 'ADMIN') {
      return errorResponse(res, 'Only draft applications can be edited by faculty.', 400, 'APPLICATION_ALREADY_SUBMITTED');
    }

    const [updated] = await db
      .update(fundingApplication)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(fundingApplication.id, id))
      .returning();

    return successResponse(res, updated, 'Application updated successfully');
  } catch (err) {
    next(err);
  }
}

export async function getAllApplications(req, res, next) {
  try {
    const { status } = req.query;
    const whereClause = status ? eq(fundingApplication.status, status) : undefined;

    const applications = await db.query.fundingApplication.findMany({
      where: whereClause,
      orderBy: (a, { desc }) => [desc(a.createdAt)],
      with: {
        faculty: { columns: { id: true, name: true, email: true, department: true, designation: true } },
        fundingOpportunity: true,
      },
    });

    return successResponse(res, applications, 'All grant applications retrieved for admin review');
  } catch (err) {
    next(err);
  }
}

export async function reviewApplication(req, res, next) {
  try {
    const { id } = req.params;
    const { status, reviewerComments } = req.body;

    if (!['UNDER_REVIEW', 'APPROVED', 'REJECTED'].includes(status)) {
      return errorResponse(res, 'Status must be UNDER_REVIEW, APPROVED, or REJECTED.', 400, 'INVALID_REVIEW_STATUS');
    }

    const [updated] = await db
      .update(fundingApplication)
      .set({ status, reviewerComments, reviewedAt: new Date() })
      .where(eq(fundingApplication.id, id))
      .returning();

    if (!updated) {
      throw new AppError('Application not found.', 404, 'APPLICATION_NOT_FOUND');
    }

    const application = await db.query.fundingApplication.findFirst({
      where: eq(fundingApplication.id, id),
      with: { faculty: true, fundingOpportunity: true },
    });

    await createNotification({
      userId: application.facultyId,
      title: `Grant Application ${status}`,
      message: `Your application (${application.applicationNumber}) for '${application.fundingOpportunity.title}' has been updated to ${status}. ${reviewerComments ? `Remarks: ${reviewerComments}` : ''}`,
      type: 'FUNDING',
    });

    return successResponse(res, application, `Application status updated to ${status}`);
  } catch (err) {
    next(err);
  }
}
