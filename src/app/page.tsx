'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Truck, 
  FileText, 
  QrCode, 
  Calculator, 
  Settings, 
  Users, 
  Menu,
  Leaf,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  BarChart3,
  LogOut,
  Plus,
  CreditCard
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import POSSystem from '@/components/POS-System'
import AccountingSystem from '@/components/Accounting-System'
import InventorySystem from '@/components/Inventory-System'
import DeliveryManagement from '@/components/Delivery-Management'
import QRAuthentication from '@/components/QR-Authentication'
import ReportsSystem from '@/components/Reports-System'
import SettingsSystem from '@/components/Settings-System'
import UserManagement from '@/components/User-Management'

interface User {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'MANAGER' | 'STAFF' | 'DRIVER' | 'ACCOUNTANT' | 'CONSULTANT' | 'PARTNER'
  storeId?: string
  partnerId?: string
}

export default function Dashboard({ user, onLogout }: { user?: any; onLogout?: () => void } = {}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeView, setActiveView] = useState('dashboard')
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      const storedUser = localStorage.getItem('cannabisos_user')
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser)
          setCurrentUser(parsedUser)
        } catch (error) {
          console.error('Failed to parse stored user:', error)
          localStorage.removeItem('cannabisos_user')
          router.push('/landing')
        }
      } else {
        router.push('/landing')
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  const handleLogout = () => {
    setCurrentUser(null)
    localStorage.removeItem('cannabisos_user')
    if (onLogout) {
      onLogout()
    } else {
      router.push('/landing')
    }
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Use the passed user prop or the current user from localStorage
  const activeUser = user || currentUser

  // If no user, redirect to landing page
  if (!activeUser) {
    return null
  }

  const navigation = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '#dashboard' },
    { name: 'POS & Sales', icon: ShoppingCart, href: '#pos' },
    { name: 'Inventory', icon: Package, href: '#inventory' },
    { name: 'Accounting', icon: Calculator, href: '#accounting' },
    { name: 'Delivery', icon: Truck, href: '#delivery' },
    { name: 'QR Auth', icon: QrCode, href: '#qr' },
    { name: 'Compliance', icon: FileText, href: '#compliance' },
    { name: 'Reports', icon: BarChart3, href: '#reports' },
    { name: 'Users', icon: Users, href: '#users' },
    { name: 'Settings', icon: Settings, href: '#settings' },
  ]

  const stats = [
    { name: 'Today\'s Sales', value: '$4,285', change: '+12.5%', icon: DollarSign, color: 'text-green-600' },
    { name: 'Active Orders', value: '23', change: '+4', icon: ShoppingCart, color: 'text-blue-600' },
    { name: 'Low Stock Items', value: '7', change: '-2', icon: AlertTriangle, color: 'text-orange-600' },
    { name: 'Pending Deliveries', value: '5', change: '+1', icon: Truck, color: 'text-purple-600' },
  ]

  const recentActivity = [
    { id: 1, action: 'New sale completed', detail: 'Order #1234 - $156.50', time: '2 min ago', type: 'sale' },
    { id: 2, action: 'Inventory alert', detail: 'Blue Dream - Low stock (3g remaining)', time: '15 min ago', type: 'alert' },
    { id: 3, action: 'Delivery assigned', detail: 'Order #1232 to Driver John', time: '1 hour ago', type: 'delivery' },
    { id: 4, action: 'Expense added', detail: 'Transport costs - $45 via voice', time: '2 hours ago', type: 'expense' },
  ]

  const renderActiveView = () => {
    // If user is a partner, show partner dashboard
    if (activeUser?.role === 'PARTNER') {
      return (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Partner Portal</h1>
                <p className="text-sm text-gray-600">Manage your referrals and commissions</p>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="default">Partner</Badge>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white shadow-sm border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Total Referrals</span>
                  <Users className="h-4 w-4 text-gray-500" />
                </div>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-gray-500">8 converted</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-sm border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Commission Earned</span>
                  <DollarSign className="h-4 w-4 text-gray-500" />
                </div>
                <div className="text-2xl font-bold text-green-600">$3,240</div>
                <p className="text-xs text-gray-500">25% rate</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-sm border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Active Clients</span>
                  <div className="w-4 h-4 text-gray-500" />
                </div>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-gray-500">Growing</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-sm border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">White-Label</span>
                  <div className="w-4 h-4 text-gray-500" />
                </div>
                <div className="text-2xl font-bold">Active</div>
                <p className="text-xs text-gray-500">Custom domain</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }

    // If user is a consultant, show consultant dashboard
    if (activeUser?.role === 'CONSULTANT') {
      return (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Consultant Portal</h1>
                <p className="text-sm text-gray-600">Manage your clients and revenue</p>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="default">Consultant</Badge>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white shadow-sm border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Total Clients</span>
                  <Users className="h-4 w-4 text-gray-500" />
                </div>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-gray-500">2 at risk</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-sm border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Monthly Revenue</span>
                  <DollarSign className="h-4 w-4 text-gray-500" />
                </div>
                <div className="text-2xl font-bold">$1,980</div>
                <p className="text-xs text-gray-500">From active clients</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-sm border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Pending Reports</span>
                  <FileText className="h-4 w-4 text-gray-500" />
                </div>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-gray-500">Require attention</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-sm border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Total Stores</span>
                  <div className="w-4 h-4 text-gray-500" />
                </div>
                <div className="text-2xl font-bold">18</div>
                <p className="text-xs text-gray-500">Across all clients</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }

    // Original dashboard logic for other roles
    switch (activeView) {
      case 'pos':
        return <POSSystem />
      case 'accounting':
        return <AccountingSystem />
      case 'inventory':
        return <InventorySystem />
      case 'delivery':
        return <DeliveryManagement />
      case 'qr':
        return <QRAuthentication />
      case 'reports':
        return <ReportsSystem />
      case 'compliance':
        return <ReportsSystem />
      case 'settings':
        return <SettingsSystem />
      case 'users':
        return <UserManagement />
      default:
        return (
          <>
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
              <p className="text-gray-600">Monitor your dispensary operations at a glance</p>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {stats.map((stat) => (
                <Card key={stat.name} className="bg-white shadow-sm border">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {stat.name}
                    </CardTitle>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className={stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                        {stat.change}
                      </span>{' '}
                      from yesterday
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="sales">Sales</TabsTrigger>
                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                <TabsTrigger value="compliance">Compliance</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Recent Activity */}
                  <Card className="lg:col-span-2 bg-white shadow-sm border">
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>Latest updates from your dispensary</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentActivity.map((activity) => (
                          <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50">
                            <div className={`
                              w-2 h-2 rounded-full
                              ${activity.type === 'sale' ? 'bg-green-500' : ''}
                              ${activity.type === 'alert' ? 'bg-orange-500' : ''}
                              ${activity.type === 'delivery' ? 'bg-blue-500' : ''}
                              ${activity.type === 'expense' ? 'bg-purple-500' : ''}
                            `} />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                              <p className="text-sm text-gray-500">{activity.detail}</p>
                            </div>
                            <span className="text-xs text-gray-400">{activity.time}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card className="bg-white shadow-sm border">
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                      <CardDescription>Common tasks</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button className="w-full justify-start" variant="outline" onClick={() => setActiveView('pos')}>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        New Sale
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <Package className="mr-2 h-4 w-4" />
                        Add Inventory
                      </Button>
                      <Button className="w-full justify-start" variant="outline" onClick={() => setActiveView('accounting')}>
                        <Calculator className="mr-2 h-4 w-4" />
                        Manage Expenses
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <Truck className="mr-2 h-4 w-4" />
                        New Delivery
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <QrCode className="mr-2 h-4 w-4" />
                        Generate QR
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="sales">
                <Card className="bg-white shadow-sm border">
                  <CardHeader>
                    <CardTitle>Sales Overview</CardTitle>
                    <CardDescription>Track your dispensary sales performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-gray-500">
                      <BarChart3 className="mx-auto h-12 w-12 mb-4 opacity-50" />
                      <p>Sales analytics and charts will be displayed here</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="inventory">
                <Card className="bg-white shadow-sm border">
                  <CardHeader>
                    <CardTitle>Inventory Status</CardTitle>
                    <CardDescription>Monitor stock levels and batch tracking</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-gray-500">
                      <Package className="mx-auto h-12 w-12 mb-4 opacity-50" />
                      <p>Inventory management interface will be displayed here</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="compliance">
                <Card className="bg-white shadow-sm border">
                  <CardHeader>
                    <CardTitle>Compliance Dashboard</CardTitle>
                    <CardDescription>Health Canada reporting and compliance status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                      <p>Compliance reports and status will be displayed here</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <div className="flex">
        {/* Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between h-16 px-6 border-b">
              <div className="flex items-center space-x-2">
                <Leaf className="h-8 w-8 text-green-600" />
                <span className="text-xl font-bold text-gray-900">CannabisOS</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                ×
              </Button>
            </div>
            
            {/* Navigation */}
            <nav className="flex-1 px-3 py-6 overflow-y-auto">
              <div className="space-y-1">
                {navigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      setActiveView(item.href.substring(1))
                      setSidebarOpen(false)
                    }}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeView === item.href.substring(1) 
                        ? 'bg-green-100 text-green-700 border border-green-200' 
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </button>
                ))}
              </div>
            </nav>

            {/* Sidebar Footer */}
            <div className="border-t p-4 space-y-3">
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8 bg-green-600">
                  <AvatarFallback className="text-white text-sm font-medium">
                    {activeUser?.name ? activeUser.name.split(' ').map(n => n[0]).join('') : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activeUser?.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {activeUser?.role === 'CONSULTANT' ? 'Compliance Consultant' : 
                     activeUser?.role === 'PARTNER' ? 'Partner' :
                     activeUser?.role === 'ADMIN' ? 'Administrator' :
                     activeUser?.role === 'MANAGER' ? 'Store Manager' :
                     activeUser?.role === 'STAFF' ? 'Staff' :
                     activeUser?.role === 'DRIVER' ? 'Driver' :
                     activeUser?.role === 'ACCOUNTANT' ? 'Accountant' : 'Staff'}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="w-full justify-start" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 lg:pl-0">
          {/* Top header */}
          <header className="bg-white shadow-sm border-b sticky top-0 z-30">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="lg:hidden"
                    onClick={() => setSidebarOpen(true)}
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                  
                  <div className="hidden sm:block">
                    <h1 className="text-xl font-semibold text-gray-900">
                      {activeView === 'dashboard' ? 'Dashboard Overview' :
                       activeView === 'pos' ? 'Point of Sale' :
                       activeView === 'inventory' ? 'Inventory Management' :
                       activeView === 'accounting' ? 'Accounting System' :
                       activeView === 'delivery' ? 'Delivery Management' :
                       activeView === 'qr' ? 'QR Authentication' :
                       activeView === 'reports' ? 'Reports System' :
                       activeView === 'compliance' ? 'Compliance Reports' :
                       activeView === 'settings' ? 'Settings' :
                       activeView === 'users' ? 'User Management' : 'Dashboard'}
                    </h1>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Badge variant="outline" className="text-green-600 border-green-600 hidden sm:flex">
                    {activeUser?.role === 'CONSULTANT' ? 'Consultant Portal' : 
                     activeUser?.role === 'PARTNER' ? 'Partner Portal' :
                     'Store: Toronto Main'}
                  </Badge>
                  
                  <div className="hidden sm:block">
                    <span className="text-sm text-gray-500">Welcome back, {activeUser?.name || 'User'}!</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setActiveView('pos')}>
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">New Sale</span>
                    </Button>
                    <Button size="sm">
                      <Plus className="h-4 w-4" />
                      <span className="hidden sm:inline ml-1">Quick Add</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {renderActiveView()}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}