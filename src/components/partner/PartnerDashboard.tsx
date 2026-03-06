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
  BarChart3,
  CheckCircle,
  Clock,
  ExternalLink,
  Gift,
  Award,
  Star,
  Target,
  Zap,
  Globe
} from 'lucide-react'
import { ReferralTracking } from './ReferralTracking'
import { CommissionSystem } from './CommissionSystem'
import { WhiteLabelSystem } from './WhiteLabelSystem'
import { OnboardingSystem } from './OnboardingSystem'
import { db } from '@/lib/db'

interface Partner {
  id: string
  companyName: string
  contactName: string
  email: string
  phone?: string
  website?: string
  status: string
  commissionRate: number
  monthlyRevenue: number
  totalCommission: number
  referralCode: string
  referralCount: number
  activeClients: number
  whiteLabelEnabled: boolean
  customDomain?: string
  partnerSince: string
  lastActivity: string
  tier: string
  onboardingStatus: string
  notes?: string
}

interface Referral {
  id: string
  partnerId: string
  referredEmail: string
  referredCompany?: string
  status: string
  conversionDate?: string
  commissionAmount: number
  plan?: string
  notes?: string
  createdAt: string
  updatedAt: string
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

interface OnboardingTask {
  id: string
  partnerId: string
  title: string
  description?: string
  status: string
  priority: string
  assignedTo?: string
  dueDate: string
  completedDate?: string
  category: string
  resources?: string
  createdAt: string
  updatedAt: string
}

interface PartnerDashboardProps {
  partner: Partner
}

export default function PartnerDashboard({ partner }: PartnerDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [commissions, setCommissions] = useState<Commission[]>([])
  const [onboardingTasks, setOnboardingTasks] = useState<OnboardingTask[]>([])
  const [stats, setStats] = useState({
    totalReferrals: 0,
    convertedReferrals: 0,
    pendingReferrals: 0,
    totalCommission: 0,
    pendingCommission: 0,
    paidCommission: 0,
    activeClients: 0,
    completedTasks: 0,
    pendingTasks: 0,
    monthlyRevenue: 0,
    tierProgress: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      
      // Load referrals
      const referralsData = await db.referral.findMany({
        where: { partnerId: partner.id },
        orderBy: { createdAt: 'desc' }
      })

      // Load commissions
      const commissionsData = await db.commission.findMany({
        where: { partnerId: partner.id },
        orderBy: { createdAt: 'desc' }
      })

      // Load onboarding tasks
      const tasksData = await db.onboardingTask.findMany({
        where: { partnerId: partner.id },
        orderBy: { dueDate: 'asc' }
      })

      // Calculate stats
      const convertedReferrals = referralsData.filter(r => r.status === 'CONVERTED').length
      const pendingReferrals = referralsData.filter(r => r.status === 'PENDING').length
      const pendingCommission = commissionsData.filter(c => c.status === 'PENDING').reduce((sum, c) => sum + c.commissionAmount, 0)
      const paidCommission = commissionsData.filter(c => c.status === 'PAID').reduce((sum, c) => sum + c.commissionAmount, 0)
      const completedTasks = tasksData.filter(t => t.status === 'COMPLETED').length
      const pendingTasks = tasksData.filter(t => t.status === 'NOT_STARTED' || t.status === 'IN_PROGRESS').length

      setReferrals(referralsData)
      setCommissions(commissionsData)
      setOnboardingTasks(tasksData)
      setStats({
        totalReferrals: referralsData.length,
        convertedReferrals,
        pendingReferrals,
        totalCommission: commissionsData.reduce((sum, c) => sum + c.commissionAmount, 0),
        pendingCommission,
        paidCommission,
        activeClients: partner.activeClients,
        completedTasks,
        pendingTasks,
        monthlyRevenue: partner.monthlyRevenue,
        tierProgress: getTierProgress(partner.tier)
      })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getTierProgress = (tier: string) => {
    const tiers = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM']
    const currentIndex = tiers.indexOf(tier)
    return ((currentIndex + 1) / tiers.length) * 100
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'BRONZE': return 'bg-orange-100 text-orange-800'
      case 'SILVER': return 'bg-gray-100 text-gray-800'
      case 'GOLD': return 'bg-yellow-100 text-yellow-800'
      case 'PLATINUM': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'SUSPENDED': return 'bg-red-100 text-red-800'
      case 'TERMINATED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
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
            <h1 className="text-2xl font-bold text-gray-900">Partner Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome back, {partner.contactName}</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant={partner.status === 'ACTIVE' ? 'default' : 'secondary'}>
              {partner.status}
            </Badge>
            <Badge className={getTierColor(partner.tier)}>
              {partner.tier}
            </Badge>
            {partner.whiteLabelEnabled && (
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
              <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReferrals}</div>
              <p className="text-xs text-muted-foreground">
                {stats.convertedReferrals} converted, {stats.pendingReferrals} pending
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Commission</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${stats.totalCommission.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                ${stats.pendingCommission.toLocaleString()} pending
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeClients}</div>
              <p className="text-xs text-muted-foreground">
                Growing your business
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Onboarding Progress</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedTasks}</div>
              <p className="text-xs text-muted-foreground">
                {stats.pendingTasks} tasks remaining
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
            <TabsTrigger value="referrals">Referrals</TabsTrigger>
            <TabsTrigger value="commissions">Commissions</TabsTrigger>
            <TabsTrigger value="branding">White-Label</TabsTrigger>
            <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Referrals */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Recent Referrals
                    <Button variant="outline" size="sm" onClick={() => setActiveTab('referrals')}>
                      View All
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {referrals.slice(0, 5).map((referral) => (
                      <div key={referral.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{referral.referredEmail}</p>
                          <p className="text-xs text-gray-600">{referral.referredCompany || 'Individual'}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={referral.status === 'CONVERTED' ? 'default' : 'secondary'}>
                            {referral.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {referrals.length === 0 && (
                      <p className="text-center text-gray-500 py-8">No referrals yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Commission Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Commission Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Pending</span>
                      <span className="text-sm font-bold text-orange-600">
                        ${stats.pendingCommission.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Paid</span>
                      <span className="text-sm font-bold text-green-600">
                        ${stats.paidCommission.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Total</span>
                      <span className="text-sm font-bold">
                        ${stats.totalCommission.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Tier Progress */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Tier Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Current Tier</span>
                    <Badge className={getTierColor(partner.tier)}>
                      {partner.tier}
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${stats.tierProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600">
                    {stats.tierProgress.toFixed(0)}% to next tier
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="referrals" className="mt-6">
            <ReferralTracking 
              partner={partner}
              referrals={referrals}
              onReferralAdded={loadDashboardData}
            />
          </TabsContent>
          
          <TabsContent value="commissions" className="mt-6">
            <CommissionSystem 
              partner={partner}
              commissions={commissions}
              onCommissionUpdated={loadDashboardData}
            />
          </TabsContent>
          
          <TabsContent value="branding" className="mt-6">
            <WhiteLabelSystem 
              partner={partner}
              onBrandingUpdated={loadDashboardData}
            />
          </TabsContent>
          
          <TabsContent value="onboarding" className="mt-6">
            <OnboardingSystem 
              partner={partner}
              tasks={onboardingTasks}
              onTaskUpdated={loadDashboardData}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
