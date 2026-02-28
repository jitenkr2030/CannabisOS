// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Initializing database...')
    
    // Import Prisma dynamically to avoid build issues
    const { PrismaClient } = await import('@prisma/client')
    
    // Create Prisma client
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
      log: ['error'],
    })

    // Test database connection
    try {
      await prisma.$connect()
      console.log('✅ Database connected successfully')
    } catch (error) {
      console.error('❌ Database connection failed:', error)
      return NextResponse.json(
        { 
          error: 'Database connection failed', 
          details: error.message,
          databaseUrl: process.env.DATABASE_URL ? 'Configured' : 'Missing'
        },
        { status: 500 }
      )
    }

    // Check if we can run a simple query
    try {
      const result = await prisma.$queryRaw`SELECT 1 as test`
      console.log('✅ Database query successful:', result)
    } catch (error) {
      console.error('❌ Database query failed:', error)
      return NextResponse.json(
        { 
          error: 'Database query failed', 
          details: error.message 
        },
        { status: 500 }
      )
    }

    // Try to check if User table exists
    try {
      const userCount = await prisma.user.count()
      console.log(`✅ User table exists with ${userCount} users`)
    } catch (error) {
      console.error('❌ User table check failed:', error)
      // This might mean the table doesn't exist yet
    }

    await prisma.$disconnect()

    return NextResponse.json({
      message: 'Database initialized successfully',
      databaseUrl: process.env.DATABASE_URL ? 'Configured' : 'Missing',
      status: 'Connected',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Database initialization error:', error)
    return NextResponse.json(
      { 
        error: 'Database initialization failed', 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Test basic environment variables
    const envCheck = {
      DATABASE_URL: process.env.DATABASE_URL ? 'Configured' : 'Missing',
      JWT_SECRET: process.env.JWT_SECRET ? 'Configured' : 'Missing',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL ? 'Configured' : 'Missing',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Configured' : 'Missing',
      NODE_ENV: process.env.NODE_ENV || 'Not set'
    }

    return NextResponse.json({
      message: 'Environment check',
      envCheck,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Environment check failed', 
        details: error.message 
      },
      { status: 500 }
    )
  }
}