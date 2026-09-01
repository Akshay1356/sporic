import pg from 'pg';
const { Pool } = pg;
import { getCandidateConnectionStrings, parseSupabaseUrl } from '../_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const rawUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || '';
  if (!rawUrl) {
    return res.status(200).json({ error: 'No DATABASE_URL found in environment variables.' });
  }

  const parsed = parseSupabaseUrl(rawUrl);
  const candidates = getCandidateConnectionStrings();

  const attempts = [];
  let successfulConnection = null;
  let photoCount = 0;

  for (const conn of candidates) {
    // Mask password
    const masked = conn.replace(/:([^:@]+)@/, ':****@');
    let testPool = null;
    try {
      testPool = new Pool({
        connectionString: conn,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 3000,
        max: 1,
      });

      await testPool.query('SELECT 1');

      // Create table if not exists
      await testPool.query(`
        CREATE TABLE IF NOT EXISTS gallery_photos (
          id VARCHAR(255) PRIMARY KEY,
          title VARCHAR(255),
          description TEXT,
          category VARCHAR(100),
          image_url TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);

      const countRes = await testPool.query('SELECT count(*) FROM gallery_photos');
      photoCount = parseInt(countRes?.rows?.[0]?.count || '0', 10);

      successfulConnection = masked;
      attempts.push({ target: masked, status: 'CONNECTED', photoCount });
      await testPool.end().catch(() => {});
      break;
    } catch (err) {
      attempts.push({ target: masked, error: err.message });
      if (testPool) await testPool.end().catch(() => {});
    }
  }

  return res.status(200).json({
    parsedProjectRef: parsed?.projectRef,
    connected: Boolean(successfulConnection),
    successfulConnection,
    photoCount,
    attempts,
  });
}
