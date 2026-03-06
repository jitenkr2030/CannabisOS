'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  CreditCard, 
  DollarSign, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  Download, 
  Filter, 
  Search, 
  Zap, 
  Shield, 
  TrendingUp, 
  Users, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  Database, 
  Globe, 
  Lock, 
  Unlock,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  BarChart3
} from 'lucide-react'

interface PaymentMethod {
  id: string
  type: 'credit_card' | 'debit_card' | 'bank_transfer' | 'cash' | 'crypto' | 'ach'
  name: string
  description: string
  icon: string
  isActive: boolean
  supportedCurrencies: string[]
  fees: {
    percentage: number
    fixed: number
  }
  limits: {
    minimum: number
    maximum: number
  }
  processingTime: string
  provider: string
  config: Record<string, any>
}

interface Transaction {
  id: string
  orderId: string
  customerId: string
  customerName: string
  amount: number
  currency: string
  paymentMethod: PaymentMethod
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded'
  gatewayTransactionId?: string
  gatewayResponse?: any
  fees: {
    processing: number
    gateway: number
    total: number
  }
  metadata: {
    ipAddress: string
    device: string
    browser: string
    location?: {
      lat: number
      lng: number
      city: string
      country: string
    }
  }
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
  failureReason?: string
  refundId?: string
}

interface PaymentGateway {
  id: string
  name: string
  type: 'payment_processor' | 'bank' | 'crypto'
  isActive: boolean
  supportedMethods: string[]
  config: {
    apiKey: string
    secretKey: string
    webhookUrl: string
    environment: 'sandbox' | 'production'
  }
  features: {
    realTimeVerification: boolean
    fraudDetection: boolean
    recurringPayments: boolean
    multiCurrency: boolean
    chargebacks: boolean
  }
  statistics: {
    totalTransactions: number
    successRate: number
    averageProcessingTime: number
    totalVolume: number
  }
}

