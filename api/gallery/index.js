// Serverless API for Public Gallery & Admin CMS with Persistent Cloud PostgreSQL (Supabase)
import { query, ensureGalleryTable } from '../_db.js';

const initialSeedPhotos = [
  {
    id: 'corporate-strategy-mindset-workshop',
    src: '/gallery/premier_group_training.jpg',
    imageUrl: '/gallery/premier_group_training.jpg',
    title: 'Corporate Strategy & Leadership Mindset Workshop',
    category: 'Leadership & Personality',
    description: 'Executive leadership, strategic thinking, and team development workshop conducted for corporate management cohorts.',
    createdAt: '2026-01-15T10:00:00.000Z',
  },
  {
    id: 'managers-multiplier-masterclass',
    src: '/gallery/lucas_tvs_management_program.jpg',
    imageUrl: '/gallery/lucas_tvs_management_program.jpg',
    title: 'Corporate Management Excellence & Multiplier Masterclass',
    category: 'Corporate Training',
    description: 'Interactive corporate management excellence training on managerial multiplication and leadership productivity.',
    createdAt: '2026-02-10T10:00:00.000Z',
  },
  {
    id: 'strategic-planning-operations-program',
    src: '/gallery/strategic_planning_industrial_training.png',
    imageUrl: '/gallery/strategic_planning_industrial_training.png',
    title: 'Strategic Planning & Industrial Operations Program',
    category: 'Management',
    description: 'Specialized industrial training on strategic planning, financial forecasting, and decision modeling for industry professionals.',
    createdAt: '2026-02-18T10:00:00.000Z',
  },
  {
    id: 'executive-leadership-series',
    src: '/gallery/corporate_executive_leadership_program.jpg',
    imageUrl: '/gallery/corporate_executive_leadership_program.jpg',
    title: 'Corporate Executive Leadership & Development Series',
    category: 'Leadership & Personality',
    description: 'High-impact keynote lecture and corporate capacity building session delivered to industry managers and engineering professionals.',
    createdAt: '2026-03-01T10:00:00.000Z',
  },
  {
    id: 'lab-training-session',
    src: '/gallery/lab_training_session.png',
    imageUrl: '/gallery/lab_training_session.png',
    title: 'Technical Skill & Computer Lab Training',
    category: 'Technology',
    description: 'Hands-on practical computational training and workforce development session conducted at VIT-TEC computing facilities.',
    createdAt: '2026-03-12T10:00:00.000Z',
  },
  {
    id: 'certificate-award-ceremony',
    src: '/gallery/certificate_award_ceremony.jpg',
    imageUrl: '/gallery/certificate_award_ceremony.jpg',
    title: 'Corporate Training Certificate Distribution Ceremony',
    category: 'Events',
    description: 'Participants awarded official VIT-TEC certificates of completion at Dr. A.P.J. Abdul Kalam Block.',
    createdAt: '2026-03-20T10:00:00.000Z',
  },
  {
    id: 'professional-development-workshop',
    src: '/gallery/professional_development_workshop.jpg',
    imageUrl: '/gallery/professional_development_workshop.jpg',
    title: 'Professional Development & Cross-Functional Synergy',
    category: 'Workshops',
    description: 'Interactive corporate training program with industry trainees around the executive conference boardroom.',
    createdAt: '2026-04-05T10:00:00.000Z',
  },
  {
    id: 'executive-conference-meeting',
    src: '/gallery/executive_conference_meeting.jpg',
    imageUrl: '/gallery/executive_conference_meeting.jpg',
    title: 'Executive Development & Industry Keynote Session',
    category: 'Corporate Training',
    description: 'Senior university leadership and industry delegates in an executive development session at SpoRIC.',
    createdAt: '2026-04-18T10:00:00.000Z',
  },
  {
    id: 'campus-delegates-group',
    src: '/gallery/campus_delegates_group.jpg',
    imageUrl: '/gallery/campus_delegates_group.jpg',
    title: 'Faculty Coordinators & Industry Delegate Cohort',
    category: 'Events',
    description: 'Commemorative cohort gathering of corporate trainees and faculty coordinators in the campus courtyard.',
    createdAt: '2026-05-02T10:00:00.000Z',
  },
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') return res.status(200).end();

  // Ensure PostgreSQL table is initialized
  await ensureGalleryTable().catch(() => false);

  // GET: Public retrieval with cloud database query
  if (req.method === 'GET') {
    const { category } = req.query;

    try {
      let dbRows = [];
      let queryText = 'SELECT * FROM gallery_photos';
      const params = [];

      if (category && category !== 'All') {
        queryText += ' WHERE category = $1';
        params.push(category);
      }
      queryText += ' ORDER BY created_at DESC';

      const dbRes = await query(queryText, params);
      if (dbRes?.rows && dbRes.rows.length > 0) {
        dbRows = dbRes.rows.map((r) => ({
          id: r.id,
          src: r.image_url,
          imageUrl: r.image_url,
          title: r.title || 'Corporate Training Activity',
          description: r.description,
          category: r.category,
          createdAt: r.created_at,
          isCustom: true,
        }));
      }

      // Merge cloud database custom items with initial seed items
      const dbIds = new Set(dbRows.map((r) => r.id));
      let initialFiltered = initialSeedPhotos.filter((p) => !dbIds.has(p.id));

      if (category && category !== 'All') {
        initialFiltered = initialFiltered.filter((p) => p.category === category);
      }

      const combined = [...dbRows, ...initialFiltered];

      return res.status(200).json({
        success: true,
        count: combined.length,
        data: combined,
        source: dbRows.length > 0 ? 'cloud_database' : 'initial_seed',
      });
    } catch (e) {
      console.warn('DB read fallback to initial photos:', e.message);
      let results = initialSeedPhotos;
      if (category && category !== 'All') {
        results = results.filter((p) => p.category === category);
      }
      return res.status(200).json({
        success: true,
        count: results.length,
        data: results,
        source: 'initial_seed',
      });
    }
  }

  // POST: Admin only photo creation saved to PostgreSQL cloud database
  if (req.method === 'POST') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { title, description, category, imageUrl, src } = body || {};

    const imageSource = imageUrl || src;
    if (!imageSource) {
      return res.status(400).json({
        success: false,
        message: 'Image data/URL is required.',
      });
    }

    if (!description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Description and Category are required fields.',
      });
    }

    const newItem = {
      id: body.id || `gal_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      src: imageSource,
      imageUrl: imageSource,
      title: title || 'Corporate Training Activity',
      description,
      category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let dbSaved = false;
    let dbErrorMessage = null;

    try {
      const insertRes = await query(
        `INSERT INTO gallery_photos (id, title, description, category, image_url, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO UPDATE SET
           title = EXCLUDED.title,
           description = EXCLUDED.description,
           category = EXCLUDED.category,
           image_url = EXCLUDED.image_url,
           updated_at = EXCLUDED.updated_at`,
        [
          newItem.id,
          newItem.title,
          newItem.description,
          newItem.category,
          newItem.imageUrl,
          newItem.createdAt,
          newItem.updatedAt,
        ]
      );
      if (insertRes) {
        dbSaved = true;
      }
    } catch (dbErr) {
      console.error('DB insert error:', dbErr.message);
      dbErrorMessage = dbErr.message;
    }

    return res.status(201).json({
      success: true,
      message: dbSaved
        ? 'Photo saved to Cloud Database successfully.'
        : `Photo saved locally. Cloud DB warning: ${dbErrorMessage || 'DATABASE_URL not connected'}`,
      data: newItem,
      cloudSynced: dbSaved,
      error: dbErrorMessage,
    });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
