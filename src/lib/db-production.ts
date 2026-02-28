// Production-ready database module
import { PrismaClient } from '@prisma/client'

// Global variable to prevent multiple instances
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Check if we're in build time
const isBuildTime = 
  process.env.NEXT_PHASE === 'phase-production-build' || 
  process.env.NEXT_PHASE === 'phase-development-build' ||
  process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === undefined && !process.env.VERCEL_URL ||
  process.env.CI === 'true' ||
  process.env.BUILD_TIME === 'true' ||
  process.argv.includes('build')

// Create Prisma client only if not in build time
const createPrismaClient = () => {
  if (isBuildTime) {
    // Return mock during build time
    return {
      user: {
        findMany: () => Promise.resolve([]),
        findUnique: () => Promise.resolve(null),
        findFirst: () => Promise.resolve(null),
        create: () => Promise.resolve(null),
        update: () => Promise.resolve(null),
        delete: () => Promise.resolve(null),
        count: () => Promise.resolve(0),
      },
      product: {
        findMany: () => Promise.resolve([]),
        findUnique: () => Promise.resolve(null),
        findFirst: () => Promise.resolve(null),
        create: () => Promise.resolve(null),
        update: () => Promise.resolve(null),
        delete: () => Promise.resolve(null),
        count: () => Promise.resolve(0),
      },
      store: {
        findMany: () => Promise.resolve([]),
        findUnique: () => Promise.resolve(null),
        findFirst: () => Promise.resolve(null),
        create: () => Promise.resolve(null),
        update: () => Promise.resolve(null),
        delete: () => Promise.resolve(null),
        count: () => Promise.resolve(0),
      },
      inventory: {
        findMany: () => Promise.resolve([]),
        findUnique: () => Promise.resolve(null),
        findFirst: () => Promise.resolve(null),
        create: () => Promise.resolve(null),
        update: () => Promise.resolve(null),
        delete: () => Promise.resolve(null),
        count: () => Promise.resolve(0),
      },
      sale: {
        findMany: () => Promise.resolve([]),
        findUnique: () => Promise.resolve(null),
        findFirst: () => Promise.resolve(null),
        create: () => Promise.resolve(null),
        update: () => Promise.resolve(null),
        delete: () => Promise.resolve(null),
        count: () => Promise.resolve(0),
      },
      expense: {
        findMany: () => Promise.resolve([]),
        findUnique: () => Promise.resolve(null),
        findFirst: () => Promise.resolve(null),
        create: () => Promise.resolve(null),
        update: () => Promise.resolve(null),
        delete: () => Promise.resolve(null),
        count: () => Promise.resolve(0),
      },
      delivery: {
        findMany: () => Promise.resolve([]),
        findUnique: () => Promise.resolve(null),
        findFirst: () => Promise.resolve(null),
        create: () => Promise.resolve(null),
        update: () => Promise.resolve(null),
        delete: () => Promise.resolve(null),
        count: () => Promise.resolve(0),
      },
      batch: {
        findMany: () => Promise.resolve([]),
        findUnique: () => Promise.resolve(null),
        findFirst: () => Promise.resolve(null),
        create: () => Promise.resolve(null),
        update: () => Promise.resolve(null),
        delete: () => Promise.resolve(null),
        count: () => Promise.resolve(0),
      },
      $disconnect: () => Promise.resolve(),
    }
  }

  // Return real Prisma client for runtime
  return new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

// Export singleton instance
export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production' && !isBuildTime) globalForPrisma.prisma = db

// Export helper functions
export const isUsingMockDb = () => isBuildTime

export const getRealDb = async () => {
  return db
}

export const disconnect = async () => {
  if (db && !isBuildTime && typeof (db as any).$disconnect === 'function') {
    await (db as any).$disconnect()
  }
}