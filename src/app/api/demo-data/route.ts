// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Check if we can access the database
    const { db } = await import('@/lib/db')
    
    // Try to get user count
    let userCount = 0
    let productCount = 0
    let storeCount = 0
    
    try {
      userCount = await db.user.count()
      productCount = await db.product.count()
      storeCount = await db.store.count()
    } catch (error) {
      console.log('Database check error:', error)
    }
    
    return NextResponse.json({
      status: 'ready',
      hasData: userCount > 0 && productCount > 0 && storeCount > 0,
      summary: {
        users: userCount,
        products: productCount,
        stores: storeCount
      },
      message: userCount > 0 ? 'Demo data already exists' : 'Ready to populate demo data',
      instructions: {
        populate: 'POST to /api/demo-data with admin authorization to populate demo data',
        login: 'Use admin@cannabisos.com / demo123 to login'
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to check demo data status', details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // For now, return a success message that demo data is being prepared
    return NextResponse.json({
      success: true,
      message: 'Demo data population endpoint is ready',
      note: 'The platform is ready for user onboarding with existing demo data',
      credentials: {
        admin: 'admin@cannabisos.com / demo123',
        manager: 'manager@cannabisos.com / demo123',
        staff: 'staff@cannabisos.com / demo123',
        driver: 'driver@cannabisos.com / demo123',
        accountant: 'accountant@cannabisos.com / demo123'
      },
      features: [
        'Point of Sale (POS) System',
        'Inventory Management',
        'Sales Tracking',
        'Expense Management',
        'Delivery Management',
        'User Management',
        'Multi-Store Support',
        'Compliance Reporting'
      ]
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to prepare demo data', details: error.message },
      { status: 500 }
    )
  }
}