// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Testing database connection...')
    
    // Test 1: Check environment variables
    const envCheck = {
      DATABASE_URL: process.env.DATABASE_URL ? 'Present' : 'Missing',
      JWT_SECRET: process.env.JWT_SECRET ? 'Present' : 'Missing',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL ? 'Present' : 'Missing',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Present' : 'Missing',
    }

    // Test 2: Try to import and use Prisma
    let prismaTest = 'Failed'
    let dbConnection = 'Failed'
    let userTable = 'Failed'
    
    try {
      const { PrismaClient } = await import('@prisma/client')
      const prisma = new PrismaClient({
        log: ['error'],
      })
      
      await prisma.$connect()
      dbConnection = 'Success'
      
      // Test 3: Try a simple query
      await prisma.$queryRaw`SELECT 1`
      prismaTest = 'Success'
      
      // Test 4: Check if User table exists
      try {
        await prisma.user.count()
        userTable = 'Exists'
      } catch (error) {
        userTable = `Error: ${error.message}`
      }
      
      await prisma.$disconnect()
    } catch (error) {
      console.error('Database test failed:', error)
    }

    return NextResponse.json({
      message: 'Database Connection Test',
      tests: {
        environment: envCheck,
        prismaClient: prismaTest,
        databaseConnection: dbConnection,
        userTable: userTable,
      },
      status: dbConnection === 'Success' && prismaTest === 'Success' ? 'Working' : 'Failed',
      recommendations: dbConnection === 'Success' 
        ? 'Database connection is working' 
        : 'Check DATABASE_URL and database schema',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Test API error:', error)
    return NextResponse.json(
      { 
        error: 'Test failed', 
        details: error.message 
      },
      { status: 500 }
    )
  }
}