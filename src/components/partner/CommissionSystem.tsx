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
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Download, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  CreditCard,
  FileText,
  Filter,
  Search,
  Eye,
  RefreshCw,
  Calculator,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { db } from '@/lib/db'

interface Partner {
  id: string
  companyName: string
  contactName: string
  email: string
  commissionRate: number
  monthlyRevenue: number
  totalCommission: number
}

interface Commission {
  id: string
  partnerId: string
  clientId?: string
  referralId?: string
  amount: number
  commissionRate: number
  commissionAmount: number
  month: string
  status: string
  paidDate?: string
  invoiceId?: string
  paymentMethod?: string
  transactionId?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

interface CommissionSystemProps {
  partner: Partner
  commissions: Commission[]
  onCommissionUpdated: () => void
}

export default function CommissionSystem({ partner, commissions, onCommissionUpdated }: CommissionSystemProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('current')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [commissionData, setCommissionData] = useState({
    totalCommission: 0,
    pendingCommission: 0,
    paidCommission: 0,
    monthlyCommission: 0,
    averageCommission: 0,
    commissionGrowth: 0,
    topMonth: '',
    paymentMethods: {} as Record<string, number>
  })

  useEffect(() => {
    calculateCommissionData()
  }, [commissions, selectedPeriod])

  const calculateCommissionData = () => {
    const totalCommission = commissions.reduce((sum, c) => sum + c.commissionAmount, 0)
    const pendingCommission = commissions.filter(c => c.status === 'PENDING').reduce((sum, c) => sum + c.commissionAmount, 0)
    const paidCommission = commissions.filter(c => c.status === 'PAID').reduce((sum, c) => sum + c.commissionAmount, 0)
    const monthlyCommission = commissions.filter(c => c.month === new Date().toISOString().slice(0, 7)).reduce((sum, c) => sum + c.commissionAmount, 0)
    const averageCommission = commissions.length > 0 ? totalCommission / commissions.length : 0

    // Calculate growth (comparing current month to previous month)
    const currentMonth = new Date().toISOString().slice(0, 7)
    const previousMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().slice(0, 7)
    const currentMonthCommission = commissions.filter(c => c.month === currentMonth).reduce((sum, c) => sum + c.commissionAmount, 0)
    const previousMonthCommission = commissions.filter(c => c.month === previousMonth).reduce((sum, c) => sum + c.commissionAmount, 0)
    const growth = previousMonthCommission > 0 ? ((currentMonthCommission - previousMonthCommission) / previousMonthCommission) * 100 : 0

    // Find top month
    const monthlyTotals = commissions.reduce((acc, c) => {
      acc[c.month] = (acc[c.month] || 0) + c.commissionAmount
      return acc
    }, {} as Record<string, number>)
    const topMonth = Object.entries(monthlyTotals).sort((a, b) => b[1] - a[1])[0]?.[0] || ''

    // Payment methods
    const paymentMethods = commissions.reduce((acc, c) => {
      if (c.paymentMethod) {
        acc[c.paymentMethod] = (acc[c.paymentMethod] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    setCommissionData({
      totalCommission,
      pendingCommission,
      paidCommission,
      monthlyCommission,
      averageCommission,
      commissionGrowth: growth,
      topMonth,
      paymentMethods
    })
  }

  const handleProcessPayment = async (commissionId: string, paymentMethod: string) => {
    try {
      setIsProcessingPayment(true)
      
      // Update commission status to PAID
      await db.commission.update({
        where: { id: commissionId },
        data: {
          status: 'PAID',
          paidDate: new Date().toISOString(),
          paymentMethod,
          transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        }
      })

      onCommissionUpdated()
    } catch (error) {
      console.error('Error processing payment:', error)
    } finally {
      setIsProcessingPayment(false)
    }
  }

  const handleApproveCommission = async (commissionId: string) => {
    try {
      await db.commission.update({
        where: { id: commissionId },
        data: { status: 'APPROVED' }
      })
      onCommissionUpdated()
    } catch (error) {
      console.error('Error approving commission:', error)
    }
  }

  const handleExportReport = (format: 'pdf' | 'excel') => {
    // In real implementation, this would generate and download a report
    console.log(`Exporting commission report as ${format}`)
    alert(`Commission report would be exported as ${format.toUpperCase()}`)
  }

  const filteredCommissions = commissions.filter(commission => {
    const matchesSearch = commission.invoiceId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         commission.transactionId?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || commission.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'bg-green-100 text-green-800'
      case 'APPROVED': return 'bg-blue-100 text-blue-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'FAILED': return 'bg-red-100 text-red-800'
      case 'CANCELLED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID': return <CheckCircle className="h-4 w-4" />
      case 'APPROVED': return <CheckCircle className="h-4 w-4" />
      case 'PENDING': return <Clock className="h-4 w-4" />
      case 'FAILED': return <AlertTriangle className="h-4 w-4" />
      case 'CANCELLED': return <AlertTriangle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'BANK_TRANSFER': return 'bg-blue-100 text-blue-800'
      case 'PAYPAL': return 'bg-purple-100 text-purple-800'
      case 'STRIPE': return 'bg-indigo-100 text-indigo-800'
      case 'CASH': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Commission System</h2>
          <p className="text-gray-600">Track and manage your commission payments</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => handleExportReport('pdf')}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={() => handleExportReport('excel')}>
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Commission Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commission</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${commissionData.totalCommission.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              ${commissionData.pendingCommission.toLocaleString()} pending
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Commission</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${commissionData.paidCommission.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {commissions.filter(c => c.status === 'PAID').length} payments
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Commission</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${commissionData.monthlyCommission.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {commissionData.commissionGrowth > 0 ? '+' : ''}{commissionData.commissionGrowth.toFixed(1)}% growth
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Commission</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${commissionData.averageCommission.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Per commission
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search commissions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="PAID">Paid</SelectItem>
            <SelectItem value="FAILED">Failed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Commission Details */}
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list">Commission List</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="payments">Payment Methods</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Commission Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Month</th>
                      <th className="text-left p-2">Amount</th>
                      <th className="text-left p-2">Rate</th>
                      <th className="text-left p-2">Commission</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Paid Date</th>
                      <th className="text-left p-2">Method</th>
                      <th className="text-center p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCommissions.map((commission) => (
                      <tr key={commission.id} className="border-b">
                        <td className="p-2">{commission.month}</td>
                        <td className="p-2">${commission.amount.toLocaleString()}</td>
                        <td className="p-2">{commission.commissionRate}%</td>
                        <td className="p-2 text-green-600 font-medium">
                          ${commission.commissionAmount.toLocaleString()}
                        </td>
                        <td className="p-2">
                          <Badge className={getStatusColor(commission.status)}>
                            {commission.status}
                          </Badge>
                        </td>
                        <td className="p-2">
                          {commission.paidDate ? new Date(commission.paidDate).toLocaleDateString() : '-'}
                        </td>
                        <td className="p-2">
                          {commission.paymentMethod ? (
                            <Badge className={getPaymentMethodColor(commission.paymentMethod)}>
                              {commission.paymentMethod.replace('_', ' ')}
                            </Badge>
                          ) : '-'}
                        </td>
                        <td className="p-2 text-center">
                          <div className="flex justify-center space-x-1">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {commission.status === 'PENDING' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleApproveCommission(commission.id)}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            {commission.status === 'APPROVED' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleProcessPayment(commission.id, 'BANK_TRANSFER')}
                                disabled={isProcessingPayment}
                              >
                                <CreditCard className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Commission Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Commission trend chart will be displayed here</p>
                    <p className="text-sm text-gray-500 mt-2">Monthly commission trends and growth</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {commissionData.topMonth || 'N/A'}
                  </div>
                  <p className="text-sm text-gray-600">
                    Highest commission month
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="payments" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(commissionData.paymentMethods).map(([method, count]) => (
                  <div key={method} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge className={getPaymentMethodColor(method)}>
                        {method.replace('_', ' ')}
                      </Badge>
                      <span className="text-sm text-gray-600">{count} transactions</span>
                    </div>
                    <div className="text-sm font-medium">
                      {((count / Object.values(commissionData.paymentMethods).reduce((sum, c) => sum + c, 0)) * 100).toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
