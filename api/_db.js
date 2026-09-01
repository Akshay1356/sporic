import pg from 'pg';
const { Pool } = pg;

let pool = null;

const COMMON_REGIONS = [
  'aws-0-ap-south-1.pooler.supabase.com',
  'aws-0-ap-southeast-1.pooler.supabase.com',
  'aws-0-us-east-1.pooler.supabase.com',
  'aws-0-eu-central-1.pooler.supabase.com',
  'aws-0-us-west-1.pooler.supabase.com',
];

function getCandidateConnectionStrings() {
  const raw = process.env.DATABASE_URL || process.env.POSTGRES_URL || '';
  if (!raw) return [];

  const candidates = [raw];

  // If Supabase direct db.[ref].supabase.co format is used, generate IPv4 pooler alternatives
  const supabaseDirectRegex = /postgresql:\/\/([^:]+):([^@]+)@db\.([a-z0-9]+)\.supabase\.co(?::\d+)?\/(.+)/i;
  const match = raw.match(supabaseDirectRegex);

  if (match) {
    const [, user, password, projectRef, dbNameAndQuery] = match;
    const cleanDbName = dbNameAndQuery.split('?')[0] || 'postgres';
    const poolerUser = `postgres.${projectRef}`;

    for (const regionHost of COMMON_REGIONS) {
      candidates.push(
        `postgresql://${encodeURIComponent(poolerUser)}:${password}@${regionHost}:6543/${cleanDbName}?sslmode=require`
      );
      candidates.push(
        `postgresql://${encodeURIComponent(poolerUser)}:${password}@${regionHost}:5432/${cleanDbName}?sslmode=require`
      );
    }
  }

  return candidates;
}

export function getDbPool() {
  const candidates = getCandidateConnectionStrings();
  if (candidates.length === 0) return null;

  if (!pool) {
    // Start with the best candidate
    const primaryUri = candidates[1] || candidates[0];
    pool = new Pool({
      connectionString: primaryUri,
      ssl: {
        rejectUnauthorized: false,
      },
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
  }
  return pool;
}

export async function query(text, params = []) {
  const candidates = getCandidateConnectionStrings();
  if (candidates.length === 0) return null;

  let lastError = null;

  // Try candidate connections until one works (resolves IPv4 pooler)
  for (const connStr of candidates) {
    let testPool = null;
    try {
      testPool = new Pool({
        connectionString: connStr,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 3500,
        max: 2,
      });

      const res = await testPool.query(text, params);
      await testPool.end().catch(() => {});
      return res;
    } catch (err) {
      lastError = err;
      if (testPool) {
        await testPool.end().catch(() => {});
      }
      // If error is not a DNS/network lookup error, break early
      if (!err.message.includes('ENOTFOUND') && !err.message.includes('ETIMEDOUT') && !err.message.includes('EHOSTUNREACH')) {
        break;
      }
    }
  }

  if (lastError) throw lastError;
  return null;
}

export async function ensureGalleryTable() {
  try {
    await query(`
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
    console.warn('ensureGalleryTable notice:', e.message);
    return false;
  }
}
