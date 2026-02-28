import { db } from "./db"
import { CashfreeService, CASHFREE_PLANS } from "./cashfree"

export interface SubscriptionPlan {
  id: string
  name: string
  slug: string
  price: number
  yearlyPrice: number
  features: string[]
  maxUsers: number
  maxStores: number
  maxClients: number
  customIntegrations: boolean
  apiAccess: boolean
  whiteLabel: boolean
  dedicatedSupport: boolean
  customTraining: boolean
}

export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
  starter: {
    id: "starter",
    name: "Starter",
    slug: "starter",
    price: 99,
    yearlyPrice: 999,
    features: ["POS System", "Inventory Management", "Basic Reporting", "Mobile App", "Email Support"],
    maxUsers: 2,
    maxStores: 1,
    maxClients: 0,
    customIntegrations: false,
    apiAccess: false,
    whiteLabel: false,
    dedicatedSupport: false,
    customTraining: false,
  },
  basic: {
    id: "basic",
    name: "Basic",
    slug: "basic",
    price: 199,
    yearlyPrice: 1999,
    features: ["Everything in Starter", "Advanced POS Features", "Inventory Analytics", "Customer Management"],
    maxUsers: 5,
    maxStores: 2,
    maxClients: 0,
    customIntegrations: false,
    apiAccess: false,
    whiteLabel: false,
    dedicatedSupport: false,
    customTraining: false,
  },
  growth: {
    id: "growth",
    name: "Growth",
    slug: "growth",
    price: 299,
    yearlyPrice: 2999,
    features: ["Everything in Basic", "Multi-Store Support", "Advanced Reporting", "Delivery Management", "QR Authentication"],
    maxUsers: 15,
    maxStores: 10,
    maxClients: 0,
    customIntegrations: false,
    apiAccess: true,
    whiteLabel: false,
    dedicatedSupport: false,
    customTraining: false,
  },
  consultant: {
    id: "consultant",
    name: "Consultant",
    slug: "consultant",
    price: 399,
    yearlyPrice: 3999,
    features: ["Everything in Growth", "Multi-Client Management", "White-Label Branding", "Client Onboarding"],
    maxUsers: -1, // Unlimited
    maxStores: -1, // Unlimited
    maxClients: -1, // Unlimited
    customIntegrations: true,
    apiAccess: true,
    whiteLabel: true,
    dedicatedSupport: false,
    customTraining: false,
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    slug: "enterprise",
    price: 499,
    yearlyPrice: 4999,
    features: ["Everything in Consultant", "Unlimited Locations", "Custom Integrations", "Advanced Analytics"],
    maxUsers: -1, // Unlimited
    maxStores: -1, // Unlimited
    maxClients: -1, // Unlimited
    customIntegrations: true,
    apiAccess: true,
    whiteLabel: true,
    dedicatedSupport: true,
    customTraining: true,
  },
}

export class SubscriptionService {
  // Create or update subscription
  static async createSubscription(
    userId: string,
    planId: string,
    billingCycle: "monthly" | "yearly",
    paymentMethod: string,
    customerDetails: {
      customer_id: string
      customer_name: string
      customer_email: string
      customer_phone: string
    }
  ) {
    const plan = SUBSCRIPTION_PLANS[planId]
    if (!plan) {
      throw new Error("Invalid plan ID")
    }

    const amount = billingCycle === "yearly" ? plan.yearlyPrice : plan.price
    const orderId = `sub_${userId}_${planId}_${Date.now()}`
    const subscriptionId = `sub_${userId}_${planId}_${Date.now()}`

    try {
      // Create Cashfree subscription
      const subscriptionResult = await CashfreeService.createSubscription({
        subscription_id: subscriptionId,
        subscription_amount: amount * 100, // Convert to cents
        subscription_currency: "USD",
        plan_id: CASHFREE_PLANS[planId as keyof typeof CASHFREE_PLANS][
          billingCycle === "yearly" ? "plan_id_yearly" : "plan_id"
        ],
        customer_details,
        subscription_meta: {
          user_id: userId,
          plan_name: plan.name,
          billing_cycle: billingCycle,
        },
      })

      if (!subscriptionResult.success) {
        throw new Error(subscriptionResult.error || "Failed to create subscription")
      }

      // Save subscription to database
      const subscription = await db.subscription.create({
        data: {
          userId,
          planId,
          planName: plan.name,
          billingCycle,
          amount,
          currency: "USD",
          status: "PENDING",
          subscriptionId: subscriptionResult.data.subscription_id,
          paymentSessionId: subscriptionResult.payment_session_id,
          customerDetails,
          features: plan.features,
          maxUsers: plan.maxUsers,
          maxStores: plan.maxStores,
          maxClients: plan.maxClients,
          customIntegrations: plan.customIntegrations,
          apiAccess: plan.apiAccess,
          whiteLabel: plan.whiteLabel,
          dedicatedSupport: plan.dedicatedSupport,
          customTraining: plan.customTraining,
          startDate: new Date(),
          endDate: new Date(Date.now() + (billingCycle === "yearly" ? 365 : 30) * 24 * 60 * 60 * 1000),
          nextBillingDate: new Date(Date.now() + (billingCycle === "yearly" ? 365 : 30) * 24 * 60 * 60 * 1000),
        },
      })

      return {
        success: true,
        subscription,
        paymentLink: subscriptionResult.payment_session_id,
      }
    } catch (error) {
      console.error("Subscription creation error:", error)
      throw error
    }
  }

