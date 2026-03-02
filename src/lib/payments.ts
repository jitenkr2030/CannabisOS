import { Cashfree } from 'cashfree-pg'
import Stripe from 'stripe'
import Razorpay from 'razorpay'

// Check if payment providers are configured
const isCashfreeConfigured = !!process.env.CASHFREE_APP_ID && !!process.env.CASHFREE_SECRET_KEY
const isStripeConfigured = !!process.env.STRIPE_SECRET_KEY
const isRazorpayConfigured = !!process.env.RAZORPAY_KEY_ID && !!process.env.RAZORPAY_KEY_SECRET

// Cashfree Configuration (only if configured)
let cashfree: Cashfree | null = null
if (isCashfreeConfigured) {
  try {
    cashfree = new Cashfree({
      appId: process.env.CASHFREE_APP_ID!,
      secretKey: process.env.CASHFREE_SECRET_KEY!,
      environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox'
    })
  } catch (error) {
    console.warn('Cashfree configuration failed:', error)
  }
}

// Stripe Configuration (only if configured)
let stripe: Stripe | null = null
if (isStripeConfigured) {
  try {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16',
    })
  } catch (error) {
    console.warn('Stripe configuration failed:', error)
  }
}

// Razorpay Configuration (only if configured)
let razorpay: Razorpay | null = null
if (isRazorpayConfigured) {
  try {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    })
  } catch (error) {
    console.warn('Razorpay configuration failed:', error)
  }
}

export interface PaymentRequest {
  amount: number
  currency: string
  customerEmail: string
  customerName: string
  customerPhone: string
  paymentMethod: 'cashfree' | 'stripe' | 'razorpay'
  orderId?: string
  description?: string
}

export interface PaymentResponse {
  success: boolean
  paymentId?: string
  orderId?: string
  paymentUrl?: string
  error?: string
  provider: string
}

// Cashfree Payment
export async function createCashfreePayment(request: PaymentRequest): Promise<PaymentResponse> {
  if (!cashfree || !isCashfreeConfigured) {
    return {
      success: false,
      error: 'Cashfree payment provider is not configured',
      provider: 'cashfree'
    }
  }

  try {
    const orderId = request.orderId || `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const orderData = {
      order_amount: request.amount,
      order_currency: request.currency,
      customer_details: {
        customer_id: `cust_${Date.now()}`,
        customer_name: request.customerName,
        customer_email: request.customerEmail,
        customer_phone: request.customerPhone,
      },
      order_meta: {
        return_url: `${process.env.NEXTAUTH_URL || 'https://cannabisos.com'}/payments/success`,
        notify_url: `${process.env.NEXTAUTH_URL || 'https://cannabisos.com'}/api/payments/cashfree/webhook`,
      }
    }

    const response = await cashfree.createOrder(orderData)
    
    if (response.status === 'OK') {
      return {
        success: true,
        orderId: response.data.order_id,
        paymentUrl: response.data.payment_link,
        provider: 'cashfree'
      }
    } else {
      return {
        success: false,
        error: response.message || 'Failed to create Cashfree order',
        provider: 'cashfree'
      }
    }
  } catch (error) {
    console.error('Cashfree payment error:', error)
    return {
      success: false,
      error: 'Failed to create Cashfree payment',
      provider: 'cashfree'
    }
  }
}

// Stripe Payment
export async function createStripePayment(request: PaymentRequest): Promise<PaymentResponse> {
  if (!stripe || !isStripeConfigured) {
    return {
      success: false,
      error: 'Stripe payment provider is not configured',
      provider: 'stripe'
    }
  }

  try {
    const orderId = request.orderId || `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: request.currency.toLowerCase(),
            product_data: {
              name: request.description || 'Payment',
              description: `Order ${orderId}`,
            },
            unit_amount: request.amount * 100, // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL || 'https://cannabisos.com'}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL || 'https://cannabisos.com'}/payments/cancel`,
      customer_email: request.customerEmail,
      metadata: {
        orderId,
        customerName: request.customerName,
        customerPhone: request.customerPhone
      }
    })

    return {
      success: true,
      paymentId: session.id,
      paymentUrl: session.url,
      provider: 'stripe'
    }
  } catch (error) {
    console.error('Stripe payment error:', error)
    return {
      success: false,
      error: 'Failed to create Stripe payment',
      provider: 'stripe'
    }
  }
}

