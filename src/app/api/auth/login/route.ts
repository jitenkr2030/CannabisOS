// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

import { NextRequest, NextResponse } from 'next/server'
import { db, isUsingMockDb } from '@/lib/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'cannabisos-jwt-secret-key-2024-production-grade-secure-32-character-key'

export async function POST(request: NextRequest) {
  try {
    // Skip database operations during build time
    if (isUsingMockDb()) {
      return NextResponse.json(
        { error: 'Authentication service not available during build time' },
        { status: 503 }
      )
    }

    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Get database instance
    const dbInstance = await db
    
    // Try to check if users exist, but handle schema errors gracefully
    let userCount = 0
    try {
      userCount = await dbInstance.user.count()
    } catch (error) {
      console.error('Database schema error:', error)
      // If table doesn't exist, we need to create it
      return NextResponse.json(
        { 
          error: 'Database schema not found',
          message: 'Database tables need to be created. Please run database migration.',
          needsMigration: true
        },
        { status: 503 }
      )
    }
    
    if (userCount === 0) {
      return NextResponse.json(
        { 
          error: 'No users found in database',
          message: 'Database needs to be seeded with demo users.',
          needsSeeding: true
        },
        { status: 404 }
      )
    }

    // Find user with store
    const user = await dbInstance.user.findUnique({
      where: { email },
      include: {
        store: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found', message: 'No account found with this email address' },
        { status: 401 }
      )
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Account inactive', message: 'Your account has been deactivated' },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid password', message: 'The password you entered is incorrect' },
        { status: 401 }
      )
    }

    // Update last login
    await dbInstance.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    })

    // Create JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role,
        storeId: user.storeId
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token
    })

  } catch (error) {
    console.error('Login error:', error)
    
    // Provide more specific error messages
    if (error.message.includes('relation "user" does not exist')) {
      return NextResponse.json(
        { 
          error: 'Database tables not created',
          message: 'Database schema needs to be created. Please run database migration.',
          needsMigration: true
        },
        { status: 503 }
      )
    }
    
    if (error.message.includes('Invalid prisma.user.count()')) {
      return NextResponse.json(
        { 
          error: 'Database configuration error',
          message: 'Prisma client configuration issue. Check DATABASE_URL.',
          configError: true
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}