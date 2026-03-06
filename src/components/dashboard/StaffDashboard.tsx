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
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Settings,
  LogOut,
  Eye,
  BarChart3,
  Target,
  Star,
  Activity,
  MessageSquare,
  Phone,
  User,
  Timer,
  Coffee
} from 'lucide-react'

interface StaffDashboardProps {
  user: any
  onLogout: () => void
}

export default function StaffDashboard({ user, onLogout }: StaffDashboardProps) {
  const router = useRouter()
  const [stats, setStats] = useState({
    todaySales: 1240.75,
    transactionsCount: 18,
    avgSaleAmount: 68.93,
    customersHelped: 45,
    shiftDuration: '4h 30m',
    breakTime: '30m',
    performanceRating: 4.4,
    tipsReceived: 156.50,
    tasksCompleted: 12,
    pendingTasks: 3
  })

  const [todayTasks] = useState([
    { id: '1', title: 'Restock shelves', priority: 'high', status: 'completed', dueTime: '2:00 PM' },
    { id: '2', title: 'Help customer with product selection', priority: 'medium', status: 'completed', dueTime: '3:30 PM' },
    { id: '3', title: 'Clean display area', priority: 'low', status: 'pending', dueTime: '5:00 PM' },
    { id: '4', title: 'Inventory check', priority: 'medium', status: 'pending', dueTime: '6:00 PM' }
  ])

  const [recentSales] = useState([
    { id: '1', product: 'Blue Dream', amount: 68.50, customer: 'John D.', time: '2:45 PM' },
    { id: '2', product: 'OG Kush', amount: 54.25, customer: 'Sarah M.', time: '2:30 PM' },
    { id: '3', product: 'Sour Diesel', amount: 72.00, customer: 'Mike R.', time: '2:15 PM' },
    { id: '4', product: 'Girl Scout Cookies', amount: 45.75, customer: 'Lisa K.', time: '1:45 PM' }
  ])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Staff Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
          <p className="text-gray-600">Your shift performance and tasks</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="default" className="bg-green-100 text-green-800">
              <User className="h-3 w-3 mr-1" />
              Staff Member
            </Badge>
            <span className="text-sm text-gray-500">Welcome back, {user?.name}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Coffee className="h-4 w-4 mr-2" />
            Break Request
          </Button>
          <Button variant="outline" size="sm" onClick={onLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Shift Status */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-green-600" />
            Shift Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.shiftDuration}</div>
              <div className="text-sm text-gray-600">Time on Shift</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.customersHelped}</div>
              <div className="text-sm text-gray-600">Customers Helped</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.performanceRating}</div>
              <div className="text-sm text-gray-600">Performance Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{formatCurrency(stats.tipsReceived)}</div>
              <div className="text-sm text-gray-600">Tips Received</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.todaySales)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.transactionsCount} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Sale Amount</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.avgSaleAmount)}</div>
            <p className="text-xs text-muted-foreground">
              Per transaction
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.tasksCompleted}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingTasks} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Break Time</CardTitle>
            <Coffee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.breakTime}</div>
            <p className="text-xs text-muted-foreground">
              Next break in 2h
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      task.status === 'completed' ? 'bg-green-500' :
                      task.priority === 'high' ? 'bg-red-500' :
                      task.priority === 'medium' ? 'bg-yellow-500' :
                      'bg-gray-400'
                    }`} />
                    <div>
                      <p className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                        {task.title}
                      </p>
                      <p className="text-sm text-gray-600">Due: {task.dueTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}>
                      {task.priority}
                    </Badge>
                    {task.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-500" />}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Sales */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <DollarSign className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">{sale.product}</p>
                      <p className="text-sm text-gray-600">{sale.customer} • {sale.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(sale.amount)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Staff Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="w-full justify-start" variant="outline" onClick={() => router.push('/staff/new-sale')}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              New Sale
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => router.push('/staff/help-customer')}>
              <Users className="h-4 w-4 mr-2" />
              Help Customer
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => router.push('/staff/check-inventory')}>
              <Package className="h-4 w-4 mr-2" />
              Check Inventory
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => router.push('/staff/customer-chat')}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Customer Chat
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => router.push('/staff/contact-manager')}>
              <Phone className="h-4 w-4 mr-2" />
              Contact Manager
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => router.push('/staff/my-schedule')}>
              <Calendar className="h-4 w-4 mr-2" />
              My Schedule
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => router.push('/staff/my-performance')}>
              <BarChart3 className="h-4 w-4 mr-2" />
              My Performance
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => router.push('/staff/request-break')}>
              <Coffee className="h-4 w-4 mr-2" />
              Request Break
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}