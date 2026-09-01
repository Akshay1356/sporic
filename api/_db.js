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

  const hostMatch = hostPart.match(/(?:db\.)?([a-z0-9]+)\.supabase\.co/i);
  const projectRef = hostMatch ? hostMatch[1] : null;

  const slashIndex = hostPart.indexOf('/');
  const dbName = slashIndex !== -1 ? hostPart.substring(slashIndex + 1).split('?')[0] : 'postgres';

  return {
    user,
    password,
    projectRef,
    dbName,
    rawHost: hostPart.split('/')[0].split(':')[0],
    rawPort: parseInt(hostPart.split(':')[1] || '5432', 10),
  };
}

export function getCandidateConfigs() {
  const raw = process.env.DATABASE_URL || process.env.POSTGRES_URL || '';
  if (!raw) return [];

  const parsed = parseSupabaseUrl(raw);
  const configs = [];

  if (parsed && parsed.projectRef) {
    const poolerUser = `postgres.${parsed.projectRef}`;
    for (const region of POOLER_REGIONS) {
      configs.push({
        user: poolerUser,
        password: parsed.password,
        host: region,
        port: 6543,
        database: parsed.dbName || 'postgres',
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 3500,
        max: 5,
      });
      configs.push({
        user: poolerUser,
        password: parsed.password,
        host: region,
        port: 5432,
        database: parsed.dbName || 'postgres',
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 3500,
        max: 5,
      });
    }
  }

  return configs;
}

export async function getDbPool() {
  if (activePool) return activePool;

  const configs = getCandidateConfigs();
  if (configs.length === 0) return null;

  for (const config of configs) {
    let testPool = null;
    try {
      testPool = new Pool(config);
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
