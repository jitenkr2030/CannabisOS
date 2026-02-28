// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Quick database check...')
    
    // Simple database connection test
    const { PrismaClient } = await import('@prisma/client')
    
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
      log: ['error'],
    })

    // Just try to connect and disconnect
    await prisma.$connect()
    console.log('✅ Database connected!')
    
    // Try a simple query
    await prisma.$queryRaw`SELECT 1`
    console.log('✅ Database query works!')
    
    await prisma.$disconnect()

    return NextResponse.json({
      message: 'Database connection successful',
      status: 'Connected',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Database error:', error)
    return NextResponse.json(
      { 
        error: 'Database connection failed', 
        details: error.message,
        status: 'Error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  // Simple environment check
  return NextResponse.json({
    message: 'API is working',
    databaseUrl: process.env.DATABASE_URL ? 'Configured' : 'Missing',
    timestamp: new Date().toISOString()
  })
}