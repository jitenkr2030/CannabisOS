// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

import { NextRequest, NextResponse } from 'next/server'
import { db, isUsingMockDb } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    // Check if using mock database
    if (isUsingMockDb()) {
      return NextResponse.json(
        { error: 'Database not available for seeding' },
        { status: 503 }
      )
    }

    const dbInstance = await db

    // Check if users already exist
    const existingUsers = await dbInstance.user.count()
    if (existingUsers > 0) {
      return NextResponse.json(
        { message: 'Database already seeded', userCount: existingUsers },
        { status: 200 }
      )
    }

    // Create a demo store
    const store = await dbInstance.store.upsert({
      where: { id: 'demo-store' },
      update: {},
      create: {
        id: 'demo-store',
        name: 'Toronto Main Dispensary',
        address: '123 Queen Street West, Toronto, ON M5H 2N2',
        phone: '+1 (416) 555-0123',
        email: 'info@torontomain.com',
        licenseNumber: 'LIC-2024-ON-001',
        storeId: 'demo-store'
      }
    })

    // Create demo users
    const hashedPassword = await bcrypt.hash('demo123', 10)

    const admin = await dbInstance.user.upsert({
      where: { email: 'admin@cannabisos.com' },
      update: {},
      create: {
        email: 'admin@cannabisos.com',
        name: 'Admin User',
        password: hashedPassword,
        role: 'ADMIN',
        storeId: store.id
      }
    })

    const manager = await dbInstance.user.upsert({
      where: { email: 'manager@cannabisos.com' },
      update: {},
      create: {
        email: 'manager@cannabisos.com',
        name: 'John Doe',
        password: hashedPassword,
        role: 'MANAGER',
        storeId: store.id
      }
    })

    const staff = await dbInstance.user.upsert({
      where: { email: 'staff@cannabisos.com' },
      update: {},
      create: {
        email: 'staff@cannabisos.com',
        name: 'Jane Smith',
        password: hashedPassword,
        role: 'STAFF',
        storeId: store.id
      }
    })

    const driver = await dbInstance.user.upsert({
      where: { email: 'driver@cannabisos.com' },
      update: {},
      create: {
        email: 'driver@cannabisos.com',
        name: 'Mike Johnson',
        password: hashedPassword,
        role: 'DRIVER',
        storeId: store.id,
        phone: '+1 (416) 555-0456'
      }
    })

    // Create a few demo products
    const products = [
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

    for (const productData of products) {
      const product = await dbInstance.product.create({
        data: productData
      })

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
    }

    return NextResponse.json({
      message: 'Database seeded successfully',
      users: {
        admin: { email: admin.email, role: admin.role },
        manager: { email: manager.email, role: manager.role },
        staff: { email: staff.email, role: staff.role },
        driver: { email: driver.email, role: driver.role }
      },
      store: store.name,
      products: products.length
    })

  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { error: 'Failed to seed database', details: error.message },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const dbInstance = await db
    const userCount = await dbInstance.user.count()
    
    return NextResponse.json({
      message: 'Database check',
      userCount,
      isSeeded: userCount > 0,
      usingMockDb: isUsingMockDb()
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to check database', details: error.message },
      { status: 500 }
    )
  }
}