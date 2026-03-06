import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const entityType = searchParams.get('entity') // sales, inventory, customers, users, deliveries
    const query = searchParams.get('query')
    const filters = searchParams.get('filters') // JSON string of filter criteria
    const sortBy = searchParams.get('sortBy')
    const sortOrder = searchParams.get('sortOrder') || 'asc'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    let results: any = []
    let totalCount = 0

    // Parse filters
    let filterCriteria: any = {}
    if (filters) {
      try {
        filterCriteria = JSON.parse(filters)
      } catch (error) {
        console.error('Invalid filters JSON:', error)
      }
    }

    switch (entityType) {
      case 'sales':
        ({ results, totalCount } = await searchSales(query, filterCriteria, sortBy, sortOrder, page, limit))
        break
      case 'inventory':
        ({ results, totalCount } = await searchInventory(query, filterCriteria, sortBy, sortOrder, page, limit))
        break
      case 'customers':
        ({ results, totalCount } = await searchCustomers(query, filterCriteria, sortBy, sortOrder, page, limit))
        break
      case 'users':
        ({ results, totalCount } = await searchUsers(query, filterCriteria, sortBy, sortOrder, page, limit))
        break
      case 'deliveries':
        ({ results, totalCount } = await searchDeliveries(query, filterCriteria, sortBy, sortOrder, page, limit))
        break
      case 'products':
        ({ results, totalCount } = await searchProducts(query, filterCriteria, sortBy, sortOrder, page, limit))
        break
      default:
        throw new Error('Invalid entity type')
    }

    return NextResponse.json({
      results,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page * limit < totalCount,
        hasPrev: page > 1
      },
      filters: filterCriteria,
      query,
      entityType
    })

  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }
}

async function searchSales(
  query: string | null,
  filters: any,
  sortBy: string | null,
  sortOrder: string,
  page: number,
  limit: number
) {
  const where: any = {}

  // Text search
  if (query) {
    where.OR = [
      { receiptNumber: { contains: query, mode: 'insensitive' } },
      { customerName: { contains: query, mode: 'insensitive' } },
      { customerEmail: { contains: query, mode: 'insensitive' } },
      { customerPhone: { contains: query, mode: 'insensitive' } },
      { notes: { contains: query, mode: 'insensitive' } }
    ]
  }

  // Apply filters
  if (filters.dateRange) {
    where.createdAt = {
      gte: new Date(filters.dateRange.start),
      lte: new Date(filters.dateRange.end)
    }
  }

  if (filters.status) {
    where.status = filters.status
  }

  if (filters.paymentMethod) {
    where.paymentMethod = filters.paymentMethod
  }

  if (filters.minAmount) {
    where.total = { gte: parseFloat(filters.minAmount) }
  }

  if (filters.maxAmount) {
    where.total = { lte: parseFloat(filters.maxAmount) }
  }

  if (filters.storeId) {
    where.storeId = filters.storeId
  }

  if (filters.userId) {
    where.userId = filters.userId
  }

  if (filters.customerEmail) {
    where.customerEmail = { contains: filters.customerEmail, mode: 'insensitive' }
  }

  // Sorting
  const orderBy: any = {}
  if (sortBy) {
    orderBy[sortBy] = sortOrder
  } else {
    orderBy.createdAt = 'desc'
  }

  const [sales, totalCount] = await Promise.all([
    prisma.sale.findMany({
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
      orderBy,
      skip: (page - 1) * limit,
      take: limit
    }),
    prisma.sale.count({ where })
  ])

  return {
    results: sales.map(sale => ({
      id: sale.id,
      receiptNumber: sale.receiptNumber,
      customerName: sale.customerName,
      customerEmail: sale.customerEmail,
      customerPhone: sale.customerPhone,
      total: sale.total,
      tax: sale.tax,
      paymentMethod: sale.paymentMethod,
      status: sale.status,
      notes: sale.notes,
      ageVerified: sale.ageVerified,
      createdAt: sale.createdAt,
      staff: sale.user?.name,
      store: sale.store?.name,
      itemCount: sale.items.length,
      items: sale.items.map(item => ({
        product: item.product?.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total
      }))
    })),
    totalCount
  }
}

