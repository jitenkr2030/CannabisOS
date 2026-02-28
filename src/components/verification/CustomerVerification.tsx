'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  User, 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  X, 
  Eye, 
  EyeOff, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  Camera, 
  Upload, 
  FileText, 
  Clock, 
  Zap, 
  Award, 
  Users, 
  Search, 
  Filter, 
  Download,
  RefreshCw,
  AlertCircle,
  UserPlus
} from 'lucide-react'

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  dateOfBirth: Date
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  idNumber: string
  idType: 'drivers_license' | 'state_id' | 'passport' | 'military_id'
  idExpiry: Date
  medicalCardNumber?: string
  medicalCardExpiry?: Date
  verificationStatus: 'not_started' | 'pending' | 'in_review' | 'verified' | 'rejected' | 'expired'
  verificationLevel: 'basic' | 'standard' | 'enhanced'
  verificationDate?: Date
  verifiedBy?: string
  documents: {
    idFront: string
    idBack: string
    selfie: string
    proofOfAddress?: string
    medicalCard?: string
  }
  riskScore: number
  lastLogin: Date
  purchaseHistory: {
    totalOrders: number
    totalSpent: number
    lastOrder: Date
    averageOrderValue: number
  }
  complianceFlags: string[]
  notes: string
  createdAt: Date
  updatedAt: Date
}

interface VerificationStep {
  id: string
  name: string
  description: string
  status: 'pending' | 'completed' | 'failed' | 'skipped'
  required: boolean
  documents: string[]
  metadata?: Record<string, any>
}

interface VerificationResult {
  customerId: string
  overallStatus: 'pending' | 'verified' | 'rejected'
  confidence: number
  riskLevel: 'low' | 'medium' | 'high'
  verifiedAt?: Date
  expiresAt?: Date
  steps: VerificationStep[]
  notes: string
  nextReviewDate?: Date
}

