// Re-export the bulletproof database as the default db
export { db, isUsingMockDb, getRealDb, disconnect } from './db-bulletproof'

// Also export the types for convenience
export type { PrismaClient } from '@prisma/client'
