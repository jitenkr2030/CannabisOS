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
    
    // Check if any users exist in database
    const userCount = await dbInstance.user.count()
    if (userCount === 0) {
      return NextResponse.json(
        { 
          error: 'No users found in database',
          message: 'Database needs to be seeded. Please contact administrator.',
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
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}