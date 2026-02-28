import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Demo users with different roles
const demoUsers = [
  {
    email: 'admin@cannabisos.com',
    name: 'Admin User',
    password: 'admin123',
    role: 'ADMIN',
    phone: '+1-555-0101',
    isActive: true,
  },
  {
    email: 'manager@cannabisos.com',
    name: 'Store Manager',
    password: 'manager123',
    role: 'MANAGER',
    phone: '+1-555-0102',
    isActive: true,
  },
  {
    email: 'staff@cannabisos.com',
    name: 'Staff User',
    password: 'staff123',
    role: 'STAFF',
    phone: '+1-555-0103',
    isActive: true,
  },
  {
    email: 'driver@cannabisos.com',
    name: 'Delivery Driver',
    password: 'driver123',
    role: 'DRIVER',
    phone: '+1-555-0104',
    isActive: true,
  },
  {
    email: 'accountant@cannabisos.com',
    name: 'Accountant',
    password: 'accountant123',
    role: 'ACCOUNTANT',
    phone: '+1-555-0105',
    isActive: true,
  },
  {
    email: 'consultant@cannabisos.com',
    name: 'Compliance Consultant',
    password: 'consultant123',
    role: 'CONSULTANT',
    phone: '+1-555-0106',
    isActive: true,
  },
  {
    email: 'partner@cannabisos.com',
    name: 'Business Partner',
    password: 'partner123',
    role: 'PARTNER',
    phone: '+1-555-0107',
    isActive: true,
  },
]

// Demo store data
const demoStores = [
  {
    name: 'Toronto Main Dispensary',
    address: '123 Queen Street West, Toronto, ON M5V 2A6',
    phone: '+1-416-555-0123',
    email: 'toronto@cannabisos.com',
    licenseNumber: 'LIC-2024-TO-001',
    timezone: 'America/Toronto',
    currency: 'CAD',
    isActive: true,
  },
  {
    name: 'Vancouver Boutique',
    address: '456 Granville Street, Vancouver, BC V6C 1V4',
    phone: '+1-604-555-0456',
    email: 'vancouver@cannabisos.com',
    licenseNumber: 'LIC-2024-BC-002',
    timezone: 'America/Vancouver',
    currency: 'CAD',
    isActive: true,
  },
]

// Demo product data
const demoProducts = [
  {
    name: 'Blue Dream',
    sku: 'BD-001',
    category: 'FLOWER',
    thcContent: 18.5,
    cbdContent: 0.5,
    weight: 3.5,
    unit: 'g',
    price: 35.00,
    cost: 20.00,
    description: 'Popular hybrid strain with blueberry flavor',
    imageUrl: '/images/products/blue-dream.jpg',
    tags: '["hybrid", "popular", "blueberry"]',
    isActive: true,
    requiresAge: true,
    minAge: 19,
  },
  {
    name: 'Girl Scout Cookies',
    sku: 'GSC-002',
    category: 'FLOWER',
    thcContent: 22.0,
    cbdContent: 0.2,
    weight: 3.5,
    unit: 'g',
    price: 40.00,
    cost: 25.00,
    description: 'Classic GSC with sweet, earthy flavor',
    imageUrl: '/images/products/gsc.jpg',
    tags: '["hybrid", "classic", "sweet"]',
    isActive: true,
    requiresAge: true,
    minAge: 19,
  },
  {
    name: 'OG Kush',
    sku: 'OGK-003',
    category: 'FLOWER',
    thcContent: 20.0,
    cbdContent: 1.0,
    weight: 3.5,
    unit: 'g',
    price: 38.00,
    cost: 23.00,
    description: 'Legendary OG Kush with pine and lemon flavor',
    imageUrl: '/images/products/og-kush.jpg',
    tags: '["indica", "legendary", "pine"]',
    isActive: true,
    requiresAge: true,
    minAge: 19,
  },
  {
    name: 'Sour Diesel',
    sku: 'SD-004',
    category: 'FLOWER',
    thcContent: 19.0,
    cbdContent: 0.8,
    weight: 3.5,
    unit: 'g',
    price: 36.00,
    cost: 22.00,
    description: 'Energizing sativa with diesel-like aroma',
    imageUrl: '/images/products/sour-diesel.jpg',
    tags: '["sativa", "energizing", "diesel"]',
    isActive: true,
    requiresAge: true,
    minAge: 19,
  },
  {
    name: 'CBD Tincture 500mg',
    sku: 'CBD-TIN-001',
    category: 'TINCTURES',
    thcContent: 0.0,
    cbdContent: 20.0,
    weight: 30,
    unit: 'ml',
    price: 45.00,
    cost: 25.00,
    description: 'High-potency CBD tincture for wellness',
    imageUrl: '/images/products/cbd-tincture.jpg',
    tags: '["cbd", "tincture", "wellness"]',
    isActive: true,
    requiresAge: true,
    minAge: 19,
  },
  {
    name: 'THC Gummies 10mg',
    sku: 'THC-GUM-001',
    category: 'EDIBLES',
    thcContent: 10.0,
    cbdContent: 0.0,
    weight: 10,
    unit: 'g',
    price: 25.00,
    cost: 12.00,
    description: 'Fruit-flavored THC gummies, 10mg each',
    imageUrl: '/images/products/thc-gummies.jpg',
    tags: '["edible", "gummies", "fruit"]',
    isActive: true,
    requiresAge: true,
    minAge: 19,
  },
]

