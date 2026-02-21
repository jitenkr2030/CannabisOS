import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, phone, businessName, businessType } = body

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await db.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name,
        phone: phone || null,
        role: "STAFF", // Default role
        isActive: true,
      },
    })

    // Create store if business information provided
    let store = null
    if (businessName && businessType) {
      store = await db.store.create({
        data: {
          name: businessName,
          address: "",
          phone: phone || "",
          email: email,
          isActive: true,
          userId: user.id,
          storeId: `store_${user.id}_${Date.now()}`,
        },
      })

      // Update user with store reference
      await db.user.update({
        where: { id: user.id },
        data: { storeId: store.id }
      })
    }

    // Create initial subscription (free trial)
    const trialEndDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days trial
    
    await db.subscription.create({
      data: {
        userId: user.id,
        planId: "starter",
        planName: "Starter",
        billingCycle: "MONTHLY",
        amount: 0, // Free trial
        currency: "USD",
        status: "ACTIVE",
        features: ["POS System", "Inventory Management", "Basic Reporting", "Mobile App", "Email Support"],
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
        autoRenew: false,
      },
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        storeId: store?.id || null,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Registration failed" },
      { status: 500 }
    )
  }
}
