import { NextRequest } from 'next/server'
import { GET, POST } from '../sales/route'
import { db } from '@/lib/db'

// Mock the database
jest.mock('@/lib/db', () => ({
  db: {
    sale: {
      findMany: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
    },
    product: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    inventory: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  },
}))

const mockDb = db as jest.Mocked<typeof db>

describe('/api/sales', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/sales', () => {
    it('returns all sales', async () => {
      const mockSales = [
        {
          id: '1',
          customerName: 'John Doe',
          customerPhone: '555-1234',
          customerEmail: 'john@example.com',
          subtotal: 100.00,
          tax: 13.00,
          discount: 0,
          total: 113.00,
          paymentMethod: 'CASH',
          ageVerified: true,
          verifiedBy: 'Staff User',
          notes: 'Regular customer',
          items: [
            {
              id: '1',
              productId: 'prod-1',
              quantity: 2,
              unitPrice: 50.00,
              total: 100.00,
            }
          ],
          createdAt: new Date(),
        }
      ]

      mockDb.sale.findMany.mockResolvedValue(mockSales as any)

      const request = new NextRequest('http://localhost:3000/api/sales')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.sales).toEqual(mockSales)
      expect(mockDb.sale.findMany).toHaveBeenCalledWith({
        include: {
          items: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    })

    it('filters by date range', async () => {
      const mockSales = []

      mockDb.sale.findMany.mockResolvedValue(mockSales as any)

      const request = new NextRequest('http://localhost:3000/api/sales?dateFrom=2024-01-01&dateTo=2024-01-31')
      const response = await GET(request)

      expect(response.status).toBe(200)
      expect(mockDb.sale.findMany).toHaveBeenCalledWith({
        where: {
          createdAt: {
            gte: new Date('2024-01-01'),
            lte: new Date('2024-01-31'),
          },
        },
        include: {
          items: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    })

    it('handles database errors', async () => {
      mockDb.sale.findMany.mockRejectedValue(new Error('Database error'))

      const request = new NextRequest('http://localhost:3000/api/sales')
      const response = await GET(request)

      expect(response.status).toBe(500)
      const data = await response.json()
      expect(data.error).toBe('Failed to fetch sales')
    })
  })

  describe('POST /api/sales', () => {
    const mockSaleData = {
      customerName: 'Jane Doe',
      customerPhone: '555-5678',
      customerEmail: 'jane@example.com',
      subtotal: 75.00,
      tax: 9.75,
      discount: 0,
      total: 84.75,
      paymentMethod: 'CREDIT',
      ageVerified: true,
      verifiedBy: 'Staff User',
      notes: 'New customer',
      items: [
        {
          productId: 'prod-1',
          quantity: 1,
          unitPrice: 75.00,
          total: 75.00,
        }
      ],
    }

    it('creates a new sale', async () => {
      const createdSale = {
        id: '2',
        ...mockSaleData,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockDb.sale.create.mockResolvedValue(createdSale as any)

      const request = new NextRequest('http://localhost:3000/api/sales', {
        method: 'POST',
        body: JSON.stringify(mockSaleData),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer valid-token',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.sale).toEqual(createdSale)
      expect(mockDb.sale.create).toHaveBeenCalledWith({
        data: {
          ...mockSaleData,
          subtotal: parseFloat(mockSaleData.subtotal.toString()),
          tax: parseFloat(mockSaleData.tax.toString()),
          discount: parseFloat(mockSaleData.discount.toString()),
          total: parseFloat(mockSaleData.total.toString()),
          items: {
            create: mockSaleData.items,
          },
        },
        include: {
          items: true,
        },
      })
    })

    it('validates age verification', async () => {
      const invalidSaleData = {
        ...mockSaleData,
        ageVerified: false,
      }

      const request = new NextRequest('http://localhost:3000/api/sales', {
        method: 'POST',
        body: JSON.stringify(invalidSaleData),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer valid-token',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Age verification is required')
    })

    it('validates sale items', async () => {
      const invalidSaleData = {
        ...mockSaleData,
        items: [],
      }

      const request = new NextRequest('http://localhost:3000/api/sales', {
        method: 'POST',
        body: JSON.stringify(invalidSaleData),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer valid-token',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('At least one item is required')
    })

    it('updates inventory on successful sale', async () => {
      const createdSale = {
        id: '2',
        ...mockSaleData,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const mockProduct = {
        id: 'prod-1',
        name: 'Test Product',
        inventory: [
          {
            id: 'inv-1',
            quantity: 100,
            available: 95,
            reserved: 5,
          }
        ],
      }

      mockDb.sale.create.mockResolvedValue(createdSale as any)
      mockDb.product.findUnique.mockResolvedValue(mockProduct as any)
      mockDb.inventory.update.mockResolvedValue({} as any)

      const request = new NextRequest('http://localhost:3000/api/sales', {
        method: 'POST',
        body: JSON.stringify(mockSaleData),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer valid-token',
        },
      })

      const response = await POST(request)

      expect(response.status).toBe(201)
      expect(mockDb.inventory.update).toHaveBeenCalledWith({
        where: {
          id: 'inv-1',
        },
        data: {
          available: 94, // 95 - 1
          reserved: 6,   // 5 + 1
        },
      })
    })

    it('validates inventory availability', async () => {
      const createdSale = {
        id: '2',
        ...mockSaleData,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const mockProduct = {
        id: 'prod-1',
        name: 'Test Product',
        inventory: [
          {
            id: 'inv-1',
            quantity: 100,
            available: 0, // Out of stock
            reserved: 0,
          }
        ],
      }

      mockDb.sale.create.mockResolvedValue(createdSale as any)
      mockDb.product.findUnique.mockResolvedValue(mockProduct as any)

      const request = new NextRequest('http://localhost:3000/api/sales', {
        method: 'POST',
        body: JSON.stringify(mockSaleData),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer valid-token',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Insufficient inventory for product Test Product')
    })

    it('requires authentication', async () => {
      const request = new NextRequest('http://localhost:3000/api/sales', {
        method: 'POST',
        body: JSON.stringify(mockSaleData),
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
      mockDb.sale.create.mockRejectedValue(new Error('Database error'))

      const request = new NextRequest('http://localhost:3000/api/sales', {
        method: 'POST',
        body: JSON.stringify(mockSaleData),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer valid-token',
        },
      })

      const response = await POST(request)

      expect(response.status).toBe(500)
      const data = await response.json()
      expect(data.error).toBe('Failed to create sale')
    })
  })
})