'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Bell, 
  X, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  ShoppingCart, 
  Package, 
  Truck, 
  Users, 
  AlertCircle,
  Clock,
  Archive,
  Settings,
  Filter,
  Search,
  Eye,
  EyeOff
} from 'lucide-react'

interface Notification {
  id: string
  type: 'success' | 'warning' | 'error' | 'info' | 'order' | 'inventory' | 'delivery' | 'system'
  title: string
  message: string
  timestamp: Date
  read: boolean
  action?: {
    label: string
    url: string
  }
  metadata?: Record<string, any>
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)

  // Mock real-time notifications
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'order',
        title: 'New Order Received',
        message: 'Order #12345 for $156.78 from John Doe',
        timestamp: new Date(Date.now() - 1000 * 60 * 2),
        read: false,
        action: {
          label: 'View Order',
          url: '/orders/12345'
        },
        metadata: {
          orderId: '12345',
          customerName: 'John Doe',
          amount: 156.78
        }
      },
      {
        id: '2',
        type: 'inventory',
        title: 'Low Stock Alert',
        message: 'Blue Dream is running low (5 units remaining)',
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        read: false,
        action: {
          label: 'Manage Inventory',
          url: '/inventory'
        },
        metadata: {
          productId: 'blue-dream',
          currentStock: 5,
          reorderPoint: 10
        }
      },
      {
        id: '3',
        type: 'delivery',
        title: 'Driver Assigned',
        message: 'Driver Mike Johnson assigned to delivery #67890',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        read: true,
        action: {
          label: 'Track Delivery',
          url: '/deliveries/67890'
        },
        metadata: {
          deliveryId: '67890',
          driverName: 'Mike Johnson',
          customerName: 'Jane Smith'
        }
      },
      {
        id: '4',
        type: 'warning',
        title: 'Compliance Alert',
        message: 'Monthly compliance report due in 3 days',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        read: false,
        action: {
          label: 'Generate Report',
          url: '/compliance'
        }
      },
      {
        id: '5',
        type: 'system',
        title: 'System Update',
        message: 'New features available - Click to learn more',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        read: true
      }
    ]

    setNotifications(mockNotifications)
  }, [])

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const randomNotifications = [
        {
          id: Date.now().toString(),
          type: 'order' as const,
          title: 'New Order Received',
          message: `Order #${Math.floor(Math.random() * 10000)} for $${(Math.random() * 500).toFixed(2)}`,
          timestamp: new Date(),
          read: false
        },
        {
          id: Date.now().toString(),
          type: 'inventory' as const,
          title: 'Stock Update',
          message: `${['Blue Dream', 'OG Kush', 'Girl Scout Cookies'][Math.floor(Math.random() * 3)]} stock updated`,
          timestamp: new Date(),
          read: false
        },
        {
          id: Date.now().toString(),
          type: 'delivery' as const,
          title: 'Delivery Status',
          message: `Delivery ${['Started', 'In Progress', 'Completed'][Math.floor(Math.random() * 3)]}`,
          timestamp: new Date(),
          read: false
        }
      ]

      if (Math.random() > 0.7) {
        const newNotification = randomNotifications[Math.floor(Math.random() * randomNotifications.length)]
        setNotifications(prev => [newNotification, ...prev].slice(0, 49))
      }
    }, 10000) // Every 10 seconds

    return () => clearInterval(interval)
  }, [])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5" />
      case 'warning': return <AlertTriangle className="h-5 w-5" />
      case 'error': return <AlertCircle className="h-5 w-5" />
      case 'order': return <ShoppingCart className="h-5 w-5" />
      case 'inventory': return <Package className="h-5 w-5" />
      case 'delivery': return <Truck className="h-5 w-5" />
      case 'system': return <Settings className="h-5 w-5" />
      default: return <Info className="h-5 w-5" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-600 bg-green-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'error': return 'text-red-600 bg-red-100'
      case 'order': return 'text-blue-600 bg-blue-100'
      case 'inventory': return 'text-purple-600 bg-purple-100'
      case 'delivery': return 'text-orange-600 bg-orange-100'
      case 'system': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || notification.type === filter
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           notification.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesUnreadOnly = !showUnreadOnly || !notification.read
    
    return matchesFilter && matchesSearch && matchesUnreadOnly
  })

  const unreadCount = notifications.filter(n => !n.read).length

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-sm">
              {unreadCount} unread
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={showUnreadOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setShowUnreadOnly(!showUnreadOnly)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {showUnreadOnly ? 'All' : 'Unread'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark all read
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notification Types
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded hover:bg-gray-50 cursor-pointer">
                  <span className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    Orders
                  </span>
                  <Badge variant="secondary">
                    {notifications.filter(n => n.type === 'order').length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded hover:bg-gray-50 cursor-pointer">
                  <span className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                    Inventory
                  </span>
                  <Badge variant="secondary">
                    {notifications.filter(n => n.type === 'inventory').length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded hover:bg-gray-50 cursor-pointer">
                  <span className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                    Deliveries
                  </span>
                  <Badge variant="secondary">
                    {notifications.filter(n => n.type === 'delivery').length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded hover:bg-gray-50 cursor-pointer">
                  <span className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Success
                  </span>
                  <Badge variant="secondary">
                    {notifications.filter(n => n.type === 'success').length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded hover:bg-gray-50 cursor-pointer">
                  <span className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                    Warnings
                  </span>
                  <Badge variant="secondary">
                    {notifications.filter(n => n.type === 'warning').length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded hover:bg-gray-50 cursor-pointer">
                  <span className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                    Errors
                  </span>
                  <Badge variant="secondary">
                    {notifications.filter(n => n.type === 'error').length}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Notifications</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search notifications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <Tabs value={filter} onValueChange={setFilter}>
                    <TabsList>
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="order">Orders</TabsTrigger>
                      <TabsTrigger value="inventory">Inventory</TabsTrigger>
                      <TabsTrigger value="delivery">Deliveries</TabsTrigger>
                      <TabsTrigger value="system">System</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No notifications found</p>
                  </div>
                ) : (
                  filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                        notification.read ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className={`p-2 rounded-lg ${getNotificationColor(notification.type)}`}>
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <h3 className="text-sm font-medium text-gray-900">
                                {notification.title}
                              </h3>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className="text-xs text-gray-500">
                                {formatTime(notification.timestamp)}
                              </span>
                              {notification.action && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-xs"
                                  onClick={() => window.open(notification.action.url, '_blank')}
                                >
                                  {notification.action.label}
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
