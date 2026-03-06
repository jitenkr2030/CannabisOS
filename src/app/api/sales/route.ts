import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get('storeId')
    const period = searchParams.get('period') || 'month'
    const userId = searchParams.get('userId')

    // Calculate date range
    const now = new Date()
    let startDate = new Date()
    
    switch (period) {
      case 'day':
        startDate.setDate(now.getDate() - 1)
        break
      case 'week':
        startDate.setDate(now.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(now.getMonth() - 1)
        break
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3)
        break
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1)
        break
    }

    const where: any = {
      createdAt: { gte: startDate }
    }
    if (storeId) where.storeId = storeId
    if (userId) where.userId = userId

    const sales = await prisma.sale.findMany({
      where,
      include: {
        items: {
          include: {
            product: {
              select: { name: true, sku: true, category: true }
            }
          }
        },
        user: {
          select: { name: true, email: true, role: true }
        },
        store: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Calculate sales metrics
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0)
    const totalTax = sales.reduce((sum, sale) => sum + sale.tax, 0)
    const averageOrderValue = sales.length > 0 ? totalRevenue / sales.length : 0

    // Sales by payment method
    const paymentMethodStats = sales.reduce((acc, sale) => {
      acc[sale.paymentMethod] = (acc[sale.paymentMethod] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Sales by status
    const statusStats = sales.reduce((acc, sale) => {
      acc[sale.status] = (acc[sale.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Top products
    const productSales = new Map()
    sales.forEach(sale => {
      sale.items.forEach(item => {
        const current = productSales.get(item.productId) || { quantity: 0, revenue: 0 }
        productSales.set(item.productId, {
          quantity: current.quantity + item.quantity,
          revenue: current.revenue + item.total
        })
      })
    })

    const topProducts = Array.from(productSales.entries())
      .map(([productId, data]) => ({
        productId,
        quantity: data.quantity,
        revenue: data.revenue
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)

    // Get product details
    const topProductsWithDetails = await Promise.all(
      topProducts.map(async (product) => {
        const productDetails = await prisma.product.findUnique({
          where: { id: product.productId }
        })
        return {
          ...product,
          name: productDetails?.name || 'Unknown',
          sku: productDetails?.sku || '',
          category: productDetails?.category || 'OTHER'
        }
      })
    )

    // Daily sales data
    const dailySales = []
    const currentDate = new Date(startDate)
    
    while (currentDate <= now) {
      const dayStart = new Date(currentDate)
      const dayEnd = new Date(currentDate)
      dayEnd.setHours(23, 59, 59, 999)

      const daySalesData = sales.filter(sale => 
        sale.createdAt >= dayStart && sale.createdAt <= dayEnd
      )
      const dayRevenue = daySalesData.reduce((sum, sale) => sum + sale.total, 0)
      const dayOrders = daySalesData.length

      dailySales.push({
        date: dayStart.toISOString().split('T')[0],
        revenue: dayRevenue,
        orders: dayOrders
      })

      currentDate.setDate(currentDate.getDate() + 1)
    }

    return NextResponse.json({
      sales,
      metrics: {
        totalRevenue,
        totalTax,
        averageOrderValue,
        totalSales: sales.length,
        paymentMethodStats,
        statusStats
      },
      topProducts: topProductsWithDetails,
      dailySales
    })

  } catch (error) {
    console.error('Sales API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sales data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      customerName, 
      customerPhone, 
      customerEmail, 
      items, 
      paymentMethod = 'CASH',
      storeId,
      userId,
      notes,
      ageVerified = false
    } = body

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
    const tax = subtotal * 0.1 // 10% tax rate
    const total = subtotal + tax

    // Generate receipt number
    const receiptNumber = `RCP-${Date.now()}-${Math.floor(Math.random() * 1000)}`

    // Create sale
    const sale = await prisma.sale.create({
      data: {
        receiptNumber,
        customerName,
        customerPhone,
        customerEmail,
        subtotal,
        tax,
        total,
        paymentMethod,
        notes,
        ageVerified,
        storeId,
        userId
      },
      include: {
        items: true
      }
    })

    // Create sale items
    for (const item of items) {
      await prisma.saleItem.create({
        data: {
          saleId: sale.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.quantity * item.unitPrice
        }
      })

      // Update inventory
      const inventory = await prisma.inventory.findFirst({
        where: { productId: item.productId }
      })

      if (inventory) {
        await prisma.inventory.update({
          where: { id: inventory.id },
          data: {
            quantity: Math.max(0, inventory.quantity - item.quantity),
            reserved: Math.max(0, inventory.reserved - item.quantity)
          }
        })

        // Create stock movement
        await prisma.stockMovement.create({
          data: {
            type: 'SALE',
            quantity: -item.quantity,
            inventoryId: inventory.id,
            userId,
            reference: sale.id,
            reason: 'Sale transaction'
          }
        })
      }
    }

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'CREATE',
        entity: 'Sale',
        entityId: sale.id,
        newValues: { receiptNumber, total, customerName },
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userId
      }
    })

    return NextResponse.json({
      message: 'Sale created successfully',
      sale
    })

  } catch (error) {
    console.error('Create sale error:', error)
    return NextResponse.json(
      { error: 'Failed to create sale' },
      { status: 500 }
    )
  }
}