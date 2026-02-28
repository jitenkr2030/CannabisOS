// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const dbInstance = await db

    // Check if users already exist
    const existingUsers = await dbInstance.user.count()
    if (existingUsers > 0) {
      return NextResponse.json(
        { message: 'Database already seeded', userCount: existingUsers },
        { status: 200 }
      )
    }

    // Create a demo store first
    const store = await dbInstance.store.create({
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

    // Hash the password
    const hashedPassword = await bcrypt.hash('demo123', 10)

    // Create demo users
    const users = await Promise.all([
      dbInstance.user.create({
        data: {
          email: 'admin@cannabisos.com',
          name: 'Admin User',
          password: hashedPassword,
          role: 'ADMIN',
          storeId: store.id
        }
      }),
      dbInstance.user.create({
        data: {
          email: 'manager@cannabisos.com',
          name: 'John Doe',
          password: hashedPassword,
          role: 'MANAGER',
          storeId: store.id
        }
      }),
      dbInstance.user.create({
        data: {
          email: 'staff@cannabisos.com',
          name: 'Jane Smith',
          password: hashedPassword,
          role: 'STAFF',
          storeId: store.id
        }
      }),
      dbInstance.user.create({
        data: {
          email: 'driver@cannabisos.com',
          name: 'Mike Johnson',
          password: hashedPassword,
          role: 'DRIVER',
          storeId: store.id,
          phone: '+1 (416) 555-0456'
        }
      })
    ])

    // Create demo products
    const products = await Promise.all([
      dbInstance.product.create({
        data: {
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
        }
      }),
      dbInstance.product.create({
        data: {
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
      })
    ])

    // Create inventory for each product
    await Promise.all(
      products.map(product =>
        dbInstance.inventory.create({
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
      )
    )

    return NextResponse.json({
      message: 'Database seeded successfully',
      users: users.map(user => ({
        email: user.email,
        role: user.role,
        name: user.name
      })),
      store: store.name,
      products: products.length
    })

  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to seed database', 
        details: error.message,
        stack: error.stack 
      },
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
      databaseUrl: process.env.DATABASE_URL ? 'Configured' : 'Missing',
      prismaClient: 'Loaded'
    })
  } catch (error) {
    console.error('Database check error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to check database', 
        details: error.message,
        stack: error.stack 
      },
      { status: 500 }
    )
  }
}