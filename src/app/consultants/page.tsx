'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Users, 
  Building, 
  ChartBar, 
  Shield, 
  Settings, 
  Plus, 
  Search, 
  Filter,
  Download,
  Eye,
  Edit,
  Trash,
  ExternalLink,
  Globe,
  Crown,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Star,
  Award,
  Target,
  Briefcase,
  Zap,
  BarChart3,
  PieChart,
  FileText,
  Database,
  Lock,
  Unlock,
  UserCheck,
  Building2,
  Handshake,
  Gift,
  Rocket,
  CrownIcon,
  Save
} from 'lucide-react'

export default function ConsultantDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClient, setSelectedClient] = useState<string | null>(null)

  // Mock data for demonstration
  const stats = {
    totalClients: 12,
    atRisk: 2,
    reportsDue: 5,
    monthlyRevenue: 1980,
    totalRevenue: 23760,
    activeSubscriptions: 10,
    pendingOnboarding: 2,
    complianceRate: 98.5
  }

  const clients = [
    {
      id: '1',
      name: 'Green Leaf Dispensary',
      status: 'active',
      subscription: 'Growth',
      revenue: 450,
      complianceScore: 95,
      lastReport: '2 days ago',
      contact: 'john@greenleaf.com',
      phone: '+1-555-0123',
      address: '123 Main St, Portland, OR',
      logo: '/logos/greenleaf.png',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Sunset Valley Cannabis',
      status: 'at-risk',
      subscription: 'Basic',
      revenue: 250,
      complianceScore: 78,
      lastReport: '5 days ago',
      contact: 'sarah@sunsetvalley.com',
      phone: '+1-555-0124',
      address: '456 Oak Ave, Seattle, WA',
      logo: '/logos/sunsetvalley.png',
      createdAt: '2024-02-01'
    },
    {
      id: '3',
      name: 'Mountain High Dispensary',
      status: 'active',
      subscription: 'Professional',
      revenue: 680,
      complianceScore: 92,
      lastReport: '1 day ago',
      contact: 'mike@mountainhigh.com',
      phone: '+1-555-0125',
      address: '789 Pine St, Denver, CO',
      logo: '/logos/mountainhigh.png',
      createdAt: '2024-01-20'
    }
  ]

  const whiteLabelSettings = {
    branding: {
      logo: '/logos/consultant-logo.png',
      primaryColor: '#10b981',
      secondaryColor: '#059669',
      companyName: 'CannabisOS Consulting',
      domain: 'consultant.cannabisos.com',
      email: 'info@cannabisos-consulting.com',
      phone: '+1-555-CONSULT',
      address: '123 Consultant Ave, Portland, OR'
    },
    features: {
      whiteLabel: true,
      customDomain: true,
      customBranding: true,
      customEmail: true,
      customReports: true,
      apiAccess: true,
      prioritySupport: true,
      dedicatedAccountManager: true,
      customTraining: true
    }
  }

  const revenueData = [
    { month: 'Jan', revenue: 1650, clients: 10 },
    { month: 'Feb', revenue: 1890, clients: 11 },
    { month: 'Mar', revenue: 2100, clients: 12 },
    { month: 'Apr', revenue: 1950, clients: 12 },
    { month: 'May', revenue: 2200, clients: 13 },
    { month: 'Jun', revenue: 1980, clients: 12 }
  ]

  const complianceData = [
    { name: 'Green Leaf', score: 95, issues: 0, lastAudit: '2024-06-15' },
    { name: 'Sunset Valley', score: 78, issues: 3, lastAudit: '2024-06-10' },
    { name: 'Mountain High', score: 92, issues: 1, lastAudit: '2024-06-12' }
  ]

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.status.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <CrownIcon className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Consultant Portal</h1>
                <p className="text-sm text-gray-500">White-label dispensery management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Public Site
              </Button>
              <Button size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Clients</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalClients}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-green-600">${stats.monthlyRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">At Risk</p>
                  <p className="text-2xl font-bold text-red-600">{stats.atRisk}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Compliance Rate</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.complianceRate}%</p>
                </div>
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="white-label">White-Label</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Revenue Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-end justify-between">
                    {revenueData.map((data, index) => (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div 
                          className="w-full bg-blue-600 rounded-t"
                          style={{ height: `${(data.revenue / 2200) * 100}%` }}
                        ></div>
                        <p className="text-xs text-gray-500 mt-1">{data.month}</p>
                        <p className="text-sm font-semibold">${data.revenue}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Client Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Client Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {clients.map((client) => (
                      <div key={client.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            {client.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{client.name}</p>
                            <p className="text-sm text-gray-500">{client.subscription}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant={client.status === 'active' ? 'default' : 'destructive'}
                          >
                            {client.status}
                          </Badge>
                          <p className="text-sm text-gray-500">{client.complianceScore}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Client Management</h2>
                <p className="text-gray-600">Manage your dispensery clients</p>
              </div>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search clients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Client
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClients.map((client) => (
                <Card key={client.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          {client.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{client.name}</h3>
                          <p className="text-sm text-gray-500">{client.subscription}</p>
                        </div>
                      </div>
                      <Badge 
                        variant={client.status === 'active' ? 'default' : 'destructive'}
                      >
                        {client.status}
                      </Badge>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Revenue</span>
                        <span className="font-medium">${client.revenue}/mo</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Compliance</span>
                        <span className="font-medium">{client.complianceScore}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Last Report</span>
                        <span className="font-medium">{client.lastReport}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        <BarChart3 className="h-4 w-4 mr-1" />
                        Analytics
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* White-Label Tab */}
          <TabsContent value="white-label" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Branding Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="h-5 w-5 mr-2" />
                    Branding Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Company Name</Label>
                    <Input defaultValue={whiteLabelSettings.branding.companyName} />
                  </div>
                  <div className="space-y-2">
                    <Label>Primary Color</Label>
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-8 h-8 rounded border-2 border-gray-300"
                        style={{ backgroundColor: whiteLabelSettings.branding.primaryColor }}
                      ></div>
                      <Input 
                        type="color" 
                        defaultValue={whiteLabelSettings.branding.primaryColor}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Domain</Label>
                    <Input defaultValue={whiteLabelSettings.branding.domain} />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input defaultValue={whiteLabelSettings.branding.email} />
                  </div>
                  <Button className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Save Branding
                  </Button>
                </CardContent>
              </Card>

              {/* Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="h-5 w-5 mr-2" />
                    White-Label Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {Object.entries(whiteLabelSettings.features).map(([key, enabled]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <Badge variant={enabled ? 'default' : 'secondary'}>
                          {enabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure Features
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Revenue Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Revenue Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Revenue</span>
                      <span className="font-semibold">${stats.totalRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average per Client</span>
                      <span className="font-semibold">${(stats.totalRevenue / stats.totalClients).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Growth Rate</span>
                      <span className="font-semibold text-green-600">+12.5%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Client Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Client Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Active Clients</span>
                      <span className="font-semibold">{stats.activeSubscriptions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pending Onboarding</span>
                      <span className="font-semibold">{stats.pendingOnboarding}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Churn Rate</span>
                      <span className="font-semibold text-green-600">3.2%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Avg Response Time</span>
                      <span className="font-semibold">1.2s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Uptime</span>
                      <span className="font-semibold text-green-600">99.9%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">API Calls</span>
                      <span className="font-semibold">1.2M/day</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Compliance Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Compliance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Overall Compliance</span>
                      <span className="font-semibold text-green-600">98.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reports Due</span>
                      <span className="font-semibold">{stats.reportsDue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">At Risk</span>
                      <span className="font-semibold text-red-600">{stats.atRisk}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Compliance Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Compliance Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {complianceData.map((item, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{item.name}</h4>
                            <p className="text-sm text-gray-500">Last audit: {item.lastAudit}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant={item.score >= 90 ? 'default' : item.score >= 80 ? 'secondary' : 'destructive'}
                            >
                              {item.score}%
                            </Badge>
                            {item.issues > 0 && (
                              <Badge variant="destructive">
                                {item.issues} issues
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Reports</h2>
                <p className="text-gray-600">Generate and manage compliance reports</p>
              </div>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Generate All Reports
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clients.map((client) => (
                <Card key={client.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">{client.name}</h3>
                      <Badge variant={client.complianceScore >= 90 ? 'default' : 'secondary'}>
                        {client.complianceScore}%
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Last Report</span>
                        <span>{client.lastReport}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Status</span>
                        <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                          {client.status}
                        </Badge>
                      </div>
                      
                      <div className="flex space-x-2 mt-4">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline">
                          <Mail className="h-4 w-4 mr-1" />
                          Email
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
