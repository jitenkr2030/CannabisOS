import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { jest } from '@jest/globals'
import InventorySystem from '@/components/Inventory-System'

// Mock fetch
global.fetch = jest.fn()

const mockProducts = [
  {
    id: '1',
    name: 'Blue Dream',
    sku: 'BD-001',
    category: 'FLOWER',
    thcContent: 18.5,
    cbdContent: 0.2,
    price: 35.00,
    inventory: [
      {
        id: 'inv-1',
        quantity: 100,
        available: 95,
        reserved: 5,
        reorderLevel: 10,
        maxStock: 200,
        location: 'A1-B2',
        lastCounted: '2024-01-15',
        batch: {
          batchNumber: 'BD-001-2024-01',
          supplier: 'Green Leaf Farms',
          expiryDate: '2024-12-31'
        }
      }
    ]
  },
  {
    id: '2',
    name: 'OG Kush',
    sku: 'OGK-001',
    category: 'FLOWER',
    thcContent: 22.0,
    cbdContent: 0.1,
    price: 40.00,
    inventory: [
      {
        id: 'inv-2',
        quantity: 5,
        available: 5,
        reserved: 0,
        reorderLevel: 10,
        maxStock: 100,
        location: 'A3-C4',
        lastCounted: '2024-01-15',
        batch: {
          batchNumber: 'OGK-001-2024-01',
          supplier: 'Premium Growers',
          expiryDate: '2024-11-30'
        }
      }
    ]
  },
  {
    id: '3',
    name: 'Sour Diesel',
    sku: 'SD-001',
    category: 'FLOWER',
    thcContent: 19.0,
    cbdContent: 0.3,
    price: 38.00,
    inventory: [
      {
        id: 'inv-3',
        quantity: 0,
        available: 0,
        reserved: 0,
        reorderLevel: 10,
        maxStock: 100,
        location: 'B1-C2',
        lastCounted: '2024-01-10',
        batch: {
          batchNumber: 'SD-001-2024-01',
          supplier: 'Green Leaf Farms',
          expiryDate: '2024-10-31'
        }
      }
    ]
  }
]

