// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    console.log('🌱 Starting database seeding...')
    
    // First, ensure database schema exists
    try {
      const { PrismaClient } = await import('@prisma/client')
      const prisma = new PrismaClient({
        log: ['error'],
      })
      
      await prisma.$connect()
      console.log('✅ Database connected')
      
      // Test if User table exists
      try {
        await prisma.user.count()
        console.log('✅ User table already exists')
      } catch (error) {
        console.log('⚠️ User table does not exist, creating schema...')
        
        // Create User table manually
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
        console.log('✅ Created User table')
        
        // Create Store table
        await prisma.$executeRaw`
          CREATE TABLE IF NOT EXISTS "Store" (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            address TEXT NOT NULL,
            phone TEXT,
            email TEXT,
            licenseNumber TEXT,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `
        console.log('✅ Created Store table')
        
        // Create Product table
        await prisma.$executeRaw`
          CREATE TABLE IF NOT EXISTS "Product" (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            sku TEXT NOT NULL,
            category TEXT NOT NULL,
            thcContent DECIMAL(5,2),
            cbdContent DECIMAL(5,2),
            weight DECIMAL(10,2),
            unit TEXT NOT NULL,
            price DECIMAL(10,2),
            cost DECIMAL(10,2),
            tags TEXT,
            storeId TEXT NOT NULL,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `
        console.log('✅ Created Product table')
        
        // Create Inventory table
        await prisma.$executeRaw`
          CREATE TABLE IF NOT EXISTS "Inventory" (
            id TEXT PRIMARY KEY,
            productId TEXT NOT NULL,
            storeId TEXT NOT NULL,
            quantity INTEGER NOT NULL DEFAULT 0,
            reserved INTEGER NOT NULL DEFAULT 0,
            available INTEGER NOT NULL DEFAULT 0,
            reorderLevel INTEGER NOT NULL DEFAULT 10,
            maxStock INTEGER NOT NULL DEFAULT 100,
            location TEXT,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `
        console.log('✅ Created Inventory table')
      }
      
      await prisma.$disconnect()
    } catch (error) {
      console.error('❌ Schema creation failed:', error)
    }
    
    // Now proceed with seeding
    const dbInstance = await db

    // Check if users already exist
    const existingUsers = await dbInstance.user.count().catch(() => 0)
    if (existingUsers > 0) {
      console.log(`✅ Database already seeded with ${existingUsers} users`)
      return NextResponse.json(
        { message: 'Database already seeded', userCount: existingUsers },
        { status: 200 }
      )
    }

    console.log('📦 Creating demo store...')
    // Create a demo store first
    let store;
    try {
      store = await dbInstance.store.create({
        data: {
          id: 'demo-store',
          name: 'Toronto Main Dispensary',
          address: '123 Queen Street West, Toronto, ON M5H 2N2',
          phone: '+1 (416) 555-0123',
          email: 'info@torontomain.com',
          licenseNumber: 'LIC-2024-ON-001',
          storeId: 'demo-store'
        }
      })
      console.log('✅ Store created:', store.name)
    } catch (error) {
      console.error('❌ Failed to create store:', error)
      // Try to find existing store
      store = await dbInstance.store.findUnique({ where: { id: 'demo-store' } })
      if (!store) {
        return NextResponse.json(
          { error: 'Failed to create store', details: error.message },
          { status: 500 }
        )
      }
    }

    console.log('👥 Creating demo users...')
    // Hash the password
    const hashedPassword = await bcrypt.hash('demo123', 10)

    // Create demo users
    const users = []
    const userConfigs = [
      {
        email: 'admin@cannabisos.com',
        name: 'Admin User',
        role: 'ADMIN',
        storeId: store.id
      },
      {
        email: 'manager@cannabisos.com',
        name: 'John Doe',
        role: 'MANAGER',
        storeId: store.id
      },
      {
        email: 'staff@cannabisos.com',
        name: 'Jane Smith',
        role: 'STAFF',
        storeId: store.id
      },
      {
        email: 'driver@cannabisos.com',
        name: 'Mike Johnson',
        role: 'DRIVER',
        storeId: store.id,
        phone: '+1 (416) 555-0456'
      }
    ]

    for (const userConfig of userConfigs) {
      try {
        const user = await dbInstance.user.create({
          data: {
            ...userConfig,
            password: hashedPassword,
            isActive: true
          }
        })
        users.push(user)
        console.log(`✅ Created user: ${user.email} (${user.role})`)
      } catch (error) {
        console.error(`❌ Failed to create user ${userConfig.email}:`, error)
        // Continue with other users
      }
    }

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Failed to create any users' },
        { status: 500 }
      )
    }

    console.log('📦 Creating demo products...')
    // Create demo products
    const products = []
    const productConfigs = [
      {
        name: 'Blue Dream',
        description: 'Balanced hybrid, sweet berry aroma',
        sku: 'BD-001',
        category: 'FLOWER',
        thcContent: 18.5,
        cbdContent: 0.2,
        weight: 3.5,
        unit: 'g',
        price: 35.00,
        cost: 15.00,
        tags: JSON.stringify(['popular', 'hybrid', 'daytime']),
        storeId: store.id
      },
      {
        name: 'OG Kush',
        description: 'Classic indica, earthy pine flavor',
        sku: 'OGK-001',
        category: 'FLOWER',
        thcContent: 22.0,
        cbdContent: 0.1,
        weight: 3.5,
        unit: 'g',
        price: 40.00,
        cost: 18.00,
        tags: JSON.stringify(['indica', 'nighttime', 'potent']),
        storeId: store.id
      }
    ]

    for (const productConfig of productConfigs) {
      try {
        const product = await dbInstance.product.create({
          data: productConfig
        })
        products.push(product)
        console.log(`✅ Created product: ${product.name}`)

        // Create inventory for each product
        await dbInstance.inventory.create({
          data: {
            productId: product.id,
            storeId: store.id,
            quantity: 50,
            reserved: 0,
            available: 50,
            reorderLevel: 10,
            maxStock: 100,
            location: 'Main Display'
          }
        })
        console.log(`✅ Created inventory for ${product.name}`)
      } catch (error) {
        console.error(`❌ Failed to create product ${productConfig.name}:`, error)
      }
    }

    console.log('🎉 Database seeding completed successfully!')

    return NextResponse.json({
      message: 'Database schema created and seeded successfully',
      users: users.map(user => ({
        email: user.email,
        role: user.role,
        name: user.name
      })),
      store: store.name,
      products: products.length,
      totalUsers: users.length,
      totalProducts: products.length
    })

  } catch (error) {
    console.error('❌ Seed error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to seed database', 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  } finally {
    await db.$disconnect()
  }
}

export async function GET(request: NextRequest) {
  try {
    await db.$connect()
    const userCount = await db.user.count().catch(() => 0)
    
    return NextResponse.json({
      message: 'Database check',
      userCount,
      isSeeded: userCount > 0,
      databaseUrl: process.env.DATABASE_URL ? 'Configured' : 'Missing',
      prismaClient: 'Loaded',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Database check error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to check database', 
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  } finally {
    await db.$disconnect()
  }
}