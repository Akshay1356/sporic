import { and, asc, desc, eq, ilike, inArray, or, sql } from 'drizzle-orm';
import { db } from '../db/index.js';
import { category, course, enrollment, learningObjective, module, sessionBatch } from '../db/schema/index.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { AppError } from '../utils/errors.js';

async function resolveCategoryIds({ categoryName, domain }) {
  if (!categoryName && !domain) return null;

  const conditions = [];
  if (categoryName) conditions.push(eq(category.name, categoryName));
  if (domain) conditions.push(eq(category.domain, domain));

  const matches = await db
    .select({ id: category.id })
    .from(category)
    .where(and(...conditions));

  return matches.map((m) => m.id);
}

async function countGroupedBy(table, columnName, ids) {
  if (ids.length === 0) return new Map();
  const column = table[columnName];
  const rows = await db
    .select({ groupId: column, count: sql`count(*)`.mapWith(Number) })
    .from(table)
    .where(inArray(column, ids))
    .groupBy(column);
  return new Map(rows.map((r) => [r.groupId, r.count]));
}

function formatCourseSummary(c, moduleCount, enrollmentCount) {
  return {
    id: c.courseCode, // frontend relies on code TECH004
    dbId: c.id,
    code: c.courseCode,
    title: c.title,
    slug: c.slug,
    shortDescription: c.shortDescription,
    fullDescription: c.fullDescription,
    domain: c.category.domain,
    category: c.category.name,
    hours: c.durationHours,
    mode: c.trainingMode.toLowerCase(),
    price: c.price,
    discountPercent: c.discountPercent,
    finalPrice: c.finalPrice,
    contactEmail: c.contactEmail,
    contactPerson: c.contactPerson,
    contactNumber: c.contactNumber,
    learn: c.objectives.filter((o) => o.type === 'LEARN').map((o) => o.content),
    features: c.objectives.filter((o) => o.type === 'FEATURE').map((o) => o.content),
    sessions: c.sessions.map((s) => ({
      id: s.id,
      batch: s.batchNumber,
      date: s.startDate,
      status: s.status,
    })),
    moduleCount,
    enrollmentCount,
    status: c.status,
  };
}

export async function getCourses(req, res, next) {
  try {
    const { search, domain, category: categoryName, mode, status, sortBy = 'title', sortOrder = 'asc', limit = 50, page = 1 } = req.query;

    const conditions = [];

    // By default public only sees PUBLISHED courses unless admin
    if (status && req.user?.role === 'ADMIN') {
      conditions.push(eq(course.status, status));
    } else {
      conditions.push(eq(course.status, 'PUBLISHED'));
    }

    if (mode) {
      conditions.push(eq(course.trainingMode, mode.toUpperCase()));
    }

    const categoryIds = await resolveCategoryIds({ categoryName, domain: categoryName ? undefined : domain });
    if (categoryIds !== null) {
      if (categoryIds.length === 0) {
        return successResponse(res, [], 'Courses retrieved successfully', 200, {
          total: 0,
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          totalPages: 0,
        });
      }
      conditions.push(inArray(course.categoryId, categoryIds));
    }

    if (search) {
      conditions.push(
        or(
          ilike(course.title, `%${search}%`),
          ilike(course.shortDescription, `%${search}%`),
          ilike(course.courseCode, `%${search}%`)
        )
      );
    }

    const take = parseInt(limit, 10);
    const skip = (parseInt(page, 10) - 1) * take;
    const whereClause = and(...conditions);

    let orderBy = [asc(course.title)];
    if (sortBy === 'duration') orderBy = [sortOrder === 'desc' ? desc(course.durationHours) : asc(course.durationHours)];
    if (sortBy === 'price') orderBy = [sortOrder === 'desc' ? desc(course.finalPrice) : asc(course.finalPrice)];
    if (sortBy === 'code') orderBy = [sortOrder === 'desc' ? desc(course.courseCode) : asc(course.courseCode)];
    if (sortBy === 'createdAt') orderBy = [desc(course.createdAt)];

    const [totalRows, courses] = await Promise.all([
      db.select({ count: sql`count(*)`.mapWith(Number) }).from(course).where(whereClause),
      db.query.course.findMany({
        where: whereClause,
        limit: take,
        offset: skip,
        orderBy,
        with: {
          category: { columns: { id: true, name: true, domain: true, slug: true } },
          objectives: { orderBy: (o, { asc }) => [asc(o.order)] },
          sessions: { orderBy: (s, { asc }) => [asc(s.batchNumber)] },
        },
      }),
    ]);

    const total = totalRows[0]?.count ?? 0;
    const courseIds = courses.map((c) => c.id);
    const [moduleCounts, enrollmentCounts] = await Promise.all([
      countGroupedBy(module, 'courseId', courseIds),
      countGroupedBy(enrollment, 'courseId', courseIds),
    ]);

    const formatted = courses.map((c) => formatCourseSummary(c, moduleCounts.get(c.id) || 0, enrollmentCounts.get(c.id) || 0));

    return successResponse(res, formatted, 'Courses retrieved successfully', 200, {
      total,
      page: parseInt(page, 10),
      limit: take,
      totalPages: Math.ceil(total / take),
    });
  } catch (err) {
    next(err);
  }
}

