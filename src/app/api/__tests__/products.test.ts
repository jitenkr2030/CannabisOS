import { NextRequest } from 'next/server'
import { GET, POST } from '../route'
import { mockDb } from '@/lib/__tests__/test-db'

// Mock the database
jest.mock('@/lib/db', () => ({
  db: mockDb,
}))

describe('/api/products', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/products', () => {
    it('returns all products', async () => {
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
        }
      ]

      mockDb.product.findMany.mockResolvedValue(mockProducts as any)

      const request = new NextRequest('http://localhost:3000/api/products')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.products).toEqual(mockProducts)
      expect(mockDb.product.findMany).toHaveBeenCalledWith({
        include: {
          inventory: true,
        },
        orderBy: {
          name: 'asc',
        },
      })
    })

    it('handles database errors', async () => {
      mockDb.product.findMany.mockRejectedValue(new Error('Database error'))

      const request = new NextRequest('http://localhost:3000/api/products')
      const response = await GET(request)

      expect(response.status).toBe(500)
      const data = await response.json()
      expect(data.error).toBe('Failed to fetch products')
    })

    it('filters by category', async () => {
      const mockProducts = [
        {
          id: '1',
          name: 'Blue Dream',
          sku: 'BD-001',
          category: 'FLOWER',
          thcContent: 18.5,
          cbdContent: 0.2,
          price: 35.00,
          inventory: [],
        }
      ]

      mockDb.product.findMany.mockResolvedValue(mockProducts as any)

      const request = new NextRequest('http://localhost:3000/api/products?category=FLOWER')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(mockDb.product.findMany).toHaveBeenCalledWith({
        where: {
          category: 'FLOWER',
        },
        include: {
          inventory: true,
        },
        orderBy: {
          name: 'asc',
        },
      })
    })
  })

  describe('POST /api/products', () => {
    it('creates a new product', async () => {
      const newProduct = {
        name: 'OG Kush',
        sku: 'OGK-001',
        category: 'FLOWER',
        thcContent: 22.0,
        cbdContent: 0.1,
        price: 40.00,
      }

      const createdProduct = {
        id: '2',
        ...newProduct,
        inventory: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockDb.product.create.mockResolvedValue(createdProduct as any)

      const request = new NextRequest('http://localhost:3000/api/products', {
        method: 'POST',
        body: JSON.stringify(newProduct),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.product).toEqual(createdProduct)
      expect(mockDb.product.create).toHaveBeenCalledWith({
        data: {
          ...newProduct,
          thcContent: parseFloat(newProduct.thcContent.toString()),
          cbdContent: parseFloat(newProduct.cbdContent.toString()),
          price: parseFloat(newProduct.price.toString()),
        },
        include: {
          inventory: true,
        },
      })
    })

    it('validates required fields', async () => {
      const invalidProduct = {
        name: '',
        sku: 'TEST-001',
        category: 'FLOWER',
        price: -10,
      }

      const request = new NextRequest('http://localhost:3000/api/products', {
        method: 'POST',
        body: JSON.stringify(invalidProduct),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid product data')
    })

    it('handles database errors during creation', async () => {
      const newProduct = {
        name: 'Test Product',
        sku: 'TEST-001',
        category: 'FLOWER',
        thcContent: 20.0,
        cbdContent: 0.5,
        price: 35.00,
      }

      mockDb.product.create.mockRejectedValue(new Error('Database error'))

      const request = new NextRequest('http://localhost:3000/api/products', {
        method: 'POST',
        body: JSON.stringify(newProduct),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)

      expect(response.status).toBe(500)
      const data = await response.json()
      expect(data.error).toBe('Failed to create product')
    })

    it('parses numeric fields correctly', async () => {
      const newProduct = {
        name: 'Test Product',
        sku: 'TEST-001',
        category: 'FLOWER',
        thcContent: '20.5',
        cbdContent: '0.5',
        price: '35.50',
      }

      const createdProduct = {
        id: '2',
        name: 'Test Product',
        sku: 'TEST-001',
        category: 'FLOWER',
        thcContent: 20.5,
        cbdContent: 0.5,
        price: 35.50,
        inventory: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockDb.product.create.mockResolvedValue(createdProduct as any)

      const request = new NextRequest('http://localhost:3000/api/products', {
        method: 'POST',
        body: JSON.stringify(newProduct),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)

      expect(response.status).toBe(201)
      expect(mockDb.product.create).toHaveBeenCalledWith({
        data: {
          name: 'Test Product',
          sku: 'TEST-001',
          category: 'FLOWER',
          thcContent: 20.5,
          cbdContent: 0.5,
          price: 35.5,
        },
        include: {
          inventory: true,
        },
      })
    })
  })
})