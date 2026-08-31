import app from './app.js';
import { config } from './config/index.js';
import prisma from './config/prisma.js';

const PORT = config.port;

async function startServer() {
  try {
    // Verify database connection
    await prisma.$connect();
    console.log('✅ Connected to database via Prisma.');

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