// Razorpay Payment
export async function createRazorpayPayment(request: PaymentRequest): Promise<PaymentResponse> {
  if (!razorpay || !isRazorpayConfigured) {
    return {
      success: false,
      error: 'Razorpay payment provider is not configured',
      provider: 'razorpay'
    }
  }

  try {
    const orderId = request.orderId || `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const options = {
      amount: request.amount * 100, // Razorpay uses paise
      currency: request.currency,
      receipt: orderId,
      notes: {
        customerName: request.customerName,
        customerEmail: request.customerEmail,
        customerPhone: request.customerPhone,
        description: request.description || 'Payment'
      }
    }

    const order = await razorpay.orders.create(options)

    return {
      success: true,
      orderId: order.id,
      paymentId: order.id,
      provider: 'razorpay',
      // Note: In a real implementation, you would create a payment link or use Razorpay's checkout
      paymentUrl: `https://api.razorpay.com/v1/checkout/${order.id}`
    }
  } catch (error) {
    console.error('Razorpay payment error:', error)
    return {
      success: false,
      error: 'Failed to create Razorpay payment',
      provider: 'razorpay'
    }
  }
}

// Verify Payment
export async function verifyPayment(provider: string, paymentId: string, orderId: string): Promise<PaymentResponse> {
  try {
    switch (provider) {
      case 'cashfree':
        if (!cashfree || !isCashfreeConfigured) {
          return {
            success: false,
            error: 'Cashfree provider not configured',
            provider: 'cashfree'
          }
        }
        const cfResponse = await cashfree.getOrderDetails({ orderId })
        if (cfResponse.status === 'OK' && cfResponse.data.order_status === 'PAID') {
          return {
            success: true,
            paymentId,
            orderId,
            provider: 'cashfree'
          }
        }
        break
        
      case 'stripe':
        if (!stripe || !isStripeConfigured) {
          return {
            success: false,
            error: 'Stripe provider not configured',
            provider: 'stripe'
          }
        }
        const session = await stripe.checkout.sessions.retrieve(paymentId)
        if (session.payment_status === 'paid') {
          return {
            success: true,
            paymentId,
            orderId,
            provider: 'stripe'
          }
        }
        break
        
      case 'razorpay':
        if (!razorpay || !isRazorpayConfigured) {
          return {
            success: false,
            error: 'Razorpay provider not configured',
            provider: 'razorpay'
          }
        }
        const payment = await razorpay.payments.fetch(paymentId)
        if (payment.status === 'captured') {
          return {
            success: true,
            paymentId,
            orderId,
            provider: 'razorpay'
          }
        }
        break
    }
    
    return {
      success: false,
      error: 'Payment not verified',
      provider
    }
  } catch (error) {
    console.error('Payment verification error:', error)
    return {
      success: false,
      error: 'Failed to verify payment',
      provider
    }
  }
}

// Create Payment (unified function)
export async function createPayment(request: PaymentRequest): Promise<PaymentResponse> {
  switch (request.paymentMethod) {
    case 'cashfree':
      return createCashfreePayment(request)
    case 'stripe':
      return createStripePayment(request)
    case 'razorpay':
      return createRazorpayPayment(request)
    default:
      return {
        success: false,
        error: 'Unsupported payment method',
        provider: request.paymentMethod
      }
  }
}

// Get available payment providers
export function getAvailableProviders(): string[] {
  const providers = []
  if (isCashfreeConfigured) providers.push('cashfree')
  if (isStripeConfigured) providers.push('stripe')
  if (isRazorpayConfigured) providers.push('razorpay')
  return providers
}

// Check if any payment provider is configured
export function isPaymentConfigured(): boolean {
  return isCashfreeConfigured || isStripeConfigured || isRazorpayConfigured
}