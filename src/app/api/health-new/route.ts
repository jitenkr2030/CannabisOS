// Simple health check for Vercel deployment
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const timestamp = new Date().toISOString()
    
    return NextResponse.json({
      message: 'CannabisOS Health Check',
      status: 'Operational',
      timestamp,
      environment: process.env.NODE_ENV || 'unknown',
      vercel: {
        deployment: 'Active',
        region: 'iad1',
        build: 'Completed successfully'
      }
    })
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Health check failed', 
        details: error.message 
      },
      { status: 500 }
    )
  }
}