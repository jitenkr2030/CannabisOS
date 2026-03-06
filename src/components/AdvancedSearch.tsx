'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Search, 
  Filter, 
  X, 
  Plus, 
  ChevronDown, 
  ChevronUp,
  Calendar,
  DollarSign,
  Package,
  Users,
  ShoppingCart,
  Truck
} from 'lucide-react'

interface SearchFiltersProps {
  entityType: 'sales' | 'inventory' | 'customers' | 'users' | 'deliveries' | 'products'
  onSearch: (query: string, filters: any) => void
  onReset: () => void
  className?: string
}

interface FilterOption {
  key: string
  label: string
  type: 'text' | 'select' | 'date' | 'number' | 'range' | 'checkbox'
  options?: { value: string; label: string }[]
  placeholder?: string
  min?: number
  max?: number
}

export default function AdvancedSearch({ 
  entityType, 
  onSearch, 
  onReset, 
  className 
}: SearchFiltersProps) {
  const [query, setQuery] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [filters, setFilters] = useState<any>({})
  const [activeFilterCount, setActiveFilterCount] = useState(0)

  const getFilterOptions = (): FilterOption[] => {
    switch (entityType) {
      case 'sales':
        return [
          {
            key: 'dateRange',
            label: 'Date Range',
            type: 'date',
            placeholder: 'Select date range'
          },
          {
            key: 'status',
            label: 'Status',
            type: 'select',
            options: [
              { value: 'COMPLETED', label: 'Completed' },
              { value: 'PENDING', label: 'Pending' },
              { value: 'CANCELLED', label: 'Cancelled' },
              { value: 'REFUNDED', label: 'Refunded' }
            ]
          },
          {
            key: 'paymentMethod',
            label: 'Payment Method',
            type: 'select',
            options: [
              { value: 'CASH', label: 'Cash' },
              { value: 'CARD', label: 'Card' },
              { value: 'MOBILE', label: 'Mobile' },
              { value: 'BANK_TRANSFER', label: 'Bank Transfer' }
            ]
          },
          {
            key: 'amountRange',
            label: 'Amount Range',
            type: 'range',
            min: 0,
            max: 10000
          },
          {
            key: 'customerEmail',
            label: 'Customer Email',
            type: 'text',
            placeholder: 'customer@example.com'
          }
        ]
      
      case 'inventory':
        return [
          {
            key: 'category',
            label: 'Category',
            type: 'select',
            options: [
              { value: 'FLOWER', label: 'Flower' },
              { value: 'EDIBLE', label: 'Edible' },
              { value: 'CONCENTRATE', label: 'Concentrate' },
              { value: 'PRE_ROLL', label: 'Pre-Roll' },
              { value: 'ACCESSORIES', label: 'Accessories' }
            ]
          },
          {
            key: 'quantityRange',
            label: 'Quantity Range',
            type: 'range',
            min: 0,
            max: 1000
          },
          {
            key: 'priceRange',
            label: 'Price Range',
            type: 'range',
            min: 0,
            max: 500
          },
          {
            key: 'stockStatus',
            label: 'Stock Status',
            type: 'select',
            options: [
              { value: 'normal', label: 'In Stock' },
              { value: 'low', label: 'Low Stock' },
              { value: 'out', label: 'Out of Stock' }
            ]
          },
          {
            key: 'expiring',
            label: 'Expiring Soon',
            type: 'checkbox'
          }
        ]
      
      case 'customers':
        return [
          {
            key: 'dateRange',
            label: 'Date Range',
            type: 'date',
            placeholder: 'Select date range'
          },
          {
            key: 'spentRange',
            label: 'Total Spent Range',
            type: 'range',
            min: 0,
            max: 10000
          },
          {
            key: 'orderRange',
            label: 'Order Count Range',
            type: 'range',
            min: 1,
            max: 100
          },
          {
            key: 'segment',
            label: 'Customer Segment',
            type: 'select',
            options: [
              { value: 'vip', label: 'VIP' },
              { value: 'regular', label: 'Regular' },
              { value: 'casual', label: 'Casual' }
            ]
          },
          {
            key: 'isRepeat',
            label: 'Repeat Customers Only',
            type: 'checkbox'
          }
        ]
      
      case 'users':
        return [
          {
            key: 'role',
            label: 'Role',
            type: 'select',
            options: [
              { value: 'ADMIN', label: 'Admin' },
              { value: 'MANAGER', label: 'Manager' },
              { value: 'STAFF', label: 'Staff' },
              { value: 'DRIVER', label: 'Driver' }
            ]
          },
          {
            key: 'status',
            label: 'Status',
            type: 'select',
            options: [
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' }
            ]
          }
        ]
      
      case 'deliveries':
        return [
          {
            key: 'status',
            label: 'Status',
            type: 'select',
            options: [
              { value: 'PENDING', label: 'Pending' },
              { value: 'ASSIGNED', label: 'Assigned' },
              { value: 'IN_PROGRESS', label: 'In Progress' },
              { value: 'COMPLETED', label: 'Completed' },
              { value: 'CANCELLED', label: 'Cancelled' }
            ]
          },
          {
            key: 'dateRange',
            label: 'Date Range',
            type: 'date',
            placeholder: 'Select date range'
          },
          {
            key: 'priority',
            label: 'Priority',
            type: 'select',
            options: [
              { value: 'LOW', label: 'Low' },
              { value: 'MEDIUM', label: 'Medium' },
              { value: 'HIGH', label: 'High' },
              { value: 'URGENT', label: 'Urgent' }
            ]
          }
        ]
      
      case 'products':
        return [
          {
            key: 'category',
            label: 'Category',
            type: 'select',
            options: [
              { value: 'FLOWER', label: 'Flower' },
              { value: 'EDIBLE', label: 'Edible' },
              { value: 'CONCENTRATE', label: 'Concentrate' },
              { value: 'PRE_ROLL', label: 'Pre-Roll' },
              { value: 'ACCESSORIES', label: 'Accessories' }
            ]
          },
          {
            key: 'priceRange',
            label: 'Price Range',
            type: 'range',
            min: 0,
            max: 500
          },
          {
            key: 'thcRange',
            label: 'THC Content Range (%)',
            type: 'range',
            min: 0,
            max: 100
          },
          {
            key: 'cbdRange',
            label: 'CBD Content Range (%)',
            type: 'range',
            min: 0,
            max: 100
          },
          {
            key: 'isActive',
            label: 'Active Products Only',
            type: 'checkbox'
          }
        ]
      
      default:
        return []
    }
  }

  const filterOptions = getFilterOptions()

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters }
    
    if (value === '' || value === null || value === undefined) {
      delete newFilters[key]
    } else {
      newFilters[key] = value
    }
    
    setFilters(newFilters)
    
    // Count active filters
    const activeCount = Object.keys(newFilters).length
    setActiveFilterCount(activeCount)
  }

  const handleSearch = () => {
    onSearch(query, filters)
  }

  const handleReset = () => {
    setQuery('')
    setFilters({})
    setActiveFilterCount(0)
    onReset()
  }

  const renderFilterInput = (option: FilterOption) => {
    const value = filters[option.key]

    switch (option.type) {
      case 'text':
        return (
          <Input
            placeholder={option.placeholder}
            value={value || ''}
            onChange={(e) => handleFilterChange(option.key, e.target.value)}
          />
        )
      
      case 'select':
        return (
          <select
            className="w-full p-2 border rounded-md"
            value={value || ''}
            onChange={(e) => handleFilterChange(option.key, e.target.value)}
          >
            <option value="">All {option.label.toLowerCase()}</option>
            {option.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )
      
      case 'date':
        return (
          <div className="flex gap-2">
            <Input
              type="date"
              value={value?.start || ''}
              onChange={(e) => handleFilterChange(option.key, {
                ...value,
                start: e.target.value
              })}
            />
            <Input
              type="date"
              value={value?.end || ''}
              onChange={(e) => handleFilterChange(option.key, {
                ...value,
                end: e.target.value
              })}
            />
          </div>
        )
      
      case 'number':
        return (
          <Input
            type="number"
            placeholder={option.placeholder}
            value={value || ''}
            onChange={(e) => handleFilterChange(option.key, parseFloat(e.target.value) || '')}
            min={option.min}
            max={option.max}
          />
        )
      
      case 'range':
        return (
          <div className="flex gap-2 items-center">
            <Input
              type="number"
              placeholder="Min"
              value={value?.min || ''}
              onChange={(e) => handleFilterChange(option.key, {
                ...value,
                min: parseFloat(e.target.value) || ''
              })}
              min={option.min}
              max={option.max}
            />
            <span>-</span>
            <Input
              type="number"
              placeholder="Max"
              value={value?.max || ''}
              onChange={(e) => handleFilterChange(option.key, {
                ...value,
                max: parseFloat(e.target.value) || ''
              })}
              min={option.min}
              max={option.max}
            />
          </div>
        )
      
      case 'checkbox':
        return (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={option.key}
              checked={!!value}
              onChange={(e) => handleFilterChange(option.key, e.target.checked)}
              className="rounded"
            />
            <Label htmlFor={option.key} className="text-sm">
              {option.label}
            </Label>
          </div>
        )
      
      default:
        return null
    }
  }

  const getEntityIcon = () => {
    switch (entityType) {
      case 'sales': return <ShoppingCart className="h-5 w-5" />
      case 'inventory': return <Package className="h-5 w-5" />
      case 'customers': return <Users className="h-5 w-5" />
      case 'users': return <Users className="h-5 w-5" />
      case 'deliveries': return <Truck className="h-5 w-5" />
      case 'products': return <Package className="h-5 w-5" />
      default: return <Search className="h-5 w-5" />
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getEntityIcon()}
          Advanced Search
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Basic Search */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder={`Search ${entityType}...`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch()
                }
              }}
            />
          </div>
          <Button onClick={handleSearch}>
            Search
          </Button>
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Advanced
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Advanced Filters</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvanced(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filterOptions.map((option) => (
                <div key={option.key} className="space-y-2">
                  <Label className="text-sm font-medium">
                    {option.label}
                  </Label>
                  {renderFilterInput(option)}
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={handleReset}>
                Clear Filters
              </Button>
              <Button onClick={handleSearch}>
                Apply Filters
              </Button>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {Object.entries(filters).map(([key, value]) => {
              const option = filterOptions.find(opt => opt.key === key)
              if (!option) return null

              let displayValue = ''
              if (option.type === 'select' && option.options) {
                const selectedOption = option.options.find(opt => opt.value === value)
                displayValue = selectedOption?.label || value
              } else if (option.type === 'range' && value) {
                displayValue = `${value.min || 0} - ${value.max || '∞'}`
              } else if (option.type === 'date' && value) {
                displayValue = `${value.start || ''} - ${value.end || ''}`
              } else if (option.type === 'checkbox') {
                displayValue = option.label
              } else {
                displayValue = String(value)
              }

              return (
                <Badge
                  key={key}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {option.label}: {displayValue}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleFilterChange(key, null)}
                  />
                </Badge>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}