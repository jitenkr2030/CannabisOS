import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Helper function to verify JWT token
function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  
  const token = authHeader.substring(7)
  try {
    return jwt.verify(token, JWT_SECRET) as any
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get('storeId') || user.storeId
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    const products = await db.product.findMany({
      where: {
        storeId,
        isActive: true,
        ...(category && { category: category as any }),
        ...(search && {
          OR: [
            { name: { contains: search } },
            { sku: { contains: search } }
          ]
        })
      },
      include: {
        inventory: {
          where: { storeId }
        }
      },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json({ products })

  } catch (error) {
    console.error('Products fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    
    const product = await db.product.create({
      data: {
        ...data,
        storeId: user.storeId
      },
      include: {
        inventory: true
      }
    })

    // Create inventory record
    await db.inventory.create({
      data: {
        productId: product.id,
        storeId: user.storeId,
        quantity: 0,
        available: 0
      }
    })

    return NextResponse.json({ product }, { status: 201 })

  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}