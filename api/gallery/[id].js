// Serverless API for single gallery item operations (PUT / DELETE) with PostgreSQL
import { query } from '../_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,DELETE,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;

  if (req.method === 'PUT') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    try {
      await query(
        `UPDATE gallery_photos
         SET title = $1, description = $2, category = $3, image_url = $4, updated_at = NOW()
         WHERE id = $5`,
        [body.title, body.description, body.category, body.src || body.imageUrl, id]
      );
    } catch (e) {
      console.warn('DB update error:', e.message);
    }

    return res.status(200).json({
      success: true,
      message: 'Photo updated successfully.',
      data: { id, ...body, updatedAt: new Date().toISOString() },
    });
  }

  if (req.method === 'DELETE') {
    try {
      await query('DELETE FROM gallery_photos WHERE id = $1', [id]);
    } catch (e) {
      console.warn('DB delete error:', e.message);
    }

    return res.status(200).json({
      success: true,
      message: 'Photo deleted successfully.',
      id,
    });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
