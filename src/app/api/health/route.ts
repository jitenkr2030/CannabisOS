


export const fetchCache = "force-no-store"


import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (response.ok) {
      return NextResponse.json({
        status: 'healthy',
        database: 'connected',
        timestamp: new Date().toISOString()
      })
    } else {
      return NextResponse.json({
        status: 'unhealthy',
        database: 'disconnected',
        timestamp: new Date().toISOString()
      })
    }
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    })
  }
}
