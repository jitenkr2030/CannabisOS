# 🌿 CannabisOS - Complete Dispensary Management System

A comprehensive, production-ready dispensary management platform built with Next.js 16, TypeScript, and modern web technologies. CannabisOS streamlines operations for cannabis retailers with POS, inventory, AI accounting, and compliance tracking.

## 🚀 Features

### 🛒 **POS + Billing System**
- Fast billing with intuitive product catalog
- Real-time THC/CBD content display
- Age verification alerts (19+ compliance)
- Multi-payment method support (Cash, Debit, Credit)
- Customer information management
- Real-time inventory integration
- Multi-store support

### 🤖 **Accounting System**
- **Complete expense management** with categorization
- **Real-time profit & loss** calculations
- **Recurring expense** support with intervals
- **Financial reporting** with CSV export
- **Expense tracking** by category and date range
- **Manual expense entry** with detailed notes
- **Tax calculation** and reporting

### 📦 **Inventory + Batch Tracking**
- Real-time stock level monitoring
- Low stock alerts and reorder points
- Batch tracking with expiry dates
- Supplier information tracking
- Stock movement history
- Manual stock adjustments
- Location-based inventory management
- Cannabis-specific compliance tracking

### 🚚 **Delivery Management**
- Driver assignment and route optimization
- Real-time delivery tracking
- Customer ID verification on delivery
- Delivery status updates
- Order management for delivery operations

### 📱 **QR-Based Product Authentication**
- Unique QR codes for each product
- Origin and lab test details
- THC/CBD percentage verification
- Manufacturing date tracking
- Authenticity verification system
- Prevents counterfeit products

### 📊 **Compliance & Reporting Engine**
- Health Canada compliance ready
- Automated report generation
- Transaction logging for audit trails
- Export in required formats
- Daily, monthly, quarterly reporting
- Inventory movement tracking

### 📱 **PWA Capabilities**
- Installable mobile app
- Offline functionality
- Push notifications
- Mobile-optimized interface
- Works on iOS/Android devices

## 🛠 Technical Stack

### **Frontend**
- **Next.js 16** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **Framer Motion** for animations
- **React Query** for state management

### **Backend**
- **Next.js API Routes**
- **Prisma ORM** with SQLite
- **JWT Authentication**
- **z-ai-web-dev-sdk** for AI features
- **bcryptjs** for password hashing

### **Database**
- **SQLite** (development)
- **PostgreSQL** ready (production)
- **Comprehensive schema** with 15+ models
- **Multi-store architecture**
- **Audit logging**

### **AI/ML Integration**
- **Voice Recognition** (ASR)
- **Natural Language Processing**
- **Expense Parsing AI**
- **Real-time transcription**

## 📦 Installation & Setup

### **Prerequisites**
- Node.js 18+ or Bun
- Git

### **1. Clone & Install**
```bash
git clone https://github.com/jitenkr2030/CannabisOS.git
cd CannabisOS
bun install  # or npm install
```

### **2. Database Setup**
```bash
bun run db:push    # Push schema to database
bun run db:seed    # Load demo data
```

### **3. Start Development**
```bash
bun run dev
```

### **4. Access Application**
- 🌐 **URL**: `http://localhost:3000`
- 👤 **Demo Admin**: `admin@cannabisos.com` / `demo123`
- 👤 **Demo Manager**: `manager@cannabisos.com` / `demo123`
- 👤 **Demo Staff**: `staff@cannabisos.com` / `demo123`
- 👤 **Demo Driver**: `driver@cannabisos.com` / `demo123`

## 🏗 Architecture Overview

