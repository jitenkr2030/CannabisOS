// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Collect all environment variables
    const envVars = {
      // Database Configuration
      DATABASE_URL: process.env.DATABASE_URL,
      PGDATABASE: process.env.PGDATABASE,
      POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING,
      POSTGRES_USER: process.env.POSTGRES_USER,
      PGHOST: process.env.PGHOST,
      NEON_PROJECT_ID: process.env.NEON_PROJECT_ID,
      
      // Authentication Configuration
      JWT_SECRET: process.env.JWT_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
      
      // Application Configuration
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      
      // Build/Deployment Information
      VERCEL_URL: process.env.VERCEL_URL,
      VERCEL_ENV: process.env.VERCEL_ENV,
      VERCEL_PROJECT_ID: process.env.VERCEL_PROJECT_ID,
      NEXT_PHASE: process.env.NEXT_PHASE,
    }

    // Check for missing critical variables
    const criticalVars = [
      'DATABASE_URL',
      'JWT_SECRET', 
      'NEXTAUTH_URL',
      'NEXTAUTH_SECRET'
    ]

    const missingVars = criticalVars.filter(varName => !envVars[varName])
    const emptyVars = criticalVars.filter(varName => !envVars[varName] || envVars[varName] === '')

    // Mask sensitive values for display
    const maskedVars = Object.entries(envVars).reduce((acc, [key, value]) => {
      if (key.includes('SECRET') || key.includes('TOKEN') || key.includes('PASSWORD')) {
        acc[key] = value ? `[${value.length} characters]` : '[NOT SET]'
      } else if (key.includes('URL') && value) {
        // Show domain but hide credentials
        try {
          const url = new URL(value)
          acc[key] = `${url.protocol}//${url.host}${url.pathname}${url.search}`
        } catch {
          acc[key] = value
        }
      } else {
        acc[key] = value || '[NOT SET]'
      }
      return acc
    }, {} as Record<string, string>)

    return NextResponse.json({
      message: 'Environment Variables Diagnostic',
      environment: maskedVars,
      status: {
        totalVariables: Object.keys(envVars).length,
        criticalVariables: criticalVars.length,
        missingCritical: missingVars,
        emptyCritical: emptyVars,
        isComplete: missingVars.length === 0 && emptyVars.length === 0
      },
      recommendations: {
        missing: missingVars,
        empty: emptyVars,
        nextSteps: missingVars.length > 0 || emptyVars.length > 0 
          ? 'Add missing environment variables to Vercel dashboard' 
          : 'All critical environment variables are configured'
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Failed to check environment variables', 
        details: error.message 
      },
      { status: 500 }
    )
  }
}