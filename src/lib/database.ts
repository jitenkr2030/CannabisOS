import { PrismaClient } from '@prisma/client';

// Global variable to prevent multiple instances
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
};

// Create Prisma client instance with proper configuration
const createPrismaClient = () => {
  // For static generation, return null
  if (typeof window !== 'undefined') {
    return null as any;
  }

  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.warn('DATABASE_URL is not defined in environment variables');
    return null as any;
  }

  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  } catch (error) {
    console.error('Failed to initialize Prisma client:', error);
    return null as any;
  }
};

// Export singleton instance
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Prevent multiple instances in development
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Export for compatibility
export { prisma as db };

// Export for mock detection
export const isUsingMockDb = false;

// Export the PrismaClient type
export type { PrismaClient };

// Export the client instance
export default prisma;
