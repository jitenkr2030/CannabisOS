// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { UserRegistrationSchema } from "@/lib/validation"
import { validateInput } from "@/lib/errors"
import { rateLimit, getClientIP } from "@/lib/security"
import { logSecurityEvent } from "@/lib/security"

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIP(request)
    const rateLimitResult = rateLimit(ip, 5, 300000) // 5 requests per 5 minutes
    
    if (!rateLimitResult.allowed) {
      logSecurityEvent('RATE_LIMIT_EXCEEDED', { ip, resetTime: rateLimitResult.resetTime }, request)
      return NextResponse.json(
        { 
          success: false,
          error: "RateLimitError",
          message: `Too many requests. Try again at ${new Date(rateLimitResult.resetTime).toLocaleString()}` 
        },
        { status: 429 }
      )
    }

    // Validate input
    const body = await request.json()
    const validatedData = validateInput(UserRegistrationSchema, body)
    
    const { email, password, name, phone, businessName, businessType } = validatedData

    // Sanitize inputs
    const sanitizedEmail = email.toLowerCase().trim()
    const sanitizedName = name.trim()

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: sanitizedEmail }
    })

    if (existingUser) {
      logSecurityEvent('DUPLICATE_REGISTRATION', { email: sanitizedEmail, ip }, request)
      return NextResponse.json(
        { 
          success: false,
          error: "ValidationError",
          message: "User with this email already exists" 
        },
        { status: 400 }
      )
    }

    // Hash password with bcrypt
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create user
    const user = await db.user.create({
      data: {
        email: sanitizedEmail,
        password: hashedPassword,
        name: sanitizedName,
        phone: phone?.trim(),
        role: "STAFF",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })

    // Create store if business information provided
    let store = null
    if (businessName && businessType) {
      store = await db.store.create({
        data: {
          name: businessName.trim(),
          address: "",
          phone: phone?.trim() || "",
          email: sanitizedEmail,
          isActive: true,
          userId: user.id,
          storeId: `store_${user.id}_${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })

      // Update user with store reference
      if (store && 'id' in store) {
        await db.user.update({
          where: { id: user.id },
          data: { storeId: (store as any).id }
        })
      }
    }

    // Create initial subscription (free trial)
    const trialEndDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days trial
    
    const subscription = await db.subscription.create({
      data: {
        userId: user.id,
        planId: "starter",
        planName: "Starter",
        billingCycle: "MONTHLY",
        amount: 0,
        currency: "USD",
        status: "ACTIVE",
        subscriptionId: `sub_${user.id}_${Date.now()}`,
        maxUsers: 2,
        maxStores: 1,
        maxClients: 0,
        customIntegrations: false,
        apiAccess: false,
        whiteLabel: false,
        dedicatedSupport: false,
        customTraining: false,
        startDate: new Date(),
        endDate: trialEndDate,
        nextBillingDate: trialEndDate,
        activatedAt: new Date(),
        autoRenew: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })

    // Log successful registration
    logSecurityEvent('USER_REGISTERED', { 
      userId: user.id, 
      email: sanitizedEmail, 
      name: sanitizedName,
      businessName,
      businessType,
      ip 
    }, request)

    // Return success response (without sensitive data)
    return NextResponse.json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          createdAt: user.createdAt,
        },
        subscription: {
          id: subscription.id,
          planId: subscription.planId,
          planName: subscription.planName,
          status: subscription.status,
          endDate: subscription.endDate,
        },
        store: store ? {
          id: (store as any).id,
          name: (store as any).name,
        } : null,
      },
    })

  } catch (error) {
    console.error('Registration error:', error)
    logSecurityEvent('REGISTRATION_ERROR', { error: error.message, ip }, request)
    
    return NextResponse.json(
      { 
        success: false,
        error: "InternalServerError",
        message: "Registration failed. Please try again." 
      },
      { status: 500 }
    )
  }
}
