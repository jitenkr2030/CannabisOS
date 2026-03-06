'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  ShoppingCart, 
  Package, 
  DollarSign, 
  TrendingUp, 
  Building2,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Settings,
  LogOut,
  Eye,
  BarChart3,
  Target,
  Award,
  Star,
  Activity,
  FileText,
  Store,
  Users2,
  MessageSquare,
  Clock
} from 'lucide-react'

interface ManagerDashboardProps {
  user: any
  onLogout: () => void
}

export default function ManagerDashboard({ user, onLogout }: ManagerDashboardProps) {
  const router = useRouter()
  const [stats, setStats] = useState({
    staffCount: 12,
    activeStaff: 10,
    todaySales: 2840.50,
    weeklyRevenue: 18920.00,
    inventoryItems: 156,
    lowStockItems: 8,
    pendingOrders: 14,
    completedOrders: 89,
    customerRating: 4.6,
    avgTransactionValue: 68.40,
    storeEfficiency: '87%',
    shiftPerformance: 'Good'
  })

  const [staffMembers] = useState([
    { id: '1', name: 'Jane Smith', role: 'Budtender', status: 'active', performance: 'Excellent' },
    { id: '2', name: 'Mike Johnson', role: 'Budtender', status: 'active', performance: 'Good' },
    { id: '3', name: 'Sarah Davis', role: 'Cashier', status: 'on-break', performance: 'Good' },
    { id: '4', name: 'Tom Wilson', role: 'Security', status: 'active', performance: 'Excellent' }
  ])

  const [recentActivities] = useState([
    { id: '1', type: 'sale', description: 'Large order completed - $450.00', timestamp: new Date(Date.now() - 1000 * 60 * 5), status: 'success' },
    { id: '2', type: 'staff', description: 'Jane Smith started shift', timestamp: new Date(Date.now() - 1000 * 60 * 15), status: 'success' },
    { id: '3', type: 'inventory', description: 'Low stock alert: Blue Dream', timestamp: new Date(Date.now() - 1000 * 60 * 30), status: 'warning' },
    { id: '4', type: 'customer', description: 'Customer complaint resolved', timestamp: new Date(Date.now() - 1000 * 60 * 45), status: 'success' }
  ])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'sale': return <DollarSign className="h-4 w-4" />
      case 'staff': return <Users className="h-4 w-4" />
      case 'inventory': return <Package className="h-4 w-4" />
      case 'customer': return <MessageSquare className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Manager Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
          <p className="text-gray-600">Store operations and team management</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="default" className="bg-blue-100 text-blue-800">
              <Building2 className="h-3 w-3 mr-1" />
              Store Manager
            </Badge>
            <span className="text-sm text-gray-500">Welcome back, {user?.name}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Store Settings
          </Button>
          <Button variant="outline" size="sm" onClick={onLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Store Performance */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5 text-blue-600" />
            Store Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.storeEfficiency}</div>
              <div className="text-sm text-gray-600">Store Efficiency</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.customerRating}</div>
              <div className="text-sm text-gray-600">Customer Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{formatCurrency(stats.avgTransactionValue)}</div>
              <div className="text-sm text-gray-600">Avg Transaction</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.shiftPerformance}</div>
              <div className="text-sm text-gray-600">Shift Performance</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Staff Members</CardTitle>
            <Users2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.staffCount}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeStaff} active now
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.todaySales)}</div>
            <p className="text-xs text-muted-foreground">
              +12% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.weeklyRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              On track for goal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inventoryItems}</div>
            <p className="text-xs text-muted-foreground">
              {stats.lowStockItems} low stock
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Staff Management */}
        <Card>
          <CardHeader>
            <CardTitle>Staff Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {staffMembers.map((staff) => (
                <div key={staff.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{staff.name}</p>
                      <p className="text-sm text-gray-600">{staff.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={staff.status === 'active' ? 'default' : 'secondary'}>
                      {staff.status}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">{staff.performance}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Store Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Store Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-100 text-green-600' :
                    activity.status === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.description}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.timestamp.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Manager Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Manager Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="w-full justify-start" variant="outline" onClick={() => router.push('/manager/staff-schedule')}>
              <Users2 className="h-4 w-4 mr-2" />
              Staff Schedule
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => router.push('/manager/inventory')}>
              <Package className="h-4 w-4 mr-2" />
              Inventory
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => router.push('/manager/customer-service')}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Customer Service
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => router.push('/manager/sales-reports')}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Sales Reports
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => router.push('/manager/shift-planning')}>
              <Calendar className="h-4 w-4 mr-2" />
              Shift Planning
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => router.push('/manager/performance')}>
              <Target className="h-4 w-4 mr-2" />
              Performance
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => router.push('/manager/staff-training')}>
              <Award className="h-4 w-4 mr-2" />
              Staff Training
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => router.push('/manager/store-settings')}>
              <Store className="h-4 w-4 mr-2" />
              Store Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}