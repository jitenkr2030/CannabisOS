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
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')

    const sales = await db.sale.findMany({
      where: {
        storeId,
        ...(status && { status: status as any }),
        ...(dateFrom && dateTo && {
          createdAt: {
            gte: new Date(dateFrom),
            lte: new Date(dateTo)
          }
        })
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        payments: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ sales })

  } catch (error) {
    console.error('Sales fetch error:', error)
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
    const { items, ...saleData } = data

    // Generate receipt number
    const receiptNumber = `RCP-${Date.now()}`

    const sale = await db.sale.create({
      data: {
        ...saleData,
        receiptNumber,
        storeId: user.storeId,
        userId: user.id
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })

    // Create sale items and update inventory
    for (const item of items) {
      await db.saleItem.create({
        data: {
          saleId: sale.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: item.discount || 0,
          total: item.total
        }
      })

      // Update inventory
      const inventory = await db.inventory.findFirst({
        where: {
          productId: item.productId,
          storeId: user.storeId
        }
      })

      if (inventory) {
        const newQuantity = inventory.quantity - item.quantity
        await db.inventory.update({
          where: { id: inventory.id },
          data: { 
            quantity: newQuantity,
            available: newQuantity - inventory.reserved
          }
        })

        // Create stock movement
        await db.stockMovement.create({
          data: {
            inventoryId: inventory.id,
            userId: user.id,
            type: 'SALE',
            quantity: -item.quantity,
            reason: `Sale ${sale.receiptNumber}`,
            reference: sale.id
          }
        })
      }
    }

    return NextResponse.json({ sale }, { status: 201 })

  } catch (error) {
    console.error('Sale creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}