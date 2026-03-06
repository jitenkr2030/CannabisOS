'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter,
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Package,
  ShoppingCart,
  CheckCircle,
  AlertTriangle,
  Eye,
  Loader2
} from 'lucide-react'

interface ReportGeneratorProps {
  className?: string
}

interface ReportData {
  reportType: string
  period: {
    start: string
    end: string
  }
  summary: any
  breakdown?: any
  details?: any
}

export default function ReportGenerator({ className }: ReportGeneratorProps) {
  const [reportType, setReportType] = useState('sales')
  const [period, setPeriod] = useState('month')
  const [format, setFormat] = useState('json')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  const reportTypes = [
    {
      value: 'sales',
      label: 'Sales Report',
      description: 'Comprehensive sales analysis and revenue tracking',
      icon: <DollarSign className="h-5 w-5" />,
      color: 'text-green-600'
    },
    {
      value: 'inventory',
      label: 'Inventory Report',
      description: 'Stock levels, product analysis, and inventory metrics',
      icon: <Package className="h-5 w-5" />,
      color: 'text-blue-600'
    },
    {
      value: 'customers',
      label: 'Customer Report',
      description: 'Customer analytics, segmentation, and retention metrics',
      icon: <Users className="h-5 w-5" />,
      color: 'text-purple-600'
    },
    {
      value: 'staff',
      label: 'Staff Performance',
      description: 'Employee productivity, sales metrics, and performance analysis',
      icon: <BarChart3 className="h-5 w-5" />,
      color: 'text-orange-600'
    },
    {
      value: 'financial',
      label: 'Financial Report',
      description: 'Revenue, expenses, profit margins, and financial analysis',
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'text-red-600'
    },
    {
      value: 'compliance',
      label: 'Compliance Report',
      description: 'Regulatory compliance, audit logs, and legal requirements',
      icon: <CheckCircle className="h-5 w-5" />,
      color: 'text-indigo-600'
    }
  ]

  const periods = [
    { value: 'day', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ]

  const exportFormats = [
    { value: 'json', label: 'JSON', description: 'Machine-readable format' },
    { value: 'csv', label: 'CSV', description: 'Excel-compatible spreadsheet' },
    { value: 'excel', label: 'Excel', description: 'Microsoft Excel format' },
    { value: 'pdf', label: 'PDF', description: 'Printable document format' }
  ]

  const generateReport = async (previewOnly = false) => {
    try {
      setLoading(true)
      
      const params = new URLSearchParams({
        type: reportType,
        period: period === 'custom' ? 'custom' : period,
        format: previewOnly ? 'json' : format
      })

      if (period === 'custom' && startDate && endDate) {
        params.append('startDate', startDate)
        params.append('endDate', endDate)
      }

      const response = await fetch(`/api/reports?${params}`)
      
      if (previewOnly) {
        const data = await response.json()
        setReportData(data)
        setShowPreview(true)
      } else {
        // Handle file download
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        
        const contentDisposition = response.headers.get('content-disposition')
        let filename = `${reportType}-report-${new Date().toISOString().split('T')[0]}`
        
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="?([^"]+)?"/)
          if (filenameMatch) {
            filename = filenameMatch[1]
          }
        }
        
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Failed to generate report:', error)
    } finally {
      setLoading(false)
    }
  }

  const getReportIcon = (type: string) => {
    const report = reportTypes.find(r => r.value === type)
    return report?.icon || <FileText className="h-5 w-5" />
  }

  const getReportColor = (type: string) => {
    const report = reportTypes.find(r => r.value === type)
    return report?.color || 'text-gray-600'
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Report Generator
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Report Type Selection */}
          <div>
            <Label className="text-base font-medium">Select Report Type</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
              {reportTypes.map((report) => (
                <div
                  key={report.value}
                  className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    reportType === report.value 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setReportType(report.value)}
                >
                  <div className="flex items-start gap-3">
                    <div className={report.color}>
                      {report.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{report.label}</h3>
                      <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Period Selection */}
          <div>
            <Label className="text-base font-medium">Select Period</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mt-2">
              {periods.map((periodOption) => (
                <Button
                  key={periodOption.value}
                  variant={period === periodOption.value ? 'default' : 'outline'}
                  className="justify-start"
                  onClick={() => setPeriod(periodOption.value)}
                >
                  {periodOption.label}
                </Button>
              ))}
            </div>

            {/* Custom Date Range */}
            {period === 'custom' && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="end-date">End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Export Format Selection */}
          <div>
            <Label className="text-base font-medium">Export Format</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
              {exportFormats.map((formatOption) => (
                <Button
                  key={formatOption.value}
                  variant={format === formatOption.value ? 'default' : 'outline'}
                  className="justify-start"
                  onClick={() => setFormat(formatOption.value)}
                >
                  {formatOption.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={() => generateReport(true)}
              variant="outline"
              disabled={loading}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview Report
            </Button>
            <Button
              onClick={() => generateReport(false)}
              disabled={loading || (period === 'custom' && (!startDate || !endDate))}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Generate & Download
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Preview */}
      {showPreview && reportData && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {getReportIcon(reportData.reportType)}
                Report Preview: {reportTypes.find(r => r.value === reportData.reportType)?.label}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(false)}
              >
                ✕
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-6">
              {/* Report Period */}
              <div>
                <Label className="text-sm font-medium text-gray-600">Report Period</Label>
                <p className="text-sm">
                  {new Date(reportData.period.start).toLocaleDateString()} - {new Date(reportData.period.end).toLocaleDateString()}
                </p>
              </div>

              {/* Summary Metrics */}
              <div>
                <Label className="text-sm font-medium text-gray-600">Summary</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                  {Object.entries(reportData.summary).map(([key, value]) => (
                    <div key={key} className="p-3 border rounded">
                      <div className="text-xs text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                      <div className="text-lg font-semibold">
                        {typeof value === 'number' ? (
                          key.toLowerCase().includes('revenue') || key.toLowerCase().includes('profit') || key.toLowerCase().includes('amount') || key.toLowerCase().includes('value') 
                            ? formatCurrency(value as number)
                            : formatNumber(value as number)
                        ) : (
                          <span>{String(value)}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Data */}
              {reportData.details && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Sample Data</Label>
                  <div className="mt-2 border rounded-lg overflow-hidden">
                    <div className="max-h-64 overflow-y-auto">
                      {Array.isArray(reportData.details) ? (
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              {Object.keys(reportData.details[0] || {}).map((key) => (
                                <th key={key} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                  {key}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {reportData.details.slice(0, 5).map((item: any, index: number) => (
                              <tr key={index} className="border-t">
                                {Object.values(item).map((value: any, cellIndex: number) => (
                                  <td key={cellIndex} className="px-4 py-2">
                                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <pre className="p-4 text-xs overflow-x-auto">
                          {JSON.stringify(reportData.details, null, 2)}
                        </pre>
                      )}
                    </div>
                    {Array.isArray(reportData.details) && reportData.details.length > 5 && (
                      <div className="p-2 text-center text-sm text-gray-500 border-t">
                        Showing 5 of {reportData.details.length} records
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Export Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={() => generateReport(false)}
                  disabled={loading}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download {format.toUpperCase()}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowPreview(false)}
                >
                  Close Preview
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}