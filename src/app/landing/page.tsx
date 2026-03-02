'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
  Truck,
  Package,
  Clock,
  AlertTriangle,
  ShoppingCart,
  Smartphone,
  Wifi,
  Bell,
  Settings,
  Users2,
  Building2,
  ChartBar,
  FileCheck,
  ShieldCheck,
  UserCheck,
  MapPinIcon,
  Route,
  Navigation,
  QrCode,
  CreditCardIcon
} from 'lucide-react'

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  const features = [
    {
      icon: <ShoppingCart className="h-8 w-8 text-green-600" />,
      title: "Point of Sale",
      description: "Fast, compliant POS system with age verification and real-time inventory",
      points: ["Age verification", "Multi-payment support", "Real-time inventory", "Compliance reporting"],
      color: "bg-green-100 text-green-800"
    },
    {
      icon: <Package className="h-8 w-8 text-blue-600" />,
      title: "Inventory Management",
      description: "Track stock levels, batches, and compliance from seed to sale",
      points: ["Batch tracking", "Low stock alerts", "Expiry monitoring", "Supplier management"],
      color: "bg-blue-100 text-blue-800"
    },
    {
      icon: <FileCheck className="h-8 w-8 text-purple-600" />,
      title: "Compliance Reporting",
      description: "Automated reporting for Health Canada and state regulators",
      points: ["Automated reports", "Audit trails", "License tracking", "Risk assessment"],
      color: "bg-purple-100 text-purple-800"
    },
    {
      icon: <Truck className="h-8 w-8 text-red-600" />,
      title: "Delivery Management",
      description: "Complete delivery tracking with driver management and customer verification",
      points: ["Real-time tracking", "Driver assignment", "Route optimization", "Customer verification", "Automated dispatch"],
      color: "bg-red-100 text-red-800"
    }
  ]

  const mobileFeatures = [
    {
      icon: <Smartphone className="h-8 w-8 text-indigo-600" />,
      title: "Mobile POS",
      description: "Complete POS functionality on your mobile device"
    },
    {
      icon: <Wifi className="h-8 w-8 text-green-600" />,
      title: "Offline Mode",
      description: "Continue operations even without internet connection"
    },
    {
      icon: <Bell className="h-8 w-8 text-blue-600" />,
      title: "Push Notifications",
      description: "Real-time alerts for orders, inventory, and compliance"
    },
    {
      icon: <Smartphone className="h-8 w-8 text-purple-600" />,
      title: "Touch Optimized",
      description: "Designed specifically for mobile and tablet use"
    }
  ]

  const pricing = [
    {
      name: "Starter",
      price: 99,
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
      popular: false
    },
    {
      name: "Basic",
      price: 199,
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
      popular: false
    },
    {
      name: "Growth",
      price: 299,
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
      popular: true
    },
    {
      name: "Consultant",
      price: 399,
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
      popular: false
    },
    {
      name: "Enterprise",
      price: 499,
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
      popular: false
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Leaf className="h-8 w-8 text-green-600 mr-3" />
              <span className="text-xl font-bold text-gray-900">CannabisOS</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-gray-900">Features</Link>
              <Link href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
              <Link href="/consultants" className="text-gray-600 hover:text-gray-900">For Consultants</Link>
              <Link href="/partners" className="text-gray-600 hover:text-gray-900">Partner Program</Link>
              <Link href="/login" className="text-gray-600 hover:text-gray-900">Login</Link>
              <Link href="/register" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                Get Started
              </Link>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-gray-900"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link href="#features" className="block px-3 py-2 text-gray-600 hover:text-gray-900">Features</Link>
                <Link href="#pricing" className="block px-3 py-2 text-gray-600 hover:text-gray-900">Pricing</Link>
                <Link href="/consultants" className="block px-3 py-2 text-gray-600 hover:text-gray-900">For Consultants</Link>
                <Link href="/partners" className="block px-3 py-2 text-gray-600 hover:text-gray-900">Partner Program</Link>
                <Link href="/login" className="block px-3 py-2 text-gray-600 hover:text-gray-900">Login</Link>
                <Link href="/register" className="block px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                  Get Started
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-emerald-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Complete Dispensary Management Made Simple
            </h1>
            <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto mb-8">
              CannabisOS is the all-in-one platform for modern dispensaries. Manage sales, inventory, compliance, and deliveries from one powerful system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-green-600 px-8 py-3 rounded-md text-lg font-semibold hover:bg-gray-100">
                Start Free Trial
              </Button>
              <Button variant="outline" className="border border-white text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-white hover:text-green-600">
                Login to Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Run Your Dispensary
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From seed to sale, CannabisOS provides all the tools you need to operate a compliant and profitable cannabis business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-lg ${feature.color}`}>
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.points.map((point, pointIndex) => (
                      <li key={pointIndex} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile App Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Mobile App
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Full-featured mobile app for on-the-go dispensary management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {mobileFeatures.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className={`p-3 rounded-lg mb-4 inline-block ${feature.color}`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Consultants Section */}
      <section id="consultants" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              For Cannabis Compliance Consultants
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Manage multiple clients with our white-label consultant portal. Present CannabisOS as your own platform while leveraging our powerful features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <Users2 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Multi-Client Management</h3>
                <p className="text-gray-600 text-sm">Manage all your dispensary clients from one dashboard with individual client isolation and centralized control.</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <Building2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">White-Label Branding</h3>
                <p className="text-gray-600 text-sm">Present the system as your own platform with custom branding, logo, and domain for each client to maintain your professional identity.</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <ChartBar className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Revenue Tracking</h3>
                <p className="text-gray-600 text-sm">Track your consulting revenue and client management with detailed financial analytics and performance metrics.</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <ShieldCheck className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Compliance Tools</h3>
                <p className="text-gray-600 text-sm">Generate reports for multiple clients and regulators with automated compliance tracking and audit trails.</p>
              </CardContent>
            </Card>
          </div>

          {/* Consultant Dashboard */}
          <Card className="max-w-4xl mx-auto border-0 shadow-xl">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-center mb-6">Consultant Dashboard</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">12</div>
                  <div className="text-gray-600">Total Clients</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">2</div>
                  <div className="text-gray-600">At Risk</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">5</div>
                  <div className="text-gray-600">Reports Due</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">$1,980</div>
                  <div className="text-gray-600">Monthly Revenue</div>
                </div>
              </div>
              <div className="text-center mt-6">
                <Button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
                  Access Consultant Portal
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900">500+</div>
              <div className="text-gray-600">Dispensaries Trust Us</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900">99.9%</div>
              <div className="text-gray-600">Compliance Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900">24/7</div>
              <div className="text-gray-600">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Choose the plan that fits your business. Save 17% with yearly billing!
            </p>
            
            <div className="flex justify-center items-center space-x-4 mb-8">
              <span className={`text-lg ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-lg ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
                Yearly <span className="text-sm text-green-600">(Save 17%)</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {pricing.map((plan, index) => (
              <Card
                key={index}
                className={`relative ${
                  plan.popular
                    ? 'border-2 border-green-500 shadow-xl scale-105'
                    : 'border border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-green-500 text-white">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">
                      ${plan.price}
                    </span>
                    <span className="text-gray-600">/per month</span>
                  </div>
                  <p className="text-gray-600 mt-2">{plan.description}</p>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-gray-900 hover:bg-gray-800'
                    } text-white`}
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
      <section className="bg-green-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Dispensary?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
            Join hundreds of dispensaries using CannabisOS to streamline operations, ensure compliance, and grow their business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-green-600 px-8 py-3 rounded-md text-lg font-semibold hover:bg-gray-100">
              Start Free Trial
            </Button>
            <Button variant="outline" className="border border-white text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-white hover:text-green-600">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            <div className="col-span-2">
              <div className="flex items-center mb-4">
                <Leaf className="h-8 w-8 text-green-600 mr-3" />
                <span className="text-xl font-bold">CannabisOS</span>
              </div>
              <p className="text-gray-400 mb-4">
                The complete dispensery management system for modern cannabis businesses.
              </p>
              <div className="flex space-x-4">
                <div className="text-2xl font-bold text-green-600">50M+</div>
                <div className="text-gray-400">Transactions Processed</div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#features" className="hover:text-white">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/notifications" className="hover:text-white">Real-time Notifications</Link></li>
                <li><Link href="/drivers" className="hover:text-white">Driver Management</Link></li>
                <li><Link href="/verification" className="hover:text-white">Customer Verification</Link></li>
                <li><Link href="/payments" className="hover:text-white">Payment Processing</Link></li>
                <li><Link href="/predictive" className="hover:text-white">Predictive Analytics</Link></li>
                <li><Link href="/integrations" className="hover:text-white">Integration Hub</Link></li>
                <li><Link href="#partners" className="hover:text-white">Partner Program</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#about" className="hover:text-white">About</Link></li>
                <li><Link href="#blog" className="hover:text-white">Blog</Link></li>
                <li><Link href="#careers" className="hover:text-white">Careers</Link></li>
                <li><Link href="#contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="#docs" className="hover:text-white">Documentation</Link></li>
                <li><Link href="#status" className="hover:text-white">Status</Link></li>
                <li><Link href="#terms" className="hover:text-white">Terms</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="#compliance" className="hover:text-white">Compliance</Link></li>
                <li><Link href="#security" className="hover:text-white">Security</Link></li>
                <li><Link href="#contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CannabisOS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
