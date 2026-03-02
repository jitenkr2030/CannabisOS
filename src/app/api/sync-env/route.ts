// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { envData } = await request.json()
    
    // Expected environment variables
    const expectedVars = {
      DATABASE_URL: envData.DATABASE_URL,
      JWT_SECRET: envData.JWT_SECRET,
      NEXTAUTH_URL: envData.NEXTAUTH_URL,
      NEXTAUTH_SECRET: envData.NEXTAUTH_SECRET,
      NODE_ENV: envData.NODE_ENV || 'production',
      NEXT_PUBLIC_APP_URL: envData.NEXT_PUBLIC_APP_URL,
    }

    // Validate critical variables
    const criticalVars = ['DATABASE_URL', 'JWT_SECRET', 'NEXTAUTH_URL', 'NEXTAUTH_SECRET']
    const missingVars = criticalVars.filter(varName => !expectedVars[varName])
    
    if (missingVars.length > 0) {
      return NextResponse.json({
        error: 'Missing critical environment variables',
        missing: missingVars,
        required: criticalVars
      }, { status: 400 })
    }

    // Create updated .env content
    const envContent = Object.entries(expectedVars)
      .map(([key, value]) => `${key}="${value}"`)
      .join('\n')

    return NextResponse.json({
      message: 'Environment sync data prepared',
      envContent: envContent,
      variables: expectedVars,
      status: 'Ready to update .env file',
      instructions: [
        '1. Copy the envContent below',
        '2. Update your local .env file',
        '3. Update Vercel environment variables to match',
        '4. Restart your development server'
      ]
    })

  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Failed to prepare environment sync', 
        details: error.message 
      },
      { status: 500 }
    )
  }
}