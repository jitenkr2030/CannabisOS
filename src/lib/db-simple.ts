// Simple database connection for Prisma 6.x - CORRECTLY SIMPLE
import { PrismaClient } from '@prisma/client'

// Create Prisma client - Prisma 6.x way (reads from schema.prisma)
export const db = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

// Export the functions that other files actually need
export const isUsingMockDb = () => false
export const getRealDb = () => db
export const disconnect = async () => {
  await db.$disconnect()
}