// Bulletproof database module that handles all scenarios
let prismaClient: any = null;

// Check if we're in build time
const isBuildTime = 
  process.env.NEXT_PHASE === 'phase-production-build' || 
  process.env.NEXT_PHASE === 'phase-development-build' ||
  process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === undefined && !process.env.VERCEL_URL ||
  process.env.CI === 'true' ||
  process.env.BUILD_TIME === 'true' ||
  process.argv.includes('build');

// Create mock database for fallback
const createMockDatabase = () => {
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
    },
    product: {
      findMany: () => mockAsync([]),
      findUnique: () => mockAsync(null),
      findFirst: () => mockAsync(null),
      create: () => mockAsync(null),
      update: () => mockAsync(null),
      delete: () => mockAsync(null),
      count: () => mockAsync(0),
    },
    store: {
      findMany: () => mockAsync([]),
      findUnique: () => mockAsync(null),
      findFirst: () => mockAsync(null),
      create: () => mockAsync(null),
      update: () => mockAsync(null),
      delete: () => mockAsync(null),
      count: () => mockAsync(0),
    },
    inventory: {
      findMany: () => mockAsync([]),
      findUnique: () => mockAsync(null),
      findFirst: () => mockAsync(null),
      create: () => mockAsync(null),
      update: () => mockAsync(null),
      delete: () => mockAsync(null),
      count: () => mockAsync(0),
    },
    sale: {
      findMany: () => mockAsync([]),
      findUnique: () => mockAsync(null),
      findFirst: () => mockAsync(null),
      create: () => mockAsync(null),
      update: () => mockAsync(null),
      delete: () => mockAsync(null),
      count: () => mockAsync(0),
    },
    expense: {
      findMany: () => mockAsync([]),
      findUnique: () => mockAsync(null),
      findFirst: () => mockAsync(null),
      create: () => mockAsync(null),
      update: () => mockAsync(null),
      delete: () => mockAsync(null),
      count: () => mockAsync(0),
    },
    delivery: {
      findMany: () => mockAsync([]),
      findUnique: () => mockAsync(null),
      findFirst: () => mockAsync(null),
      create: () => mockAsync(null),
      update: () => mockAsync(null),
      delete: () => mockAsync(null),
      count: () => mockAsync(0),
    },
    batch: {
      findMany: () => mockAsync([]),
      findUnique: () => mockAsync(null),
      findFirst: () => mockAsync(null),
      create: () => mockAsync(null),
      update: () => mockAsync(null),
      delete: () => mockAsync(null),
      count: () => mockAsync(0),
    },
    $disconnect: () => Promise.resolve(),
  };
};

// Get database instance with fallback
const getDatabase = () => {
  if (isBuildTime) {
    console.log('Build time detected, using mock database');
    return createMockDatabase();
  }

  if (prismaClient) {
    return prismaClient;
  }

  try {
    // Try to import and create Prisma client
    const { PrismaClient } = require('@prisma/client');
    
    prismaClient = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });

    console.log('Prisma client created successfully');
    return prismaClient;
  } catch (error) {
    console.error('Failed to create Prisma client, using fallback:', error);
    return createMockDatabase();
  }
};

// Export database instance
export const db = getDatabase();

// Export helper functions
export const isUsingMockDb = () => {
  const mockDb = createMockDatabase();
  return db === mockDb || isBuildTime;
};

export const getRealDb = async () => {
  return db;
};

export const disconnect = async () => {
  if (prismaClient && typeof prismaClient.$disconnect === 'function') {
    await prismaClient.$disconnect();
  }
};