### **Database Schema**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Users       │    │     Stores      │    │   Products      │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ id (PK)         │    │ id (PK)         │    │ id (PK)         │
│ email           │    │ name            │    │ name            │
│ password        │    │ address         │    │ sku             │
│ role            │    │ phone           │    │ category        │
│ storeId (FK)    │    │ licenseNumber   │    │ thcContent      │
│ isActive        │    │ timezone        │    │ cbdContent      │
│ lastLoginAt     │    │ currency        │    │ price           │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
         ┌─────────────────┐    │    ┌─────────────────┐
         │     Sales       │    │    │   Inventory     │
         ├─────────────────┤    │    ├─────────────────┤
         │ id (PK)         │    │    │ id (PK)         │
         │ receiptNumber   │    │    │ productId (FK)  │
         │ customerId     │    │    │ storeId (FK)    │
         │ subtotal        │    │    │ quantity        │
         │ tax             │    │    │ available       │
         │ total           │    │    │ reorderLevel    │
         │ paymentMethod   │    │    │ location        │
         │ status          │    │    │ batchId (FK)    │
         │ ageVerified     │    │    └─────────────────┘
         │ storeId (FK)    │    │             │
         │ userId (FK)     │    │    ┌─────────────────┐
         └─────────────────┘    │    │     Batches      │
                                 │    ├─────────────────┤
         ┌─────────────────┐    │    │ id (PK)         │
         │   Expenses      │    │    │ batchNumber     │
         ├─────────────────┤    │    │ supplier        │
         │ id (PK)         │    │    │ receivedDate    │
         │ description     │    │    │ expiryDate      │
         │ amount          │    │    │ labResults      │
         │ category        │    │    │ storeId (FK)    │
         │ date            │    │    └─────────────────┘
         │ voiceNote       │    │
         │ isRecurring     │    │    ┌─────────────────┐
         │ storeId (FK)    │    │    │  Deliveries     │
         │ userId (FK)     │    │    ├─────────────────┤
         └─────────────────┘    │    │ id (PK)         │
                                 │    │ orderNumber     │
         ┌─────────────────┐    │    │ customerName    │
         │  Compliance     │    │    │ status          │
         ├─────────────────┤    │    │ driverId (FK)   │
         │ id (PK)         │    │    │ storeId (FK)    │
         │ type            │    │    └─────────────────┘
         │ period          │    │
         │ data            │    │    ┌─────────────────┐
         │ status          │    │    │    QR Codes     │
         │ submittedAt     │    │    ├─────────────────┤
         │ storeId (FK)    │    │    │ id (PK)         │
         └─────────────────┘    │    │ code            │
                                 │    │ productId (FK)  │
                                 │    │ isActive        │
                                 │    └─────────────────┘
                                 └─────────────────────┘
```

### **API Structure**
```
/api/
├── auth/
│   └── login/              # JWT authentication
├── products/               # Product CRUD operations
├── sales/                  # POS and sales transactions
├── inventory/              # Stock management
├── expenses/               # AI accounting system
├── deliveries/             # Delivery management
└── compliance/             # Reporting engine
```

## 💰 Business Model

### **Pricing Tiers**
| Plan | Monthly | Yearly | Features |
|------|---------|--------|----------|
| **Basic** | $199/month | $1,999/year | POS, Basic Inventory, Reports, Single Store |
| **Growth** | $299/month | $2,999/year | POS + Complete Accounting, QR Tracking, Delivery, Multi-Store |
| **Consultant** | $399/month | $3,999/year | Multi-Client Management, White-Label Branding, Revenue Tracking |
| **Enterprise** | $499/month | $4,999/year | Full Suite, Unlimited Locations, Custom Integrations, API Access |

### **Yearly Savings**
- Save 17% with yearly billing
- 2 months free on annual plans
- Priority support included
- Cancel anytime

### **Target Market**
- 🏪 **Independent Dispensaries** - Single-location retailers
- 🏢 **Cannabis Retail Chains** - Multi-store operations  
- 🚚 **Delivery-Based Sellers** - Focus on delivery logistics
- 🌱 **Small Growers** - Inventory and compliance tracking

### **ROI Calculator**
- **Time Savings**: 20+ hours/week on manual accounting
- **Compliance**: Avoid $10K+ in potential fines
- **Inventory**: Reduce waste by 15-20%
- **Sales**: Increase throughput by 25%

## 🔒 Security & Compliance

### **Security Features**
- 🔐 **JWT Authentication** with role-based access
- 👥 **5 User Roles**: Admin, Manager, Staff, Driver, Accountant
- 📝 **Audit Logging** for all transactions
- 🔒 **Password Hashing** with bcryptjs
- 🛡️ **API Security** with validation

### **Compliance Features**
- ✅ **Age Verification** (19+ for Ontario)
- 📊 **Health Canada Ready** reporting
- 📋 **Complete Audit Trails**
- 🏷️ **Batch Tracking** for recalls
- 📱 **QR Authentication** for product verification
- 📄 **Automated Compliance Reports**

## 📱 Mobile App & PWA

### **PWA Features**
- 📲 **Installable** on iOS/Android
- 📴 **Offline Mode** for essential functions
- 🔔 **Push Notifications** for orders/alerts
- 📱 **Mobile-Optimized** POS interface
- 🚀 **Fast Loading** with caching

### **Mobile Functionality**
- ✅ Full POS system on mobile
- ✅ Voice expense recording
- ✅ Inventory management
- ✅ Delivery tracking
- ✅ Customer management

## 🚀 Deployment

### **Development**
```bash
bun run dev        # Start development server
bun run lint       # Code quality check
bun run build      # Production build
```

### **Production**
```bash
bun run build      # Build for production
bun run start      # Start production server
```

### **Environment Variables**
```env
DATABASE_URL="file:./db/custom.db"
JWT_SECRET="your-secure-secret-key"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

