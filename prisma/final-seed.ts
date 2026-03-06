import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'file:./db/custom.db',
    },
  },
})

async function seed() {
  try {
    console.log('🌱 Starting database seed...')

    // Test database connection
    await prisma.$connect()
    console.log('✅ Database connected successfully')

    // === STORES ===
    const stores = await Promise.all([
      prisma.store.upsert({
        where: { id: 'store-toronto-main' },
        update: {},
        create: {
          id: 'store-toronto-main',
          name: 'Toronto Main Dispensary',
          address: '123 Queen Street West, Toronto, ON M5H 2N2',
          phone: '+1 (416) 555-0123',
          email: 'info@torontomain.com',
          licenseNumber: 'LIC-2024-ON-001',
          timezone: 'America/Toronto',
          currency: 'CAD'
        }
      }),
      prisma.store.upsert({
        where: { id: 'store-vancouver-downtown' },
        update: {},
        create: {
          id: 'store-vancouver-downtown',
          name: 'Vancouver Downtown Dispensary',
          address: '456 Granville Street, Vancouver, BC V6C 1V4',
          phone: '+1 (604) 555-0456',
          email: 'info@vancouverdt.com',
          licenseNumber: 'LIC-2024-BC-002',
          timezone: 'America/Vancouver',
          currency: 'CAD'
        }
      }),
      prisma.store.upsert({
        where: { id: 'store-montreal-old-port' },
        update: {},
        create: {
          id: 'store-montreal-old-port',
          name: 'Montreal Old Port Dispensary',
          address: '789 Rue Saint-Paul, Montréal, QC H2Y 2C4',
          phone: '+1 (514) 555-0789',
          email: 'info@montrealoldport.com',
          licenseNumber: 'LIC-2024-QC-003',
          timezone: 'America/Montreal',
          currency: 'CAD'
        }
      })
    ])

    console.log('✅ Stores created:', stores.length)

    // === USERS ===
    const hashedPassword = await bcrypt.hash('demo123', 10)

    const users = await Promise.all([
      // Admin users
      prisma.user.upsert({
        where: { email: 'admin@cannabisos.com' },
        update: {},
        create: {
          email: 'admin@cannabisos.com',
          name: 'Super Admin',
          password: hashedPassword,
          role: 'ADMIN',
          storeId: stores[0].id,
          phone: '+1 (416) 555-0001'
        }
      }),
      prisma.user.upsert({
        where: { email: 'toronto-admin@cannabisos.com' },
        update: {},
        create: {
          email: 'toronto-admin@cannabisos.com',
          name: 'Toronto Admin',
          password: hashedPassword,
          role: 'ADMIN',
          storeId: stores[0].id,
          phone: '+1 (416) 555-0002'
        }
      }),
      
      // Manager users
      prisma.user.upsert({
        where: { email: 'manager@cannabisos.com' },
        update: {},
        create: {
          email: 'manager@cannabisos.com',
          name: 'John Manager',
          password: hashedPassword,
          role: 'MANAGER',
          storeId: stores[0].id,
          phone: '+1 (416) 555-0101'
        }
      }),
      prisma.user.upsert({
        where: { email: 'vancouver-manager@cannabisos.com' },
        update: {},
        create: {
          email: 'vancouver-manager@cannabisos.com',
          name: 'Sarah Manager',
          password: hashedPassword,
          role: 'MANAGER',
          storeId: stores[1].id,
          phone: '+1 (604) 555-0102'
        }
      }),
      
      // Staff users
      prisma.user.upsert({
        where: { email: 'staff@cannabisos.com' },
        update: {},
        create: {
          email: 'staff@cannabisos.com',
          name: 'Jane Staff',
          password: hashedPassword,
          role: 'STAFF',
          storeId: stores[0].id,
          phone: '+1 (416) 555-0201'
        }
      }),
      prisma.user.upsert({
        where: { email: 'cashier@cannabisos.com' },
        update: {},
        create: {
          email: 'cashier@cannabisos.com',
          name: 'Mike Cashier',
          password: hashedPassword,
          role: 'STAFF',
          storeId: stores[0].id,
          phone: '+1 (416) 555-0202'
        }
      }),
      
      // Driver users
      prisma.user.upsert({
        where: { email: 'driver@cannabisos.com' },
        update: {},
        create: {
          email: 'driver@cannabisos.com',
          name: 'Tom Driver',
          password: hashedPassword,
          role: 'DRIVER',
          storeId: stores[0].id,
          phone: '+1 (416) 555-0301'
        }
      }),
      prisma.user.upsert({
        where: { email: 'delivery-driver@cannabisos.com' },
        update: {},
        create: {
          email: 'delivery-driver@cannabisos.com',
          name: 'Lisa Driver',
          password: hashedPassword,
          role: 'DRIVER',
          storeId: stores[0].id,
          phone: '+1 (416) 555-0302'
        }
      }),
      
      // Accountant user
      prisma.user.upsert({
        where: { email: 'accountant@cannabisos.com' },
        update: {},
        create: {
          email: 'accountant@cannabisos.com',
          name: 'Robert Accountant',
          password: hashedPassword,
          role: 'ACCOUNTANT',
          storeId: stores[0].id,
          phone: '+1 (416) 555-0401'
        }
      })
    ])

    console.log('✅ Users created:', users.length)

    // === PRODUCTS ===
    const products = await Promise.all([
      // Flower products
      prisma.product.upsert({
        where: { sku: 'BD-001' },
        update: {},
        create: {
          name: 'Blue Dream',
          description: 'Balanced hybrid with sweet berry aroma. Perfect for daytime use.',
          sku: 'BD-001',
          barcode: '123456789012',
          category: 'FLOWER',
          thcContent: 18.5,
          cbdContent: 0.2,
          weight: 3.5,
          unit: 'g',
          price: 35.00,
          cost: 15.00,
          tags: JSON.stringify(['popular', 'hybrid', 'daytime', 'creative']),
          imageUrl: '/products/blue-dream.jpg',
          storeId: stores[0].id
        }
      }),
      prisma.product.upsert({
        where: { sku: 'OGK-001' },
        update: {},
        create: {
          name: 'OG Kush',
          description: 'Classic indica with earthy pine flavor. Great for relaxation.',
          sku: 'OGK-001',
          barcode: '123456789013',
          category: 'FLOWER',
          thcContent: 22.0,
          cbdContent: 0.1,
          weight: 3.5,
          unit: 'g',
          price: 40.00,
          cost: 18.00,
          tags: JSON.stringify(['indica', 'nighttime', 'potent', 'relaxing']),
          imageUrl: '/products/og-kush.jpg',
          storeId: stores[0].id
        }
      }),
      prisma.product.upsert({
        where: { sku: 'SD-001' },
        update: {},
        create: {
          name: 'Sour Diesel',
          description: 'Energizing sativa with diesel-like aroma. Perfect for creative activities.',
          sku: 'SD-001',
          barcode: '123456789014',
          category: 'FLOWER',
          thcContent: 20.0,
          cbdContent: 0.3,
          weight: 3.5,
          unit: 'g',
          price: 38.00,
          cost: 17.00,
          tags: JSON.stringify(['sativa', 'energetic', 'creative', 'focus']),
          imageUrl: '/products/sour-diesel.jpg',
          storeId: stores[0].id
        }
      }),
      prisma.product.upsert({
        where: { sku: 'GDP-001' },
        update: {},
        create: {
          name: 'Granddaddy Purple',
          description: 'Relaxing indica with grape and berry flavors. Ideal for evening use.',
          sku: 'GDP-001',
          barcode: '123456789015',
          category: 'FLOWER',
          thcContent: 21.0,
          cbdContent: 0.5,
          weight: 3.5,
          unit: 'g',
          price: 42.00,
          cost: 19.00,
          tags: JSON.stringify(['indica', 'relaxing', 'sleep', 'grape']),
          imageUrl: '/products/gdp.jpg',
          storeId: stores[0].id
        }
      }),
      
      // Edibles
      prisma.product.upsert({
        where: { sku: 'CBDG-001' },
        update: {},
        create: {
          name: 'CBD Gummies - Mixed Fruit',
          description: 'Delicious mixed fruit flavored gummies with 10mg CBD each.',
          sku: 'CBDG-001',
          barcode: '123456789016',
          category: 'EDIBLES',
          thcContent: 0.0,
          cbdContent: 10.0,
          weight: 50,
          unit: 'units',
          price: 25.00,
          cost: 10.00,
          tags: JSON.stringify(['cbd', 'edible', 'therapeutic', 'fruit']),
          imageUrl: '/products/cbd-gummies.jpg',
          storeId: stores[0].id
        }
      }),
      prisma.product.upsert({
        where: { sku: 'THCC-001' },
        update: {},
        create: {
          name: 'THC Chocolate Bar - Milk Chocolate',
          description: 'Premium milk chocolate bar with 100mg THC, divided into 10 squares.',
          sku: 'THCC-001',
          barcode: '123456789017',
          category: 'EDIBLES',
          thcContent: 10.0,
          cbdContent: 0.5,
          weight: 20,
          unit: 'g',
          price: 30.00,
          cost: 12.00,
          tags: JSON.stringify(['thc', 'edible', 'chocolate', 'potent']),
          imageUrl: '/products/thc-chocolate.jpg',
          storeId: stores[0].id
        }
      }),
      
      // Vapes
      prisma.product.upsert({
        where: { sku: 'VP-STR-001' },
        update: {},
        create: {
          name: 'Vape Pen - Strawberry',
          description: 'Disposable vape pen with strawberry flavor, 0.5ml of premium oil.',
          sku: 'VP-STR-001',
          barcode: '123456789018',
          category: 'VAPES',
          thcContent: 85.0,
          cbdContent: 0.5,
          weight: 0.5,
          unit: 'ml',
          price: 45.00,
          cost: 20.00,
          tags: JSON.stringify(['vape', 'disposable', 'strawberry', 'concentrated']),
          imageUrl: '/products/strawberry-vape.jpg',
          storeId: stores[0].id
        }
      }),
      prisma.product.upsert({
        where: { sku: 'LRC-WC-001' },
        update: {},
        create: {
          name: 'Live Resin Cartridge - Wedding Cake',
          description: 'Premium live resin cartridge with Wedding Cake strain flavor profile.',
          sku: 'LRC-WC-001',
          barcode: '123456789019',
          category: 'VAPES',
          thcContent: 90.0,
          cbdContent: 2.0,
          weight: 1.0,
          unit: 'g',
          price: 65.00,
          cost: 35.00,
          tags: JSON.stringify(['vape', 'live-resin', 'premium', 'wedding-cake']),
          imageUrl: '/products/live-resin.jpg',
          storeId: stores[0].id
        }
      }),
      
      // Other categories
      prisma.product.upsert({
        where: { sku: 'SH-BD-001' },
        update: {},
        create: {
          name: 'Shatter - Blue Dream',
          description: 'High-quality shatter made from Blue Dream strain.',
          sku: 'SH-BD-001',
          barcode: '123456789020',
          category: 'CONCENTRATES',
          thcContent: 95.0,
          cbdContent: 0.1,
          weight: 1.0,
          unit: 'g',
          price: 80.00,
          cost: 45.00,
          tags: JSON.stringify(['concentrate', 'shatter', 'potent', 'blue-dream']),
          imageUrl: '/products/shatter.jpg',
          storeId: stores[0].id
        }
      }),
      prisma.product.upsert({
        where: { sku: 'CBD-BALM-001' },
        update: {},
        create: {
          name: 'CBD Relief Balm - 500mg',
          description: 'Soothing topical balm with 500mg CBD for localized relief.',
          sku: 'CBD-BALM-001',
          barcode: '123456789021',
          category: 'TOPICALS',
          thcContent: 0.0,
          cbdContent: 15.0,
          weight: 50,
          unit: 'ml',
          price: 35.00,
          cost: 15.00,
          tags: JSON.stringify(['cbd', 'topical', 'balm', 'relief']),
          imageUrl: '/products/cbd-balm.jpg',
          storeId: stores[0].id
        }
      }),
      prisma.product.upsert({
        where: { sku: 'PR-MIX-001' },
        update: {},
        create: {
          name: 'Pre-roll Pack - Mixed Strains',
          description: 'Pack of 5 pre-rolls with different strains for variety.',
          sku: 'PR-MIX-001',
          barcode: '123456789022',
          category: 'PRE_ROLLS',
          thcContent: 20.0,
          cbdContent: 0.3,
          weight: 7.0,
          unit: 'g',
          price: 50.00,
          cost: 25.00,
          tags: JSON.stringify(['pre-roll', 'mixed', 'convenient', 'variety']),
          imageUrl: '/products/pre-rolls.jpg',
          storeId: stores[0].id
        }
      }),
      prisma.product.upsert({
        where: { sku: 'CBD-TIN-001' },
        update: {},
        create: {
          name: 'CBD Tincture - Peppermint',
          description: 'Alcohol-based CBD tincture with refreshing peppermint flavor.',
          sku: 'CBD-TIN-001',
          barcode: '123456789023',
          category: 'TINCTURES',
          thcContent: 0.0,
          cbdContent: 25.0,
          weight: 30,
          unit: 'ml',
          price: 45.00,
          cost: 20.00,
          tags: JSON.stringify(['cbd', 'tincture', 'peppermint', 'sublingual']),
          imageUrl: '/products/cbd-tincture.jpg',
          storeId: stores[0].id
        }
      })
    ])

    console.log('✅ Products created:', products.length)

    // === INVENTORY ===
    for (const product of products) {
      await prisma.inventory.upsert({
        where: { productId_storeId: { productId: product.id, storeId: product.storeId } },
        update: {},
        create: {
          productId: product.id,
          storeId: product.storeId,
          quantity: Math.floor(Math.random() * 100) + 50,
          reserved: 0,
          available: Math.floor(Math.random() * 100) + 50,
          reorderLevel: 20,
          maxStock: 200,
          location: 'Main Display',
          lastCounted: new Date()
        }
      })
    }

    console.log('✅ Inventory created')

    // === SALES ===
    const sales = []
    const today = new Date()
    
    for (let i = 0; i < 20; i++) {
      const saleDate = new Date(today)
      saleDate.setHours(today.getHours() - (i * 2))
      const saleDateStr = saleDate.toISOString()
      
      const subtotal = 35.00 + Math.random() * 200
      const tax = subtotal * 0.13 // 13% HST
      const total = subtotal + tax
      
      const sale = await prisma.sale.create({
        data: {
          receiptNumber: `RCP-${10000 + i}`,
          customerName: `Customer ${i + 1}`,
          customerPhone: `+1 (416) 555-${10000 + i}`,
          customerEmail: `customer${i + 1}@email.com`,
          subtotal,
          tax,
          discount: Math.random() > 0.8 ? 10 : 0,
          total,
          paymentMethod: ['CASH', 'DEBIT', 'CREDIT'][Math.floor(Math.random() * 3)] as any,
          paymentStatus: 'PAID',
          status: 'COMPLETED',
          notes: `Sale ${i + 1} notes`,
          ageVerified: true,
          verifiedBy: users.find(u => u.role === 'STAFF')?.name || 'Staff',
          storeId: stores[Math.floor(Math.random() * stores.length)].id,
          userId: users.find(u => u.role === 'STAFF')?.id || users[0].id,
          createdAt: saleDateStr
        }
      })
      
      // Add random sale items
      const numItems = Math.floor(Math.random() * 3) + 1
      for (let j = 0; j < numItems; j++) {
        const randomProduct = products[Math.floor(Math.random() * products.length)]
        const quantity = Math.floor(Math.random() * 3) + 1
        
        await prisma.saleItem.create({
          data: {
            saleId: sale.id,
            productId: randomProduct.id,
            quantity,
            unitPrice: randomProduct.price,
            total: quantity * randomProduct.price
          }
        })
      }
      
      sales.push(sale)
    }

    console.log('✅ Sales created:', sales.length)

    // === EXPENSES ===
    const expenseCategories = ['RENT', 'UTILITIES', 'SALARY', 'MARKETING', 'SUPPLIES', 'EQUIPMENT', 'INSURANCE', 'LEGAL', 'MAINTENANCE', 'TRANSPORT', 'TAXES', 'OTHER']
    
    for (let i = 0; i < 25; i++) {
      await prisma.expense.create({
        data: {
          description: `${expenseCategories[i % expenseCategories.length]} Expense ${i + 1}`,
          amount: 100 + Math.random() * 5000,
          category: expenseCategories[i % expenseCategories.length] as any,
          date: new Date(today.getTime() - (i * 24 * 60 * 60 * 1000)),
          receiptUrl: i % 3 === 0 ? `/receipts/expense-${i + 1}.pdf` : null,
          isRecurring: i < 12,
          recurringInterval: i < 6 ? 'monthly' : i < 9 ? 'quarterly' : 'yearly',
          nextDueDate: new Date(today.getTime() + ((i % 30 + 1) * 24 * 60 * 60 * 1000)),
          notes: `Monthly ${expenseCategories[i % expenseCategories.length]} expense`,
          voiceNote: i % 5 === 0 ? `Voice note for expense ${i + 1}` : null,
          storeId: stores[Math.floor(Math.random() * stores.length)].id,
          userId: users.find(u => u.role === 'MANAGER')?.id || users[0].id
        }
      })
    }

    console.log('✅ Expenses created')

    // === DELIVERIES ===
    const deliveries = []
    const drivers = users.filter(u => u.role === 'DRIVER')
    
    for (let i = 0; i < 15; i++) {
      const delivery = await prisma.delivery.create({
        data: {
          orderNumber: `ORD-${20000 + i}`,
          customerName: `Delivery Customer ${i + 1}`,
          customerPhone: `+1 (416) 555-${20000 + i}`,
          customerEmail: `delivery${i + 1}@email.com`,
          customerAddress: `${100 + i} King Street West, Apt ${i + 1}, Toronto, ON`,
          notes: `Delivery instructions for order ${i + 1}`,
          status: ['PENDING', 'ASSIGNED', 'OUT_FOR_DELIVERY', 'DELIVERED'][Math.floor(Math.random() * 4)] as any,
          estimatedTime: new Date(today.getTime() + (Math.random() * 4 * 60 * 60 * 1000)),
          actualTime: Math.random() > 0.5 ? new Date(today.getTime() - (Math.random() * 2 * 60 * 60 * 1000)) : null,
          distance: 2 + Math.random() * 8,
          storeId: stores[0].id,
          driverId: drivers[i % drivers.length]?.id
        }
      })
      
      // Add delivery items
      const numItems = Math.floor(Math.random() * 3) + 1
      for (let j = 0; j < numItems; j++) {
        const randomProduct = products[Math.floor(Math.random() * products.length)]
        
        await prisma.deliveryItem.create({
          data: {
            deliveryId: delivery.id,
            productName: randomProduct.name,
            quantity: Math.floor(Math.random() * 2) + 1,
            thcContent: randomProduct.thcContent,
            cbdContent: randomProduct.cbdContent,
            notes: `Item ${j + 1} for delivery ${i + 1}`
          }
        })
      }
      
      deliveries.push(delivery)
    }

    console.log('✅ Deliveries created:', deliveries.length)

    console.log('🎉 Database seed completed successfully!')
    console.log('')
    console.log('📊 Demo Data Summary:')
    console.log(`- Stores: ${stores.length}`)
    console.log(`- Users: ${users.length} (Admin, Manager, Staff, Driver, Accountant)`)
    console.log(`- Products: ${products.length} (All categories)`)
    console.log(`- Sales: ${sales.length}`)
    console.log(`- Expenses: 25`)
    console.log(`- Deliveries: ${deliveries.length}`)
    console.log('')
    console.log('🔑 Demo Login Credentials:')
    console.log('──────────────────────────────────────')
    console.log('ADMIN USERS:')
    console.log('  Super Admin: admin@cannabisos.com / demo123')
    console.log('  Toronto Admin: toronto-admin@cannabisos.com / demo123')
    console.log('')
    console.log('MANAGER USERS:')
    console.log('  John Manager: manager@cannabisos.com / demo123')
    console.log('  Sarah Manager: vancouver-manager@cannabisos.com / demo123')
    console.log('')
    console.log('STAFF USERS:')
    console.log('  Jane Staff: staff@cannabisos.com / demo123')
    console.log('  Mike Cashier: cashier@cannabisos.com / demo123')
    console.log('')
    console.log('DRIVER USERS:')
    console.log('  Tom Driver: driver@cannabisos.com / demo123')
    console.log('  Lisa Driver: delivery-driver@cannabisos.com / demo123')
    console.log('')
    console.log('SPECIALIZED USERS:')
    console.log('  Robert Accountant: accountant@cannabisos.com / demo123')
    console.log('')
    console.log('🌟 Platform is ready for user onboarding!')
    console.log('   All core features are populated with realistic demo data.')

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

seed()