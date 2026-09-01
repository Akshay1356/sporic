import pg from 'pg';
const { Pool } = pg;

const REGIONS = [
  'aws-0-ap-south-1.pooler.supabase.com',
  'aws-0-ap-southeast-1.pooler.supabase.com',
  'aws-0-us-east-1.pooler.supabase.com',
  'aws-0-us-east-2.pooler.supabase.com',
  'aws-0-eu-central-1.pooler.supabase.com',
  'aws-0-eu-west-1.pooler.supabase.com',
  'aws-0-ap-northeast-1.pooler.supabase.com',
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const rawUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || '';
  if (!rawUrl) {
    return res.status(200).json({ error: 'No DATABASE_URL found in environment variables.' });
  }

  const match = rawUrl.match(/postgresql:\/\/([^:]+):([^@]+)@db\.([a-z0-9]+)\.supabase\.co(?::\d+)?\/(.+)/i);
  
  const results = [];
  let workingRegion = null;
  let photoCount = 0;

  if (match) {
    const [, user, password, projectRef, dbName] = match;
    const cleanDb = dbName.split('?')[0] || 'postgres';
    const poolerUser = `postgres.${projectRef}`;

    for (const region of REGIONS) {
      const connStr = `postgresql://${encodeURIComponent(poolerUser)}:${password}@${region}:6543/${cleanDb}?sslmode=require`;
      let testPool = null;
      try {
        testPool = new Pool({
          connectionString: connStr,
          ssl: { rejectUnauthorized: false },
          connectionTimeoutMillis: 2500,
          max: 1,
        });
        const queryRes = await testPool.query('SELECT 1 as connected');
        
        // Auto create table
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
        workingRegion = region;
        results.push({ region, status: 'CONNECTED', count: photoCount });
        await testPool.end().catch(() => {});
        break;
      } catch (err) {
        results.push({ region, error: err.message });
        if (testPool) await testPool.end().catch(() => {});
      }
    }
  }

  return res.status(200).json({
    rawUrlProvided: Boolean(rawUrl),
    workingRegion,
    photoCount,
    details: results,
  });
}
