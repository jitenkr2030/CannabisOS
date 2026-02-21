import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { SubscriptionService } from "@/lib/subscription"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { planId, billingCycle, customerDetails, paymentMethod } = body

    if (!planId || !billingCycle || !customerDetails) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Get user information
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: { store: true }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Create subscription
    const result = await SubscriptionService.createSubscription(
      user.id,
      planId,
      billingCycle,
      paymentMethod || "cashfree",
      customerDetails
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error("Create subscription error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
