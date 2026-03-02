// Completely Prisma-free database module for build time
// This module completely avoids any Prisma imports during build

// Build-time detection with accurate detection methods
const isBuildTime = 
  process.env.NEXT_PHASE === 'phase-production-build' || 
  process.env.NEXT_PHASE === 'phase-development-build' ||
  process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === undefined && !process.env.VERCEL_URL ||
  process.env.CI === 'true' || // CI environment
  process.env.BUILD_TIME === 'true' ||
  process.argv.includes('build') || // Next.js build command
  (typeof window === 'undefined' && process.env.NEXT_RUNTIME === 'edge') // Edge runtime build

// Create a completely Prisma-free mock database
const createPrismaFreeMockDb = () => {
  const mockAsync = <T>(value: T): Promise<T> => Promise.resolve(value);
  
  return {
    user: {
      findMany: () => mockAsync([]),
      findUnique: () => mockAsync(null),
      findFirst: () => mockAsync(null),
      create: () => mockAsync(null),
      update: () => mockAsync(null),
      delete: () => mockAsync(null),
      count: () => mockAsync(0),
      findManyRaw: () => mockAsync([]),
      queryRaw: () => mockAsync([]),
      aggregate: () => mockAsync({ _count: 0 }),
      groupBy: () => mockAsync([]),
    },
    product: {
      findMany: () => mockAsync([]),
      findUnique: () => mockAsync(null),
      findFirst: () => mockAsync(null),
      create: () => mockAsync(null),
      update: () => mockAsync(null),
      delete: () => mockAsync(null),
      count: () => mockAsync(0),
      findManyRaw: () => mockAsync([]),
      queryRaw: () => mockAsync([]),
      aggregate: () => mockAsync({ _count: 0 }),
      groupBy: () => mockAsync([]),
    },
    // Add all other models with the same pattern
    store: {
      findMany: () => mockAsync([]),
      findUnique: () => mockAsync(null),
      findFirst: () => mockAsync(null),
      create: () => mockAsync(null),
      update: () => mockAsync(null),
      delete: () => mockAsync(null),
      count: () => mockAsync(0),
      findManyRaw: () => mockAsync([]),
      queryRaw: () => mockAsync([]),
      aggregate: () => mockAsync({ _count: 0 }),
      groupBy: () => mockAsync([]),
    },
    inventory: {
      findMany: () => mockAsync([]),
      findUnique: () => mockAsync(null),
      findFirst: () => mockAsync(null),
      create: () => mockAsync(null),
      update: () => mockAsync(null),
      delete: () => mockAsync(null),
      count: () => mockAsync(0),
      findManyRaw: () => mockAsync([]),
      queryRaw: () => mockAsync([]),
      aggregate: () => mockAsync({ _count: 0 }),
      groupBy: () => mockAsync([]),
    },
    sale: {
      findMany: () => mockAsync([]),
      findUnique: () => mockAsync(null),
      findFirst: () => mockAsync(null),
      create: () => mockAsync(null),
      update: () => mockAsync(null),
      delete: () => mockAsync(null),
      count: () => mockAsync(0),
      findManyRaw: () => mockAsync([]),
      queryRaw: () => mockAsync([]),
      aggregate: () => mockAsync({ _count: 0 }),
      groupBy: () => mockAsync([]),
    },
    batch: {
      findMany: () => mockAsync([]),
      findUnique: () => mockAsync(null),
      findFirst: () => mockAsync(null),
      create: () => mockAsync(null),
      update: () => mockAsync(null),
      delete: () => mockAsync(null),
      count: () => mockAsync(0),
      findManyRaw: () => mockAsync([]),
      queryRaw: () => mockAsync([]),
      aggregate: () => mockAsync({ _count: 0 }),
      groupBy: () => mockAsync([]),
    },
    expense: {
      findMany: () => mockAsync([]),
      findUnique: () => mockAsync(null),
      findFirst: () => mockAsync(null),
      create: () => mockAsync(null),
      update: () => mockAsync(null),
      delete: () => mockAsync(null),
      count: () => mockAsync(0),
      findManyRaw: () => mockAsync([]),
      queryRaw: () => mockAsync([]),
      aggregate: () => mockAsync({ _count: 0 }),
      groupBy: () => mockAsync([]),
    },
    delivery: {
      findMany: () => mockAsync([]),
      findUnique: () => mockAsync(null),
      findFirst: () => mockAsync(null),
      create: () => mockAsync(null),
      update: () => mockAsync(null),
      delete: () => mockAsync(null),
      count: () => mockAsync(0),
      findManyRaw: () => mockAsync([]),
      queryRaw: () => mockAsync([]),
      aggregate: () => mockAsync({ _count: 0 }),
      groupBy: () => mockAsync([]),
    },
    // Add all other models...
  };
};

// Runtime Prisma client (only loaded when not in build time)
let runtimePrismaClient: any = null;

// Lazy load Prisma only at runtime
const getRuntimePrismaClient = async () => {
  if (isBuildTime) {
    return null;
  }
  
  if (!runtimePrismaClient) {
    try {
      // Dynamic import to avoid loading Prisma during build
      const { PrismaClient } = await import('@prisma/client');
      
      runtimePrismaClient = new PrismaClient({
        datasources: {
          db: {
            url: process.env.DATABASE_URL,
          },
        },
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      });
      return runtimePrismaClient;
    } catch (error) {
      console.error('Failed to load Prisma client:', error);
      return createPrismaFreeMockDb();
    }
  }
  
  return runtimePrismaClient;
};

// Export the database instance
export const db = isBuildTime ? createPrismaFreeMockDb() : getRuntimePrismaClient();

// Export helper functions
export const isUsingMockDb = () => isBuildTime;

export const getRealDb = async () => {
  if (isBuildTime) {
    return createPrismaFreeMockDb();
  }
  
  const client = await getRuntimePrismaClient();
  return client || createPrismaFreeMockDb();
};

export const disconnect = async () => {
  if (runtimePrismaClient && !isBuildTime) {
    await runtimePrismaClient.$disconnect();
    runtimePrismaClient = null;
  }
};
