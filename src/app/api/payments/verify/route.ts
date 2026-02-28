// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

import { NextRequest, NextResponse } from 'next/server'
import { verifyPayment, isPaymentConfigured, getAvailableProviders } from '@/lib/payments'

export async function POST(request: NextRequest) {
  try {
    // Check if any payment provider is configured
    if (!isPaymentConfigured()) {
      return NextResponse.json({
        success: false,
        error: 'No payment providers are configured',
        message: 'Payment verification is not available. Please configure payment providers in your environment variables.',
        availableProviders: getAvailableProviders(),
        requiredEnvVars: {
          cashfree: ['CASHFREE_APP_ID', 'CASHFREE_SECRET_KEY'],
          stripe: ['STRIPE_SECRET_KEY'],
          razorpay: ['RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET']
        }
      }, { status: 503 })
    }

    const body = await request.json()
    const { provider, paymentId, orderId } = body

    // Validate required fields
    if (!provider || !paymentId || !orderId) {
      return NextResponse.json(
        { error: 'Provider, payment ID, and order ID are required' },
        { status: 400 }
      )
    }

    // Verify payment with provider
    const verificationResult = await verifyPayment(provider, paymentId, orderId)

    return NextResponse.json(verificationResult)

  } catch (error) {
    console.error('Verify payment error:', error)
    return NextResponse.json(
      { error: 'Failed to verify payment', details: error.message },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const availableProviders = getAvailableProviders()
    const configured = isPaymentConfigured()

    return NextResponse.json({
      configured,
      availableProviders,
      message: configured 
        ? 'Payment providers are configured and ready' 
        : 'No payment providers are configured. Please set up payment provider environment variables.',
      providers: {
        cashfree: {
          configured: !!process.env.CASHFREE_APP_ID && !!process.env.CASHFREE_SECRET_KEY,
          envVars: ['CASHFREE_APP_ID', 'CASHFREE_SECRET_KEY']
        },
        stripe: {
          configured: !!process.env.STRIPE_SECRET_KEY,
          envVars: ['STRIPE_SECRET_KEY']
        },
        razorpay: {
          configured: !!process.env.RAZORPAY_KEY_ID && !!process.env.RAZORPAY_KEY_SECRET,
          envVars: ['RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET']
        }
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to check payment configuration', details: error.message },
      { status: 500 }
    )
  }
}