// Real database connection using Prisma 7.x config
import { PrismaClient } from '@prisma/client'

// Check if we're in build time (only during actual build, not production)
const isBuildTime = 
  process.env.NEXT_PHASE === 'phase-production-build' || 
  process.env.NEXT_PHASE === 'phase-development-build' ||
  process.env.BUILD_TIME === 'true' ||
  process.argv.includes('build');

// Create real Prisma client with proper configuration
const createPrismaClient = () => {
  if (isBuildTime) {
    throw new Error('Database operations not allowed during build time');
  }

  return new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
};

// Create and export the database client
const db = createPrismaClient();

// Export helper functions
export const isUsingMockDb = () => false; // Never use mock in production

export const getRealDb = async () => {
  return db;
};

export const disconnect = async () => {
  if (db && typeof db.$disconnect === 'function') {
    await db.$disconnect();
  }
};