// Demo batch data
const demoBatches = [
  {
    batchNumber: 'BATCH-2024-001',
    supplier: 'Green Leaf Farms',
    supplierLicense: 'SUP-LIC-2024-GL-001',
    receivedDate: new Date('2024-01-15'),
    expiryDate: new Date('2024-12-15'),
    testDate: new Date('2024-01-10'),
    labResults: {
      thc: 18.5,
      cbd: 0.5,
      terpenes: ['myrcene', 'caryophyllene', 'limonene'],
      pesticides: 'None detected',
      heavyMetals: 'Below limits',
      moisture: '8.5%',
    },
    coaUrl: '/lab-reports/batch-2024-001.pdf',
    isActive: true,
  },
  {
    batchNumber: 'BATCH-2024-002',
    supplier: 'Organic Growers Co',
    supplierLicense: 'SUP-LIC-2024-OG-002',
    receivedDate: new Date('2024-01-20'),
    expiryDate: new Date('2024-12-20'),
    testDate: new Date('2024-01-18'),
    labResults: {
      thc: 22.0,
      cbd: 0.2,
      terpenes: ['linalool', 'humulene', 'pinene'],
      pesticides: 'None detected',
      heavyMetals: 'Below limits',
      moisture: '7.2%',
    },
    coaUrl: '/lab-reports/batch-2024-002.pdf',
    isActive: true,
  },
]

// Demo customer data
const demoCustomers = [
  {
    name: 'John Smith',
    phone: '+1-416-555-1234',
    email: 'john.smith@email.com',
    address: '789 Yonge Street, Toronto, ON M4P 2C5',
    notes: 'Regular customer, prefers indicas',
  },
  {
    name: 'Sarah Johnson',
    phone: '+1-416-555-5678',
    email: 'sarah.j@email.com',
    address: '456 Bloor Street, Toronto, ON M4W 1A8',
    notes: 'New customer, interested in CBD products',
  },
  {
    name: 'Mike Davis',
    phone: '+1-416-555-9012',
    email: 'mike.davis@email.com',
    address: '321 King Street West, Toronto, ON M5V 1M4',
    notes: 'Medical patient, needs high-CBD strains',
  },
]

