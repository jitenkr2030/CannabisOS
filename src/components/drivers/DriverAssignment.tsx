'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  MapPin, 
  Clock, 
  Truck, 
  Navigation, 
  Users, 
  Calendar, 
  Phone, 
  Mail, 
  Star, 
  CheckCircle, 
  AlertTriangle, 
  Route, 
  Zap, 
  Award, 
  TrendingUp,
  Filter,
  Search,
  RefreshCw,
  UserPlus,
  Map,
  Compass,
  Timer
} from 'lucide-react'

interface Order {
  id: string
  customerName: string
  customerAddress: string
  customerPhone: string
  customerEmail: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  totalAmount: number
  deliveryAddress: string
  deliveryCoordinates: {
    lat: number
    lng: number
  }
  deliveryTime: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled'
  specialInstructions?: string
  requiresAgeVerification: boolean
  requiresSignature: boolean
  estimatedDeliveryTime: string
  createdAt: Date
}

interface Driver {
  id: string
  name: string
  email: string
  phone: string
  status: 'active' | 'inactive' | 'on_duty' | 'off_duty' | 'suspended'
  currentLocation?: {
    lat: number
    lng: number
    address: string
  }
  vehicleInfo: {
    make: string
    model: string
    year: number
    licensePlate: string
    capacity: number
  }
  performance: {
    totalDeliveries: number
    successfulDeliveries: number
    averageDeliveryTime: number
    rating: number
    lastDelivery?: Date
  }
  availability: {
    monday: boolean
    tuesday: boolean
    wednesday: boolean
    thursday: boolean
    friday: boolean
    saturday: boolean
    sunday: boolean
  }
  assignedOrders: string[]
  maxOrders: number
  skills: string[]
}

interface AssignmentResult {
  driverId: string
  orderId: string
  confidence: number
  estimatedTime: number
  distance: number
  reasoning: string
}

