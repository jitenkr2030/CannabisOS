// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

import { NextRequest, NextResponse } from 'next/server'
import { notificationStore } from '@/hooks/useNotifications'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const unread = searchParams.get('unread') === 'true'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let notifications = notificationStore.getNotifications()

    // Apply filters
    if (type) {
      notifications = notifications.filter(n => n.type === type)
    }
    if (unread) {
      notifications = notifications.filter(n => !n.read)
    }

    // Apply pagination
    const total = notifications.length
    notifications = notifications.slice(offset, offset + limit)

    return NextResponse.json({
      notifications,
      total,
      unread: notifications.filter(n => !n.read).length,
      limit,
      offset
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
    const { type, title, message, action, metadata, priority } = body

    if (!title || !message) {
      return NextResponse.json(
        { error: 'Title and message are required' },
        { status: 400 }
      )
    }

    const notification = notificationStore.addNotification({
      type: type || 'info',
      title,
      message,
      action,
      metadata,
      priority: priority || 'medium'
    })

    return NextResponse.json({
      success: true,
      notification,
      message: 'Notification created successfully'
    })
  } catch (error) {
    console.error('Notifications POST error:', error)
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, action } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Notification ID is required' },
        { status: 400 }
      )
    }

    switch (action) {
      case 'mark_read':
        notificationStore.markAsRead(id)
        return NextResponse.json({
          success: true,
          message: 'Notification marked as read'
        })

      case 'mark_all_read':
        notificationStore.markAllAsRead()
        return NextResponse.json({
          success: true,
          message: 'All notifications marked as read'
        })

      case 'delete':
        notificationStore.deleteNotification(id)
        return NextResponse.json({
          success: true,
          message: 'Notification deleted'
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Notifications PATCH error:', error)
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

    notificationStore.deleteNotification(id)

    return NextResponse.json({
      success: true,
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
