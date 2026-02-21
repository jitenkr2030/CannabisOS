'use client'

import { useState, useEffect } from 'react'
import { Search, Plus, Minus, AlertTriangle, Package, Clock, TrendingUp, Filter, Download, Eye, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface Product {
  id: string
  name: string
  sku: string
  category: string
  thcContent?: number
  cbdContent?: number
  price: number
  inventory: {
    id: string
    quantity: number
    available: number
    reserved: number
    reorderLevel: number
    maxStock?: number
    location?: string
    lastCounted?: string
    batch?: {
      batchNumber: string
      supplier: string
      expiryDate?: string
    }
  }[]
}

interface StockMovement {
  id: string
  type: string
  quantity: number
  reason: string
  createdAt: string
  user: {
    name: string
  }
  inventory: {
    product: {
      name: string
      sku: string
    }
  }
}

export default function InventorySystem() {
  const [products, setProducts] = useState<Product[]>([])
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [stockFilter, setStockFilter] = useState('ALL')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [adjustmentDialog, setAdjustmentDialog] = useState(false)
  const [adjustment, setAdjustment] = useState({
    type: 'ADJUSTMENT',
    quantity: '',
    reason: '',
    reference: ''
  })

  const loadInventory = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Failed to load inventory:', error)
    }
  }

  const loadStockMovements = async () => {
    try {
      // This would be a new API endpoint for stock movements
      // For now, we'll use mock data
      setStockMovements([
        {
          id: '1',
          type: 'SALE',
          quantity: -1,
          reason: 'Sale RCP-1001',
          createdAt: new Date().toISOString(),
          user: { name: 'John Doe' },
          inventory: {
            product: {
              name: 'Blue Dream',
              sku: 'BD-001'
            }
          }
        }
      ])
    } catch (error) {
      console.error('Failed to load stock movements:', error)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      await loadInventory()
      await loadStockMovements()
    }
    loadData()
  }, [])

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'ALL' || product.category === selectedCategory
    
    let matchesStock = true
    if (stockFilter === 'LOW') {
      matchesStock = product.inventory[0]?.available <= product.inventory[0]?.reorderLevel
    } else if (stockFilter === 'OUT') {
      matchesStock = product.inventory[0]?.available <= 0
    } else if (stockFilter === 'HIGH') {
      matchesStock = product.inventory[0]?.available > product.inventory[0]?.reorderLevel * 2
    }

    return matchesSearch && matchesCategory && matchesStock
  })

  // Get stock status
  const getStockStatus = (product: Product) => {
    const inventory = product.inventory[0]
    if (!inventory) return { status: 'unknown', color: 'gray', text: 'No Data' }

    if (inventory.available <= 0) {
      return { status: 'out', color: 'red', text: 'Out of Stock' }
    } else if (inventory.available <= inventory.reorderLevel) {
      return { status: 'low', color: 'orange', text: 'Low Stock' }
    } else if (inventory.available > inventory.reorderLevel * 2) {
      return { status: 'high', color: 'green', text: 'Well Stocked' }
    } else {
      return { status: 'normal', color: 'blue', text: 'In Stock' }
    }
  }

  // Calculate inventory statistics
  const stats = {
    totalProducts: products.length,
    lowStock: products.filter(p => p.inventory[0]?.available <= p.inventory[0]?.reorderLevel).length,
    outOfStock: products.filter(p => p.inventory[0]?.available <= 0).length,
    totalValue: products.reduce((sum, p) => sum + (p.inventory[0]?.available || 0) * p.price, 0)
  }

  // Process stock adjustment
  const processAdjustment = async () => {
    if (!selectedProduct || !adjustment.quantity || !adjustment.reason) {
      alert('Please fill in all required fields')
      return
    }

    try {
      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer demo-token'
        },
        body: JSON.stringify({
          productId: selectedProduct.id,
          quantity: parseFloat(adjustment.quantity),
          type: adjustment.type,
          reason: adjustment.reason,
          reference: adjustment.reference
        })
      })

      if (response.ok) {
        alert('Stock adjustment completed successfully!')
        setAdjustmentDialog(false)
        setAdjustment({ type: 'ADJUSTMENT', quantity: '', reason: '', reference: '' })
        setSelectedProduct(null)
        loadInventory()
        loadStockMovements()
      } else {
        alert('Failed to process adjustment')
      }
    } catch (error) {
      console.error('Adjustment error:', error)
      alert('Error processing adjustment')
    }
  }

  const categories = ['ALL', 'FLOWER', 'EDIBLES', 'CONCENTRATES', 'VAPES', 'TOPICALS', 'TINCTURES', 'ACCESSORIES', 'PRE_ROLLS']
  const stockFilters = ['ALL', 'LOW', 'OUT', 'HIGH']

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
              <p className="text-gray-600 mt-1">Track stock levels, batch information, and product movements</p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filter
              </Button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-sm border hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Products</CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.totalProducts}</div>
              <p className="text-xs text-gray-500">Active SKUs</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Low Stock Items</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.lowStock}</div>
              <p className="text-xs text-gray-500">Need reorder</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Out of Stock</CardTitle>
              <TrendingUp className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.outOfStock}</div>
              <p className="text-xs text-gray-500">Unavailable</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Inventory Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${stats.totalValue.toFixed(2)}</div>
              <p className="text-xs text-gray-500">Current value</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="inventory" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Inventory
            </TabsTrigger>
            <TabsTrigger value="movements" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Stock Movements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inventory">
            <Card className="bg-white shadow-sm border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Product Inventory
                </CardTitle>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={stockFilter} onValueChange={setStockFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Stock Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {stockFilters.map(filter => (
                        <SelectItem key={filter} value={filter}>
                          {filter === 'ALL' ? 'All Stock' : filter === 'LOW' ? 'Low Stock' : filter === 'OUT' ? 'Out of Stock' : 'High Stock'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Available</TableHead>
                        <TableHead>Reorder Level</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Batch Info</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map(product => {
                        const inventory = product.inventory[0]
                        const stockStatus = getStockStatus(product)
                        
                        return (
                          <TableRow key={product.id} className="hover:bg-gray-50">
                            <TableCell>
                              <div className="min-w-0">
                                <div className="font-medium text-gray-900">{product.name}</div>
                                {(product.thcContent || product.cbdContent) && (
                                  <div className="flex gap-2 text-xs mt-1">
                                    {product.thcContent && (
                                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800">
                                        THC: {product.thcContent}%
                                      </span>
                                    )}
                                    {product.cbdContent && (
                                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                                        CBD: {product.cbdContent}%
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="font-mono text-sm text-gray-500">{product.sku}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">{product.category}</Badge>
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                              <div className="flex items-center">
                                <span>{inventory?.quantity || 0}</span>
                                {inventory?.batch && (
                                  <span className="ml-2 text-xs text-gray-500">
                                    ({inventory.batch.batchNumber})
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                              <div className="flex items-center">
                                <span className={`font-medium ${
                                  inventory?.available <= 0 ? 'text-red-600' : 
                                  inventory?.available <= inventory?.reorderLevel ? 'text-orange-600' : 
                                  'text-green-600'
                                }`}>
                                  {inventory?.available || 0}
                                </span>
                                {inventory?.reserved > 0 && (
                                  <span className="ml-2 text-xs text-gray-500">
                                    ({inventory.reserved} reserved)
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="font-mono text-sm text-gray-500">{inventory?.reorderLevel || 0}</TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div>{inventory?.location || 'Main'}</div>
                                {inventory?.lastCounted && (
                                  <div className="text-xs text-gray-500">
                                    Counted: {new Date(inventory.lastCounted).toLocaleDateString()}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {inventory?.batch ? (
                                <div className="text-sm">
                                  <div className="font-medium">{inventory.batch.batchNumber}</div>
                                  <div className="text-xs text-gray-500">{inventory.batch.supplier}</div>
                                  {inventory.batch.expiryDate && (
                                    <div className={`text-xs ${
                                      new Date(inventory.batch.expiryDate) < new Date() 
                                        ? 'text-red-600' 
                                        : new Date(inventory.batch.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                                        ? 'text-orange-600' 
                                        : 'text-gray-500'
                                    }`}>
                                      Exp: {new Date(inventory.batch.expiryDate).toLocaleDateString()}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-sm text-gray-500">No batch</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={
                                  stockStatus.color === 'red' ? 'destructive' : 
                                  stockStatus.color === 'orange' ? 'default' : 
                                  'secondary'
                                }
                                className="text-xs"
                              >
                                {stockStatus.text}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-1 justify-end">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedProduct(product)
                                    setAdjustmentDialog(true)
                                  }}
                                  className="h-8 w-8 p-0"
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 w-8 p-0"
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="movements">
            <Card className="bg-white shadow-sm border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Recent Stock Movements
                </CardTitle>
                <p className="text-sm text-gray-600">Track all inventory changes and adjustments</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {stockMovements.map(movement => (
                    <div key={movement.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                            movement.type === 'PURCHASE' || movement.type === 'TRANSFER_IN' ? 'bg-green-500' :
                            movement.type === 'SALE' || movement.type === 'TRANSFER_OUT' ? 'bg-red-500' :
                            'bg-blue-500'
                          }`} />
                          <div>
                            <h4 className="font-medium text-gray-900 truncate">{movement.inventory.product.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {movement.type}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                {movement.reason}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(movement.createdAt).toLocaleString()} • {movement.user.name}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className={`font-bold text-lg ${
                          movement.quantity > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                        </p>
                        <p className="text-xs text-gray-500">{movement.user.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Stock Adjustment Dialog */}
        <Dialog open={adjustmentDialog} onOpenChange={setAdjustmentDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Stock Adjustment</DialogTitle>
            </DialogHeader>
            {selectedProduct && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium">{selectedProduct.name}</h3>
                  <p className="text-sm text-gray-600">SKU: {selectedProduct.sku}</p>
                  <div className="mt-2 flex justify-between">
                    <span className="text-sm text-gray-500">Current Stock:</span>
                    <span className="font-medium">{selectedProduct.inventory[0]?.available || 0}</span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="adjustment-type">Adjustment Type</Label>
                  <Select value={adjustment.type} onValueChange={(value) => setAdjustment(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PURCHASE">Purchase/Stock In</SelectItem>
                      <SelectItem value="SALE">Sale</SelectItem>
                      <SelectItem value="TRANSFER_IN">Transfer In</SelectItem>
                      <SelectItem value="TRANSFER_OUT">Transfer Out</SelectItem>
                      <SelectItem value="ADJUSTMENT">Manual Adjustment</SelectItem>
                      <SelectItem value="DAMAGE">Damage/Loss</SelectItem>
                      <SelectItem value="RETURN">Return</SelectItem>
                      <SelectItem value="EXPIRED">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="adjustment-quantity">Quantity</Label>
                  <Input
                    id="adjustment-quantity"
                    type="number"
                    step="0.01"
                    value={adjustment.quantity}
                    onChange={(e) => setAdjustment(prev => ({ ...prev, quantity: e.target.value }))}
                    placeholder="Enter quantity"
                  />
                </div>

                <div>
                  <Label htmlFor="adjustment-reason">Reason</Label>
                  <Textarea
                    id="adjustment-reason"
                    value={adjustment.reason}
                    onChange={(e) => setAdjustment(prev => ({ ...prev, reason: e.target.value }))}
                    placeholder="Reason for adjustment..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="adjustment-reference">Reference (Optional)</Label>
                  <Input
                    id="adjustment-reference"
                    value={adjustment.reference}
                    onChange={(e) => setAdjustment(prev => ({ ...prev, reference: e.target.value }))}
                    placeholder="Invoice number, order ID, etc."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={() => setAdjustmentDialog(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={processAdjustment} className="flex-1">
                    Process Adjustment
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}