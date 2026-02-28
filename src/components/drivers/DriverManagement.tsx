'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Users, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Truck, 
  Navigation, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Plus, 
  Edit, 
  Trash, 
  Search, 
  Filter,
  UserPlus,
  Route,
  Star,
  Award,
  Zap,
  Eye,
  EyeOff
} from 'lucide-react'

interface Driver {
  id: string
  name: string
  email: string
  phone: string
  licenseNumber: string
  licenseExpiry: Date
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
    insuranceExpiry: Date
  }
  performance: {
    totalDeliveries: number
    successfulDeliveries: number
    averageDeliveryTime: number
    rating: number
    lastDelivery?: Date
  }
  documents: {
    license: string
    insurance: string
    backgroundCheck: string
    drugTest: string
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
  createdAt: Date
  updatedAt: Date
}

export default function DriverManagement() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null)

  // Mock drivers data
  useEffect(() => {
    const mockDrivers: Driver[] = [
      {
        id: '1',
        name: 'Mike Johnson',
        email: 'mike.johnson@cannabisos.com',
        phone: '+1-555-0123',
        licenseNumber: 'DL123456',
        licenseExpiry: new Date('2024-12-31'),
        status: 'active',
        currentLocation: {
          lat: 40.7128,
          lng: -74.0060,
          address: '123 Main St, New York, NY'
        },
        vehicleInfo: {
          make: 'Ford',
          model: 'Transit',
          year: 2022,
          licensePlate: 'ABC-123',
          insuranceExpiry: new Date('2024-11-30')
        },
        performance: {
          totalDeliveries: 245,
          successfulDeliveries: 238,
          averageDeliveryTime: 32,
          rating: 4.7,
          lastDelivery: new Date('2024-01-15')
        },
        documents: {
          license: '/documents/driver1/license.pdf',
          insurance: '/documents/driver1/insurance.pdf',
          backgroundCheck: '/documents/driver1/background.pdf',
          drugTest: '/documents/driver1/drug-test.pdf'
        },
        availability: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: false,
          sunday: false
        },
        assignedOrders: ['order1', 'order2'],
        createdAt: new Date('2023-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: '2',
        name: 'Sarah Williams',
        email: 'sarah.williams@cannabisos.com',
        phone: '+1-555-0124',
        licenseNumber: 'DL789012',
        licenseExpiry: new Date('2024-10-15'),
        status: 'on_duty',
        currentLocation: {
          lat: 40.7589,
          lng: -73.9851,
          address: '456 Oak Ave, Brooklyn, NY'
        },
        vehicleInfo: {
          make: 'Chevrolet',
          model: 'Express',
          year: 2021,
          licensePlate: 'XYZ-789',
          insuranceExpiry: new Date('2024-09-15')
        },
        performance: {
          totalDeliveries: 189,
          successfulDeliveries: 185,
          averageDeliveryTime: 28,
          rating: 4.9,
          lastDelivery: new Date('2024-01-16')
        },
        documents: {
          license: '/documents/driver2/license.pdf',
          insurance: '/documents/driver2/insurance.pdf',
          backgroundCheck: '/documents/driver2/background.pdf',
          drugTest: '/documents/driver2/drug-test.pdf'
        },
        availability: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true
        },
        assignedOrders: ['order3'],
        createdAt: new Date('2023-03-20'),
        updatedAt: new Date('2024-01-16')
      },
      {
        id: '3',
        name: 'David Chen',
        email: 'david.chen@cannabisos.com',
        phone: '+1-555-0125',
        licenseNumber: 'DL345678',
        licenseExpiry: new Date('2025-01-20'),
        status: 'inactive',
        vehicleInfo: {
          make: 'Toyota',
          model: 'Sienna',
          year: 2020,
          licensePlate: 'DEF-456',
          insuranceExpiry: new Date('2024-08-20')
        },
        performance: {
          totalDeliveries: 156,
          successfulDeliveries: 152,
          averageDeliveryTime: 35,
          rating: 4.5
        },
        documents: {
          license: '/documents/driver3/license.pdf',
          insurance: '/documents/driver3/insurance.pdf',
          backgroundCheck: '/documents/driver3/background.pdf',
          drugTest: '/documents/driver3/drug-test.pdf'
        },
        availability: {
          monday: false,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: false,
          sunday: false
        },
        assignedOrders: [],
        createdAt: new Date('2023-06-10'),
        updatedAt: new Date('2024-01-10')
      }
    ]

    setDrivers(mockDrivers)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'on_duty': return 'bg-blue-100 text-blue-800'
      case 'off_duty': return 'bg-gray-100 text-gray-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      case 'suspended': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />
      case 'on_duty': return <Truck className="h-4 w-4" />
      case 'off_duty': return <Clock className="h-4 w-4" />
      case 'inactive': return <AlertTriangle className="h-4 w-4" />
      case 'suspended': return <Zap className="h-4 w-4" />
      default: return <Users className="h-4 w-4" />
    }
  }

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           driver.phone.includes(searchTerm)
    const matchesStatus = filterStatus === 'all' || driver.status === filterStatus
    
    return matchesSearch && matchesStatus
  })

  const assignDriverToOrder = (driverId: string, orderId: string) => {
    setDrivers(prev => prev.map(driver => 
      driver.id === driverId 
        ? { ...driver, assignedOrders: [...driver.assignedOrders, orderId] }
        : driver
    ))
  }

  const updateDriverStatus = (driverId: string, status: Driver['status']) => {
    setDrivers(prev => prev.map(driver => 
      driver.id === driverId 
        ? { ...driver, status, updatedAt: new Date() }
        : driver
    ))
  }

  const getDriverPerformanceColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600'
    if (rating >= 4.0) return 'text-blue-600'
    if (rating >= 3.5) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Driver Management</h1>
          <p className="text-gray-600">Manage your delivery drivers and track their performance</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setShowAddModal(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Driver
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Drivers</p>
                <p className="text-2xl font-bold text-gray-900">{drivers.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">On Duty</p>
                <p className="text-2xl font-bold text-gray-900">
                  {drivers.filter(d => d.status === 'on_duty').length}
                </p>
              </div>
              <Truck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">
                  {drivers.filter(d => d.status === 'active').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(drivers.reduce((acc, d) => acc + d.performance.rating, 0) / drivers.length).toFixed(1)}
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search drivers..."
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
            <option value="active">Active</option>
            <option value="on_duty">On Duty</option>
            <option value="off_duty">Off Duty</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Drivers List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDrivers.map((driver) => (
          <Card key={driver.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    {driver.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{driver.name}</h3>
                    <p className="text-sm text-gray-500">{driver.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(driver.status)}>
                    <span className="flex items-center">
                      {getStatusIcon(driver.status)}
                      <span className="ml-1 capitalize">
                        {driver.status.replace('_', ' ')}
                      </span>
                    </span>
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Phone</p>
                  <p className="font-medium">{driver.phone}</p>
                </div>
                <div>
                  <p className="text-gray-600">License</p>
                  <p className="font-medium">{driver.licenseNumber}</p>
                </div>
                <div>
                  <p className="text-gray-600">Vehicle</p>
                  <p className="font-medium">{driver.vehicleInfo.make} {driver.vehicleInfo.model}</p>
                </div>
                <div>
                  <p className="text-gray-600">License Plate</p>
                  <p className="font-medium">{driver.vehicleInfo.licensePlate}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Performance</span>
                  <div className="flex items-center space-x-1">
                    <Star className={`h-4 w-4 ${getDriverPerformanceColor(driver.performance.rating)}`} />
                    <span className={`font-medium ${getDriverPerformanceColor(driver.performance.rating)}`}>
                      {driver.performance.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Deliveries</p>
                    <p className="font-medium">{driver.performance.totalDeliveries}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Success Rate</p>
                    <p className="font-medium">
                      {((driver.performance.successfulDeliveries / driver.performance.totalDeliveries) * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Avg Time</p>
                    <p className="font-medium">{driver.performance.averageDeliveryTime}min</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Current Orders</p>
                    <p className="font-medium">{driver.assignedOrders.length}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant={driver.status === 'inactive' ? "default" : "outline"}
                      onClick={() => updateDriverStatus(driver.id, driver.status === 'inactive' ? 'active' : 'inactive')}
                    >
                      {driver.status === 'inactive' ? 'Activate' : 'Deactivate'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateDriverStatus(driver.id, driver.status === 'on_duty' ? 'off_duty' : 'on_duty')}
                    >
                      {driver.status === 'on_duty' ? 'Off Duty' : 'On Duty'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
