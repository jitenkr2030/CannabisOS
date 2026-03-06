// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Checking Neon database connection...')
    
    // Test 1: Environment Variables
    const envCheck = {
      DATABASE_URL: process.env.DATABASE_URL ? 'Present' : 'Missing',
      DATABASE_URL_LENGTH: process.env.DATABASE_URL ? process.env.DATABASE_URL.length : 0,
      NODE_ENV: process.env.NODE_ENV || 'Not set'
    }

    // Test 2: Prisma Client Connection
    let prismaConnection = 'Failed'
    let dbQuery = 'Failed'
    let dbTables = 'Not checked'
    
    try {
      const { PrismaClient } = await import('@prisma/client')
      const prisma = new PrismaClient({
        log: ['error'],
      })
      
      await prisma.$connect()
      prismaConnection = 'Success'
      
      // Test 3: Simple Query
      await prisma.$queryRaw`SELECT 1 as test`
      dbQuery = 'Success'
      
      // Test 4: Check if User table exists
      try {
        await prisma.user.count()
        dbTables = 'Exists'
      } catch (error) {
        dbTables = `Missing: ${error.message}`
      }
      
      await prisma.$disconnect()
      
    } catch (error) {
      console.error('Database connection error:', error)
    }

    // Test 5: Extract Neon connection details
    let neonDetails = 'Unknown'
    if (process.env.DATABASE_URL) {
      try {
        const url = new URL(process.env.DATABASE_URL)
        neonDetails = {
          host: url.hostname,
          protocol: url.protocol,
          database: url.pathname.split('/')[1] || 'Unknown'
        }
      } catch (error) {
        neonDetails = `Parse error: ${error.message}`
      }
    }

    return NextResponse.json({
      message: 'Neon Database Connection Check',
      connection: {
        environment: envCheck,
        prisma: {
          connection: prismaConnection,
          query: dbQuery,
          tables: dbTables
        },
        neon: neonDetails
      },
      status: {
        overall: prismaConnection === 'Success' && dbQuery === 'Success' ? 'Connected' : 'Failed',
        database: prismaConnection,
        query: dbQuery,
        tables: dbTables
      },
      recommendations: {
        next: prismaConnection === 'Success' && dbQuery === 'Success' 
          ? 'Database connected - Check login functionality' 
          : 'Fix database connection issues',
        tables: dbTables === 'Exists' 
          ? 'Tables exist - Check user accounts' 
          : 'Run database migration to create tables'
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Diagnostic error:', error)
    return NextResponse.json(
      { 
        error: 'Diagnostic failed', 
        details: error.message 
      },
      { status: 500 }
    )
  }
}