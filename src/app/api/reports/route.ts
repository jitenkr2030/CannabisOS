import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reportType = searchParams.get('type') || 'sales'
    const period = searchParams.get('period') || 'month'
    const format = searchParams.get('format') || 'json'
    const storeId = searchParams.get('storeId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Calculate date range
    const now = new Date()
    let dateStart = new Date()
    let dateEnd = new Date()

    if (startDate && endDate) {
      dateStart = new Date(startDate)
      dateEnd = new Date(endDate)
    } else {
      switch (period) {
        case 'day':
          dateStart.setDate(now.getDate() - 1)
          break
        case 'week':
          dateStart.setDate(now.getDate() - 7)
          break
        case 'month':
          dateStart.setMonth(now.getMonth() - 1)
          break
        case 'quarter':
          dateStart.setMonth(now.getMonth() - 3)
          break
        case 'year':
          dateStart.setFullYear(now.getFullYear() - 1)
          break
      }
    }

    const where: any = {
      createdAt: {
        gte: dateStart,
        lte: dateEnd
      }
    }
    if (storeId) where.storeId = storeId

    let reportData: any = {}

    switch (reportType) {
      case 'sales':
        reportData = await generateSalesReport(where, dateStart, dateEnd)
        break
      case 'inventory':
        reportData = await generateInventoryReport(where)
        break
      case 'customers':
        reportData = await generateCustomerReport(where, dateStart, dateEnd)
        break
      case 'staff':
        reportData = await generateStaffReport(where, dateStart, dateEnd)
        break
      case 'financial':
        reportData = await generateFinancialReport(where, dateStart, dateEnd)
        break
      case 'compliance':
        reportData = await generateComplianceReport(where, dateStart, dateEnd)
        break
      default:
        throw new Error('Invalid report type')
    }

    // Handle different export formats
    if (format === 'csv') {
      return generateCSVResponse(reportData, reportType)
    } else if (format === 'excel') {
      return generateExcelResponse(reportData, reportType)
    } else if (format === 'pdf') {
      return generatePDFResponse(reportData, reportType)
    }

    return NextResponse.json(reportData)

  } catch (error) {
    console.error('Reports API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    )
  }
}