export async function getCourseByCodeOrId(req, res, next) {
  try {
    const { identifier } = req.params;

    const foundCourse = await db.query.course.findFirst({
      where: or(eq(course.courseCode, identifier), eq(course.id, identifier), eq(course.slug, identifier)),
      with: {
        category: true,
        instructor: { columns: { id: true, name: true, designation: true, department: true, email: true } },
        objectives: { orderBy: (o, { asc }) => [asc(o.order)] },
        sessions: { orderBy: (s, { asc }) => [asc(s.batchNumber)] },
        modules: {
          orderBy: (m, { asc }) => [asc(m.order)],
          with: {
            lessons: {
              orderBy: (l, { asc }) => [asc(l.order)],
              columns: {
                id: true,
                title: true,
                order: true,
                durationMinutes: true,
                isFreePreview: true,
                contentType: true,
              },
            },
          },
        },
      },
    });

    if (!foundCourse) {
      throw new AppError(`Course with identifier '${identifier}' not found.`, 404, 'COURSE_NOT_FOUND');
    }

    const formatted = {
      id: foundCourse.courseCode,
      dbId: foundCourse.id,
      code: foundCourse.courseCode,
      title: foundCourse.title,
      slug: foundCourse.slug,
      shortDescription: foundCourse.shortDescription,
      fullDescription: foundCourse.fullDescription,
      domain: foundCourse.category.domain,
      category: foundCourse.category.name,
      hours: foundCourse.durationHours,
      mode: foundCourse.trainingMode.toLowerCase(),
      price: foundCourse.price,
      discountPercent: foundCourse.discountPercent,
      finalPrice: foundCourse.finalPrice,
      contactEmail: foundCourse.contactEmail,
      contactPerson: foundCourse.contactPerson,
      contactNumber: foundCourse.contactNumber,
      instructor: foundCourse.instructor,
      learn: foundCourse.objectives.filter((o) => o.type === 'LEARN').map((o) => o.content),
      features: foundCourse.objectives.filter((o) => o.type === 'FEATURE').map((o) => o.content),
      modules: foundCourse.modules.map((m) => m.title),
      detailedModules: foundCourse.modules,
      sessions: foundCourse.sessions.map((s) => ({
        id: s.id,
        batch: s.batchNumber,
        date: s.startDate,
        status: s.status,
      })),
      status: foundCourse.status,
      certificateEnabled: foundCourse.certificateEnabled,
    };

    return successResponse(res, formatted, 'Course details retrieved successfully');
  } catch (err) {
    next(err);
  }
}

