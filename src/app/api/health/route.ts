import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db-simple'

export const fetchCache = 'force-no-store'

export async function GET(request: NextRequest) {
  try {
    // Test database connection with a simple query
    await db.$queryRaw`SELECT 1`
    
    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      message: 'Database connection successful'
    })
  } catch (error) {
    console.error('Health check failed:', error)
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