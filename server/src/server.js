import app from './app.js';
import { config } from './config/index.js';
import { db } from './db/index.js';
import { sql } from 'drizzle-orm';

const PORT = config.port;

async function startServer() {
  try {
    // Verify database connection
    await db.execute(sql`select 1`);
    console.log('✅ Connected to Neon PostgreSQL via Drizzle.');

    app.listen(PORT, () => {
      console.log(`🚀 SPORIC / VIT-TEC Backend Server running on http://localhost:${PORT}`);
      console.log(`📑 Swagger Documentation available at http://localhost:${PORT}/api-docs`);
      console.log(`🩺 Health check at http://localhost:${PORT}/health`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
