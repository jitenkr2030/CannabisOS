'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import NotificationSystem from '@/components/NotificationSystem'
import { 
  Users, 
  ShoppingCart, 
  Package, 
  DollarSign, 
  TrendingUp, 
  Building2,
  Globe,
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
  Shield,
  Zap,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Bell,
  Search,
  Download
} from 'lucide-react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

interface AdminDashboardProps {
  user: any
  onLogout: () => void
}

export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const router = useRouter()
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Fetch analytics data
  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics?period=month')
      const data = await response.json()
      setAnalytics(data)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchAnalytics()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  // Chart colors
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0']

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Loading analytics data...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">No analytics data available</p>
          </div>
          <Button onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Admin Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">System-wide overview and management</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="default" className="bg-purple-100 text-purple-800">
              <Shield className="h-3 w-3 mr-1" />
              Super Admin
            </Badge>
            <span className="text-sm text-gray-500">Welcome back, {user?.name}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <NotificationSystem userId={user?.id} />
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            System Settings
          </Button>
          <Button variant="outline" size="sm" onClick={onLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analytics.overview.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              {analytics.overview.revenueGrowth > 0 ? (
                <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              {analytics.overview.revenueGrowth > 0 ? '+' : ''}{analytics.overview.revenueGrowth.toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analytics.overview.totalSales)}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.overview.totalOrders} orders completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analytics.overview.activeUsers)}</div>
            <p className="text-xs text-muted-foreground">
              Total registered users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analytics.overview.totalProfit)}</div>
            <p className="text-xs text-muted-foreground">
              {((analytics.overview.totalProfit / analytics.overview.totalRevenue) * 100).toFixed(1)}% profit margin
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.timeSeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => [formatCurrency(value), 'Revenue']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ fill: '#8884d8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sales by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.timeSeries.slice(-7).map((day, index) => ({
                    name: `Day ${index + 1}`,
                    value: day.sales
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analytics.timeSeries.slice(-7).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle>Top Products by Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.topProducts.slice(0, 5)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value: any) => [formatCurrency(value), 'Revenue']}
                labelFormatter={(label) => `Product: ${label}`}
              />
              <Bar dataKey="revenue" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Customer Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Customers</span>
                <span className="font-semibold">{analytics.customerAnalytics.totalCustomers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Repeat Customers</span>
                <span className="font-semibold">{analytics.customerAnalytics.repeatCustomers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Retention Rate</span>
                <span className="font-semibold">{analytics.customerAnalytics.customerRetentionRate.toFixed(1)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delivery Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Deliveries</span>
                <span className="font-semibold">{analytics.deliveryPerformance.totalDeliveries}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="font-semibold">{analytics.deliveryPerformance.completedDeliveries}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Completion Rate</span>
                <span className="font-semibold">{analytics.deliveryPerformance.completionRate.toFixed(1)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Value</span>
                <span className="font-semibold">{formatCurrency(analytics.overview.totalInventoryValue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Low Stock Items</span>
                <span className="font-semibold text-orange-600">{analytics.overview.lowStockItems}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Products</span>
                <span className="font-semibold">{analytics.topProducts.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="w-full justify-start" variant="outline" onClick={() => router.push('/admin/reports')}>
              <FileText className="h-4 w-4 mr-2" />
              Generate Reports
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => router.push('/search?entity=sales')}>
              <Search className="h-4 w-4 mr-2" />
              Advanced Search
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => router.push('/notifications')}>
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => router.push('/admin/analytics')}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Admin Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Button className="w-full justify-start" variant="outline" onClick={() => router.push('/admin/manage-users')}>
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => router.push('/admin/store-settings')}>
              <Building2 className="h-4 w-4 mr-2" />
              Store Settings
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => router.push('/admin/security-center')}>
              <Shield className="h-4 w-4 mr-2" />
              Security Center
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => router.push('/admin/system-reports')}>
              <FileText className="h-4 w-4 mr-2" />
              System Reports
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => router.push('/admin/system-logs')}>
              <Zap className="h-4 w-4 mr-2" />
              System Logs
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => router.push('/admin/analytics')}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Advanced Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}