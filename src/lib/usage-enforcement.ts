import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { SubscriptionService } from "@/lib/subscription"
import { db } from "@/lib/db"

export interface UsageEnforcementResult {
  allowed: boolean
  reason?: string
  subscription?: any
  usageLimit?: any
}

export class UsageEnforcement {
  // Middleware to enforce usage limits
  static async enforceUsageLimits(
    request: NextRequest,
    requiredFeatures: string[] = []
  ): Promise<UsageEnforcementResult> {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return {
        allowed: false,
        reason: "Authentication required"
      }
    }

    try {
      // Check subscription status
      const subscriptionStatus = await SubscriptionService.getSubscriptionStatus(session.user.id)
      
      if (subscriptionStatus.status !== "ACTIVE") {
        return {
          allowed: false,
          reason: `Subscription not active (status: ${subscriptionStatus.status})`,
          subscription: subscriptionStatus,
        }
      }

      // Check if subscription has expired
      if (subscriptionStatus.endDate && subscriptionStatus.endDate < new Date()) {
        return {
          allowed: false,
          reason: "Subscription has expired",
          subscription: subscriptionStatus,
        }
      }

      // Check required features
      if (requiredFeatures.length > 0) {
        const missingFeatures = requiredFeatures.filter(feature => {
          return !this.hasFeatureAccess(subscriptionStatus.usageLimits, feature)
        })

        if (missingFeatures.length > 0) {
          return {
            allowed: false,
            reason: `Missing required features: ${missingFeatures.join(", ")}`,
            subscription: subscriptionStatus,
            usageLimit: subscriptionStatus.usageLimits,
          }
        }
      }

      // Check specific usage limits
      const usageCheck = await SubscriptionService.checkUsageLimits(session.user.id)
      
      if (!usageCheck.valid) {
        return {
          allowed: false,
          reason: usageCheck.reason,
          subscription: subscriptionStatus,
          usageLimit: subscriptionStatus.usageLimits,
        }
      }

      return {
        allowed: true,
        subscription: subscriptionStatus,
        usageLimit: subscriptionStatus.usageLimits,
      }
    } catch (error) {
      console.error("Usage enforcement error:", error)
      return {
        allowed: false,
        reason: "Failed to verify subscription",
      }
    }
  }

  // Check if user has access to a specific feature
  private static hasFeatureAccess(usageLimits: any, feature: string): boolean {
    const featureMap: Record<string, keyof typeof usageLimits> = {
      "custom-integrations": "customIntegrations",
      "api-access": "apiAccess",
      "white-label": "whiteLabel",
      "dedicated-support": "dedicatedSupport",
      "custom-training": "customTraining",
    }

    const limitKey = featureMap[feature.toLowerCase()]
    if (limitKey) {
      return usageLimits[limitKey] === true
    }

    return true // Default to allowing unknown features
  }

  // Check API rate limits
  static async checkApiRateLimit(userId: string, endpoint: string): Promise<boolean> {
    const subscriptionStatus = await SubscriptionService.getSubscriptionStatus(userId)
    
    if (subscriptionStatus.status !== "ACTIVE" || !subscriptionStatus.usageLimits?.apiAccess) {
      return false
    }

    // Check current API usage in the last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    const apiCallCount = await db.usageLog.count({
      where: {
        userId,
        metricType: "API_CALLS",
        createdAt: { gte: oneHourAgo }
      }
    })

    // Different rate limits based on plan
    const rateLimits = {
      starter: 100,      // 100 calls/hour
      basic: 500,       // 500 calls/hour
      growth: 2000,     // 2,000 calls/hour
      consultant: 5000, // 5,000 calls/hour
      enterprise: 10000 // 10,000 calls/hour
    }

    const planLimit = rateLimits[subscriptionStatus.plan?.id as keyof typeof rateLimits] || 100
    
    return apiCallCount < planLimit
  }

  // Log usage for monitoring
  static async logUsage(
    userId: string,
    subscriptionId: string,
    metricType: string,
    currentValue: number,
    limitValue: number,
    exceeded: boolean,
    description?: string,
    metadata?: any
  ) {
    await db.usageLog.create({
      data: {
        userId,
        subscriptionId,
        metricType: metricType as any,
        currentValue,
        limitValue,
        exceeded,
        description,
        metadata,
      },
    })

    // If limit exceeded, send notification (in real implementation)
    if (exceeded) {
      await this.sendLimitExceededNotification(userId, metricType, currentValue, limitValue)
    }
  }

  // Send notification when limits are exceeded
  private static async sendLimitExceededNotification(
    userId: string,
    metricType: string,
    currentValue: number,
    limitValue: number
  ) {
    // In real implementation, this would send email, SMS, or in-app notification
    console.log(`Usage limit exceeded for user ${userId}:`, {
      metricType,
      currentValue,
      limitValue,
    })

    // Could also create a support ticket or alert admins
  }

  // Middleware wrapper for API routes
  static createUsageMiddleware(requiredFeatures: string[] = []) {
    return async (request: NextRequest, response: NextResponse) => {
      const result = await this.enforceUsageLimits(request, requiredFeatures)
      
      if (!result.allowed) {
        return NextResponse.json(
          { 
            error: result.reason,
            code: "USAGE_LIMIT_EXCEEDED",
            subscription: result.subscription,
            usageLimit: result.usageLimit,
          },
          { status: 403 }
        )
      }

      // Continue with the request
      return response
    }
  }

  // Check if user can perform specific actions
  static async canPerformAction(
    userId: string,
    action: "create_user" | "create_store" | "create_client" | "upgrade_plan" | "cancel_subscription"
  ): Promise<{ allowed: boolean; reason?: string }> {
    const subscriptionStatus = await SubscriptionService.getSubscriptionStatus(userId)
    
    if (subscriptionStatus.status !== "ACTIVE") {
      return {
        allowed: false,
        reason: "Subscription not active"
      }
    }

    const usageLimits = subscriptionStatus.usageLimits
    
    switch (action) {
      case "create_user":
        if (usageLimits.maxUsers > 0) {
          const userCount = await db.user.count({
            where: { 
              storeId: subscriptionStatus.plan?.storeId || undefined,
              isActive: true
            }
          })
          if (userCount >= usageLimits.maxUsers) {
            return {
              allowed: false,
              reason: `User limit reached (${userCount}/${usageLimits.maxUsers})`
            }
          }
        }
        break

      case "create_store":
        if (usageLimits.maxStores > 0) {
          const storeCount = await db.store.count({
            where: { userId, isActive: true }
          })
          if (storeCount >= usageLimits.maxStores) {
            return {
              allowed: false,
              reason: `Store limit reached (${storeCount}/${usageLimits.maxStores})`
            }
          }
        }
        break

      case "create_client":
        if (usageLimits.maxClients > 0) {
          const clientCount = await db.client.count({
            where: { consultantId: userId }
          })
          if (clientCount >= usageLimits.maxClients) {
            return {
              allowed: false,
              reason: `Client limit reached (${clientCount}/${usageLimits.maxClients})`
            }
          }
        }
        break

      case "upgrade_plan":
        // Always allow plan upgrades
        return { allowed: true }

      case "cancel_subscription":
        // Allow cancellation but might require admin approval for certain plans
        return { allowed: true }
    }

    return { allowed: true }
  }
}