async function searchInventory(
  query: string | null,
  filters: any,
  sortBy: string | null,
  sortOrder: string,
  page: number,
  limit: number
) {
  const where: any = {}

  // Text search
  if (query) {
    where.OR = [
      { product: { name: { contains: query, mode: 'insensitive' } } },
      { product: { sku: { contains: query, mode: 'insensitive' } } },
      { product: { description: { contains: query, mode: 'insensitive' } } },
      { location: { contains: query, mode: 'insensitive' } }
    ]
  }

  // Apply filters
  if (filters.category) {
    where.product = { category: filters.category }
  }

  if (filters.minQuantity) {
    where.quantity = { gte: parseInt(filters.minQuantity) }
  }

  if (filters.maxQuantity) {
    where.quantity = { lte: parseInt(filters.maxQuantity) }
  }

  if (filters.minPrice) {
    where.product = { price: { gte: parseFloat(filters.minPrice) } }
  }

  if (filters.maxPrice) {
    where.product = { price: { lte: parseFloat(filters.maxPrice) } }
  }

  if (filters.stockStatus) {
    switch (filters.stockStatus) {
      case 'low':
        where.quantity = { lte: prisma.inventory.fields.reorderLevel }
        break
      case 'out':
        where.quantity = 0
        break
      case 'normal':
        where.quantity = { gt: prisma.inventory.fields.reorderLevel }
        break
    }
  }

  if (filters.storeId) {
    where.storeId = filters.storeId
  }

  if (filters.expiring) {
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    where.batch = {
      expiryDate: {
        lte: thirtyDaysFromNow
      }
    }
  }

  // Sorting
  const orderBy: any = {}
  if (sortBy) {
    if (sortBy === 'productName') {
      orderBy.product = { name: sortOrder }
    } else if (sortBy === 'productPrice') {
      orderBy.product = { price: sortOrder }
    } else {
      orderBy[sortBy] = sortOrder
    }
  } else {
    orderBy.quantity = 'asc'
  }

  const [inventory, totalCount] = await Promise.all([
    prisma.inventory.findMany({
      where,
      include: {
        product: {
          select: { name: true, sku: true, category: true, price: true, description: true }
        },
        batch: {
          select: { batchNumber: true, expiryDate: true, supplier: true }
        }
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit
    }),
    prisma.inventory.count({ where })
  ])

  return {
    results: inventory.map(item => ({
      id: item.id,
      product: item.product?.name,
      sku: item.product?.sku,
      category: item.product?.category,
      description: item.product?.description,
      quantity: item.quantity,
      available: item.available,
      reorderLevel: item.reorderLevel,
      unitPrice: item.product?.price,
      totalValue: item.quantity * (item.product?.price || 0),
      location: item.location,
      batchNumber: item.batch?.batchNumber,
      expiryDate: item.batch?.expiryDate,
      supplier: item.batch?.supplier,
      lastCounted: item.lastCounted,
      stockStatus: item.quantity === 0 ? 'out' : 
                   item.quantity <= item.reorderLevel ? 'low' : 'normal',
      isExpiring: item.batch?.expiryDate && 
                   new Date(item.batch.expiryDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    })),
    totalCount
  }
}

async function searchCustomers(
  query: string | null,
  filters: any,
  sortBy: string | null,
  sortOrder: string,
  page: number,
  limit: number
) {
  // Get all sales and extract customer information
  const salesWhere: any = {}
  
  if (filters.dateRange) {
    salesWhere.createdAt = {
      gte: new Date(filters.dateRange.start),
      lte: new Date(filters.dateRange.end)
    }
  }

  if (filters.minSpent) {
    salesWhere.total = { gte: parseFloat(filters.minSpent) }
  }

  if (filters.maxSpent) {
    salesWhere.total = { lte: parseFloat(filters.maxSpent) }
  }

  const sales = await prisma.sale.findMany({
    where: salesWhere,
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

  // Process customer data
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

  let customers = Array.from(customerMap.values())

  // Apply text search
  if (query) {
    customers = customers.filter(customer => 
      customer.name?.toLowerCase().includes(query.toLowerCase()) ||
      customer.email?.toLowerCase().includes(query.toLowerCase()) ||
      customer.phone?.includes(query)
    )
  }

  // Apply filters
  if (filters.minOrders) {
    customers = customers.filter(c => c.orderCount >= parseInt(filters.minOrders))
  }

  if (filters.maxOrders) {
    customers = customers.filter(c => c.orderCount <= parseInt(filters.maxOrders))
  }

  if (filters.segment) {
    customers = customers.filter(c => {
      const segment = c.totalSpent > 1000 ? 'vip' : 
                     c.totalSpent > 500 ? 'regular' : 'casual'
      return segment === filters.segment
    })
  }

  if (filters.isRepeat) {
    customers = customers.filter(c => c.orderCount > 1)
  }

  // Sorting
  customers.sort((a, b) => {
    let comparison = 0
    
    switch (sortBy) {
      case 'name':
        comparison = (a.name || '').localeCompare(b.name || '')
        break
      case 'totalSpent':
        comparison = b.totalSpent - a.totalSpent
        break
      case 'orderCount':
        comparison = b.orderCount - a.orderCount
        break
      case 'lastOrder':
        comparison = new Date(b.lastOrder).getTime() - new Date(a.lastOrder).getTime()
        break
      default:
        comparison = new Date(b.lastOrder).getTime() - new Date(a.lastOrder).getTime()
    }
    
    return sortOrder === 'desc' ? -comparison : comparison
  })

  // Pagination
  const startIndex = (page - 1) * limit
  const paginatedCustomers = customers.slice(startIndex, startIndex + limit)

  return {
    results: paginatedCustomers.map(customer => ({
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
      isRepeat: customer.orderCount > 1,
      orders: customer.orders
    })),
    totalCount: customers.length
  }
}

async function searchUsers(
  query: string | null,
  filters: any,
  sortBy: string | null,
  sortOrder: string,
  page: number,
  limit: number
) {
  const where: any = {}

  // Text search
  if (query) {
    where.OR = [
      { name: { contains: query, mode: 'insensitive' } },
      { email: { contains: query, mode: 'insensitive' } },
      { phone: { contains: query, mode: 'insensitive' } }
    ]
  }

  // Apply filters
  if (filters.role) {
    where.role = filters.role
  }

  if (filters.status) {
    where.isActive = filters.status === 'active'
  }

  if (filters.storeId) {
    where.storeId = filters.storeId
  }

  // Sorting
  const orderBy: any = {}
  if (sortBy) {
    orderBy[sortBy] = sortOrder
  } else {
    orderBy.createdAt = 'desc'
  }

  const [users, totalCount] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit
    }),
    prisma.user.count({ where })
  ])

  return {
    results: users.map(user => ({
      ...user,
      status: user.isActive ? 'active' : 'inactive'
    })),
    totalCount
  }
}

