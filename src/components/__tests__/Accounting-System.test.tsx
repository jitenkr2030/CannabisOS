import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { jest } from '@jest/globals'
import AccountingSystem from '@/components/Accounting-System'

// Mock fetch
global.fetch = jest.fn()

const mockExpenses = [
  {
    id: '1',
    description: 'Monthly Rent',
    amount: 2500.00,
    category: 'RENT',
    date: '2024-01-01',
    notes: 'January rent payment',
    isRecurring: true,
    recurringInterval: 'monthly',
    user: { name: 'John Doe', email: 'john@example.com' }
  },
  {
    id: '2',
    description: 'Utilities',
    amount: 350.00,
    category: 'UTILITIES',
    date: '2024-01-05',
    notes: 'Electricity and water',
    isRecurring: true,
    recurringInterval: 'monthly',
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

describe('Accounting System', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(fetch as jest.Mock).mockImplementation((url) => {
      if (url.includes('/api/expenses')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ expenses: mockExpenses })
        })
      }
      if (url.includes('/api/sales')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ sales: mockSales })
        })
      }
      return Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Not found' })
      })
    })
  })

  it('renders accounting system', async () => {
    render(<AccountingSystem />)
    
    expect(screen.getByText('Accounting System')).toBeInTheDocument()
    expect(screen.getByText('Manage expenses, track profit & loss, and generate financial reports')).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.getByText('Monthly Rent')).toBeInTheDocument()
      expect(screen.getByText('Utilities')).toBeInTheDocument()
    })
  })

  it('displays profit & loss overview correctly', async () => {
    render(<AccountingSystem />)
    
    await waitFor(() => {
      // Revenue: $5000, Expenses: $2850, Profit: $2150, Profit Margin: 43%
      expect(screen.getByText('$5,000.00')).toBeInTheDocument() // Revenue
      expect(screen.getByText('$2,850.00')).toBeInTheDocument() // Expenses
      expect(screen.getByText('$2,150.00')).toBeInTheDocument() // Profit
      expect(screen.getByText('43.0%')).toBeInTheDocument() // Profit Margin
    })
  })

  it('shows expense list with details', async () => {
    render(<AccountingSystem />)
    
    await waitFor(() => {
      expect(screen.getByText('Monthly Rent')).toBeInTheDocument()
      expect(screen.getByText('$2,500.00')).toBeInTheDocument()
      expect(screen.getByText('RENT')).toBeInTheDocument()
      expect(screen.getByText('Recurring')).toBeInTheDocument()
      
      expect(screen.getByText('Utilities')).toBeInTheDocument()
      expect(screen.getByText('$350.00')).toBeInTheDocument()
      expect(screen.getByText('UTILITIES')).toBeInTheDocument()
    })
  })

  it('opens add expense dialog', async () => {
    const user = userEvent.setup()
    render(<AccountingSystem />)
    
    await waitFor(() => {
      expect(screen.getByText('Monthly Rent')).toBeInTheDocument()
    })
    
    const addExpenseButton = screen.getByText('Add Expense')
    await user.click(addExpenseButton)
    
    expect(screen.getByText('Add New Expense')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Expense description')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('0.00')).toBeInTheDocument()
  })

  it('adds new expense', async () => {
    const user = userEvent.setup()
    render(<AccountingSystem />)
    
    await waitFor(() => {
      expect(screen.getByText('Monthly Rent')).toBeInTheDocument()
    })
    
    // Go to add expense tab
    const addTab = screen.getByText('Add Expense')
    await user.click(addTab)
    
    // Fill form
    const descriptionInput = screen.getByPlaceholderText('Expense description')
    await user.type(descriptionInput, 'Office Supplies')
    
    const amountInput = screen.getByPlaceholderText('0.00')
    await user.type(amountInput, '150.00')
    
    // Submit form
    const addButton = screen.getByText('Add Expense')
    await user.click(addButton)
    
    // Should show success (in real implementation)
    expect(descriptionInput).toHaveValue('')
    expect(amountInput).toHaveValue('')
  })

  it('filters expenses by category', async () => {
    const user = userEvent.setup()
    render(<AccountingSystem />)
    
    await waitFor(() => {
      expect(screen.getByText('Monthly Rent')).toBeInTheDocument()
    })
    
    // Find category filter
    const categorySelect = screen.getAllByRole('combobox')[1] // Second select should be category
    await user.click(categorySelect)
    
    const rentOption = screen.getByText('RENT')
    await user.click(rentOption)
    
    expect(screen.getByText('Monthly Rent')).toBeInTheDocument()
    expect(screen.queryByText('Utilities')).not.toBeInTheDocument()
  })

  it('searches expenses', async () => {
    const user = userEvent.setup()
    render(<AccountingSystem />)
    
    await waitFor(() => {
      expect(screen.getByText('Monthly Rent')).toBeInTheDocument()
    })
    
    const searchInput = screen.getByPlaceholderText('Search expenses...')
    await user.type(searchInput, 'Rent')
    
    expect(screen.getByText('Monthly Rent')).toBeInTheDocument()
    expect(screen.queryByText('Utilities')).not.toBeInTheDocument()
  })

  it('toggles recurring expense', async () => {
    const user = userEvent.setup()
    render(<AccountingSystem />)
    
    await waitFor(() => {
      expect(screen.getByText('Monthly Rent')).toBeInTheDocument()
    })
    
    // Go to add expense tab
    const addTab = screen.getByText('Add Expense')
    await user.click(addTab)
    
    const recurringSwitch = screen.getByRole('checkbox', { name: /Recurring Expense/ })
    await user.click(recurringSwitch)
    
    expect(screen.getByText('Recurring Interval')).toBeInTheDocument()
    expect(screen.getByText('Monthly')).toBeInTheDocument()
  })

  it('exports expenses to CSV', async () => {
    const user = userEvent.setup()
    render(<AccountingSystem />)
    
    await waitFor(() => {
      expect(screen.getByText('Monthly Rent')).toBeInTheDocument()
    })
    
    // Mock URL.createObjectURL and click
    const mockCreateObjectURL = jest.fn().mockReturnValue('mock-url')
    global.URL.createObjectURL = mockCreateObjectURL
    global.URL.revokeObjectURL = jest.fn()
    
    const exportButton = screen.getByText('Export CSV')
    await user.click(exportButton)
    
    expect(mockCreateObjectURL).toHaveBeenCalled()
  })

  it('shows financial summary in reports tab', async () => {
    const user = userEvent.setup()
    render(<AccountingSystem />)
    
    await waitFor(() => {
      expect(screen.getByText('Monthly Rent')).toBeInTheDocument()
    })
    
    const reportsTab = screen.getByText('Financial Reports')
    await user.click(reportsTab)
    
    expect(screen.getByText('Financial Summary')).toBeInTheDocument()
    expect(screen.getByText('Total Revenue')).toBeInTheDocument()
    expect(screen.getByText('Total Expenses')).toBeInTheDocument()
    expect(screen.getByText('Net Profit')).toBeInTheDocument()
  })

  it('displays expense summary by category', async () => {
    const user = userEvent.setup()
    render(<AccountingSystem />)
    
    await waitFor(() => {
      expect(screen.getByText('Monthly Rent')).toBeInTheDocument()
    })
    
    const reportsTab = screen.getByText('Financial Reports')
    await user.click(reportsTab)
    
    expect(screen.getByText('Expense Summary by Category')).toBeInTheDocument()
    expect(screen.getByText('RENT')).toBeInTheDocument()
    expect(screen.getByText('UTILITIES')).toBeInTheDocument()
  })

  it('edits existing expense', async () => {
    const user = userEvent.setup()
    render(<AccountingSystem />)
    
    await waitFor(() => {
      expect(screen.getByText('Monthly Rent')).toBeInTheDocument()
    })
    
    // Find edit button for first expense
    const editButtons = screen.getAllByRole('button').filter(button => 
      button.querySelector('svg')?.getAttribute('data-lucide') === 'edit'
    )
    await user.click(editButtons[0])
    
    expect(screen.getByText('Edit Expense')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Monthly Rent')).toBeInTheDocument()
  })

  it('deletes expense', async () => {
    const user = userEvent.setup()
    render(<AccountingSystem />)
    
    await waitFor(() => {
      expect(screen.getByText('Monthly Rent')).toBeInTheDocument()
    })
    
    // Mock window.confirm
    const mockConfirm = jest.fn().mockReturnValue(true)
    window.confirm = mockConfirm
    
    // Find delete button for first expense
    const deleteButtons = screen.getAllByRole('button').filter(button => 
      button.querySelector('svg')?.getAttribute('data-lucide') === 'trash-2'
    )
    await user.click(deleteButtons[0])
    
    expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete this expense?')
  })

  it('validates expense form', async () => {
    const user = userEvent.setup()
    render(<AccountingSystem />)
    
    await waitFor(() => {
      expect(screen.getByText('Monthly Rent')).toBeInTheDocument()
    })
    
    // Go to add expense tab
    const addTab = screen.getByText('Add Expense')
    await user.click(addTab)
    
    // Try to submit empty form
    const addButton = screen.getByText('Add Expense')
    await user.click(addButton)
    
    // Form should not submit with empty fields
    expect(screen.getByPlaceholderText('Expense description')).toHaveValue('')
  })
})