async function generateSalesReport(where: any, dateStart: Date, dateEnd: Date) {
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

  const expenses = await prisma.expense.findMany({
    where: {
      date: {
        gte: dateStart,
        lte: dateEnd
      },
      ...(where.storeId && { storeId: where.storeId })
    },
    orderBy: { date: 'desc' }
  })

  // Calculate metrics
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0)
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const totalProfit = totalRevenue - totalExpenses
  const totalTax = sales.reduce((sum, sale) => sum + sale.tax, 0)
  const averageOrderValue = sales.length > 0 ? totalRevenue / sales.length : 0

  // Sales by payment method
  const paymentMethodStats = sales.reduce((acc, sale) => {
    acc[sale.paymentMethod] = (acc[sale.paymentMethod] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Sales by category
  const categoryStats = sales.reduce((acc, sale) => {
    sale.items.forEach(item => {
      const category = item.product?.category || 'OTHER'
      acc[category] = (acc[category] || 0) + item.total
    })
    return acc
  }, {} as Record<string, number>)

  // Daily sales breakdown
  const dailySales = []
  const currentDate = new Date(dateStart)
  
  while (currentDate <= dateEnd) {
    const dayStart = new Date(currentDate)
    const dayEnd = new Date(currentDate)
    dayEnd.setHours(23, 59, 59, 999)

    const daySalesData = sales.filter(sale => 
      sale.createdAt >= dayStart && sale.createdAt <= dayEnd
    )
    const dayRevenue = daySalesData.reduce((sum, sale) => sum + sale.total, 0)
    const dayOrders = daySalesData.length
    const dayProfit = dayRevenue - daySalesData.reduce((sum, sale) => sum + sale.tax, 0)

    dailySales.push({
      date: dayStart.toISOString().split('T')[0],
      revenue: dayRevenue,
      orders: dayOrders,
      profit: dayProfit,
      tax: daySalesData.reduce((sum, sale) => sum + sale.tax, 0)
    })

    currentDate.setDate(currentDate.getDate() + 1)
  }

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

  return {
    reportType: 'sales',
    period: {
      start: dateStart.toISOString(),
      end: dateEnd.toISOString()
    },
    summary: {
      totalRevenue,
      totalExpenses,
      totalProfit,
      totalTax,
      averageOrderValue,
      totalSales: sales.length,
      profitMargin: totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0
    },
    breakdown: {
      paymentMethods: paymentMethodStats,
      categories: categoryStats,
      dailySales
    },
    topProducts: topProductsWithDetails,
    details: {
      sales: sales.map(sale => ({
        id: sale.id,
        receiptNumber: sale.receiptNumber,
        total: sale.total,
        tax: sale.tax,
        customerName: sale.customerName,
        paymentMethod: sale.paymentMethod,
        status: sale.status,
        createdAt: sale.createdAt,
        staff: sale.user?.name,
        store: sale.store?.name,
        items: sale.items.map(item => ({
          product: item.product?.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.total
        }))
      })),
      expenses: expenses.map(expense => ({
        id: expense.id,
        description: expense.description,
        amount: expense.amount,
        category: expense.category,
        date: expense.date,
        notes: expense.notes
      }))
    }
  }
}

async function generateInventoryReport(where: any) {
  const inventory = await prisma.inventory.findMany({
    where: where.storeId ? { storeId: where.storeId } : {},
    include: {
      product: {
        select: { name: true, sku: true, category: true, price: true }
      },
      batch: {
        select: { batchNumber: true, expiryDate: true, supplier: true }
      }
    },
    orderBy: { quantity: 'asc' }
  })

  const totalValue = inventory.reduce((sum, item) => {
    return sum + (item.quantity * (item.product?.price || 0))
  }, 0)

  const lowStockItems = inventory.filter(inv => inv.quantity <= inv.reorderLevel)
  const outOfStockItems = inventory.filter(inv => inv.quantity === 0)
  const expiringItems = inventory.filter(inv => 
    inv.batch?.expiryDate && 
    new Date(inv.batch.expiryDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  )

  // Category distribution
  const categoryDistribution = inventory.reduce((acc, item) => {
    const category = item.product?.category || 'OTHER'
    acc[category] = (acc[category] || 0) + item.quantity
    return acc
  }, {} as Record<string, number>)

  return {
    reportType: 'inventory',
    summary: {
      totalItems: inventory.length,
      totalValue,
      lowStockItems: lowStockItems.length,
      outOfStockItems: outOfStockItems.length,
      expiringItems: expiringItems.length
    },
    breakdown: {
      categories: categoryDistribution,
      stockLevels: {
        normal: inventory.length - lowStockItems.length - outOfStockItems.length,
        low: lowStockItems.length,
        out: outOfStockItems.length
      }
    },
    details: inventory.map(item => ({
      id: item.id,
      product: item.product?.name,
      sku: item.product?.sku,
      category: item.product?.category,
      quantity: item.quantity,
      available: item.available,
      reorderLevel: item.reorderLevel,
      unitPrice: item.product?.price,
      totalValue: item.quantity * (item.product?.price || 0),
      location: item.location,
      batchNumber: item.batch?.batchNumber,
      expiryDate: item.batch?.expiryDate,
      supplier: item.batch?.supplier,
      lastCounted: item.lastCounted
    }))
  }
}

async function generateCustomerReport(where: any, dateStart: Date, dateEnd: Date) {
  const sales = await prisma.sale.findMany({
    where,
    select: {
      customerEmail: true,
      customerName: true,
      customerPhone: true,
      total: true,
      createdAt: true,
      receiptNumber: true
    },
    orderBy: { createdAt: 'desc' }
  })

  // Customer analytics
  const customerMap = new Map()
  sales.forEach(sale => {
    if (sale.customerEmail) {
      const current = customerMap.get(sale.customerEmail) || {
        name: sale.customerName,
        phone: sale.customerPhone,
        email: sale.customerEmail,
        totalSpent: 0,
        orderCount: 0,
        firstOrder: sale.createdAt,
        lastOrder: sale.createdAt,
        orders: []
      }
      
      current.totalSpent += sale.total
      current.orderCount += 1
      current.lastOrder = sale.createdAt
      current.orders.push({
        receiptNumber: sale.receiptNumber,
        total: sale.total,
        date: sale.createdAt
      })
      
      if (current.firstOrder > sale.createdAt) {
        current.firstOrder = sale.createdAt
      }
      
      customerMap.set(sale.customerEmail, current)
    }
  })

  const customers = Array.from(customerMap.values())
  const newCustomers = customers.filter(c => 
    new Date(c.firstOrder) >= dateStart && new Date(c.firstOrder) <= dateEnd
  )
  const repeatCustomers = customers.filter(c => c.orderCount > 1)

  // Customer segments
  const segments = {
    vip: customers.filter(c => c.totalSpent > 1000).length,
    regular: customers.filter(c => c.totalSpent > 500 && c.totalSpent <= 1000).length,
    casual: customers.filter(c => c.totalSpent <= 500).length
  }

  return {
    reportType: 'customers',
    period: {
      start: dateStart.toISOString(),
      end: dateEnd.toISOString()
    },
    summary: {
      totalCustomers: customers.length,
      newCustomers: newCustomers.length,
      repeatCustomers: repeatCustomers.length,
      customerRetentionRate: customers.length > 0 ? (repeatCustomers.length / customers.length) * 100 : 0,
      averageOrderValue: customers.length > 0 ? 
        customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.reduce((sum, c) => sum + c.orderCount, 0) : 0,
      totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0)
    },
    segments,
    details: customers.map(customer => ({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      totalSpent: customer.totalSpent,
      orderCount: customer.orderCount,
      averageOrderValue: customer.totalSpent / customer.orderCount,
      firstOrder: customer.firstOrder,
      lastOrder: customer.lastOrder,
      segment: customer.totalSpent > 1000 ? 'vip' : 
               customer.totalSpent > 500 ? 'regular' : 'casual',
      orders: customer.orders
    }))
  }
}

async function generateStaffReport(where: any, dateStart: Date, dateEnd: Date) {
  const sales = await prisma.sale.findMany({
    where,
    include: {
      user: {
        select: { id: true, name: true, email: true, role: true }
      }
    }
  })

  // Staff performance metrics
  const staffMap = new Map()
  sales.forEach(sale => {
    const staffId = sale.user?.id
    if (staffId) {
      const current = staffMap.get(staffId) || {
        id: staffId,
        name: sale.user?.name,
        email: sale.user?.email,
        role: sale.user?.role,
        totalSales: 0,
        totalRevenue: 0,
        orders: []
      }
      
      current.totalSales += 1
      current.totalRevenue += sale.total
      current.orders.push({
        receiptNumber: sale.receiptNumber,
        total: sale.total,
        date: sale.createdAt
      })
      
      staffMap.set(staffId, current)
    }
  })

  const staff = Array.from(staffMap.values())

  return {
    reportType: 'staff',
    period: {
      start: dateStart.toISOString(),
      end: dateEnd.toISOString()
    },
    summary: {
      totalStaff: staff.length,
      totalSales: staff.reduce((sum, s) => sum + s.totalSales, 0),
      totalRevenue: staff.reduce((sum, s) => sum + s.totalRevenue, 0),
      averageSalesPerStaff: staff.length > 0 ? 
        staff.reduce((sum, s) => sum + s.totalSales, 0) / staff.length : 0,
      averageRevenuePerStaff: staff.length > 0 ? 
        staff.reduce((sum, s) => sum + s.totalRevenue, 0) / staff.length : 0
    },
    details: staff.map(member => ({
      id: member.id,
      name: member.name,
      email: member.email,
      role: member.role,
      totalSales: member.totalSales,
      totalRevenue: member.totalRevenue,
      averageOrderValue: member.totalSales > 0 ? member.totalRevenue / member.totalSales : 0,
      orders: member.orders
    }))
  }
}

async function generateFinancialReport(where: any, dateStart: Date, dateEnd: Date) {
  const sales = await prisma.sale.findMany({ where })
  const expenses = await prisma.expense.findMany({
    where: {
      date: {
        gte: dateStart,
        lte: dateEnd
      },
      ...(where.storeId && { storeId: where.storeId })
    }
  })

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0)
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const totalTax = sales.reduce((sum, sale) => sum + sale.tax, 0)
  const grossProfit = totalRevenue - totalTax
  const netProfit = grossProfit - totalExpenses

  // Expense categories
  const expenseCategories = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount
    return acc
  }, {} as Record<string, number>)

  return {
    reportType: 'financial',
    period: {
      start: dateStart.toISOString(),
      end: dateEnd.toISOString()
    },
    summary: {
      totalRevenue,
      totalTax,
      grossProfit,
      totalExpenses,
      netProfit,
      grossMargin: totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0,
      netMargin: totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0
    },
    breakdown: {
      expenseCategories,
      revenue: totalRevenue,
      taxes: totalTax,
      expenses: totalExpenses
    },
    details: {
      expenses: expenses.map(expense => ({
        id: expense.id,
        description: expense.description,
        amount: expense.amount,
        category: expense.category,
        date: expense.date,
        isRecurring: expense.isRecurring
      }))
    }
  }
}

