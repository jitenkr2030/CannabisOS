import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'file:./test.db',
    },
  },
})

// Test data factories
export const createTestUser = async (overrides = {}) => {
  return await prisma.user.create({
    data: {
      id: 'test-user-1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'ADMIN',
      ...overrides,
    },
  })
}

export const createTestProduct = async (overrides = {}) => {
  return await prisma.product.create({
    data: {
      id: 'test-product-1',
      name: 'Test Product',
      sku: 'TEST-001',
      category: 'FLOWER',
      thcContent: 20.0,
      cbdContent: 0.5,
      price: 35.00,
      ...overrides,
    },
    include: {
      inventory: true,
    },
  })
}

export const createTestInventory = async (productId: string, overrides = {}) => {
  return await prisma.inventory.create({
    data: {
      id: 'test-inventory-1',
      productId,
      quantity: 100,
      available: 95,
      reserved: 5,
      reorderLevel: 10,
      maxStock: 200,
      location: 'A1-B2',
      ...overrides,
    },
  })
}

export const createTestSale = async (overrides = {}) => {
  return await prisma.sale.create({
    data: {
      id: 'test-sale-1',
      customerName: 'Test Customer',
      customerPhone: '555-1234',
      customerEmail: 'customer@example.com',
      subtotal: 100.00,
      tax: 13.00,
      discount: 0,
      total: 113.00,
      paymentMethod: 'CASH',
      ageVerified: true,
      verifiedBy: 'Test User',
      notes: 'Test sale',
      userId: 'test-user-1',
      ...overrides,
    },
    include: {
      items: true,
    },
  })
}

export const createTestSaleItem = async (saleId: string, overrides = {}) => {
  return await prisma.saleItem.create({
    data: {
      id: 'test-sale-item-1',
      saleId,
      productId: 'test-product-1',
      quantity: 2,
      unitPrice: 50.00,
      total: 100.00,
      ...overrides,
    },
  })
}

