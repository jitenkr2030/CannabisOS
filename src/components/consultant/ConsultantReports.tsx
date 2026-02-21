'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
  Plus, 
  Eye, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  BarChart3,
  Users,
  Building,
  TrendingUp
} from 'lucide-react'

interface Consultant {
  id: string
  businessName: string
  commissionRate: number
}

interface Client {
  id: string
  businessName: string
  contactName: string
  contactEmail: string
  city: string
  province: string
  status: string
  plan: string
  monthlyFee: number
  stores: any[]
  reports: any[]
}

interface ConsultantReportsProps {
  consultant: Consultant
  clients: Client[]
}

interface Report {
  id: string
  consultantId: string
  clientId?: string
  reportType: string
  title: string
  description?: string
  status: string
  generatedAt: string
  submittedAt?: string
  data?: any
}

export default function ConsultantReports({ consultant, clients }: ConsultantReportsProps) {
  const [reports, setReports] = useState<Report[]>([])
  const [selectedClient, setSelectedClient] = useState('all')
  const [selectedReportType, setSelectedReportType] = useState('all')
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [newReport, setNewReport] = useState({
    clientId: '',
    reportType: 'MONTHLY_SUMMARY',
    title: '',
    description: ''
  })

  const reportTypes = [
    { value: 'MONTHLY_SUMMARY', label: 'Monthly Summary', description: 'Comprehensive monthly overview' },
    { value: 'COMPLIANCE_REPORT', label: 'Compliance Report', description: 'Regulatory compliance status' },
    { value: 'INVENTORY_REPORT', label: 'Inventory Report', description: 'Stock levels and movements' },
    { value: 'SALES_REPORT', label: 'Sales Report', description: 'Sales performance and trends' },
    { value: 'FINANCIAL_REPORT', label: 'Financial Report', description: 'Revenue and expenses' },
    { value: 'CLIENT_PERFORMANCE', label: 'Client Performance', description: 'Individual client metrics' }
  ]

  useEffect(() => {
    loadReports()
  }, [])

  const loadReports = async () => {
    try {
      // In real implementation, this would fetch from database
      // For now, we'll simulate some reports
      const simulatedReports: Report[] = [
        {
          id: '1',
          consultantId: consultant.id,
          clientId: clients[0]?.id,
          reportType: 'MONTHLY_SUMMARY',
          title: 'Monthly Summary - Green Leaf Dispensary',
          description: 'Comprehensive monthly overview for January 2024',
          status: 'COMPLETED',
          generatedAt: new Date().toISOString(),
          submittedAt: new Date().toISOString()
        },
        {
          id: '2',
          consultantId: consultant.id,
          clientId: clients[1]?.id,
          reportType: 'COMPLIANCE_REPORT',
          title: 'Compliance Report - Toronto Cannabis Co',
          description: 'Regulatory compliance status for Q1 2024',
          status: 'GENERATED',
          generatedAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: '3',
          consultantId: consultant.id,
          clientId: clients[0]?.id,
          reportType: 'INVENTORY_REPORT',
          title: 'Inventory Analysis - Green Leaf Dispensary',
          description: 'Stock levels and movement analysis',
          status: 'PENDING',
          generatedAt: new Date(Date.now() - 172800000).toISOString()
        }
      ]
      setReports(simulatedReports)
    } catch (error) {
      console.error('Error loading reports:', error)
    }
  }

  const generateReport = async () => {
    try {
      setIsLoading(true)
      
      // In real implementation, this would generate the actual report
      const newReportData: Report = {
        id: Date.now().toString(),
        consultantId: consultant.id,
        clientId: newReport.clientId || undefined,
        reportType: newReport.reportType,
        title: newReport.title || `${newReport.reportType.replace('_', ' ')} - ${selectedClient === 'all' ? 'All Clients' : clients.find(c => c.id === newReport.clientId)?.businessName}`,
        description: newReport.description,
        status: 'GENERATED',
        generatedAt: new Date().toISOString()
      }

      setReports([newReportData, ...reports])
      setIsGenerateDialogOpen(false)
      setNewReport({ clientId: '', reportType: 'MONTHLY_SUMMARY', title: '', description: '' })
    } catch (error) {
      console.error('Error generating report:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const submitReport = async (reportId: string) => {
    try {
      // In real implementation, this would submit the report
      setReports(reports.map(report => 
        report.id === reportId 
          ? { ...report, status: 'SUBMITTED', submittedAt: new Date().toISOString() }
          : report
      ))
    } catch (error) {
      console.error('Error submitting report:', error)
    }
  }

  const downloadReport = (report: Report, format: 'pdf' | 'excel') => {
    // In real implementation, this would generate and download the report
    console.log(`Downloading report ${report.id} as ${format}`)
    alert(`Report "${report.title}" would be downloaded as ${format.toUpperCase()}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      case 'SUBMITTED': return 'bg-blue-100 text-blue-800'
      case 'GENERATED': return 'bg-purple-100 text-purple-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'FAILED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="h-4 w-4" />
      case 'SUBMITTED': return <CheckCircle className="h-4 w-4" />
      case 'GENERATED': return <FileText className="h-4 w-4" />
      case 'PENDING': return <Clock className="h-4 w-4" />
      case 'FAILED': return <AlertCircle className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const filteredReports = reports.filter(report => {
    const matchesClient = selectedClient === 'all' || report.clientId === selectedClient
    const matchesType = selectedReportType === 'all' || report.reportType === selectedReportType
    return matchesClient && matchesType
  })

  const getReportTypeLabel = (type: string) => {
    return reportTypes.find(rt => rt.value === type)?.label || type
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Consultant Reports</h2>
          <p className="text-gray-600">Generate and manage compliance and performance reports</p>
        </div>
        <div className="flex items-center space-x-4">
          <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Generate New Report</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="client">Client</Label>
                  <Select value={newReport.clientId} onValueChange={(value) => setNewReport({ ...newReport, clientId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select client (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Clients</SelectItem>
                      {clients.map(client => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.businessName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="reportType">Report Type</Label>
                  <Select value={newReport.reportType} onValueChange={(value) => setNewReport({ ...newReport, reportType: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="title">Title (Optional)</Label>
                  <Input
                    id="title"
                    value={newReport.title}
                    onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                    placeholder="Custom report title"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={newReport.description}
                    onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                    placeholder="Report description"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsGenerateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={generateReport} disabled={isLoading}>
                    {isLoading ? 'Generating...' : 'Generate Report'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={selectedClient} onValueChange={setSelectedClient}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by client" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Clients</SelectItem>
            {clients.map(client => (
              <SelectItem key={client.id} value={client.id}>
                {client.businessName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedReportType} onValueChange={setSelectedReportType}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {reportTypes.map(type => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Reports Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reports</p>
                <p className="text-2xl font-bold">{filteredReports.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {filteredReports.filter(r => r.status === 'COMPLETED').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {filteredReports.filter(r => r.status === 'PENDING').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Generated</p>
                <p className="text-2xl font-bold text-purple-600">
                  {filteredReports.filter(r => r.status === 'GENERATED').length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {getStatusIcon(report.status)}
                  </div>
                  <div>
                    <h4 className="font-medium">{report.title}</h4>
                    <p className="text-sm text-gray-600">{report.description}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-gray-500">
                        {getReportTypeLabel(report.reportType)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(report.generatedAt).toLocaleDateString()}
                      </span>
                      {report.clientId && (
                        <span className="text-xs text-gray-500">
                          {clients.find(c => c.id === report.clientId)?.businessName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(report.status)}>
                    {report.status}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedReport(report)
                      setIsViewDialogOpen(true)
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadReport(report, 'pdf')}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  {report.status === 'GENERATED' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => submitReport(report.id)}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {filteredReports.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
              <p className="text-gray-600">
                {selectedClient !== 'all' || selectedReportType !== 'all' 
                  ? 'Try adjusting your filters' 
                  : 'Generate your first report to get started'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Report Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedReport?.title}</DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label>Type</Label>
                  <p className="font-medium">{getReportTypeLabel(selectedReport.reportType)}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge className={getStatusColor(selectedReport.status)}>
                    {selectedReport.status}
                  </Badge>
                </div>
                <div>
                  <Label>Generated</Label>
                  <p className="font-medium">{new Date(selectedReport.generatedAt).toLocaleString()}</p>
                </div>
                {selectedReport.submittedAt && (
                  <div>
                    <Label>Submitted</Label>
                    <p className="font-medium">{new Date(selectedReport.submittedAt).toLocaleString()}</p>
                  </div>
                )}
              </div>
              {selectedReport.description && (
                <div>
                  <Label>Description</Label>
                  <p className="text-sm text-gray-600">{selectedReport.description}</p>
                </div>
              )}
              <div>
                <Label>Report Preview</Label>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Report content would be displayed here</p>
                    <p className="text-sm text-gray-500 mt-2">Full report with charts and detailed analysis</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => downloadReport(selectedReport, 'pdf')}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline" onClick={() => downloadReport(selectedReport, 'excel')}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Excel
                </Button>
                <Button onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
