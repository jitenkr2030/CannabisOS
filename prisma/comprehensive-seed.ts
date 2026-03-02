import { db } from '../src/lib/db'
import bcrypt from 'bcryptjs'

async function seed() {
  try {
    console.log('🌱 Starting comprehensive database seed...')

    // Clean existing data
    console.log('🧹 Cleaning existing data...')
    await db.auditLog.deleteMany()
    await db.transaction.deleteMany()
    await db.usageLog.deleteMany()
    await db.subscription.deleteMany()
    await db.payment.deleteMany()
    await db.commission.deleteMany()
    await onboardingTask.deleteMany()
    await onboardingTask.deleteMany()
    await onboardingTask.deleteMany()
    await db.referral.deleteMany()
    await db.partner.deleteMany()
    await db.consultantReport.deleteMany()
    await db.invoice.deleteMany()
    await db.consultantBranding.deleteMany()
    await db.consultant.deleteMany()
    await db.client.deleteMany()
    await db.deliveryTracking.deleteMany()
    await db.deliveryItem.deleteMany()
    await db.delivery.deleteMany()
    await db.expense.deleteMany()
    await db.saleItem.deleteMany()
    await db.sale.deleteMany()
    await db.batchProduct.deleteMany()
    await db.batch.deleteMany()
    await db.stockMovement.deleteMany()
    await db.inventory.deleteMany()
    await db.product.deleteMany()
    await db.qRCode.deleteMany()
    await db.user.deleteMany()
    await db.store.deleteMany()
    await db.setting.deleteMany()
    await db.complianceReport.deleteMany()

    console.log('✅ Existing data cleaned')

    // === STORES ===
    const stores = await Promise.all([
      db.store.create({
        data: {
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
      db.store.create({
        data: {
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
      db.store.create({
        data: {
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
      db.user.create({
        data: {
          email: 'admin@cannabisos.com',
          name: 'Super Admin',
          password: hashedPassword,
          role: 'ADMIN',
          storeId: stores[0].id,
          phone: '+1 (416) 555-0001'
        }
      }),
      db.user.create({
        data: {
          email: 'toronto-admin@cannabisos.com',
          name: 'Toronto Admin',
          password: hashedPassword,
          role: 'ADMIN',
          storeId: stores[0].id,
          phone: '+1 (416) 555-0002'
        }
      }),
      
      // Manager users
      db.user.create({
        data: {
          email: 'manager@cannabisos.com',
          name: 'John Manager',
          password: hashedPassword,
          role: 'MANAGER',
          storeId: stores[0].id,
          phone: '+1 (416) 555-0101'
        }
      }),
      db.user.create({
        data: {
          email: 'vancouver-manager@cannabisos.com',
          name: 'Sarah Manager',
          password: hashedPassword,
          role: 'MANAGER',
          storeId: stores[1].id,
          phone: '+1 (604) 555-0102'
        }
      }),
      
      // Staff users
      db.user.create({
        data: {
          email: 'staff@cannabisos.com',
          name: 'Jane Staff',
          password: hashedPassword,
          role: 'STAFF',
          storeId: stores[0].id,
          phone: '+1 (416) 555-0201'
        }
      }),
      db.user.create({
        data: {
          email: 'cashier@cannabisos.com',
          name: 'Mike Cashier',
          password: hashedPassword,
          role: 'STAFF',
          storeId: stores[0].id,
          phone: '+1 (416) 555-0202'
        }
      }),
      
      // Driver users
      db.user.create({
        data: {
          email: 'driver@cannabisos.com',
          name: 'Tom Driver',
          password: hashedPassword,
          role: 'DRIVER',
          storeId: stores[0].id,
          phone: '+1 (416) 555-0301'
        }
      }),
      db.user.create({
        data: {
          email: 'delivery-driver@cannabisos.com',
          name: 'Lisa Driver',
          password: hashedPassword,
          role: 'DRIVER',
          storeId: stores[0].id,
          phone: '+1 (416) 555-0302'
        }
      }),
      
      // Accountant user
      db.user.create({
        data: {
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
      db.product.create({
        data: {
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
      db.product.create({
        data: {
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
      db.product.create({
        data: {
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
      db.product.create({
        data: {
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
      db.product.create({
        data: {
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
      db.product.create({
        data: {
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
      db.product.create({
        data: {
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
      db.product.create({
        data: {
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
      
      // Concentrates
      db.product.create({
        data: {
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
      
      // Topicals
      db.product.create({
        data: {
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
      
      // Pre-rolls
      db.product.create({
        data: {
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
      
      // Tinctures
      db.product.create({
        data: {
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
      await db.inventory.create({
        data: {
          productId: product.id,
          storeId: product.storeId,
          quantity: Math.floor(Math.random() * 100) + 50,
          reserved: 0,
          available: 0,
          reorderLevel: 20,
          maxStock: 200,
          location: 'Main Display',
          lastCounted: new Date()
        }
      })
    }

    console.log('✅ Inventory created')

    // === BATCHES ===
    const batches = await Promise.all([
      db.batch.create({
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
            terpenes: ['myrcene', 'caryophyllene', 'limonene'],
            pesticides: 'None detected',
            mold: 'None detected',
            heavyMetals: 'Below limits',
            moisture: '8.5%',
            cannabinoidProfile: {
              THC: 18.5,
              CBD: 0.2,
              CBG: 0.1,
              THCV: 0.05,
              CBC: 0.1
            }
          }),
          coaUrl: 'https://lab-results.com/batch-001',
          storeId: stores[0].id
        }
      }),
      db.batch.create({
        data: {
          batchNumber: 'BATCH-2024-002',
          supplier: 'Sunshine Growers',
          supplierLicense: 'SL-2024-SG-002',
          receivedDate: new Date('2024-02-01'),
          expiryDate: new Date('2025-01-31'),
          testDate: new Date('2024-01-28'),
          labResults: JSON.stringify({
            thc: 22.0,
            cbd: 0.1,
            terpenes: ['pinene', 'linalool', 'humulene'],
            pesticides: 'None detected',
            mold: 'None detected',
            heavyMetals: 'Below limits',
            moisture: '7.2%'
          }),
          coaUrl: 'https://lab-results.com/batch-002',
          storeId: stores[0].id
        }
      })
    ])

    // Link batches to products
    for (let i = 0; i < Math.min(batches.length, products.length); i++) {
      await db.batchProduct.create({
        data: {
          batchId: batches[i].id,
          productId: products[i].id,
          quantity: 100
        }
      })
    }

    console.log('✅ Batches created:', batches.length)

    // === QR CODES ===
    for (const product of products.slice(0, 5)) {
      await db.qRCode.create({
        data: {
          code: `QR-${product.sku}-${Date.now()}`,
          productId: product.id,
          batchId: batches[0].id,
          isActive: true,
          scanCount: 0
        }
      })
    }

    console.log('✅ QR Codes created')

    // === SALES ===
    const sales = []
    const today = new Date()
    
    for (let i = 0; i < 20; i++) {
      const saleDate = new Date(today)
      saleDate.setHours(today.getHours() - (i * 2))
      const saleDateStr = saleDate.toISOString()
      
      const sale = await db.sale.create({
        data: {
          receiptNumber: `RCP-${10000 + i}`,
          customerName: `Customer ${i + 1}`,
          customerPhone: `+1 (416) 555-${10000 + i}`,
          customerEmail: `customer${i + 1}@email.com`,
          subtotal: 35.00 + Math.random() * 200,
          tax: 4.55 + Math.random() * 26,
          discount: Math.random() > 0.8 ? 10 : 0,
          total: 0,
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
      
      // Calculate total
      const total = sale.subtotal + sale.tax - sale.discount
      await db.sale.update({
        where: { id: sale.id },
        data: { total }
      })
      
      // Add random sale items
      const numItems = Math.floor(Math.random() * 3) + 1
      for (let j = 0; j < numItems; j++) {
        const randomProduct = products[Math.floor(Math.random() * products.length)]
        const quantity = Math.floor(Math.random() * 3) + 1
        
        await db.saleItem.create({
          data: {
            saleId: sale.id,
            productId: randomProduct.id,
            quantity,
            unitPrice: randomProduct.price,
            total: quantity * randomProduct.price
          }
        })
      }
      
      // Create payment record
      await db.payment.create({
        data: {
          amount: sale.total,
          method: sale.paymentMethod,
          status: 'PAID',
          saleId: sale.id
        }
      })
      
      sales.push(sale)
    }

    console.log('✅ Sales created:', sales.length)

    // === EXPENSES ===
    const expenseCategories = ['RENT', 'UTILITIES', 'SALARY', 'MARKETING', 'SUPPLIES', 'EQUIPMENT', 'INSURANCE', 'LEGAL', 'MAINTENANCE', 'TRANSPORT', 'TAXES', 'OTHER']
    
    for (let i = 0; i < 25; i++) {
      await db.expense.create({
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
      const delivery = await db.delivery.create({
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
        
        await db.deliveryItem.create({
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
      
      // Add tracking history
      const trackingSteps = [
        { status: 'PENDING', notes: 'Order received' },
        { status: 'ASSIGNED', notes: 'Driver assigned' },
        { status: 'OUT_FOR_DELIVERY', notes: 'Out for delivery' },
        { status: 'DELIVERED', notes: 'Delivered successfully' }
      ]
      
      const currentStatusIndex = trackingSteps.findIndex(step => step.status === delivery.status)
      
      for (let j = 0; j <= currentStatusIndex; j++) {
        await db.deliveryTracking.create({
          data: {
            deliveryId: delivery.id,
            status: trackingSteps[j].status as any,
            notes: trackingSteps[j].notes,
            location: j > 1 ? `${100 + j * 10} King Street West` : null,
            timestamp: new Date(today.getTime() - ((currentStatusIndex - j) * 30 * 60 * 1000))
          }
        })
      }
      
      deliveries.push(delivery)
    }

    console.log('✅ Deliveries created:', deliveries.length)

    // === CONSULTANTS ===
    const consultants = await Promise.all([
      db.user.create({
        data: {
          email: 'consultant1@cannabisos.com',
          name: 'Alex Consultant',
          password: hashedPassword,
          role: 'CONSULTANT',
          phone: '+1 (416) 555-1001'
        }
      }),
      db.user.create({
        data: {
          email: 'consultant2@cannabisos.com',
          name: 'Maria Consultant',
          password: hashedPassword,
          role: 'CONSULTANT',
          phone: '+1 (416) 555-1002'
        }
      })
    ])

    const consultantProfiles = await Promise.all([
      db.consultant.create({
        data: {
          userId: consultants[0].id,
          businessName: 'Cannabis Business Solutions',
          contactEmail: 'alex@cbsolutions.com',
          phone: '+1 (416) 555-1001',
          website: 'https://cbsolutions.com',
          commissionRate: 25,
          monthlyRevenue: 8000,
          totalRevenue: 24000,
          status: 'ACTIVE',
          whiteLabelEnabled: true,
          customDomain: 'portal.cbsolutions.com',
          logoUrl: '/logos/cbsolutions.png',
          primaryColor: '#3b82f6',
          secondaryColor: '#60a5fa',
          consultantId: 'CONS-001'
        }
      }),
      db.consultant.create({
        data: {
          userId: consultants[1].id,
          businessName: 'Green Leaf Consulting',
          contactEmail: 'maria@greenleaf.com',
          phone: '+1 (416) 555-1002',
          website: 'https://greenleaf.com',
          commissionRate: 25,
          monthlyRevenue: 5000,
          totalRevenue: 15000,
          status: 'ACTIVE',
          whiteLabelEnabled: true,
          customDomain: 'app.greenleaf.com',
          logoUrl: '/logos/greenleaf.png',
          primaryColor: '#10b981',
          secondaryColor: '#22c55e',
          consultantId: 'CONS-002'
        }
      })
    ])

    console.log('✅ Consultants created:', consultantProfiles.length)

    // === CLIENTS ===
    const clients = await Promise.all([
      db.client.create({
        data: {
          consultantId: consultantProfiles[0].id,
          businessName: 'Toronto Dispensary Group',
          contactName: 'David Chen',
          contactEmail: 'david@tdg.com',
          contactPhone: '+1 (416) 555-2001',
          businessAddress: '500 Bay Street, Toronto, ON',
          city: 'Toronto',
          province: 'Ontario',
          postalCode: 'M5G 2L1',
          country: 'Canada',
          status: 'ACTIVE',
          plan: 'Growth',
          monthlyFee: 299,
          startDate: new Date('2024-01-01'),
          notes: 'Multi-location dispensary group'
        }
      }),
      db.client.create({
        data: {
          consultantId: consultantProfiles[0].id,
          businessName: 'Vancouver Cannabis Collective',
          contactName: 'Emma Wilson',
          contactEmail: 'emma@vcc.com',
          contactPhone: '+1 (604) 555-2002',
          businessAddress: '200 Granville Street, Vancouver, BC',
          city: 'Vancouver',
          province: 'British Columbia',
          postalCode: 'V6C 1V4',
          country: 'Canada',
          status: 'ACTIVE',
          plan: 'Enterprise',
          monthlyFee: 499,
          startDate: new Date('2024-01-15'),
          notes: 'West coast dispensary chain'
        }
      }),
      db.client.create({
        data: {
          consultantId: consultantProfiles[1].id,
          businessName: 'Montreal Cannabis Co',
          contactName: 'Lucas Martin',
          contactEmail: 'lucas@mcc.com',
          contactPhone: '+1 (514) 555-2003',
          businessAddress: '100 Rue Sainte-Catherine, Montréal, QC',
          city: 'Montreal',
          province: 'Quebec',
          postalCode: 'H3B 1B4',
          country: 'Canada',
          status: 'ACTIVE',
          plan: 'Basic',
          monthlyFee: 199,
          startDate: new Date('2024-02-01'),
          notes: 'Single location startup'
        }
      })
    ])

    console.log('✅ Clients created:', clients.length)

    // === PARTNERS ===
    const partnerUsers = await Promise.all([
      db.user.create({
        data: {
          email: 'partner1@cannabisos.com',
          name: 'Partner One',
          password: hashedPassword,
          role: 'PARTNER',
          phone: '+1 (416) 555-3001'
        }
      }),
      db.user.create({
        data: {
          email: 'partner2@cannabisos.com',
          name: 'Partner Two',
          password: hashedPassword,
          role: 'PARTNER',
          phone: '+1 (416) 555-3002'
        }
      })
    ])

    const partners = await Promise.all([
      db.partner.create({
        data: {
          companyName: 'Cannabis Marketing Agency',
          contactName: 'Partner One',
          email: 'partner1@cannabisos.com',
          phone: '+1 (416) 555-3001',
          website: 'https://cannabismarketing.com',
          status: 'ACTIVE',
          commissionRate: 25,
          monthlyRevenue: 12000,
          totalCommission: 36000,
          referralCode: 'CMA25',
          referralCount: 15,
          activeClients: 8,
          whiteLabelEnabled: true,
          customDomain: 'agency.cannabismarketing.com',
          partnerSince: new Date('2023-06-01'),
          lastActivity: new Date(),
          tier: 'GOLD',
          onboardingStatus: 'COMPLETED',
          notes: 'Full-service marketing agency'
        }
      }),
      db.partner.create({
        data: {
          companyName: 'Tech Solutions Inc',
          contactName: 'Partner Two',
          email: 'partner2@cannabisos.com',
          phone: '+1 (416) 555-3002',
          website: 'https://techsolutions.com',
          status: 'ACTIVE',
          commissionRate: 25,
          monthlyRevenue: 8000,
          totalCommission: 24000,
          referralCode: 'TSI25',
          referralCount: 10,
          activeClients: 5,
          whiteLabelEnabled: false,
          partnerSince: new Date('2023-08-15'),
          lastActivity: new Date(),
          tier: 'SILVER',
          onboardingStatus: 'COMPLETED',
          notes: 'Technology consulting firm'
        }
      })
    ])

    console.log('✅ Partners created:', partners.length)

    // === SUBSCRIPTIONS ===
    const subscriptions = await Promise.all([
      // Admin subscription
      db.subscription.create({
        data: {
          userId: users[0].id,
          planId: 'ENTERPRISE',
          planName: 'Enterprise',
          billingCycle: 'YEARLY',
          amount: 499,
          currency: 'CAD',
          status: 'ACTIVE',
          subscriptionId: 'SUB-ADMIN-001',
          features: JSON.stringify(['all-features', 'unlimited-locations', 'custom-integrations', 'api-access']),
          maxUsers: 50,
          maxStores: 20,
          maxClients: 100,
          customIntegrations: true,
          apiAccess: true,
          whiteLabel: true,
          dedicatedSupport: true,
          customTraining: true,
          startDate: new Date('2024-01-01'),
          nextBillingDate: new Date('2025-01-01'),
          autoRenew: true
        }
      }),
      // Consultant subscription
      db.subscription.create({
        data: {
          userId: consultants[0].id,
          planId: 'CONSULTANT',
          planName: 'Consultant',
          billingCycle: 'MONTHLY',
          amount: 399,
          currency: 'CAD',
          status: 'ACTIVE',
          subscriptionId: 'SUB-CONS-001',
          features: JSON.stringify(['multi-client', 'white-label', 'revenue-tracking']),
          maxUsers: 10,
          maxStores: 50,
          maxClients: 25,
          customIntegrations: false,
          apiAccess: false,
          whiteLabel: true,
          dedicatedSupport: false,
          customTraining: false,
          startDate: new Date('2024-01-01'),
          nextBillingDate: new Date('2024-02-01'),
          autoRenew: true
        }
      }),
      // Client subscription
      db.subscription.create({
        data: {
          userId: users[2].id,
          planId: 'GROWTH',
          planName: 'Growth',
          billingCycle: 'MONTHLY',
          amount: 299,
          currency: 'CAD',
          status: 'ACTIVE',
          subscriptionId: 'SUB-CLIENT-001',
          features: JSON.stringify(['pos', 'inventory', 'accounting', 'delivery']),
          maxUsers: 5,
          maxStores: 3,
          maxClients: 0,
          customIntegrations: false,
          apiAccess: false,
          whiteLabel: false,
          dedicatedSupport: false,
          customTraining: false,
          startDate: new Date('2024-01-15'),
          nextBillingDate: new Date('2024-02-15'),
          autoRenew: true
        }
      })
    ])

    console.log('✅ Subscriptions created:', subscriptions.length)

    // === TRANSACTIONS ===
    for (let i = 0; i < 10; i++) {
      await db.transaction.create({
        data: {
          userId: subscriptions[i % subscriptions.length].userId,
          subscriptionId: subscriptions[i % subscriptions.length].id,
          paymentMethod: ['cashfree', 'stripe', 'razorpay'][Math.floor(Math.random() * 3)],
          paymentProvider: 'CASHFREE',
          transactionId: `TXN-${100000 + i}`,
          orderId: `ORD-${10000 + i}`,
          amount: subscriptions[i % subscriptions.length].amount,
          currency: 'CAD',
          status: 'COMPLETED',
          type: 'SUBSCRIPTION_PAYMENT',
          description: `Monthly subscription payment`,
          metadata: JSON.stringify({ payment_method: 'online' }),
          processedAt: new Date(today.getTime() - (i * 24 * 60 * 60 * 1000))
        }
      })
    }

    console.log('✅ Transactions created')

    // === SETTINGS ===
    await Promise.all([
      db.setting.create({
        data: {
          key: 'store.name',
          value: 'Toronto Main Dispensary',
          description: 'Store name setting'
        }
      }),
      db.setting.create({
        data: {
          key: 'store.currency',
          value: 'CAD',
          description: 'Store currency setting'
        }
      }),
      db.setting.create({
        data: {
          key: 'store.tax_rate',
          value: '0.13',
          description: 'Store tax rate (13% HST)'
        }
      }),
      db.setting.create({
        data: {
          key: 'store.min_age',
          value: '19',
          description: 'Minimum age for cannabis purchase'
        }
      })
    ])

    console.log('✅ Settings created')

    // === COMPLIANCE REPORTS ===
    const reportTypes = ['DAILY_SALES', 'MONTHLY_INVENTORY', 'QUARTERLY_TAX', 'ANNUAL_COMPLIANCE']
    
    for (const reportType of reportTypes) {
      await db.complianceReport.create({
        data: {
          type: reportType as any,
          period: '2024-01',
          data: JSON.stringify({
            generated: new Date().toISOString(),
            totalRecords: Math.floor(Math.random() * 1000) + 100,
            status: 'compliant',
            details: `Sample ${reportType} report data`
          }),
          status: 'GENERATED',
          submittedAt: new Date(),
          submittedBy: users[0].name
        }
      })
    }

    console.log('✅ Compliance reports created')

    console.log('🎉 Comprehensive database seed completed successfully!')
    console.log('')
    console.log('📊 Demo Data Summary:')
    console.log(`- Stores: ${stores.length}`)
    console.log(`- Users: ${users.length} (Admin, Manager, Staff, Driver, Accountant, Consultant, Partner)`)
    console.log(`- Products: ${products.length} (Flower, Edibles, Vapes, Concentrates, Topicals, Pre-rolls, Tinctures)`)
    console.log(`- Batches: ${batches.length}`)
    console.log(`- Sales: ${sales.length}`)
    console.log(`- Expenses: 25`)
    console.log(`- Deliveries: ${deliveries.length}`)
    console.log(`- Consultants: ${consultantProfiles.length}`)
    console.log(`- Clients: ${clients.length}`)
    console.log(`- Partners: ${partners.length}`)
    console.log(`- Subscriptions: ${subscriptions.length}`)
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
    console.log('  Alex Consultant: consultant1@cannabisos.com / demo123')
    console.log('  Maria Consultant: consultant2@cannabisos.com / demo123')
    console.log('  Partner One: partner1@cannabisos.com / demo123')
    console.log('  Partner Two: partner2@cannabisos.com / demo123')
    console.log('')
    console.log('🌟 Platform is now ready for real user onboarding!')
    console.log('   All features are populated with realistic demo data.')
    console.log('   Users can experience the complete platform functionality.')

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  } finally {
    await db.$disconnect()
  }
}

seed()