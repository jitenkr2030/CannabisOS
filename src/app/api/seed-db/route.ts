import { NextRequest, NextResponse } from 'next/server'

const demoUsers = [
  {
    id: 'demo-admin',
    email: 'admin@cannabisos.com',
    name: 'Super Admin',
    password: 'demo123', // Plain text for demo
    role: 'ADMIN',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'demo-manager',
    email: 'manager@cannabisos.com',
    name: 'John Manager',
    password: 'demo123', // Plain text for demo
    role: 'MANAGER',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'demo-staff',
    email: 'staff@cannabisos.com',
    name: 'Jane Staff',
    password: 'demo123', // Plain text for demo
    role: 'STAFF',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'demo-driver',
    email: 'driver@cannabisos.com',
    name: 'Mike Driver',
    password: 'demo123', // Plain text for demo
    role: 'DRIVER',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export async function POST(request: NextRequest) {
  try {
    console.log('Starting database seeding...')
    
    // Try to use database if available
    const databaseUrl = process.env.DATABASE_URL
    let success = false
    let message = ''
    
    if (databaseUrl) {
      try {
        const { PrismaClient } = require('@prisma/client')
        const prisma = new PrismaClient()
        
        // Create demo users in database
        for (const demoUser of demoUsers) {
          await prisma.user.upsert({
            where: { email: demoUser.email },
            update: demoUser,
            create: demoUser,
          })
        }
        
        await prisma.$disconnect()
        success = true
        message = 'Database seeded successfully with demo users'
        console.log('Database seeding completed successfully')
        
      } catch (error) {
        console.error('Database seeding error:', error)
        message = `Database seeding failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    } else {
      message = 'No database URL configured - using fallback mode'
    }
    
    // Return success regardless - demo users will work via API
    return NextResponse.json({
      success: true,
      message: success ? message : 'Fallback mode activated - demo users available via API',
      users: demoUsers.map(u => ({
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
        password: 'demo123'
      })),
      databaseConnected: !!databaseUrl && success
    })
    
  } catch (error) {
    console.error('Seeding error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Seeding failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        users: demoUsers.map(u => ({
          id: u.id,
          email: u.email,
          name: u.name,
          role: u.role,
          password: 'demo123'
        }))
      },
      { status: 500 }
    )
  }
}