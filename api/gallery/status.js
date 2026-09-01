import pg from 'pg';
const { Pool } = pg;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const rawUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || '';
  if (!rawUrl) {
    return res.status(200).json({ error: 'No DATABASE_URL found in environment variables.' });
  }

  // Mask password for safety: postgresql://username:****@host:port/dbname
  const maskedUrl = rawUrl.replace(/:([^:@]+)@/, ':****@');

  // Try direct connection first
  let directConnected = false;
  let directError = null;
  let photoCount = 0;

  let directPool = null;
  try {
    directPool = new Pool({
      connectionString: rawUrl,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 4000,
    });
    await directPool.query('SELECT 1');
    directConnected = true;

    await directPool.query(`
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

    const countRes = await directPool.query('SELECT count(*) FROM gallery_photos');
    photoCount = parseInt(countRes?.rows?.[0]?.count || '0', 10);
    await directPool.end().catch(() => {});
  } catch (err) {
    directError = err.message;
    if (directPool) await directPool.end().catch(() => {});
  }

  return res.status(200).json({
    maskedUrl,
    directConnected,
    directError,
    photoCount,
  });
}
