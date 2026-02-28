import type { PrismaClientOptions } from '@prisma/client'

const config: PrismaClientOptions = {
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_Lyxz26cWFNUb@ep-little-dust-ains7d8e-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
    },
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
}

export default config