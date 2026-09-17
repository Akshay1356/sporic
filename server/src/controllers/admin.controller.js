import { and, eq, ilike, or, sql } from 'drizzle-orm';
import { db } from '../db/index.js';
import { course, enrollment, fundingApplication, patent, payment, publication, user } from '../db/schema/index.js';
import { successResponse, errorResponse } from '../utils/response.js';

async function countRows(table, whereClause) {
  const rows = await db.select({ count: sql`count(*)`.mapWith(Number) }).from(table).where(whereClause);
  return rows[0]?.count ?? 0;
}

export async function getAnalytics(req, res, next) {
  try {
    const [totalStudents, totalFaculty, totalAdmins, totalCourses, publishedCourses, totalEnrollments, completedEnrollments, revenueRows, totalFundingApps, totalPatents, totalPublications] =
      await Promise.all([
        countRows(user, eq(user.role, 'STUDENT')),
        countRows(user, eq(user.role, 'FACULTY')),
        countRows(user, eq(user.role, 'ADMIN')),
        countRows(course, undefined),
        countRows(course, eq(course.status, 'PUBLISHED')),
        countRows(enrollment, undefined),
        countRows(enrollment, eq(enrollment.status, 'COMPLETED')),
        db
          .select({ total: sql`coalesce(sum(${payment.amount}), 0)`.mapWith(Number), count: sql`count(*)`.mapWith(Number) })
          .from(payment)
          .where(eq(payment.status, 'SUCCESS')),
        countRows(fundingApplication, undefined),
        countRows(patent, undefined),
        countRows(publication, undefined),
      ]);

    return successResponse(
      res,
      {
        users: { totalStudents, totalFaculty, totalAdmins },
        courses: { totalCourses, publishedCourses, totalEnrollments, completedEnrollments },
        finance: {
          totalRevenueINR: revenueRows[0]?.total ?? 0,
          successfulTransactions: revenueRows[0]?.count ?? 0,
        },
        research: {
          fundingApplications: totalFundingApps,
          patentsRegistered: totalPatents,
          publications: totalPublications,
        },
      },
      'System analytics retrieved'
    );
  } catch (err) {
    next(err);
  }
}

export async function getUsers(req, res, next) {
  try {
    const { role, status, search, page = 1, limit = 50 } = req.query;

    const conditions = [];
    if (role) conditions.push(eq(user.role, role.toUpperCase()));
    if (status) conditions.push(eq(user.accountStatus, status.toUpperCase()));
    if (search) {
      conditions.push(
        or(
          ilike(user.name, `%${search}%`),
          ilike(user.email, `%${search}%`),
          ilike(user.organization, `%${search}%`),
          ilike(user.department, `%${search}%`)
        )
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const take = parseInt(limit, 10);
    const skip = (parseInt(page, 10) - 1) * take;

    const [totalRows, users] = await Promise.all([
      db.select({ count: sql`count(*)`.mapWith(Number) }).from(user).where(whereClause),
      db
        .select({
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          accountStatus: user.accountStatus,
          organization: user.organization,
          department: user.department,
          designation: user.designation,
          phone: user.phone,
          image: user.image,
          createdAt: user.createdAt,
        })
        .from(user)
        .where(whereClause)
        .orderBy(sql`${user.createdAt} desc`)
        .limit(take)
        .offset(skip),
    ]);

    const total = totalRows[0]?.count ?? 0;

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

    const [updated] = await db
      .update(user)
      .set({ role, updatedAt: new Date() })
      .where(eq(user.id, id))
      .returning({ id: user.id, email: user.email, name: user.name, role: user.role });

    return successResponse(res, updated, `User role updated to ${role}`);
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

    const [updated] = await db
      .update(user)
      .set({ accountStatus, updatedAt: new Date() })
      .where(eq(user.id, id))
      .returning({ id: user.id, email: user.email, name: user.name, accountStatus: user.accountStatus });

    return successResponse(res, updated, `Account status updated to ${accountStatus}`);
  } catch (err) {
    next(err);
  }
}

export async function getAllPayments(req, res, next) {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const whereClause = status ? eq(payment.status, status.toUpperCase()) : undefined;

    const take = parseInt(limit, 10);
    const skip = (parseInt(page, 10) - 1) * take;

    const [totalRows, payments] = await Promise.all([
      db.select({ count: sql`count(*)`.mapWith(Number) }).from(payment).where(whereClause),
      db.query.payment.findMany({
        where: whereClause,
        limit: take,
        offset: skip,
        orderBy: (p, { desc }) => [desc(p.createdAt)],
        with: {
          student: { columns: { id: true, name: true, email: true, phone: true } },
          course: { columns: { id: true, courseCode: true, title: true } },
        },
      }),
    ]);

    return successResponse(res, payments, 'All payment transactions retrieved', 200, {
      total: totalRows[0]?.count ?? 0,
      page: parseInt(page, 10),
      limit: take,
    });
  } catch (err) {
    next(err);
  }
}
