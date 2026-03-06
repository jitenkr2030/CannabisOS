// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Creating database schema...')
    
    // Import Prisma and run migration
    const { PrismaClient } = await import('@prisma/client')
    
    const prisma = new PrismaClient({
      log: ['info', 'error'],
    })

    // Connect to database
    await prisma.$connect()
    console.log('✅ Connected to database')

    // Run schema creation (db push)
    try {
      // This will create the schema if it doesn't exist
      const { execSync } = await import('child_process')
      const result = execSync('npx prisma db push --accept-data-loss', { 
        cwd: process.cwd(),
        stdio: 'pipe',
        encoding: 'utf8'
      })
      console.log('📊 Prisma db push result:', result)
    } catch (error) {
      console.error('❌ Prisma db push failed:', error)
      // Try alternative approach - create tables manually
      try {
        await prisma.$executeRaw`
          CREATE TABLE IF NOT EXISTS "User" (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL,
            storeId TEXT NOT NULL,
            phone TEXT,
            isActive BOOLEAN DEFAULT true,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            lastLoginAt TIMESTAMP
          );
        `
        console.log('✅ Created User table manually')
      } catch (tableError) {
        console.error('❌ Failed to create User table:', tableError)
      }
    }

    // Test if User table now exists
    try {
      await prisma.user.count()
      console.log('✅ User table exists and is accessible')
      
      await prisma.$disconnect()
      
      return NextResponse.json({
        message: 'Database schema created successfully',
        status: 'Success',
        nextStep: 'Seed database with demo users',
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('❌ User table still not accessible:', error)
      await prisma.$disconnect()
      
      return NextResponse.json({
        error: 'Failed to create User table',
        details: error.message,
        status: 'Failed'
      }, { status: 500 })
    }

  } catch (error) {
    console.error('❌ Migration error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create database schema', 
        details: error.message 
      },
      { status: 500 }
    )
  }
}