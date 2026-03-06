import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect()
    
    // Check if users exist
    const userCount = await prisma.user.count()
    
    // Check database schema
    const tableCount = await prisma.$queryRaw`SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = 'public'`
    
    await prisma.$disconnect()
    
    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      userCount,
      tableCount: Number(tableCount[0]?.count) || 0,
      hasUsers: userCount > 0,
      message: userCount > 0 ? 'Database is ready' : 'Database needs seeding'
    })
  } catch (error) {
    console.error('Database health check failed:', error)
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        error: 'Database connection failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}