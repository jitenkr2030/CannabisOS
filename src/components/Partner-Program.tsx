'use client'

import { useState, useEffect } from 'react'
import { Search, Plus, Users, TrendingUp, DollarSign, Building, Award, Gift, Star, CheckCircle, ArrowRight, Mail, Phone, Calendar, BarChart3, Eye, Edit, Trash2, Copy, ExternalLink, Shield, Zap, Target, Handshake, Globe, Briefcase, PieChart, Activity, CreditCard, FileText, Settings, LogOut, Menu, ChevronRight, Download, Upload, Filter, Badge, Avatar, AvatarFallback } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface Partner {
  id: string
  companyName: string
  contactName: string
  email: string
  phone: string
  website: string
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'TERMINATED'
  commissionRate: number
  monthlyRevenue: number
  totalCommission: number
  referralCode: string
  referralCount: number
  activeClients: number
  whiteLabelEnabled: boolean
  customDomain: string
  partnerSince: string
  lastActivity: string
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM'
  onboardingStatus: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'NEEDS_ATTENTION'
  notes: string
  branding: {
    logoUrl: string
    primaryColor: string
    secondaryColor: string
    companyName: string
    customDomain: string
    faviconUrl: string
  }
}

interface Referral {
  id: string
  partnerId: string
  partnerName: string
  referredEmail: string
  referredCompany: string
  status: 'PENDING' | 'CONVERTED' | 'LOST'
  conversionDate: string
  commissionAmount: number
  plan: string
  notes: string
}

interface Commission {
  id: string
  partnerId: string
  partnerName: string
  clientId: string
  clientName: string
  amount: number
  commissionRate: number
  commissionAmount: number
  month: string
  status: 'PENDING' | 'PAID' | 'FAILED'
  paidDate: string
  invoiceId: string
  notes: string
}

interface OnboardingTask {
  id: string
  partnerId: string
  title: string
  description: string
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  assignedTo: string
  dueDate: string
  completedDate: string
  category: 'SETUP' | 'TRAINING' | 'CUSTOMIZATION' | 'LAUNCH'
  resources: string[]
}

