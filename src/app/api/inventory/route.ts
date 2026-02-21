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
    const lowStock = searchParams.get('lowStock') === 'true'

    const inventory = await db.inventory.findMany({
      where: {
        storeId,
        ...(lowStock && {
          OR: [
            {
              available: {
                lt: db.inventory.fields.reorderLevel
              }
            },
            {
              quantity: {
                lt: 5
              }
            }
          ]
        })
      },
      include: {
        product: true,
        batch: true
      }
    })

    return NextResponse.json({ inventory })

  } catch (error) {
    console.error('Inventory fetch error:', error)
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
    const { productId, quantity, type, reason, batchId } = data

    // Find or create inventory record
    let inventory = await db.inventory.findFirst({
      where: {
        productId,
        storeId: user.storeId
      }
    })

    if (!inventory) {
      inventory = await db.inventory.create({
        data: {
          productId,
          storeId: user.storeId,
          quantity: 0,
          available: 0,
          reorderLevel: 10
        }
      })
    }

    // Update quantity based on movement type
    let newQuantity = inventory.quantity
    if (type === 'PURCHASE' || type === 'TRANSFER_IN' || type === 'ADJUSTMENT') {
      newQuantity += quantity
    } else if (type === 'SALE' || type === 'TRANSFER_OUT' || type === 'DAMAGE' || type === 'RETURN' || type === 'EXPIRED') {
      newQuantity -= quantity
    }

    // Update inventory
    const updatedInventory = await db.inventory.update({
      where: { id: inventory.id },
      data: { 
        quantity: newQuantity,
        available: newQuantity - inventory.reserved,
        ...(batchId && { batchId })
      }
    })

    // Create stock movement
    await db.stockMovement.create({
      data: {
        inventoryId: inventory.id,
        userId: user.id,
        type: type as any,
        quantity: type === 'SALE' || type === 'TRANSFER_OUT' || type === 'DAMAGE' || type === 'RETURN' || type === 'EXPIRED' ? -quantity : quantity,
        reason,
        reference: data.reference
      }
    })

    return NextResponse.json({ inventory: updatedInventory }, { status: 200 })

  } catch (error) {
    console.error('Inventory update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}