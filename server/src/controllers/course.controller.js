import prisma from '../config/prisma.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { AppError } from '../utils/errors.js';

export async function getCourses(req, res, next) {
  try {
    const { search, domain, category, mode, status, sortBy = 'title', sortOrder = 'asc', limit = 50, page = 1 } = req.query;

    const where = {};

    // By default public only sees PUBLISHED courses unless admin
    if (status && req.user?.role === 'ADMIN') {
      where.status = status;
    } else {
      where.status = 'PUBLISHED';
    }

    if (mode) {
      where.trainingMode = mode.toUpperCase();
    }

    if (category) {
      where.category = {
        name: { equals: category },
      };
    } else if (domain) {
      where.category = {
        domain: { equals: domain },
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { shortDescription: { contains: search } },
        { courseCode: { contains: search } },
      ];
    }

    const take = parseInt(limit, 10);
    const skip = (parseInt(page, 10) - 1) * take;

    let orderBy = { title: 'asc' };
    if (sortBy === 'duration') orderBy = { durationHours: sortOrder === 'desc' ? 'desc' : 'asc' };
    if (sortBy === 'price') orderBy = { finalPrice: sortOrder === 'desc' ? 'desc' : 'asc' };
    if (sortBy === 'code') orderBy = { courseCode: sortOrder === 'desc' ? 'desc' : 'asc' };
    if (sortBy === 'createdAt') orderBy = { createdAt: 'desc' };

    const [total, courses] = await Promise.all([
      prisma.course.count({ where }),
      prisma.course.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          category: { select: { id: true, name: true, domain: true, slug: true } },
          objectives: { orderBy: { order: 'asc' } },
          sessions: { orderBy: { batchNumber: 'asc' } },
          _count: { select: { modules: true, enrollments: true } },
        },
      }),
    ]);

    // Format output to be directly compatible with frontend expectations
    const formatted = courses.map((c) => ({
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
      moduleCount: c._count.modules,
      enrollmentCount: c._count.enrollments,
      status: c.status,
    }));

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

    const course = await prisma.course.findFirst({
      where: {
        OR: [{ courseCode: identifier }, { id: identifier }, { slug: identifier }],
      },
      include: {
        category: true,
        instructor: { select: { id: true, name: true, designation: true, department: true, email: true } },
        objectives: { orderBy: { order: 'asc' } },
        sessions: { orderBy: { batchNumber: 'asc' } },
        modules: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' },
              select: {
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

    if (!course) {
      throw new AppError(`Course with identifier '${identifier}' not found.`, 404, 'COURSE_NOT_FOUND');
    }

    const formatted = {
      id: course.courseCode,
      dbId: course.id,
      code: course.courseCode,
      title: course.title,
      slug: course.slug,
      shortDescription: course.shortDescription,
      fullDescription: course.fullDescription,
      domain: course.category.domain,
      category: course.category.name,
      hours: course.durationHours,
      mode: course.trainingMode.toLowerCase(),
      price: course.price,
      discountPercent: course.discountPercent,
      finalPrice: course.finalPrice,
      contactEmail: course.contactEmail,
      contactPerson: course.contactPerson,
      contactNumber: course.contactNumber,
      instructor: course.instructor,
      learn: course.objectives.filter((o) => o.type === 'LEARN').map((o) => o.content),
      features: course.objectives.filter((o) => o.type === 'FEATURE').map((o) => o.content),
      modules: course.modules.map((m) => m.title),
      detailedModules: course.modules,
      sessions: course.sessions.map((s) => ({
        id: s.id,
        batch: s.batchNumber,
        date: s.startDate,
        status: s.status,
      })),
      status: course.status,
      certificateEnabled: course.certificateEnabled,
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
    const finalPrice = price - (price * (discountPercent / 100));

    const course = await prisma.course.create({
      data: {
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
      },
    });

    // Add learn objectives
    for (let i = 0; i < learn.length; i++) {
      await prisma.learningObjective.create({
        data: { courseId: course.id, content: learn[i], type: 'LEARN', order: i + 1 },
      });
    }

    // Add features
    for (let i = 0; i < features.length; i++) {
      await prisma.learningObjective.create({
        data: { courseId: course.id, content: features[i], type: 'FEATURE', order: i + 1 },
      });
    }

    // Add sessions
    for (let i = 0; i < sessions.length; i++) {
      await prisma.sessionBatch.create({
        data: {
          courseId: course.id,
          batchNumber: sessions[i].batchNumber || i + 1,
          startDate: sessions[i].startDate || sessions[i].date,
          status: sessions[i].status || 'UPCOMING',
        },
      });
    }

    // Add modules if provided
    for (let m = 0; m < modules.length; m++) {
      await prisma.module.create({
        data: {
          courseId: course.id,
          title: typeof modules[m] === 'string' ? modules[m] : modules[m].title,
          order: m + 1,
        },
      });
    }

    return successResponse(res, course, 'Course created successfully', 201);
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
      data.finalPrice = p - (p * (d / 100));
    }
    if (status) data.status = status;

    const updated = await prisma.course.update({
      where: { id },
      data,
    });

    return successResponse(res, updated, 'Course updated successfully');
  } catch (err) {
    next(err);
  }
}

export async function deleteCourse(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.course.delete({ where: { id } });
    return successResponse(res, null, 'Course deleted successfully');
  } catch (err) {
    next(err);
  }
}
