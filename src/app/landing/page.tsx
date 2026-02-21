'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Search, 
  Menu, 
  X, 
  Leaf, 
  Shield, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  FileText, 
  Award, 
  BarChart3, 
  CheckCircle, 
  ArrowRight, 
  Star, 
  Lock, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Handshake, 
  Gift, 
  Zap, 
  Target, 
  Briefcase, 
  Globe, 
  CreditCard, 
  ChevronRight, 
  Play, 
  Video, 
  Download, 
  ExternalLink,
  Package,
  Truck,
  ShoppingCart,
  Smartphone,
  WifiOff,
  Bell,
  Hand,
  UserCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import Footer from '@/components/ui/Footer'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSignupDialogOpen, setIsSignupDialogOpen] = useState(false)
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)
  const [businessType, setBusinessType] = useState('')
  const [isYearly, setIsYearly] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('cannabisos_user')
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        // Redirect to dashboard if user is logged in
        router.push('/')
      } catch (error) {
        console.error('Failed to parse stored user:', error)
        localStorage.removeItem('cannabisos_user')
      }
    }
  }, [router])

  const pricingPlans = [
    {
      name: "Starter",
      monthlyPrice: "$99",
      yearlyPrice: "$999",
      period: "per month",
      periodYearly: "per year",
      description: "Perfect for small dispensaries and single shops",
      features: [
        "POS System",
        "Inventory Management",
        "Basic Reporting",
        "Mobile App",
        "Email Support",
        "Up to 2 Users",
        "1 Store Location"
      ],
      highlighted: false
    },
    {
      name: "Basic",
      monthlyPrice: "$199",
      yearlyPrice: "$1,999",
      period: "per month",
      periodYearly: "per year",
      description: "Perfect for growing businesses",
      features: [
        "Everything in Starter",
        "Advanced POS Features",
        "Inventory Analytics",
        "Customer Management",
        "Priority Email Support",
        "Up to 5 Users",
        "2 Store Locations"
      ],
      highlighted: false
    },
    {
      name: "Growth",
      monthlyPrice: "$299",
      yearlyPrice: "$2,999",
      period: "per month",
      periodYearly: "per year",
      description: "Ideal for multi-location dispensaries",
      features: [
        "Everything in Basic",
        "Multi-Store Support",
        "Advanced Reporting",
        "Delivery Management",
        "QR Authentication",
        "Priority Support",
        "Up to 15 Users",
        "Up to 10 Store Locations"
      ],
      highlighted: true
    },
    {
      name: "Consultant",
      monthlyPrice: "$399",
      yearlyPrice: "$3,999",
      period: "per month",
      periodYearly: "per year",
      description: "Complete solution for agencies and consultants",
      features: [
        "Everything in Growth",
        "Multi-Client Management",
        "White-Label Branding",
        "Client Onboarding",
        "Revenue Tracking",
        "Dedicated Account Manager",
        "Unlimited Users",
        "Unlimited Clients"
      ],
      highlighted: false
    },
    {
      name: "Enterprise",
      monthlyPrice: "$499",
      yearlyPrice: "$4,999",
      period: "per month",
      periodYearly: "per year",
      description: "Comprehensive solution for chains and large organizations",
      features: [
        "Everything in Consultant",
        "Unlimited Locations",
        "Custom Integrations",
        "Advanced Analytics",
        "Full API Access",
        "White-Glove Support",
        "Custom Training",
        "SLA Guarantee",
        "24/7 Phone Support"
      ],
      highlighted: false
    }
  ]

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    // Handle signup logic here
    console.log('Signup clicked')
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    console.log('Login clicked')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Leaf className="h-8 w-8 text-green-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">CannabisOS</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Pricing</a>
              <a href="#consultants" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">For Consultants</a>
              <a href="/partners" className="text-green-600 hover:text-green-700 font-medium transition-colors">Partner Program</a>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => setIsLoginDialogOpen(true)}>
                Login
              </Button>
              <Button onClick={() => setIsSignupDialogOpen(true)} className="bg-green-600 hover:bg-green-700 text-white">
                Get Started
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#features" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Features</a>
              <a href="#pricing" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Pricing</a>
              <a href="#consultants" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">For Consultants</a>
              <a href="/partners" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Partner Program</a>
              <div className="border-t border-gray-200 my-2"></div>
              <Button variant="outline" onClick={() => setIsLoginDialogOpen(true)} className="w-full justify-start">
                Login
              </Button>
              <Button onClick={() => setIsSignupDialogOpen(true)} className="w-full justify-start bg-green-600 hover:bg-green-700 text-white">
                Get Started
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center mb-6">
              <div className="p-3 bg-green-100 rounded-full">
                <Leaf className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Complete Dispensary Management
              <span className="text-green-600"> Made Simple</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              CannabisOS is the all-in-one platform for modern dispensaries. Manage sales, inventory, compliance, and deliveries from one powerful system.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => setIsSignupDialogOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Start Free Trial
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setIsLoginDialogOpen(true)}
              >
                Login to Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Run Your Dispensary
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From seed to sale, CannabisOS provides all the tools you need to operate a compliant and profitable cannabis business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-3 text-gray-900">Point of Sale</h3>
              <p className="text-sm md:text-base text-gray-600 mb-4">Fast, compliant POS system with age verification and real-time inventory</p>
              <ul className="text-xs md:text-sm text-gray-500 space-y-1 text-left">
                <li className="flex items-center"><span className="text-green-500 mr-2">•</span> Age verification</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">•</span> Multi-payment support</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">•</span> Real-time inventory</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">•</span> Compliance reporting</li>
              </ul>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-3 text-gray-900">Inventory Management</h3>
              <p className="text-sm md:text-base text-gray-600 mb-4">Track stock levels, batches, and compliance from seed to sale</p>
              <ul className="text-xs md:text-sm text-gray-500 space-y-1 text-left">
                <li className="flex items-center"><span className="text-blue-500 mr-2">•</span> Batch tracking</li>
                <li className="flex items-center"><span className="text-blue-500 mr-2">•</span> Low stock alerts</li>
                <li className="flex items-center"><span className="text-blue-500 mr-2">•</span> Expiry monitoring</li>
                <li className="flex items-center"><span className="text-blue-500 mr-2">•</span> Supplier management</li>
              </ul>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-3 text-gray-900">Compliance Reporting</h3>
              <p className="text-sm md:text-base text-gray-600 mb-4">Automated reporting for Health Canada and state regulators</p>
              <ul className="text-xs md:text-sm text-gray-500 space-y-1 text-left">
                <li className="flex items-center"><span className="text-orange-500 mr-2">•</span> Automated reports</li>
                <li className="flex items-center"><span className="text-orange-500 mr-2">•</span> Audit trails</li>
                <li className="flex items-center"><span className="text-orange-500 mr-2">•</span> License tracking</li>
                <li className="flex items-center"><span className="text-orange-500 mr-2">•</span> Risk assessment</li>
              </ul>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-3 text-gray-900">Delivery Management</h3>
              <p className="text-sm md:text-base text-gray-600 mb-4">Complete delivery tracking with driver management and customer verification</p>
              <ul className="text-xs md:text-sm text-gray-500 space-y-1 text-left">
                <li className="flex items-center"><span className="text-purple-500 mr-2">•</span> Real-time tracking</li>
                <li className="flex items-center"><span className="text-purple-500 mr-2">•</span> Driver assignment</li>
                <li className="flex items-center"><span className="text-purple-500 mr-2">•</span> Route optimization</li>
                <li className="flex items-center"><span className="text-purple-500 mr-2">•</span> Customer verification</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile App Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Mobile App
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Full-featured mobile app for on-the-go dispensary management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Mobile POS</h3>
              <p className="text-sm text-gray-600">Complete POS functionality on your mobile device</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <WifiOff className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Offline Mode</h3>
              <p className="text-sm text-gray-600">Continue operations even without internet connection</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Push Notifications</h3>
              <p className="text-sm text-gray-600">Real-time alerts for orders, inventory, and compliance</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Hand className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Touch Optimized</h3>
              <p className="text-sm text-gray-600">Designed specifically for mobile and tablet use</p>
            </div>
          </div>
        </div>
      </section>

      {/* Consultant Section */}
      <section id="consultants" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              For Cannabis Compliance Consultants
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Manage multiple clients with our white-label consultant portal. Present CannabisOS as your own platform while leveraging our powerful features.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Why Consultants Choose CannabisOS</h3>
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-green-100 rounded-lg flex-shrink-0">
                    <Users className="h-7 w-7 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Multi-Client Management</h4>
                    <p className="text-gray-600 text-base leading-relaxed">Manage all your dispensary clients from one dashboard with individual client isolation and centralized control.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-100 rounded-lg flex-shrink-0">
                    <Building className="h-7 w-7 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">White-Label Branding</h4>
                    <p className="text-gray-600 text-base leading-relaxed">Present the system as your own platform with custom branding, logo, and domain for each client to maintain your professional identity.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-purple-100 rounded-lg flex-shrink-0">
                    <DollarSign className="h-7 w-7 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Revenue Tracking</h4>
                    <p className="text-gray-600 text-base leading-relaxed">Track your consulting revenue and client management with detailed financial analytics and performance metrics.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-orange-100 rounded-lg flex-shrink-0">
                    <FileText className="h-7 w-7 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Compliance Tools</h4>
                    <p className="text-gray-600 text-base leading-relaxed">Generate reports for multiple clients and regulators with automated compliance tracking and audit trails.</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Card className="h-full shadow-lg">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                  <CardTitle className="text-xl md:text-2xl font-bold text-gray-900">Consultant Dashboard</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
                      <span className="text-sm md:text-base font-semibold text-gray-700">Total Clients</span>
                      <span className="text-2xl md:text-3xl font-bold text-green-600">12</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg border border-red-200">
                      <span className="text-sm md:text-base font-semibold text-gray-700">At Risk</span>
                      <span className="text-2xl md:text-3xl font-bold text-red-600">2</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <span className="text-sm md:text-base font-semibold text-gray-700">Reports Due</span>
                      <span className="text-2xl md:text-3xl font-bold text-orange-600">5</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <span className="text-sm md:text-base font-semibold text-gray-700">Monthly Revenue</span>
                      <span className="text-2xl md:text-3xl font-bold text-blue-600">$1,980</span>
                    </div>
                  </div>
                  <div className="mt-8">
                    <Button 
                      onClick={() => router.push('/')}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 text-base"
                      size="lg"
                    >
                      Access Consultant Portal
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              500+ Dispensaries Trust Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">99.9%</div>
              <div className="text-gray-600">Compliance Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">24/7</div>
              <div className="text-gray-600">Support Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">50M+</div>
              <div className="text-gray-600">Transactions Processed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your business. Save 17% with yearly billing!
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center mt-8 mb-8">
              <span className={`mr-3 ${!isYearly ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => setIsYearly(!isYearly)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isYearly ? 'bg-green-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isYearly ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`ml-3 ${isYearly ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
                Yearly
                <span className="text-green-600 text-sm ml-1">Save 17%</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.highlighted ? 'ring-2 ring-green-500' : 'hover:shadow-lg transition-shadow'}`}>
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-green-500 text-white">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-gray-900">
                      {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-gray-600">
                      /{isYearly ? plan.periodYearly : plan.period}
                    </span>
                  </div>
                  {isYearly && (
                    <div className="mt-2">
                      <span className="text-sm text-gray-500">
                        Equivalent to {(parseInt(plan.yearlyPrice.slice(1)) / 12).toFixed(0)}/month
                      </span>
                    </div>
                  )}
                  <p className="text-sm text-gray-600 mt-2">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${plan.highlighted ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`}
                    variant={plan.highlighted ? "default" : "outline"}
                    onClick={() => setIsSignupDialogOpen(true)}
                  >
                    {plan.name === 'Consultant' ? 'Start Consulting' : `Choose ${plan.name}`}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Dispensary?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
            Join hundreds of dispensaries using CannabisOS to streamline operations, ensure compliance, and grow their business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => setIsSignupDialogOpen(true)}
              className="bg-white text-green-600 hover:bg-gray-100"
            >
              Start Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setIsLoginDialogOpen(true)}
              className="border-white text-white hover:bg-white hover:text-green-600"
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Leaf className="h-8 w-8 text-green-400 mr-2" />
                <span className="text-xl font-bold">CannabisOS</span>
              </div>
              <p className="text-gray-400 text-sm">
                The complete dispensary management system for modern cannabis businesses.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Features</li>
                <li>Pricing</li>
                <li>Security</li>
                <li>Compliance</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>About</li>
                <li>Blog</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Help Center</li>
                <li>Documentation</li>
                <li>Status</li>
                <li>Terms</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 CannabisOS. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Signup Dialog */}
      <Dialog open={isSignupDialogOpen} onOpenChange={setIsSignupDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Get Started with CannabisOS</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="signup" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
              <TabsTrigger value="login">Login</TabsTrigger>
            </TabsList>
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <Label htmlFor="business-name">Business Name</Label>
                  <Input
                    id="business-name"
                    placeholder="Enter your business name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="Enter your phone"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="business-type">Business Type</Label>
                  <Select value={businessType} onValueChange={setBusinessType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dispensary">Dispensary</SelectItem>
                      <SelectItem value="producer">Producer</SelectItem>
                      <SelectItem value="retailer">Retailer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">
                  Start Free Trial
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="login">
              <form className="space-y-4">
                <div>
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      id="remember"
                      type="checkbox"
                      className="rounded"
                    />
                    <Label htmlFor="remember" className="text-sm">Remember me</Label>
                  </div>
                  <Button variant="link" className="text-sm text-green-600">
                    Forgot password?
                  </Button>
                </div>
                <Button type="submit" className="w-full">
                  Login to Dashboard
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Login Dialog */}
      <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Login to CannabisOS</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="login-email-2">Email</Label>
              <Input
                id="login-email-2"
                type="email"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <Label htmlFor="login-password-2">Password</Label>
              <Input
                id="login-password-2"
                type="password"
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  id="remember-2"
                  type="checkbox"
                  className="rounded"
                />
                <Label htmlFor="remember-2" className="text-sm">Remember me</Label>
              </div>
              <Button variant="link" className="text-sm text-green-600">
                Forgot password?
              </Button>
            </div>
            <Button type="submit" className="w-full">
              Login to Dashboard
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}
