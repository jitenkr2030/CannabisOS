// Simple database connection for Prisma 6.x - ULTRA SIMPLE
import { PrismaClient } from '@prisma/client'

// Just create the client - nothing else needed for Prisma 6.x
export const db = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

// That's it. No global variables, no complex logic, no error handling.
// Just a simple PrismaClient() call.