  // Upgrade or downgrade subscription
  static async updateSubscription(
    subscriptionId: string,
    newPlanId: string,
    billingCycle: "monthly" | "yearly"
  ) {
    const subscription = await db.subscription.findUnique({
      where: { id: subscriptionId },
      include: { user: true }
    })

    if (!subscription) {
      throw new Error("Subscription not found")
    }

    const newPlan = SUBSCRIPTION_PLANS[newPlanId]
    if (!newPlan) {
      throw new Error("Invalid plan ID")
    }

    const amount = billingCycle === "yearly" ? newPlan.yearlyPrice : newPlan.price
    const orderId = `update_${subscriptionId}_${Date.now()}`

    try {
      // Create Cashfree order for plan change
      const orderResult = await CashfreeService.createOrder({
        order_id: orderId,
        order_amount: amount * 100,
        order_currency: "USD",
        customer_details: {
          customer_id: subscription.userId,
          customer_name: subscription.user.name || "",
          customer_email: subscription.user.email,
          customer_phone: subscription.user.phone || "",
        },
        order_meta: {
          plan_name: newPlan.name,
          user_id: subscription.userId,
          billing_cycle: billingCycle,
          subscription_update: "true",
        },
      })

      if (!orderResult.success) {
        throw new Error(orderResult.error || "Failed to create order for plan update")
      }

      // Update subscription in database
      const updatedSubscription = await db.subscription.update({
        where: { id: subscriptionId },
        data: {
          planId: newPlanId,
          planName: newPlan.name,
          billingCycle,
          amount,
          features: newPlan.features,
          maxUsers: newPlan.maxUsers,
          maxStores: newPlan.maxStores,
          maxClients: newPlan.maxClients,
          customIntegrations: newPlan.customIntegrations,
          apiAccess: newPlan.apiAccess,
          whiteLabel: newPlan.whiteLabel,
          dedicatedSupport: newPlan.dedicatedSupport,
          customTraining: newPlan.customTraining,
          paymentSessionId: orderResult.payment_session_id,
          updatedAt: new Date(),
        },
      })

      return {
        success: true,
        subscription: updatedSubscription,
        paymentLink: orderResult.payment_session_id,
      }
    } catch (error) {
      console.error("Subscription update error:", error)
      throw error
    }
  }

  // Cancel subscription
  static async cancelSubscription(subscriptionId: string, reason: string) {
    const subscription = await db.subscription.findUnique({
      where: { id: subscriptionId }
    })

    if (!subscription) {
      throw new Error("Subscription not found")
    }

    try {
      // Cancel Cashfree subscription
      if (subscription.subscriptionId) {
        await CashfreeService.cancelSubscription(subscription.subscriptionId)
      }

      // Update subscription status
      const updatedSubscription = await db.subscription.update({
        where: { id: subscriptionId },
        data: {
          status: "CANCELLED",
          cancelledAt: new Date(),
          cancellationReason: reason,
          endDate: new Date(),
        },
      })

      return {
        success: true,
        subscription: updatedSubscription,
      }
    } catch (error) {
      console.error("Subscription cancellation error:", error)
      throw error
    }
  }

