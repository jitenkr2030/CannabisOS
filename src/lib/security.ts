import crypto from 'crypto'
import { NextRequest } from 'next/server'

// Webhook signature verification for Cashfree
export function verifyCashfreeWebhook(payload: string, signature: string, secret: string): boolean {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex')
    
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    )
  } catch (error) {
    console.error('Webhook verification error:', error)
    return false
  }
}

// Rate limiting implementation
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 900000 // 15 minutes
): { allowed: boolean; resetTime: number } {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)

  if (!record || now > record.resetTime) {
    // New window or expired window
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs
    })
    return { allowed: true, resetTime: now + windowMs }
  }

  if (record.count >= maxRequests) {
    return { allowed: false, resetTime: record.resetTime }
  }

  record.count++
  return { allowed: true, resetTime: record.resetTime }
}

// IP-based rate limiting
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const ip = request.ip

  return forwarded?.split(',')[0] || realIP || ip || 'unknown'
}

// Security headers
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
}

// Input sanitization
export function sanitizeInput(input: string): string {
  return input
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim()
}

// SQL injection prevention
export function sanitizeSQL(input: string): string {
  return input
    .replace(/['"\\;]/g, '')
    .replace(/--|\/\*|\*\//g, '')
    .trim()
}

// XSS prevention
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// CSRF token generation
export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

// API key validation
export function validateAPIKey(apiKey: string, expectedKey: string): boolean {
  return crypto.timingSafeEqual(
    Buffer.from(apiKey, 'utf8'),
    Buffer.from(expectedKey, 'utf8')
  )
}

// Request logging for security
export function logSecurityEvent(
  event: string,
  details: Record<string, any>,
  request?: NextRequest
): void {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    details,
    ip: request ? getClientIP(request) : 'unknown',
    userAgent: request?.headers.get('user-agent') || 'unknown',
    url: request?.url || 'unknown',
  }

  // In production, send to logging service
  if (process.env.NODE_ENV === 'production') {
    console.log('SECURITY_EVENT:', JSON.stringify(logEntry))
  } else {
    console.log('SECURITY_EVENT:', logEntry)
  }
}
