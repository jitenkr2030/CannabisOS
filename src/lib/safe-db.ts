// Safe database connection utility
import { prisma } from '@/lib/database'

// Safe database connection with error handling
export const safeDb = {
  async connect() {
    try {
      await prisma.$connect()
      return true
    } catch (error) {
      console.error('Database connection error:', error)
      return false
    }
  },
  
  async disconnect() {
    try {
      await prisma.$disconnect()
      return true
    } catch (error) {
      console.error('Database disconnection error:', error)
      return false
    }
  },
  
  async healthCheck() {
    try {
      await prisma.$queryRaw`SELECT 1`
      return true
    } catch (error) {
      console.error('Database health check error:', error)
      return false
    }
  }
}

// Export the prisma client for backward compatibility
export { prisma } from '@/lib/database'
export default prisma
