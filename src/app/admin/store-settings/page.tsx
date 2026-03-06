'use client'

import PageTemplate from '@/components/PageTemplate'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Settings, 
  Users,
  TrendingUp,
  DollarSign,
  Package,
  Edit,
  Plus
} from 'lucide-react'

export default function StoreSettingsPage() {
  const stores = [
    {
      id: '1',
      name: 'Store #1 - Downtown',
      address: '123 Main St, Downtown, CA 90210',
      phone: '(555) 123-4567',
      email: 'store1@cannabisos.com',
      manager: 'John Manager',
      status: 'active',
      openTime: '9:00 AM',
      closeTime: '9:00 PM',
      revenue: 45230.00,
      employees: 8,
      rating: 4.6
    },
    {
      id: '2',
      name: 'Store #2 - Uptown',
      address: '456 Oak Ave, Uptown, CA 90211',
      phone: '(555) 987-6543',
      email: 'store2@cannabisos.com',
      manager: 'Sarah Wilson',
      status: 'active',
      openTime: '10:00 AM',
      closeTime: '8:00 PM',
      revenue: 32180.00,
      employees: 6,
      rating: 4.4
    },
    {
      id: '3',
      name: 'Store #3 - Midtown',
      address: '789 Pine Rd, Midtown, CA 90212',
      phone: '(555) 456-7890',
      email: 'store3@cannabisos.com',
      manager: 'Mike Davis',
      status: 'maintenance',
      openTime: '11:00 AM',
      closeTime: '7:00 PM',
      revenue: 28940.00,
      employees: 5,
      rating: 4.2
    }
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'maintenance': return 'bg-yellow-100 text-yellow-800'
      case 'closed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <PageTemplate
      title="Store Settings"
      description="Manage all store locations and configurations"
      pageType="admin"
    >
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stores</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stores.length}</div>
            <p className="text-xs text-muted-foreground">
              All locations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Stores</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stores.filter(s => s.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground">
              Currently operating
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stores.reduce((sum, store) => sum + store.revenue, 0))}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stores.reduce((sum, store) => sum + store.employees, 0)}</div>
            <p className="text-xs text-muted-foreground">
              All employees
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Add Store Button */}
      <Card>
        <CardContent className="pt-6">
          <Button className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add New Store
          </Button>
        </CardContent>
      </Card>

      {/* Stores List */}
      <div className="space-y-4">
        {stores.map((store) => (
          <Card key={store.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    {store.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getStatusColor(store.status)}>
                      {store.status}
                    </Badge>
                    <Badge variant="outline">
                      Rating: {store.rating}/5
                    </Badge>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    {store.address}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-500" />
                    {store.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-500" />
                    {store.email}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-gray-500" />
                    Manager: {store.manager}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-gray-500" />
                    {store.openTime} - {store.closeTime}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="h-4 w-4 text-gray-500" />
                    {store.employees} employees
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Monthly Revenue</span>
                    <span className="font-semibold">{formatCurrency(store.revenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Customer Rating</span>
                    <span className="font-semibold">{store.rating}/5.0</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Settings className="h-4 w-4 mr-1" />
                      Settings
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      Analytics
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageTemplate>
  )
}