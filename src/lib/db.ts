// Simple database connection using Prisma 6.x
export { db, isUsingMockDb, getRealDb, disconnect } from './db-simple'

// Also export the types for convenience
export type { PrismaClient } from '@prisma/client'