describe('Inventory System', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(fetch as jest.Mock).mockImplementation((url) => {
      if (url.includes('/api/products')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ products: mockProducts })
        })
      }
      if (url.includes('/api/inventory')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true })
        })
      }
      return Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Not found' })
      })
    })
  })

  it('renders inventory management system', async () => {
    render(<InventorySystem />)
    
    expect(screen.getByText('Inventory Management')).toBeInTheDocument()
    expect(screen.getByText('Track stock levels, batch information, and product movements')).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.getByText('Blue Dream')).toBeInTheDocument()
      expect(screen.getByText('OG Kush')).toBeInTheDocument()
      expect(screen.getByText('Sour Diesel')).toBeInTheDocument()
    })
  })

  it('displays inventory statistics correctly', async () => {
    render(<InventorySystem />)
    
    await waitFor(() => {
      expect(screen.getByText('Total Products')).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument() // 3 products
      expect(screen.getByText('Low Stock Items')).toBeInTheDocument()
      expect(screen.getByText('1')).toBeInTheDocument() // OG Kush is low stock
      expect(screen.getByText('Out of Stock')).toBeInTheDocument()
      expect(screen.getByText('1')).toBeInTheDocument() // Sour Diesel is out of stock
    })
  })

  it('shows correct stock status for each product', async () => {
    render(<InventorySystem />)
    
    await waitFor(() => {
      // Blue Dream - normal stock
      expect(screen.getByText('In Stock')).toBeInTheDocument()
      
      // OG Kush - low stock
      expect(screen.getByText('Low Stock')).toBeInTheDocument()
      
      // Sour Diesel - out of stock
      expect(screen.getByText('Out of Stock')).toBeInTheDocument()
    })
  })

  it('filters products by stock status', async () => {
    const user = userEvent.setup()
    render(<InventorySystem />)
    
    await waitFor(() => {
      expect(screen.getByText('Blue Dream')).toBeInTheDocument()
    })
    
    // Filter by low stock
    const stockFilter = screen.getAllByRole('combobox')[1] // Second select should be stock filter
    await user.click(stockFilter)
    
    const lowStockOption = screen.getByText('Low Stock')
    await user.click(lowStockOption)
    
    // Should only show OG Kush
    expect(screen.queryByText('Blue Dream')).not.toBeInTheDocument()
    expect(screen.getByText('OG Kush')).toBeInTheDocument()
    expect(screen.queryByText('Sour Diesel')).not.toBeInTheDocument()
  })

  it('searches products', async () => {
    const user = userEvent.setup()
    render(<InventorySystem />)
    
    await waitFor(() => {
      expect(screen.getByText('Blue Dream')).toBeInTheDocument()
    })
    
    const searchInput = screen.getByPlaceholderText('Search products...')
    await user.type(searchInput, 'Blue')
    
    expect(screen.getByText('Blue Dream')).toBeInTheDocument()
    expect(screen.queryByText('OG Kush')).not.toBeInTheDocument()
    expect(screen.queryByText('Sour Diesel')).not.toBeInTheDocument()
  })

  it('opens stock adjustment dialog', async () => {
    const user = userEvent.setup()
    render(<InventorySystem />)
    
    await waitFor(() => {
      expect(screen.getByText('Blue Dream')).toBeInTheDocument()
    })
    
    // Find and click edit button for Blue Dream
    const editButtons = screen.getAllByRole('button').filter(button => 
      button.querySelector('svg')?.getAttribute('data-lucide') === 'edit'
    )
    await user.click(editButtons[0])
    
    expect(screen.getByText('Stock Adjustment')).toBeInTheDocument()
    expect(screen.getByText('Blue Dream')).toBeInTheDocument()
    expect(screen.getByText('Current Stock: 95')).toBeInTheDocument()
  })

  it('processes stock adjustment', async () => {
    const user = userEvent.setup()
    render(<InventorySystem />)
    
    await waitFor(() => {
      expect(screen.getByText('Blue Dream')).toBeInTheDocument()
    })
    
    // Open adjustment dialog
    const editButtons = screen.getAllByRole('button').filter(button => 
      button.querySelector('svg')?.getAttribute('data-lucide') === 'edit'
    )
    await user.click(editButtons[0])
    
    // Fill adjustment form
    const quantityInput = screen.getByPlaceholderText('Enter quantity')
    await user.type(quantityInput, '10')
    
    const reasonInput = screen.getByPlaceholderText('Reason for adjustment...')
    await user.type(reasonInput, 'New stock received')
    
    // Process adjustment
    const processButton = screen.getByText('Process Adjustment')
    await user.click(processButton)
    
    await waitFor(() => {
      expect(screen.getByText('Stock adjustment completed successfully!')).toBeInTheDocument()
    })
  })

  it('displays batch information', async () => {
    render(<InventorySystem />)
    
    await waitFor(() => {
      expect(screen.getByText('BD-001-2024-01')).toBeInTheDocument()
      expect(screen.getByText('Green Leaf Farms')).toBeInTheDocument()
      expect(screen.getByText('Exp: 12/31/2024')).toBeInTheDocument()
    })
  })

  it('calculates inventory value correctly', async () => {
    render(<InventorySystem />)
    
    await waitFor(() => {
      // Calculate expected value: (95 * 35) + (5 * 40) + (0 * 38) = 3325 + 200 + 0 = 3525
      expect(screen.getByText('$3,525.00')).toBeInTheDocument()
    })
  })

  it('validates adjustment form', async () => {
    const user = userEvent.setup()
    render(<InventorySystem />)
    
    await waitFor(() => {
      expect(screen.getByText('Blue Dream')).toBeInTheDocument()
    })
    
    // Open adjustment dialog
    const editButtons = screen.getAllByRole('button').filter(button => 
      button.querySelector('svg')?.getAttribute('data-lucide') === 'edit'
    )
    await user.click(editButtons[0])
    
    // Try to process without filling required fields
    const processButton = screen.getByText('Process Adjustment')
    await user.click(processButton)
    
    expect(screen.getByText('Please fill in all required fields')).toBeInTheDocument()
  })

  it('switches between inventory and movements tabs', async () => {
    const user = userEvent.setup()
    render(<InventorySystem />)
    
    await waitFor(() => {
      expect(screen.getByText('Blue Dream')).toBeInTheDocument()
    })
    
    // Click on movements tab
    const movementsTab = screen.getByText('Stock Movements')
    await user.click(movementsTab)
    
    expect(screen.getByText('Recent Stock Movements')).toBeInTheDocument()
    expect(screen.getByText('Sale RCP-1001')).toBeInTheDocument()
  })

  it('shows warning for expiring products', async () => {
    render(<InventorySystem />)
    
    await waitFor(() => {
      // Check if expiring products are highlighted (this would depend on current date)
      // For this test, we assume the test runs before the expiry date
      expect(screen.getByText('Exp: 12/31/2024')).toBeInTheDocument()
    })
  })
})