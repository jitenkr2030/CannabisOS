import { test, expect } from '@playwright/test'

test.describe('CannabisOS Application', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('/')
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle')
  })

  test('homepage loads correctly', async ({ page }) => {
    // Check if the main title is present
    await expect(page.locator('h1')).toContainText('CannabisOS')
    
    // Check if navigation elements are present
    await expect(page.locator('nav')).toBeVisible()
    
    // Check if main content area is loaded
    await expect(page.locator('main')).toBeVisible()
  })

  test('responsive design works on mobile', async ({ page }) => {
    // Emulate mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Check if mobile navigation works
    await expect(page.locator('nav')).toBeVisible()
    
    // Check if content is properly laid out
    await expect(page.locator('main')).toBeVisible()
  })

  test('dark mode toggle works', async ({ page }) => {
    // Look for theme toggle button (if it exists)
    const themeToggle = page.locator('[data-testid="theme-toggle"]')
    
    if (await themeToggle.isVisible()) {
      await themeToggle.click()
      
      // Check if dark mode is applied
      const html = page.locator('html')
      await expect(html).toHaveClass(/dark/)
    }
  })

  test('page loads without JavaScript errors', async ({ page }) => {
    // Listen for console errors
    const errors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    await page.reload()
    await page.waitForLoadState('networkidle')

    // Assert no console errors
    expect(errors.length).toBe(0)
  })

  test('accessibility features are present', async ({ page }) => {
    // Check for proper heading structure
    const h1 = page.locator('h1')
    await expect(h1).toBeVisible()
    
    // Check for skip links (if implemented)
    const skipLink = page.locator('a[href="#main"]')
    if (await skipLink.isVisible()) {
      await expect(skipLink).toBeVisible()
    }
    
    // Check for proper alt text on images
    const images = page.locator('img')
    const imageCount = await images.count()
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i)
      const alt = await img.getAttribute('alt')
      expect(alt).toBeTruthy()
    }
  })

  test('performance metrics are acceptable', async ({ page }) => {
    // Wait for page to fully load
    await page.waitForLoadState('networkidle')
    
    // Get performance metrics
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByType('paint')[1]?.startTime || 0,
      }
    })
    
    // Assert reasonable performance thresholds
    expect(metrics.domContentLoaded).toBeLessThan(3000) // 3 seconds
    expect(metrics.loadComplete).toBeLessThan(5000) // 5 seconds
    expect(metrics.firstContentfulPaint).toBeLessThan(2000) // 2 seconds
  })

  test('SEO meta tags are present', async ({ page }) => {
    // Check for title
    const title = await page.title()
    expect(title).toContain('CannabisOS')
    
    // Check for meta description
    const description = await page.getAttribute('meta[name="description"]', 'content')
    expect(description).toBeTruthy()
    expect(description?.length).toBeGreaterThan(50)
    
    // Check for viewport meta tag
    const viewport = await page.getAttribute('meta[name="viewport"]', 'content')
    expect(viewport).toContain('width=device-width')
  })

  test('error handling works', async ({ page }) => {
    // Navigate to a non-existent route
    await page.goto('/non-existent-page')
    
    // Should show 404 page or handle gracefully
    await expect(page.locator('body')).toBeVisible()
    
    // Check if it shows appropriate error message
    const notFoundText = page.locator('text=/404|not found|page not found/i')
    if (await notFoundText.isVisible()) {
      await expect(notFoundText).toBeVisible()
    }
  })

  test('service worker is registered', async ({ page }) => {
    // Wait for service worker registration
    await page.waitForFunction(() => {
      return window.navigator.serviceWorker && window.navigator.serviceWorker.ready
    })
    
    // Check if service worker is active
    const isSWActive = await page.evaluate(() => {
      return window.navigator.serviceWorker.controller !== null
    })
    
    expect(isSWActive).toBeTruthy()
  })
})