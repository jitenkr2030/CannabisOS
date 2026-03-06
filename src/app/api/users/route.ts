import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const status = searchParams.get('status')
    const storeId = searchParams.get('storeId')
    const search = searchParams.get('search')

    // Build where clause
    const where: any = {}
    if (role) where.role = role
    if (status) where.isActive = status === 'active'
    if (storeId) where.storeId = storeId
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }

    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        sales: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    // Get user statistics
    const totalUsers = await prisma.user.count()
    const activeUsers = await prisma.user.count({ where: { isActive: true } })
    const inactiveUsers = await prisma.user.count({ where: { isActive: false } })

    // Role distribution
    const roleDistribution = await prisma.user.groupBy({
      by: ['role'],
      _count: true
    })

    // Recent activity
    const recentActivity = await prisma.auditLog.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    })

    return NextResponse.json({
      users,
      statistics: {
        total: totalUsers,
        active: activeUsers,
        inactive: inactiveUsers,
        byRole: roleDistribution.reduce((acc, item) => {
          acc[item.role] = item._count
          return acc
        }, {} as Record<string, number>)
      },
      recentActivity
    })

  } catch (error) {
    console.error('Users API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, role = 'STAFF', phone, storeId, isActive = true } = body

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Create new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password, // In production, hash this password
        role,
        phone,
        storeId,
        isActive
      }
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'CREATE',
        entity: 'User',
        entityId: user.id,
        newValues: { name, email, role, isActive },
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userId: user.id
      }
    })

    return NextResponse.json({
      message: 'User created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt
      }
    })

  } catch (error) {
    console.error('Create user error:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    // Get current user for audit
    const currentUser = await prisma.user.findUnique({
      where: { id }
    })

    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'UPDATE',
        entity: 'User',
        entityId: updatedUser.id,
        oldValues: { 
          name: currentUser.name, 
          email: currentUser.email, 
          role: currentUser.role,
          isActive: currentUser.isActive 
        },
        newValues: updateData,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userId: updatedUser.id
      }
    })

    return NextResponse.json({
      message: 'User updated successfully',
      user: updatedUser
    })

  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get user before deletion for audit
    const user = await prisma.user.findUnique({
      where: { id }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Delete user
    await prisma.user.delete({
      where: { id }
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'DELETE',
        entity: 'User',
        entityId: user.id,
        oldValues: { 
          name: user.name, 
          email: user.email, 
          role: user.role 
        },
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userId: user.id
      }
    })

    return NextResponse.json({
      message: 'User deleted successfully'
    })

  } catch (error) {
    console.error('Delete user error:', error)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}