import prisma from '../config/prisma.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { AppError } from '../utils/errors.js';
import { createNotification, notifyAdmins } from '../services/notification.service.js';

export async function getFundingOpportunities(req, res, next) {
  try {
    const { status = 'OPEN' } = req.query;
    const where = status === 'ALL' && req.user?.role === 'ADMIN' ? {} : { status: 'OPEN' };

    const opportunities = await prisma.fundingOpportunity.findMany({
      where,
      orderBy: { deadline: 'asc' },
      include: {
        _count: { select: { applications: true } },
      },
    });

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

    const opportunity = await prisma.fundingOpportunity.create({
      data: {
        title,
        description,
        eligibility,
        guidelines,
        deadline: new Date(deadline),
        fundingAmount: parseFloat(fundingAmount),
        status: 'OPEN',
      },
    });

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

    const opportunity = await prisma.fundingOpportunity.findUnique({
      where: { id: fundingOpportunityId },
    });

    if (!opportunity) {
      throw new AppError('Target funding opportunity does not exist.', 404, 'OPPORTUNITY_NOT_FOUND');
    }

    const applicationNumber = `SPORIC-APP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const status = isDraft ? 'DRAFT' : 'SUBMITTED';

    const application = await prisma.fundingApplication.create({
      data: {
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
      },
    });

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
    const applications = await prisma.fundingApplication.findMany({
      where: { facultyId },
      orderBy: { createdAt: 'desc' },
      include: {
        fundingOpportunity: {
          select: { title: true, fundingAmount: true, deadline: true, status: true },
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

    const existing = await prisma.fundingApplication.findUnique({
      where: { id },
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

    const updated = await prisma.fundingApplication.update({
      where: { id },
      data: updateData,
    });

    return successResponse(res, updated, 'Application updated successfully');
  } catch (err) {
    next(err);
  }
}

export async function getAllApplications(req, res, next) {
  try {
    const { status } = req.query;
    const where = status ? { status } : {};

    const applications = await prisma.fundingApplication.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        faculty: { select: { id: true, name: true, email: true, department: true, designation: true } },
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

    const application = await prisma.fundingApplication.update({
      where: { id },
      data: {
        status,
        reviewerComments,
        reviewedAt: new Date(),
      },
      include: {
        faculty: true,
        fundingOpportunity: true,
      },
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