export default function DriverAssignment() {
  const [orders, setOrders] = useState<Order[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [assignmentResults, setAssignmentResults] = useState<AssignmentResult[]>([])
  const [autoAssignMode, setAutoAssignMode] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  // Mock data
  useEffect(() => {
    const mockOrders: Order[] = [
      {
        id: 'order1',
        customerName: 'John Doe',
        customerAddress: '123 Main St, New York, NY 10001',
        customerPhone: '+1-555-0123',
        customerEmail: 'john.doe@email.com',
        items: [
          { name: 'Blue Dream', quantity: 2, price: 45.00 },
          { name: 'OG Kush', quantity: 1, price: 50.00 }
        ],
        totalAmount: 140.00,
        deliveryAddress: '123 Main St, New York, NY 10001',
        deliveryCoordinates: { lat: 40.7128, lng: -74.0060 },
        deliveryTime: '2:00 PM - 4:00 PM',
        priority: 'medium',
        status: 'pending',
        requiresAgeVerification: true,
        requiresSignature: true,
        estimatedDeliveryTime: '30-45 minutes',
        createdAt: new Date('2024-01-16T10:00:00Z')
      },
      {
        id: 'order2',
        customerName: 'Jane Smith',
        customerAddress: '456 Oak Ave, Brooklyn, NY 11201',
        customerPhone: '+1-555-0124',
        customerEmail: 'jane.smith@email.com',
        items: [
          { name: 'Girl Scout Cookies', quantity: 1, price: 55.00 },
          { name: 'Sour Diesel', quantity: 1, price: 48.00 }
        ],
        totalAmount: 103.00,
        deliveryAddress: '456 Oak Ave, Brooklyn, NY 11201',
        deliveryCoordinates: { lat: 40.7589, lng: -73.9851 },
        deliveryTime: '3:00 PM - 5:00 PM',
        priority: 'high',
        status: 'pending',
        requiresAgeVerification: true,
        requiresSignature: true,
        estimatedDeliveryTime: '25-35 minutes',
        createdAt: new Date('2024-01-16T11:30:00Z')
      },
      {
        id: 'order3',
        customerName: 'Bob Johnson',
        customerAddress: '789 Pine St, Queens, NY 11375',
        customerPhone: '+1-555-0125',
        customerEmail: 'bob.johnson@email.com',
        items: [
          { name: 'Granddaddy Purple', quantity: 2, price: 42.00 }
        ],
        totalAmount: 84.00,
        deliveryAddress: '789 Pine St, Queens, NY 11375',
        deliveryCoordinates: { lat: 40.7282, lng: -73.7949 },
        deliveryTime: '4:00 PM - 6:00 PM',
        priority: 'low',
        status: 'pending',
        requiresAgeVerification: false,
        requiresSignature: false,
        estimatedDeliveryTime: '35-50 minutes',
        createdAt: new Date('2024-01-16T13:00:00Z')
      }
    ]

    const mockDrivers: Driver[] = [
      {
        id: 'driver1',
        name: 'Mike Johnson',
        email: 'mike.johnson@cannabisos.com',
        phone: '+1-555-0123',
        status: 'active',
        currentLocation: { lat: 40.7128, lng: -74.0060, address: '123 Main St, New York, NY' },
        vehicleInfo: {
          make: 'Ford',
          model: 'Transit',
          year: 2022,
          licensePlate: 'ABC-123',
          capacity: 50
        },
        performance: {
          totalDeliveries: 245,
          successfulDeliveries: 238,
          averageDeliveryTime: 32,
          rating: 4.7,
          lastDelivery: new Date('2024-01-15')
        },
        availability: {
          monday: true, tuesday: true, wednesday: true, thursday: true, friday: true,
          saturday: false, sunday: false
        },
        assignedOrders: [],
        maxOrders: 5,
        skills: ['fast_delivery', 'customer_service', 'navigation']
      },
      {
        id: 'driver2',
        name: 'Sarah Williams',
        email: 'sarah.williams@cannabisos.com',
        phone: '+1-555-0124',
        status: 'on_duty',
        currentLocation: { lat: 40.7589, lng: -73.9851, address: '456 Oak Ave, Brooklyn, NY' },
        vehicleInfo: {
          make: 'Chevrolet',
          model: 'Express',
          year: 2021,
          licensePlate: 'XYZ-789',
          capacity: 30
        },
        performance: {
          totalDeliveries: 189,
          successfulDeliveries: 185,
          averageDeliveryTime: 28,
          rating: 4.9,
          lastDelivery: new Date('2024-01-16')
        },
        availability: {
          monday: true, tuesday: true, wednesday: true, thursday: true, friday: true,
          saturday: true, sunday: true
        },
        assignedOrders: ['order1'],
        maxOrders: 3,
        skills: ['urban_delivery', 'time_management', 'documentation']
      },
      {
        id: 'driver3',
        name: 'David Chen',
        email: 'david.chen@cannabisos.com',
        phone: '+1-555-0125',
        status: 'active',
        currentLocation: { lat: 40.7489, lng: -73.9680, address: '789 Broadway, New York, NY' },
        vehicleInfo: {
          make: 'Toyota',
          model: 'Sienna',
          year: 2020,
          licensePlate: 'DEF-456',
          capacity: 40
        },
        performance: {
          totalDeliveries: 156,
          successfulDeliveries: 152,
          averageDeliveryTime: 35,
          rating: 4.5
        },
        availability: {
          monday: false, tuesday: true, wednesday: true, thursday: true, friday: true,
          saturday: false, sunday: false
        },
        assignedOrders: [],
        maxOrders: 4,
        skills: ['suburban_delivery', 'heavy_items', 'parking']
      }
    ]

    setOrders(mockOrders)
    setDrivers(mockDrivers)
  }, [])

  // Calculate distance between two points
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371 // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  // Calculate driver assignment score
  const calculateAssignmentScore = (driver: Driver, order: Order): AssignmentResult => {
    let score = 0
    let reasoning = ''

    // Distance score (40% weight)
    const distance = driver.currentLocation 
      ? calculateDistance(
          driver.currentLocation.lat,
          driver.currentLocation.lng,
          order.deliveryCoordinates.lat,
          order.deliveryCoordinates.lng
        )
      : 100 // Default distance if no location
    const distanceScore = Math.max(0, 100 - distance) * 0.4
    score += distanceScore
    reasoning += `Distance: ${distance.toFixed(1)}km (${distanceScore.toFixed(1)}pts). `

    // Driver performance score (25% weight)
    const performanceScore = (driver.performance.rating / 5) * 25
    score += performanceScore
    reasoning += `Rating: ${driver.performance.rating}/5 (${performanceScore.toFixed(1)}pts). `

    // Availability score (20% weight)
    const availabilityScore = driver.assignedOrders.length < driver.maxOrders ? 20 : 0
    score += availabilityScore
    reasoning += `Capacity: ${driver.assignedOrders.length}/${driver.maxOrders} (${availabilityScore.toFixed(1)}pts). `

    // Skills match score (15% weight)
    let skillsScore = 0
    if (order.priority === 'urgent' && driver.skills.includes('fast_delivery')) {
      skillsScore += 15
      reasoning += 'Urgent order + fast_delivery skill (15pts). '
    }
    if (order.requiresAgeVerification && driver.skills.includes('documentation')) {
      skillsScore += 10
      reasoning += 'Age verification + documentation skill (10pts). '
    }
    score += skillsScore

    // Time of day score (optional)
    const currentHour = new Date().getHours()
    const timeScore = currentHour >= 9 && currentHour <= 17 ? 5 : 0
    score += timeScore
    if (timeScore > 0) reasoning += 'Business hours (5pts). '

    return {
      driverId: driver.id,
      orderId: order.id,
      confidence: score / 100,
      estimatedTime: driver.performance.averageDeliveryTime + (distance * 2), // 2 min per km
      distance,
      reasoning
    }
  }

  // Auto assign drivers to orders
  const autoAssignDrivers = () => {
    const results: AssignmentResult[] = []

    orders.forEach(order => {
      if (order.status !== 'pending') return

      const availableDrivers = drivers.filter(driver => 
        driver.status === 'active' || driver.status === 'on_duty'
      ).filter(driver => 
        driver.assignedOrders.length < driver.maxOrders
      )

      if (availableDrivers.length === 0) {
        results.push({
          driverId: '',
          orderId: order.id,
          confidence: 0,
          estimatedTime: 999,
          distance: 999,
          reasoning: 'No available drivers'
        })
        return
      }

      const assignments = availableDrivers.map(driver => 
        calculateAssignmentScore(driver, order)
      )

      // Sort by confidence score
      assignments.sort((a, b) => b.confidence - a.confidence)

      // Get the best assignment
      const bestAssignment = assignments[0]
      results.push(bestAssignment)

      // Update driver assignment (in real app, this would update the database)
      const driverIndex = drivers.findIndex(d => d.id === bestAssignment.driverId)
      if (driverIndex !== -1) {
        drivers[driverIndex].assignedOrders.push(order.id)
      }
    })

    setAssignmentResults(results)
  }

  // Manual driver assignment
  const assignDriver = (driverId: string, orderId: string) => {
    const driver = drivers.find(d => d.id === driverId)
    const order = orders.find(o => o.id === orderId)

    if (!driver || !order) return

    const result = calculateAssignmentScore(driver, order)
    
    // Update order status
    setOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, status: 'assigned' } : o
    ))

    // Update driver assignment
    setDrivers(prev => prev.map(d => 
      d.id === driverId 
        ? { ...d, assignedOrders: [...d.assignedOrders, orderId] }
        : d
    ))

    // Add to results
    setAssignmentResults(prev => [...prev, result])
  }

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-blue-100 text-blue-800'
      case 'assigned': return 'bg-purple-100 text-purple-800'
      case 'picked_up': return 'bg-indigo-100 text-indigo-800'
      case 'in_transit': return 'bg-orange-100 text-orange-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.customerAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus
    
    return matchesSearch && matchesStatus
  })

  const filteredDrivers = drivers.filter(driver => {
    return driver.status === 'active' || driver.status === 'on_duty'
  })

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Driver Assignment</h1>
          <p className="text-gray-600">Intelligent driver assignment with real-time optimization</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={autoAssignDrivers} disabled={autoAssignMode}>
            <RefreshCw className={`h-4 w-4 mr-2 ${autoAssignMode ? 'animate-spin' : ''}`} />
            {autoAssignMode ? 'Assigning...' : 'Auto Assign'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList>
          <TabsTrigger value="orders">Pending Orders</TabsTrigger>
          <TabsTrigger value="drivers">Available Drivers</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="assigned">Assigned</option>
                <option value="picked_up">Picked Up</option>
                <option value="in_transit">In Transit</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">Order #{order.id}</h3>
                      <p className="text-sm text-gray-600">{order.customerName}</p>
                      <p className="text-sm text-gray-500">{order.customerAddress}</p>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Badge className={getPriorityColor(order.priority)}>
                        {order.priority.toUpperCase()}
                      </Badge>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total:</span>
                      <span className="font-medium">${order.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery:</span>
                      <span className="font-medium">{order.deliveryTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Est. Time:</span>
                      <span className="font-medium">{order.estimatedDeliveryTime}</span>
                    </div>
                    {order.specialInstructions && (
                      <div>
                        <span className="text-gray-600">Notes:</span>
                        <p className="text-xs text-gray-500 mt-1">{order.specialInstructions}</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        {order.requiresAgeVerification && (
                          <Badge variant="outline" className="text-xs">
                            Age Verification
                          </Badge>
                        )}
                        {order.requiresSignature && (
                          <Badge variant="outline" className="text-xs">
                            Signature Required
                          </Badge>
                        )}
                      </div>
                      <Select onValueChange={(value) => value && assignDriver(value, order.id)}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Assign driver" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredDrivers.map((driver) => (
                            <SelectItem key={driver.id} value={driver.id}>
                              <div className="flex items-center space-x-2">
                                <div>
                                  <p className="font-medium">{driver.name}</p>
                                  <p className="text-xs text-gray-500">
                                    {driver.assignedOrders.length}/{driver.maxOrders} orders
                                  </p>
                                </div>
                                <div className="text-right">
                                  <div className="flex items-center">
                                    <Star className="h-3 w-3 text-yellow-500" />
                                    <span className="text-sm ml-1">{driver.performance.rating.toFixed(1)}</span>
                                  </div>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="drivers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDrivers.map((driver) => (
              <Card key={driver.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        {driver.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{driver.name}</h3>
                        <p className="text-sm text-gray-500">{driver.vehicleInfo.make} {driver.vehicleInfo.model}</p>
                      </div>
                    </div>
                    <Badge className={
                      driver.status === 'on_duty' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }>
                      {driver.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Capacity:</span>
                      <span>{driver.assignedOrders.length}/{driver.maxOrders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rating:</span>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span className="ml-1">{driver.performance.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Avg Time:</span>
                      <span>{driver.performance.averageDeliveryTime}min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Success Rate:</span>
                      <span>
                        {((driver.performance.successfulDeliveries / driver.performance.totalDeliveries) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <div className="flex flex-wrap gap-1">
                      {driver.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {assignmentResults.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Route className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Assignments Yet</h3>
                  <p className="text-gray-600">Click "Auto Assign" to generate driver assignments</p>
                </CardContent>
              </Card>
            ) : (
              assignmentResults.map((result, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          result.confidence > 0.8 ? 'bg-green-500' :
                          result.confidence > 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            Order #{result.orderId}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {result.driverId ? `Driver ${result.driverId}` : 'No Driver Available'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={
                          result.confidence > 0.8 ? 'bg-green-100 text-green-800' :
                          result.confidence > 0.6 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }>
                          {(result.confidence * 100).toFixed(1)}% confidence
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Distance:</span>
                        <p className="font-medium">{result.distance.toFixed(1)} km</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Est. Time:</span>
                        <p className="font-medium">{result.estimatedTime} min</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Confidence:</span>
                        <p className="font-medium">{(result.confidence * 100).toFixed(1)}%</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Status:</span>
                        <p className="font-medium">
                          {result.confidence > 0.8 ? 'Excellent' :
                           result.confidence > 0.6 ? 'Good' : 'Poor'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <p className="text-xs text-gray-600 mb-2">
                        <strong>Reasoning:</strong> {result.reasoning}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                  </div>
                  <ShoppingCart className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Available Drivers</p>
                    <p className="text-2xl font-bold text-gray-900">{filteredDrivers.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Confidence</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {assignmentResults.length > 0 
                        ? (assignmentResults.reduce((acc, r) => acc + r.confidence, 0) / assignmentResults.length * 100).toFixed(1)
                        : '0'
                      }%
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Distance</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {assignmentResults.length > 0 
                        ? (assignmentResults.reduce((acc, r) => acc + r.distance, 0) / assignmentResults.length).toFixed(1)
                        : '0'
                      } km
                    </p>
                  </div>
                  <Map className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
