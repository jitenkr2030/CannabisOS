import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { CashfreeService } from "@/lib/cashfree"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { planId, billingCycle, customerDetails } = body

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

    // Generate unique order ID
    const orderId = `order_${user.id}_${planId}_${Date.now()}`

    // Create Cashfree order
    const orderResult = await CashfreeService.createOrder({
      order_id: orderId,
      order_amount: body.amount * 100, // Convert to cents
      order_currency: "USD",
      customer_details: {
        customer_id: user.id,
        customer_name: user.name || "",
        customer_email: user.email,
        customer_phone: customerDetails.customer_phone || "",
      },
      order_meta: {
        plan_name: planId,
        user_id: user.id,
        billing_cycle: billingCycle,
        store_id: user.storeId || "",
      },
    })

    if (!orderResult.success) {
      return NextResponse.json(
        { error: orderResult.error },
        { status: 500 }
      )
    }

    // Save transaction record
    await db.transaction.create({
      data: {
        userId: user.id,
        transactionId: orderId,
        orderId,
        amount: body.amount,
        currency: "USD",
        paymentMethod: customerDetails.payment_method || "cashfree",
        paymentProvider: "CASHFREE",
        status: "PENDING",
        type: "PAYMENT",
        description: `Payment for ${planId} plan (${billingCycle})`,
        metadata: {
          planId,
          billingCycle,
          customerDetails,
        },
      },
    })

    return NextResponse.json({
      success: true,
      orderId,
      paymentSessionId: orderResult.payment_session_id,
      paymentLink: orderResult.payment_session_id,
    })
  } catch (error) {
    console.error("Create order error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
