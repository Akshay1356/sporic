import { eq, sql } from 'drizzle-orm';
import { db } from '../db/index.js';
import { category, course } from '../db/schema/index.js';
import { successResponse, errorResponse } from '../utils/response.js';

export async function getAllCategories(req, res, next) {
  try {
    const { domain } = req.query;

    const rows = await db
      .select({
        id: category.id,
        name: category.name,
        slug: category.slug,
        domain: category.domain,
        description: category.description,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
        courseCount: sql`count(${course.id})`.mapWith(Number),
      })
      .from(category)
      .leftJoin(course, eq(course.categoryId, category.id))
      .where(domain ? eq(category.domain, domain) : undefined)
      .groupBy(category.id)
      .orderBy(category.name);

    const categories = rows.map(({ courseCount, ...rest }) => ({
      ...rest,
      _count: { courses: courseCount },
    }));

    return successResponse(res, categories, 'Categories retrieved successfully');
  } catch (err) {
    next(err);
  }
}

export async function createCategory(req, res, next) {
  try {
    const { name, domain, description } = req.body;
    if (!name || !domain) {
      return errorResponse(res, 'Name and Domain are required.', 400, 'MISSING_FIELDS');
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const [created] = await db.insert(category).values({ name, slug, domain, description }).returning();

    return successResponse(res, created, 'Category created successfully', 201);
  } catch (err) {
    next(err);
  }
}

export async function deleteCategory(req, res, next) {
  try {
    const { id } = req.params;
    await db.delete(category).where(eq(category.id, id));
    return successResponse(res, null, 'Category deleted successfully');
  } catch (err) {
    next(err);
  }
}
