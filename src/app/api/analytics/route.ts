import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get('storeId')
    const period = searchParams.get('period') || 'month'
    const role = searchParams.get('role')

    // Calculate date range based on period
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

    // Base query filter
    const where = storeId ? { storeId } : {}

    // Get sales data
    const salesData = await prisma.sale.findMany({
      where: {
        ...where,
        createdAt: {
          gte: startDate
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })

    // Get expenses data
    const expensesData = await prisma.expense.findMany({
      where: {
        ...where,
        date: {
          gte: startDate
        }
      }
    })

    // Get inventory data
    const inventoryData = await prisma.inventory.findMany({
      where: storeId ? { storeId } : {},
      include: {
        product: true
      }
    })

    // Get users data
    const usersData = await prisma.user.findMany({
      where: role ? { role } : {}
    })

    // Get deliveries data
    const deliveriesData = await prisma.delivery.findMany({
      where: {
        ...where,
        createdAt: {
          gte: startDate
        }
      },
      include: {
        items: true
      }
    })

    // Calculate metrics
    const totalRevenue = salesData.reduce((sum, sale) => sum + sale.total, 0)
    const totalExpenses = expensesData.reduce((sum, expense) => sum + expense.amount, 0)
    const totalProfit = totalRevenue - totalExpenses
    const totalSales = salesData.length
    const totalOrders = deliveriesData.length
    const completedDeliveries = deliveriesData.filter(d => d.status === 'COMPLETED').length
    const activeUsers = usersData.filter(u => u.isActive).length
    const totalInventoryValue = inventoryData.reduce((sum, inv) => {
      return sum + (inv.quantity * (inv.product?.price || 0))
    }, 0)
    const lowStockItems = inventoryData.filter(inv => inv.quantity <= inv.reorderLevel).length

    // Calculate growth rates
    const previousPeriodStart = new Date(startDate)
    previousPeriodStart.setDate(startDate.getDate() - (period === 'day' ? 1 : period === 'week' ? 7 : 30))
    
    const previousSalesData = await prisma.sale.findMany({
      where: {
        ...where,
        createdAt: {
          gte: previousPeriodStart,
          lt: startDate
        }
      }
    })

    const previousRevenue = previousSalesData.reduce((sum, sale) => sum + sale.total, 0)
    const revenueGrowth = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0

    // Prepare time series data
    const timeSeriesData = []
    const currentDate = new Date(startDate)
    
    while (currentDate <= now) {
      const dayStart = new Date(currentDate)
      const dayEnd = new Date(currentDate)
      dayEnd.setHours(23, 59, 59, 999)

      const daySales = salesData.filter(sale => 
        sale.createdAt >= dayStart && sale.createdAt <= dayEnd
      )
      const dayRevenue = daySales.reduce((sum, sale) => sum + sale.total, 0)
      const dayOrders = deliveriesData.filter(delivery => 
        delivery.createdAt >= dayStart && delivery.createdAt <= dayEnd
      ).length

      timeSeriesData.push({
        date: dayStart.toISOString().split('T')[0],
        revenue: dayRevenue,
        sales: daySales.length,
        orders: dayOrders
      })

      currentDate.setDate(currentDate.getDate() + 1)
    }

    // Top products
    const productSales = new Map()
    salesData.forEach(sale => {
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

    // Get product details for top products
    const topProductsWithDetails = await Promise.all(
      topProducts.map(async (product) => {
        const productDetails = await prisma.product.findUnique({
          where: { id: product.productId }
        })
        return {
          ...product,
          name: productDetails?.name || 'Unknown',
          sku: productDetails?.sku || ''
        }
      })
    )

    // Customer analytics
    const uniqueCustomers = new Set(salesData.map(sale => sale.customerEmail).filter(Boolean))
    const repeatCustomers = new Set()
    const customerEmails = Array.from(uniqueCustomers)

    customerEmails.forEach(email => {
      const customerSales = salesData.filter(sale => sale.customerEmail === email)
      if (customerSales.length > 1) {
        repeatCustomers.add(email)
      }
    })

    // Delivery performance metrics
    const deliveryPerformance = {
      totalDeliveries: totalOrders,
      completedDeliveries,
      completionRate: totalOrders > 0 ? (completedDeliveries / totalOrders) * 100 : 0,
      averageTime: deliveriesData
        .filter(d => d.actualTime && d.estimatedTime)
        .reduce((sum, d) => {
          const diff = d.actualTime!.getTime() - d.estimatedTime!.getTime()
          return sum + diff
        }, 0) / deliveriesData.filter(d => d.actualTime && d.estimatedTime).length
    }

    const analytics = {
      overview: {
        totalRevenue,
        totalExpenses,
        totalProfit,
        totalSales,
        totalOrders,
        activeUsers,
        totalInventoryValue,
        lowStockItems,
        revenueGrowth
      },
      timeSeries: timeSeriesData,
      topProducts: topProductsWithDetails,
      customerAnalytics: {
        totalCustomers: uniqueCustomers.size,
        repeatCustomers: repeatCustomers.size,
        customerRetentionRate: uniqueCustomers.size > 0 ? (repeatCustomers.size / uniqueCustomers.size) * 100 : 0
      },
      deliveryPerformance,
      expenses: expensesData.map(expense => ({
        id: expense.id,
        description: expense.description,
        amount: expense.amount,
        category: expense.category,
        date: expense.date
      })),
      sales: salesData.map(sale => ({
        id: sale.id,
        receiptNumber: sale.receiptNumber,
        total: sale.total,
        customerName: sale.customerName,
        createdAt: sale.createdAt,
        status: sale.status
      }))
    }

    return NextResponse.json(analytics)

  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}