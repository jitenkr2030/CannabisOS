'use client'

import { useState, useEffect } from 'react'
import { Search, Plus, Minus, X, CreditCard, DollarSign, Smartphone, User, Calendar, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

interface Product {
  id: string
  name: string
  sku: string
  category: string
  thcContent?: number
  cbdContent?: number
  price: number
  inventory: {
    quantity: number
    available: number
  }[]
}

interface CartItem {
  product: Product
  quantity: number
  total: number
}

export default function POSSystem() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: ''
  })
  const [paymentMethod, setPaymentMethod] = useState('CASH')
  const [isProcessing, setIsProcessing] = useState(false)
  const [ageVerified, setAgeVerified] = useState(false)

  // Load products
  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Failed to load products:', error)
    }
  }

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'ALL' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Cart operations
  const addToCart = (product: Product) => {
    if (product.inventory[0]?.available <= 0) {
      alert('Product is out of stock!')
      return
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id)
      if (existingItem) {
        if (existingItem.quantity >= product.inventory[0]?.available) {
          alert('Not enough stock available!')
          return prevCart
        }
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * product.price }
            : item
        )
      }
      return [...prevCart, { product, quantity: 1, total: product.price }]
    })
  }

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.product.id === productId) {
          const newQuantity = item.quantity + delta
          if (newQuantity <= 0) return item
          if (newQuantity > item.product.inventory[0]?.available) {
            alert('Not enough stock available!')
            return item
          }
          return { ...item, quantity: newQuantity, total: newQuantity * item.product.price }
        }
        return item
      }).filter(item => item.quantity > 0)
    })
  }

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId))
  }

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.total, 0)
  const tax = subtotal * 0.13 // 13% HST for Ontario
  const discount = 0
  const total = subtotal + tax - discount

  // Process sale
  const processSale = async () => {
    if (cart.length === 0) {
      alert('Cart is empty!')
      return
    }

    if (!ageVerified) {
      alert('Age verification is required!')
      return
    }

    setIsProcessing(true)

    try {
      const saleData = {
        customerName: customerInfo.name || undefined,
        customerPhone: customerInfo.phone || undefined,
        customerEmail: customerInfo.email || undefined,
        subtotal,
        tax,
        discount,
        total,
        paymentMethod,
        ageVerified,
        verifiedBy: 'Current User',
        notes: '',
        items: cart.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          unitPrice: item.product.price,
          total: item.total
        }))
      }

      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer demo-token' // In real app, use actual JWT
        },
        body: JSON.stringify(saleData)
      })

      if (response.ok) {
        alert('Sale completed successfully!')
        setCart([])
        setCustomerInfo({ name: '', phone: '', email: '' })
        setAgeVerified(false)
        loadProducts() // Refresh inventory
      } else {
        alert('Failed to process sale')
      }
    } catch (error) {
      console.error('Sale processing error:', error)
      alert('Error processing sale')
    } finally {
      setIsProcessing(false)
    }
  }

  const categories = ['ALL', 'FLOWER', 'EDIBLES', 'CONCENTRATES', 'VAPES', 'TOPICALS', 'TINCTURES', 'ACCESSORIES', 'PRE_ROLLS']

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Point of Sale</h1>
              <p className="text-gray-600 mt-1">Process sales and manage customer transactions</p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-2">
              <Badge variant="outline" className="text-green-600 border-green-600">
                Active
              </Badge>
              <Button variant="outline" size="sm">
                <CreditCard className="h-4 w-4 mr-2" />
                Payment Settings
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 xl:gap-8">
          {/* Product Catalog */}
          <div className="xl:col-span-2 space-y-6">
            {/* Search and Filters */}
            <Card className="bg-white shadow-sm border">
              <CardHeader className="pb-4">
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
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.map(product => (
                    <Card key={product.id} className="group hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-200 hover:border-green-300">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-sm leading-tight">{product.name}</h3>
                            <Badge variant="outline" className="text-xs mt-1">
                              {product.category}
                            </Badge>
                          </div>
                          {product.inventory[0]?.available <= 5 && (
                            <AlertTriangle className="h-4 w-4 text-orange-500 flex-shrink-0 ml-2" />
                          )}
                        </div>
                        
                        <div className="text-xs text-gray-500 mb-3">
                          SKU: {product.sku}
                        </div>

                        {(product.thcContent || product.cbdContent) && (
                          <div className="flex gap-2 mb-3">
                            {product.thcContent && (
                              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                                THC: {product.thcContent}%
                              </span>
                            )}
                            {product.cbdContent && (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                CBD: {product.cbdContent}%
                              </span>
                            )}
                          </div>
                        )}

                        <div className="flex justify-between items-center mb-3">
                          <span className="font-bold text-lg text-gray-900">${product.price.toFixed(2)}</span>
                          <div className="text-right">
                            <div className="text-xs text-gray-500">
                              Stock: {product.inventory[0]?.available || 0}
                            </div>
                            <div className="text-xs text-gray-400">
                              {product.inventory[0]?.quantity || 0} total
                            </div>
                          </div>
                        </div>

                        <Button
                          size="sm"
                          className="w-full group-hover:bg-green-600 transition-colors"
                          onClick={() => addToCart(product)}
                          disabled={product.inventory[0]?.available <= 0}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
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
          </div>

          {/* Cart and Checkout */}
          <div className="space-y-6">
            {/* Cart */}
            <Card className="bg-white shadow-sm border">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <div className="flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Shopping Cart
                  </div>
                  {cart.length > 0 && (
                    <Badge variant="secondary">{cart.length} items</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Cart is empty</h3>
                    <p className="text-gray-500">Add products to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {cart.map(item => (
                        <div key={item.product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm text-gray-900 truncate">{item.product.name}</h4>
                            <p className="text-xs text-gray-500">${item.product.price.toFixed(2)} each</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.product.id, -1)}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.product.id, 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeFromCart(item.product.id)}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium">${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tax (13%):</span>
                        <span className="font-medium">${tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Discount:</span>
                        <span className="font-medium text-red-600">-${discount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold pt-2 border-t">
                        <span>Total:</span>
                        <span className="text-green-600">${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Customer Info */}
            <Card className="bg-white shadow-sm border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customer-name">Name</Label>
                    <Input
                      id="customer-name"
                      placeholder="Customer name (optional)"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="customer-phone">Phone</Label>
                    <Input
                      id="customer-phone"
                      placeholder="Phone number (optional)"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="customer-email">Email</Label>
                  <Input
                    id="customer-email"
                    type="email"
                    placeholder="Email address (optional)"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>

                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="age-verified"
                      checked={ageVerified}
                      onChange={(e) => setAgeVerified(e.target.checked)}
                      className="mt-1 rounded border-orange-300 text-orange-600 focus:ring-orange-500"
                    />
                    <div className="flex-1">
                      <Label htmlFor="age-verified" className="text-sm font-medium text-gray-900">
                        Customer age verified (19+)
                      </Label>
                      <p className="text-xs text-gray-600 mt-1">
                        Required by law for all cannabis purchases
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment */}
            <Card className="bg-white shadow-sm border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs value={paymentMethod} onValueChange={setPaymentMethod}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="CASH" className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Cash
                    </TabsTrigger>
                    <TabsTrigger value="DEBIT" className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Debit
                    </TabsTrigger>
                    <TabsTrigger value="CREDIT" className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Credit
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={processSale}
                  disabled={cart.length === 0 || !ageVerified || isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <DollarSign className="h-4 w-4 mr-2" />
                      Complete Sale - ${total.toFixed(2)}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}