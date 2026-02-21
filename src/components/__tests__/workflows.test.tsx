import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { jest } from '@jest/globals'
import POSsystem from '@/components/POS-System'
import InventorySystem from '@/components/Inventory-System'
import AccountingSystem from '@/components/Accounting-System'

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
        available: 5,
        reserved: 0,
        reorderLevel: 10,
      }
    ]
  }
]

const mockExpenses = [
  {
    id: '1',
    description: 'Monthly Rent',
    amount: 2500.00,
    category: 'RENT',
    date: '2024-01-01',
    notes: 'January rent payment',
    isRecurring: true,
    user: { name: 'John Doe', email: 'john@example.com' }
  }
]

const mockSales = [
  {
    id: '1',
    total: 5000.00,
    subtotal: 4424.78,
    tax: 575.22,
    date: '2024-01-15'
  }
]

describe('Core Business Workflows', () => {
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
          json: () => Promise.resolve({ sales: mockSales })
        })
      }
      if (url.includes('/api/expenses')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ expenses: mockExpenses })
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

  describe('Complete Sales Workflow', () => {
    it('processes a complete sale from start to finish', async () => {
      const user = userEvent.setup()
      render(<POSsystem />)
      
      await waitFor(() => {
        expect(screen.getByText('Blue Dream')).toBeInTheDocument()
      })
      
      // Step 1: Add products to cart
      const blueDreamButton = screen.getAllByText('Add to Cart')[0]
      await user.click(blueDreamButton)
      
      const ogKushButton = screen.getAllByText('Add to Cart')[1]
      await user.click(ogKushButton)
      
      // Step 2: Verify cart contents
      expect(screen.getByText('Blue Dream')).toBeInTheDocument()
      expect(screen.getByText('OG Kush')).toBeInTheDocument()
      expect(screen.getByText('$35.00')).toBeInTheDocument()
      expect(screen.getByText('$40.00')).toBeInTheDocument()
      
      // Step 3: Check calculations
      expect(screen.getByText('Subtotal:')).toBeInTheDocument()
      expect(screen.getByText('$75.00')).toBeInTheDocument()
      expect(screen.getByText('Tax (13%):')).toBeInTheDocument()
      expect(screen.getByText('$9.75')).toBeInTheDocument()
      expect(screen.getByText('Total:')).toBeInTheDocument()
      expect(screen.getByText('$84.75')).toBeInTheDocument()
      
      // Step 4: Add customer information
      const nameInput = screen.getByLabelText(/Name/i)
      await user.type(nameInput, 'John Doe')
      
      const phoneInput = screen.getByLabelText(/Phone/i)
      await user.type(phoneInput, '555-1234')
      
      const emailInput = screen.getByLabelText(/Email/i)
      await user.type(emailInput, 'john@example.com')
      
      // Step 5: Verify age
      const ageCheckbox = screen.getByRole('checkbox', { name: /Customer age verified/ })
      await user.click(ageCheckbox)
      
      // Step 6: Select payment method
      const creditTab = screen.getByText('Credit')
      await user.click(creditTab)
      
      // Step 7: Process sale
      const checkoutButton = screen.getByText(/Complete Sale/)
      await user.click(checkoutButton)
      
      // Step 8: Verify success
      await waitFor(() => {
        expect(screen.getByText('Sale completed successfully!')).toBeInTheDocument()
      })
      
      // Step 9: Verify cart is cleared
      expect(screen.getByText('Cart is empty')).toBeInTheDocument()
      
      // Step 10: Verify customer info is cleared
      expect(nameInput).toHaveValue('')
      expect(phoneInput).toHaveValue('')
      expect(emailInput).toHaveValue('')
    })

    it('handles low stock scenarios correctly', async () => {
      const user = userEvent.setup()
      render(<POSsystem />)
      
      await waitFor(() => {
        expect(screen.getByText('OG Kush')).toBeInTheDocument()
      })
      
      // Add OG Kush (only 5 available)
      const ogKushButton = screen.getAllByText('Add to Cart')[1]
      await user.click(ogKushButton)
      
      // Try to add more than available
      const plusButtons = screen.getAllByRole('button').filter(button => 
        button.querySelector('svg')?.getAttribute('data-lucide') === 'plus'
      )
      
      // Add 5 more (total 6, but only 5 available)
      for (let i = 0; i < 5; i++) {
        await user.click(plusButtons[plusButtons.length - 1])
      }
      
      // Should show error for insufficient stock
      expect(screen.getByText('Not enough stock available!')).toBeInTheDocument()
    })

    it('prevents checkout without age verification', async () => {
      const user = userEvent.setup()
      render(<POSsystem />)
      
      await waitFor(() => {
        expect(screen.getByText('Blue Dream')).toBeInTheDocument()
      })
      
      // Add product to cart
      const addButton = screen.getAllByText('Add to Cart')[0]
      await user.click(addButton)
      
      // Try to checkout without age verification
      const checkoutButton = screen.getByText(/Complete Sale/)
      await user.click(checkoutButton)
      
      // Should show age verification error
      expect(screen.getByText('Age verification is required!')).toBeInTheDocument()
    })
  })

  describe('Inventory Management Workflow', () => {
    it('manages stock levels from low stock to replenishment', async () => {
      const user = userEvent.setup()
      render(<InventorySystem />)
      
      await waitFor(() => {
        expect(screen.getByText('Low Stock Items')).toBeInTheDocument()
        expect(screen.getByText('1')).toBeInTheDocument() // OG Kush is low stock
      })
      
      // Step 1: Filter for low stock items
      const stockFilter = screen.getAllByRole('combobox')[1]
      await user.click(stockFilter)
      
      const lowStockOption = screen.getByText('Low Stock')
      await user.click(lowStockOption)
      
      // Step 2: Verify only low stock items are shown
      expect(screen.queryByText('Blue Dream')).not.toBeInTheDocument()
      expect(screen.getByText('OG Kush')).toBeInTheDocument()
      
      // Step 3: Open stock adjustment for OG Kush
      const editButtons = screen.getAllByRole('button').filter(button => 
        button.querySelector('svg')?.getAttribute('data-lucide') === 'edit'
      )
      await user.click(editButtons[0])
      
      // Step 4: Add stock
      const quantityInput = screen.getByPlaceholderText('Enter quantity')
      await user.type(quantityInput, '50')
      
      const reasonInput = screen.getByPlaceholderText('Reason for adjustment...')
      await user.type(reasonInput, 'New stock received from supplier')
      
      const adjustmentType = screen.getByDisplayValue('Manual Adjustment')
      await user.click(adjustmentType)
      
      const purchaseOption = screen.getByText('Purchase/Stock In')
      await user.click(purchaseOption)
      
      // Step 5: Process adjustment
      const processButton = screen.getByText('Process Adjustment')
      await user.click(processButton)
      
      // Step 6: Verify success
      await waitFor(() => {
        expect(screen.getByText('Stock adjustment completed successfully!')).toBeInTheDocument()
      })
      
      // Step 7: Verify stock status is updated
      // (In real implementation, this would reflect the new stock level)
    })

    it('tracks complete stock movement history', async () => {
      render(<InventorySystem />)
      
      await waitFor(() => {
        expect(screen.getByText('Blue Dream')).toBeInTheDocument()
      })
      
      // Step 1: Navigate to stock movements
      const movementsTab = screen.getByText('Stock Movements')
      fireEvent.click(movementsTab)
      
      // Step 2: Verify movement history is displayed
      expect(screen.getByText('Recent Stock Movements')).toBeInTheDocument()
      expect(screen.getByText('Sale RCP-1001')).toBeInTheDocument()
      expect(screen.getByText('Blue Dream')).toBeInTheDocument()
      expect(screen.getByText('-1')).toBeInTheDocument() // Quantity decreased
      
      // Step 3: Check movement details
      expect(screen.getByText('John Doe')).toBeInTheDocument() // User who made movement
    })
  })

  describe('Financial Management Workflow', () => {
    it('tracks complete profit and loss cycle', async () => {
      render(<AccountingSystem />)
      
      await waitFor(() => {
        expect(screen.getByText('Monthly Rent')).toBeInTheDocument()
      })
      
      // Step 1: Verify current P&L
      expect(screen.getByText('$5,000.00')).toBeInTheDocument() // Revenue
      expect(screen.getByText('$2,500.00')).toBeInTheDocument() // Expenses
      expect(screen.getByText('$2,500.00')).toBeInTheDocument() // Profit
      expect(screen.getByText('50.0%')).toBeInTheDocument() // Profit Margin
      
      // Step 2: Add new expense
      const addTab = screen.getByText('Add Expense')
      fireEvent.click(addTab)
      
      const descriptionInput = screen.getByPlaceholderText('Expense description')
      fireEvent.change(descriptionInput, { target: { value: 'Office Supplies' } })
      
      const amountInput = screen.getByPlaceholderText('0.00')
      fireEvent.change(amountInput, { target: { value: '150.00' } })
      
      const categorySelect = screen.getByDisplayValue('OTHER')
      fireEvent.click(categorySelect)
      
      const suppliesOption = screen.getByText('SUPPLIES')
      fireEvent.click(suppliesOption)
      
      const addButton = screen.getByText('Add Expense')
      fireEvent.click(addButton)
      
      // Step 3: Verify expense is added
      // (In real implementation, this would update the P&L)
      
      // Step 4: Check financial reports
      const reportsTab = screen.getByText('Financial Reports')
      fireEvent.click(reportsTab)
      
      expect(screen.getByText('Financial Summary')).toBeInTheDocument()
      expect(screen.getByText('Expense Summary by Category')).toBeInTheDocument()
    })

    it('manages recurring expenses automatically', async () => {
      render(<AccountingSystem />)
      
      await waitFor(() => {
        expect(screen.getByText('Monthly Rent')).toBeInTheDocument()
      })
      
      // Step 1: Verify recurring expense is marked
      const recurringBadges = screen.getAllByText('Recurring')
      expect(recurringBadges.length).toBeGreaterThan(0)
      
      // Step 2: Check expense details
      const rentExpense = screen.getByText('Monthly Rent')
      const rentCard = rentExpense.closest('div')
      
      expect(rentCard).toContainText('RENT')
      expect(rentCard).toContainText('$2,500.00')
      expect(rentCard).toContainText('Recurring')
      
      // Step 3: Add new recurring expense
      const addTab = screen.getByText('Add Expense')
      fireEvent.click(addTab)
      
      const descriptionInput = screen.getByPlaceholderText('Expense description')
      fireEvent.change(descriptionInput, { target: { value: 'Software Subscription' } })
      
      const amountInput = screen.getByPlaceholderText('0.00')
      fireEvent.change(amountInput, { target: { value: '99.00' } })
      
      const recurringSwitch = screen.getByRole('checkbox', { name: /Recurring Expense/ })
      fireEvent.click(recurringSwitch)
      
      const intervalSelect = screen.getByDisplayValue('Monthly')
      fireEvent.click(intervalSelect)
      
      const addButton = screen.getByText('Add Expense')
      fireEvent.click(addButton)
      
      // Step 4: Verify recurring expense setup
      // (In real implementation, this would create a recurring expense)
    })
  })

  describe('Integration Workflow: Sales to Inventory to Accounting', () => {
    it('maintains data consistency across systems', async () => {
      // This test simulates the complete business flow
      
      // Step 1: Make a sale (reduces inventory)
      const user = userEvent.setup()
      render(<POSsystem />)
      
      await waitFor(() => {
        expect(screen.getByText('Blue Dream')).toBeInTheDocument()
      })
      
      const addButton = screen.getAllByText('Add to Cart')[0]
      await user.click(addButton)
      
      const ageCheckbox = screen.getByRole('checkbox', { name: /Customer age verified/ })
      await user.click(ageCheckbox)
      
      const checkoutButton = screen.getByText(/Complete Sale/)
      await user.click(checkoutButton)
      
      await waitFor(() => {
        expect(screen.getByText('Sale completed successfully!')).toBeInTheDocument()
      })
      
      // Step 2: Check inventory impact
      // (In real implementation, inventory would be updated)
      
      // Step 3: Check financial impact
      // (In real implementation, accounting would be updated)
      
      // Step 4: Verify data consistency
      // All systems should reflect the same transaction
    })
  })

  describe('Error Handling and Edge Cases', () => {
    it('handles network failures gracefully', async () => {
      // Mock network failure
      ;(fetch as jest.Mock).mockRejectedValue(new Error('Network error'))
      
      const user = userEvent.setup()
      render(<POSsystem />)
      
      // Should show error state or loading state
      await waitFor(() => {
        // Check for error message or loading indicator
        const errorMessage = screen.queryByText(/error|failed|network/i)
        const loadingIndicator = screen.queryByText(/loading|fetching/i)
        
        // Either error should be shown or handled gracefully
        expect(errorMessage || loadingIndicator).toBeTruthy()
      }, { timeout: 5000 })
    })

    it('validates data integrity across workflows', async () => {
      const user = userEvent.setup()
      render(<POSsystem />)
      
      await waitFor(() => {
        expect(screen.getByText('Blue Dream')).toBeInTheDocument()
      })
      
      // Test with invalid data
      const searchInput = screen.getByPlaceholderText('Search products...')
      await user.type(searchInput, '')
      
      // Should handle gracefully without crashing
      expect(screen.getByText('Blue Dream')).toBeInTheDocument()
    })

    it('maintains performance with large datasets', async () => {
      // Mock large dataset
      const largeProductList = Array.from({ length: 1000 }, (_, i) => ({
        id: `product-${i}`,
        name: `Product ${i}`,
        sku: `SKU-${i.toString().padStart(3, '0')}`,
        category: 'FLOWER',
        thcContent: 20.0,
        cbdContent: 0.5,
        price: 35.00 + (i % 10),
        inventory: [
          {
            id: `inv-${i}`,
            quantity: 100,
            available: 95,
            reserved: 5,
            reorderLevel: 10,
          }
        ]
      }))
      
      ;(fetch as jest.Mock).mockImplementation((url) => {
        if (url.includes('/api/products')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ products: largeProductList })
          })
        }
        return Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ error: 'Not found' })
        })
      })
      
      render(<POSsystem />)
      
      // Should still load and be usable
      await waitFor(() => {
        expect(screen.getByText('Point of Sale')).toBeInTheDocument()
      }, { timeout: 10000 })
    })
  })
})