  // Check subscription limits and enforce them
  static async checkUsageLimits(userId: string) {
    const subscription = await db.subscription.findFirst({
      where: { 
        userId,
        status: "ACTIVE",
        OR: [
          { endDate: { gte: new Date() } },
          { endDate: null }
        ]
      },
      orderBy: { createdAt: "desc" }
    })

    if (!subscription) {
      return {
        valid: false,
        reason: "No active subscription found",
        plan: null,
      }
    }

    const plan = SUBSCRIPTION_PLANS[subscription.planId]
    if (!plan) {
      return {
        valid: false,
        reason: "Invalid plan configuration",
        plan: null,
      }
    }

    // Check user count
    if (plan.maxUsers > 0) {
      const userCount = await db.user.count({
        where: { 
          storeId: subscription.user.storeId || undefined,
          isActive: true
        }
      })

      if (userCount > plan.maxUsers) {
        return {
          valid: false,
          reason: `User limit exceeded (${userCount}/${plan.maxUsers})`,
          plan,
        }
      }
    }

    // Check store count
    if (plan.maxStores > 0) {
      const storeCount = await db.store.count({
        where: { 
          userId: subscription.userId,
          isActive: true
        }
      })

      if (storeCount > plan.maxStores) {
        return {
          valid: false,
          reason: `Store limit exceeded (${storeCount}/${plan.maxStores})`,
          plan,
        }
      }
    }

    // Check client count (for consultants)
    if (plan.maxClients > 0 && subscription.user.role === "CONSULTANT") {
      const clientCount = await db.client.count({
        where: { consultantId: subscription.userId }
      })

      if (clientCount > plan.maxClients) {
        return {
          valid: false,
          reason: `Client limit exceeded (${clientCount}/${plan.maxClients})`,
          plan,
        }
      }
    }

    return {
      valid: true,
      reason: "All limits within bounds",
      plan,
    }
  }

  // Get subscription status
  static async getSubscriptionStatus(userId: string) {
    const subscription = await db.subscription.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { user: true }
    })

    if (!subscription) {
      return {
        status: "NO_SUBSCRIPTION",
        plan: null,
        endDate: null,
        autoRenew: false,
      }
    }

    const plan = SUBSCRIPTION_PLANS[subscription.planId]
    const isActive = subscription.status === "ACTIVE" && 
      (!subscription.endDate || subscription.endDate > new Date())

    return {
      status: isActive ? "ACTIVE" : subscription.status,
      plan,
      endDate: subscription.endDate,
      autoRenew: subscription.autoRenew,
      billingCycle: subscription.billingCycle,
      nextBillingDate: subscription.nextBillingDate,
      usageLimits: {
        maxUsers: plan.maxUsers,
        maxStores: plan.maxStores,
        maxClients: plan.maxClients,
        customIntegrations: plan.customIntegrations,
        apiAccess: plan.apiAccess,
        whiteLabel: plan.whiteLabel,
        dedicatedSupport: plan.dedicatedSupport,
        customTraining: plan.customTraining,
      },
    }
  }

  // Handle webhook events from Cashfree
  static async handleWebhook(event: any) {
    const { event_type, data } = event

    switch (event_type) {
      case "PAYMENT_SUCCESS":
        await this.handlePaymentSuccess(data)
        break
      case "PAYMENT_FAILED":
        await this.handlePaymentFailed(data)
        break
      case "SUBSCRIPTION_ACTIVATED":
        await this.handleSubscriptionActivated(data)
        break
      case "SUBSCRIPTION_CANCELLED":
        await this.handleSubscriptionCancelled(data)
        break
      default:
        console.log("Unhandled webhook event:", event_type)
    }
  }

  private static async handlePaymentSuccess(data: any) {
    const { order_id, order_status } = data
    
    // Update subscription status
    await db.subscription.updateMany({
      where: { paymentSessionId: order_id },
      data: { 
        status: order_status === "PAID" ? "ACTIVE" : "PENDING",
        updatedAt: new Date()
      }
    })
  }

  private static async handlePaymentFailed(data: any) {
    const { order_id } = data
    
    // Update subscription status
    await db.subscription.updateMany({
      where: { paymentSessionId: order_id },
      data: { 
        status: "FAILED",
        updatedAt: new Date()
      }
    })
  }

  private static async handleSubscriptionActivated(data: any) {
    const { subscription_id } = data
    
    // Update subscription status
    await db.subscription.updateMany({
      where: { subscriptionId: subscription_id },
      data: { 
        status: "ACTIVE",
        activatedAt: new Date(),
        updatedAt: new Date()
      }
    })
  }

  private static async handleSubscriptionCancelled(data: any) {
    const { subscription_id } = data
    
    // Update subscription status
    await db.subscription.updateMany({
      where: { subscriptionId: subscription_id },
      data: { 
        status: "CANCELLED",
        cancelledAt: new Date(),
        updatedAt: new Date()
      }
    })
  }
}
