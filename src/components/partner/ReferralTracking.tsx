'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Users, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Mail, 
  Building, 
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  ExternalLink,
  TrendingUp,
  DollarSign,
  Filter,
  Search
} from 'lucide-react'
import { db } from '@/lib/db'

interface Partner {
  id: string
  companyName: string
  contactName: string
  email: string
  referralCode: string
  commissionRate: number
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

interface ReferralTrackingProps {
  partner: Partner
  referrals: Referral[]
  onReferralAdded: () => void
}

export default function ReferralTracking({ partner, referrals, onReferralAdded }: ReferralTrackingProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    referredEmail: '',
    referredCompany: '',
    plan: 'Basic',
    notes: ''
  })

  const filteredReferrals = referrals.filter(referral => {
    const matchesSearch = referral.referredEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (referral.referredCompany && referral.referredCompany.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || referral.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleAddReferral = async () => {
    try {
      setIsLoading(true)
      
      // Create referral
      const newReferral = await db.referral.create({
        data: {
          partnerId: partner.id,
          referredEmail: formData.referredEmail,
          referredCompany: formData.referredCompany,
          plan: formData.plan,
          notes: formData.notes,
          status: 'PENDING'
        }
      })

      // Reset form
      setFormData({
        referredEmail: '',
        referredCompany: '',
        plan: 'Basic',
        notes: ''
      })

      setIsAddDialogOpen(false)
      onReferralAdded()
    } catch (error) {
      console.error('Error adding referral:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateReferral = async () => {
    if (!selectedReferral) return

    try {
      setIsLoading(true)
      
      await db.referral.update({
        where: { id: selectedReferral.id },
        data: {
          status: selectedReferral.status,
          notes: selectedReferral.notes
        }
      })

      setIsEditDialogOpen(false)
      setSelectedReferral(null)
      onReferralAdded()
    } catch (error) {
      console.error('Error updating referral:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteReferral = async (referralId: string) => {
    if (!confirm('Are you sure you want to delete this referral?')) return

    try {
      await db.referral.delete({
        where: { id: referralId }
      })
      onReferralAdded()
    } catch (error) {
      console.error('Error deleting referral:', error)
    }
  }

  const handleContactReferral = async (referral: Referral) => {
    try {
      // Update referral status to CONTACTED
      await db.referral.update({
        where: { id: referral.id },
        data: { status: 'CONTACTED' }
      })
      onReferralAdded()
    } catch (error) {
      console.error('Error contacting referral:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONVERTED': return 'bg-green-100 text-green-800'
      case 'CONTACTED': return 'bg-blue-100 text-blue-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'LOST': return 'bg-red-100 text-red-800'
      case 'CANCELLED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONVERTED': return <CheckCircle className="h-4 w-4" />
      case 'CONTACTED': return <Mail className="h-4 w-4" />
      case 'PENDING': return <Clock className="h-4 w-4" />
      case 'LOST': return <AlertTriangle className="h-4 w-4" />
      case 'CANCELLED': return <AlertTriangle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'Basic': return 'bg-blue-100 text-blue-800'
      case 'Growth': return 'bg-purple-100 text-purple-800'
      case 'Enterprise': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const copyReferralLink = () => {
    const link = `https://cannabisos.com/signup?ref=${partner.referralCode}`
    navigator.clipboard.writeText(link)
    alert('Referral link copied to clipboard!')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Referral Tracking</h2>
          <p className="text-gray-600">Manage your referrals and track conversions</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={copyReferralLink}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Copy Referral Link
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Referral
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Referral</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="referredEmail">Email Address</Label>
                  <Input
                    id="referredEmail"
                    type="email"
                    value={formData.referredEmail}
                    onChange={(e) => setFormData({ ...formData, referredEmail: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <Label htmlFor="referredCompany">Company Name (Optional)</Label>
                  <Input
                    id="referredCompany"
                    value={formData.referredCompany}
                    onChange={(e) => setFormData({ ...formData, referredCompany: e.target.value })}
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <Label htmlFor="plan">Plan</Label>
                  <Select value={formData.plan} onValueChange={(value) => setFormData({ ...formData, plan: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Basic">Basic</SelectItem>
                      <SelectItem value="Growth">Growth</SelectItem>
                      <SelectItem value="Enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Add any notes about this referral"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddReferral} disabled={isLoading}>
                    {isLoading ? 'Adding...' : 'Add Referral'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Referral Link */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Your Referral Link</h3>
              <p className="text-sm text-gray-600">Share this link to earn commissions</p>
            </div>
            <Button variant="outline" onClick={copyReferralLink}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
          </div>
          <div className="mt-4 p-3 bg-gray-100 rounded-lg">
            <code className="text-sm text-gray-800">
              https://cannabisos.com/signup?ref={partner.referralCode}
            </code>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>Commission Rate: <span className="font-semibold">{partner.commissionRate}%</span></p>
            <p>Referrals: <span className="font-semibold">{referrals.length}</span></p>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search referrals..."
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
            <SelectItem value="CONTACTED">Contacted</SelectItem>
            <SelectItem value="CONVERTED">Converted</SelectItem>
            <SelectItem value="LOST">Lost</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Referrals List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReferrals.map((referral) => (
          <Card key={referral.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{referral.referredEmail}</CardTitle>
                  {referral.referredCompany && (
                    <p className="text-sm text-gray-600">{referral.referredCompany}</p>
                  )}
                </div>
                <div className="flex space-x-1">
                  <Badge className={getStatusColor(referral.status)}>
                    {referral.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  Referred {new Date(referral.createdAt).toLocaleDateString()}
                </div>
                {referral.conversionDate && (
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Converted {new Date(referral.conversionDate).toLocaleDateString()}
                  </div>
                )}
                {referral.plan && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Building className="h-4 w-4 mr-2" />
                    <Badge className={getPlanColor(referral.plan)}>
                      {referral.plan}
                    </Badge>
                  </div>
                )}
                {referral.commissionAmount > 0 && (
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="h-4 w-4 mr-2" />
                    ${referral.commissionAmount.toLocaleString()} commission
                  </div>
                )}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedReferral(referral)
                        setIsEditDialogOpen(true)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteReferral(referral.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex space-x-1">
                    {referral.status === 'PENDING' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleContactReferral(referral)}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
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

      {filteredReferrals.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No referrals found</h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your filters' 
              : 'Start by adding your first referral'}
          </p>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Referral</DialogTitle>
          </DialogHeader>
          {selectedReferral && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select 
                  value={selectedReferral.status} 
                  onValueChange={(value) => setSelectedReferral({ ...selectedReferral, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="CONTACTED">Contacted</SelectItem>
                    <SelectItem value="CONVERTED">Converted</SelectItem>
                    <SelectItem value="LOST">Lost</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  value={selectedReferral.notes || ''}
                  onChange={(e) => setSelectedReferral({ ...selectedReferral, notes: e.target.value })}
                  placeholder="Add any notes about this referral"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateReferral} disabled={isLoading}>
                  {isLoading ? 'Updating...' : 'Update Referral'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