async function searchDeliveries(
  query: string | null,
  filters: any,
  sortBy: string | null,
  sortOrder: string,
  page: number,
  limit: number
) {
  const where: any = {}

  // Text search
  if (query) {
    where.OR = [
      { orderNumber: { contains: query, mode: 'insensitive' } },
      { customerName: { contains: query, mode: 'insensitive' } },
      { customerPhone: { contains: query, mode: 'insensitive' } },
      { customerAddress: { contains: query, mode: 'insensitive' } },
      { customerEmail: { contains: query, mode: 'insensitive' } },
      { notes: { contains: query, mode: 'insensitive' } }
    ]
  }

  // Apply filters
  if (filters.status) {
    where.status = filters.status
  }

  if (filters.driverId) {
    where.driverId = filters.driverId
  }

  if (filters.storeId) {
    where.storeId = filters.storeId
  }

  if (filters.dateRange) {
    where.createdAt = {
      gte: new Date(filters.dateRange.start),
      lte: new Date(filters.dateRange.end)
    }
  }

  if (filters.priority) {
    where.priority = filters.priority
  }

  // Sorting
  const orderBy: any = {}
  if (sortBy) {
    orderBy[sortBy] = sortOrder
  } else {
    orderBy.createdAt = 'desc'
  }

  const [deliveries, totalCount] = await Promise.all([
    prisma.delivery.findMany({
      where,
      include: {
        items: true,
        driver: {
          select: { name: true, email: true }
        },
        store: {
          select: { name: true }
        }
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit
    }),
    prisma.delivery.count({ where })
  ])

  return {
    results: deliveries.map(delivery => ({
      id: delivery.id,
      orderNumber: delivery.orderNumber,
      customerName: delivery.customerName,
      customerPhone: delivery.customerPhone,
      customerAddress: delivery.customerAddress,
      customerEmail: delivery.customerEmail,
      status: delivery.status,
      estimatedTime: delivery.estimatedTime,
      actualTime: delivery.actualTime,
      distance: delivery.distance,
      notes: delivery.notes,
      priority: delivery.priority,
      createdAt: delivery.createdAt,
      driver: delivery.driver?.name,
      store: delivery.store?.name,
      itemCount: delivery.items.length,
      items: delivery.items
    })),
    totalCount
  }
}

async function searchProducts(
  query: string | null,
  filters: any,
  sortBy: string | null,
  sortOrder: string,
  page: number,
  limit: number
) {
  const where: any = {}

  // Text search
  if (query) {
    where.OR = [
      { name: { contains: query, mode: 'insensitive' } },
      { sku: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } }
    ]
  }

  // Apply filters
  if (filters.category) {
    where.category = filters.category
  }

  if (filters.minPrice) {
    where.price = { gte: parseFloat(filters.minPrice) }
  }

  if (filters.maxPrice) {
    where.price = { lte: parseFloat(filters.maxPrice) }
  }

  if (filters.minThc) {
    where.thcContent = { gte: parseFloat(filters.minThc) }
  }

  if (filters.maxThc) {
    where.thcContent = { lte: parseFloat(filters.maxThc) }
  }

  if (filters.minCbd) {
    where.cbdContent = { gte: parseFloat(filters.minCbd) }
  }

  if (filters.maxCbd) {
    where.cbdContent = { lte: parseFloat(filters.maxCbd) }
  }

  if (filters.isActive !== undefined) {
    where.isActive = filters.isActive
  }

  if (filters.requiresAge !== undefined) {
    where.requiresAge = filters.requiresAge
  }

  // Sorting
  const orderBy: any = {}
  if (sortBy) {
    orderBy[sortBy] = sortOrder
  } else {
    orderBy.name = 'asc'
  }

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit
    }),
    prisma.product.count({ where })
  ])

  return {
    results: products,
    totalCount
  }
}