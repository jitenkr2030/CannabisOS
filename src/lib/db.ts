// Re-export the build-free database as the default db
export { db, isUsingMockDb, getRealDb, disconnect } from './db-build-free'

// Also export the types for convenience
export type { PrismaClient } from '@prisma/client'
