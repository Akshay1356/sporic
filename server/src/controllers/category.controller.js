import prisma from '../config/prisma.js';
import { successResponse, errorResponse } from '../utils/response.js';

export async function getAllCategories(req, res, next) {
  try {
    const { domain } = req.query;
    const where = {};
    if (domain) where.domain = domain;

    const categories = await prisma.category.findMany({
      where,
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { courses: true },
        },
      },
    });

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

    const category = await prisma.category.create({
      data: { name, slug, domain, description },
    });

    return successResponse(res, category, 'Category created successfully', 201);
  } catch (err) {
    next(err);
  }
}

export async function deleteCategory(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.category.delete({ where: { id } });
    return successResponse(res, null, 'Category deleted successfully');
  } catch (err) {
    next(err);
  }
}
