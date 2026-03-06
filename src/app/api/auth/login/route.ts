import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'cannabisos-jwt-secret-key-2024-production-grade-secure-32-character-key'

// Demo users - always available
const demoUsers = [
  {
    id: 'demo-admin',
    email: 'admin@cannabisos.com',
    name: 'Super Admin',
    password: 'demo123', // Plain text for demo - LOWERCASE
    role: 'ADMIN',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'demo-manager',
    email: 'manager@cannabisos.com',
    name: 'John Manager',
    password: 'demo123', // Plain text for demo - LOWERCASE
    role: 'MANAGER',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'demo-staff',
    email: 'staff@cannabisos.com',
    name: 'Jane Staff',
    password: 'demo123', // Plain text for demo - LOWERCASE
    role: 'STAFF',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'demo-driver',
    email: 'driver@cannabisos.com',
    name: 'Mike Driver',
    password: 'demo123', // Plain text for demo - LOWERCASE
    role: 'DRIVER',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    console.log('Login attempt:', { email: email.toLowerCase(), password: '***' })

    // ALWAYS use demo users - no database dependency
    console.log('Using demo users for login')
    let user = demoUsers.find(u => u.email === email.toLowerCase())

    if (!user) {
      console.log('User not found:', email.toLowerCase())
      return NextResponse.json(
        { 
          error: 'User not found', 
          message: 'No account found with this email address.',
          hint: 'Try: admin@cannabisos.com / demo123',
          availableUsers: demoUsers.map(u => ({
            email: u.email,
            password: 'demo123',
            role: u.role
          }))
        },
        { status: 401 }
      )
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Account inactive', message: 'Your account has been deactivated' },
        { status: 401 }
      )
    }

    // Case-insensitive password comparison for demo
    const isPasswordValid = user.password === password.toLowerCase()
    
    console.log('Password validation:', { 
      isPasswordValid, 
      inputPassword: password.toLowerCase(), 
      storedPassword: user.password 
    })

    if (!isPasswordValid) {
      console.log('Invalid password for user:', email.toLowerCase())
      return NextResponse.json(
        { 
          error: 'Invalid password', 
          message: 'The password you entered is incorrect.',
          hint: 'Password is: demo123 (all lowercase)',
          availableUsers: demoUsers.map(u => ({
            email: u.email,
            password: 'demo123',
            role: u.role
          }))
        },
        { status: 401 }
      )
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    console.log('Login successful for user:', email.toLowerCase())

    return NextResponse.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token,
      redirectTo: '/dashboard' // Explicit redirect
    })

  } catch (error) {
    console.error('Login error:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'An error occurred during login. Please try again.',
        hint: 'Use: admin@cannabisos.com / demo123',
        availableUsers: demoUsers.map(u => ({
          email: u.email,
          password: 'demo123',
          role: u.role
        })),
        details: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
      },
      { status: 500 }
    )
  }
}