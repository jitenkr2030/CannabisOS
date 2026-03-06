import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')
  
  try {
    // Check if database is accessible
    await prisma.$connect()
    console.log('✅ Database connected successfully')
    
    // Check if users already exist
    const existingUsers = await prisma.user.count()
    if (existingUsers > 0) {
      console.log(`📊 Database already has ${existingUsers} users`)
      console.log('🔧 Skipping seeding - database already populated')
      return
    }
    
    // Create demo users
    const demoUsers = [
      {
        email: 'admin@cannabisos.com',
        name: 'Super Admin',
        password: await bcrypt.hash('demo123', 10),
        role: 'ADMIN',
      },
      {
        email: 'manager@cannabisos.com',
        name: 'John Manager',
        password: await bcrypt.hash('demo123', 10),
        role: 'MANAGER',
      },
      {
        email: 'staff@cannabisos.com',
        name: 'Jane Staff',
        password: await bcrypt.hash('demo123', 10),
        role: 'STAFF',
      },
      {
        email: 'driver@cannabisos.com',
        name: 'Mike Driver',
        password: await bcrypt.hash('demo123', 10),
        role: 'DRIVER',
      },
    ]
    
    console.log('👥 Creating demo users...')
    for (const user of demoUsers) {
      await prisma.user.create({
        data: user,
      })
      console.log(`✅ Created user: ${user.email}`)
    }
    
    console.log('🎉 Database seeding completed successfully!')
    console.log('📱 Demo credentials:')
    console.log('   Admin: admin@cannabisos.com / demo123')
    console.log('   Manager: manager@cannabisos.com / demo123')
    console.log('   Staff: staff@cannabisos.com / demo123')
    console.log('   Driver: driver@cannabisos.com / demo123')
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })