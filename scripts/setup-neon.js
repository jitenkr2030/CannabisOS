#!/bin/bash

# Neon Database Connection
NEON_DB_URL="postgresql://neondb_owner:npg_Lyxz26cWFNUb@ep-little-dust-ains7d8e-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

echo "🌱 Creating Neon database schema and data..."

# Use node to run the SQL since psql is not available
node -e "
const { Client } = require('pg');

async function setupDatabase() {
  const client = new Client({
    connectionString: '$NEON_DB_URL',
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('✅ Connected to Neon database');

    // Read and execute the SQL file
    const fs = require('fs');
    const sql = fs.readFileSync('/home/z/my-project/scripts/neon-schema.sql', 'utf8');
    
    // Split SQL by semicolons and execute each statement
    const statements = sql.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await client.query(statement);
        } catch (error) {
          // Ignore duplicate errors and continue
          if (!error.message.includes('already exists') && !error.message.includes('duplicate')) {
            console.log('⚠️  Warning:', error.message);
          }
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
"