// Simple database connection for Prisma 6.x - CORRECTED
import { PrismaClient } from '@prisma/client'

// Global variable to prevent multiple instances
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create Prisma client - PRISMA 6.x WAY (reads from schema.prisma)
export const db = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

// Export helper functions
export const isUsingMockDb = () => false

export const getRealDb = () => db

export const disconnect = async () => {
  await db.$disconnect()
}