export default function PartnerProgram() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [commissions, setCommissions] = useState<Commission[]>([])
  const [onboardingTasks, setOnboardingTasks] = useState<OnboardingTask[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [tierFilter, setTierFilter] = useState('ALL')
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)
  const [addPartnerDialog, setAddPartnerDialog] = useState(false)
  const [referralDialog, setReferralDialog] = useState(false)
  const [commissionDialog, setCommissionDialog] = useState(false)
  const [onboardingDialog, setOnboardingDialog] = useState(false)
  const [brandingDialog, setBrandingDialog] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  const [newPartner, setNewPartner] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    commissionRate: 25,
    tier: 'BRONZE' as const,
    notes: ''
  })

  useEffect(() => {
    loadPartnerData()
  }, [])

  const loadPartnerData = async () => {
    try {
      // Mock data for demonstration
      const mockPartners: Partner[] = [
        {
          id: '1',
          companyName: 'GreenLeaf Consulting',
          contactName: 'Sarah Johnson',
          email: 'sarah@greenleafconsulting.com',
          phone: '+1-416-555-0123',
          website: 'https://greenleafconsulting.com',
          status: 'ACTIVE',
          commissionRate: 25,
          monthlyRevenue: 8000,
          totalCommission: 24000,
          referralCode: 'GREENLEAF25',
          referralCount: 12,
          activeClients: 8,
          whiteLabelEnabled: true,
          customDomain: 'app.greenleafconsulting.com',
          partnerSince: '2023-06-01',
          lastActivity: '2024-01-20',
          tier: 'GOLD',
          onboardingStatus: 'COMPLETED',
          notes: 'Excellent partner with consistent referrals',
          branding: {
            logoUrl: '/api/placeholder/logo1.png',
            primaryColor: '#10b981',
            secondaryColor: '#34d399',
            companyName: 'GreenLeaf Consulting',
            customDomain: 'app.greenleafconsulting.com',
            faviconUrl: '/api/placeholder/favicon1.ico'
          }
        },
        {
          id: '2',
          companyName: 'Cannabis Business Solutions',
          contactName: 'Mike Chen',
          email: 'mike@cbsolutions.com',
          phone: '+1-310-555-0456',
          website: 'https://cbsolutions.com',
          status: 'ACTIVE',
          commissionRate: 25,
          monthlyRevenue: 5000,
          totalCommission: 15000,
          referralCode: 'CBS25',
          referralCount: 8,
          activeClients: 5,
          whiteLabelEnabled: true,
          customDomain: 'portal.cbsolutions.com',
          partnerSince: '2023-08-15',
          lastActivity: '2024-01-19',
          tier: 'SILVER',
          onboardingStatus: 'COMPLETED',
          notes: 'Growing partner with good potential',
          branding: {
            logoUrl: '/api/placeholder/logo2.png',
            primaryColor: '#3b82f6',
            secondaryColor: '#60a5fa',
            companyName: 'Cannabis Business Solutions',
            customDomain: 'portal.cbsolutions.com',
            faviconUrl: '/api/placeholder/favicon2.ico'
          }
        },
        {
          id: '3',
          companyName: 'Dispensary Tech Advisors',
          contactName: 'Emily Rodriguez',
          email: 'emily@dispensarytech.com',
          phone: '+1-212-555-0789',
          website: 'https://dispensarytech.com',
          status: 'PENDING',
          commissionRate: 25,
          monthlyRevenue: 0,
          totalCommission: 0,
          referralCode: 'DTA25',
          referralCount: 0,
          activeClients: 0,
          whiteLabelEnabled: false,
          customDomain: '',
          partnerSince: '2024-01-15',
          lastActivity: '2024-01-15',
          tier: 'BRONZE',
          onboardingStatus: 'IN_PROGRESS',
          notes: 'New partner, onboarding in progress',
          branding: {
            logoUrl: '',
            primaryColor: '#16a34a',
            secondaryColor: '#22c55e',
            companyName: 'Dispensary Tech Advisors',
            customDomain: '',
            faviconUrl: ''
          }
        }
      ]

      const mockReferrals: Referral[] = [
        {
          id: '1',
          partnerId: '1',
          partnerName: 'GreenLeaf Consulting',
          referredEmail: 'john@sunrisedispensary.com',
          referredCompany: 'Sunrise Dispensary',
          status: 'CONVERTED',
          conversionDate: '2024-01-10',
          commissionAmount: 125,
          plan: 'Growth',
          notes: 'Converted from referral, great fit for Growth plan'
        },
        {
          id: '2',
          partnerId: '1',
          partnerName: 'GreenLeaf Consulting',
          referredEmail: 'mary@holistichealing.com',
          referredCompany: 'Holistic Healing Center',
          status: 'PENDING',
          conversionDate: '',
          commissionAmount: 0,
          plan: 'Basic',
          notes: 'Follow up scheduled for next week'
        },
        {
          id: '3',
          partnerId: '2',
          partnerName: 'Cannabis Business Solutions',
          referredEmail: 'alex@urbanleaf.com',
          referredCompany: 'Urban Leaf Dispensary',
          status: 'CONVERTED',
          conversionDate: '2024-01-08',
          commissionAmount: 100,
          plan: 'Basic',
          notes: 'Quick conversion, interested in upgrading'
        }
      ]

      const mockCommissions: Commission[] = [
        {
          id: '1',
          partnerId: '1',
          partnerName: 'GreenLeaf Consulting',
          clientId: 'client1',
          clientName: 'Sunrise Dispensary',
          amount: 500,
          commissionRate: 25,
          commissionAmount: 125,
          month: '2024-01',
          status: 'PAID',
          paidDate: '2024-01-15',
          invoiceId: 'INV-2024-001',
          notes: 'January commission - Growth plan'
        },
        {
          id: '2',
          partnerId: '2',
          partnerName: 'Cannabis Business Solutions',
          clientId: 'client2',
          clientName: 'Urban Leaf Dispensary',
          amount: 400,
          commissionRate: 25,
          commissionAmount: 100,
          month: '2024-01',
          status: 'PAID',
          paidDate: '2024-01-15',
          invoiceId: 'INV-2024-002',
          notes: 'January commission - Basic plan'
        },
        {
          id: '3',
          partnerId: '1',
          partnerName: 'GreenLeaf Consulting',
          clientId: 'client3',
          clientName: 'Holistic Healing Center',
          amount: 600,
          commissionRate: 25,
          commissionAmount: 150,
          month: '2024-01',
          status: 'PENDING',
          paidDate: '',
          invoiceId: 'INV-2024-003',
          notes: 'Pending conversion - commission not yet earned'
        }
      ]

      const mockOnboardingTasks: OnboardingTask[] = [
        {
          id: '1',
          partnerId: '3',
          title: 'Setup White-Label Domain',
          description: 'Configure custom domain for white-label dashboard',
          status: 'IN_PROGRESS',
          priority: 'HIGH',
          assignedTo: 'support-team',
          dueDate: '2024-01-25',
          completedDate: '',
          category: 'CUSTOMIZATION',
          resources: ['domain-setup-guide.pdf', 'dns-configuration.docx']
        },
        {
          id: '2',
          partnerId: '3',
          title: 'Partner Training Session',
          description: 'Conduct training session on partner dashboard and tools',
          status: 'NOT_STARTED',
          priority: 'MEDIUM',
          assignedTo: 'success-team',
          dueDate: '2024-01-30',
          completedDate: '',
          category: 'TRAINING',
          resources: ['partner-training-slides.pdf', 'demo-videos.mp4']
        },
        {
          id: '3',
          partnerId: '3',
          title: 'Marketing Materials Review',
          description: 'Review and approve partner marketing materials',
          status: 'COMPLETED',
          priority: 'LOW',
          assignedTo: 'marketing-team',
          dueDate: '2024-01-20',
          completedDate: '2024-01-18',
          category: 'SETUP',
          resources: ['brand-guidelines.pdf', 'logo-templates.zip']
        }
      ]

      setPartners(mockPartners)
      setReferrals(mockReferrals)
      setCommissions(mockCommissions)
      setOnboardingTasks(mockOnboardingTasks)
    } catch (error) {
      console.error('Failed to load partner data:', error)
    }
  }

  const addPartner = async () => {
    try {
      const partnerData: Partner = {
        id: Date.now().toString(),
        ...newPartner,
        status: 'PENDING',
        monthlyRevenue: 0,
        totalCommission: 0,
        referralCode: newPartner.companyName.toUpperCase().replace(/\s+/g, '') + '25',
        referralCount: 0,
        activeClients: 0,
        whiteLabelEnabled: false,
        customDomain: '',
        partnerSince: new Date().toISOString().split('T')[0],
        lastActivity: new Date().toISOString().split('T')[0],
        onboardingStatus: 'NOT_STARTED',
        branding: {
          logoUrl: '',
          primaryColor: '#16a34a',
          secondaryColor: '#22c55e',
          companyName: newPartner.companyName,
          customDomain: '',
          faviconUrl: ''
        }
      }

      setPartners([...partners, partnerData])
      setAddPartnerDialog(false)
      setNewPartner({
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        website: '',
        commissionRate: 25,
        tier: 'BRONZE',
        notes: ''
      })
    } catch (error) {
      console.error('Failed to add partner:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'SUSPENDED': return 'bg-orange-100 text-orange-800'
      case 'TERMINATED': return 'bg-red-100 text-red-800'
      case 'CONVERTED': return 'bg-green-100 text-green-800'
      case 'LOST': return 'bg-red-100 text-red-800'
      case 'PAID': return 'bg-green-100 text-green-800'
      case 'FAILED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'PLATINUM': return 'bg-purple-100 text-purple-800'
      case 'GOLD': return 'bg-yellow-100 text-yellow-800'
      case 'SILVER': return 'bg-gray-100 text-gray-800'
      case 'BRONZE': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getOnboardingStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800'
      case 'NOT_STARTED': return 'bg-gray-100 text-gray-800'
      case 'NEEDS_ATTENTION': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredPartners = partners.filter(partner => {
    const matchesSearch = partner.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         partner.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         partner.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || partner.status === statusFilter
    const matchesTier = tierFilter === 'ALL' || partner.tier === tierFilter
    return matchesSearch && matchesStatus && matchesTier
  })

  const totalPartners = partners.length
  const activePartners = partners.filter(p => p.status === 'ACTIVE').length
  const totalRevenue = partners.reduce((sum, p) => sum + p.monthlyRevenue, 0)
  const totalCommission = partners.reduce((sum, p) => sum + p.totalCommission, 0)
  const pendingReferrals = referrals.filter(r => r.status === 'PENDING').length
  const convertedReferrals = referrals.filter(r => r.status === 'CONVERTED').length
  const pendingCommissions = commissions.filter(c => c.status === 'PENDING').length

  const copyReferralLink = (referralCode: string) => {
    const link = `https://cannabisos.com/partners?ref=${referralCode}`
    navigator.clipboard.writeText(link)
    // Show toast notification
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Partner Program</h1>
          <p className="text-gray-600">Manage partners, track commissions, and oversee the CannabisOS partner ecosystem</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Partners</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPartners}</div>
              <p className="text-xs text-muted-foreground">
                {activePartners} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                From all partners
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Commission Paid</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalCommission.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Total to date
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Referral Activity</CardTitle>
              <Target className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{convertedReferrals}</div>
              <p className="text-xs text-muted-foreground">
                {pendingReferrals} pending
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Partner Program Offer Alert */}
        <Alert className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <Gift className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">🎉 CannabisOS Partner Program</AlertTitle>
          <AlertDescription className="text-green-700">
            <strong>Offer:</strong> 25% recurring commission + white-label dashboard + onboarding support. 
            Perfect for consultants, agencies, and industry professionals looking to monetize their network.
          </AlertDescription>
        </Alert>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="partners">Partners</TabsTrigger>
            <TabsTrigger value="referrals">Referrals</TabsTrigger>
            <TabsTrigger value="commissions">Commissions</TabsTrigger>
            <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
            <TabsTrigger value="branding">White-Label</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Partner Program Benefits */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Partner Program Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <DollarSign className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">25% Recurring Commission</h3>
                        <p className="text-gray-600">Earn 25% commission on all subscription revenue from your referrals, paid monthly for the lifetime of the customer.</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Building className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">White-Label Dashboard</h3>
                        <p className="text-gray-600">Offer CannabisOS under your own brand with custom domain, logo, colors, and company name. Present as your own solution to clients.</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Handshake className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">Onboarding Support</h3>
                        <p className="text-gray-600">Get dedicated support for setting up your white-label platform, training materials, and best practices for partner success.</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Award className="h-6 w-6 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">Partner Tiers</h3>
                        <p className="text-gray-600">Progress through Bronze, Silver, Gold, and Platinum tiers with increasing benefits, higher commission rates, and exclusive features.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Partner Tiers */}
              <Card>
                <CardHeader>
                  <CardTitle>Partner Tiers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <Badge className="bg-orange-100 text-orange-800">BRONZE</Badge>
                        <span className="text-sm text-gray-500">Entry Level</span>
                      </div>
                      <ul className="text-sm space-y-1">
                        <li>• 25% commission</li>
                        <li>• Basic dashboard access</li>
                        <li>• Email support</li>
                      </ul>
                    </div>

                    <div className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <Badge className="bg-gray-100 text-gray-800">SILVER</Badge>
                        <span className="text-sm text-gray-500">Growing Partner</span>
                      </div>
                      <ul className="text-sm space-y-1">
                        <li>• 25% commission</li>
                        <li>• White-label enabled</li>
                        <li>• Priority support</li>
                        <li>• Marketing materials</li>
                      </ul>
                    </div>

                    <div className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <Badge className="bg-yellow-100 text-yellow-800">GOLD</Badge>
                        <span className="text-sm text-gray-500">Established Partner</span>
                      </div>
                      <ul className="text-sm space-y-1">
                        <li>• 25% commission</li>
                        <li>• Custom domain</li>
                        <li>• Dedicated support</li>
                        <li>• Advanced analytics</li>
                        <li>• API access</li>
                      </ul>
                    </div>

                    <div className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <Badge className="bg-purple-100 text-purple-800">PLATINUM</Badge>
                        <span className="text-sm text-gray-500">Elite Partner</span>
                      </div>
                      <ul className="text-sm space-y-1">
                        <li>• 30% commission</li>
                        <li>• Full white-label</li>
                        <li>• White-glove support</li>
                        <li>• Custom integrations</li>
                        <li>• Revenue sharing</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Partner Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">GreenLeaf Consulting - New Referral</p>
                      <p className="text-xs text-gray-500">Sunrise Dispensary converted to Growth plan</p>
                    </div>
                    <span className="text-xs text-gray-400">2 hours ago</span>
                  </div>
                  <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">New Partner Onboarded</p>
                      <p className="text-xs text-gray-500">Dispensary Tech Advisors started onboarding</p>
                    </div>
                    <span className="text-xs text-gray-400">5 hours ago</span>
                  </div>
                  <div className="flex items-center space-x-4 p-3 bg-purple-50 rounded-lg">
                    <DollarSign className="h-5 w-5 text-purple-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Commission Paid</p>
                      <p className="text-xs text-gray-500">January commissions paid to 8 partners</p>
                    </div>
                    <span className="text-xs text-gray-400">1 day ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="partners">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Partner Management</CardTitle>
                  <Button onClick={() => setAddPartnerDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Partner
                  </Button>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search partners..."
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
                      <SelectItem value="ALL">All Status</SelectItem>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="SUSPENDED">Suspended</SelectItem>
                      <SelectItem value="TERMINATED">Terminated</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={tierFilter} onValueChange={setTierFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Filter by tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Tiers</SelectItem>
                      <SelectItem value="BRONZE">Bronze</SelectItem>
                      <SelectItem value="SILVER">Silver</SelectItem>
                      <SelectItem value="GOLD">Gold</SelectItem>
                      <SelectItem value="PLATINUM">Platinum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredPartners.map(partner => (
                    <div key={partner.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{partner.companyName}</h3>
                            <Badge className={getStatusColor(partner.status)}>
                              {partner.status}
                            </Badge>
                            <Badge className={getTierColor(partner.tier)}>
                              {partner.tier}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            <p><strong>Contact:</strong> {partner.contactName} ({partner.email})</p>
                            <p><strong>Phone:</strong> {partner.phone}</p>
                            <p><strong>Website:</strong> {partner.website}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500 mb-2">
                            Commission: <span className="font-bold">{partner.commissionRate}%</span>
                          </div>
                          <div className="text-sm text-gray-500">
                            Clients: <span className="font-bold">{partner.activeClients}</span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-gray-500">Monthly Revenue</span>
                          <p className="font-medium">${partner.monthlyRevenue.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Total Commission</span>
                          <p className="font-medium">${partner.totalCommission.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Referrals</span>
                          <p className="font-medium">{partner.referralCount}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Partner Since</span>
                          <p className="font-medium">{partner.partnerSince}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge variant={partner.whiteLabelEnabled ? "default" : "outline"}>
                            {partner.whiteLabelEnabled ? "White-Label Enabled" : "Standard"}
                          </Badge>
                          {partner.customDomain && (
                            <Badge variant="outline" className="text-xs">
                              {partner.customDomain}
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          Last activity: {partner.lastActivity}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedPartner(partner)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyReferralLink(partner.referralCode)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setBrandingDialog(true)}
                        >
                          <Building className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="referrals">
            <Card>
              <CardHeader>
                <CardTitle>Referral Tracking</CardTitle>
                <p className="text-sm text-gray-600">Track and manage all partner referrals</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {referrals.map(referral => (
                    <div key={referral.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{referral.referredCompany}</h4>
                            <Badge className={getStatusColor(referral.status)}>
                              {referral.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            <p><strong>Email:</strong> {referral.referredEmail}</p>
                            <p><strong>Plan:</strong> {referral.plan}</p>
                            <p><strong>Partner:</strong> {referral.partnerName}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500 mb-2">
                            Commission: <span className="font-bold">${referral.commissionAmount}</span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {referral.conversionDate || 'Not converted'}
                          </div>
                        </div>
                      </div>
                      {referral.notes && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                          <strong>Notes:</strong> {referral.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="commissions">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Commission Tracking</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="outline">
                      Pending: ${commissions.filter(c => c.status === 'PENDING').reduce((sum, c) => sum + c.commissionAmount, 0)}
                    </Badge>
                    <Button onClick={() => setCommissionDialog(true)}>
                      <DollarSign className="h-4 w-4 mr-2" />
                      Process Payouts
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {commissions.map(commission => (
                    <div key={commission.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{commission.clientName}</h4>
                            <Badge className={getStatusColor(commission.status)}>
                              {commission.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            <p><strong>Partner:</strong> {commission.partnerName}</p>
                            <p><strong>Month:</strong> {commission.month}</p>
                            <p><strong>Plan:</strong> ${commission.amount} ({commission.commissionRate}% commission)</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">
                            ${commission.commissionAmount}
                          </div>
                          <div className="text-sm text-gray-500">
                            {commission.paidDate || 'Unpaid'}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>Invoice: {commission.invoiceId}</span>
                        <span>{commission.notes}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="onboarding">
            <Card>
              <CardHeader>
                <CardTitle>Partner Onboarding</CardTitle>
                <p className="text-sm text-gray-600">Track onboarding progress and tasks for new partners</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {onboardingTasks.map(task => (
                    <div key={task.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{task.title}</h4>
                            <Badge className={getOnboardingStatusColor(task.status)}>
                              {task.status}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {task.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Assigned to: {task.assignedTo}</span>
                            <span>Due: {task.dueDate}</span>
                            <span>Priority: {task.priority}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          {task.completedDate ? (
                            <span className="text-sm text-green-600">
                              Completed {task.completedDate}
                            </span>
                          ) : (
                            <span className="text-sm text-orange-600">
                              Not completed
                            </span>
                          )}
                        </div>
                      </div>
                      {task.resources.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-700 mb-1">Resources:</p>
                          <div className="flex gap-2">
                            {task.resources.map((resource, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {resource}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="branding">
            <Card>
              <CardHeader>
                <CardTitle>White-Label Branding</CardTitle>
                <p className="text-sm text-gray-600">Configure white-label settings for partners</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <Alert>
                    <Building className="h-4 w-4" />
                    <AlertTitle>White-Label Dashboard</AlertTitle>
                    <AlertDescription>
                      Partners can offer CannabisOS under their own brand with custom domain, logo, and colors. This creates a seamless experience for their clients while leveraging our powerful platform.
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Branding Features</h3>
                      <ul className="space-y-2">
                        <li className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Custom domain (yourbrand.dispensaryos.com)
                        </li>
                        <li className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Custom logo and branding
                        </li>
                        <li className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Custom color schemes
                        </li>
                        <li className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Company name and contact info
                        </li>
                        <li className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Custom favicon
                        </li>
                        <li className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          "Powered by" attribution control
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Setup Process</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">1</div>
                          <div>
                            <p className="text-sm font-medium">Domain Configuration</p>
                            <p className="text-xs text-gray-500">Set up custom domain and SSL</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">2</div>
                          <div>
                            <p className="text-sm font-medium">Branding Upload</p>
                            <p className="text-xs text-gray-500">Upload logo and set colors</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">3</div>
                          <div>
                            <p className="text-sm font-medium">Content Customization</p>
                            <p className="text-xs text-gray-500">Customize text and contact info</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">4</div>
                          <div>
                            <p className="text-sm font-medium">Launch & Test</p>
                            <p className="text-xs text-gray-500">Test and launch white-label platform</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">Active White-Label Partners</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {partners.filter(p => p.whiteLabelEnabled).map(partner => (
                        <div key={partner.id} className="border rounded-lg p-4">
                          <div className="flex items-center space-x-3 mb-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{partner.companyName.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium">{partner.companyName}</h4>
                              <p className="text-sm text-gray-500">{partner.customDomain}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Tier: {partner.tier}</span>
                            <Badge variant="outline" className="text-xs">
                              {partner.branding.primaryColor}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add Partner Dialog */}
        <Dialog open={addPartnerDialog} onOpenChange={setAddPartnerDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Partner</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input
                    id="company-name"
                    value={newPartner.companyName}
                    onChange={(e) => setNewPartner(prev => ({ ...prev, companyName: e.target.value }))}
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <Label htmlFor="contact-name">Contact Name</Label>
                  <Input
                    id="contact-name"
                    value={newPartner.contactName}
                    onChange={(e) => setNewPartner(prev => ({ ...prev, contactName: e.target.value }))}
                    placeholder="Enter contact name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newPartner.email}
                    onChange={(e) => setNewPartner(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={newPartner.phone}
                    onChange={(e) => setNewPartner(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={newPartner.website}
                    onChange={(e) => setNewPartner(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="Enter website URL"
                  />
                </div>
                <div>
                  <Label htmlFor="tier">Partner Tier</Label>
                  <Select value={newPartner.tier} onValueChange={(value: any) => setNewPartner(prev => ({ ...prev, tier: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BRONZE">Bronze</SelectItem>
                      <SelectItem value="SILVER">Silver</SelectItem>
                      <SelectItem value="GOLD">Gold</SelectItem>
                      <SelectItem value="PLATINUM">Platinum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newPartner.notes}
                  onChange={(e) => setNewPartner(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add any notes about this partner"
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setAddPartnerDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={addPartner} className="flex-1">
                  <Users className="h-4 w-4 mr-2" />
                  Add Partner
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Partner Details Dialog */}
        <Dialog open={!!selectedPartner} onOpenChange={() => setSelectedPartner(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedPartner?.companyName} - Partner Details</DialogTitle>
            </DialogHeader>
            {selectedPartner && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Contact Information</h4>
                    <div className="space-y-2">
                      <p><strong>Name:</strong> {selectedPartner.contactName}</p>
                      <p><strong>Email:</strong> {selectedPartner.email}</p>
                      <p><strong>Phone:</strong> {selectedPartner.phone}</p>
                      <p><strong>Website:</strong> {selectedPartner.website}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Partner Details</h4>
                    <div className="space-y-2">
                      <p><strong>Status:</strong> <Badge className={getStatusColor(selectedPartner.status)}>{selectedPartner.status}</Badge></p>
                      <p><strong>Tier:</strong> <Badge className={getTierColor(selectedPartner.tier)}>{selectedPartner.tier}</Badge></p>
                      <p><strong>Commission Rate:</strong> {selectedPartner.commissionRate}%</p>
                      <p><strong>Referral Code:</strong> {selectedPartner.referralCode}</p>
                      <p><strong>Partner Since:</strong> {selectedPartner.partnerSince}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Performance</h4>
                    <div className="space-y-2">
                      <p><strong>Active Clients:</strong> {selectedPartner.activeClients}</p>
                      <p><strong>Referrals:</strong> {selectedPartner.referralCount}</p>
                      <p><strong>Monthly Revenue:</strong> ${selectedPartner.monthlyRevenue.toLocaleString()}</p>
                      <p><strong>Total Commission:</strong> ${selectedPartner.totalCommission.toLocaleString()}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">White-Label</h4>
                    <div className="space-y-2">
                      <p><strong>Enabled:</strong> {selectedPartner.whiteLabelEnabled ? 'Yes' : 'No'}</p>
                      <p><strong>Custom Domain:</strong> {selectedPartner.customDomain || 'Not set'}</p>
                      <p><strong>Primary Color:</strong> 
                        <span className="inline-block w-4 h-4 rounded ml-2" style={{ backgroundColor: selectedPartner.branding.primaryColor }}></span>
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Status</h4>
                    <div className="space-y-2">
                      <p><strong>Onboarding:</strong> <Badge className={getOnboardingStatusColor(selectedPartner.onboardingStatus)}>{selectedPartner.onboardingStatus}</Badge></p>
                      <p><strong>Last Activity:</strong> {selectedPartner.lastActivity}</p>
                      <p><strong>Notes:</strong> {selectedPartner.notes || 'No notes'}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Quick Actions</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Button variant="outline" size="sm">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Referral Link
                    </Button>
                    <Button variant="outline" size="sm">
                      <Building className="h-4 w-4 mr-2" />
                      Edit Branding
                    </Button>
                    <Button variant="outline" size="sm">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Analytics
                    </Button>
                    <Button variant="outline" size="sm">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}