export const createTestExpense = async (overrides = {}) => {
  return await prisma.expense.create({
    data: {
      id: 'test-expense-1',
      description: 'Test Expense',
      amount: 150.00,
      category: 'SUPPLIES',
      date: new Date(),
      notes: 'Test expense',
      isRecurring: false,
      userId: 'test-user-1',
      ...overrides,
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  })
}

export const createTestDelivery = async (overrides = {}) => {
  return await prisma.delivery.create({
    data: {
      id: 'test-delivery-1',
      orderNumber: 'TEST-001',
      customerName: 'Test Customer',
      customerPhone: '555-5678',
      customerAddress: '123 Test St, Test City, TC',
      status: 'PENDING',
      estimatedTime: new Date(),
      distance: 5.5,
      storeId: 'test-store-1',
      ...overrides,
    },
    include: {
      items: true,
      tracking: true,
      driver: true,
    },
  })
}

export const createTestDeliveryItem = async (deliveryId: string, overrides = {}) => {
  return await prisma.deliveryItem.create({
    data: {
      id: 'test-delivery-item-1',
      deliveryId,
      productName: 'Test Product',
      quantity: 1,
      thcContent: 20.0,
      cbdContent: 0.5,
      ...overrides,
    },
  })
}

export const createTestConsultant = async (overrides = {}) => {
  return await prisma.consultant.create({
    data: {
      id: 'test-consultant-1',
      businessName: 'Test Consulting',
      contactEmail: 'consultant@test.com',
      commissionRate: 10.0,
      monthlyRevenue: 5000.00,
      totalRevenue: 50000.00,
      status: 'ACTIVE',
      whiteLabelEnabled: false,
      primaryColor: '#16a34a',
      secondaryColor: '#f3f4f6',
      ...overrides,
    },
  })
}

export const createTestPartner = async (overrides = {}) => {
  return await prisma.partner.create({
    data: {
      id: 'test-partner-1',
      companyName: 'Test Partnership',
      contactName: 'Test Partner',
      email: 'partner@test.com',
      status: 'ACTIVE',
      commissionRate: 15.0,
      monthlyRevenue: 3000.00,
      totalCommission: 10000.00,
      referralCode: 'TEST-PARTNER',
      referralCount: 5,
      activeClients: 3,
      whiteLabelEnabled: false,
      partnerSince: new Date(),
      lastActivity: new Date(),
      tier: 'SILVER',
      onboardingStatus: 'COMPLETED',
      ...overrides,
    },
  })
}

// Database cleanup utilities
export const cleanupDatabase = async () => {
  // Delete in order of dependencies (child tables first)
  const tablenames = [
    'SaleItem',
    'DeliveryItem',
    'DeliveryTracking',
    'Delivery',
    'Sale',
    'Expense',
    'Inventory',
    'Product',
    'Client',
    'Referral',
    'Commission',
    'OnboardingTask',
    'Partner',
    'Consultant',
    'User',
  ]

  for (const tablename of tablenames) {
    try {
      await prisma.$executeRawUnsafe(`DELETE FROM "${tablename}";`)
    } catch (error) {
      // Table might not exist, ignore
    }
  }
}

// Test database setup and teardown
export const setupTestDatabase = async () => {
  // Clean up any existing data
  await cleanupDatabase()
  
  // Create test data
  const user = await createTestUser()
  const product = await createTestProduct()
  const inventory = await createTestInventory(product.id)
  const sale = await createTestSale()
  const saleItem = await createTestSaleItem(sale.id)
  const expense = await createTestExpense()
  const delivery = await createTestDelivery()
  const deliveryItem = await createTestDeliveryItem(delivery.id)
  const consultant = await createTestConsultant()
  const partner = await createTestPartner()

  return {
    user,
    product,
    inventory,
    sale,
    saleItem,
    expense,
    delivery,
    deliveryItem,
    consultant,
    partner,
  }
}

export const teardownTestDatabase = async () => {
  await cleanupDatabase()
  await prisma.$disconnect()
}

// Mock data generators
export const generateMockProducts = (count: number = 10) => {
  const categories = ['FLOWER', 'EDIBLES', 'CONCENTRATES', 'VAPES', 'TOPICALS']
  const products = []

  for (let i = 0; i < count; i++) {
    products.push({
      id: `product-${i}`,
      name: `Product ${i}`,
      sku: `SKU-${i.toString().padStart(3, '0')}`,
      category: categories[i % categories.length],
      thcContent: 15 + Math.random() * 10,
      cbdContent: Math.random() * 2,
      price: 25 + Math.random() * 50,
      inventory: [
        {
          id: `inv-${i}`,
          quantity: 100,
          available: 95 - Math.floor(Math.random() * 20),
          reserved: Math.floor(Math.random() * 10),
          reorderLevel: 10,
          maxStock: 200,
          location: `A${Math.floor(i / 10) + 1}-B${(i % 10) + 1}`,
        }
      ],
    })
  }

  return products
}

export const generateMockSales = (count: number = 5) => {
  const sales = []
  const paymentMethods = ['CASH', 'DEBIT', 'CREDIT']

  for (let i = 0; i < count; i++) {
    const subtotal = 50 + Math.random() * 500
    const tax = subtotal * 0.13
    const total = subtotal + tax

    sales.push({
      id: `sale-${i}`,
      customerName: `Customer ${i}`,
      customerPhone: `555-${Math.floor(Math.random() * 9000 + 1000)}`,
      customerEmail: `customer${i}@example.com`,
      subtotal,
      tax,
      discount: 0,
      total,
      paymentMethod: paymentMethods[i % paymentMethods.length],
      ageVerified: true,
      verifiedBy: 'Staff User',
      notes: `Sale ${i}`,
      items: [
        {
          id: `sale-item-${i}`,
          productId: `product-${i}`,
          quantity: Math.floor(Math.random() * 5) + 1,
          unitPrice: subtotal / (Math.floor(Math.random() * 5) + 1),
          total: subtotal,
        }
      ],
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random time in last week
    })
  }

  return sales
}

export const generateMockExpenses = (count: number = 8) => {
  const categories = ['RENT', 'UTILITIES', 'SALARY', 'MARKETING', 'SUPPLIES', 'INVENTORY', 'EQUIPMENT', 'OTHER']
  const expenses = []

  for (let i = 0; i < count; i++) {
    expenses.push({
      id: `expense-${i}`,
      description: `Expense ${i}`,
      amount: 50 + Math.random() * 1000,
      category: categories[i % categories.length],
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Random date in last 30 days
      notes: `Expense ${i} notes`,
      isRecurring: Math.random() > 0.7,
      recurringInterval: 'monthly',
      user: {
        name: 'John Doe',
        email: 'john@example.com',
      },
    })
  }

  return expenses
}

export default prisma