export default function PaymentProcessing() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [gateways, setGateways] = useState<PaymentGateway[]>([])
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterMethod, setFilterMethod] = useState<string>('all')
  const [activeTab, setActiveTab] = useState('overview')
  const [showAddMethodModal, setShowAddMethodModal] = useState(false)

  // Mock data
  useEffect(() => {
    const mockPaymentMethods: PaymentMethod[] = [
      {
        id: 'visa_credit',
        type: 'credit_card',
        name: 'Visa Credit',
        description: 'Visa credit card payments',
        icon: 'credit-card',
        isActive: true,
        supportedCurrencies: ['USD', 'EUR', 'GBP'],
        fees: { percentage: 2.9, fixed: 0.30 },
        limits: { minimum: 1, maximum: 10000 },
        processingTime: '2-3 seconds',
        provider: 'stripe',
        config: {
          stripeAccountId: 'acct_123456789',
          requireCVC: true,
          threeDSecure: true
        }
      },
      {
        id: 'mastercard_debit',
        type: 'debit_card',
        name: 'Mastercard Debit',
        description: 'Mastercard debit card payments',
        icon: 'credit-card',
        isActive: true,
        supportedCurrencies: ['USD', 'EUR', 'GBP'],
        fees: { percentage: 1.5, fixed: 0.25 },
        limits: { minimum: 1, maximum: 5000 },
        processingTime: '1-2 seconds',
        provider: 'stripe',
        config: {
          stripeAccountId: 'acct_123456789',
          requireCVC: true,
          threeDSecure: false
        }
      },
      {
        id: 'bank_transfer',
        type: 'bank_transfer',
        name: 'Bank Transfer',
        description: 'Direct bank transfer (ACH)',
        icon: 'building',
        isActive: true,
        supportedCurrencies: ['USD'],
        fees: { percentage: 0.5, fixed: 2.00 },
        limits: { minimum: 10, maximum: 50000 },
        processingTime: '1-3 business days',
        provider: 'plaid',
        config: {
          plaidAccountId: 'acc_123456789',
          routingNumber: '123456789'
        }
      },
      {
        id: 'cash_payment',
        type: 'cash',
        name: 'Cash Payment',
        description: 'Cash payments at physical locations',
        icon: 'dollar-sign',
        isActive: true,
        supportedCurrencies: ['USD'],
        fees: { percentage: 0, fixed: 0 },
        limits: { minimum: 1, maximum: 100000 },
        processingTime: 'Instant',
        provider: 'internal',
        config: {
          requiresVerification: true,
          receiptRequired: true
        }
      },
      {
        id: 'crypto_payment',
        type: 'crypto',
        name: 'Cryptocurrency',
        description: 'Bitcoin and Ethereum payments',
        icon: 'trending-up',
        isActive: false,
        supportedCurrencies: ['BTC', 'ETH', 'USDT'],
        fees: { percentage: 1.0, fixed: 0.50 },
        limits: { minimum: 10, maximum: 25000 },
        processingTime: '10-15 minutes',
        provider: 'coinbase',
        config: {
          walletAddress: '0x1234567890abcdef',
          network: 'ethereum'
        }
      }
    ]

    const mockTransactions: Transaction[] = [
      {
        id: 'txn_1234567890',
        orderId: 'order_123',
        customerId: 'cust_456',
        customerName: 'John Doe',
        amount: 156.78,
        currency: 'USD',
        paymentMethod: mockPaymentMethods[0],
        status: 'completed',
        gatewayTransactionId: 'ch_1234567890abcdef',
        gatewayResponse: { status: 'succeeded', id: 'ch_1234567890abcdef' },
        fees: { processing: 0, gateway: 4.55, total: 4.55 },
        metadata: {
          ipAddress: '192.168.1.1',
          device: 'iPhone 14',
          browser: 'Safari',
          location: { lat: 40.7128, lng: -74.0060, city: 'New York', country: 'US' }
        },
        createdAt: new Date('2024-01-16T10:30:00Z'),
        updatedAt: new Date('2024-01-16T10:30:05Z'),
        completedAt: new Date('2024-01-16T10:30:05Z')
      },
      {
        id: 'txn_1234567891',
        orderId: 'order_124',
        customerId: 'cust_457',
        customerName: 'Jane Smith',
        amount: 89.50,
        currency: 'USD',
        paymentMethod: mockPaymentMethods[1],
        status: 'processing',
        gatewayTransactionId: 'ch_1234567891abcdef',
        fees: { processing: 0, gateway: 1.34, total: 1.34 },
        metadata: {
          ipAddress: '192.168.1.2',
          device: 'Samsung Galaxy S23',
          browser: 'Chrome',
          location: { lat: 40.7589, lng: -73.9851, city: 'Brooklyn', country: 'US' }
        },
        createdAt: new Date('2024-01-16T11:45:00Z'),
        updatedAt: new Date('2024-01-16T11:45:02Z')
      },
      {
        id: 'txn_1234567892',
        orderId: 'order_125',
        customerId: 'cust_458',
        customerName: 'Bob Johnson',
        amount: 234.00,
        currency: 'USD',
        paymentMethod: mockPaymentMethods[2],
        status: 'failed',
        gatewayTransactionId: 'bt_1234567892abcdef',
        failureReason: 'Insufficient funds',
        fees: { processing: 0, gateway: 1.17, total: 1.17 },
        metadata: {
          ipAddress: '192.168.1.3',
          device: 'Desktop',
          browser: 'Firefox',
          location: { lat: 40.7489, lng: -73.9680, city: 'Manhattan', country: 'US' }
        },
        createdAt: new Date('2024-01-16T13:20:00Z'),
        updatedAt: new Date('2024-01-16T13:25:00Z')
      },
      {
        id: 'txn_1234567893',
        orderId: 'order_126',
        customerId: 'cust_459',
        customerName: 'Alice Brown',
        amount: 445.00,
        currency: 'USD',
        paymentMethod: mockPaymentMethods[3],
        status: 'completed',
        fees: { processing: 0, gateway: 0, total: 0 },
        metadata: {
          ipAddress: '192.168.1.4',
          device: 'iPad Pro',
          browser: 'Safari',
          location: { lat: 40.7831, lng: -73.9712, city: 'Queens', country: 'US' }
        },
        createdAt: new Date('2024-01-16T14:10:00Z'),
        updatedAt: new Date('2024-01-16T14:10:00Z'),
        completedAt: new Date('2024-01-16T14:10:00Z')
      }
    ]

    const mockGateways: PaymentGateway[] = [
      {
        id: 'stripe',
        name: 'Stripe',
        type: 'payment_processor',
        isActive: true,
        supportedMethods: ['visa_credit', 'mastercard_debit'],
        config: {
          apiKey: 'sk_test_1234567890abcdef',
          secretKey: 'sk_live_1234567890abcdef',
          webhookUrl: 'https://api.cannabisos.com/webhooks/stripe',
          environment: 'production'
        },
        features: {
          realTimeVerification: true,
          fraudDetection: true,
          recurringPayments: true,
          multiCurrency: true,
          chargebacks: true
        },
        statistics: {
          totalTransactions: 1250,
          successRate: 98.5,
          averageProcessingTime: 2.3,
          totalVolume: 125000.50
        }
      },
      {
        id: 'plaid',
        name: 'Plaid',
        type: 'bank',
        isActive: true,
        supportedMethods: ['bank_transfer'],
        config: {
          apiKey: 'plaid_test_1234567890abcdef',
          secretKey: 'plaid_live_1234567890abcdef',
          webhookUrl: 'https://api.cannabisos.com/webhooks/plaid',
          environment: 'production'
        },
        features: {
          realTimeVerification: false,
          fraudDetection: true,
          recurringPayments: true,
          multiCurrency: false,
          chargebacks: false
        },
        statistics: {
          totalTransactions: 450,
          successRate: 99.2,
          averageProcessingTime: 86400, // 1 day in seconds
          totalVolume: 45000.00
        }
      },
      {
        id: 'coinbase',
        name: 'Coinbase',
        type: 'crypto',
        isActive: false,
        supportedMethods: ['crypto_payment'],
        config: {
          apiKey: 'coinbase_test_1234567890abcdef',
          secretKey: 'coinbase_live_1234567890abcdef',
          webhookUrl: 'https://api.cannabisos.com/webhooks/coinbase',
          environment: 'sandbox'
        },
        features: {
          realTimeVerification: true,
          fraudDetection: true,
          recurringPayments: false,
          multiCurrency: true,
          chargebacks: false
        },
        statistics: {
          totalTransactions: 0,
          successRate: 0,
          averageProcessingTime: 600, // 10 minutes
          totalVolume: 0
        }
      }
    ]

    setPaymentMethods(mockPaymentMethods)
    setTransactions(mockTransactions)
    setGateways(mockGateways)
  }, [])

  // Process payment
  const processPayment = async (orderId: string, paymentMethodId: string, amount: number): Promise<Transaction> => {
    const paymentMethod = paymentMethods.find(pm => pm.id === paymentMethodId)
    if (!paymentMethod) throw new Error('Payment method not found')

    const transaction: Transaction = {
      id: `txn_${Date.now().getTime()}_${Math.random().toString(36).substr(2, 9)}`,
      orderId,
      customerId: 'cust_demo',
      customerName: 'Demo Customer',
      amount,
      currency: 'USD',
      paymentMethod,
      status: 'processing',
      fees: {
        processing: 0,
        gateway: amount * (paymentMethod.fees.percentage / 100) + paymentMethod.fees.fixed,
        total: amount * (paymentMethod.fees.percentage / 100) + paymentMethod.fees.fixed
      },
      metadata: {
        ipAddress: '192.168.1.100',
        device: 'Web Browser',
        browser: 'Chrome',
        location: { lat: 40.7128, lng: -74.0060, city: 'New York', country: 'US' }
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Add to transactions
    setTransactions(prev => [...prev, transaction])

    // Simulate payment processing
    setTimeout(() => {
      setTransactions(prev => prev.map(t => 
        t.id === transaction.id 
          ? { 
              ...t, 
              status: Math.random() > 0.1 ? 'completed' : 'failed',
              updatedAt: new Date(),
              completedAt: Math.random() > 0.1 ? new Date() : undefined,
              failureReason: Math.random() > 0.1 ? undefined : 'Payment declined',
              gatewayTransactionId: `${paymentMethod.provider}_${t.id}`
            }
          : t
      ))
    }, 3000 + Math.random() * 2000) // 3-5 seconds

    return transaction
  }

  // Refund payment
  const refundPayment = async (transactionId: string, reason: string): Promise<Transaction> => {
    const transaction = transactions.find(t => t.id === transactionId)
    if (!transaction || transaction.status !== 'completed') {
      throw new Error('Transaction not found or not completed')
    }

    const refundTransaction: Transaction = {
      ...transaction,
      id: `refund_${Date.now().getTime()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'refunded',
      refundId: transaction.id,
      failureReason: reason,
      updatedAt: new Date(),
      completedAt: new Date()
    }

    setTransactions(prev => [...prev, refundTransaction])
    return refundTransaction
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'cancelled': return 'bg-gray-100 text-gray-800'
      case 'refunded': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Get payment method icon
  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case 'credit_card':
      case 'debit_card': return <CreditCard className="h-5 w-5" />
      case 'bank_transfer': return <Database className="h-5 w-5" />
      case 'cash': return <DollarSign className="h-5 w-5" />
      case 'crypto': return <TrendingUp className="h-5 w-5" />
      case 'ach': return <Activity className="h-5 w-5" />
      default: return <CreditCard className="h-5 w-5" />
    }
  }

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus
    const matchesMethod = filterMethod === 'all' || transaction.paymentMethod.id === filterMethod
    
    return matchesSearch && matchesStatus && matchesMethod
  })

  // Calculate statistics
  const statistics = {
    totalTransactions: transactions.length,
    completedTransactions: transactions.filter(t => t.status === 'completed').length,
    failedTransactions: transactions.filter(t => t.status === 'failed').length,
    totalVolume: transactions.reduce((acc, t) => acc + t.amount, 0),
    totalFees: transactions.reduce((acc, t) => acc + t.fees.total, 0),
    averageOrderValue: transactions.length > 0 ? transactions.reduce((acc, t) => acc + t.amount, 0) / transactions.length : 0,
    successRate: transactions.length > 0 ? (transactions.filter(t => t.status === 'completed').length / transactions.length) * 100 : 0
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Processing</h1>
          <p className="text-gray-600">Real-time payment processing and transaction management</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setShowAddMethodModal(true)}>
            <CreditCard className="h-4 w-4 mr-2" />
            Add Payment Method
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.totalTransactions}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.successRate.toFixed(1)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Volume</p>
                <p className="text-2xl font-bold text-gray-900">${statistics.totalVolume.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Fees</p>
                <p className="text-2xl font-bold text-gray-900">${statistics.totalFees.toFixed(2)}</p>
              </div>
              <Activity className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="methods">Methods</TabsTrigger>
          <TabsTrigger value="gateways">Gateways</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${getStatusColor(transaction.status)}`}>
                          {getPaymentMethodIcon(transaction.paymentMethod.type)}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.customerName}</p>
                          <p className="text-sm text-gray-500">{transaction.orderId}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${transaction.amount.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">{transaction.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentMethods.filter(pm => pm.isActive).map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg bg-gray-100`}>
                          {getPaymentMethodIcon(method.type)}
                        </div>
                        <div>
                          <p className="font-medium">{method.name}</p>
                          <p className="text-sm text-gray-500">{method.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{(method.fees.percentage + method.fees.fixed / method.amount * 100).toFixed(2)}%</p>
                        <p className="text-sm text-gray-500">{method.processingTime}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterMethod} onValueChange={setFilterMethod}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method.id} value={method.id}>
                      {method.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTransactions.map((transaction) => (
              <Card key={transaction.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getStatusColor(transaction.status)}`}>
                        {getPaymentMethodIcon(transaction.paymentMethod.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{transaction.customerName}</h3>
                        <p className="text-sm text-gray-500">{transaction.orderId}</p>
                        <p className="text-sm text-gray-500">{transaction.id}</p>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Badge className={getStatusColor(transaction.status)}>
                        {transaction.status.toUpperCase()}
                      </Badge>
                      <p className="text-sm text-gray-500">
                        {transaction.paymentMethod.name}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium">${transaction.amount.toFixed(2)} {transaction.currency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fees:</span>
                      <span className="font-medium">{transaction.fees.total.toFixed(2)} {transaction.currency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Net Amount:</span>
                      <span className="font-medium">
                        {(transaction.amount - transaction.fees.total).toFixed(2)} {transaction.currency}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gateway:</span>
                      <span className="font-medium">{transaction.paymentMethod.provider}</span>
                    </div>
                  </div>

                  {transaction.failureReason && (
                    <div className="mt-4 p-3 bg-red-50 rounded-lg">
                      <p className="text-sm text-red-800">
                        <strong>Failure Reason:</strong> {transaction.failureReason}
                      </p>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        Created: {transaction.createdAt.toLocaleString()}
                      </div>
                      <div className="flex space-x-2">
                        {transaction.status === 'processing' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {/* Cancel payment */}}
                          >
                            Cancel
                          </Button>
                        )}
                        {transaction.status === 'completed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => refundPayment(transaction.id, 'Customer request')}
                          >
                            Refund
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedTransaction(transaction)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="methods" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paymentMethods.map((method) => (
              <Card key={method.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-lg ${method.isActive ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                        {getPaymentMethodIcon(method.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{method.name}</h3>
                        <p className="text-sm text-gray-500">{method.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={method.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {method.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {/* Toggle method */}}
                      >
                        {method.isActive ? 'Disable' : 'Enable'}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium capitalize">{method.type.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Provider:</span>
                      <span className="font-medium">{method.provider}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Processing Time:</span>
                      <span className="font-medium">{method.processingTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fees:</span>
                      <span className="font-medium">
                        {method.fees.percentage}% + ${method.fees.fixed.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Limits:</span>
                      <span className="font-medium">
                        {method.limits.minimum} - {method.limits.maximum}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Currencies:</span>
                      <span className="font-medium">{method.supportedCurrencies.join(', ')}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {/* Test method */}}
                      >
                        Test Payment
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {/* View config */}}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="gateways" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {gateways.map((gateway) => (
              <Card key={gateway.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-lg ${gateway.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        <Globe className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{gateway.name}</h3>
                        <p className="text-sm text-gray-500 capitalize">{gateway.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={gateway.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {gateway.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {/* Toggle gateway */}}
                      >
                        {gateway.isActive ? 'Disable' : 'Enable'}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Environment</p>
                        <p className="font-medium capitalize">{gateway.config.environment}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Total Transactions</p>
                        <p className="font-medium">{gateway.statistics.totalTransactions}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Success Rate</p>
                        <p className="font-medium">{gateway.statistics.successRate.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Total Volume</p>
                        <p className="font-medium">${gateway.statistics.totalVolume.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Shield className="h-4 w-4 text-gray-600" />
                          <span className="text-sm font-medium">Features</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className={`h-3 w-3 ${gateway.features.realTimeVerification ? 'text-green-600' : 'text-gray-400'}`} />
                            <span>Real-time Verification</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <AlertTriangle className={`h-3 w-3 ${gateway.features.fraudDetection ? 'text-green-600' : 'text-gray-400'}`} />
                            <span>Fraud Detection</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RefreshCw className={`h-3 w-3 ${gateway.features.recurringPayments ? 'text-green-600' : 'text-gray-400'}`} />
                            <span>Recurring Payments</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Globe className={`h-3 w-3 ${gateway.features.multiCurrency ? 'text-green-600' : 'text-gray-400'}`} />
                            <span>Multi-Currency</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <ArrowDownRight className={`h-3 w-3 ${gateway.features.chargebacks ? 'text-green-600' : 'text-gray-400'}`} />
                            <span>Chargebacks</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Daily Volume</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${(statistics.totalVolume * 0.3).toFixed(2)}
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Average Order Value</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${statistics.averageOrderValue.toFixed(2)}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Failed Rate</p>
                    <p className="text-2xl font-bold text-gray-900">
                    {(100 - statistics.successRate).toFixed(1)}%
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Fee Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${statistics.totalFees.toFixed(2)}
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
