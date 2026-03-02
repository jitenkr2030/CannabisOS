// Database initialization utility
import { prisma } from '@/lib/database'

export async function initializeDatabase() {
  try {
    // Test database connection
    await prisma.$connect()
    console.log('Database connected successfully')
    
    // Test basic query
    await prisma.$queryRaw`SELECT 1`
    console.log('Database query test passed')
    
    return true
  } catch (error) {
    console.error('Database initialization failed:', error)
    return false
  } finally {
    await prisma.$disconnect()
  }
}

// Initialize database on module import (only in development)
if (process.env.NODE_ENV === 'development') {
  initializeDatabase()
}
