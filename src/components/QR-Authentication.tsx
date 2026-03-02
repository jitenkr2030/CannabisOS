'use client'

import { useState, useEffect } from 'react'
import { Search, QrCode, Plus, Eye, Download, Smartphone, CheckCircle, AlertCircle, Copy, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface QRCode {
  id: string
  code: string
  productId: string
  isActive: boolean
  createdAt: string
  scannedAt?: string
  scanCount: number
  product: {
    name: string
    sku: string
    category: string
    thcContent?: number
    cbdContent?: number
    price: number
  }
}

export default function QRAuthentication() {
  const [qrCodes, setQrCodes] = useState<QRCode[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selectedQR, setSelectedQR] = useState<QRCode | null>(null)
  const [generateDialog, setGenerateDialog] = useState(false)
  const [newQR, setNewQR] = useState({
    productId: '',
    batchId: ''
  })

  useEffect(() => {
    loadQRCodes()
  }, [])

  const loadQRCodes = async () => {
    try {
      // Mock data for now
      const mockQRCodes: QRCode[] = [
        {
          id: '1',
          code: 'QR-001-BLUE-DREAM',
          productId: '1',
          isActive: true,
          createdAt: new Date().toISOString(),
          scanCount: 15,
          product: {
            name: 'Blue Dream',
            sku: 'BD-001',
            category: 'FLOWER',
            thcContent: 18.5,
            cbdContent: 0.2,
            price: 35.00
          }
        },
        {
          id: '2',
          code: 'QR-002-OG-KUSH',
          productId: '2',
          isActive: true,
          createdAt: new Date().toISOString(),
          scanCount: 8,
          product: {
            name: 'OG Kush',
            sku: 'OGK-001',
            category: 'FLOWER',
            thcContent: 22.0,
            cbdContent: 0.1,
            price: 40.00
          }
        }
      ]
      setQrCodes(mockQRCodes)
    } catch (error) {
      console.error('Failed to load QR codes:', error)
    }
  }

  const generateQRCode = async () => {
    try {
      const newQRCode: QRCode = {
        id: Date.now().toString(),
        code: `QR-${Date.now()}`,
        productId: newQR.productId,
        isActive: true,
        createdAt: new Date().toISOString(),
        scanCount: 0,
        product: {
          name: 'Product Name',
          sku: 'SKU-001',
          category: 'FLOWER',
          thcContent: 20.0,
          cbdContent: 0.5,
          price: 35.00
        }
      }
      setQrCodes([...qrCodes, newQRCode])
      setGenerateDialog(false)
      setNewQR({ productId: '', batchId: '' })
    } catch (error) {
      console.error('Failed to generate QR code:', error)
    }
  }

  const deactivateQRCode = async (qrId: string) => {
    try {
      setQrCodes(qrCodes.map(qr => 
        qr.id === qrId ? { ...qr, isActive: false } : qr
      ))
    } catch (error) {
      console.error('Failed to deactivate QR code:', error)
    }
  }

  const reactivateQRCode = async (qrId: string) => {
    try {
      setQrCodes(qrCodes.map(qr => 
        qr.id === qrId ? { ...qr, isActive: true } : qr
      ))
    } catch (error) {
      console.error('Failed to reactivate QR code:', error)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const downloadQRCode = (qrCode: QRCode) => {
    // Mock QR code download
    const canvas = document.createElement('canvas')
    canvas.width = 200
    canvas.height = 200
    const ctx = canvas.getContext('2d')
    
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, 200, 200)
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(10, 10, 180, 180)
    
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `qrcode-${qrCode.code}.png`
      a.click()
      URL.revokeObjectURL(url)
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'ASSIGNED': return 'bg-blue-100 text-blue-800'
      case 'OUT_FOR_DELIVERY': return 'bg-purple-100 text-purple-800'
      case 'DELIVERED': return 'bg-green-100 text-green-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const statusFilters = ['ALL', 'ACTIVE', 'INACTIVE']
  const filteredQRCodes = qrCodes.filter(qr => {
    const matchesSearch = qr.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         qr.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         qr.product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || 
                         (statusFilter === 'ACTIVE' && qr.isActive) ||
                         (statusFilter === 'INACTIVE' && !qr.isActive)
    return matchesSearch && matchesStatus
  })

  const totalScans = qrCodes.reduce((sum, qr) => sum + qr.scanCount, 0)
  const activeQRCodes = qrCodes.filter(qr => qr.isActive).length

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">QR Authentication</h1>
          <p className="text-gray-600">Generate QR codes for product authentication and track scan activity</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total QR Codes</CardTitle>
              <QrCode className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{qrCodes.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active QR Codes</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeQRCodes}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
              <Smartphone className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalScans}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scan Rate</CardTitle>
              <RefreshCw className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {qrCodes.length > 0 ? (totalScans / qrCodes.length).toFixed(1) : '0'}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="qrcodes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="qrcodes">QR Codes</TabsTrigger>
            <TabsTrigger value="scans">Scan Activity</TabsTrigger>
            <TabsTrigger value="generate">Generate</TabsTrigger>
          </TabsList>

          <TabsContent value="qrcodes">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Product QR Codes</CardTitle>
                  <Button variant="outline" onClick={() => setGenerateDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Generate QR
                  </Button>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search QR codes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusFilters.map(filter => (
                        <SelectItem key={filter} value={filter}>
                          {filter}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredQRCodes.map(qr => (
                    <div key={qr.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{qr.code}</h3>
                            <Badge variant={qr.isActive ? "default" : "secondary"}>
                              {qr.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            <p><strong>Product:</strong> {qr.product.name}</p>
                            <p><strong>SKU:</strong> {qr.product.sku}</p>
                            <p><strong>Category:</strong> {qr.product.category}</p>
                            {(qr.product.thcContent || qr.product.cbdContent) && (
                              <p>
                                <strong>Cannabinoids:</strong> 
                                {qr.product.thcContent && ` THC: ${qr.product.thcContent}%`}
                                {qr.product.thcContent && qr.product.cbdContent && ' • '}
                                {qr.product.cbdContent && ` CBD: ${qr.product.cbdContent}%`}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedQR(qr)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadQRCode(qr)}
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(qr.code)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          {qr.isActive ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deactivateQRCode(qr.id)}
                            >
                              <AlertCircle className="h-3 w-3" />
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => reactivateQRCode(qr.id)}
                            >
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Scans:</span>
                          <p>{qr.scanCount}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Created:</span>
                          <p>{new Date(qr.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Last Scan:</span>
                          <p>{qr.scannedAt ? new Date(qr.scannedAt).toLocaleDateString() : 'Never'}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Price:</span>
                          <p>${qr.product.price.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scans">
            <Card>
              <CardHeader>
                <CardTitle>Scan Activity</CardTitle>
                <p className="text-sm text-gray-600">Recent QR code scans and authentication attempts</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-center text-gray-500">Scan activity will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="generate">
            <Card>
              <CardHeader>
                <CardTitle>Generate QR Code</CardTitle>
                <p className="text-sm text-gray-600">Create a new QR code for product authentication</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="product-select">Select Product</Label>
                    <Select value={newQR.productId} onValueChange={(value) => setNewQR(prev => ({ ...prev, productId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose product" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Blue Dream</SelectItem>
                        <SelectItem value="2">OG Kush</SelectItem>
                        <SelectItem value="3">Sour Diesel</SelectItem>
                        <SelectItem value="4">Granddaddy Purple</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={generateQRCode} className="w-full">
                  <QrCode className="h-4 w-4 mr-2" />
                  Generate QR Code
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* QR Code Details Dialog */}
        <Dialog open={!!selectedQR} onOpenChange={() => setSelectedQR(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>QR Code Details - {selectedQR?.code}</DialogTitle>
            </DialogHeader>
            {selectedQR && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Product Name</Label>
                    <p className="font-medium">{selectedQR.product.name}</p>
                  </div>
                  <div>
                    <Label>SKU</Label>
                    <p className="font-medium">{selectedQR.product.sku}</p>
                  </div>
                  <div>
                    <Label>Category</Label>
                    <p className="font-medium">{selectedQR.product.category}</p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Badge variant={selectedQR.isActive ? "default" : "secondary"}>
                      {selectedQR.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-500">THC:</span>
                    <p className="font-medium">{selectedQR.product.thcContent}%</p>
                  </div>
                  <div>
                    <span className="text-gray-500">CBD:</span>
                    <p className="font-medium">{selectedQR.product.cbdContent}%</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Price:</span>
                    <p className="font-medium">${selectedQR.product.price.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Scans:</span>
                    <p className="font-medium">{selectedQR.scanCount}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => downloadQRCode(selectedQR)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download QR
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(selectedQR.code)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Code
                  </Button>
                  {selectedQR.isActive ? (
                    <Button
                      variant="destructive"
                      onClick={() => deactivateQRCode(selectedQR.id)}
                    >
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Deactivate
                    </Button>
                  ) : (
                    <Button
                      onClick={() => reactivateQRCode(selectedQR.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Reactivate
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Generate QR Dialog */}
        <Dialog open={generateDialog} onOpenChange={setGenerateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate New QR Code</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="product-select">Select Product</Label>
                <Select value={newQR.productId} onValueChange={(value) => setNewQR(prev => ({ ...prev, productId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Blue Dream</SelectItem>
                    <SelectItem value="2">OG Kush</SelectItem>
                    <SelectItem value="3">Sour Diesel</SelectItem>
                    <SelectItem value="4">Granddaddy Purple</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setGenerateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={generateQRCode} className="flex-1">
                  <QrCode className="h-4 w-4 mr-2" />
                  Generate
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}