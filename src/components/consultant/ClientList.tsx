'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  Building, 
  Phone, 
  Mail, 
  MapPin,
  Calendar,
  DollarSign
} from 'lucide-react'
import { db } from '@/lib/db'

interface Client {
  id: string
  businessName: string
  contactName: string
  contactEmail: string
  contactPhone: string
  businessAddress: string
  city: string
  province: string
  postalCode: string
  country: string
  status: string
  plan: string
  monthlyFee: number
  yearlyFee: number
  billingCycle: 'monthly' | 'yearly'
  startDate: string
  endDate?: string
  notes?: string
  stores: any[]
  invoices: any[]
  reports: any[]
}

interface ClientListProps {
  clients: Client[]
  onClientAdded: () => void
  onClientUpdated: () => void
}

export default function ClientList({ clients, onClientAdded, onClientUpdated }: ClientListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    businessAddress: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'Canada',
    status: 'ACTIVE',
    plan: 'Basic',
    monthlyFee: 199,
    yearlyFee: 1999,
    billingCycle: 'monthly',
    notes: ''
  })

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.contactEmail.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleAddClient = async () => {
    try {
      setIsLoading(true)
      
      // Create client
      const newClient = await db.client.create({
        data: {
          ...formData,
          consultantId: 'consultant-id', // This would come from the consultant context
          startDate: new Date().toISOString()
        }
      })

      // Reset form
      setFormData({
        businessName: '',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        businessAddress: '',
        city: '',
        province: '',
        postalCode: '',
        country: 'Canada',
        status: 'ACTIVE',
        plan: 'Basic',
        monthlyFee: 199,
        yearlyFee: 1999,
        billingCycle: 'monthly',
        notes: ''
      })

      setIsAddDialogOpen(false)
      onClientAdded()
    } catch (error) {
      console.error('Error adding client:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditClient = async () => {
    if (!selectedClient) return

    try {
      setIsLoading(true)
      
      await db.client.update({
        where: { id: selectedClient.id },
        data: formData
      })

      setIsEditDialogOpen(false)
      setSelectedClient(null)
      onClientUpdated()
    } catch (error) {
      console.error('Error updating client:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteClient = async (clientId: string) => {
    if (!confirm('Are you sure you want to delete this client?')) return

    try {
      await db.client.delete({
        where: { id: clientId }
      })
      onClientUpdated()
    } catch (error) {
      console.error('Error deleting client:', error)
    }
  }

  const openEditDialog = (client: Client) => {
    setSelectedClient(client)
    setFormData({
      businessName: client.businessName,
      contactName: client.contactName,
      contactEmail: client.contactEmail,
      contactPhone: client.contactPhone,
      businessAddress: client.businessAddress,
      city: client.city,
      province: client.province,
      postalCode: client.postalCode,
      country: client.country,
      status: client.status,
      plan: client.plan,
      monthlyFee: client.monthlyFee,
      yearlyFee: client.yearlyFee || 1999,
      billingCycle: client.billingCycle || 'monthly',
      notes: client.notes || ''
    })
    setIsEditDialogOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800'
      case 'INACTIVE': return 'bg-gray-100 text-gray-800'
      case 'SUSPENDED': return 'bg-red-100 text-red-800'
      case 'TERMINATED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Client Management</h2>
          <p className="text-gray-600">Manage your dispensary clients and their stores</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    placeholder="Business name"
                  />
                </div>
                <div>
                  <Label htmlFor="contactName">Contact Name</Label>
                  <Input
                    id="contactName"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    placeholder="Contact name"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactEmail">Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <Label htmlFor="contactPhone">Phone</Label>
                  <Input
                    id="contactPhone"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    placeholder="Phone number"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="businessAddress">Business Address</Label>
                <Input
                  id="businessAddress"
                  value={formData.businessAddress}
                  onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
                  placeholder="Street address"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="City"
                  />
                </div>
                <div>
                  <Label htmlFor="province">Province</Label>
                  <Input
                    id="province"
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    placeholder="Province"
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    placeholder="Postal code"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                      <SelectItem value="SUSPENDED">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
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
                      <SelectItem value="Consultant">Consultant</SelectItem>
                      <SelectItem value="Enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="monthlyFee">Monthly Fee ($)</Label>
                <Input
                  id="monthlyFee"
                  type="number"
                  value={formData.monthlyFee}
                  onChange={(e) => setFormData({ ...formData, monthlyFee: parseFloat(e.target.value) })}
                  placeholder="199"
                />
              </div>
              <div>
                <Label htmlFor="yearlyFee">Yearly Fee ($)</Label>
                <Input
                  id="yearlyFee"
                  type="number"
                  value={formData.yearlyFee}
                  onChange={(e) => setFormData({ ...formData, yearlyFee: parseFloat(e.target.value) })}
                  placeholder="1999"
                />
              </div>
              <div>
                <Label htmlFor="billingCycle">Billing Cycle</Label>
                <Select value={formData.billingCycle} onValueChange={(value) => setFormData({ ...formData, billingCycle: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes..."
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddClient} disabled={isLoading}>
                  {isLoading ? 'Adding...' : 'Add Client'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search clients..."
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
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
            <SelectItem value="SUSPENDED">Suspended</SelectItem>
            <SelectItem value="TERMINATED">Terminated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Client List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <Card key={client.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{client.businessName}</CardTitle>
                  <p className="text-sm text-gray-600">{client.contactName}</p>
                </div>
                <div className="flex space-x-1">
                  <Badge className={getStatusColor(client.status)}>
                    {client.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {client.contactEmail}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  {client.contactPhone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {client.city}, {client.province}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  Started {new Date(client.startDate).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="h-4 w-4 mr-2" />
                  ${client.monthlyFee}/month or ${client.yearlyFee}/year
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {client.billingCycle === 'yearly' ? 'Yearly billing' : 'Monthly billing'}
                </div>
                <div className="flex items-center justify-between pt-2">
                  <Badge className={getPlanColor(client.plan)}>
                    {client.plan}
                  </Badge>
                  <div className="flex space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(client)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClient(client.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No clients found</h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your filters' 
              : 'Get started by adding your first client'}
          </p>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-businessName">Business Name</Label>
                <Input
                  id="edit-businessName"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  placeholder="Business name"
                />
              </div>
              <div>
                <Label htmlFor="edit-contactName">Contact Name</Label>
                <Input
                  id="edit-contactName"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  placeholder="Contact name"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-contactEmail">Email</Label>
                <Input
                  id="edit-contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  placeholder="Email address"
                />
              </div>
              <div>
                <Label htmlFor="edit-contactPhone">Phone</Label>
                <Input
                  id="edit-contactPhone"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  placeholder="Phone number"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                    <SelectItem value="SUSPENDED">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-plan">Plan</Label>
                <Select value={formData.plan} onValueChange={(value) => setFormData({ ...formData, plan: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Basic">Basic</SelectItem>
                    <SelectItem value="Growth">Growth</SelectItem>
                    <SelectItem value="Consultant">Consultant</SelectItem>
                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="edit-monthlyFee">Monthly Fee ($)</Label>
              <Input
                id="edit-monthlyFee"
                type="number"
                value={formData.monthlyFee}
                onChange={(e) => setFormData({ ...formData, monthlyFee: parseFloat(e.target.value) })}
                placeholder="199"
              />
            </div>
            <div>
              <Label htmlFor="edit-yearlyFee">Yearly Fee ($)</Label>
              <Input
                id="edit-yearlyFee"
                type="number"
                value={formData.yearlyFee}
                onChange={(e) => setFormData({ ...formData, yearlyFee: parseFloat(e.target.value) })}
                placeholder="1999"
              />
            </div>
            <div>
              <Label htmlFor="edit-billingCycle">Billing Cycle</Label>
              <Select value={formData.billingCycle} onValueChange={(value) => setFormData({ ...formData, billingCycle: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes..."
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditClient} disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Client'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
