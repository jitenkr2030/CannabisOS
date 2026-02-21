import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  
  const token = authHeader.substring(7)
  try {
    return jwt.verify(token, JWT_SECRET) as any
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get('storeId') || user.storeId
    const status = searchParams.get('status')
    const driverId = searchParams.get('driverId')

    const deliveries = await db.delivery.findMany({
      where: {
        storeId,
        ...(status && { status: status as any }),
        ...(driverId && { driverId })
      },
      include: {
        items: true,
        driver: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        },
        tracking: {
          orderBy: { timestamp: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ deliveries })

  } catch (error) {
    console.error('Deliveries fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const { items, ...deliveryData } = data

    // Generate order number
    const orderNumber = `ORD-${Date.now()}`

    const delivery = await db.delivery.create({
      data: {
        ...deliveryData,
        orderNumber,
        storeId: user.storeId
      }
    })

    // Create delivery items
    for (const item of items) {
      await db.deliveryItem.create({
        data: {
          deliveryId: delivery.id,
          productName: item.productName,
          quantity: item.quantity,
          thcContent: item.thcContent,
          cbdContent: item.cbdContent,
          notes: item.notes
        }
      })
    }

    // Create initial tracking
    await db.deliveryTracking.create({
      data: {
        deliveryId: delivery.id,
        status: 'PENDING',
        notes: 'Order created'
      }
    })

    const fullDelivery = await db.delivery.findUnique({
      where: { id: delivery.id },
      include: {
        items: true,
        driver: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        },
        tracking: {
          orderBy: { timestamp: 'desc' }
        }
      }
    })

    return NextResponse.json({ delivery: fullDelivery }, { status: 201 })

  } catch (error) {
    console.error('Delivery creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Update delivery status
export async function PUT(request: NextRequest) {
  try {
    const user = verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const { deliveryId, status, location, notes } = data

    // Update delivery status
    const delivery = await db.delivery.update({
      where: { id: deliveryId },
      data: { 
        status,
        ...(status === 'DELIVERED' && { actualTime: new Date() }),
        ...(user.role === 'DRIVER' && { driverId: user.id })
      }
    })

    // Add tracking entry
    await db.deliveryTracking.create({
      data: {
        deliveryId,
        status: status as any,
        location,
        notes
      }
    })

    return NextResponse.json({ delivery })

  } catch (error) {
    console.error('Delivery update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}