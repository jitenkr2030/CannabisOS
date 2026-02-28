import { db } from './db'

// Simple demo data for testing
export const demoUsers = [
  {
    email: 'admin@cannabisos.com',
    name: 'Admin User',
    password: 'admin123',
    role: 'ADMIN',
    phone: '+1-555-0101',
    isActive: true,
  },
  {
    email: 'manager@cannabisos.com',
    name: 'Store Manager',
    password: 'manager123',
    role: 'MANAGER',
    phone: '+1-555-0102',
    isActive: true,
  },
  {
    email: 'staff@cannabisos.com',
    name: 'Staff User',
    password: 'staff123',
    role: 'STAFF',
    phone: '+1-555-0103',
    isActive: true,
  },
  {
    email: 'driver@cannabisos.com',
    name: 'Delivery Driver',
    password: 'driver123',
    role: 'DRIVER',
    phone: '+1-555-0104',
    isActive: true,
  },
  {
    email: 'accountant@cannabisos.com',
    name: 'Accountant',
    password: 'accountant123',
    role: 'ACCOUNTANT',
    phone: '+1-555-0105',
    isActive: true,
  },
  {
    email: 'consultant@cannabisos.com',
    name: 'Compliance Consultant',
    password: 'consultant123',
    role: 'CONSULTANT',
    phone: '+1-555-0106',
    isActive: true,
  },
  {
    email: 'partner@cannabisos.com',
    name: 'Business Partner',
    password: 'partner123',
    role: 'PARTNER',
    phone: '+1-555-0107',
    isActive: true,
  },
]

export const demoProducts = [
  {
    name: 'Blue Dream',
    sku: 'BD-001',
    category: 'FLOWER',
    thcContent: 18.5,
    cbdContent: 0.5,
    weight: 3.5,
    unit: 'g',
    price: 35.00,
    cost: 20.00,
    description: 'Popular hybrid strain with blueberry flavor',
    imageUrl: '/images/products/blue-dream.jpg',
    tags: '["hybrid", "popular", "blueberry"]',
    isActive: true,
    requiresAge: true,
    minAge: 19,
  },
  {
    name: 'Girl Scout Cookies',
    sku: 'GSC-002',
    category: 'FLOWER',
    thcContent: 22.0,
    cbdContent: 0.2,
    weight: 3.5,
    unit: 'g',
    price: 40.00,
    cost: 25.00,
    description: 'Classic GSC with sweet, earthy flavor',
    imageUrl: '/images/products/gsc.jpg',
    tags: '["hybrid", "classic", "sweet"]',
    isActive: true,
    requiresAge: true,
    minAge: 19,
  },
  {
    name: 'OG Kush',
    sku: 'OGK-003',
    category: 'FLOWER',
    thcContent: 20.0,
    cbdContent: 1.0,
    weight: 3.5,
    unit: 'g',
    price: 38.00,
    cost: 23.00,
    description: 'Legendary OG Kush with pine and lemon flavor',
    imageUrl: '/images/products/og-kush.jpg',
    tags: '["indica", "legendary", "pine"]',
    isActive: true,
    requiresAge: true,
    minAge: 19,
  },
  {
    name: 'Sour Diesel',
    sku: 'SD-004',
    category: 'FLOWER',
    thcContent: 19.0,
    cbdContent: 0.8,
    weight: 3.5,
    unit: 'g',
    price: 36.00,
    cost: 22.00,
    description: 'Energizing sativa with diesel-like aroma',
    imageUrl: '/images/products/sour-diesel.jpg',
    tags: '["sativa", "energizing", "diesel"]',
    isActive: true,
    requiresAge: true,
    minAge: 19,
  },
  {
    name: 'CBD Tincture 500mg',
    sku: 'CBD-TIN-001',
    category: 'TINCTURES',
    thcContent: 0.0,
    cbdContent: 20.0,
    weight: 30,
    unit: 'ml',
    price: 45.00,
    cost: 25.00,
    description: 'High-potency CBD tincture for wellness',
    imageUrl: '/images/products/cbd-tincture.jpg',
    tags: '["cbd", "tincture", "wellness"]',
    isActive: true,
    requiresAge: true,
    minAge: 19,
  },
  {
    name: 'THC Gummies 10mg',
    sku: 'THC-GUM-001',
    category: 'EDIBLES',
    thcContent: 10.0,
    cbdContent: 0.0,
    weight: 10,
    unit: 'g',
    price: 25.00,
    cost: 12.00,
    description: 'Fruit-flavored THC gummies, 10mg each',
    imageUrl: '/images/products/thc-gummies.jpg',
    tags: '["edible", "gummies", "fruit"]',
    isActive: true,
    requiresAge: true,
    minAge: 19,
  },
]

export const demoStats = {
  todaySales: 4285,
  activeOrders: 23,
  lowStockItems: 7,
  pendingDeliveries: 5,
  totalCustomers: 156,
  totalProducts: 6,
  totalRevenue: 15420.50,
  monthlyGrowth: 12.5,
}

export const demoRecentActivity = [
  {
    id: 1,
    action: 'New sale completed',
    detail: 'Order #1234 - $156.50',
    time: '2 min ago',
    type: 'sale',
  },
  {
    id: 2,
    action: 'Inventory alert',
    detail: 'Blue Dream - Low stock (3g remaining)',
    time: '15 min ago',
    type: 'alert',
  },
  {
    id: 3,
    action: 'Delivery assigned',
    detail: 'Order #1232 to Driver John',
    time: '1 hour ago',
    type: 'delivery',
  },
  {
    id: 4,
    action: 'Expense added',
    detail: 'Transport costs - $45 via voice',
    time: '2 hours ago',
    type: 'expense',
  },
]

export const demoSettings = {
  businessName: 'CannabisOS Demo Dispensary',
  businessAddress: '123 Queen Street West, Toronto, ON M5V 2A6',
  businessPhone: '+1-416-555-0123',
  businessEmail: 'info@cannabisos.com',
  taxRate: 0.13,
  currency: 'CAD',
  timezone: 'America/Toronto',
}

// Function to create demo user for testing
export async function createDemoUser(userData: any) {
  try {
    // This would create a user in the database
    // For now, return mock user data
    return {
      id: `user_${Date.now()}`,
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  } catch (error) {
    console.error('Error creating demo user:', error)
    throw error
  }
}

// Function to get demo products
export function getDemoProducts() {
  return demoProducts
}

// Function to get demo stats
export function getDemoStats() {
  return demoStats
}

// Function to get demo recent activity
export function getDemoRecentActivity() {
  return demoRecentActivity
}

// Function to get demo settings
export function getDemoSettings() {
  return demoSettings
}
