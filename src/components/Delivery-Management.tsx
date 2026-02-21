'use client'

import { useState, useEffect } from 'react'
import { Search, Plus, MapPin, Package, Calendar, Clock, User, Filter, Download, Edit, Trash2, Eye, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface Delivery {
  id: string
  orderNumber: string
  customerName: string
  customerPhone: string
  customerAddress: string
  status: 'PENDING' | 'ASSIGNED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED'
  estimatedTime: string
  actualTime?: string
  distance: number
  storeId: string
  driverId?: string
  driver?: {
    id: string
    name: string
    phone: string
  }
  items: DeliveryItem[]
  tracking: DeliveryTracking[]
}

interface DeliveryItem {
  id: string
  productName: string
  quantity: number
  thcContent?: number
  cbdContent?: number
  notes?: string
}

interface DeliveryTracking {
  id: string
  status: string
  location?: string
  notes: string
  timestamp: string
}

export default function DeliveryManagement() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null)
  const [trackingDialog, setTrackingDialog] = useState(false)
  const [newDelivery, setNewDelivery] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    estimatedTime: '',
    notes: '',
    items: [{ productName: '', quantity: 1, thcContent: 0, cbdContent: 0 }]
  })

  useEffect(() => {
    loadDeliveries()
  }, [])

  const loadDeliveries = async () => {
    try {
      const response = await fetch('/api/deliveries')
      const data = await response.json()
      setDeliveries(data.deliveries || [])
    } catch (error) {
      console.error('Failed to load deliveries:', error)
    }
  }

  const createDelivery = async () => {
    try {
      const response = await fetch('/api/deliveries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer demo-token'
        },
        body: JSON.stringify({
          ...newDelivery,
          items: newDelivery.items.map(item => ({
            ...item,
            thcContent: parseFloat(item.thcContent.toString()) || 0,
            cbdContent: parseFloat(item.cbdContent.toString()) || 0
          }))
        })
      })

      if (response.ok) {
        setNewDelivery({
          customerName: '',
          customerPhone: '',
          customerAddress: '',
          estimatedTime: '',
          notes: '',
          items: [{ productName: '', quantity: 1, thcContent: 0, cbdContent: 0 }]
        })
        loadDeliveries()
      }
    } catch (error) {
      console.error('Failed to create delivery:', error)
    }
  }

  const updateDeliveryStatus = async (deliveryId: string, status: string, notes?: string) => {
    try {
      const response = await fetch('/api/deliveries', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer demo-token'
        },
        body: JSON.stringify({
          deliveryId,
          status,
          notes,
          location: notes
        })
      })

      if (response.ok) {
        loadDeliveries()
      }
    } catch (error) {
      console.error('Failed to update delivery:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'ASSIGNED': return 'bg-blue-100 text-blue-800'
      case 'OUT_FOR_DELIVERY': return 'bg-purple-100 text-purple-800'
      case 'DELIVERED': return 'bg-green-100 text-green-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const statusFilters = ['ALL', 'PENDING', 'ASSIGNED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED']
  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearch = delivery.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.customerPhone.includes(searchTerm) ||
                         delivery.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || delivery.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Delivery Management</h1>
          <p className="text-gray-600">Manage deliveries, track drivers, and optimize routes</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Deliveries</CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {deliveries.filter(d => d.status !== 'DELIVERED' && d.status !== 'CANCELLED').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Out for Delivery</CardTitle>
              <MapPin className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {deliveries.filter(d => d.status === 'OUT_FOR_DELIVERY').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
              <Calendar className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {deliveries.filter(d => 
                  d.status === 'DELIVERED' && 
                  new Date(d.actualTime || '').toDateString() === new Date().toDateString()
                ).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Distance</CardTitle>
              <MapPin className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {deliveries.length > 0 
                  ? (deliveries.reduce((sum, d) => sum + d.distance, 0) / deliveries.length).toFixed(1)
                  : '0'
                } km
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">Active Deliveries</TabsTrigger>
            <TabsTrigger value="create">New Delivery</TabsTrigger>
            <TabsTrigger value="tracking">Tracking</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <Card>
              <CardHeader>
                <CardTitle>Active Deliveries</CardTitle>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search deliveries..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusFilters.map(filter => (
                        <SelectItem key={filter} value={filter}>
                          {filter.replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredDeliveries.map(delivery => (
                    <div key={delivery.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{delivery.orderNumber}</h3>
                            <Badge className={getStatusColor(delivery.status)}>
                              {delivery.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            <p><strong>Customer:</strong> {delivery.customerName}</p>
                            <p><strong>Phone:</strong> {delivery.customerPhone}</p>
                            <p><strong>Address:</strong> {delivery.customerAddress}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedDelivery(delivery)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setTrackingDialog(true)}
                          >
                            <MapPin className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Driver:</span>
                          <p>{delivery.driver?.name || 'Not assigned'}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Distance:</span>
                          <p>{delivery.distance} km</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Est. Time:</span>
                          <p>{new Date(delivery.estimatedTime).toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Items:</span>
                          <p>{delivery.items.length} products</p>
                        </div>
                      </div>
                      {delivery.tracking && delivery.tracking.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <div className="text-sm text-gray-500">Latest Update:</div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-3 w-3" />
                            <span>{new Date(delivery.tracking[0].timestamp).toLocaleString()}</span>
                          </div>
                          <p>{delivery.tracking[0].notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>Create New Delivery</CardTitle>
                <p className="text-sm text-gray-600">Add a new delivery order for customer</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customer-name">Customer Name</Label>
                    <Input
                      id="customer-name"
                      value={newDelivery.customerName}
                      onChange={(e) => setNewDelivery(prev => ({ ...prev, customerName: e.target.value }))}
                      placeholder="Customer name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customer-phone">Customer Phone</Label>
                    <Input
                      id="customer-phone"
                      value={newDelivery.customerPhone}
                      onChange={(e) => setNewDelivery(prev => ({ ...prev, customerPhone: e.target.value }))}
                      placeholder="Phone number"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="customer-address">Delivery Address</Label>
                  <Textarea
                    id="customer-address"
                    value={newDelivery.customerAddress}
                    onChange={(e) => setNewDelivery(prev => ({ ...prev, customerAddress: e.target.value }))}
                    placeholder="Full delivery address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="estimated-time">Estimated Delivery Time</Label>
                    <Input
                      id="estimated-time"
                      type="datetime-local"
                      value={newDelivery.estimatedTime}
                      onChange={(e) => setNewDelivery(prev => ({ ...prev, estimatedTime: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={newDelivery.notes}
                      onChange={(e) => setNewDelivery(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Additional delivery notes"
                    />
                  </div>
                </div>

                <div>
                  <Label>Delivery Items</Label>
                  <div className="space-y-2">
                    {newDelivery.items.map((item, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-2 p-3 border rounded">
                        <Input
                          placeholder="Product name"
                          value={item.productName}
                          onChange={(e) => {
                            const updatedItems = [...newDelivery.items]
                            updatedItems[index].productName = e.target.value
                            setNewDelivery(prev => ({ ...prev, items: updatedItems }))
                          }}
                        />
                        <Input
                          type="number"
                          placeholder="Quantity"
                          value={item.quantity}
                          onChange={(e) => {
                            const updatedItems = [...newDelivery.items]
                            updatedItems[index].quantity = parseInt(e.target.value)
                            setNewDelivery(prev => ({ ...prev, items: updatedItems }))
                          }}
                        />
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="THC %"
                          value={item.thcContent}
                          onChange={(e) => {
                            const updatedItems = [...newDelivery.items]
                            updatedItems[index].thcContent = parseFloat(e.target.value)
                            setNewDelivery(prev => ({ ...prev, items: updatedItems }))
                          }}
                        />
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="CBD %"
                          value={item.cbdContent}
                          onChange={(e) => {
                            const updatedItems = [...newDelivery.items]
                            updatedItems[index].cbdContent = parseFloat(e.target.value)
                            setNewDelivery(prev => ({ ...prev, items: updatedItems }))
                          }}
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const updatedItems = newDelivery.items.filter((_, i) => i !== index)
                            setNewDelivery(prev => ({ ...prev, items: updatedItems }))
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      size="sm"
                      onClick={() => {
                        setNewDelivery(prev => ({
                          ...prev,
                          items: [...prev.items, { productName: '', quantity: 1, thcContent: 0, cbdContent: 0 }]
                        }))
                      }}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <Button onClick={createDelivery} className="w-full">
                  Create Delivery
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tracking">
            <Card>
              <CardHeader>
                <CardTitle>Real-time Tracking</CardTitle>
                <p className="text-sm text-gray-600">Monitor all active deliveries in real-time</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deliveries
                    .filter(d => d.status === 'OUT_FOR_DELIVERY' || d.status === 'ASSIGNED')
                    .map(delivery => (
                      <div key={delivery.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                          <div>
                            <h4 className="font-semibold">{delivery.orderNumber}</h4>
                            <p className="text-sm text-gray-600">{delivery.customerName}</p>
                          </div>
                          <Badge className={getStatusColor(delivery.status)}>
                            {delivery.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Driver:</span>
                            <p>{delivery.driver?.name || 'Not assigned'}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Phone:</span>
                            <p>{delivery.driver?.phone || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Distance:</span>
                            <p>{delivery.distance} km</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Est. Arrival:</span>
                            <p>{new Date(delivery.estimatedTime).toLocaleString()}</p>
                          </div>
                        </div>
                        {delivery.tracking && delivery.tracking.length > 0 && (
                          <div className="mt-3 pt-3 border-t">
                            <div className="text-sm text-gray-500">Latest Update:</div>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-3 w-3" />
                              <span>{new Date(delivery.tracking[0].timestamp).toLocaleString()}</span>
                            </div>
                            <p>{delivery.tracking[0].notes}</p>
                            {delivery.tracking[0].location && (
                              <p className="text-xs text-blue-600">📍 {delivery.tracking[0].location}</p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Delivery Details Dialog */}
        <Dialog open={!!selectedDelivery} onOpenChange={() => setSelectedDelivery(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Delivery Details - {selectedDelivery?.orderNumber}</DialogTitle>
            </DialogHeader>
            {selectedDelivery && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Customer Name</Label>
                    <p className="font-medium">{selectedDelivery.customerName}</p>
                  </div>
                  <div>
                    <Label>Customer Phone</Label>
                    <p className="font-medium">{selectedDelivery.customerPhone}</p>
                  </div>
                  <div className="md:col-span-2">
                    <Label>Delivery Address</Label>
                    <p className="font-medium">{selectedDelivery.customerAddress}</p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Badge className={getStatusColor(selectedDelivery.status)}>
                      {selectedDelivery.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div>
                    <Label>Distance</Label>
                    <p className="font-medium">{selectedDelivery.distance} km</p>
                  </div>
                </div>

                <div>
                  <Label>Delivery Items</Label>
                  <div className="space-y-2">
                    {selectedDelivery.items.map((item, index) => (
                      <div key={index} className="p-2 border rounded">
                        <div className="font-medium">{item.productName}</div>
                        <div className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                          {item.thcContent > 0 && ` • THC: ${item.thcContent}%`}
                          {item.cbdContent > 0 && ` • CBD: ${item.cbdContent}%`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Tracking History</Label>
                  <div className="space-y-2">
                    {selectedDelivery.tracking?.map((track, index) => (
                      <div key={index} className="p-2 border rounded">
                        <div className="flex justify-between items-center">
                          <Badge className={getStatusColor(track.status)}>
                            {track.status.replace('_', ' ')}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {new Date(track.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm mt-1">{track.notes}</p>
                        {track.location && (
                          <p className="text-xs text-blue-600 mt-1">📍 {track.location}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      if (selectedDelivery.status === 'PENDING') {
                        updateDeliveryStatus(selectedDelivery.id, 'ASSIGNED')
                      } else if (selectedDelivery.status === 'ASSIGNED') {
                        updateDeliveryStatus(selectedDelivery.id, 'OUT_FOR_DELIVERY')
                      }
                    }}
                    className="flex-1"
                  >
                    {selectedDelivery.status === 'PENDING' ? 'Assign Driver' : 
                     selectedDelivery.status === 'ASSIGNED' ? 'Start Delivery' :
                     selectedDelivery.status === 'OUT_FOR_DELIVERY' ? 'Mark Delivered' : 'Update Status'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setTrackingDialog(true)}
                  >
                    Add Update
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Tracking Update Dialog */}
        <Dialog open={trackingDialog} onOpenChange={setTrackingDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Tracking Update</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="tracking-status">Status</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ASSIGNED">Assigned</SelectItem>
                    <SelectItem value="OUT_FOR_DELIVERY">Out for Delivery</SelectItem>
                    <SelectItem value="DELIVERED">Delivered</SelectItem>
                    <SelectItem value="DELAYED">Delayed</SelectItem>
                    <SelectItem value="ISSUE">Issue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="tracking-notes">Notes</Label>
                <Textarea
                  id="tracking-notes"
                  placeholder="Enter tracking notes..."
                />
              </div>
              <div>
                <Label htmlFor="tracking-location">Location (Optional)</Label>
                <Input
                  id="tracking-location"
                  placeholder="Current location"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setTrackingDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    // Add tracking logic here
                    setTrackingDialog(false)
                  }}
                >
                  Add Update
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}