export default function CustomerVerification() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [verificationResults, setVerificationResults] = useState<VerificationResult[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [activeTab, setActiveTab] = useState('overview')
  const [showVerificationModal, setShowVerificationModal] = useState(false)

  // Mock customers data
  useEffect(() => {
    const mockCustomers: Customer[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@email.com',
        phone: '+1-555-0123',
        dateOfBirth: new Date('1990-05-15'),
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        idNumber: 'DL123456789',
        idType: 'drivers_license',
        idExpiry: new Date('2025-05-15'),
        medicalCardNumber: 'MC987654321',
        medicalCardExpiry: new Date('2024-12-31'),
        verificationStatus: 'verified',
        verificationLevel: 'enhanced',
        verificationDate: new Date('2024-01-10'),
        verifiedBy: 'admin@cannabisos.com',
        documents: {
          idFront: '/documents/customer1/id_front.jpg',
          idBack: '/documents/customer1/id_back.jpg',
          selfie: '/documents/customer1/selfie.jpg',
          proofOfAddress: '/documents/customer1/utility_bill.jpg',
          medicalCard: '/documents/customer1/medical_card.jpg'
        },
        riskScore: 15,
        lastLogin: new Date('2024-01-16'),
        purchaseHistory: {
          totalOrders: 23,
          totalSpent: 1250.50,
          lastOrder: new Date('2024-01-15'),
          averageOrderValue: 54.37
        },
        complianceFlags: [],
        notes: 'Verified customer with enhanced verification',
        createdAt: new Date('2023-06-15'),
        updatedAt: new Date('2024-01-16')
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane.smith@email.com',
        phone: '+1-555-0124',
        dateOfBirth: new Date('1985-08-22'),
        address: '456 Oak Ave',
        city: 'Brooklyn',
        state: 'NY',
        zipCode: '11201',
        country: 'USA',
        idNumber: 'DL789012345',
        idType: 'drivers_license',
        idExpiry: new Date('2024-11-30'),
        verificationStatus: 'in_review',
        verificationLevel: 'standard',
        documents: {
          idFront: '/documents/customer2/id_front.jpg',
          idBack: '/documents/customer2/id_back.jpg',
          selfie: '/documents/customer2/selfie.jpg',
          proofOfAddress: '/documents/customer2/lease_agreement.pdf'
        },
        riskScore: 35,
        lastLogin: new Date('2024-01-14'),
        purchaseHistory: {
          totalOrders: 15,
          totalSpent: 875.25,
          lastOrder: new Date('2024-01-14'),
          averageOrderValue: 58.35
        },
        complianceFlags: ['new_customer_high_value'],
        notes: 'Standard verification in progress',
        createdAt: new Date('2023-09-20'),
        updatedAt: new Date('2024-01-14')
      },
      {
        id: '3',
        name: 'Bob Johnson',
        email: 'bob.johnson@email.com',
        phone: '+1-555-0125',
        dateOfBirth: new Date('1992-03-10'),
        address: '789 Pine St',
        city: 'Queens',
        state: 'NY',
        zipCode: '11375',
        country: 'USA',
        idNumber: 'DL345678901',
        idType: 'drivers_license',
        idExpiry: new Date('2023-12-31'),
        verificationStatus: 'rejected',
        verificationLevel: 'basic',
        documents: {
          idFront: '/documents/customer3/id_front.jpg',
          idBack: '/documents/customer3/id_back.jpg',
          selfie: '/documents/customer3/selfie.jpg'
        },
        riskScore: 75,
        lastLogin: new Date('2024-01-10'),
        purchaseHistory: {
          totalOrders: 8,
          totalSpent: 420.00,
          lastOrder: new Date('2024-01-10'),
          averageOrderValue: 52.50
        },
        complianceFlags: ['expired_id', 'high_risk_transaction'],
        notes: 'Rejected due to expired ID and high risk score',
        createdAt: new Date('2023-12-05'),
        updatedAt: new Date('2024-01-10')
      },
      {
        id: '4',
        name: 'Alice Brown',
        email: 'alice.brown@email.com',
        phone: '+1-555-0126',
        dateOfBirth: new Date('1988-07-18'),
        address: '321 Elm St',
        city: 'Manhattan',
        state: 'NY',
        zipCode: '10002',
        country: 'USA',
        idNumber: 'PS234567890',
        idType: 'passport',
        idExpiry: new Date('2026-07-18'),
        verificationStatus: 'pending',
        verificationLevel: 'enhanced',
        documents: {
          idFront: '/documents/customer4/passport_front.jpg',
          idBack: '/documents/customer4/passport_back.jpg',
          selfie: '/documents/customer4/selfie.jpg',
          proofOfAddress: '/documents/customer4/bank_statement.jpg',
          medicalCard: '/documents/customer4/medical_card.jpg'
        },
        riskScore: 25,
        lastLogin: new Date('2024-01-16'),
        purchaseHistory: {
          totalOrders: 31,
          totalSpent: 1875.75,
          lastOrder: new Date('2024-01-16'),
          averageOrderValue: 60.51
        },
        complianceFlags: ['international_customer'],
        notes: 'Pending enhanced verification for international customer',
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-16')
      }
    ]

    setCustomers(mockCustomers)
  }, [])

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: Date): number => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  }

  // Verify customer age
  const verifyAge = (customer: Customer): boolean => {
    const age = calculateAge(customer.dateOfBirth)
    return age >= 21 // Minimum age for cannabis purchase
  }

  // Check if ID is expired
  const isIdExpired = (customer: Customer): boolean => {
    return new Date() > customer.idExpiry
  }

  // Calculate verification confidence score
  const calculateVerificationScore = (customer: Customer): number => {
    let score = 0
    let reasoning = []

    // Age verification (30%)
    const age = calculateAge(customer.dateOfBirth)
    if (age >= 21) {
      score += 30
      reasoning.push('Age verified (21+)')
    } else {
      reasoning.push('Age under 21')
    }

    // ID status (25%)
    if (!isIdExpired(customer)) {
      score += 25
      reasoning.push('ID not expired')
    } else {
      reasoning.push('ID expired')
    }

    // Document completeness (20%)
    const requiredDocs = ['idFront', 'idBack', 'selfie']
    const hasAllDocs = requiredDocs.every(doc => customer.documents[doc as keyof typeof customer.documents])
    if (hasAllDocs) {
      score += 20
      reasoning.push('All required documents uploaded')
    } else {
      reasoning.push('Missing required documents')
    }

    // Additional documents (15%)
    const additionalDocs = ['proofOfAddress', 'medicalCard']
    const hasAdditionalDocs = additionalDocs.filter(doc => 
      customer.documents[doc as keyof typeof customer.documents]
    ).length
    if (hasAdditionalDocs >= 2) {
      score += 15
      reasoning.push('All additional documents uploaded')
    } else if (hasAdditionalDocs >= 1) {
      score += 10
      reasoning.push('Some additional documents uploaded')
    } else {
      reasoning.push('No additional documents')
    }

    // Purchase history (10%)
    if (customer.purchaseHistory.totalOrders >= 10) {
      score += 10
      reasoning.push('Established purchase history')
    } else if (customer.purchaseHistory.totalOrders >= 5) {
      score += 5
      reasoning.push('Limited purchase history')
    } else {
      reasoning.push('New customer')
    }

    return score
  }

  // Get verification status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800'
      case 'in_review': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'expired': return 'bg-orange-100 text-orange-800'
      case 'not_started': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Get risk level color
  const getRiskColor = (score: number) => {
    if (score <= 30) return 'text-green-600'
    if (score <= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  // Get risk level badge
  const getRiskBadge = (score: number) => {
    if (score <= 30) return { color: 'bg-green-100 text-green-800', text: 'Low Risk' }
    if (score <= 60) return { color: 'bg-yellow-100 text-yellow-800', text: 'Medium Risk' }
    return { color: 'bg-red-100 text-red-800', text: 'High Risk' }
  }

  // Process verification
  const processVerification = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId)
    if (!customer) return

    const score = calculateVerificationScore(customer)
    const verificationResult: VerificationResult = {
      customerId,
      overallStatus: score >= 70 ? 'verified' : score >= 50 ? 'pending' : 'rejected',
      confidence: score / 100,
      riskLevel: score <= 30 ? 'low' : score <= 60 ? 'medium' : 'high',
      verifiedAt: score >= 70 ? new Date() : undefined,
      expiresAt: score >= 70 ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) : undefined, // 1 year
      steps: [
        {
          id: 'age_verification',
          name: 'Age Verification',
          description: 'Verify customer is 21+ years old',
          status: calculateAge(customer.dateOfBirth) >= 21 ? 'completed' : 'failed',
          required: true,
          documents: [],
          metadata: { age: calculateAge(customer.dateOfBirth) }
        },
        {
          id: 'id_verification',
          name: 'ID Verification',
          description: 'Verify government-issued ID is valid and not expired',
          status: !isIdExpired(customer) ? 'completed' : 'failed',
          required: true,
          documents: ['idFront', 'idBack'],
          metadata: { 
            idType: customer.idType,
            idNumber: customer.idNumber,
            expiry: customer.idExpiry
          }
        },
        {
          id: 'document_verification',
          name: 'Document Verification',
          description: 'Verify all uploaded documents are authentic',
          status: score >= 50 ? 'completed' : 'failed',
          required: true,
          documents: ['selfie'],
          metadata: { score }
        },
        {
          id: 'address_verification',
          name: 'Address Verification',
          description: 'Verify customer address with supporting documents',
          status: customer.documents.proofOfAddress ? 'completed' : 'skipped',
          required: false,
          documents: ['proofOfAddress'],
          metadata: { hasProofOfAddress: !!customer.documents.proofOfAddress }
        },
        {
          id: 'medical_verification',
          name: 'Medical Card Verification',
          description: 'Verify medical marijuana card is valid',
          status: customer.documents.medicalCard && !isIdExpired(customer) ? 'completed' : 'skipped',
          required: false,
          documents: ['medicalCard'],
          metadata: { 
            hasMedicalCard: !!customer.documents.medicalCard,
            medicalCardNumber: customer.medicalCardNumber
          }
        }
      ],
      notes: `Verification completed with ${score.toFixed(0)}/100 confidence score. ${score >= 70 ? 'Approved.' : score >= 50 ? 'Requires manual review.' : 'Rejected.'}`
    }

    // Update customer status
    setCustomers(prev => prev.map(c => 
      c.id === customerId 
        ? { 
            ...c, 
            verificationStatus: verificationResult.overallStatus,
            verificationDate: verificationResult.verifiedAt,
            updatedAt: new Date()
          }
        : c
    ))

    // Add to results
    setVerificationResults(prev => [...prev, verificationResult])
  }

  // Manual verification override
  const overrideVerification = (customerId: string, status: 'verified' | 'rejected', notes: string) => {
    setCustomers(prev => prev.map(c => 
      c.id === customerId 
        ? { 
            ...c, 
            verificationStatus: status,
            verificationDate: new Date(),
            notes: notes,
            updatedAt: new Date()
          }
        : c
    ))
  }

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.phone.includes(searchTerm)
    const matchesStatus = filterStatus === 'all' || customer.verificationStatus === filterStatus
    
    return matchesSearch && matchesStatus
  })

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Verification</h1>
          <p className="text-gray-600">Comprehensive identity verification and compliance management</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setShowVerificationModal(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Verified</p>
                <p className="text-2xl font-bold text-gray-900">
                  {customers.filter(c => c.verificationStatus === 'verified').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900">
                  {customers.filter(c => c.verificationStatus === 'pending' || c.verificationStatus === 'in_review').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Risk</p>
                <p className="text-2xl font-bold text-gray-900">
                  {customers.filter(c => c.riskScore > 60).length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Status</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="in_review">In Review</option>
            <option value="rejected">Rejected</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Customers List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    {customer.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                    <p className="text-sm text-gray-500">{customer.email}</p>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <Badge className={getStatusColor(customer.verificationStatus)}>
                    {customer.verificationStatus.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <Badge className={getRiskBadge(customer.riskScore).color}>
                    {getRiskBadge(customer.riskScore).text}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <p className="text-gray-600">Age</p>
                  <p className="font-medium">{calculateAge(customer.dateOfBirth)} years</p>
                </div>
                <div>
                  <p className="text-gray-600">ID Type</p>
                  <p className="font-medium capitalize">{customer.idType.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-gray-600">Verification Level</p>
                  <p className="font-medium capitalize">{customer.verificationLevel}</p>
                </div>
                <div>
                  <p className="text-gray-600">Risk Score</p>
                  <p className={`font-medium ${getRiskColor(customer.riskScore)}`}>
                    {customer.riskScore}/100
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-gray-600">Address</p>
                  <p className="font-medium">{customer.address}, {customer.city}, {customer.state}</p>
                </div>
                <div>
                  <p className="text-gray-600">Phone</p>
                  <p className="font-medium">{customer.phone}</p>
                </div>
                <div>
                  <p className="text-gray-600">Purchase History</p>
                  <p className="font-medium">
                    {customer.purchaseHistory.totalOrders} orders, ${customer.purchaseHistory.totalSpent.toFixed(2)} total
                  </p>
                </div>
                {customer.complianceFlags.length > 0 && (
                  <div>
                    <p className="text-gray-600">Compliance Flags</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {customer.complianceFlags.map((flag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {flag.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">
                      {customer.verificationDate 
                        ? `Verified on ${customer.verificationDate.toLocaleDateString()}`
                        : 'Not verified'
                      }
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => processVerification(customer.id)}
                      disabled={customer.verificationStatus === 'verified'}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      {customer.verificationStatus === 'verified' ? 'Re-verify' : 'Verify'}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedCustomer(customer)}
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
    </div>
  )
}
