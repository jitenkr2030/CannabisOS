import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: any = {}
    if (userId) where.userId = userId
    if (type) where.type = type
    if (status) where.status = status

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      include: {
        user: {
          select: { name: true, email: true, role: true }
        }
      }
    })

    const unreadCount = await prisma.notification.count({
      where: {
        ...where,
        isRead: false
      }
    })

    return NextResponse.json({
      notifications,
      unreadCount,
      pagination: {
        limit,
        offset,
        hasMore: notifications.length === limit
      }
    })

  } catch (error) {
    console.error('Notifications GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      title, 
      message, 
      type = 'INFO', 
      priority = 'MEDIUM',
      userId,
      actionUrl,
      metadata,
      expiresAt
    } = body

    // Create notification
    const notification = await prisma.notification.create({
      data: {
        title,
        message,
        type,
        priority,
        userId,
        actionUrl,
        metadata: metadata ? JSON.stringify(metadata) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isRead: false
      }
    })

    // Create system notification for critical alerts
    if (priority === 'HIGH' || type === 'ALERT') {
      await createSystemAlert(notification)
    }

    return NextResponse.json({
      message: 'Notification created successfully',
      notification
    })

  } catch (error) {
    console.error('Notifications POST error:', error)
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, isRead, action } = body

    if (action === 'mark-all-read') {
      const { userId } = body
      await prisma.notification.updateMany({
        where: { 
          userId,
          isRead: false 
        },
        data: { isRead: true }
      })

      return NextResponse.json({
        message: 'All notifications marked as read'
      })
    }

    // Update single notification
    const notification = await prisma.notification.update({
      where: { id },
      data: { isRead }
    })

    return NextResponse.json({
      message: 'Notification updated successfully',
      notification
    })

  } catch (error) {
    console.error('Notifications PUT error:', error)
    return NextResponse.json(
      { error: 'Failed to update notification' },
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
        { error: 'Notification ID is required' },
        { status: 400 }
      )
    }

    await prisma.notification.delete({
      where: { id }
    })

    return NextResponse.json({
      message: 'Notification deleted successfully'
    })

  } catch (error) {
    console.error('Notifications DELETE error:', error)
    return NextResponse.json(
      { error: 'Failed to delete notification' },
      { status: 500 }
    )
  }
}

// Helper function to create system alerts
async function createSystemAlert(notification: any) {
  // Create audit log for critical notifications
  await prisma.auditLog.create({
    data: {
      action: 'NOTIFICATION_ALERT',
      entity: 'Notification',
      entityId: notification.id,
      newValues: {
        title: notification.title,
        type: notification.type,
        priority: notification.priority
      },
      ipAddress: 'system',
      userId: notification.userId || 'system'
    }
  })

  // Here you could integrate with external notification services
  // like email, SMS, push notifications, Slack, etc.
  
  console.log(`System Alert: ${notification.title} - ${notification.message}`)
}

// Utility function to send notifications to multiple users
export async function sendBulkNotification(
  userIds: string[],
  title: string,
  message: string,
  type: string = 'INFO',
  priority: string = 'MEDIUM'
) {
  try {
    const notifications = await Promise.all(
      userIds.map(userId =>
        prisma.notification.create({
          data: {
            title,
            message,
            type,
            priority,
            userId,
            isRead: false
          }
        })
      )
    )

    return notifications
  } catch (error) {
    console.error('Bulk notification error:', error)
    throw error
  }
}

