// Re-export the production-ready database as the default db
export { db, isUsingMockDb, getRealDb, disconnect } from './db-production'

// Also export the types for convenience
export type { PrismaClient } from '@prisma/client'
