import pg from 'pg';
const { Pool } = pg;
import { getCandidateConfigs, parseSupabaseUrl } from '../_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const rawUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || '';
  if (!rawUrl) {
    return res.status(200).json({ error: 'No DATABASE_URL found in environment variables.' });
  }

  const parsed = parseSupabaseUrl(rawUrl);
  const configs = getCandidateConfigs();

  const attempts = [];
  let successfulHost = null;
  let photoCount = 0;

  for (const config of configs) {
    const targetLabel = `${config.user}@${config.host}:${config.port}/${config.database}`;
    let testPool = null;
    try {
      testPool = new Pool(config);
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

      successfulHost = targetLabel;
      attempts.push({ target: targetLabel, status: 'CONNECTED', photoCount });
      await testPool.end().catch(() => {});
      break;
    } catch (err) {
      attempts.push({ target: targetLabel, error: err.message });
      if (testPool) await testPool.end().catch(() => {});
    }
  }

  return res.status(200).json({
    parsedProjectRef: parsed?.projectRef,
    connected: Boolean(successfulHost),
    successfulHost,
    photoCount,
    attempts,
  });
}
