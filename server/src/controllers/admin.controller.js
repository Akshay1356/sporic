import prisma from '../config/prisma.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { AppError } from '../utils/errors.js';

export async function getAnalytics(req, res, next) {
  try {
    const [
      totalStudents,
      totalFaculty,
      totalCourses,
      totalEnrollments,
      completedEnrollments,
      totalRevenueData,
      totalFundingApps,
      totalPatents,
      totalPublications,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.user.count({ where: { role: 'FACULTY' } }),
      prisma.course.count(),
      prisma.enrollment.count(),
      prisma.enrollment.count({ where: { status: 'COMPLETED' } }),
      prisma.payment.aggregate({
        where: { status: 'SUCCESS' },
        _sum: { amount: true },
        _count: { id: true },
      }),
      prisma.fundingApplication.count(),
      prisma.patent.count(),
      prisma.publication.count(),
    ]);

    const totalRevenue = totalRevenueData._sum.amount || 0;
    const totalTransactions = totalRevenueData._count.id || 0;

    return successResponse(res, {
      users: {
        totalStudents,
        totalFaculty,
        totalAdmins: await prisma.user.count({ where: { role: 'ADMIN' } }),
      },
      courses: {
        totalCourses,
        publishedCourses: await prisma.course.count({ where: { status: 'PUBLISHED' } }),
        totalEnrollments,
        completedEnrollments,
      },
      finance: {
        totalRevenueINR: totalRevenue,
        successfulTransactions: totalTransactions,
      },
      research: {
        fundingApplications: totalFundingApps,
        patentsRegistered: totalPatents,
        publications: totalPublications,
      },
    }, 'System analytics retrieved');
  } catch (err) {
    next(err);
  }
}

export async function getUsers(req, res, next) {
  try {
    const { role, status, search, page = 1, limit = 50 } = req.query;

    const where = {};
    if (role) where.role = role.toUpperCase();
    if (status) where.accountStatus = status.toUpperCase();
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { organization: { contains: search } },
        { department: { contains: search } },
      ];
    }

    const take = parseInt(limit, 10);
    const skip = (parseInt(page, 10) - 1) * take;

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          accountStatus: true,
          organization: true,
          department: true,
          designation: true,
          phone: true,
          profileImage: true,
          createdAt: true,
          lastLoginAt: true,
          _count: {
            select: { enrollments: true, fundingApplications: true, payments: true },
          },
        },
      }),
    ]);

    return successResponse(res, users, 'Users retrieved', 200, {
      total,
      page: parseInt(page, 10),
      limit: take,
      totalPages: Math.ceil(total / take),
    });
  } catch (err) {
    next(err);
  }
}

export async function updateUserRole(req, res, next) {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['ADMIN', 'FACULTY', 'STUDENT'].includes(role)) {
      return errorResponse(res, 'Role must be one of ADMIN, FACULTY, STUDENT.', 400, 'INVALID_ROLE');
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, email: true, name: true, role: true },
    });

    return successResponse(res, user, `User role updated to ${role}`);
  } catch (err) {
    next(err);
  }
}

export async function updateUserStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { accountStatus } = req.body;

    if (!['ACTIVE', 'INACTIVE', 'SUSPENDED'].includes(accountStatus)) {
      return errorResponse(res, 'Status must be ACTIVE, INACTIVE, or SUSPENDED.', 400, 'INVALID_STATUS');
    }

    const user = await prisma.user.update({
      where: { id },
      data: { accountStatus },
      select: { id: true, email: true, name: true, accountStatus: true },
    });

    return successResponse(res, user, `Account status updated to ${accountStatus}`);
  } catch (err) {
    next(err);
  }
}

export async function getAllPayments(req, res, next) {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const where = {};
    if (status) where.status = status.toUpperCase();

    const take = parseInt(limit, 10);
    const skip = (parseInt(page, 10) - 1) * take;

    const [total, payments] = await Promise.all([
      prisma.payment.count({ where }),
      prisma.payment.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          student: { select: { id: true, name: true, email: true, phone: true } },
          course: { select: { id: true, courseCode: true, title: true } },
        },
      }),
    ]);

    return successResponse(res, payments, 'All payment transactions retrieved', 200, {
      total,
      page: parseInt(page, 10),
      limit: take,
    });
  } catch (err) {
    next(err);
  }
}
