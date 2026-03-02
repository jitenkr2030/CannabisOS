import { z } from 'zod'

// User validation schemas
export const UserRegistrationSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  businessName: z.string().optional(),
  businessType: z.string().optional(),
})

export const UserLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

// Payment validation schemas
export const CreateOrderSchema = z.object({
  planId: z.string().min(1, 'Plan ID is required'),
  billingCycle: z.enum(['monthly', 'yearly']),
  customerDetails: z.object({
    customer_id: z.string().min(1, 'Customer ID is required'),
    customer_name: z.string().min(1, 'Customer name is required'),
    customer_email: z.string().email('Invalid customer email'),
    customer_phone: z.string().optional(),
  }),
})

export const SubscriptionCreateSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  planId: z.string().min(1, 'Plan ID is required'),
  billingCycle: z.enum(['monthly', 'yearly']),
  customerDetails: z.object({
    customer_id: z.string().min(1, 'Customer ID is required'),
    customer_name: z.string().min(1, 'Customer name is required'),
    customer_email: z.string().email('Invalid customer email'),
    customer_phone: z.string().optional(),
  }),
})

// Product validation schemas
export const ProductCreateSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  sku: z.string().min(1, 'SKU is required'),
  category: z.enum(['FLOWER', 'EDIBLES', 'CONCENTRATES', 'VAPES', 'TOPICALS', 'TINCTURES', 'ACCESSORIES']),
  price: z.number().min(0, 'Price must be positive'),
  thcContent: z.number().min(0).max(100).optional(),
  cbdContent: z.number().min(0).max(100).optional(),
  weight: z.number().min(0).optional(),
  unit: z.string().default('g'),
})

// Inventory validation schemas
export const InventoryUpdateSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().min(0, 'Quantity must be positive'),
  location: z.string().optional(),
})

// Sale validation schemas
export const SaleCreateSchema = z.object({
  items: z.array(z.object({
    productId: z.string().min(1, 'Product ID is required'),
    quantity: z.number().min(1, 'Quantity must be positive'),
    unitPrice: z.number().min(0, 'Unit price must be positive'),
  })),
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),
  customerEmail: z.string().email().optional(),
  paymentMethod: z.enum(['CASH', 'DEBIT', 'CREDIT', 'ETRANSFER', 'CRYPTO', 'STORE_CREDIT']),
})

// API Response schemas
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
})

export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  message: z.string().optional(),
  details: z.any().optional(),
})
