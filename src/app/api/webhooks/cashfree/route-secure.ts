import { NextRequest, NextResponse } from "next/server"
import { SubscriptionService } from "@/lib/subscription"
import { verifyCashfreeWebhook, logSecurityEvent, getClientIP } from "@/lib/security"
import { createErrorResponse } from "@/lib/errors"

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const ip = getClientIP(request)
  
  try {
    // Get request body and headers
    const body = await request.text()
    const signature = request.headers.get('x-webhook-signature') || ''
    const eventId = request.headers.get('x-webhook-event-id') || 'unknown'
    
    // Verify required headers
    if (!signature) {
      logSecurityEvent('WEBHOOK_MISSING_SIGNATURE', { ip, eventId }, request)
      return createErrorResponse(
        new Error('Missing webhook signature'),
        401
      )
    }

    // Get webhook secret
    const secret = process.env.CASHFREE_WEBHOOK_SECRET
    if (!secret) {
      console.error('CASHFREE_WEBHOOK_SECRET not configured')
      return createErrorResponse(
        new Error('Webhook secret not configured'),
        500
      )
    }

    // Verify webhook signature
    if (!verifyCashfreeWebhook(body, signature, secret)) {
      logSecurityEvent('WEBHOOK_INVALID_SIGNATURE', { 
        ip, 
        eventId, 
        signatureLength: signature.length,
        bodyLength: body.length 
      }, request)
      return createErrorResponse(
        new Error('Invalid webhook signature'),
        401
      )
    }

    // Parse and validate event data
    let event
    try {
      event = JSON.parse(body)
    } catch (parseError) {
      logSecurityEvent('WEBHOOK_INVALID_JSON', { 
        ip, 
        eventId, 
        error: parseError.message,
        bodyPreview: body.substring(0, 200) 
      }, request)
      return createErrorResponse(
        new Error('Invalid JSON in webhook body'),
        400
      )
    }

    // Validate event structure
    if (!event.event_type || !event.data) {
      logSecurityEvent('WEBHOOK_INVALID_STRUCTURE', { 
        ip, 
        eventId, 
        eventType: event.event_type,
        hasData: !!event.data 
      }, request)
      return createErrorResponse(
        new Error('Invalid webhook event structure'),
        400
      )
    }

    // Log webhook receipt
    logSecurityEvent('WEBHOOK_RECEIVED', {
      ip,
      eventId,
      eventType: event.event_type,
      processingTime: Date.now() - startTime
    }, request)

    // Process webhook event
    const result = await SubscriptionService.handleWebhook(event)
    
    // Log successful processing
    logSecurityEvent('WEBHOOK_PROCESSED', {
      ip,
      eventId,
      eventType: event.event_type,
      result,
      processingTime: Date.now() - startTime
    }, request)

    return NextResponse.json({
      success: true,
      received: true,
      eventId,
      eventType: event.event_type,
      processingTime: Date.now() - startTime
    })

  } catch (error) {
    const processingTime = Date.now() - startTime
    console.error('Webhook processing error:', error)
    
    logSecurityEvent('WEBHOOK_PROCESSING_ERROR', {
      ip,
      eventId: request.headers.get('x-webhook-event-id') || 'unknown',
      error: error.message,
      processingTime
    }, request)
    
    return createErrorResponse(
      new Error('Webhook processing failed'),
      500
    )
  }
}

// Handle webhook verification endpoint
export async function GET(request: NextRequest) {
  try {
    // Simple health check for webhook endpoint
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'cashfree-webhook',
      version: '1.0.0'
    })
  } catch (error) {
    return createErrorResponse(error, 500)
  }
}
