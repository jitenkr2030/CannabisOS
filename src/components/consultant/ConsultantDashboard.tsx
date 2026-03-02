'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Users, 
  DollarSign, 
  FileText, 
  Building, 
  TrendingUp, 
  AlertTriangle, 
  Plus,
  Eye,
  Download,
  Calendar,
  BarChart3
} from 'lucide-react'
import { ClientList } from './ClientList'
import { RevenueTracking } from './RevenueTracking'
import { ConsultantReports } from './ConsultantReports'
import { WhiteLabelSettings } from './WhiteLabelSettings'
import { db } from '@/lib/db'

interface Consultant {
  id: string
  businessName: string
  contactEmail: string
  phone?: string
  website?: string
  commissionRate: number
  monthlyRevenue: number
  totalRevenue: number
  status: string
  whiteLabelEnabled: boolean
  customDomain?: string
  logoUrl?: string
  primaryColor: string
  secondaryColor: string
  createdAt: string
  updatedAt: string
}

interface Client {
  id: string
  businessName: string
  contactName: string
  contactEmail: string
  contactPhone: string
  city: string
  province: string
  status: string
  plan: string
  monthlyFee: number
  startDate: string
  notes?: string
  stores: any[]
  invoices: any[]
  reports: any[]
}

interface ConsultantDashboardProps {
  consultant: Consultant
}

export default function ConsultantDashboard({ consultant }: ConsultantDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [clients, setClients] = useState<Client[]>([])
  const [stats, setStats] = useState({
    totalClients: 0,
    activeClients: 0,
    atRiskClients: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    pendingReports: 0,
    totalStores: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      
      // Load clients with their data
      const clientsData = await db.client.findMany({
        where: { consultantId: consultant.id },
        include: {
          stores: true,
          invoices: true,
          reports: true
        },
        orderBy: { createdAt: 'desc' }
      })

      // Calculate stats
      const activeClients = clientsData.filter(c => c.status === 'ACTIVE').length
      const atRiskClients = clientsData.filter(c => c.status === 'SUSPENDED').length
      const totalStores = clientsData.reduce((acc, client) => acc + client.stores.length, 0)
      const totalRevenue = clientsData.reduce((acc, client) => acc + (client.monthlyFee || 0), 0)
      const pendingReports = clientsData.reduce((acc, client) => acc + client.reports.filter(r => r.status === 'PENDING').length, 0)

      setClients(clientsData)
      setStats({
        totalClients: clientsData.length,
        activeClients,
        atRiskClients,
        totalRevenue,
        monthlyRevenue: totalRevenue,
        pendingReports,
        totalStores
      })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClientAdded = () => {
    loadDashboardData()
  }

  const handleClientUpdated = () => {
    loadDashboardData()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Consultant Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome back, {consultant.businessName}</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant={consultant.status === 'ACTIVE' ? 'default' : 'secondary'}>
              {consultant.status}
            </Badge>
            {consultant.whiteLabelEnabled && (
              <Badge variant="outline" className="border-green-600 text-green-600">
                White-Label Active
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalClients}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeClients} active, {stats.atRiskClients} at risk
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.monthlyRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                From {stats.activeClients} active clients
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Stores</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStores}</div>
              <p className="text-xs text-muted-foreground">
                Across all clients
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingReports}</div>
              <p className="text-xs text-muted-foreground">
                Require attention
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="branding">White-Label</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Clients */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Recent Clients
                    <Button variant="outline" size="sm" onClick={() => setActiveTab('clients')}>
                      View All
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {clients.slice(0, 5).map((client) => (
                      <div key={client.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{client.businessName}</p>
                          <p className="text-xs text-gray-600">{client.city}, {client.province}</p>
                        </div>
                        <Badge variant={client.status === 'ACTIVE' ? 'default' : 'secondary'}>
                          {client.status}
                        </Badge>
                      </div>
                    ))}
                    {clients.length === 0 && (
                      <p className="text-center text-gray-500 py-8">No clients yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      onClick={() => setActiveTab('clients')}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Client
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('revenue')}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <DollarSign className="h-4 w-4 mr-2" />
                      View Revenue
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('reports')}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('branding')}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <Building className="h-4 w-4 mr-2" />
                      Branding Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Revenue Chart */}
            <Card className="mt-6">
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
          </TabsContent>
          
          <TabsContent value="clients" className="mt-6">
            <ClientList 
              clients={clients} 
              onClientAdded={handleClientAdded}
              onClientUpdated={handleClientUpdated}
            />
          </TabsContent>
          
          <TabsContent value="revenue" className="mt-6">
            <RevenueTracking consultant={consultant} clients={clients} />
          </TabsContent>
          
          <TabsContent value="reports" className="mt-6">
            <ConsultantReports consultant={consultant} clients={clients} />
          </TabsContent>
          
          <TabsContent value="branding" className="mt-6">
            <WhiteLabelSettings consultant={consultant} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
