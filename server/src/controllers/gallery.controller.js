import prisma from '../config/prisma.js';
import { successResponse, errorResponse } from '../utils/response.js';

// Baseline static gallery photos
const staticPhotos = [
  {
    id: 'corporate-strategy-mindset-workshop',
    src: '/gallery/premier_group_training.jpg',
    title: 'Corporate Strategy & Leadership Mindset Workshop',
    category: 'Executive Development',
    description: 'Executive leadership, strategic thinking, and team development workshop conducted for corporate management cohorts.',
  },
  {
    id: 'managers-multiplier-masterclass',
    src: '/gallery/lucas_tvs_management_program.jpg',
    title: 'Corporate Management Excellence & Multiplier Masterclass',
    category: 'Corporate Training',
    description: 'Interactive corporate management excellence training on managerial multiplication and leadership productivity.',
  },
  {
    id: 'strategic-planning-operations-program',
    src: '/gallery/strategic_planning_industrial_training.png',
    title: 'Strategic Planning & Industrial Operations Program',
    category: 'Corporate Training',
    description: 'Specialized industrial training on strategic planning, financial forecasting, and decision modeling for industry professionals.',
  },
  {
    id: 'executive-leadership-series',
    src: '/gallery/corporate_executive_leadership_program.jpg',
    title: 'Corporate Executive Leadership & Development Series',
    category: 'Executive Development',
    description: 'High-impact keynote lecture and corporate capacity building session delivered to industry managers and engineering professionals.',
  },
  {
    id: 'lab-training-session',
    src: '/gallery/lab_training_session.png',
    title: 'Technical Skill & Computer Lab Training',
    category: 'Technical Workshops',
    description: 'Hands-on practical computational training and workforce development session conducted at VIT-TEC computing facilities.',
  },
  {
    id: 'certificate-award-ceremony',
    src: '/gallery/certificate_award_ceremony.jpg',
    title: 'Corporate Training Certificate Distribution Ceremony',
    category: 'Certification Ceremonies',
    description: 'Participants awarded official VIT-TEC certificates of completion at Dr. A.P.J. Abdul Kalam Block.',
  },
  {
    id: 'professional-development-workshop',
    src: '/gallery/professional_development_workshop.jpg',
    title: 'Professional Development & Cross-Functional Synergy',
    category: 'Corporate Training',
    description: 'Interactive corporate training program with industry trainees around the executive conference boardroom.',
  },
  {
    id: 'executive-conference-meeting',
    src: '/gallery/executive_conference_meeting.jpg',
    title: 'Executive Development & Industry Keynote Session',
    category: 'Executive Development',
    description: 'Senior university leadership and industry delegates in an executive development session at SpoRIC.',
  },
  {
    id: 'campus-delegates-group',
    src: '/gallery/campus_delegates_group.jpg',
    title: 'Faculty Coordinators & Industry Delegate Cohort',
    category: 'Corporate Training',
    description: 'Commemorative cohort gathering of corporate trainees and faculty coordinators in the campus courtyard.',
  },
];

const ALLOWED_CATEGORIES = [
  'Corporate Training',
  'Executive Development',
  'Technical Workshops',
  'Certification Ceremonies',
];

// GET /api/gallery
export async function getPublicGallery(req, res, next) {
  try {
    let dbPhotos = [];
    try {
      dbPhotos = await prisma.galleryPhoto.findMany({
        orderBy: { createdAt: 'desc' },
      });
    } catch (e) {
      console.warn('Prisma GalleryPhoto query warning:', e.message);
    }

    const formattedCustom = dbPhotos.map((p) => ({
      id: p.id,
      src: p.src,
      title: p.title,
      category: p.category,
      description: p.description,
      createdAt: p.createdAt,
      isCustom: true,
    }));

    const allPhotos = [...formattedCustom, ...staticPhotos];
    return res.status(200).json({
      success: true,
      photos: allPhotos,
      customCount: formattedCustom.length,
      totalCount: allPhotos.length,
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/admin/gallery
export async function uploadGalleryPhoto(req, res, next) {
  try {
    const { imageBase64, src, category, description, title } = req.body || {};
    const photoSrc = src || imageBase64;

    if (!photoSrc || !category || !description) {
      return errorResponse(res, 'Missing required fields: image, category, and description are required.', 400);
    }

    if (!ALLOWED_CATEGORIES.includes(category)) {
      return errorResponse(
        res,
        `Invalid category. Must be one of: ${ALLOWED_CATEGORIES.join(', ')}`,
        400
      );
    }

    const newPhoto = await prisma.galleryPhoto.create({
      data: {
        src: photoSrc,
        title: title || `${category} Event`,
        category,
        description: String(description).trim(),
      },
    });

    return successResponse(
      res,
      { photo: newPhoto },
      'Corporate training photograph uploaded successfully.',
      201
    );
  } catch (err) {
    next(err);
  }
}

// DELETE /api/admin/gallery/:id
export async function deleteGalleryPhoto(req, res, next) {
  try {
    const { id } = req.params;
    const targetId = id || req.body?.id;

    if (!targetId) {
      return errorResponse(res, 'Photo ID is required for deletion.', 400);
    }

    await prisma.galleryPhoto.delete({
      where: { id: targetId },
    }).catch(() => null);

    return successResponse(res, { deletedId: targetId }, 'Gallery photograph deleted successfully.');
  } catch (err) {
    next(err);
  }
}

// PUT /api/admin/gallery/:id
export async function updateGalleryPhoto(req, res, next) {
  try {
    const { id } = req.params;
    const targetId = id || req.body?.id;
    const { imageBase64, src, category, description, title } = req.body || {};

    if (!targetId) {
      return errorResponse(res, 'Photo ID is required for update.', 400);
    }

    const existing = await prisma.galleryPhoto.findUnique({
      where: { id: targetId },
    });

    if (!existing) {
      return errorResponse(res, 'Gallery photograph record not found.', 404);
    }

    if (category && !ALLOWED_CATEGORIES.includes(category)) {
      return errorResponse(
        res,
        `Invalid category. Must be one of: ${ALLOWED_CATEGORIES.join(', ')}`,
        400
      );
    }

    const updatedPhoto = await prisma.galleryPhoto.update({
      where: { id: targetId },
      data: {
        src: src || imageBase64 || existing.src,
        category: category || existing.category,
        description: description ? String(description).trim() : existing.description,
        title: title || (category ? `${category} Event` : existing.title),
      },
    });

    return successResponse(
      res,
      { photo: updatedPhoto },
      'Corporate training photograph updated successfully.',
      200
    );
  } catch (err) {
    next(err);
  }
}