// Utility function to create automatic notifications
export async function createAutoNotification(
  type: 'LOW_STOCK' | 'NEW_ORDER' | 'DELIVERY_COMPLETED' | 'PAYMENT_FAILED' | 'SYSTEM_ALERT',
  data: any
) {
  try {
    let notificationData: any = {
      type: 'INFO',
      priority: 'MEDIUM'
    }

    switch (type) {
      case 'LOW_STOCK':
        notificationData = {
          title: 'Low Stock Alert',
          message: `Product "${data.productName}" is running low on stock (${data.currentQuantity} remaining)`,
          type: 'WARNING',
          priority: 'HIGH',
          actionUrl: `/manager/inventory`,
          metadata: {
            productId: data.productId,
            currentQuantity: data.currentQuantity,
            reorderLevel: data.reorderLevel
          }
        }
        break

      case 'NEW_ORDER':
        notificationData = {
          title: 'New Order Received',
          message: `Order #${data.orderNumber} for ${formatCurrency(data.total)} from ${data.customerName}`,
          type: 'SUCCESS',
          priority: 'MEDIUM',
          actionUrl: `/manager/sales-reports`,
          metadata: {
            orderId: data.orderId,
            orderNumber: data.orderNumber,
            total: data.total,
            customerName: data.customerName
          }
        }
        break

      case 'DELIVERY_COMPLETED':
        notificationData = {
          title: 'Delivery Completed',
          message: `Delivery #${data.deliveryNumber} completed successfully`,
          type: 'SUCCESS',
          priority: 'LOW',
          actionUrl: `/driver/my-performance`,
          metadata: {
            deliveryId: data.deliveryId,
            deliveryNumber: data.deliveryNumber
          }
        }
        break

      case 'PAYMENT_FAILED':
        notificationData = {
          title: 'Payment Failed',
          message: `Payment of ${formatCurrency(data.amount)} failed for order #${data.orderNumber}`,
          type: 'ERROR',
          priority: 'HIGH',
          actionUrl: `/manager/sales-reports`,
          metadata: {
            orderId: data.orderId,
            orderNumber: data.orderNumber,
            amount: data.amount,
            error: data.error
          }
        }
        break

      case 'SYSTEM_ALERT':
        notificationData = {
          title: data.title || 'System Alert',
          message: data.message,
          type: 'ALERT',
          priority: 'HIGH',
          metadata: data.metadata
        }
        break
    }

    // Send to appropriate users based on type
    let targetUsers: string[] = []

    switch (type) {
      case 'LOW_STOCK':
        // Notify managers and admin
        const stockManagers = await prisma.user.findMany({
          where: { 
            role: { in: ['MANAGER', 'ADMIN'] },
            isActive: true
          },
          select: { id: true }
        })
        targetUsers = stockManagers.map(m => m.id)
        break

      case 'NEW_ORDER':
      case 'PAYMENT_FAILED':
        // Notify managers
        const orderManagers = await prisma.user.findMany({
          where: { 
            role: { in: ['MANAGER', 'ADMIN'] },
            isActive: true
          },
          select: { id: true }
        })
        targetUsers = orderManagers.map(m => m.id)
        break

      case 'DELIVERY_COMPLETED':
        // Notify specific driver and managers
        if (data.driverId) {
          targetUsers.push(data.driverId)
        }
        const deliveryManagers = await prisma.user.findMany({
          where: { 
            role: { in: ['MANAGER', 'ADMIN'] },
            isActive: true
          },
          select: { id: true }
        })
        targetUsers.push(...deliveryManagers.map(m => m.id))
        break

      case 'SYSTEM_ALERT':
        // Notify all admin users
        const admins = await prisma.user.findMany({
          where: { 
            role: 'ADMIN',
            isActive: true
          },
          select: { id: true }
        })
        targetUsers = admins.map(a => a.id)
        break
    }

    // Create notifications for all target users
    const notifications = await sendBulkNotification(
      targetUsers,
      notificationData.title,
      notificationData.message,
      notificationData.type,
      notificationData.priority
    )

    // Update notifications with additional data
    await Promise.all(
      notifications.map((notification, index) =>
        prisma.notification.update({
          where: { id: notification.id },
          data: {
            actionUrl: notificationData.actionUrl,
            metadata: notificationData.metadata ? JSON.stringify(notificationData.metadata) : null
          }
        })
      )
    )

    return notifications

  } catch (error) {
    console.error('Auto notification error:', error)
    throw error
  }
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}