### **Docker Deployment**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install
COPY . .
RUN bun run build
EXPOSE 3000
CMD ["bun", "start"]
```

## 📊 Key Metrics & Analytics

### **Dashboard Metrics**
- 💰 **Real-time Sales** - Daily/weekly/monthly revenue
- 📦 **Inventory Turnover** - Product movement analysis
- 👥 **Customer Analytics** - Purchase patterns and demographics
- ✅ **Compliance Status** - Real-time monitoring
- 🚚 **Delivery Efficiency** - Route optimization metrics

### **Business Intelligence**
- 📈 **Revenue Trends** - Growth analysis
- 🏷️ **Product Performance** - Best/worst sellers
- 👤 **Customer Lifetime Value** - Retention metrics
- 📊 **Profit Margins** - By product/category
- ⏰ **Peak Hours** - Optimize staffing

## 🔄 Continuous Development

### **Planned Features**
- 🔄 **Advanced Analytics** - AI-powered insights
- 📱 **Native Mobile Apps** - React Native
- 🔗 **Third-party Integrations** - QuickBooks, Shopify
- 🤖 **Advanced AI** - Predictive analytics
- 🌐 **Multi-currency** - International expansion

### **Scalability**
- ☁️ **Cloud Ready** - AWS, Google Cloud, Azure
- 🏢 **Multi-Tenant** - SaaS architecture
- 📊 **Analytics Ready** - Data pipeline
- 🔌 **API-First** - Mobile app integration
- 🚀 **Auto-scaling** - Load balancing

## 🛠 Development Guide

### **Code Structure**
```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── POS-System.tsx    # Point of Sale
│   ├── Accounting-System.tsx # Complete Accounting System
│   └── Inventory-System.tsx # Inventory Management
├── lib/                   # Utilities
│   └── db.ts             # Database client
└── types/                 # TypeScript types
```

### **Contributing**
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### **Code Quality**
- ✅ **TypeScript** for type safety
- ✅ **ESLint** for code quality
- ✅ **Prettier** for formatting
- ✅ **Husky** for git hooks
- ✅ **Jest** for testing

## 📞 Support & Documentation

### **Documentation**
- 📖 **API Documentation** - `/api-docs`
- 🎥 **Video Tutorials** - Coming soon
- ❓ **FAQ** - Common questions
- 📧 **Support** - support@cannabisos.com

### **Troubleshooting**
- 🔧 **Common Issues** - Check wiki
- 🐛 **Bug Reports** - GitHub Issues
- 💬 **Community** - Discord/Slack
- 📞 **Enterprise Support** - Contact sales

## 📄 License & Legal

- 📜 **License** - MIT License
- ⚖️ **Compliance** - Built for cannabis industry
- 🔒 **Privacy** - GDPR/CCPA compliant
- 🛡️ **Security** - SOC 2 Type II ready

---

## 🚀 Quick Start

```bash
# Clone and setup
git clone https://github.com/jitenkr2030/CannabisOS.git
cd CannabisOS
bun install

# Setup database
bun run db:push
bun run db:seed

# Start development
bun run dev

# Visit http://localhost:3000
# Login with: admin@cannabisos.com / demo123
```

**CannabisOS** - The complete solution for modern dispensary management. 🌿

---

*Built with ❤️ for the cannabis industry*