async function seedDemoData() {
  console.log('🌱 Starting demo data seeding...')
  
  try {
    // 1. Create demo users
    console.log('👥 Creating demo users...')
    const createdUsers = []
    
    for (const userData of demoUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 12)
      
      const user = await prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })
      
      createdUsers.push(user)
      console.log(`✅ Created user: ${user.name} (${user.email})`)
    }
    
    // 2. Create demo stores
    console.log('🏪 Creating demo stores...')
    const createdStores = []
    
    for (const storeData of demoStores) {
      const store = await prisma.store.create({
        data: {
          ...storeData,
          storeId: `store-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })
      
      createdStores.push(store)
      console.log(`✅ Created store: ${store.name}`)
    }
    
    // 3. Create demo products
    console.log('🌿 Creating demo products...')
    const createdProducts = []
    
    for (const productData of demoProducts) {
      const product = await prisma.product.create({
        data: {
          ...productData,
          storeId: createdStores[0].id, // Assign to first store
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })
      
      createdProducts.push(product)
      console.log(`✅ Created product: ${product.name}`)
    }
    
    // 4. Create demo batches
    console.log('📦 Creating demo batches...')
    const createdBatches = []
    
    for (const batchData of demoBatches) {
      const batch = await prisma.batch.create({
        data: {
          ...batchData,
          storeId: createdStores[0].id, // Assign to first store
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })
      
      createdBatches.push(batch)
      console.log(`✅ Created batch: ${batch.batchNumber}`)
    }
    
    // 5. Create inventory records
    console.log('📊 Creating demo inventory...')
    for (const product of createdProducts) {
      const inventory = await prisma.inventory.create({
        data: {
          productId: product.id,
          quantity: 100, // 100 units in stock
          reserved: 0,
          available: 100,
          reorderLevel: 20,
          maxStock: 500,
          location: 'Main Storage',
          storeId: createdStores[0].id,
          batchId: createdBatches[0].id, // Link to first batch
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })
      
      console.log(`✅ Created inventory for: ${product.name} (100 units)`)
    }
    
    // 6. Create demo sales
    console.log('💰 Creating demo sales...')
    const demoSales = [
      {
        receiptNumber: 'RCP-2024-001',
        customerName: 'John Smith',
        customerPhone: '+1-416-555-1234',
        customerEmail: 'john.smith@email.com',
        subtotal: 75.00,
        tax: 9.75,
        discount: 0,
        total: 84.75,
        paymentMethod: 'CASH',
        paymentStatus: 'PAID',
        status: 'COMPLETED',
        notes: 'Regular customer, paid cash',
      },
      {
        receiptNumber: 'RCP-2024-002',
        customerName: 'Sarah Johnson',
        customerPhone: '+1-416-555-5678',
        customerEmail: 'sarah.j@email.com',
        subtotal: 65.00,
        tax: 8.45,
        discount: 5.00,
        total: 68.45,
        paymentMethod: 'CREDIT',
        paymentStatus: 'PAID',
        status: 'COMPLETED',
        notes: 'New customer, used credit card',
      },
    ]
    
    for (const saleData of demoSales) {
      const sale = await prisma.sale.create({
        data: {
          ...saleData,
          storeId: createdStores[0].id,
          userId: createdUsers[2].id, // Staff user
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })
      
      // Create sale items
      const saleItems = [
        {
          productId: createdProducts[0].id, // Blue Dream
          quantity: 2,
          unitPrice: 35.00,
          discount: 0,
          total: 70.00,
        },
        {
          productId: createdProducts[4].id, // CBD Tincture
          quantity: 1,
          unitPrice: 45.00,
          discount: 0,
          total: 45.00,
        },
      ]
      
      for (const itemData of saleItems) {
        await prisma.saleItem.create({
          data: {
            ...itemData,
            saleId: sale.id,
            createdAt: new Date(),
          },
        })
      }
      
      console.log(`✅ Created sale: ${sale.receiptNumber}`)
    }
    
    // 7. Create demo expenses
    console.log('💸 Creating demo expenses...')
    const demoExpenses = [
      {
        description: 'Monthly Rent - Toronto Store',
        amount: 3500.00,
        category: 'RENT',
        date: new Date('2024-01-01'),
        receiptUrl: '/receipts/rent-jan2024.pdf',
        isRecurring: true,
        recurringInterval: 'monthly',
        nextDueDate: new Date('2024-02-01'),
        notes: 'Monthly rent for main location',
      },
      {
        description: 'Utilities - Electricity',
        amount: 450.00,
        category: 'UTILITIES',
        date: new Date('2024-01-15'),
        receiptUrl: '/receipts/electricity-jan2024.pdf',
        isRecurring: true,
        recurringInterval: 'monthly',
        nextDueDate: new Date('2024-02-15'),
        notes: 'Monthly electricity bill',
      },
      {
        description: 'Office Supplies',
        amount: 125.00,
        category: 'SUPPLIES',
        date: new Date('2024-01-10'),
        receiptUrl: '/receipts/office-supplies.pdf',
        isRecurring: false,
        notes: 'Paper, pens, printer ink',
      },
    ]
    
    for (const expenseData of demoExpenses) {
      const expense = await prisma.expense.create({
        data: {
          ...expenseData,
          storeId: createdStores[0].id,
          userId: createdUsers[4].id, // Accountant user
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })
      
      console.log(`✅ Created expense: ${expense.description}`)
    }
    
    // 8. Create demo subscriptions
    console.log('📋 Creating demo subscriptions...')
    const demoSubscriptions = [
      {
        planId: 'growth',
        planName: 'Growth',
        billingCycle: 'MONTHLY',
        amount: 299.00,
        currency: 'USD',
        status: 'ACTIVE',
        subscriptionId: 'sub-growth-001',
        customerDetails: {
          customer_id: createdUsers[1].id,
          customer_name: 'Store Manager',
          customer_email: 'manager@cannabisos.com',
          customer_phone: '+1-555-0102',
        },
        maxUsers: 15,
        maxStores: 10,
        maxClients: 0,
        customIntegrations: false,
        apiAccess: false,
        whiteLabel: false,
        dedicatedSupport: true,
        customTraining: false,
        startDate: new Date('2024-01-01'),
        nextBillingDate: new Date('2024-02-01'),
        activatedAt: new Date('2024-01-01'),
        autoRenew: true,
      },
    ]
    
    for (const subData of demoSubscriptions) {
      const subscription = await prisma.subscription.create({
        data: {
          ...subData,
          userId: createdUsers[0].id, // Admin user
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })
      
      console.log(`✅ Created subscription: ${subscription.planName}`)
    }
    
    // 9. Create demo settings
    console.log('⚙️ Creating demo settings...')
    const demoSettings = [
      {
        key: 'business_name',
        value: 'CannabisOS Demo Dispensary',
        description: 'Business name for the demo',
      },
      {
        key: 'business_address',
        value: '123 Queen Street West, Toronto, ON M5V 2A6',
        description: 'Business address',
      },
      {
        key: 'business_phone',
        value: '+1-416-555-0123',
        description: 'Business phone number',
      },
      {
        key: 'business_email',
        value: 'info@cannabisos.com',
        description: 'Business email address',
      },
      {
        key: 'tax_rate',
        value: '0.13',
        description: 'HST tax rate (13%)',
      },
      {
        key: 'currency',
        value: 'CAD',
        description: 'Default currency',
      },
      {
        key: 'timezone',
        value: 'America/Toronto',
        description: 'Default timezone',
      },
    ]
    
    for (const settingData of demoSettings) {
      await prisma.setting.create({
        data: {
          ...settingData,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })
    }
    
    console.log('✅ Created demo settings')
    
    // 10. Create demo compliance reports
    console.log('📋 Creating demo compliance reports...')
    const demoReports = [
      {
        type: 'MONTHLY_SALES',
        period: '2024-01',
        data: {
          totalSales: 15420.50,
          totalTransactions: 234,
          averageTransaction: 65.90,
          topProducts: ['Blue Dream', 'Girl Scout Cookies', 'OG Kush'],
          taxCollected: 2004.67,
        },
        status: 'GENERATED',
        submittedAt: new Date('2024-02-01'),
      },
      {
        type: 'MONTHLY_INVENTORY',
        period: '2024-01',
        data: {
          totalProducts: 6,
          totalStock: 600,
          lowStockItems: 2,
          expiredItems: 0,
          batchTracking: '100%',
        },
        status: 'GENERATED',
        submittedAt: new Date('2024-02-01'),
      },
    ]
    
    for (const reportData of demoReports) {
      await prisma.complianceReport.create({
        data: {
          ...reportData,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })
    }
    
    console.log('✅ Created demo compliance reports')
    
    console.log('\n🎉 Demo data seeding completed successfully!')
    console.log('\n📊 DEMO DATA SUMMARY:')
    console.log(`👥 Users: ${createdUsers.length}`)
    console.log(`🏪 Stores: ${createdStores.length}`)
    console.log(`🌿 Products: ${createdProducts.length}`)
    console.log(`📦 Batches: ${createdBatches.length}`)
    console.log(`💰 Sales: 2`)
    console.log(`💸 Expenses: 3`)
    console.log(`📋 Subscriptions: 1`)
    console.log(`⚙️ Settings: 7`)
    console.log(`📋 Reports: 2`)
    
    console.log('\n🔑 DEMO LOGIN CREDENTIALS:')
    console.log('Admin: admin@cannabisos.com / admin123')
    console.log('Manager: manager@cannabisos.com / manager123')
    console.log('Staff: staff@cannabisos.com / staff123')
    console.log('Driver: driver@cannabisos.com / driver123')
    console.log('Accountant: accountant@cannabisos.com / accountant123')
    console.log('Consultant: consultant@cannabisos.com / consultant123')
    console.log('Partner: partner@cannabisos.com / partner123')
    
  } catch (error) {
    console.error('❌ Error seeding demo data:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the seeding
seedDemoData()
  .catch((error) => {
    console.error('❌ Fatal error during seeding:', error)
    process.exit(1)
  })
