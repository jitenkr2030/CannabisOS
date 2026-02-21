import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { jest } from '@jest/globals'
import POSsystem from '@/components/POS-System'

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
        quantity: 50,
        available: 0,
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
  }
]

describe('POS System', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(fetch as jest.Mock).mockImplementation((url) => {
      if (url.includes('/api/products')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ products: mockProducts })
        })
      }
      if (url.includes('/api/sales')) {
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

  it('renders POS system with product catalog', async () => {
    render(<POSsystem />)
    
    expect(screen.getByText('Point of Sale')).toBeInTheDocument()
    expect(screen.getByText('Process sales and manage customer transactions')).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.getByText('Blue Dream')).toBeInTheDocument()
      expect(screen.getByText('OG Kush')).toBeInTheDocument()
    })
  })

  it('displays product information correctly', async () => {
    render(<POSsystem />)
    
    await waitFor(() => {
      expect(screen.getByText('Blue Dream')).toBeInTheDocument()
      expect(screen.getByText('BD-001')).toBeInTheDocument()
      expect(screen.getByText('THC: 18.5%')).toBeInTheDocument()
      expect(screen.getByText('CBD: 0.2%')).toBeInTheDocument()
      expect(screen.getByText('$35.00')).toBeInTheDocument()
      expect(screen.getByText('Stock: 95')).toBeInTheDocument()
    })
  })

  it('shows out of stock products correctly', async () => {
    render(<POSsystem />)
    
    await waitFor(() => {
      const ogKushCard = screen.getByText('OG Kush').closest('div')
      expect(ogKushCard).toContainHTML('disabled')
    })
  })

  it('adds products to cart', async () => {
    const user = userEvent.setup()
    render(<POSsystem />)
    
    await waitFor(() => {
      expect(screen.getByText('Blue Dream')).toBeInTheDocument()
    })
    
    const addButton = screen.getAllByText('Add to Cart')[0]
    await user.click(addButton)
    
    expect(screen.getByText('Shopping Cart')).toBeInTheDocument()
    expect(screen.getByText('Blue Dream')).toBeInTheDocument()
    expect(screen.getByText('$35.00')).toBeInTheDocument()
  })

  it('calculates totals correctly', async () => {
    const user = userEvent.setup()
    render(<POSsystem />)
    
    await waitFor(() => {
      expect(screen.getByText('Blue Dream')).toBeInTheDocument()
    })
    
    const addButton = screen.getAllByText('Add to Cart')[0]
    await user.click(addButton)
    await user.click(addButton) // Add 2 items
    
    expect(screen.getByText('Subtotal:')).toBeInTheDocument()
    expect(screen.getByText('$70.00')).toBeInTheDocument()
    expect(screen.getByText('Tax (13%):')).toBeInTheDocument()
    expect(screen.getByText('$9.10')).toBeInTheDocument()
    expect(screen.getByText('Total:')).toBeInTheDocument()
    expect(screen.getByText('$79.10')).toBeInTheDocument()
  })

  it('updates cart quantity', async () => {
    const user = userEvent.setup()
    render(<POSsystem />)
    
    await waitFor(() => {
      expect(screen.getByText('Blue Dream')).toBeInTheDocument()
    })
    
    const addButton = screen.getAllByText('Add to Cart')[0]
    await user.click(addButton)
    
    // Find quantity controls and increase
    const plusButtons = screen.getAllByRole('button').filter(button => 
      button.querySelector('svg')?.getAttribute('data-lucide') === 'plus'
    )
    await user.click(plusButtons[plusButtons.length - 1]) // Last plus button should be in cart
    
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('removes items from cart', async () => {
    const user = userEvent.setup()
    render(<POSsystem />)
    
    await waitFor(() => {
      expect(screen.getByText('Blue Dream')).toBeInTheDocument()
    })
    
    const addButton = screen.getAllByText('Add to Cart')[0]
    await user.click(addButton)
    
    // Find and click remove button (X icon)
    const removeButtons = screen.getAllByRole('button').filter(button => 
      button.querySelector('svg')?.getAttribute('data-lucide') === 'x'
    )
    await user.click(removeButtons[removeButtons.length - 1])
    
    expect(screen.getByText('Cart is empty')).toBeInTheDocument()
  })

  it('requires age verification for checkout', async () => {
    const user = userEvent.setup()
    render(<POSsystem />)
    
    await waitFor(() => {
      expect(screen.getByText('Blue Dream')).toBeInTheDocument()
    })
    
    const addButton = screen.getAllByText('Add to Cart')[0]
    await user.click(addButton)
    
    const checkoutButton = screen.getByText(/Complete Sale/)
    await user.click(checkoutButton)
    
    expect(screen.getByText('Age verification is required!')).toBeInTheDocument()
  })

  it('processes sale successfully', async () => {
    const user = userEvent.setup()
    render(<POSsystem />)
    
    await waitFor(() => {
      expect(screen.getByText('Blue Dream')).toBeInTheDocument()
    })
    
    // Add product to cart
    const addButton = screen.getAllByText('Add to Cart')[0]
    await user.click(addButton)
    
    // Verify age
    const ageCheckbox = screen.getByRole('checkbox', { name: /Customer age verified/ })
    await user.click(ageCheckbox)
    
    // Process sale
    const checkoutButton = screen.getByText(/Complete Sale/)
    await user.click(checkoutButton)
    
    await waitFor(() => {
      expect(screen.getByText('Sale completed successfully!')).toBeInTheDocument()
    })
  })

  it('filters products by category', async () => {
    const user = userEvent.setup()
    render(<POSsystem />)
    
    await waitFor(() => {
      expect(screen.getByText('Blue Dream')).toBeInTheDocument()
    })
    
    // Find category filter
    const categorySelect = screen.getByRole('combobox')
    await user.click(categorySelect)
    
    const flowerOption = screen.getByText('FLOWER')
    await user.click(flowerOption)
    
    // Should still show both products as they're both FLOWER
    expect(screen.getByText('Blue Dream')).toBeInTheDocument()
    expect(screen.getByText('OG Kush')).toBeInTheDocument()
  })

  it('searches products', async () => {
    const user = userEvent.setup()
    render(<POSsystem />)
    
    await waitFor(() => {
      expect(screen.getByText('Blue Dream')).toBeInTheDocument()
    })
    
    const searchInput = screen.getByPlaceholderText('Search products...')
    await user.type(searchInput, 'Blue')
    
    expect(screen.getByText('Blue Dream')).toBeInTheDocument()
    expect(screen.queryByText('OG Kush')).not.toBeInTheDocument()
  })

  it('handles empty cart state', () => {
    render(<POSsystem />)
    
    expect(screen.getByText('Cart is empty')).toBeInTheDocument()
    expect(screen.queryByText('Subtotal:')).not.toBeInTheDocument()
  })

  it('prevents adding out of stock items', async () => {
    const user = userEvent.setup()
    render(<POSsystem />)
    
    await waitFor(() => {
      expect(screen.getByText('OG Kush')).toBeInTheDocument()
    })
    
    const ogKushButton = screen.getAllByText('Add to Cart')[1] // Second button should be OG Kush
    expect(ogKushButton).toBeDisabled()
  })
})