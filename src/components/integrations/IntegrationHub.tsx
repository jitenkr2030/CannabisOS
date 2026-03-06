'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Globe, 
  Zap, 
  Database, 
  Plug, 
  Settings, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  RefreshCw, 
  Eye, 
  Plus, 
  Search, 
  Filter, 
  Activity, 
  Shield, 
  BarChart3,
  CreditCard,
  Truck,
  Package,
  Mail,
  Calculator,
  MessageCircle,
  Cloud
} from 'lucide-react'

interface Integration {
  id: string
  name: string
  type: string
  status: string
  provider: string
  description: string
  icon: string
  documentation: string
  statistics: {
    totalRequests: number
    successRate: number
    averageResponseTime: number
    lastSync: Date
    errors: number
  }
}

export default function IntegrationHub() {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const mockIntegrations: Integration[] = [
      {
        id: 'stripe_payments',
        name: 'Stripe Payments',
        type: 'payment',
        status: 'active',
        provider: 'Stripe',
        description: 'Complete payment processing with Stripe',
        icon: 'credit-card',
        documentation: 'https://stripe.com/docs',
        statistics: {
          totalRequests: 1250,
          successRate: 98.5,
          averageResponseTime: 234,
          lastSync: new Date('2024-01-16'),
          errors: 3
        }
      },
      {
        id: 'shipstation_shipping',
        name: 'ShipStation',
        type: 'shipping',
        status: 'active',
        provider: 'ShipStation',
        description: 'Shipping and fulfillment automation',
        icon: 'truck',
        documentation: 'https://www.shipstation.com/docs',
        statistics: {
          totalRequests: 456,
          successRate: 99.2,
          averageResponseTime: 456,
          lastSync: new Date('2024-01-16'),
          errors: 1
        }
      }
    ]

    setIntegrations(mockIntegrations)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getIntegrationIcon = (type: string) => {
    switch (type) {
      case 'payment': return <CreditCard className="h-5 w-5" />
      case 'shipping': return <Truck className="h-5 w-5" />
      case 'inventory': return <Package className="h-5 w-5" />
      case 'analytics': return <BarChart3 className="h-5 w-5" />
      case 'accounting': return <Calculator className="h-5 w-5" />
      case 'communication': return <Mail className="h-5 w-5" />
      case 'storage': return <Cloud className="h-5 w-5" />
      default: return <Plug className="h-5 w-5" />
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Integration Hub</h1>
          <p className="text-gray-600">Connect and automate your business with powerful integrations</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Integration
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Integrations</p>
                <p className="text-2xl font-bold text-gray-900">{integrations.filter(i => i.status === 'active').length}</p>
              </div>
              <Plug className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Integrations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {integrations.slice(0, 5).map((integration) => (
                  <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getStatusColor(integration.status)}`}>
                        {getIntegrationIcon(integration.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                        <p className="text-sm text-gray-500">{integration.provider}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(integration.status)}>
                        {integration.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardContent className="p-12 text-center">
              <Zap className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Integration Hub</h3>
              <p className="text-gray-600">Manage your business integrations</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardContent className="p-12 text-center">
              <Zap className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Integration Templates</h3>
              <p className="text-gray-600">Pre-built integration templates coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <Card>
            <CardContent className="p-12 text-center">
              <CheckCircle className="h-12 w-12 text-green-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">System Monitoring</h3>
              <p className="text-gray-600">Monitor your integration health</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
