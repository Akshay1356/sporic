import pg from 'pg';
const { Pool } = pg;

let activePool = null;
let activeConnectionString = null;

const REGIONS = [
  'aws-0-ap-south-1.pooler.supabase.com',
  'aws-0-ap-southeast-1.pooler.supabase.com',
  'aws-0-us-east-1.pooler.supabase.com',
  'aws-0-us-east-2.pooler.supabase.com',
  'aws-0-eu-central-1.pooler.supabase.com',
  'aws-0-eu-west-1.pooler.supabase.com',
  'aws-0-ap-northeast-1.pooler.supabase.com',
];

function generateCandidatePoolerStrings() {
  const raw = process.env.DATABASE_URL || process.env.POSTGRES_URL || '';
  if (!raw) return [];

  const candidates = [];

  const match = raw.match(/postgresql:\/\/([^:]+):([^@]+)@db\.([a-z0-9]+)\.supabase\.co(?::\d+)?\/(.+)/i);
  if (match) {
    const [, user, password, projectRef, dbName] = match;
    const cleanDb = dbName.split('?')[0] || 'postgres';
    const poolerUser = `postgres.${projectRef}`;

    for (const region of REGIONS) {
      candidates.push(
        `postgresql://${encodeURIComponent(poolerUser)}:${password}@${region}:6543/${cleanDb}?sslmode=require`
      );
      candidates.push(
        `postgresql://${encodeURIComponent(poolerUser)}:${password}@${region}:5432/${cleanDb}?sslmode=require`
      );
    }
  }

  candidates.push(raw);
  return candidates;
}

export async function getDbPool() {
  if (activePool) return activePool;

  const candidates = generateCandidatePoolerStrings();
  if (candidates.length === 0) return null;

  for (const connStr of candidates) {
    let testPool = null;
    try {
      testPool = new Pool({
        connectionString: connStr,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 2500,
        max: 5,
      });

      await testPool.query('SELECT 1');
      activePool = testPool;
      activeConnectionString = connStr;
      return activePool;
    } catch (err) {
      if (testPool) {
        await testPool.end().catch(() => {});
      }
    }
  }

  return null;
}

export async function query(text, params = []) {
  const pool = await getDbPool();
  if (!pool) {
    throw new Error('Could not establish connection to PostgreSQL cloud database.');
  }
  return await pool.query(text, params);
}

export async function ensureGalleryTable() {
  try {
    const pool = await getDbPool();
    if (!pool) return false;

    await pool.query(`
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
    return true;
  } catch (e) {
    console.warn('ensureGalleryTable warning:', e.message);
    return false;
  }
}
