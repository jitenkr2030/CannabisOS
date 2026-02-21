# 🧪 Testing Documentation for CannabisOS

This document provides comprehensive information about the testing framework, test structure, and how to run tests for the CannabisOS application.

## 📋 Table of Contents

- [Overview](#overview)
- [Test Structure](#test-structure)
- [Running Tests](#running-tests)
- [Test Types](#test-types)
- [Mocking Strategy](#mocking-strategy)
- [Coverage](#coverage)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

CannabisOS includes a comprehensive testing suite that covers:

- **Unit Tests** - Individual component testing
- **Integration Tests** - API endpoint testing
- **End-to-End Tests** - Full application testing
- **Security Tests** - Authentication and validation
- **Functional Tests** - Business workflow testing

### Testing Stack

- **Jest** - JavaScript testing framework
- **React Testing Library** - React component testing
- **Playwright** - End-to-end testing
- **MSW** - API mocking (if needed)
- **Jest DOM** - DOM testing utilities

---

## 📁 Test Structure

```
CannabisOS/
├── src/
│   ├── components/
│   │   └── __tests__/
│   │       ├── POS-System.test.tsx
│   │       ├── Inventory-System.test.tsx
│   │       ├── Accounting-System.test.tsx
│   │       └── workflows.test.tsx
│   ├── app/api/
│   │   └── __tests__/
│   │       ├── products.test.ts
│   │       ├── sales.test.ts
│   │       └── expenses.test.ts
│   └── lib/
│       └── __tests__/
│           ├── test-db.ts
│           └── setup.ts
├── e2e/
│   ├── app.spec.ts
│   ├── pos.spec.ts
│   └── auth.spec.ts
├── jest.config.js
├── jest.setup.js
├── playwright.config.ts
└── TESTING.md
```

---

## 🚀 Running Tests

### Prerequisites

Make sure you have all dependencies installed:

```bash
bun install
```

### Available Scripts

```bash
# Run all tests
bun run test

# Run tests in watch mode
bun run test:watch

# Run tests with coverage report
bun run test:coverage

# Run end-to-end tests
bun run test:e2e

# Run E2E tests with UI
bun run test:e2e:ui

# Run E2E tests in headed mode
bun run test:e2e:headed
```

### Running Specific Tests

```bash
# Run specific test file
bun test src/components/__tests__/POS-System.test.tsx

# Run tests matching pattern
bun test -- --testNamePattern="POS"

# Run tests in a specific directory
bun test src/components/__tests__/
```

---

## 🧪 Test Types

### 1. Unit Tests

Unit tests focus on testing individual components and functions in isolation.

#### POS System Tests (`POS-System.test.tsx`)

- ✅ Renders POS system with product catalog
- ✅ Displays product information correctly
- ✅ Shows out of stock products correctly
- ✅ Adds products to cart
- ✅ Calculates totals correctly (subtotal, tax, total)
- ✅ Updates cart quantity
- ✅ Removes items from cart
- ✅ Requires age verification for checkout
- ✅ Processes sale successfully
- ✅ Filters products by category
- ✅ Searches products
- ✅ Handles empty cart state
- ✅ Prevents adding out of stock items

#### Inventory System Tests (`Inventory-System.test.tsx`)

- ✅ Renders inventory management system
- ✅ Displays inventory statistics correctly
- ✅ Shows correct stock status for each product
- ✅ Filters products by stock status
- ✅ Searches products
- ✅ Opens stock adjustment dialog
- ✅ Processes stock adjustment
- ✅ Displays batch information
- ✅ Calculates inventory value correctly
- ✅ Validates adjustment form
- ✅ Switches between inventory and movements tabs
- ✅ Shows warning for expiring products

#### Accounting System Tests (`Accounting-System.test.tsx`)

- ✅ Renders accounting system
- ✅ Displays profit & loss overview correctly
- ✅ Shows expense list with details
- ✅ Opens add expense dialog
- ✅ Adds new expense
- ✅ Filters expenses by category
- ✅ Searches expenses
- ✅ Toggles recurring expense
- ✅ Exports expenses to CSV
- ✅ Shows financial summary in reports tab
- ✅ Displays expense summary by category
- ✅ Edits existing expense
- ✅ Deletes expense
- ✅ Validates expense form

### 2. Integration Tests

Integration tests test the interaction between different parts of the system, particularly API endpoints.

#### Products API Tests (`products.test.ts`)

- ✅ Returns all products
- ✅ Handles database errors
- ✅ Filters by category
- ✅ Creates a new product
- ✅ Validates required fields
- ✅ Handles database errors during creation
- ✅ Parses numeric fields correctly

#### Sales API Tests (`sales.test.ts`)

- ✅ Returns all sales
- ✅ Filters by date range
- ✅ Handles database errors
- ✅ Creates a new sale
- ✅ Validates age verification
- ✅ Validates sale items
- ✅ Updates inventory on successful sale
- ✅ Validates inventory availability
- ✅ Requires authentication
- ✅ Handles database errors during creation

#### Expenses API Tests (`expenses.test.ts`)

- ✅ Returns all expenses
- ✅ Filters by category
- ✅ Filters by date range
- ✅ Handles database errors
- ✅ Creates a new expense
- ✅ Validates required fields
- ✅ Requires authentication
- ✅ Handles database errors during creation
- ✅ Updates an existing expense
- ✅ Validates expense ID
- ✅ Deletes an expense
- ✅ Handles database errors during deletion

### 3. End-to-End Tests

E2E tests simulate real user interactions with the application.

#### Application Tests (`app.spec.ts`)

- ✅ Homepage loads correctly
- ✅ Responsive design works on mobile
- ✅ Dark mode toggle works
- ✅ Page loads without JavaScript errors
- ✅ Accessibility features are present
- ✅ Performance metrics are acceptable
- ✅ SEO meta tags are present
- ✅ Error handling works
- ✅ Service worker is registered

#### POS System E2E Tests (`pos.spec.ts`)

- ✅ POS system loads and displays products
- ✅ Can add products to cart
- ✅ Cart calculates totals correctly
- ✅ Age verification is required
- ✅ Search functionality works
- ✅ Category filtering works
- ✅ Responsive POS on mobile
- ✅ Handles out of stock products

#### Authentication Tests (`auth.spec.ts`)

- ✅ Login page loads correctly
- ✅ Prevents access to protected routes without authentication
- ✅ Form validation works correctly
- ✅ Password field masks input correctly
- ✅ CSRF protection is present
- ✅ Security headers are present
- ✅ Session timeout works correctly
- ✅ Rate limiting prevents brute force attacks
- ✅ Sensitive data is not exposed in client-side code
- ✅ HTTPS redirects work correctly
- ✅ Input sanitization prevents XSS attacks

### 4. Functional Workflow Tests

These tests test complete business workflows across multiple components.

#### Complete Sales Workflow

- ✅ Processes a complete sale from start to finish
- ✅ Handles low stock scenarios correctly
- ✅ Prevents checkout without age verification

#### Inventory Management Workflow

- ✅ Manages stock levels from low stock to replenishment
- ✅ Tracks complete stock movement history

#### Financial Management Workflow

- ✅ Tracks complete profit and loss cycle
- ✅ Manages recurring expenses automatically

#### Integration Workflow

- ✅ Maintains data consistency across systems

#### Error Handling and Edge Cases

- ✅ Handles network failures gracefully
- ✅ Validates data integrity across workflows
- ✅ Maintains performance with large datasets

---

## 🎭 Mocking Strategy

### Database Mocking

We use Jest mocks to simulate database operations without requiring an actual database connection:

```javascript
// Mock Prisma
jest.mock('@/lib/db', () => ({
  db: {
    user: { findMany: jest.fn(), findUnique: jest.fn(), ... },
    product: { findMany: jest.fn(), findUnique: jest.fn(), ... },
    // ... other models
  }
}))
```

### API Mocking

For API tests, we mock the fetch function to simulate HTTP responses:

```javascript
global.fetch = jest.fn()
;(fetch as jest.Mock).mockImplementation((url) => {
  if (url.includes('/api/products')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ products: mockProducts })
    })
  }
  // ... other endpoints
})
```

### Next.js Mocks

We mock Next.js-specific modules to ensure tests run in a JSDOM environment:

```javascript
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    // ... other router methods
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}))
```

---

## 📊 Coverage

### Coverage Configuration

Coverage is configured to maintain high code quality:

```javascript
coverageThreshold: {
  global: {
    branches: 70,
    functions: 70,
    lines: 70,
    statements: 70,
  },
}
```

### Coverage Report

Run coverage tests to generate a detailed report:

```bash
bun run test:coverage
```

The coverage report will be generated in the `coverage/` directory and includes:

- **Statement coverage** - Percentage of statements executed
- **Branch coverage** - Percentage of branches taken
- **Function coverage** - Percentage of functions called
- **Line coverage** - Percentage of lines executed

### Coverage Goals

- **Components**: 80%+ coverage for critical business logic
- **APIs**: 90%+ coverage for all endpoints
- **Workflows**: 100% coverage for critical paths
- **Security**: 100% coverage for authentication flows

---

## 🔄 CI/CD Integration

### GitHub Actions

Create a `.github/workflows/test.yml` file:

```yaml
name: Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run test:coverage

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run build
      - run: bun run test:e2e
```

### Pre-commit Hooks

Use Husky for pre-commit hooks:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "bun run test -- --changedSince=HEAD~1",
      "pre-push": "bun run test:coverage"
    }
  }
}
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Jest Module Resolution Errors

**Error**: `Cannot find module '@/lib/db'`

**Solution**: Ensure the `moduleNameMapper` is correctly configured in `jest.config.js`:

```javascript
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/src/$1',
}
```

#### 2. Playwright Browser Issues

**Error**: `BrowserType.launch: Executable doesn't exist`

**Solution**: Install Playwright browsers:

```bash
bunx playwright install
```

#### 3. Test Timeout Issues

**Error**: Test timeouts after 5000ms

**Solution**: Increase timeout in test configuration:

```javascript
test.setTimeout(10000) // 10 seconds
```

#### 4. Mock Implementation Issues

**Error**: Mock is not being used

**Solution**: Ensure mocks are defined before tests run and use `jest.mock()` at the top level.

### Debugging Tests

#### Running Tests in Debug Mode

```bash
# Run Jest with node inspector
node --inspect-brk node_modules/.bin/jest --runInBand

# Run Playwright in debug mode
bunx playwright test --debug
```

#### Test Logging

Add console logging to tests for debugging:

```javascript
test('debug test', () => {
  console.log('Debug info:', someVariable)
  // ... test logic
})
```

### Performance Issues

#### Slow Test Execution

**Solutions**:
- Use `test.concurrent()` for independent tests
- Mock expensive operations
- Use `test.skip()` for non-critical tests
- Run tests in parallel with `--maxWorkers`

#### Memory Leaks in Tests

**Solutions**:
- Clean up mocks in `afterEach`
- Disconnect database connections
- Clear global state

---

## 📚 Best Practices

### Writing Tests

1. **Arrange-Act-Assert Pattern**
   ```javascript
   test('example', () => {
     // Arrange
     const mockData = { ... }
     
     // Act
     const result = someFunction(mockData)
     
     // Assert
     expect(result).toBe(expected)
   })
   ```

2. **Descriptive Test Names**
   ```javascript
   test('should add product to cart when product is in stock', () => {
     // ...
   })
   ```

3. **Test One Thing Per Test**
   ```javascript
   // Good
   test('should calculate subtotal correctly', () => { /* ... */ })
   test('should calculate tax correctly', () => { /* ... */ })
   
   // Bad
   test('should calculate subtotal and tax', () => { /* ... */ })
   ```

### Mocking Best Practices

1. **Mock at the Right Level**
   - Mock external dependencies
   - Don't mock implementation details
   - Use realistic mock data

2. **Reset Mocks Between Tests**
   ```javascript
   beforeEach(() => {
     jest.clearAllMocks()
   })
   ```

3. **Use Factories for Test Data**
   ```javascript
   const createMockProduct = (overrides = {}) => ({
     id: 'test-id',
     name: 'Test Product',
     ...overrides
   })
   ```

### E2E Testing Best Practices

1. **Use Data Test IDs**
   ```html
   <button data-testid="submit-button">Submit</button>
   ```
   ```javascript
   await page.click('[data-testid="submit-button"]')
   ```

2. **Wait for Elements Properly**
   ```javascript
   await page.waitForSelector('[data-testid="result"]')
   ```

3. **Use Page Objects Pattern**
   ```javascript
   class LoginPage {
     constructor(page) {
       this.page = page
     }
     
     async login(username, password) {
       await this.page.fill('[data-testid="username"]', username)
       await this.page.fill('[data-testid="password"]', password)
       await this.page.click('[data-testid="login-button"]')
     }
   }
   ```

---

## 🔄 Continuous Improvement

### Adding New Tests

When adding new features:

1. **Write Unit Tests First**
2. **Add Integration Tests for APIs**
3. **Include E2E Tests for User Flows**
4. **Update Coverage Configuration**
5. **Add to CI/CD Pipeline**

### Maintaining Tests

1. **Regular Test Reviews**
2. **Update Tests When Code Changes**
3. **Remove Obsolete Tests**
4. **Keep Test Data Updated**
5. **Monitor Test Performance**

---

## 📞 Support

If you encounter issues with tests:

1. Check this documentation first
2. Look at existing test files for examples
3. Review Jest and Playwright documentation
4. Create an issue with detailed error information

---

## 🗺️ Roadmap

### Upcoming Testing Enhancements

- [ ] Visual regression testing
- [ ] Performance testing with Lighthouse
- [ ] Accessibility testing with axe-core
- [ ] API contract testing
- [ ] Load testing for high-traffic scenarios

### Testing Metrics

We aim to maintain:
- **90%+ test coverage** for critical paths
- **< 2s** average test execution time
- **100%** E2E test pass rate in CI/CD

---

*Last updated: January 2024*