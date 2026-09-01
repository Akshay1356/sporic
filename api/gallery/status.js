import { query, ensureGalleryTable, getDbPool } from '../_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const hasDbUrl = Boolean(process.env.DATABASE_URL || process.env.POSTGRES_URL);
  let dbConnected = false;
  let errorMsg = null;
  let tableCreated = false;
  let photoCount = 0;

  if (hasDbUrl) {
    try {
      tableCreated = await ensureGalleryTable();
      const countRes = await query('SELECT count(*) FROM gallery_photos');
      photoCount = parseInt(countRes?.rows?.[0]?.count || '0', 10);
      dbConnected = true;
    } catch (e) {
      errorMsg = e.message;
    }
  }

  return res.status(200).json({
    hasDbUrl,
    dbConnected,
    tableCreated,
    photoCount,
    error: errorMsg,
    nodeEnv: process.env.NODE_ENV,
  });
}
