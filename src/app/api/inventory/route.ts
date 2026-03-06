import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get('storeId')
    const lowStock = searchParams.get('lowStock')
    const category = searchParams.get('category')

    // Build where clause
    const where: any = {}
    if (storeId) where.storeId = storeId
    if (lowStock === 'true') {
      where.quantity = { lte: prisma.inventory.fields.reorderLevel }
    }

    const inventory = await prisma.inventory.findMany({
      where,
      include: {
        product: {
          include: {
            category: true
          }
        },
        batch: {
          select: {
            batchNumber: true,
            expiryDate: true,
            supplier: true
          }
        }
      },
      orderBy: { quantity: 'asc' }
    })

    // Calculate inventory statistics
    const totalValue = inventory.reduce((sum, item) => {
      return sum + (item.quantity * (item.product?.price || 0))
    }, 0)

    const lowStockItems = inventory.filter(item => 
      item.quantity <= item.reorderLevel
    )

    const outOfStockItems = inventory.filter(item => item.quantity === 0)

    const expiringItems = inventory.filter(item => 
      item.batch?.expiryDate && 
      new Date(item.batch.expiryDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    )

    // Category distribution
    const categoryDistribution = inventory.reduce((acc, item) => {
      const category = item.product?.category || 'OTHER'
      acc[category] = (acc[category] || 0) + item.quantity
      return acc
    }, {} as Record<string, number>)

    return NextResponse.json({
      inventory,
      statistics: {
        totalItems: inventory.length,
        totalValue,
        lowStockItems: lowStockItems.length,
        outOfStockItems: outOfStockItems.length,
        expiringItems: expiringItems.length,
        categoryDistribution
      }
    })

  } catch (error) {
    console.error('Inventory API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch inventory data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, quantity, storeId, location, reorderLevel, batchId } = body

    // Check if inventory item already exists for this product
    const existingInventory = await prisma.inventory.findFirst({
      where: { productId, storeId }
    })

    let inventory
    if (existingInventory) {
      // Update existing inventory
      inventory = await prisma.inventory.update({
        where: { id: existingInventory.id },
        data: {
          quantity: existingInventory.quantity + quantity,
          lastCounted: new Date()
        }
      })
    } else {
      // Create new inventory item
      inventory = await prisma.inventory.create({
        data: {
          productId,
          quantity,
          available: quantity,
          storeId,
          location,
          reorderLevel: reorderLevel || 10,
          batchId,
          lastCounted: new Date()
        }
      })
    }

    // Create stock movement record
    await prisma.stockMovement.create({
      data: {
        type: 'RESTOCK',
        quantity,
        inventoryId: inventory.id,
        userId: 'system', // This should come from authenticated user
        reason: 'Inventory restock'
      }
    })

    return NextResponse.json({
      message: 'Inventory updated successfully',
      inventory
    })

  } catch (error) {
    console.error('Inventory update error:', error)
    return NextResponse.json(
      { error: 'Failed to update inventory' },
      { status: 500 }
    )
  }
}