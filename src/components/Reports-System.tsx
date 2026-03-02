'use client'

import { useState, useEffect } from 'react'
import { Search, Download, FileText, BarChart3, PieChart, TrendingUp, Calendar, Filter, Eye, Edit, DollarSign, Package, Users, Truck, AlertTriangle, Plus, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface Report {
  id: string
  name: string
  type: string
  period: string
  generatedAt: string
  status: 'PENDING' | 'GENERATING' | 'READY' | 'FAILED'
  fileUrl?: string
  data: any
}

interface SalesData {
  total: number
  byPeriod: {
    daily: { date: string; sales: number }[]
    weekly: { week: string; sales: number }[]
    monthly: { month: string; sales: number }[]
  }
  byCategory: { category: string; sales: number }[]
  topProducts: { productName: string; sales: number; units: number }[]
}

interface ComplianceData {
  overall: {
    status: 'COMPLIANT' | 'WARNING' | 'NON_COMPLIANT'
    score: number
    issues: string[]
  }
  inventory: {
    totalBatches: number
    expiringSoon: number
    expired: number
    quarantined: number
  }
  sales: {
    ageVerificationRate: number
    documentationRate: number
    complianceRate: number
  }
  reports: {
    submitted: number
    pending: number
    overdue: number
  }
}

export default function ReportsSystem() {
  const [reports, setReports] = useState<Report[]>([])
  const [salesData, setSalesData] = useState<SalesData | null>(null)
  const [complianceData, setComplianceData] = useState<ComplianceData | null>(null)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [reportDialog, setReportDialog] = useState(false)
  const [generateDialog, setGenerateDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [newReport, setNewReport] = useState({
    name: '',
    type: 'SALES',
    period: 'THIS_MONTH',
    format: 'PDF'
  })

  const reportTypes = [
    { value: 'SALES', label: 'Sales Report', icon: DollarSign },
    { value: 'INVENTORY', label: 'Inventory Report', icon: Package },
    { value: 'COMPLIANCE', label: 'Compliance Report', icon: FileText },
    { value: 'CUSTOMER', label: 'Customer Analytics', icon: Users },
    { value: 'FINANCIAL', label: 'Financial Summary', icon: BarChart3 },
    { value: 'DELIVERY', label: 'Delivery Performance', icon: Truck }
  ]

  const periods = [
    { value: 'TODAY', label: 'Today' },
    { value: 'THIS_WEEK', label: 'This Week' },
    { value: 'THIS_MONTH', label: 'This Month' },
    { value: 'THIS_QUARTER', label: 'This Quarter' },
    { value: 'THIS_YEAR', label: 'This Year' },
    { value: 'CUSTOM', label: 'Custom Range' }
  ]

  useEffect(() => {
    loadReports()
    loadSalesData()
    loadComplianceData()
  }, [])

  const loadReports = async () => {
    try {
      // Mock reports data
      const mockReports: Report[] = [
        {
          id: '1',
          name: 'Monthly Sales Report - January 2024',
          type: 'SALES',
          period: 'THIS_MONTH',
          generatedAt: new Date().toISOString(),
          status: 'READY',
          fileUrl: '/reports/sales-jan-2024.pdf'
        },
        {
          id: '2',
          name: 'Inventory Status Report',
          type: 'INVENTORY',
          period: 'THIS_WEEK',
          generatedAt: new Date(Date.now() - 86400000).toISOString(),
          status: 'READY',
          fileUrl: '/reports/inventory-week-4.pdf'
        },
        {
          id: '3',
          name: 'Health Canada Compliance - Q1 2024',
          type: 'COMPLIANCE',
          period: 'THIS_QUARTER',
          generatedAt: new Date(Date.now() - 172800000).toISOString(),
          status: 'READY',
          fileUrl: '/reports/compliance-q1-2024.pdf'
        }
      ]
      setReports(mockReports)
    } catch (error) {
      console.error('Failed to load reports:', error)
    }
  }

  const loadSalesData = async () => {
    try {
      const mockSalesData: SalesData = {
        total: 125000,
        byPeriod: {
          daily: [
            { date: '2024-01-01', sales: 3200 },
            { date: '2024-01-02', sales: 3800 },
            { date: '2024-01-03', sales: 4100 },
            { date: '2024-01-04', sales: 3500 },
            { date: '2024-01-05', sales: 4200 }
          ],
          weekly: [
            { week: 'Week 1', sales: 25000 },
            { week: 'Week 2', sales: 28000 },
            { week: 'Week 3', sales: 31000 },
            { week: 'Week 4', sales: 41000 }
          ],
          monthly: [
            { month: 'Jan', sales: 125000 },
            { month: 'Feb', sales: 118000 },
            { month: 'Mar', sales: 132000 }
          ]
        },
        byCategory: [
          { category: 'FLOWER', sales: 75000 },
          { category: 'EDIBLES', sales: 25000 },
          { category: 'CONCENTRATES', sales: 15000 },
          { category: 'VAPES', sales: 10000 }
        ],
        topProducts: [
          { productName: 'Blue Dream', sales: 25000, units: 714 },
          { productName: 'OG Kush', sales: 22000, units: 550 },
          { productName: 'Sour Diesel', sales: 18000, units: 450 },
          { productName: 'Granddaddy Purple', sales: 15000, units: 375 }
        ]
      }
      setSalesData(mockSalesData)
    } catch (error) {
      console.error('Failed to load sales data:', error)
    }
  }

  const loadComplianceData = async () => {
    try {
      const mockComplianceData: ComplianceData = {
        overall: {
          status: 'COMPLIANT',
          score: 92.5,
          issues: []
        },
        inventory: {
          totalBatches: 45,
          expiringSoon: 3,
          expired: 0,
          quarantined: 1
        },
        sales: {
          ageVerificationRate: 98.5,
          documentationRate: 95.2,
          complianceRate: 96.8
        },
        reports: {
          submitted: 12,
          pending: 2,
          overdue: 0
        }
      }
      setComplianceData(mockComplianceData)
    } catch (error) {
      console.error('Failed to load compliance data:', error)
    }
  }

  const generateReport = async () => {
    try {
      const report: Report = {
        id: Date.now().toString(),
        name: `${newReport.name} - ${newReport.period}`,
        type: newReport.type,
        period: newReport.period,
        generatedAt: new Date().toISOString(),
        status: 'GENERATING'
      }
      setReports([...reports, report])
      setGenerateDialog(false)
      
      // Simulate report generation
      setTimeout(() => {
        setReports(prev => prev.map(r => 
          r.id === report.id 
            ? { ...r, status: 'READY', fileUrl: `/reports/${report.id}.pdf` }
            : r
        ))
      }, 3000)
    } catch (error) {
      console.error('Failed to generate report:', error)
    }
  }

  const downloadReport = (report: Report) => {
    if (report.fileUrl) {
      window.open(report.fileUrl, '_blank')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'READY': return 'bg-green-100 text-green-800'
      case 'GENERATING': return 'bg-blue-100 text-blue-800'
      case 'FAILED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'COMPLIANT': return 'text-green-600'
      case 'WARNING': return 'text-yellow-600'
      case 'NON_COMPLIANT': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Generate reports, analyze data, and ensure compliance</p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
                  <FileText className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reports.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ready Reports</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {reports.filter(r => r.status === 'READY').length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {complianceData?.overall.score.toFixed(1) || '0'}%
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${salesData?.total.toLocaleString() || '0'}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Sales Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {salesData && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Total Sales</span>
                        <span className="font-semibold">${salesData.total.toLocaleString()}</span>
                      </div>
                      <div className="space-y-2">
                        {salesData.byCategory.map((category, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">{category.category}</span>
                            <span className="text-sm font-medium">${category.sales.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Recent Reports
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {reports.slice(0, 5).map(report => (
                      <div key={report.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-medium truncate">{report.name}</h4>
                            <Badge className={getStatusColor(report.status)}>
                              {report.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500">
                            {new Date(report.generatedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadReport(report)}
                          disabled={report.status !== 'READY'}
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Report Library</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setGenerateDialog(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search reports..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredReports.map(report => (
                    <div key={report.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{report.name}</h3>
                            <Badge className={getStatusColor(report.status)}>
                              {report.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            <p><strong>Type:</strong> {report.type}</p>
                            <p><strong>Period:</strong> {report.period}</p>
                            <p><strong>Generated:</strong> {new Date(report.generatedAt).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedReport(report)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadReport(report)}
                            disabled={report.status !== 'READY'}
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Sales Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {salesData && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Sales by Category</h4>
                        <div className="space-y-2">
                          {salesData.byCategory.map((category, index) => (
                            <div key={index} className="flex justify-between items-center">
                              <span className="text-sm">{category.category}</span>
                              <span className="text-sm font-medium">${category.sales.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Top Products</h4>
                        <div className="space-y-2">
                          {salesData.topProducts.map((product, index) => (
                            <div key={index} className="flex justify-between items-center">
                              <span className="text-sm">{product.productName}</span>
                              <span className="text-sm font-medium">${product.sales.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Revenue Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {salesData && (
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold">${salesData.total.toLocaleString()}</div>
                        <p className="text-sm text-gray-500">Total Revenue</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Monthly Trend</h4>
                        <div className="space-y-2">
                          {salesData.byPeriod.monthly.map((month, index) => (
                            <div key={index} className="flex justify-between items-center">
                              <span className="text-sm">{month.month}</span>
                              <span className="text-sm font-medium">${month.sales.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="compliance">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Compliance Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {complianceData && (
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className={`text-4xl font-bold ${getComplianceColor(complianceData.overall.status)}`}>
                          {complianceData.overall.score.toFixed(1)}%
                        </div>
                        <p className={`text-lg ${getComplianceColor(complianceData.overall.status)}`}>
                          {complianceData.overall.status.replace('_', ' ')}
                        </p>
                      </div>

                      {complianceData.overall.issues.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2 text-red-600">Issues Found</h4>
                          <ul className="space-y-1">
                            {complianceData.overall.issues.map((issue, index) => (
                              <li key={index} className="text-sm text-red-600">• {issue}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Compliance Details</CardTitle>
                </CardHeader>
                <CardContent>
                  {complianceData && (
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium mb-2">Inventory Compliance</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm text-gray-500">Total Batches</span>
                            <p className="font-medium">{complianceData.inventory.totalBatches}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Expiring Soon</span>
                            <p className="font-medium text-orange-600">{complianceData.inventory.expiringSoon}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Expired</span>
                            <p className="font-medium text-red-600">{complianceData.inventory.expired}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Quarantined</span>
                            <p className="font-medium text-yellow-600">{complianceData.inventory.quarantined}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Sales Compliance</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm text-gray-500">Age Verification</span>
                            <p className="font-medium">{complianceData.sales.ageVerificationRate}%</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Documentation</span>
                            <p className="font-medium">{complianceData.sales.documentationRate}%</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Overall Rate</span>
                            <p className="font-medium">{complianceData.sales.complianceRate}%</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Reporting Status</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm text-gray-500">Submitted</span>
                            <p className="font-medium">{complianceData.reports.submitted}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Pending</span>
                            <p className="font-medium text-orange-600">{complianceData.reports.pending}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Overdue</span>
                            <p className="font-medium text-red-600">{complianceData.reports.overdue}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Generate Report Dialog */}
        <Dialog open={generateDialog} onOpenChange={setGenerateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate New Report</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="report-name">Report Name</Label>
                  <Input
                    id="report-name"
                    value={newReport.name}
                    onChange={(e) => setNewReport(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter report name"
                  />
                </div>
                <div>
                  <Label htmlFor="report-type">Report Type</Label>
                  <Select value={newReport.type} onValueChange={(value) => setNewReport(prev => ({ ...prev, type: value }))}>
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="report-period">Period</Label>
                  <Select value={newReport.period} onValueChange={(value) => setNewReport(prev => ({ ...prev, period: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {periods.map(period => (
                        <SelectItem key={period.value} value={period.value}>
                          {period.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="report-format">Format</Label>
                  <Select value={newReport.format} onValueChange={(value) => setNewReport(prev => ({ ...prev, format: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PDF">PDF</SelectItem>
                      <SelectItem value="EXCEL">Excel</SelectItem>
                      <SelectItem value="CSV">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setGenerateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={generateReport} className="flex-1">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}