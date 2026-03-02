import { NextResponse } from 'next/server'

// Custom error classes
export class ValidationError extends Error {
  constructor(message: string, public details?: any) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthorizationError'
  }
}

export class DatabaseError extends Error {
  constructor(message: string, public originalError?: Error) {
    super(message)
    this.name = 'DatabaseError'
  }
}

export class PaymentError extends Error {
  constructor(message: string, public code?: string) {
    super(message)
    this.name = 'PaymentError'
  }
}

export class RateLimitError extends Error {
  constructor(message: string, public resetTime?: number) {
    super(message)
    this.name = 'RateLimitError'
  }
}

// Error response helper
export function createErrorResponse(
  error: Error,
  status: number = 500
): NextResponse {
  // Log error for debugging
  console.error('API Error:', {
    name: error.name,
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
  })

  // Don't expose internal errors in production
  const isDevelopment = process.env.NODE_ENV !== 'production'
  
  let errorMessage = error.message
  let errorDetails = undefined

  if (error instanceof ValidationError) {
    status = 400
    errorDetails = error.details
  } else if (error instanceof AuthenticationError) {
    status = 401
  } else if (error instanceof AuthorizationError) {
    status = 403
  } else if (error instanceof RateLimitError) {
    status = 429
    errorMessage = `Rate limit exceeded. Try again at ${new Date(error.resetTime || Date.now() + 900000).toLocaleString()}`
  } else if (error instanceof PaymentError) {
    status = 400
  } else if (error instanceof DatabaseError) {
    status = 500
    errorMessage = isDevelopment ? error.message : 'Database operation failed'
  } else if (!isDevelopment) {
    errorMessage = 'An unexpected error occurred'
    errorDetails = undefined
  }

  return NextResponse.json(
    {
      success: false,
      error: error.name,
      message: errorMessage,
      ...(errorDetails && { details: errorDetails }),
      ...(isDevelopment && { stack: error.stack }),
    },
    { status }
  )
}

// Async error wrapper
export function withErrorHandler<T extends any[], R>(
  handler: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    try {
      return await handler(...args)
    } catch (error) {
      throw error // Re-throw to be handled by error middleware
    }
  }
}

// Validation helper
export function validateInput<T>(
  schema: { parse: (data: unknown) => T },
  data: unknown
): T {
  try {
    return schema.parse(data)
  } catch (error) {
    throw new ValidationError('Invalid input data', error)
  }
}

// Database error wrapper
export function withDatabaseError<T>(promise: Promise<T>): Promise<T> {
  return promise.catch((error) => {
    console.error('Database error:', error)
    throw new DatabaseError('Database operation failed', error)
  })
}

// Payment error wrapper
export function withPaymentError<T>(promise: Promise<T>): Promise<T> {
  return promise.catch((error) => {
    console.error('Payment error:', error)
    throw new PaymentError('Payment processing failed', error.code)
  })
}