async function generateComplianceReport(where: any, dateStart: Date, dateEnd: Date) {
  const sales = await prisma.sale.findMany({
    where,
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  })

  const auditLogs = await prisma.auditLog.findMany({
    where: {
      createdAt: {
        gte: dateStart,
        lte: dateEnd
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 100
  })

  // Compliance metrics
  const totalSales = sales.length
  const ageVerifiedSales = sales.filter(sale => sale.ageVerified).length
  const complianceRate = totalSales > 0 ? (ageVerifiedSales / totalSales) * 100 : 0

  return {
    reportType: 'compliance',
    period: {
      start: dateStart.toISOString(),
      end: dateEnd.toISOString()
    },
    summary: {
      totalSales,
      ageVerifiedSales,
      complianceRate,
      auditLogEntries: auditLogs.length
    },
    details: {
      auditLogs: auditLogs.map(log => ({
        id: log.id,
        action: log.action,
        entity: log.entity,
        entityId: log.entityId,
        ipAddress: log.ipAddress,
        createdAt: log.createdAt
      }))
    }
  }
}

// Export format handlers
function generateCSVResponse(data: any, reportType: string) {
  let csv = ''
  
  switch (reportType) {
    case 'sales':
      csv = 'Date,Receipt Number,Customer,Total,Tax,Staff,Store\n'
      data.details.sales.forEach((sale: any) => {
        csv += `${sale.createdAt},${sale.receiptNumber},"${sale.customerName}",${sale.total},${sale.tax},"${sale.staff}","${sale.store}"\n`
      })
      break
    case 'inventory':
      csv = 'Product,SKU,Category,Quantity,Reorder Level,Unit Price,Total Value\n'
      data.details.forEach((item: any) => {
        csv += `"${item.product}","${item.sku}","${item.category}",${item.quantity},${item.reorderLevel},${item.unitPrice},${item.totalValue}\n`
      })
      break
    // Add more cases as needed
  }

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${reportType}-report-${new Date().toISOString().split('T')[0]}.csv"`
    }
  })
}

function generateExcelResponse(data: any, reportType: string) {
  // For now, return CSV format for Excel
  return generateCSVResponse(data, reportType)
}

function generatePDFResponse(data: any, reportType: string) {
  // For now, return JSON format for PDF
  return NextResponse.json(data)
}