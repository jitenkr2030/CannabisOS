'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowRight, 
  CheckCircle, 
  Zap, 
  Shield, 
  Smartphone, 
  Globe, 
  Users, 
  BarChart3, 
  Clock, 
  MapPin, 
  QrCode, 
  Package, 
  Truck, 
  Calculator, 
  FileText, 
  Settings, 
  Database, 
  Cloud, 
  Lock, 
  Eye, 
  Filter, 
  Download,
  Upload,
  RefreshCw,
  Bell,
  Search,
  TrendingUp,
  Award,
  Star,
  ChevronRight,
  ShoppingCart,
  Leaf
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Footer from '@/components/ui/Footer'

export default function FeaturesPage() {
  const [activeTab, setActiveTab] = useState('overview')

  const features = {
    core: [
      {
        icon: <ShoppingCart className="h-6 w-6" />,
        title: "Point of Sale (POS)",
        description: "Fast, compliant POS system with age verification, multiple payment methods, and real-time inventory integration.",
        benefits: ["Age verification", "Multiple payments", "Real-time inventory", "Receipt printing"],
        color: "bg-blue-500"
      },
      {
        icon: <Package className="h-6 w-6" />,
        title: "Inventory Management",
        description: "Complete inventory tracking with batch management, low stock alerts, and expiry monitoring.",
        benefits: ["Batch tracking", "Low stock alerts", "Expiry monitoring", "Multi-location"],
        color: "bg-green-500"
      },
      {
        icon: <Calculator className="h-6 w-6" />,
        title: "Accounting System",
        description: "AI-powered expense management with voice recognition, automated categorization, and financial reporting.",
        benefits: ["Voice expense entry", "Auto-categorization", "Financial reports", "Tax calculation"],
        color: "bg-purple-500"
      },
      {
        icon: <Truck className="h-6 w-6" />,
        title: "Delivery Management",
        description: "Complete delivery system with driver management, route optimization, and customer verification.",
        benefits: ["Driver assignment", "Route optimization", "Real-time tracking", "Customer verification"],
        color: "bg-orange-500"
      }
    ],
    advanced: [
      {
        icon: <QrCode className="h-6 w-6" />,
        title: "QR Authentication",
        description: "Unique QR codes for product authentication with lab test details and origin tracking.",
        benefits: ["Product verification", "Lab test details", "Origin tracking", "Anti-counterfeit"],
        color: "bg-cyan-500"
      },
      {
        icon: <FileText className="h-6 w-6" />,
        title: "Compliance Reporting",
        description: "Automated Health Canada compliance reporting with audit trails and risk assessment.",
        benefits: ["Automated reports", "Audit trails", "Risk assessment", "License tracking"],
        color: "bg-red-500"
      },
      {
        icon: <Users className="h-6 w-6" />,
        title: "Multi-Store Support",
        description: "Manage multiple locations from a single dashboard with centralized control and reporting.",
        benefits: ["Centralized management", "Location-specific settings", "Consolidated reporting", "User permissions"],
        color: "bg-indigo-500"
      },
      {
        icon: <BarChart3 className="h-6 w-6" />,
        title: "Advanced Analytics",
        description: "Real-time business analytics with customizable dashboards and predictive insights.",
        benefits: ["Real-time data", "Custom dashboards", "Predictive analytics", "Performance metrics"],
        color: "bg-pink-500"
      }
    ],
    technical: [
      {
        icon: <Smartphone className="h-6 w-6" />,
        title: "Mobile App",
        description: "Full-featured mobile app with offline mode, push notifications, and touch-optimized interface.",
        benefits: ["Offline mode", "Push notifications", "Touch optimized", "Cross-platform"],
        color: "bg-teal-500"
      },
      {
        icon: <Cloud className="h-6 w-6" />,
        title: "Cloud-Based",
        description: "Secure cloud infrastructure with automatic backups, updates, and 99.9% uptime guarantee.",
        benefits: ["Automatic backups", "Regular updates", "99.9% uptime", "Data redundancy"],
        color: "bg-blue-600"
      },
      {
        icon: <Database className="h-6 w-6" />,
        title: "API Access",
        description: "RESTful API for custom integrations with webhooks and comprehensive documentation.",
        benefits: ["RESTful API", "Webhooks", "Developer docs", "Rate limiting"],
        color: "bg-green-600"
      },
      {
        icon: <Shield className="h-6 w-6" />,
        title: "Enterprise Security",
        description: "Bank-level security with encryption, access control, and compliance certifications.",
        benefits: ["End-to-end encryption", "Role-based access", "SOC 2 Type II", "GDPR compliant"],
        color: "bg-red-600"
      }
    ]
  }

  const FeatureCard = ({ feature }: { feature: any }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
      <CardHeader>
        <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
          {feature.icon}
        </div>
        <CardTitle className="text-xl">{feature.title}</CardTitle>
        <CardDescription className="text-gray-600">
          {feature.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {feature.benefits.map((benefit: string, index: number) => (
            <li key={index} className="flex items-center text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
              {benefit}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-emerald-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center mb-6">
              <Zap className="h-16 w-16" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Powerful Features for Modern Dispensaries
            </h1>
            <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto mb-8">
              Everything you need to run a compliant, efficient, and profitable cannabis business
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Feature Set
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From point of sale to compliance reporting, we've got you covered
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-12">
            <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto">
              <TabsTrigger value="overview">Core Features</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
              <TabsTrigger value="technical">Technical</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {features.core.map((feature, index) => (
                  <FeatureCard key={index} feature={feature} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {features.advanced.map((feature, index) => (
                  <FeatureCard key={index} feature={feature} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="technical" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {features.technical.map((feature, index) => (
                  <FeatureCard key={index} feature={feature} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose CannabisOS?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Industry-leading features designed specifically for cannabis businesses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8 border-0 shadow-sm">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Save 20+ Hours/Week</h3>
              <p className="text-gray-600">
                Automate manual tasks and streamline your workflow with our intelligent system
              </p>
            </Card>

            <Card className="text-center p-8 border-0 shadow-sm">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Stay Compliant</h3>
              <p className="text-gray-600">
                Avoid $10K+ in potential fines with automated compliance and reporting
              </p>
            </Card>

            <Card className="text-center p-8 border-0 shadow-sm">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Increase Sales</h3>
              <p className="text-gray-600">
                Boost revenue by 25% with faster checkout and better customer experience
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Dispensary?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Join 500+ dispensaries using CannabisOS to streamline operations and grow their business
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}