export async function createCourse(req, res, next) {
  try {
    const {
      courseCode,
      title,
      categoryId,
      shortDescription,
      fullDescription,
      durationHours = 20,
      trainingMode = 'ONLINE',
      price = 4999.0,
      discountPercent = 0.0,
      contactEmail = 'deancc.sporic@vit.ac.in',
      contactPerson = 'Dean, SpoRIC',
      contactNumber = '73587 82571',
      facultyId,
      learn = [],
      features = [],
      sessions = [],
      modules = [],
    } = req.body;

    if (!courseCode || !title || !categoryId || !shortDescription) {
      return errorResponse(res, 'Course code, title, categoryId, and shortDescription are required.', 400, 'MISSING_FIELDS');
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const finalPrice = price - price * (discountPercent / 100);

    const [createdCourse] = await db
      .insert(course)
      .values({
        courseCode: courseCode.toUpperCase(),
        title,
        slug: `${slug}-${Date.now().toString().slice(-4)}`,
        categoryId,
        shortDescription,
        fullDescription,
        durationHours: parseInt(durationHours, 10),
        trainingMode: trainingMode.toUpperCase(),
        price: parseFloat(price),
        discountPercent: parseFloat(discountPercent),
        finalPrice,
        contactEmail,
        contactPerson,
        contactNumber,
        facultyId: facultyId || null,
        status: 'PUBLISHED',
      })
      .returning();

    if (learn.length > 0) {
      await db.insert(learningObjective).values(
        learn.map((content, i) => ({ courseId: createdCourse.id, content, type: 'LEARN', order: i + 1 }))
      );
    }

    if (features.length > 0) {
      await db.insert(learningObjective).values(
        features.map((content, i) => ({ courseId: createdCourse.id, content, type: 'FEATURE', order: i + 1 }))
      );
    }

    if (sessions.length > 0) {
      await db.insert(sessionBatch).values(
        sessions.map((s, i) => ({
          courseId: createdCourse.id,
          batchNumber: s.batchNumber || i + 1,
          startDate: s.startDate || s.date,
          status: s.status || 'UPCOMING',
        }))
      );
    }

    if (modules.length > 0) {
      await db.insert(module).values(
        modules.map((m, i) => ({
          courseId: createdCourse.id,
          title: typeof m === 'string' ? m : m.title,
          order: i + 1,
        }))
      );
    }

    return successResponse(res, createdCourse, 'Course created successfully', 201);
  } catch (err) {
    next(err);
  }
}

export async function updateCourse(req, res, next) {
  try {
    const { id } = req.params;
    const { title, shortDescription, fullDescription, durationHours, trainingMode, price, discountPercent, status } = req.body;

    const data = {};
    if (title) data.title = title;
    if (shortDescription) data.shortDescription = shortDescription;
    if (fullDescription !== undefined) data.fullDescription = fullDescription;
    if (durationHours) data.durationHours = parseInt(durationHours, 10);
    if (trainingMode) data.trainingMode = trainingMode.toUpperCase();
    if (price !== undefined) data.price = parseFloat(price);
    if (discountPercent !== undefined) data.discountPercent = parseFloat(discountPercent);
    if (price !== undefined || discountPercent !== undefined) {
      const p = price !== undefined ? parseFloat(price) : 4999;
      const d = discountPercent !== undefined ? parseFloat(discountPercent) : 0;
      data.finalPrice = p - p * (d / 100);
    }
    if (status) data.status = status;
    data.updatedAt = new Date();

    const [updated] = await db.update(course).set(data).where(eq(course.id, id)).returning();

    if (!updated) {
      throw new AppError('Course not found.', 404, 'COURSE_NOT_FOUND');
    }

    return successResponse(res, updated, 'Course updated successfully');
  } catch (err) {
    next(err);
  }
}

export async function deleteCourse(req, res, next) {
  try {
    const { id } = req.params;
    await db.delete(course).where(eq(course.id, id));
    return successResponse(res, null, 'Course deleted successfully');
  } catch (err) {
    next(err);
  }
}
