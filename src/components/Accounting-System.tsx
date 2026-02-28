'use client'

import { useState, useEffect } from 'react'
import { Search, Plus, TrendingUp, TrendingDown, DollarSign, Calendar, Filter, Download, Edit, Trash2, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'

interface Expense {
  id: string
  description: string
  amount: number
  category: string
  date: string
  notes?: string
  isRecurring: boolean
  recurringInterval?: string
  receiptUrl?: string
  user: {
    name: string
    email: string
  }
}

interface ProfitLoss {
  revenue: number
  expenses: number
  profit: number
  profitMargin: number
}

export default function AccountingSystem() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [dateFilter, setDateFilter] = useState('THIS_MONTH')
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: 'OTHER',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    isRecurring: false,
    recurringInterval: 'monthly'
  })
  const [profitLoss, setProfitLoss] = useState<ProfitLoss>({
    revenue: 0,
    expenses: 0,
    profit: 0,
    profitMargin: 0
  })
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)

  const getDateRange = (filter: string) => {
    const today = new Date()
    let from = new Date()
    let to = new Date()

    switch (filter) {
      case 'TODAY':
        from.setHours(0, 0, 0, 0)
        to.setHours(23, 59, 59, 999)
        break
      case 'THIS_WEEK':
        from.setDate(today.getDate() - today.getDay())
        to.setDate(today.getDate() - today.getDay() + 6)
        break
      case 'THIS_MONTH':
        from.setDate(1)
        to.setMonth(today.getMonth() + 1, 0)
        break
      case 'THIS_QUARTER':
        const quarter = Math.floor(today.getMonth() / 3)
        from.setMonth(quarter * 3, 1)
        to.setMonth((quarter + 1) * 3, 0)
        break
      case 'THIS_YEAR':
        from.setMonth(0, 1)
        to.setMonth(11, 31)
        break
    }

    return {
      from: from.toISOString().split('T')[0],
      to: to.toISOString().split('T')[0]
    }
  }

  const loadExpenses = async () => {
    try {
      const params = new URLSearchParams()
      if (selectedCategory !== 'ALL') params.append('category', selectedCategory)
      if (dateFilter !== 'ALL') {
        const dates = getDateRange(dateFilter)
        params.append('dateFrom', dates.from)
        params.append('dateTo', dates.to)
      }

      const response = await fetch(`/api/expenses?${params}`)
      const data = await response.json()
      setExpenses(data.expenses || [])
    } catch (error) {
      console.error('Failed to load expenses:', error)
    }
  }

  const loadProfitLoss = async () => {
    // Calculate profit/loss from sales and expenses
    try {
      const dates = getDateRange(dateFilter)
      
      // Load sales data
      const salesResponse = await fetch(`/api/sales?dateFrom=${dates.from}&dateTo=${dates.to}`)
      const salesData = await salesResponse.json()
      const revenue = salesData.sales?.reduce((sum: number, sale: any) => sum + sale.total, 0) || 0

      // Load expenses data
      const expensesResponse = await fetch(`/api/expenses?dateFrom=${dates.from}&dateTo=${dates.to}`)
      const expensesData = await expensesResponse.json()
      const expenses = expensesData.expenses?.reduce((sum: number, expense: any) => sum + expense.amount, 0) || 0

      const profit = revenue - expenses
      const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0

      setProfitLoss({
        revenue,
        expenses,
        profit,
        profitMargin
      })
    } catch (error) {
      console.error('Failed to load profit/loss:', error)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      await loadExpenses()
      await loadProfitLoss()
    }
    loadData()
  }, [dateFilter, selectedCategory])

  const addExpense = async () => {
    try {
      const expenseData = {
        ...newExpense,
        amount: parseFloat(newExpense.amount)
      }

      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer demo-token'
        },
        body: JSON.stringify(expenseData)
      })

      if (response.ok) {
        setNewExpense({
          description: '',
          amount: '',
          category: 'OTHER',
          date: new Date().toISOString().split('T')[0],
          notes: '',
          isRecurring: false,
          recurringInterval: 'monthly'
        })
        setAddDialogOpen(false)
        loadExpenses()
        loadProfitLoss()
      }
    } catch (error) {
      console.error('Failed to add expense:', error)
    }
  }

  const updateExpense = async () => {
    if (!editingExpense) return

    try {
      const expenseData = {
        ...newExpense,
        amount: parseFloat(newExpense.amount)
      }

      const response = await fetch(`/api/expenses/${editingExpense.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer demo-token'
        },
        body: JSON.stringify(expenseData)
      })

      if (response.ok) {
        setEditingExpense(null)
        setNewExpense({
          description: '',
          amount: '',
          category: 'OTHER',
          date: new Date().toISOString().split('T')[0],
          notes: '',
          isRecurring: false,
          recurringInterval: 'monthly'
        })
        setAddDialogOpen(false)
        loadExpenses()
        loadProfitLoss()
      }
    } catch (error) {
      console.error('Failed to update expense:', error)
    }
  }

  const deleteExpense = async (expenseId: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return

    try {
      const response = await fetch(`/api/expenses/${expenseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer demo-token'
        }
      })

      if (response.ok) {
        loadExpenses()
        loadProfitLoss()
      }
    } catch (error) {
      console.error('Failed to delete expense:', error)
    }
  }

  const exportExpenses = () => {
    const csvContent = [
      ['Date', 'Description', 'Category', 'Amount', 'Recurring', 'Notes'],
      ...filteredExpenses.map(expense => [
        expense.date,
        expense.description,
        expense.category,
        expense.amount.toString(),
        expense.isRecurring ? 'Yes' : 'No',
        expense.notes || ''
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `expenses-${dateFilter}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const openEditDialog = (expense: Expense) => {
    setEditingExpense(expense)
    setNewExpense({
      description: expense.description,
      amount: expense.amount.toString(),
      category: expense.category,
      date: expense.date,
      notes: expense.notes || '',
      isRecurring: expense.isRecurring,
      recurringInterval: expense.recurringInterval || 'monthly'
    })
    setAddDialogOpen(true)
  }

  const categories = ['ALL', 'RENT', 'UTILITIES', 'SALARY', 'MARKETING', 'SUPPLIES', 'INVENTORY', 'EQUIPMENT', 'INSURANCE', 'LEGAL', 'MAINTENANCE', 'TRANSPORT', 'TAXES', 'OTHER']
  const dateFilters = ['TODAY', 'THIS_WEEK', 'THIS_MONTH', 'THIS_QUARTER', 'THIS_YEAR']

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'ALL' || expense.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Accounting System</h1>
          <p className="text-gray-600">Manage expenses, track profit & loss, and generate financial reports</p>
        </div>

        {/* Profit & Loss Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${profitLoss.revenue.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${profitLoss.expenses.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profit</CardTitle>
              <DollarSign className={`h-4 w-4 ${profitLoss.profit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${profitLoss.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${profitLoss.profit.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
              <TrendingUp className={`h-4 w-4 ${profitLoss.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${profitLoss.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {profitLoss.profitMargin.toFixed(1)}%
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="expenses" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="expenses">Expense Management</TabsTrigger>
            <TabsTrigger value="add">Add Expense</TabsTrigger>
            <TabsTrigger value="reports">Financial Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="expenses">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Expense History</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={exportExpenses}>
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                    <Button onClick={() => setAddDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Expense
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search expenses..."
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
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Date Range" />
                    </SelectTrigger>
                    <SelectContent>
                      {dateFilters.map(filter => (
                        <SelectItem key={filter} value={filter}>
                          {filter.replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredExpenses.map(expense => (
                    <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{expense.description}</h4>
                        <p className="text-sm text-gray-500">
                          {expense.category} • {new Date(expense.date).toLocaleDateString()}
                        </p>
                        {expense.isRecurring && (
                          <Badge variant="secondary" className="mt-1">Recurring</Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">${expense.amount.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">{expense.user.name}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(expense)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteExpense(expense.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add">
            <Card>
              <CardHeader>
                <CardTitle>Add New Expense</CardTitle>
                <p className="text-sm text-gray-600">Enter expense details to track your business costs</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={newExpense.description}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Expense description"
                    />
                  </div>
                  <div>
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={newExpense.category} onValueChange={(value) => setNewExpense(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.filter(cat => cat !== 'ALL').map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newExpense.date}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={newExpense.notes}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes..."
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="recurring"
                    checked={newExpense.isRecurring}
                    onCheckedChange={(checked) => setNewExpense(prev => ({ ...prev, isRecurring: checked }))}
                  />
                  <Label htmlFor="recurring">Recurring Expense</Label>
                </div>

                {newExpense.isRecurring && (
                  <div>
                    <Label htmlFor="recurring-interval">Recurring Interval</Label>
                    <Select value={newExpense.recurringInterval} onValueChange={(value) => setNewExpense(prev => ({ ...prev, recurringInterval: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Button onClick={editingExpense ? updateExpense : addExpense} className="w-full">
                  {editingExpense ? 'Update Expense' : 'Add Expense'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Expense Summary by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {categories.filter(cat => cat !== 'ALL').map(category => {
                      const categoryExpenses = expenses.filter(e => e.category === category)
                      const total = categoryExpenses.reduce((sum, e) => sum + e.amount, 0)
                      const percentage = profitLoss.expenses > 0 ? (total / profitLoss.expenses) * 100 : 0
                      
                      return (
                        <div key={category} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <div>
                            <div className="font-medium">{category}</div>
                            <div className="text-sm text-gray-500">{categoryExpenses.length} expenses</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">${total.toFixed(2)}</div>
                            <div className="text-sm text-gray-500">{percentage.toFixed(1)}%</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Financial Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                    <div>
                      <div className="font-medium text-green-800">Total Revenue</div>
                      <div className="text-sm text-green-600">Sales income</div>
                    </div>
                    <div className="text-xl font-bold text-green-800">
                      ${profitLoss.revenue.toFixed(2)}
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                    <div>
                      <div className="font-medium text-red-800">Total Expenses</div>
                      <div className="text-sm text-red-600">Business costs</div>
                    </div>
                    <div className="text-xl font-bold text-red-800">
                      ${profitLoss.expenses.toFixed(2)}
                    </div>
                  </div>

                  <div className={`flex justify-between items-center p-3 rounded ${profitLoss.profit >= 0 ? 'bg-blue-50' : 'bg-orange-50'}`}>
                    <div>
                      <div className={`font-medium ${profitLoss.profit >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>
                        Net Profit
                      </div>
                      <div className="text-sm text-gray-600">
                        {profitLoss.profit >= 0 ? 'Profitable' : 'Loss'}
                      </div>
                    </div>
                    <div className={`text-xl font-bold ${profitLoss.profit >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>
                      ${profitLoss.profit.toFixed(2)}
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                    <div>
                      <div className="font-medium text-purple-800">Profit Margin</div>
                      <div className="text-sm text-purple-600">Efficiency metric</div>
                    </div>
                    <div className="text-xl font-bold text-purple-800">
                      {profitLoss.profitMargin.toFixed(1)}%
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Add/Edit Expense Dialog */}
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingExpense ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dialog-description">Description</Label>
                  <Input
                    id="dialog-description"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Expense description"
                  />
                </div>
                <div>
                  <Label htmlFor="dialog-amount">Amount</Label>
                  <Input
                    id="dialog-amount"
                    type="number"
                    step="0.01"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dialog-category">Category</Label>
                  <Select value={newExpense.category} onValueChange={(value) => setNewExpense(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter(cat => cat !== 'ALL').map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dialog-date">Date</Label>
                  <Input
                    id="dialog-date"
                    type="date"
                    value={newExpense.date}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="dialog-notes">Notes</Label>
                <Textarea
                  id="dialog-notes"
                  value={newExpense.notes}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes..."
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="dialog-recurring"
                  checked={newExpense.isRecurring}
                  onCheckedChange={(checked) => setNewExpense(prev => ({ ...prev, isRecurring: checked }))}
                />
                <Label htmlFor="dialog-recurring">Recurring Expense</Label>
              </div>

              {newExpense.isRecurring && (
                <div>
                  <Label htmlFor="dialog-recurring-interval">Recurring Interval</Label>
                  <Select value={newExpense.recurringInterval} onValueChange={(value) => setNewExpense(prev => ({ ...prev, recurringInterval: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => {
                  setAddDialogOpen(false)
                  setEditingExpense(null)
                  setNewExpense({
                    description: '',
                    amount: '',
                    category: 'OTHER',
                    date: new Date().toISOString().split('T')[0],
                    notes: '',
                    isRecurring: false,
                    recurringInterval: 'monthly'
                  })
                }}>
                  Cancel
                </Button>
                <Button onClick={editingExpense ? updateExpense : addExpense} className="flex-1">
                  {editingExpense ? 'Update Expense' : 'Add Expense'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}