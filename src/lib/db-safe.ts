// Comprehensive build-time safe database module
import { PrismaClient } from '@prisma/client'

// Check if we're in any build/static generation environment
const isBuildTime = 
  process.env.NEXT_PHASE === 'phase-production-build' || 
  process.env.NEXT_PHASE === 'phase-development-build' ||
  process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === undefined ||
  process.env.BUILD_ID !== undefined || // Vercel build ID
  process.env.VERCEL_ENV !== undefined || // Vercel environment
  process.env.CI === 'true' || // CI environment
  process.env.BUILD_TIME === 'true'

// Create a comprehensive mock database that completely avoids Prisma during build
const createMockDb = () => ({
  user: {
    findMany: async () => [],
    findUnique: async () => null,
    findFirst: async () => null,
    create: async () => null,
    update: async () => null,
    delete: async () => null,
    count: async () => 0,
    findManyRaw: async () => [],
    queryRaw: async () => [],
    aggregate: async () => ({ _count: 0 }),
    groupBy: async () => [],
  },
  product: {
    findMany: async () => [],
    findUnique: async () => null,
    findFirst: async () => null,
    create: async () => null,
    update: async () => null,
    delete: async () => null,
    count: async () => 0,
    findManyRaw: async () => [],
    queryRaw: async () => [],
    aggregate: async () => ({ _count: 0 }),
    groupBy: async () => [],
  },
  sale: {
    findMany: async () => [],
    findUnique: async () => null,
    findFirst: async () => null,
    create: async () => null,
    update: async () => null,
    delete: async () => null,
    count: async () => 0,
    findManyRaw: async () => [],
    queryRaw: async () => [],
    aggregate: async () => ({ _count: 0 }),
    groupBy: async () => [],
  },
  store: {
    findMany: async () => [],
    findUnique: async () => null,
    findFirst: async () => null,
    create: async () => null,
    update: async () => null,
    delete: async () => null,
    count: async () => 0,
    findManyRaw: async () => [],
    queryRaw: async () => [],
    aggregate: async () => ({ _count: 0 }),
    groupBy: async () => [],
  },
  // Add all other models with complete mock implementations
  inventory: {
    findMany: async () => [],
    findUnique: async () => null,
    findFirst: async () => null,
    create: async () => null,
    update: async () => null,
    delete: async () => null,
    count: async () => 0,
    findManyRaw: async () => [],
    queryRaw: async () => [],
    aggregate: async () => ({ _count: 0 }),
    groupBy: async () => [],
  },
  batch: {
    findMany: async () => [],
    findUnique: async () => null,
    findFirst: async () => null,
    create: async () => null,
    update: async () => null,
    delete: async () => null,
    count: async () => 0,
    findManyRaw: async () => [],
    queryRaw: async () => [],
    aggregate: async () => ({ _count: 0 }),
    groupBy: async () => [],
  },
  expense: {
    findMany: async () => [],
    findUnique: async () => null,
    findFirst: async () => null,
    create: async () => null,
    update: async () => null,
    delete: async () => null,
    count: async () => 0,
    findManyRaw: async () => [],
    queryRaw: async () => [],
    aggregate: async () => ({ _count: 0 }),
    groupBy: async () => [],
  },
  delivery: {
    findMany: async () => [],
    findUnique: async () => null,
    findFirst: async () => null,
    create: async () => null,
    update: async () => null,
    delete: async () => null,
    count: async () => 0,
    findManyRaw: async () => [],
    queryRaw: async () => [],
    aggregate: async () => ({ _count: 0 }),
    groupBy: async () => [],
  },
  // Add more models as needed...
})

// Global Prisma client instance for runtime
let prismaClient: PrismaClient | null = null

// Create a function to get the real Prisma client (only at runtime)
const getRealPrismaClient = () => {
  if (isBuildTime) {
    return null
  }
  
  if (!prismaClient) {
    try {
      prismaClient = new PrismaClient({
        datasources: {
          db: {
            url: process.env.DATABASE_URL,
          },
        },
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      })
    } catch (error) {
      console.error('Failed to create Prisma client:', error)
      return null
    }
  }
  
  return prismaClient
}

// Export the safe database instance
export const db = isBuildTime ? createMockDb() : getRealPrismaClient()

// Export a function to check if we're using mock database
export const isUsingMockDb = () => isBuildTime

// Export a function to get the real database (runtime only)
export const getRealDb = () => {
  if (isBuildTime) {
    console.warn('Attempting to access real database during build time')
    return createMockDb()
  }
  return getRealPrismaClient()
}

// Export a disconnect function for cleanup
export const disconnect = async () => {
  if (prismaClient && !isBuildTime) {
    await prismaClient.$disconnect()
    prismaClient = null
  }
}
