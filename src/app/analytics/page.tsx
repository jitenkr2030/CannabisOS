'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Calendar, 
  Filter,
  Download,
  BarChart3,
  PieChart,
  LineChart,
  AreaChart,
  Activity,
  Eye,
  Click,
  MousePointer,
  Target,
  Zap,
  Clock,
  AlertCircle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Minus,
  Plus,
  RefreshCw,
  Settings,
  Share2,
  FileText,
  Database,
  Server,
  Cloud,
  Wifi,
  Smartphone,
  Tablet,
  Monitor,
  Globe,
  MapPin,
  Navigation,
  Route,
  Truck,
  Package,
  CreditCard
} from 'lucide-react'

export default function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [dateRange, setDateRange] = useState('7d')
  const [isLoading, setIsLoading] = useState(false)

  // Mock analytics data
  const overviewStats = {
    revenue: {
      current: 45678,
      previous: 38945,
      growth: 17.3,
      trend: 'up'
    },
    orders: {
      current: 1234,
      previous: 1098,
      growth: 12.4,
      trend: 'up'
    },
    users: {
      current: 856,
      previous: 723,
      growth: 18.4,
      trend: 'up'
    },
    conversion: {
      current: 3.4,
      previous: 2.9,
      growth: 17.2,
      trend: 'up'
    },
    avgOrderValue: {
      current: 37.02,
      previous: 35.45,
      growth: 4.4,
      trend: 'up'
    },
    cartAbandonment: {
      current: 68.3,
      previous: 71.2,
      growth: -4.1,
      trend: 'down'
    }
  }

  const salesData = [
    { date: '2024-01-01', revenue: 4567, orders: 123, users: 89, conversion: 3.2 },
    { date: '2024-01-02', revenue: 5234, orders: 145, users: 102, conversion: 3.5 },
    { date: '2024-01-03', revenue: 4890, orders: 134, users: 95, conversion: 3.4 },
    { date: '2024-01-04', revenue: 5678, orders: 156, users: 112, conversion: 3.6 },
    { date: '2024-01-05', revenue: 6123, orders: 167, users: 125, conversion: 3.8 },
    { date: '2024-01-06', revenue: 5890, orders: 161, users: 118, conversion: 3.7 },
    { date: '2024-01-07', revenue: 6456, orders: 178, users: 134, conversion: 3.9 }
  ]

  const topProducts = [
    { name: 'Blue Dream', revenue: 12345, orders: 334, growth: 12.3, category: 'Flower' },
    { name: 'OG Kush', revenue: 9876, orders: 267, growth: 8.7, category: 'Flower' },
    { name: 'Girl Scout Cookies', revenue: 8765, orders: 234, growth: 15.2, category: 'Flower' },
    { name: 'Sour Diesel', revenue: 7654, orders: 201, growth: 6.8, category: 'Flower' },
    { name: 'Granddaddy Purple', revenue: 6543, orders: 178, growth: 9.3, category: 'Flower' }
  ]

  const customerSegments = [
    { segment: 'New Customers', count: 234, revenue: 12345, avgOrderValue: 52.7, growth: 23.4 },
    { segment: 'Returning Customers', count: 456, revenue: 34567, avgOrderValue: 75.8, growth: 12.3 },
    { segment: 'VIP Customers', count: 89, revenue: 23456, avgOrderValue: 263.7, growth: 8.9 },
    { segment: 'Inactive Customers', count: 123, revenue: 3456, avgOrderValue: 28.1, growth: -5.6 }
  ]

  const trafficSources = [
    { source: 'Direct', visitors: 12345, revenue: 45678, conversion: 3.7, bounce: 32.1 },
    { source: 'Organic Search', visitors: 9876, revenue: 34567, conversion: 3.5, bounce: 28.4 },
    { source: 'Social Media', visitors: 7654, revenue: 23456, conversion: 3.1, bounce: 41.2 },
    { source: 'Email', visitors: 5432, revenue: 18765, conversion: 3.5, bounce: 24.7 },
    { source: 'Paid Ads', visitors: 4321, revenue: 15432, conversion: 3.6, bounce: 35.8 }
  ]

  const devicePerformance = [
    { device: 'Desktop', visitors: 45678, revenue: 123456, conversion: 2.7, bounce: 31.2 },
    { device: 'Mobile', visitors: 34567, revenue: 87654, conversion: 2.5, bounce: 42.3 },
    { device: 'Tablet', visitors: 12345, revenue: 34567, conversion: 2.8, bounce: 38.7 }
  ]

  const realTimeMetrics = {
    activeUsers: 1234,
    currentVisitors: 856,
    onlineOrders: 23,
    avgSessionDuration: 245,
    bounceRate: 32.4,
    pageViews: 5678,
    conversionRate: 3.2
  }

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? <ArrowUp className="h-4 w-4 text-green-600" /> : 
           trend === 'down' ? <ArrowDown className="h-4 w-4 text-red-600" /> : 
           <Minus className="h-4 w-4 text-gray-600" />
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
                <p className="text-sm text-gray-500">Comprehensive insights and metrics</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <select 
                value={dateRange} 
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-100">Active Users</p>
                  <p className="text-2xl font-bold">{realTimeMetrics.activeUsers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-100">Current Visitors</p>
                  <p className="text-2xl font-bold">{realTimeMetrics.currentVisitors}</p>
                </div>
                <Eye className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-100">Online Orders</p>
                  <p className="text-2xl font-bold">{realTimeMetrics.onlineOrders}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-100">Avg Session</p>
                  <p className="text-2xl font-bold">{realTimeMetrics.avgSessionDuration}s</p>
                </div>
                <Clock className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-100">Bounce Rate</p>
                  <p className="text-2xl font-bold">{realTimeMetrics.bounceRate}%</p>
                </div>
                <Activity className="h-8 w-8 text-red-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-indigo-100">Page Views</p>
                  <p className="text-2xl font-bold">{realTimeMetrics.pageViews}</p>
                </div>
                <Eye className="h-8 w-8 text-indigo-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-teal-100">Conversion Rate</p>
                  <p className="text-2xl font-bold">{realTimeMetrics.conversionRate}%</p>
                </div>
                <Target className="h-8 w-8 text-teal-200" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="traffic">Traffic</TabsTrigger>
            <TabsTrigger value="realtime">Real-time</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(overviewStats.revenue.current)}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    {getTrendIcon(overviewStats.revenue.trend)}
                    <span className={overviewStats.revenue.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                      {Math.abs(overviewStats.revenue.growth)}% from last month
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatNumber(overviewStats.orders.current)}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    {getTrendIcon(overviewStats.orders.trend)}
                    <span className={overviewStats.orders.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                      {Math.abs(overviewStats.orders.growth)}% from last month
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatNumber(overviewStats.users.current)}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    {getTrendIcon(overviewStats.users.trend)}
                    <span className={overviewStats.users.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                      {Math.abs(overviewStats.users.growth)}% from last month
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{overviewStats.conversion.current}%</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    {getTrendIcon(overviewStats.conversion.trend)}
                    <span className={overviewStats.conversion.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                      {Math.abs(overviewStats.conversion.growth)}% from last month
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(overviewStats.avgOrderValue.current)}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    {getTrendIcon(overviewStats.avgOrderValue.trend)}
                    <span className={overviewStats.avgOrderValue.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                      {Math.abs(overviewStats.avgOrderValue.growth)}% from last month
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cart Abandonment</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{overviewStats.cartAbandonment.current}%</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    {getTrendIcon(overviewStats.cartAbandonment.trend)}
                    <span className={overviewStats.cartAbandonment.trend === 'down' ? 'text-green-600' : 'text-red-600'}>
                      {Math.abs(overviewStats.cartAbandonment.growth)}% from last month
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Sales Tab */}
          <TabsContent value="sales" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Sales Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between">
                  {salesData.map((data, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div 
                        className="w-full bg-blue-600 rounded-t"
                        style={{ height: `${(data.revenue / 6456) * 100}%` }}
                      ></div>
                      <p className="text-xs text-gray-500 mt-1">{data.date.slice(5)}</p>
                      <p className="text-sm font-semibold">{formatCurrency(data.revenue)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Top Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold">{product.name}</h3>
                          <p className="text-sm text-gray-500">{product.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(product.revenue)}</p>
                        <p className="text-sm text-gray-500">{product.orders} orders</p>
                        <div className="flex items-center text-xs">
                          {getTrendIcon('up')}
                          <span className="text-green-600">{product.growth}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Customer Segments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customerSegments.map((segment, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold">{segment.segment}</h3>
                        <p className="text-sm text-gray-500">{segment.count} customers</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(segment.revenue)}</p>
                        <p className="text-sm text-gray-500">AOV: {formatCurrency(segment.avgOrderValue)}</p>
                        <div className="flex items-center text-xs">
                          {getTrendIcon(segment.growth > 0 ? 'up' : 'down')}
                          <span className={segment.growth > 0 ? 'text-green-600' : 'text-red-600'}>
                            {Math.abs(segment.growth)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Traffic Tab */}
          <TabsContent value="traffic" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="h-5 w-5 mr-2" />
                    Traffic Sources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trafficSources.map((source, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h3 className="font-semibold">{source.source}</h3>
                          <p className="text-sm text-gray-500">{source.visitors} visitors</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(source.revenue)}</p>
                          <p className="text-sm text-gray-500">CR: {source.conversion}%</p>
                          <p className="text-sm text-gray-500">Bounce: {source.bounce}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Smartphone className="h-5 w-5 mr-2" />
                    Device Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {devicePerformance.map((device, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h3 className="font-semibold">{device.device}</h3>
                          <p className="text-sm text-gray-500">{device.visitors} visitors</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(device.revenue)}</p>
                          <p className="text-sm text-gray-500">CR: {device.conversion}%</p>
                          <p className="text-sm text-gray-500">Bounce: {device.bounce}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Real-time Tab */}
          <TabsContent value="realtime" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Real-time Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-semibold">New Order</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Order #12345 - $156.78
                    </div>
                    <div className="text-xs text-gray-400">
                      Just now
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold">New User</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      john.doe@example.com
                    </div>
                    <div className="text-xs text-gray-400">
                      2 minutes ago
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <ShoppingCart className="h-5 w-5 text-orange-600" />
                      <span className="font-semibold">Cart Update</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Added Blue Dream to cart
                    </div>
                    <div className="text-xs text-gray-400">
                      5 minutes ago
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
