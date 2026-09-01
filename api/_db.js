import pg from 'pg';
const { Pool } = pg;

let activePool = null;

const POOLER_REGIONS = [
  'aws-0-ap-south-1.pooler.supabase.com',
  'aws-0-ap-southeast-1.pooler.supabase.com',
  'aws-0-us-east-1.pooler.supabase.com',
  'aws-0-us-east-2.pooler.supabase.com',
  'aws-0-eu-central-1.pooler.supabase.com',
  'aws-0-eu-west-1.pooler.supabase.com',
  'aws-0-ap-northeast-1.pooler.supabase.com',
];

export function parseSupabaseUrl(raw) {
  if (!raw) return null;

  // Split from the last '@' to cleanly isolate passwords that contain '@', ']', etc.
  const protocolIndex = raw.indexOf('://');
  if (protocolIndex === -1) return null;

  const afterProtocol = raw.substring(protocolIndex + 3);
  const lastAtIndex = afterProtocol.lastIndexOf('@');
  if (lastAtIndex === -1) return null;

  const authPart = afterProtocol.substring(0, lastAtIndex);
  const hostPart = afterProtocol.substring(lastAtIndex + 1);

  const firstColon = authPart.indexOf(':');
  const user = firstColon !== -1 ? authPart.substring(0, firstColon) : 'postgres';
  const password = firstColon !== -1 ? authPart.substring(firstColon + 1) : authPart;

  // Extract project ref from host (e.g. db.lzgsabqgjpardizjinsp.supabase.co:5432/postgres)
  const hostMatch = hostPart.match(/(?:db\.)?([a-z0-9]+)\.supabase\.co/i);
  const projectRef = hostMatch ? hostMatch[1] : null;

  const slashIndex = hostPart.indexOf('/');
  const dbName = slashIndex !== -1 ? hostPart.substring(slashIndex + 1).split('?')[0] : 'postgres';

  return {
    user,
    password,
    encodedPassword: encodeURIComponent(password),
    projectRef,
    dbName,
    rawHost: hostPart.split('/')[0],
  };
}

export function getCandidateConnectionStrings() {
  const raw = process.env.DATABASE_URL || process.env.POSTGRES_URL || '';
  if (!raw) return [];

  const parsed = parseSupabaseUrl(raw);
  const candidates = [];

  if (parsed && parsed.projectRef) {
    const poolerUser = `postgres.${parsed.projectRef}`;
    for (const region of POOLER_REGIONS) {
      candidates.push(
        `postgresql://${encodeURIComponent(poolerUser)}:${parsed.encodedPassword}@${region}:6543/${parsed.dbName}?sslmode=require`
      );
      candidates.push(
        `postgresql://${encodeURIComponent(poolerUser)}:${parsed.encodedPassword}@${region}:5432/${parsed.dbName}?sslmode=require`
      );
    }
  }

  // Also include direct URI with encoded password
  if (parsed) {
    candidates.push(
      `postgresql://${encodeURIComponent(parsed.user)}:${parsed.encodedPassword}@${parsed.rawHost}/${parsed.dbName}?sslmode=require`
    );
  }

  candidates.push(raw);
  return candidates;
}

export async function getDbPool() {
  if (activePool) return activePool;

  const candidates = getCandidateConnectionStrings();
  if (candidates.length === 0) return null;

  for (const connStr of candidates) {
    let testPool = null;
    try {
      testPool = new Pool({
        connectionString: connStr,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 3000,
        max: 5,
      });

      await testPool.query('SELECT 1');
      activePool = testPool;
      return activePool;
    } catch {
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
