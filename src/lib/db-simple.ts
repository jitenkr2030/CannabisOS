// Simple database connection for Prisma 6.x
import { PrismaClient } from '@prisma/client'

// Global variable to prevent multiple instances
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create Prisma client
export const db = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

// Export helper functions
export const isUsingMockDb = () => false

export const getRealDb = () => db

export const disconnect = async () => {
  await db.$disconnect()
}