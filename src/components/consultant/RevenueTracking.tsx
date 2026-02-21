'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Download, 
  FileText,
  BarChart3,
  PieChart,
  CreditCard,
  AlertCircle
} from 'lucide-react'

interface Consultant {
  id: string
  businessName: string
  commissionRate: number
  monthlyRevenue: number
  totalRevenue: number
}

interface Client {
  id: string
  businessName: string
  contactName: string
  contactEmail: string
  city: string
  province: string
  status: string
  plan: string
  monthlyFee: number
  yearlyFee: number
  billingCycle: 'monthly' | 'yearly'
  startDate: string
  invoices: any[]
  stores: any[]
}

interface RevenueTrackingProps {
  consultant: Consultant
  clients: Client[]
}

export default function RevenueTracking({ consultant, clients }: RevenueTrackingProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('current')
  const [revenueData, setRevenueData] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    commissionEarned: 0,
    pendingInvoices: 0,
    paidInvoices: 0,
    overdueInvoices: 0,
    clientBreakdown: [] as any[],
    monthlyTrend: [] as any[]
  })

  useEffect(() => {
    calculateRevenueData()
  }, [clients, selectedPeriod])

  const calculateRevenueData = () => {
    const activeClients = clients.filter(c => c.status === 'ACTIVE')
    const totalRevenue = activeClients.reduce((acc, client) => {
      const fee = client.billingCycle === 'yearly' ? client.yearlyFee / 12 : client.monthlyFee
      return acc + fee
    }, 0)
    const commissionEarned = totalRevenue * (consultant.commissionRate / 100)
    
    // Simulate invoice data (in real implementation, this would come from database)
    const totalInvoices = activeClients.length * 2 // Average 2 invoices per client
    const paidInvoices = Math.floor(totalInvoices * 0.7) // 70% paid
    const pendingInvoices = Math.floor(totalInvoices * 0.2) // 20% pending
    const overdueInvoices = totalInvoices - paidInvoices - pendingInvoices // 10% overdue

    // Client breakdown
    const clientBreakdown = activeClients.map(client => {
      const fee = client.billingCycle === 'yearly' ? client.yearlyFee / 12 : client.monthlyFee
      return {
        name: client.businessName,
        revenue: fee,
        commission: fee * (consultant.commissionRate / 100),
        status: client.status,
        plan: client.plan,
        billingCycle: client.billingCycle,
        stores: client.stores.length
      }
    }).sort((a, b) => b.revenue - a.revenue)

    // Monthly trend (last 6 months)
    const monthlyTrend = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthRevenue = totalRevenue * (0.8 + Math.random() * 0.4) // Simulate variation
      monthlyTrend.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        revenue: monthRevenue,
        commission: monthRevenue * (consultant.commissionRate / 100),
        clients: activeClients.length
      })
    }

    setRevenueData({
      totalRevenue,
      monthlyRevenue: totalRevenue,
      commissionEarned,
      pendingInvoices,
      paidInvoices,
      overdueInvoices,
      clientBreakdown,
      monthlyTrend
    })
  }

  const exportReport = (format: 'pdf' | 'excel') => {
    // In real implementation, this would generate and download a report
    console.log(`Exporting revenue report as ${format}`)
    alert(`Revenue report would be exported as ${format.toUpperCase()}`)
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'Basic': return 'bg-blue-100 text-blue-800'
      case 'Growth': return 'bg-purple-100 text-purple-800'
      case 'Consultant': return 'bg-orange-100 text-orange-800'
      case 'Enterprise': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Revenue Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${revenueData.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              From {clients.filter(c => c.status === 'ACTIVE').length} active clients
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission Earned</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${revenueData.commissionEarned.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {consultant.commissionRate}% commission rate
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{revenueData.pendingInvoices}</div>
            <p className="text-xs text-muted-foreground">
              {revenueData.overdueInvoices} overdue
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Invoices</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{revenueData.paidInvoices}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((revenueData.paidInvoices / (revenueData.paidInvoices + revenueData.pendingInvoices + revenueData.overdueInvoices)) * 100)}% paid rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Revenue Analysis</h3>
        <div className="flex items-center space-x-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Current Month</SelectItem>
              <SelectItem value="quarter">Current Quarter</SelectItem>
              <SelectItem value="year">Current Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => exportReport('pdf')}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={() => exportReport('excel')}>
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="clients">Client Breakdown</TabsTrigger>
          <TabsTrigger value="trends">Monthly Trends</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Revenue chart will be displayed here</p>
                    <p className="text-sm text-gray-500 mt-2">Integrate with chart library for visualization</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Commission Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Commission Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Commission breakdown chart</p>
                    <p className="text-sm text-gray-500 mt-2">By client and plan type</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Top Performing Clients */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Top Performing Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {revenueData.clientBreakdown.slice(0, 5).map((client, index) => (
                  <div key={client.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-semibold text-sm">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{client.name}</p>
                        <p className="text-xs text-gray-600">{client.city}, {client.province}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">${client.revenue.toLocaleString()}/mo</p>
                      <p className="text-xs text-gray-600">${client.commission.toLocaleString()} commission</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="clients" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Client Revenue Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Client</th>
                      <th className="text-left p-2">Plan</th>
                      <th className="text-left p-2">Billing</th>
                      <th className="text-left p-2">Stores</th>
                      <th className="text-right p-2">Monthly Fee</th>
                      <th className="text-right p-2">Commission</th>
                      <th className="text-center p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {revenueData.clientBreakdown.map((client) => (
                      <tr key={client.id} className="border-b">
                        <td className="p-2">
                          <div>
                            <p className="font-medium">{client.name}</p>
                            <p className="text-xs text-gray-600">{client.city}, {client.province}</p>
                          </div>
                        </td>
                        <td className="p-2">
                          <Badge className={getPlanColor(client.plan)}>
                            {client.plan}
                          </Badge>
                        </td>
                        <td className="p-2">
                          <Badge variant={client.billingCycle === 'yearly' ? 'default' : 'secondary'}>
                            {client.billingCycle === 'yearly' ? 'Yearly' : 'Monthly'}
                          </Badge>
                        </td>
                        <td className="p-2">{client.stores}</td>
                        <td className="text-right p-2">${client.revenue.toLocaleString()}</td>
                        <td className="text-right p-2 text-green-600">${client.commission.toLocaleString()}</td>
                        <td className="p-2 text-center">
                          <Badge variant={client.status === 'ACTIVE' ? 'default' : 'secondary'}>
                            {client.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trends" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Monthly revenue trend chart</p>
                  <p className="text-sm text-gray-500 mt-2">Showing last 6 months of revenue and commission</p>
                </div>
              </div>
              
              {/* Trend Summary */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-800">Average Monthly Revenue</span>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-green-900 mt-1">
                    ${Math.round(revenueData.monthlyTrend.reduce((acc, month) => acc + month.revenue, 0) / revenueData.monthlyTrend.length).toLocaleString()}
                  </p>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-800">Average Commission</span>
                    <DollarSign className="h-4 w-4 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-blue-900 mt-1">
                    ${Math.round(revenueData.monthlyTrend.reduce((acc, month) => acc + month.commission, 0) / revenueData.monthlyTrend.length).toLocaleString()}
                  </p>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-purple-800">Growth Rate</span>
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-purple-900 mt-1">+12.5%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
