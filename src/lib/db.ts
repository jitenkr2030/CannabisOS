// Use real database connection - no mock fallbacks
export { db, isUsingMockDb, getRealDb, disconnect } from './db-real'

// Also export the types for convenience
export type { PrismaClient } from '@prisma/client'
