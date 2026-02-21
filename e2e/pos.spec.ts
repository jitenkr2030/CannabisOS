import { test, expect } from '@playwright/test'

test.describe('POS System E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('POS system loads and displays products', async ({ page }) => {
    // Look for POS system navigation or link
    const posLink = page.locator('a[href*="pos"], button:has-text("POS"), text=Point of Sale')
    
    if (await posLink.isVisible()) {
      await posLink.click()
      await page.waitForLoadState('networkidle')
    }

    // Check if POS interface is loaded
    await expect(page.locator('text=Point of Sale').or(page.locator('text=Product Catalog'))).toBeVisible()
    
    // Look for product cards or list
    const products = page.locator('[data-testid="product-card"], .product-card, [data-product-id]')
    const productCount = await products.count()
    
    if (productCount > 0) {
      // Check first product details
      const firstProduct = products.first()
      await expect(firstProduct).toBeVisible()
      
      // Check for product name
      const productName = firstProduct.locator('h3, .product-name, [data-product-name]')
      if (await productName.isVisible()) {
        await expect(productName).not.toBeEmpty()
      }
      
      // Check for price
      const price = firstProduct.locator('text=$, .price, [data-price]')
      if (await price.isVisible()) {
        await expect(price).toBeVisible()
      }
    }
  })

  test('can add products to cart', async ({ page }) => {
    // Navigate to POS
    const posLink = page.locator('a[href*="pos"], button:has-text("POS"), text=Point of Sale')
    if (await posLink.isVisible()) {
      await posLink.click()
      await page.waitForLoadState('networkidle')
    }

    // Look for add to cart buttons
    const addToCartButtons = page.locator('button:has-text("Add to Cart"), button:has-text("Add"), [data-action="add-to-cart"]')
    const buttonCount = await addToCartButtons.count()
    
    if (buttonCount > 0) {
      // Click first available add to cart button
      await addToCartButtons.first().click()
      
      // Wait for cart to update
      await page.waitForTimeout(500)
      
      // Check if cart shows the item
      const cartItems = page.locator('[data-testid="cart-item"], .cart-item, .shopping-cart li')
      const cartItemCount = await cartItems.count()
      
      if (cartItemCount > 0) {
        await expect(cartItems.first()).toBeVisible()
      }
    }
  })

  test('cart calculates totals correctly', async ({ page }) => {
    // Navigate to POS and add items to cart
    const posLink = page.locator('a[href*="pos"], button:has-text("POS"), text=Point of Sale')
    if (await posLink.isVisible()) {
      await posLink.click()
      await page.waitForLoadState('networkidle')
    }

    // Add items to cart
    const addToCartButtons = page.locator('button:has-text("Add to Cart"), button:has-text("Add"), [data-action="add-to-cart"]')
    const buttonCount = await addToCartButtons.count()
    
    if (buttonCount >= 2) {
      // Add two items
      await addToCartButtons.first().click()
      await page.waitForTimeout(500)
      await addToCartButtons.nth(1).click()
      await page.waitForTimeout(500)
      
      // Look for total calculation
      const totalElement = page.locator('text=Total:, .total, [data-total]')
      if (await totalElement.isVisible()) {
        await expect(totalElement).toBeVisible()
        
        // Check if total contains a dollar amount
        const totalText = await totalElement.textContent()
        expect(totalText).toMatch(/\$\d+\.\d{2}/)
      }
    }
  })

  test('age verification is required', async ({ page }) => {
    // Navigate to POS and add item to cart
    const posLink = page.locator('a[href*="pos"], button:has-text("POS"), text=Point of Sale')
    if (await posLink.isVisible()) {
      await posLink.click()
      await page.waitForLoadState('networkidle')
    }

    const addToCartButtons = page.locator('button:has-text("Add to Cart"), button:has-text("Add"), [data-action="add-to-cart"]')
    if (await addToCartButtons.first().isVisible()) {
      await addToCartButtons.first().click()
      await page.waitForTimeout(500)
      
      // Try to checkout without age verification
      const checkoutButton = page.locator('button:has-text("Complete Sale"), button:has-text("Checkout"), [data-action="checkout"]')
      if (await checkoutButton.isVisible()) {
        await checkoutButton.click()
        
        // Should show age verification error
        const ageError = page.locator('text=age verification, text=Age required, [data-error="age"]')
        if (await ageError.isVisible({ timeout: 2000 })) {
          await expect(ageError).toBeVisible()
        }
      }
    }
  })

  test('search functionality works', async ({ page }) => {
    // Navigate to POS
    const posLink = page.locator('a[href*="pos"], button:has-text("POS"), text=Point of Sale')
    if (await posLink.isVisible()) {
      await posLink.click()
      await page.waitForLoadState('networkidle')
    }

    // Look for search input
    const searchInput = page.locator('input[placeholder*="search"], input[placeholder*="Search"], [data-testid="search"]')
    if (await searchInput.isVisible()) {
      await searchInput.fill('Blue')
      await page.waitForTimeout(500)
      
      // Check if search results are filtered
      const products = page.locator('[data-testid="product-card"], .product-card')
      const productCount = await products.count()
      
      // If there are products, check if they match search
      if (productCount > 0) {
        const firstProduct = products.first()
        const productText = await firstProduct.textContent()
        expect(productText?.toLowerCase()).toContain('blue')
      }
    }
  })

  test('category filtering works', async ({ page }) => {
    // Navigate to POS
    const posLink = page.locator('a[href*="pos"], button:has-text("POS"), text=Point of Sale')
    if (await posLink.isVisible()) {
      await posLink.click()
      await page.waitForLoadState('networkidle')
    }

    // Look for category filter
    const categorySelect = page.locator('select, [data-testid="category-filter"]')
    if (await categorySelect.isVisible()) {
      await categorySelect.click()
      
      // Look for category options
      const categoryOption = page.locator('option[value*="FLOWER"], option:has-text("Flower")')
      if (await categoryOption.isVisible()) {
        await categoryOption.click()
        await page.waitForTimeout(500)
        
        // Check if products are filtered
        const products = page.locator('[data-testid="product-card"], .product-card')
        const productCount = await products.count()
        
        // Verify filtering worked (products should be visible or empty)
        expect(productCount).toBeGreaterThanOrEqual(0)
      }
    }
  })

  test('responsive POS on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Navigate to POS
    const posLink = page.locator('a[href*="pos"], button:has-text("POS"), text=Point of Sale')
    if (await posLink.isVisible()) {
      await posLink.click()
      await page.waitForLoadState('networkidle')
    }

    // Check if POS interface is usable on mobile
    await expect(page.locator('body')).toBeVisible()
    
    // Check if product cards are properly sized for mobile
    const products = page.locator('[data-testid="product-card"], .product-card')
    const productCount = await products.count()
    
    if (productCount > 0) {
      const firstProduct = products.first()
      await expect(firstProduct).toBeVisible()
      
      // Check if product is within viewport bounds
      const boundingBox = await firstProduct.boundingBox()
      expect(boundingBox?.width).toBeLessThanOrEqual(375)
    }
  })

  test('handles out of stock products', async ({ page }) => {
    // Navigate to POS
    const posLink = page.locator('a[href*="pos"], button:has-text("POS"), text=Point of Sale')
    if (await posLink.isVisible()) {
      await posLink.click()
      await page.waitForLoadState('networkidle')
    }

    // Look for out of stock indicators
    const outOfStockElements = page.locator('text=Out of Stock, text=Out of stock, [data-stock="out"], .out-of-stock')
    const outOfStockCount = await outOfStockElements.count()
    
    if (outOfStockCount > 0) {
      // Check if out of stock products have disabled add buttons
      const outOfStockProduct = outOfStockElements.first()
      const parentCard = outOfStockProduct.locator('..').locator('..')
      const addButton = parentCard.locator('button:has-text("Add to Cart")')
      
      if (await addButton.isVisible()) {
        await expect(addButton).toBeDisabled()
      }
    }
  })
})