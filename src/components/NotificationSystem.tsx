'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Bell, 
  X, 
  Check, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  XCircle,
  Clock,
  ExternalLink
} from 'lucide-react'

interface Notification {
  id: string
  title: string
  message: string
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'ALERT'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  isRead: boolean
  actionUrl?: string
  metadata?: any
  createdAt: string
  user?: {
    name: string
    email: string
    role: string
  }
}

interface NotificationSystemProps {
  userId?: string
  className?: string
}

export default function NotificationSystem({ userId, className }: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/notifications${userId ? `?userId=${userId}` : ''}`)
      const data = await response.json()
      setNotifications(data.notifications || [])
      setUnreadCount(data.unreadCount || 0)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: notificationId, isRead: true })
      })

      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await fetch(`/api/notifications`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark-all-read', userId })
      })

      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
    }
  }

  // Delete notification
  const deleteNotification = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications?id=${notificationId}`, {
        method: 'DELETE'
      })

      setNotifications(prev => prev.filter(n => n.id !== notificationId))
      if (!notifications.find(n => n.id === notificationId)?.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Failed to delete notification:', error)
    }
  }

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id)
    }
    
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl
    }
  }

  useEffect(() => {
    fetchNotifications()
    
    // Set up polling for new notifications
    const interval = setInterval(fetchNotifications, 30000) // Poll every 30 seconds
    
    return () => clearInterval(interval)
  }, [userId])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'SUCCESS': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'WARNING': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'ERROR': return <XCircle className="h-4 w-4 text-red-500" />
      case 'ALERT': return <AlertTriangle className="h-4 w-4 text-red-600" />
      default: return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'SUCCESS': return 'border-green-200 bg-green-50'
      case 'WARNING': return 'border-yellow-200 bg-yellow-50'
      case 'ERROR': return 'border-red-200 bg-red-50'
      case 'ALERT': return 'border-red-300 bg-red-100'
      default: return 'border-blue-200 bg-blue-50'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-600 text-white'
      case 'HIGH': return 'bg-orange-600 text-white'
      case 'MEDIUM': return 'bg-yellow-600 text-white'
      case 'LOW': return 'bg-gray-600 text-white'
      default: return 'bg-gray-600 text-white'
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  return (
    <div className={`relative ${className}`}>
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="sm"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            className="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center text-xs bg-red-500 text-white rounded-full"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Dropdown */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <Card className="absolute right-0 top-12 w-96 max-h-96 z-50 shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Notifications</CardTitle>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={markAllAsRead}
                    >
                      Mark all read
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0 max-h-80 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center p-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center p-4 text-gray-500">
                  <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>No notifications</p>
                </div>
              ) : (
                <div className="space-y-2 p-2">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors hover:shadow-md ${
                        notification.isRead ? 'opacity-60' : ''
                      } ${getNotificationColor(notification.type)}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className={`font-medium text-sm ${
                                notification.isRead ? 'text-gray-600' : 'text-gray-900'
                              }`}>
                                {notification.title}
                              </p>
                              <Badge 
                                variant="secondary" 
                                className={`text-xs ${getPriorityColor(notification.priority)}`}
                              >
                                {notification.priority}
                              </Badge>
                            </div>
                            <p className={`text-sm ${
                              notification.isRead ? 'text-gray-500' : 'text-gray-700'
                            }`}>
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-500 flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {formatTime(notification.createdAt)}
                              </span>
                              {notification.actionUrl && (
                                <span className="text-xs text-blue-600 flex items-center">
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  Action
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteNotification(notification.id)
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            
            {notifications.length > 0 && (
              <div className="p-2 border-t">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full"
                  onClick={() => {
                    // Navigate to full notifications page
                    window.location.href = '/notifications'
                  }}
                >
                  View all notifications
                </Button>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  )
}