'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Truck, 
  Package, 
  DollarSign, 
  Clock,
  MapPin,
  Navigation,
  Phone,
  CheckCircle,
  AlertTriangle,
  Settings,
  LogOut,
  Eye,
  BarChart3,
  Star,
  Activity,
  MessageSquare,
  Route,
  Timer,
  Fuel,
  Navigation as WazeIcon
} from 'lucide-react'

interface DriverDashboardProps {
  user: any
  onLogout: () => void
}

export default function DriverDashboard({ user, onLogout }: DriverDashboardProps) {
  const router = useRouter()
  const [stats, setStats] = useState({
    deliveriesToday: 8,
    completedDeliveries: 5,
    pendingDeliveries: 3,
    totalEarnings: 124.50,
    avgDeliveryTime: '28 min',
    customerRating: 4.8,
    fuelLevel: '75%',
    distanceTraveled: 42.5,
    onTimeDelivery: '92%'
  })

  const [todayDeliveries] = useState([
    { 
      id: '1', 
      customer: 'John Smith', 
      address: '123 Main St, Apt 4B', 
      phone: '(555) 123-4567',
      orderTotal: 68.50,
      status: 'completed',
      estimatedTime: '2:30 PM',
      actualTime: '2:25 PM',
      tip: 5.00,
      priority: 'normal'
    },
    { 
      id: '2', 
      customer: 'Sarah Johnson', 
      address: '456 Oak Ave', 
      phone: '(555) 987-6543',
      orderTotal: 45.75,
      status: 'in-progress',
      estimatedTime: '3:15 PM',
      distance: '2.3 miles',
      priority: 'normal'
    },
    { 
      id: '3', 
      customer: 'Mike Davis', 
      address: '789 Pine Rd, House #12', 
      phone: '(555) 456-7890',
      orderTotal: 89.25,
      status: 'pending',
      estimatedTime: '4:00 PM',
      distance: '4.1 miles',
      priority: 'high'
    },
    { 
      id: '4', 
      customer: 'Lisa Wilson', 
      address: '321 Elm St, Apt 2C', 
      phone: '(555) 234-5678',
      orderTotal: 32.00,
      status: 'pending',
      estimatedTime: '4:30 PM',
      distance: '1.8 miles',
      priority: 'normal'
    }
  ])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'normal': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const startNavigation = (address: string) => {
    // In a real app, this would open Google Maps or Waze
    window.open(`https://maps.google.com/?q=${encodeURIComponent(address)}`, '_blank')
  }

  const callCustomer = (phone: string) => {
    window.open(`tel:${phone}`)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Driver Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Driver Dashboard</h1>
          <p className="text-gray-600">Your deliveries and route information</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="default" className="bg-orange-100 text-orange-800">
              <Truck className="h-3 w-3 mr-1" />
              Delivery Driver
            </Badge>
            <span className="text-sm text-gray-500">Welcome back, {user?.name}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Navigation className="h-4 w-4 mr-2" />
            Route Optimizer
          </Button>
          <Button variant="outline" size="sm" onClick={onLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Vehicle Status */}
      <Card className="border-l-4 border-l-orange-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-orange-600" />
            Vehicle Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.fuelLevel}</div>
              <div className="text-sm text-gray-600">Fuel Level</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.distanceTraveled} mi</div>
              <div className="text-sm text-gray-600">Distance Today</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.avgDeliveryTime}</div>
              <div className="text-sm text-gray-600">Avg Delivery Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.onTimeDelivery}</div>
              <div className="text-sm text-gray-600">On-Time Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Deliveries</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.deliveriesToday}</div>
            <p className="text-xs text-muted-foreground">
              {stats.completedDeliveries} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingDeliveries}</div>
            <p className="text-xs text-muted-foreground">
              Next in 15 min
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalEarnings)}</div>
            <p className="text-xs text-muted-foreground">
              Including tips
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.customerRating}</div>
            <p className="text-xs text-muted-foreground">
              Customer rating
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Deliveries List */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Deliveries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todayDeliveries.map((delivery) => (
              <div key={delivery.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{delivery.customer}</h3>
                      <Badge variant="outline" className={getStatusColor(delivery.status)}>
                        {delivery.status}
                      </Badge>
                      {delivery.priority === 'high' && (
                        <Badge variant="destructive" className="text-xs">
                          Priority
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {delivery.address}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {delivery.phone}
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Order: {formatCurrency(delivery.orderTotal)}
                        {delivery.tip && ` • Tip: ${formatCurrency(delivery.tip)}`}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        ETA: {delivery.estimatedTime}
                        {delivery.actualTime && ` • Actual: ${delivery.actualTime}`}
                      </div>
                      {delivery.distance && (
                        <div className="flex items-center gap-2">
                          <Route className="h-4 w-4" />
                          Distance: {delivery.distance}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    {delivery.status === 'pending' && (
                      <>
                        <Button 
                          size="sm" 
                          onClick={() => startNavigation(delivery.address)}
                          className="w-full"
                        >
                          <Navigation className="h-4 w-4 mr-2" />
                          Navigate
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => callCustomer(delivery.phone)}
                          className="w-full"
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Call
                        </Button>
                      </>
                    )}
                    {delivery.status === 'in-progress' && (
                      <>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => callCustomer(delivery.phone)}
                          className="w-full"
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Call
                        </Button>
                        <Button 
                          size="sm" 
                          className="w-full"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Complete
                        </Button>
                      </>
                    )}
                    {delivery.status === 'completed' && (
                      <div className="text-center">
                        <CheckCircle className="h-8 w-8 text-green-500 mx-auto" />
                        <p className="text-sm text-green-600 mt-1">Delivered</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Driver Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Driver Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="w-full justify-start" variant="outline" onClick={() => router.push('/driver/route-planner')}>
              <Navigation className="h-4 w-4 mr-2" />
              Route Planner
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => router.push('/driver/contact-support')}>
              <Phone className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => router.push('/driver/customer-chat')}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Customer Chat
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => router.push('/driver/my-performance')}>
              <BarChart3 className="h-4 w-4 mr-2" />
              My Performance
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => router.push('/driver/fuel-log')}>
              <Fuel className="h-4 w-4 mr-2" />
              Fuel Log
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => router.push('/driver/break-time')}>
              <Timer className="h-4 w-4 mr-2" />
              Break Time
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => router.push('/driver/report-issue')}>
              <AlertTriangle className="h-4 w-4 mr-2" />
              Report Issue
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => router.push('/driver/open-maps')}>
              <WazeIcon className="h-4 w-4 mr-2" />
              Open Maps
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}