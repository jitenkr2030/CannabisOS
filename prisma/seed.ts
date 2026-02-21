import { db } from '../src/lib/db'
import bcrypt from 'bcryptjs'

async function seed() {
  try {
    console.log('🌱 Starting database seed...')

    // Create a demo store
    const store = await db.store.upsert({
      where: { id: 'demo-store' },
      update: {},
      create: {
        id: 'demo-store',
        name: 'Toronto Main Dispensary',
        address: '123 Queen Street West, Toronto, ON M5H 2N2',
        phone: '+1 (416) 555-0123',
        email: 'info@torontomain.com',
        licenseNumber: 'LIC-2024-ON-001'
      }
    })

    console.log('✅ Store created:', store.name)

    // Create demo users
    const hashedPassword = await bcrypt.hash('demo123', 10)

    const admin = await db.user.upsert({
      where: { email: 'admin@cannabisos.com' },
      update: {},
      create: {
        email: 'admin@cannabisos.com',
        name: 'Admin User',
        password: hashedPassword,
        role: 'ADMIN',
        storeId: store.id
      }
    })

    const manager = await db.user.upsert({
      where: { email: 'manager@cannabisos.com' },
      update: {},
      create: {
        email: 'manager@cannabisos.com',
        name: 'John Doe',
        password: hashedPassword,
        role: 'MANAGER',
        storeId: store.id
      }
    })

    const staff = await db.user.upsert({
      where: { email: 'staff@cannabisos.com' },
      update: {},
      create: {
        email: 'staff@cannabisos.com',
        name: 'Jane Smith',
        password: hashedPassword,
        role: 'STAFF',
        storeId: store.id
      }
    })

    const driver = await db.user.upsert({
      where: { email: 'driver@cannabisos.com' },
      update: {},
      create: {
        email: 'driver@cannabisos.com',
        name: 'Mike Johnson',
        password: hashedPassword,
        role: 'DRIVER',
        storeId: store.id,
        phone: '+1 (416) 555-0456'
      }
    })

    console.log('✅ Users created')

    // Create demo products
    const products = [
      {
        name: 'Blue Dream',
        description: 'Balanced hybrid, sweet berry aroma',
        sku: 'BD-001',
        category: 'FLOWER' as const,
        thcContent: 18.5,
        cbdContent: 0.2,
        weight: 3.5,
        unit: 'g',
        price: 35.00,
        cost: 15.00,
        tags: JSON.stringify(['popular', 'hybrid', 'daytime'])
      },
      {
        name: 'OG Kush',
        description: 'Classic indica, earthy pine flavor',
        sku: 'OGK-001',
        category: 'FLOWER' as const,
        thcContent: 22.0,
        cbdContent: 0.1,
        weight: 3.5,
        unit: 'g',
        price: 40.00,
        cost: 18.00,
        tags: JSON.stringify(['indica', 'nighttime', 'potent'])
      },
      {
        name: 'Sour Diesel',
        description: 'Energizing sativa, diesel-like aroma',
        sku: 'SD-001',
        category: 'FLOWER' as const,
        thcContent: 20.0,
        cbdContent: 0.3,
        weight: 3.5,
        unit: 'g',
        price: 38.00,
        cost: 17.00,
        tags: JSON.stringify(['sativa', 'energetic', 'creative'])
      },
      {
        name: 'Granddaddy Purple',
        description: 'Relaxing indica, grape and berry flavors',
        sku: 'GDP-001',
        category: 'FLOWER' as const,
        thcContent: 21.0,
        cbdContent: 0.5,
        weight: 3.5,
        unit: 'g',
        price: 42.00,
        cost: 19.00,
        tags: JSON.stringify(['indica', 'relaxing', 'sleep'])
      },
      {
        name: 'CBD Gummies',
        description: 'Mixed fruit flavored, 10mg CBD each',
        sku: 'CBDG-001',
        category: 'EDIBLES' as const,
        thcContent: 0.0,
        cbdContent: 10.0,
        weight: 50,
        unit: 'units',
        price: 25.00,
        cost: 10.00,
        tags: JSON.stringify(['cbd', 'edible', 'therapeutic'])
      },
      {
        name: 'Vape Pen - Strawberry',
        description: 'Disposable vape pen, 0.5ml',
        sku: 'VP-STR-001',
        category: 'VAPES' as const,
        thcContent: 85.0,
        cbdContent: 0.5,
        weight: 0.5,
        unit: 'ml',
        price: 45.00,
        cost: 20.00,
        tags: JSON.stringify(['vape', 'disposable', 'strawberry'])
      }
    ]

    for (const productData of products) {
      const product = await db.product.create({
        data: {
          ...productData,
          storeId: store.id
        }
      })

      // Create inventory for each product
      await db.inventory.create({
        data: {
          productId: product.id,
          storeId: store.id,
          quantity: Math.floor(Math.random() * 50) + 10,
          reserved: 0,
          available: 0,
          reorderLevel: 10,
          maxStock: 100,
          location: 'Main Display'
        }
      })
    }

    console.log('✅ Products and inventory created')

    // Create a demo batch
    const batch = await db.batch.create({
      data: {
        batchNumber: 'BATCH-2024-001',
        supplier: 'Green Leaf Farms',
        supplierLicense: 'SL-2024-GLF-001',
        receivedDate: new Date('2024-01-15'),
        expiryDate: new Date('2024-12-31'),
        testDate: new Date('2024-01-10'),
        labResults: JSON.stringify({
          thc: 18.5,
          cbd: 0.2,
          pesticides: 'None detected',
          mold: 'None detected',
          heavyMetals: 'Below limits'
        }),
        storeId: store.id
      }
    })

    console.log('✅ Batch created')

    // Create demo sales
    const productSamples = await db.product.findMany({ take: 1 })
    const firstProduct = productSamples[0]
    
    const today = new Date()
    for (let i = 0; i < 5; i++) {
      const saleDate = new Date(today)
      saleDate.setHours(today.getHours() - (i * 2))

      const sale = await db.sale.create({
        data: {
          receiptNumber: `RCP-${1000 + i}`,
          customerName: `Customer ${i + 1}`,
          customerPhone: `+1 (416) 555-${1000 + i}`,
          subtotal: 35.00 + (i * 10),
          tax: 4.55 + (i * 1.3),
          discount: 0,
          total: 39.55 + (i * 11.3),
          paymentMethod: 'CASH',
          paymentStatus: 'PAID',
          status: 'COMPLETED',
          ageVerified: true,
          verifiedBy: staff.name,
          storeId: store.id,
          userId: staff.id,
          createdAt: saleDate
        }
      })

      // Add sale items
      if (firstProduct) {
        await db.saleItem.create({
          data: {
            saleId: sale.id,
            productId: firstProduct.id,
            quantity: 1,
            unitPrice: 35.00,
            total: 35.00
          }
        })
      }
    }

    console.log('✅ Sales created')

    // Create demo expenses
    const expenseCategories = ['RENT', 'UTILITIES', 'SALARY', 'MARKETING', 'SUPPLIES']
    for (let i = 0; i < 3; i++) {
      await db.expense.create({
        data: {
          description: `Expense ${i + 1}`,
          amount: 100 + (i * 50),
          category: expenseCategories[i] as any,
          date: new Date(today.getTime() - (i * 24 * 60 * 60 * 1000)),
          notes: 'Monthly expense',
          storeId: store.id,
          userId: manager.id
        }
      })
    }

    console.log('✅ Expenses created')

    // Create demo deliveries
    for (let i = 0; i < 2; i++) {
      const delivery = await db.delivery.create({
        data: {
          orderNumber: `ORD-${2000 + i}`,
          customerName: `Delivery Customer ${i + 1}`,
          customerPhone: `+1 (416) 555-${2000 + i}`,
          customerAddress: `${100 + i} King Street West, Toronto, ON`,
          status: i === 0 ? 'DELIVERED' : 'OUT_FOR_DELIVERY',
          estimatedTime: new Date(today.getTime() + (2 * 60 * 60 * 1000)),
          actualTime: i === 0 ? new Date(today.getTime() - (1 * 60 * 60 * 1000)) : null,
          distance: 5.2 + i,
          storeId: store.id,
          driverId: driver.id
        }
      })

      // Add delivery items
      await db.deliveryItem.create({
        data: {
          deliveryId: delivery.id,
          productName: 'Blue Dream',
          quantity: 1,
          thcContent: 18.5,
          cbdContent: 0.2
        }
      })

      // Add tracking
      await db.deliveryTracking.createMany({
        data: [
          {
            deliveryId: delivery.id,
            status: 'PENDING',
            notes: 'Order received'
          },
          {
            deliveryId: delivery.id,
            status: 'ASSIGNED',
            notes: 'Driver assigned'
          },
          {
            deliveryId: delivery.id,
            status: i === 0 ? 'DELIVERED' : 'OUT_FOR_DELIVERY',
            notes: i === 0 ? 'Delivered successfully' : 'Out for delivery',
            timestamp: new Date(today.getTime() - (i * 30 * 60 * 1000))
          }
        ]
      })
    }

    console.log('✅ Deliveries created')

    console.log('🎉 Database seed completed successfully!')
    console.log('')
    console.log('Demo Login Credentials:')
    console.log('Admin: admin@cannabisos.com / demo123')
    console.log('Manager: manager@cannabisos.com / demo123')
    console.log('Staff: staff@cannabisos.com / demo123')
    console.log('Driver: driver@cannabisos.com / demo123')

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  } finally {
    await db.$disconnect()
  }
}

seed()