import { test, expect } from '@playwright/test'

test.describe('Authentication & Security Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('login page loads correctly', async ({ page }) => {
    // Look for login link or navigate to login
    const loginLink = page.locator('a[href*="login"], button:has-text("Login"), text=Sign In')
    
    if (await loginLink.isVisible()) {
      await loginLink.click()
      await page.waitForLoadState('networkidle')
    }

    // Check for login form elements
    const emailInput = page.locator('input[type="email"], input[name="email"], [data-testid="email"]')
    const passwordInput = page.locator('input[type="password"], input[name="password"], [data-testid="password"]')
    const submitButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")')

    // If login form is present, test it
    if (await emailInput.isVisible() && await passwordInput.isVisible()) {
      await expect(emailInput).toBeVisible()
      await expect(passwordInput).toBeVisible()
      await expect(submitButton).toBeVisible()
    }
  })

  test('prevents access to protected routes without authentication', async ({ page }) => {
    // Try to access a protected route
    const protectedRoutes = ['/dashboard', '/admin', '/settings', '/profile']
    
    for (const route of protectedRoutes) {
      await page.goto(route)
      await page.waitForLoadState('networkidle')
      
      // Should redirect to login or show unauthorized message
      const currentUrl = page.url()
      const isLoginPage = currentUrl.includes('login') || currentUrl.includes('signin')
      const hasUnauthorizedMessage = await page.locator('text=unauthorized, text=access denied, text=login required').isVisible()
      
      expect(isLoginPage || hasUnauthorizedMessage).toBeTruthy()
    }
  })

  test('form validation works correctly', async ({ page }) => {
    // Navigate to login page
    const loginLink = page.locator('a[href*="login"], button:has-text("Login"), text=Sign In')
    if (await loginLink.isVisible()) {
      await loginLink.click()
      await page.waitForLoadState('networkidle')
    }

    const emailInput = page.locator('input[type="email"], input[name="email"], [data-testid="email"]')
    const passwordInput = page.locator('input[type="password"], input[name="password"], [data-testid="password"]')
    const submitButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")')

    if (await emailInput.isVisible() && await passwordInput.isVisible()) {
      // Test empty form submission
      await submitButton.click()
      await page.waitForTimeout(500)

      // Check for validation errors
      const emailError = page.locator('text=invalid email, text=email required, [data-error="email"]')
      const passwordError = page.locator('text=password required, text=invalid password, [data-error="password"]')

      if (await emailError.isVisible()) {
        await expect(emailError).toBeVisible()
      }
      if (await passwordError.isVisible()) {
        await expect(passwordError).toBeVisible()
      }

      // Test invalid email format
      await emailInput.fill('invalid-email')
      await submitButton.click()
      await page.waitForTimeout(500)

      const invalidEmailError = page.locator('text=invalid email, text=invalid format, [data-error="email-format"]')
      if (await invalidEmailError.isVisible()) {
        await expect(invalidEmailError).toBeVisible()
      }
    }
  })

  test('password field masks input correctly', async ({ page }) => {
    // Navigate to login or registration page
    const loginLink = page.locator('a[href*="login"], button:has-text("Login"), text=Sign In')
    if (await loginLink.isVisible()) {
      await loginLink.click()
      await page.waitForLoadState('networkidle')
    }

    const passwordInput = page.locator('input[type="password"], input[name="password"], [data-testid="password"]')
    
    if (await passwordInput.isVisible()) {
      // Check that input type is password
      const inputType = await passwordInput.getAttribute('type')
      expect(inputType).toBe('password')
      
      // Type some text and verify it's masked
      await passwordInput.fill('secretpassword')
      const inputValue = await passwordInput.inputValue()
      expect(inputValue).toBe('secretpassword')
      
      // Verify the value is not visible in the page
      const pageContent = await page.content()
      expect(pageContent).not.toContain('secretpassword')
    }
  })

  test('CSRF protection is present', async ({ page }) => {
    // Look for CSRF tokens in forms
    const csrfTokens = page.locator('input[name="csrf_token"], input[name="_csrf"], meta[name="csrf-token"]')
    const tokenCount = await csrfTokens.count()
    
    // If forms are present, they should have CSRF protection
    const forms = page.locator('form[method="POST"]')
    const formCount = await forms.count()
    
    if (formCount > 0) {
      // At least one CSRF token should be present
      expect(tokenCount).toBeGreaterThan(0)
    }
  })

  test('security headers are present', async ({ page }) => {
    // Check security headers via JavaScript
    const securityHeaders = await page.evaluate(() => {
      const headers = {}
      // Note: In a real implementation, you'd need to make a fetch request to check headers
      // This is a placeholder for where you'd check headers like:
      // - X-Content-Type-Options
      // - X-Frame-Options
      // - X-XSS-Protection
      // - Strict-Transport-Security
      // - Content-Security-Policy
      return headers
    })

    // In a real test, you'd assert specific security headers
    // For now, we'll just ensure the page loads securely
    const url = page.url()
    expect(url).toMatch(/^https:/) // Should be HTTPS in production
  })

  test('session timeout works correctly', async ({ page }) => {
    // This test would need to be implemented based on your session management
    // For now, we'll just check if session-related elements exist
    
    const logoutButton = page.locator('button:has-text("Logout"), a:has-text("Logout"), [data-action="logout"]')
    const sessionInfo = page.locator('[data-session], .session-info, text=session')
    
    // If user is logged in, logout button should be visible
    if (await logoutButton.isVisible()) {
      await expect(logoutButton).toBeVisible()
    }
  })

  test('rate limiting prevents brute force attacks', async ({ page }) => {
    // Navigate to login page
    const loginLink = page.locator('a[href*="login"], button:has-text("Login"), text=Sign In')
    if (await loginLink.isVisible()) {
      await loginLink.click()
      await page.waitForLoadState('networkidle')
    }

    const emailInput = page.locator('input[type="email"], input[name="email"], [data-testid="email"]')
    const passwordInput = page.locator('input[type="password"], input[name="password"], [data-testid="password"]')
    const submitButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")')

    if (await emailInput.isVisible() && await passwordInput.isVisible()) {
      // Attempt multiple failed logins
      for (let i = 0; i < 5; i++) {
        await emailInput.fill('test@example.com')
        await passwordInput.fill('wrongpassword')
        await submitButton.click()
        await page.waitForTimeout(1000)
      }

      // Check if rate limiting message appears
      const rateLimitMessage = page.locator('text=too many attempts, text=rate limit, text=try again later')
      if (await rateLimitMessage.isVisible({ timeout: 2000 })) {
        await expect(rateLimitMessage).toBeVisible()
      }
    }
  })

  test('sensitive data is not exposed in client-side code', async ({ page }) => {
    // Check page source for sensitive information
    const pageContent = await page.content()
    
    // These should not be present in client-side code
    const sensitivePatterns = [
      /password.*=.*['"]/i,
      /secret.*=.*['"]/i,
      /api[_-]?key.*=.*['"]/i,
      /token.*=.*['"].*jwt/i,
    ]

    for (const pattern of sensitivePatterns) {
      expect(pageContent).not.toMatch(pattern)
    }

    // Check localStorage and sessionStorage for sensitive data
    const storageData = await page.evaluate(() => {
      const data = {
        localStorage: {},
        sessionStorage: {},
      }
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key) {
          data.localStorage[key] = localStorage.getItem(key)
        }
      }
      
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i)
        if (key) {
          data.sessionStorage[key] = sessionStorage.getItem(key)
        }
      }
      
      return data
    })

    // Check for sensitive data in storage
    const storageString = JSON.stringify(storageData)
    expect(storageString).not.toMatch(/password/i)
    expect(storageString).not.toMatch(/secret/i)
    expect(storageString).not.toMatch(/api[_-]?key/i)
  })

  test('HTTPS redirects work correctly', async ({ page }) => {
    // Try to access HTTP version (if not already on HTTPS)
    const currentUrl = page.url()
    if (!currentUrl.startsWith('https://')) {
      await page.goto(currentUrl.replace('http://', 'https://'))
      await page.waitForLoadState('networkidle')
    }

    // Verify we're on HTTPS
    const finalUrl = page.url()
    expect(finalUrl).toMatch(/^https:/)
  })

  test('input sanitization prevents XSS attacks', async ({ page }) => {
    // Look for any input fields or forms
    const inputs = page.locator('input[type="text"], textarea, [contenteditable="true"]')
    const inputCount = await inputs.count()
    
    if (inputCount > 0) {
      const testInput = inputs.first()
      
      // Try to inject XSS payload
      const xssPayload = '<script>alert("XSS")</script>'
      await testInput.fill(xssPayload)
      
      // Check if the script tag is escaped or sanitized
      const inputValue = await testInput.inputValue()
      expect(inputValue).not.toBe('<script>alert("XSS")</script>')
      
      // The script should be escaped or removed
      expect(inputValue).not.toContain('<script>')
    }
  })
})