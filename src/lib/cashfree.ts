// Build-time safe Cashfree service
import { Cashfree } from "cashfree-sdk";

// Check if we're in a build environment
const isBuildTime = 
  process.env.NEXT_PHASE === 'phase-production-build' || 
  process.env.NEXT_PHASE === 'phase-development-build' ||
  process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === undefined ||
  process.env.BUILD_ID !== undefined || // Vercel build ID
  process.env.VERCEL_ENV !== undefined || // Vercel environment
  process.env.CI === 'true' || // CI environment
  process.env.BUILD_TIME === 'true' ||
  process.env.NEXT_BUILD_ID !== undefined; // Next.js build ID

// Create Cashfree instance only at runtime
let cashfreeInstance: any = null;

const getCashfreeInstance = () => {
  if (isBuildTime) {
    return null;
  }
  
  if (!cashfreeInstance) {
    try {
      cashfreeInstance = new Cashfree({
        environment: process.env.NODE_ENV === "production" ? "production" : "sandbox",
        clientId: process.env.CASHFREE_CLIENT_ID || "dummy_client_id",
        clientSecret: process.env.CASHFREE_CLIENT_SECRET || "dummy_client_secret",
        apiVersion: "2022-09-01",
      });
    } catch (error) {
      console.error("Failed to initialize Cashfree:", error);
      return null;
    }
  }
  
  return cashfreeInstance;
};

export interface CreateOrderRequest {
  order_id: string;
  order_amount: number;
  order_currency: string;
  customer_details: {
    customer_id: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
  };
  order_meta?: {
    plan_name: string;
    user_id: string;
    billing_cycle: "monthly" | "yearly";
  };
}

export interface SubscriptionRequest {
  subscription_id: string;
  subscription_amount: number;
  subscription_currency: string;
  plan_id: string;
  customer_details: {
    customer_id: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
  };
  subscription_meta?: {
    user_id: string;
    plan_name: string;
    billing_cycle: "monthly" | "yearly";
  };
}

export class CashfreeService {
  // Create a one-time payment order
  static async createOrder(orderData: CreateOrderRequest) {
    // Skip Cashfree operations during build time
    if (isBuildTime) {
      return {
        success: false,
        error: "Cashfree service not available during build time",
      };
    }

    try {
      const cashfree = getCashfreeInstance();
      if (!cashfree) {
        return {
          success: false,
          error: "Cashfree service not initialized",
        };
      }

      const order = await cashfree.orders.create({
        order_id: orderData.order_id,
        order_amount: orderData.order_amount,
        order_currency: orderData.order_currency,
        customer_details: orderData.customer_details,
        order_meta: orderData.order_meta,
        order_note: "CannabisOS Subscription",
        order_tags: ["subscription", "cannabisos"],
      });

      return {
        success: true,
        data: order,
        payment_session_id: order.payment_session_id,
      };
    } catch (error) {
      console.error("Cashfree order creation error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create order",
      };
    }
  }

  // Create subscription order
  static async createSubscription(subscriptionData: SubscriptionRequest) {
    // Skip Cashfree operations during build time
    if (isBuildTime) {
      return {
        success: false,
        error: "Cashfree service not available during build time",
      };
    }

    try {
      const cashfree = getCashfreeInstance();
      if (!cashfree) {
        return {
          success: false,
          error: "Cashfree service not initialized",
        };
      }

      const subscription = await cashfree.subscriptions.create({
        subscription_id: subscriptionData.subscription_id,
        subscription_amount: subscriptionData.subscription_amount,
        subscription_currency: subscriptionData.subscription_currency,
        plan_id: subscriptionData.plan_id,
        customer_details: subscriptionData.customer_details,
        subscription_meta: subscriptionData.subscription_meta,
        subscription_note: "CannabisOS Recurring Subscription",
        subscription_tags: ["subscription", "cannabisos", "recurring"],
      });

      return {
        success: true,
        data: subscription,
        payment_session_id: subscription.payment_session_id,
      };
    } catch (error) {
      console.error("Cashfree subscription creation error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create subscription",
      };
    }
  }

  // Verify payment status
  static async verifyPayment(orderId: string) {
    // Skip Cashfree operations during build time
    if (isBuildTime) {
      return {
        success: false,
        error: "Cashfree service not available during build time",
      };
    }

    try {
      const cashfree = getCashfreeInstance();
      if (!cashfree) {
        return {
          success: false,
          error: "Cashfree service not initialized",
        };
      }

      const order = await cashfree.orders.get({ orderId });
      
      return {
        success: true,
        data: order,
        status: order.order_status,
        payment_status: order.payment_status,
      };
    } catch (error) {
      console.error("Cashfree payment verification error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to verify payment",
      };
    }
  }

  // Cancel subscription
  static async cancelSubscription(subscriptionId: string) {
    // Skip Cashfree operations during build time
    if (isBuildTime) {
      return {
        success: false,
        error: "Cashfree service not available during build time",
      };
    }

    try {
      const cashfree = getCashfreeInstance();
      if (!cashfree) {
        return {
          success: false,
          error: "Cashfree service not initialized",
        };
      }

      const subscription = await cashfree.subscriptions.cancel({
        subscriptionId,
        cancel_reason: "Customer requested cancellation",
      });

      return {
        success: true,
        data: subscription,
      };
    } catch (error) {
      console.error("Cashfree subscription cancellation error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to cancel subscription",
      };
    }
  }

  // Get payment link
  static getPaymentLink(orderData: CreateOrderRequest) {
    const paymentLink = `https://payments.cashfree.com/order/pay?order_id=${orderData.order_id}&payment_session_id=${orderData.order_id}`;
    return paymentLink;
  }
}

// Plan configurations for Cashfree
export const CASHFREE_PLANS = {
  starter: {
    plan_id: "cannabisos_starter_monthly",
    plan_id_yearly: "cannabisos_starter_yearly",
    amount: 9900, // $99 in cents
    amount_yearly: 99900, // $999 in cents
  },
  basic: {
    plan_id: "cannabisos_basic_monthly",
    plan_id_yearly: "cannabisos_basic_yearly",
    amount: 19900, // $199 in cents
    amount_yearly: 199900, // $1,999 in cents
  },
  growth: {
    plan_id: "cannabisos_growth_monthly",
    plan_id_yearly: "cannabisos_growth_yearly",
    amount: 29900, // $299 in cents
    amount_yearly: 299900, // $2,999 in cents
  },
  consultant: {
    plan_id: "cannabisos_consultant_monthly",
    plan_id_yearly: "cannabisos_consultant_yearly",
    amount: 39900, // $399 in cents
    amount_yearly: 399900, // $3,999 in cents
  },
  enterprise: {
    plan_id: "cannabisos_enterprise_monthly",
    plan_id_yearly: "cannabisos_enterprise_yearly",
    amount: 49900, // $499 in cents
    amount_yearly: 499900, // $4,999 in cents
  },
};
