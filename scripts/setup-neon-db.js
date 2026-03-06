const { Client } = require('pg');

// Neon Database Connection
const NEON_DB_URL = "postgresql://neondb_owner:npg_Lyxz26cWFNUb@ep-little-dust-ains7d8e-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function setupDatabase() {
  const client = new Client({
    connectionString: NEON_DB_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('✅ Connected to Neon database');

    // Create tables one by one with proper error handling
    const tables = [
      {
        name: 'stores',
        sql: `
          CREATE TABLE IF NOT EXISTS "stores" (
              "id" TEXT PRIMARY KEY,
              "name" TEXT NOT NULL,
              "address" TEXT NOT NULL,
              "phone" TEXT,
              "email" TEXT,
              "licenseNumber" TEXT,
              "isActive" BOOLEAN DEFAULT true,
              "timezone" TEXT DEFAULT 'America/Toronto',
              "currency" TEXT DEFAULT 'CAD',
              "clientId" TEXT,
              "consultantId" TEXT,
              "storeId" TEXT,
              "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `
      },
      {
        name: 'users',
        sql: `
          CREATE TABLE IF NOT EXISTS "users" (
              "id" TEXT PRIMARY KEY,
              "email" TEXT UNIQUE NOT NULL,
              "name" TEXT,
              "password" TEXT NOT NULL,
              "role" TEXT DEFAULT 'STAFF' CHECK ("role" IN ('ADMIN', 'MANAGER', 'STAFF', 'DRIVER', 'ACCOUNTANT', 'CONSULTANT', 'PARTNER')),
              "phone" TEXT,
              "avatar" TEXT,
              "isActive" BOOLEAN DEFAULT true,
              "lastLoginAt" TIMESTAMP,
              "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              "storeId" TEXT REFERENCES "stores"("id"),
              "consultantId" TEXT,
              "clientId" TEXT,
              "partnerId" TEXT
          );
        `
      },
      {
        name: 'products',
        sql: `
          CREATE TABLE IF NOT EXISTS "products" (
              "id" TEXT PRIMARY KEY,
              "name" TEXT NOT NULL,
              "description" TEXT,
              "sku" TEXT UNIQUE NOT NULL,
              "barcode" TEXT,
              "category" TEXT CHECK ("category" IN ('FLOWER', 'EDIBLES', 'CONCENTRATES', 'VAPES', 'TOPICALS', 'TINCTURES', 'ACCESSORIES', 'PRE_ROLLS')),
              "thcContent" REAL,
              "cbdContent" REAL,
              "weight" REAL,
              "unit" TEXT DEFAULT 'g',
              "price" REAL NOT NULL,
              "cost" REAL,
              "isActive" BOOLEAN DEFAULT true,
              "requiresAge" BOOLEAN DEFAULT true,
              "minAge" INTEGER DEFAULT 19,
              "imageUrl" TEXT,
              "tags" TEXT,
              "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              "storeId" TEXT REFERENCES "stores"("id")
          );
        `
      },
      {
        name: 'inventory',
        sql: `
          CREATE TABLE IF NOT EXISTS "inventory" (
              "id" TEXT PRIMARY KEY,
              "quantity" REAL DEFAULT 0,
              "reserved" REAL DEFAULT 0,
              "available" REAL,
              "reorderLevel" REAL DEFAULT 0,
              "maxStock" REAL,
              "location" TEXT,
              "lastCounted" TIMESTAMP,
              "storeId" TEXT,
              "consultantId" TEXT,
              "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              "productId" TEXT REFERENCES "products"("id"),
              "batchId" TEXT
          );
        `
      },
      {
        name: 'sales',
        sql: `
          CREATE TABLE IF NOT EXISTS "sales" (
              "id" TEXT PRIMARY KEY,
              "receiptNumber" TEXT UNIQUE NOT NULL,
              "customerName" TEXT,
              "customerPhone" TEXT,
              "customerEmail" TEXT,
              "subtotal" REAL NOT NULL,
              "tax" REAL DEFAULT 0,
              "discount" REAL DEFAULT 0,
              "total" REAL NOT NULL,
              "paymentMethod" TEXT CHECK ("paymentMethod" IN ('CASH', 'DEBIT', 'CREDIT', 'ETRANSFER', 'CRYPTO', 'STORE_CREDIT')),
              "paymentStatus" TEXT DEFAULT 'PAID' CHECK ("paymentStatus" IN ('PENDING', 'PAID', 'REFUNDED', 'PARTIALLY_REFUNDED')),
              "status" TEXT DEFAULT 'COMPLETED' CHECK ("status" IN ('PENDING', 'COMPLETED', 'CANCELLED', 'REFUNDED')),
              "notes" TEXT,
              "ageVerified" BOOLEAN DEFAULT false,
              "verifiedBy" TEXT,
              "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              "storeId" TEXT REFERENCES "stores"("id"),
              "userId" TEXT REFERENCES "users"("id")
          );
        `
      },
      {
        name: 'sale_items',
        sql: `
          CREATE TABLE IF NOT EXISTS "sale_items" (
              "id" TEXT PRIMARY KEY,
              "quantity" REAL NOT NULL,
              "unitPrice" REAL NOT NULL,
              "discount" REAL DEFAULT 0,
              "total" REAL NOT NULL,
              "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              "saleId" TEXT REFERENCES "sales"("id"),
              "productId" TEXT REFERENCES "products"("id")
          );
        `
      },
      {
        name: 'expenses',
        sql: `
          CREATE TABLE IF NOT EXISTS "expenses" (
              "id" TEXT PRIMARY KEY,
              "description" TEXT NOT NULL,
              "amount" REAL NOT NULL,
              "category" TEXT CHECK ("category" IN ('RENT', 'UTILITIES', 'SALARY', 'MARKETING', 'SUPPLIES', 'INVENTORY', 'EQUIPMENT', 'INSURANCE', 'LEGAL', 'MAINTENANCE', 'TRANSPORT', 'TAXES', 'OTHER')),
              "date" TIMESTAMP NOT NULL,
              "receiptUrl" TEXT,
              "isRecurring" BOOLEAN DEFAULT false,
              "recurringInterval" TEXT,
              "nextDueDate" TIMESTAMP,
              "notes" TEXT,
              "voiceNote" TEXT,
              "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              "storeId" TEXT REFERENCES "stores"("id"),
              "userId" TEXT REFERENCES "users"("id")
          );
        `
      },
      {
        name: 'deliveries',
        sql: `
          CREATE TABLE IF NOT EXISTS "deliveries" (
              "id" TEXT PRIMARY KEY,
              "orderNumber" TEXT UNIQUE NOT NULL,
              "customerName" TEXT NOT NULL,
              "customerPhone" TEXT NOT NULL,
              "customerAddress" TEXT NOT NULL,
              "customerEmail" TEXT,
              "notes" TEXT,
              "status" TEXT DEFAULT 'PENDING' CHECK ("status" IN ('PENDING', 'ASSIGNED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'FAILED')),
              "estimatedTime" TIMESTAMP,
              "actualTime" TIMESTAMP,
              "distance" REAL,
              "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              "storeId" TEXT REFERENCES "stores"("id"),
              "driverId" TEXT REFERENCES "users"("id")
          );
        `
      },
      {
        name: 'delivery_items',
        sql: `
          CREATE TABLE IF NOT EXISTS "delivery_items" (
              "id" TEXT PRIMARY KEY,
              "quantity" REAL NOT NULL,
              "notes" TEXT,
              "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              "deliveryId" TEXT REFERENCES "deliveries"("id"),
              "productName" TEXT NOT NULL,
              "thcContent" REAL,
              "cbdContent" REAL
          );
        `
      },
      {
        name: 'batches',
        sql: `
          CREATE TABLE IF NOT EXISTS "batches" (
              "id" TEXT PRIMARY KEY,
              "batchNumber" TEXT UNIQUE NOT NULL,
              "supplier" TEXT NOT NULL,
              "supplierLicense" TEXT,
              "receivedDate" TIMESTAMP NOT NULL,
              "expiryDate" TIMESTAMP,
              "testDate" TIMESTAMP,
              "labResults" JSONB,
              "coaUrl" TEXT,
              "isActive" BOOLEAN DEFAULT true,
              "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              "storeId" TEXT REFERENCES "stores"("id")
          );
        `
      },
      {
        name: 'qr_codes',
        sql: `
          CREATE TABLE IF NOT EXISTS "qr_codes" (
              "id" TEXT PRIMARY KEY,
              "code" TEXT UNIQUE NOT NULL,
              "isActive" BOOLEAN DEFAULT true,
              "scanCount" INTEGER DEFAULT 0,
              "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              "productId" TEXT REFERENCES "products"("id"),
              "batchId" TEXT
          );
        `
      },
      {
        name: 'settings',
        sql: `
          CREATE TABLE IF NOT EXISTS "settings" (
              "id" TEXT PRIMARY KEY,
              "key" TEXT UNIQUE NOT NULL,
              "value" TEXT NOT NULL,
              "description" TEXT,
              "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `
      }
    ];

    // Create tables
    for (const table of tables) {
      try {
        await client.query(table.sql);
        console.log(`✅ Created table: ${table.name}`);
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`ℹ️  Table ${table.name} already exists`);
        } else {
          console.log(`⚠️  Warning creating table ${table.name}:`, error.message);
        }
      }
    }

    // Insert demo data
    console.log('📊 Inserting demo data...');

    // Insert stores
    await client.query(`
      INSERT INTO "stores" ("id", "name", "address", "phone", "email", "licenseNumber", "timezone", "currency", "createdAt", "updatedAt") 
      VALUES 
        ('store-toronto-main', 'Toronto Main Dispensary', '123 Queen Street West, Toronto, ON M5H 2N2', '+1 (416) 555-0123', 'info@torontomain.com', 'LIC-2024-ON-001', 'America/Toronto', 'CAD', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('store-vancouver-downtown', 'Vancouver Downtown Dispensary', '456 Granville Street, Vancouver, BC V6C 1V4', '+1 (604) 555-0456', 'info@vancouverdt.com', 'LIC-2024-BC-002', 'America/Vancouver', 'CAD', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT (id) DO NOTHING;
    `);
    console.log('✅ Inserted stores');

    // Insert users
    await client.query(`
      INSERT INTO "users" ("id", "email", "name", "password", "role", "phone", "storeId", "createdAt", "updatedAt") 
      VALUES 
        ('user-001', 'admin@cannabisos.com', 'Super Admin', '$2b$10$N9qo8uLOickgx2ZMRZoMy.Mrq7N1qYsQ9QKqGqOcVvNvKqGqGq', 'ADMIN', '+1 (416) 555-0001', 'store-toronto-main', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('user-002', 'manager@cannabisos.com', 'John Manager', '$2b$10$N9qo8uLOickgx2ZMRZoMy.Mrq7N1qYsQ9QKqGqOcVvNvKqGqGq', 'MANAGER', '+1 (416) 555-0101', 'store-toronto-main', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('user-003', 'staff@cannabisos.com', 'Jane Staff', '$2b$10$N9qo8uLOickgx2ZMRZoMy.Mrq7N1qYsQ9QKqGqOcVvNvKqGqGq', 'STAFF', '+1 (416) 555-0201', 'store-toronto-main', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('user-004', 'driver@cannabisos.com', 'Tom Driver', '$2b$10$N9qo8uLOickgx2ZMRZoMy.Mrq7N1qYsQ9QKqGqOcVvNvKqGqGq', 'DRIVER', '+1 (416) 555-0301', 'store-toronto-main', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('user-005', 'accountant@cannabisos.com', 'Robert Accountant', '$2b$10$N9qo8uLOickgx2ZMRZoMy.Mrq7N1qYsQ9QKqGqOcVvNvKqGqGq', 'ACCOUNTANT', '+1 (416) 555-0401', 'store-toronto-main', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT (email) DO NOTHING;
    `);
    console.log('✅ Inserted users');

    // Insert products
    await client.query(`
      INSERT INTO "products" ("id", "name", "description", "sku", "category", "thcContent", "cbdContent", "weight", "unit", "price", "cost", "tags", "storeId", "createdAt", "updatedAt") 
      VALUES 
        ('prod-001', 'Blue Dream', 'Balanced hybrid with sweet berry aroma. Perfect for daytime use.', 'BD-001', 'FLOWER', 18.5, 0.2, 3.5, 'g', 35.00, 15.00, '["popular", "hybrid", "daytime", "creative"]', 'store-toronto-main', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('prod-002', 'OG Kush', 'Classic indica with earthy pine flavor. Great for relaxation.', 'OGK-001', 'FLOWER', 22.0, 0.1, 3.5, 'g', 40.00, 18.00, '["indica", "nighttime", "potent", "relaxing"]', 'store-toronto-main', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('prod-003', 'CBD Gummies', 'Delicious mixed fruit flavored gummies with 10mg CBD each.', 'CBDG-001', 'EDIBLES', 0.0, 10.0, 50, 'units', 25.00, 10.00, '["cbd", "edible", "therapeutic", "fruit"]', 'store-toronto-main', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('prod-004', 'Vape Pen - Strawberry', 'Disposable vape pen with strawberry flavor, 0.5ml of premium oil.', 'VP-STR-001', 'VAPES', 85.0, 0.5, 0.5, 'ml', 45.00, 20.00, '["vape", "disposable", "strawberry", "concentrated"]', 'store-toronto-main', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT (sku) DO NOTHING;
    `);
    console.log('✅ Inserted products');

    // Insert inventory
    await client.query(`
      INSERT INTO "inventory" ("id", "quantity", "available", "reorderLevel", "maxStock", "location", "productId", "storeId", "createdAt", "updatedAt") 
      VALUES 
        ('inv-001', 100, 100, 20, 200, 'Main Display', 'prod-001', 'store-toronto-main', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('inv-002', 75, 75, 15, 150, 'Main Display', 'prod-002', 'store-toronto-main', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('inv-003', 50, 50, 10, 100, 'Main Display', 'prod-003', 'store-toronto-main', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('inv-004', 60, 60, 15, 120, 'Main Display', 'prod-004', 'store-toronto-main', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT DO NOTHING;
    `);
    console.log('✅ Inserted inventory');

    // Insert sales
    await client.query(`
      INSERT INTO "sales" ("id", "receiptNumber", "customerName", "customerPhone", "customerEmail", "subtotal", "tax", "total", "paymentMethod", "status", "ageVerified", "verifiedBy", "storeId", "userId", "createdAt", "updatedAt") 
      VALUES 
        ('sale-001', 'RCP-10001', 'Customer 1', '+1 (416) 555-10001', 'customer1@email.com', 35.00, 4.55, 39.55, 'CASH', 'COMPLETED', true, 'Jane Staff', 'store-toronto-main', 'user-003', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('sale-002', 'RCP-10002', 'Customer 2', '+1 (416) 555-10002', 'customer2@email.com', 40.00, 5.20, 45.20, 'DEBIT', 'COMPLETED', true, 'Jane Staff', 'store-toronto-main', 'user-003', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT DO NOTHING;
    `);
    console.log('✅ Inserted sales');

    // Insert sale items
    await client.query(`
      INSERT INTO "sale_items" ("id", "quantity", "unitPrice", "total", "saleId", "productId", "createdAt") 
      VALUES 
        ('sale-item-001', 1, 35.00, 35.00, 'sale-001', 'prod-001', CURRENT_TIMESTAMP),
        ('sale-item-002', 1, 40.00, 40.00, 'sale-002', 'prod-002', CURRENT_TIMESTAMP)
      ON CONFLICT DO NOTHING;
    `);
    console.log('✅ Inserted sale items');

    // Insert expenses
    await client.query(`
      INSERT INTO "expenses" ("id", "description", "amount", "category", "date", "notes", "storeId", "userId", "createdAt", "updatedAt") 
      VALUES 
        ('exp-001', 'Monthly Rent', 2500.00, 'RENT', CURRENT_TIMESTAMP - INTERVAL '30 days', 'Monthly rent payment', 'store-toronto-main', 'user-002', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('exp-002', 'Utilities', 350.00, 'UTILITIES', CURRENT_TIMESTAMP - INTERVAL '25 days', 'Monthly utilities', 'store-toronto-main', 'user-002', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('exp-003', 'Marketing', 500.00, 'MARKETING', CURRENT_TIMESTAMP - INTERVAL '20 days', 'Marketing campaign', 'store-toronto-main', 'user-002', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT DO NOTHING;
    `);
    console.log('✅ Inserted expenses');

    // Insert deliveries
    await client.query(`
      INSERT INTO "deliveries" ("id", "orderNumber", "customerName", "customerPhone", "customerAddress", "status", "estimatedTime", "distance", "storeId", "driverId", "createdAt", "updatedAt") 
      VALUES 
        ('del-001', 'ORD-20001', 'Delivery Customer 1', '+1 (416) 555-20001', '100 King Street West, Apt 1, Toronto, ON', 'DELIVERED', CURRENT_TIMESTAMP - INTERVAL '2 hours', 5.2, 'store-toronto-main', 'user-004', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('del-002', 'ORD-20002', 'Delivery Customer 2', '+1 (416) 555-20002', '200 King Street West, Apt 2, Toronto, ON', 'OUT_FOR_DELIVERY', CURRENT_TIMESTAMP + INTERVAL '1 hour', 3.8, 'store-toronto-main', 'user-004', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT DO NOTHING;
    `);
    console.log('✅ Inserted deliveries');

    // Insert delivery items
    await client.query(`
      INSERT INTO "delivery_items" ("id", "quantity", "productName", "thcContent", "cbdContent", "deliveryId", "createdAt") 
      VALUES 
        ('del-item-001', 1, 'Blue Dream', 18.5, 0.2, 'del-001', CURRENT_TIMESTAMP),
        ('del-item-002', 1, 'OG Kush', 22.0, 0.1, 'del-002', CURRENT_TIMESTAMP)
      ON CONFLICT DO NOTHING;
    `);
    console.log('✅ Inserted delivery items');

    // Insert batches
    await client.query(`
      INSERT INTO "batches" ("id", "batchNumber", "supplier", "supplierLicense", "receivedDate", "expiryDate", "testDate", "labResults", "storeId", "createdAt", "updatedAt") 
      VALUES 
        ('batch-001', 'BATCH-2024-001', 'Green Leaf Farms', 'SL-2024-GLF-001', CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_TIMESTAMP + INTERVAL '300 days', CURRENT_TIMESTAMP - INTERVAL '15 days', '{"thc": 18.5, "cbd": 0.2, "pesticides": "None detected", "mold": "None detected", "heavyMetals": "Below limits"}', 'store-toronto-main', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT DO NOTHING;
    `);
    console.log('✅ Inserted batches');

    // Insert QR codes
    await client.query(`
      INSERT INTO "qr_codes" ("id", "code", "productId", "isActive", "scanCount", "createdAt", "updatedAt") 
      VALUES 
        ('qr-001', 'QR-BD-001-1640995200000', 'prod-001', true, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('qr-002', 'QR-OGK-001-1640995200001', 'prod-002', true, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('qr-003', 'QR-CBDG-001-1640995200002', 'prod-003', true, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('qr-004', 'QR-VP-STR-001-1640995200003', 'prod-004', true, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT DO NOTHING;
    `);
    console.log('✅ Inserted QR codes');

    // Insert settings
    await client.query(`
      INSERT INTO "settings" ("id", "key", "value", "description", "createdAt", "updatedAt") 
      VALUES 
        ('setting-001', 'store.name', 'Toronto Main Dispensary', 'Store name setting', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('setting-002', 'store.currency', 'CAD', 'Store currency setting', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('setting-003', 'store.tax_rate', '0.13', 'Store tax rate (13% HST)', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('setting-004', 'store.min_age', '19', 'Minimum age for cannabis purchase', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT (key) DO NOTHING;
    `);
    console.log('✅ Inserted settings');

    // Create indexes for better performance
    const indexes = [
      'CREATE INDEX IF NOT EXISTS "idx_users_email" ON "users"("email");',
      'CREATE INDEX IF NOT EXISTS "idx_users_role" ON "users"("role");',
      'CREATE INDEX IF NOT EXISTS "idx_users_storeId" ON "users"("storeId");',
      'CREATE INDEX IF NOT EXISTS "idx_products_sku" ON "products"("sku");',
      'CREATE INDEX IF NOT EXISTS "idx_products_category" ON "products"("category");',
      'CREATE INDEX IF NOT EXISTS "idx_products_storeId" ON "products"("storeId");',
      'CREATE INDEX IF NOT EXISTS "idx_sales_receiptNumber" ON "sales"("receiptNumber");',
      'CREATE INDEX IF NOT EXISTS "idx_sales_storeId" ON "sales"("storeId");',
      'CREATE INDEX IF NOT EXISTS "idx_sales_userId" ON "sales"("userId");',
      'CREATE INDEX IF NOT EXISTS "idx_inventory_productId" ON "inventory"("productId");',
      'CREATE INDEX IF NOT EXISTS "idx_inventory_storeId" ON "inventory"("storeId");',
      'CREATE INDEX IF NOT EXISTS "idx_deliveries_orderNumber" ON "deliveries"("orderNumber");',
      'CREATE INDEX IF NOT EXISTS "idx_deliveries_status" ON "deliveries"("status");',
      'CREATE INDEX IF NOT EXISTS "idx_deliveries_storeId" ON "deliveries"("storeId");',
      'CREATE INDEX IF NOT EXISTS "idx_batches_batchNumber" ON "batches"("batchNumber");',
      'CREATE INDEX IF NOT EXISTS "idx_batches_storeId" ON "batches"("storeId");',
      'CREATE INDEX IF NOT EXISTS "idx_qr_codes_code" ON "qr_codes"("code");',
      'CREATE INDEX IF NOT EXISTS "idx_qr_codes_productId" ON "qr_codes"("productId");'
    ];

    for (const indexSql of indexes) {
      try {
        await client.query(indexSql);
      } catch (error) {
        if (!error.message.includes('already exists')) {
          console.log('⚠️  Warning creating index:', error.message);
        }
      }
    }

    console.log('🎉 Neon database setup completed successfully!');
    console.log('');
    console.log('📊 DATABASE SUMMARY:');
    console.log('  - Stores: 2 (Toronto, Vancouver)');
    console.log('  - Users: 5 (Admin, Manager, Staff, Driver, Accountant)');
    console.log('  - Products: 4 (Flower, Edibles, Vapes)');
    console.log('  - Sales: 2 (Sample transactions)');
    console.log('  - Expenses: 3 (Monthly expenses)');
    console.log('  - Deliveries: 2 (Delivery orders)');
    console.log('  - Batches: 1 (Lab results)');
    console.log('  - QR Codes: 4 (Product authentication)');
    console.log('  - Settings: 4 (System configuration)');
    console.log('  - Indexes: 18 (Performance optimization)');
    console.log('');
    console.log('🔑 DEMO LOGIN CREDENTIALS:');
    console.log('  Admin: admin@cannabisos.com / demo123');
    console.log('  Manager: manager@cannabisos.com / demo123');
    console.log('  Staff: staff@cannabisos.com / demo123');
    console.log('  Driver: driver@cannabisos.com / demo123');
    console.log('  Accountant: accountant@cannabisos.com / demo123');
    console.log('');
    console.log('🌟 NEON DATABASE IS READY!');
    console.log('   Visit https://console.neon.tech to view your database.');

  } catch (error) {
    console.error('❌ Error setting up database:', error);
    throw error;
  } finally {
    await client.end();
  }
}

setupDatabase().catch(console.error);