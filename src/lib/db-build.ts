// Build-time safe database module
import { PrismaClient } from '@prisma/client'

// Check if we're in a build environment
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' || 
                   process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === undefined ||
                   process.env.BUILD_TIME === 'true'

// Create a mock database for build time
const mockDb = {
  user: {
    findMany: () => [],
    findUnique: () => null,
    findFirst: () => null,
    create: () => null,
    update: () => null,
    delete: () => null,
    count: () => 0,
  },
  product: {
    findMany: () => [],
    findUnique: () => null,
    findFirst: () => null,
    create: () => null,
    update: () => null,
    delete: () => null,
    count: () => 0,
  },
  sale: {
    findMany: () => [],
    findUnique: () => null,
    findFirst: () => null,
    create: () => null,
    update: () => null,
    delete: () => null,
    count: () => 0,
  },
  // Add more mock models as needed
}

// Export mock database for build time
export const db = isBuildTime ? mockDb : null

// Export a function to get the real database
export function getRealDb() {
  if (isBuildTime) {
    return mockDb
  }
  
  return new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })
}
