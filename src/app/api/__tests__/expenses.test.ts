import { NextRequest } from 'next/server'
import { GET, POST, PUT, DELETE } from '../expenses/route'
import { db } from '@/lib/db'

// Mock the database
jest.mock('@/lib/db', () => ({
  db: {
    expense: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}))

const mockDb = db as jest.Mocked<typeof db>

describe('/api/expenses', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/expenses', () => {
    it('returns all expenses', async () => {
      const mockExpenses = [
        {
          id: '1',
          description: 'Office Rent',
          amount: 2500.00,
          category: 'RENT',
          date: '2024-01-01',
          notes: 'Monthly rent payment',
          isRecurring: true,
          recurringInterval: 'monthly',
          user: {
            name: 'John Doe',
            email: 'john@example.com',
          },
          createdAt: new Date(),
        }
      ]

      mockDb.expense.findMany.mockResolvedValue(mockExpenses as any)

      const request = new NextRequest('http://localhost:3000/api/expenses')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.expenses).toEqual(mockExpenses)
      expect(mockDb.expense.findMany).toHaveBeenCalledWith({
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          date: 'desc',
        },
      })
    })

    it('filters by category', async () => {
      const mockExpenses = []

      mockDb.expense.findMany.mockResolvedValue(mockExpenses as any)

      const request = new NextRequest('http://localhost:3000/api/expenses?category=RENT')
      const response = await GET(request)

      expect(response.status).toBe(200)
      expect(mockDb.expense.findMany).toHaveBeenCalledWith({
        where: {
          category: 'RENT',
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          date: 'desc',
        },
      })
    })

    it('filters by date range', async () => {
      const mockExpenses = []

      mockDb.expense.findMany.mockResolvedValue(mockExpenses as any)

      const request = new NextRequest('http://localhost:3000/api/expenses?dateFrom=2024-01-01&dateTo=2024-01-31')
      const response = await GET(request)

      expect(response.status).toBe(200)
      expect(mockDb.expense.findMany).toHaveBeenCalledWith({
        where: {
          date: {
            gte: new Date('2024-01-01'),
            lte: new Date('2024-01-31'),
          },
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          date: 'desc',
        },
      })
    })

    it('handles database errors', async () => {
      mockDb.expense.findMany.mockRejectedValue(new Error('Database error'))

      const request = new NextRequest('http://localhost:3000/api/expenses')
      const response = await GET(request)

      expect(response.status).toBe(500)
      const data = await response.json()
      expect(data.error).toBe('Failed to fetch expenses')
    })
  })

  describe('POST /api/expenses', () => {
    const mockExpenseData = {
      description: 'Office Supplies',
      amount: 150.00,
      category: 'SUPPLIES',
      date: '2024-01-15',
      notes: 'Pens, paper, etc.',
      isRecurring: false,
    }

    it('creates a new expense', async () => {
      const createdExpense = {
        id: '2',
        ...mockExpenseData,
        userId: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockDb.expense.create.mockResolvedValue(createdExpense as any)

      const request = new NextRequest('http://localhost:3000/api/expenses', {
        method: 'POST',
        body: JSON.stringify(mockExpenseData),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer valid-token',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.expense).toEqual(createdExpense)
      expect(mockDb.expense.create).toHaveBeenCalledWith({
        data: {
          ...mockExpenseData,
          amount: parseFloat(mockExpenseData.amount.toString()),
          userId: 'user-1', // This would come from authenticated user
        },
      })
    })

    it('validates required fields', async () => {
      const invalidExpense = {
        description: '',
        amount: -10,
        category: '',
        date: 'invalid-date',
      }

      const request = new NextRequest('http://localhost:3000/api/expenses', {
        method: 'POST',
        body: JSON.stringify(invalidExpense),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer valid-token',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid expense data')
    })

    it('requires authentication', async () => {
      const request = new NextRequest('http://localhost:3000/api/expenses', {
        method: 'POST',
        body: JSON.stringify(mockExpenseData),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('handles database errors during creation', async () => {
      mockDb.expense.create.mockRejectedValue(new Error('Database error'))

      const request = new NextRequest('http://localhost:3000/api/expenses', {
        method: 'POST',
        body: JSON.stringify(mockExpenseData),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer valid-token',
        },
      })

      const response = await POST(request)

      expect(response.status).toBe(500)
      const data = await response.json()
      expect(data.error).toBe('Failed to create expense')
    })
  })

  describe('PUT /api/expenses', () => {
    const mockUpdateData = {
      description: 'Updated Office Supplies',
      amount: 175.00,
      category: 'SUPPLIES',
      date: '2024-01-15',
      notes: 'Updated notes',
      isRecurring: false,
    }

    it('updates an existing expense', async () => {
      const updatedExpense = {
        id: '1',
        ...mockUpdateData,
        userId: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockDb.expense.update.mockResolvedValue(updatedExpense as any)

      const request = new NextRequest('http://localhost:3000/api/expenses/1', {
        method: 'PUT',
        body: JSON.stringify(mockUpdateData),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer valid-token',
        },
      })

      // Mock URL params
      const mockUrl = new URL('http://localhost:3000/api/expenses/1')
      jest.spyOn(request, 'url', 'get').mockReturnValue(mockUrl.toString())

      const response = await PUT(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.expense).toEqual(updatedExpense)
      expect(mockDb.expense.update).toHaveBeenCalledWith({
        where: {
          id: '1',
        },
        data: {
          ...mockUpdateData,
          amount: parseFloat(mockUpdateData.amount.toString()),
        },
      })
    })

    it('validates expense ID', async () => {
      const request = new NextRequest('http://localhost:3000/api/expenses/invalid-id', {
        method: 'PUT',
        body: JSON.stringify(mockUpdateData),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer valid-token',
        },
      })

      const mockUrl = new URL('http://localhost:3000/api/expenses/invalid-id')
      jest.spyOn(request, 'url', 'get').mockReturnValue(mockUrl.toString())

      const response = await PUT(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid expense ID')
    })

    it('requires authentication', async () => {
      const request = new NextRequest('http://localhost:3000/api/expenses/1', {
        method: 'PUT',
        body: JSON.stringify(mockUpdateData),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const mockUrl = new URL('http://localhost:3000/api/expenses/1')
      jest.spyOn(request, 'url', 'get').mockReturnValue(mockUrl.toString())

      const response = await PUT(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })
  })

  describe('DELETE /api/expenses', () => {
    it('deletes an expense', async () => {
      const deletedExpense = {
        id: '1',
        description: 'Office Supplies',
        amount: 150.00,
        category: 'SUPPLIES',
        date: '2024-01-15',
        notes: 'Pens, paper, etc.',
        isRecurring: false,
        userId: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockDb.expense.delete.mockResolvedValue(deletedExpense as any)

      const request = new NextRequest('http://localhost:3000/api/expenses/1', {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer valid-token',
        },
      })

      const mockUrl = new URL('http://localhost:3000/api/expenses/1')
      jest.spyOn(request, 'url', 'get').mockReturnValue(mockUrl.toString())

      const response = await DELETE(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe('Expense deleted successfully')
      expect(mockDb.expense.delete).toHaveBeenCalledWith({
        where: {
          id: '1',
        },
      })
    })

    it('validates expense ID', async () => {
      const request = new NextRequest('http://localhost:3000/api/expenses/invalid-id', {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer valid-token',
        },
      })

      const mockUrl = new URL('http://localhost:3000/api/expenses/invalid-id')
      jest.spyOn(request, 'url', 'get').mockReturnValue(mockUrl.toString())

      const response = await DELETE(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid expense ID')
    })

    it('requires authentication', async () => {
      const request = new NextRequest('http://localhost:3000/api/expenses/1', {
        method: 'DELETE',
      })

      const mockUrl = new URL('http://localhost:3000/api/expenses/1')
      jest.spyOn(request, 'url', 'get').mockReturnValue(mockUrl.toString())

      const response = await DELETE(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('handles database errors during deletion', async () => {
      mockDb.expense.delete.mockRejectedValue(new Error('Database error'))

      const request = new NextRequest('http://localhost:3000/api/expenses/1', {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer valid-token',
        },
      })

      const mockUrl = new URL('http://localhost:3000/api/expenses/1')
      jest.spyOn(request, 'url', 'get').mockReturnValue(mockUrl.toString())

      const response = await DELETE(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to delete expense')
    })
  })
})