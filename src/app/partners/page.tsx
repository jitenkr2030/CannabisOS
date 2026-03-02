'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Handshake, 
  Users, 
  TrendingUp, 
  Award, 
  CheckCircle, 
  ArrowRight, 
  Building, 
  Globe, 
  Target,
  Star,
  Shield,
  Zap,
  Gift,
  Crown,
  Rocket
} from 'lucide-react'

export default function PartnersPage() {
  const [email, setEmail] = useState('')

  const benefits = [
    {
      icon: <Crown className="h-8 w-8 text-yellow-600" />,
      title: "Revenue Sharing",
      description: "Earn competitive commissions on all referred customers",
      highlight: "Up to 30% commission"
    },
    {
      icon: <Rocket className="h-8 w-8 text-blue-600" />,
      title: "White-Label Solutions",
      description: "Offer CannabisOS as your own branded platform",
      highlight: "Full customization"
    },
    {
      icon: <Shield className="h-8 w-8 text-green-600" />,
      title: "Dedicated Support",
      description: "Get priority support and account management",
      highlight: "24/7 dedicated support"
    },
    {
      icon: <Gift className="h-8 w-8 text-purple-600" />,
      title: "Marketing Resources",
      description: "Access co-branded materials and marketing campaigns",
      highlight: "Complete marketing kit"
    }
  ]

  const partnerTypes = [
    {
      name: "Technology Partner",
      description: "Integrate with our API and offer enhanced solutions",
      icon: <Globe className="h-6 w-6" />,
      commission: "20-25%"
    },
    {
      name: "Referral Partner",
      description: "Refer customers and earn commissions on sales",
      icon: <Handshake className="h-6 w-6" />,
      commission: "15-20%"
    },
    {
      name: "Reseller Partner",
      description: "Sell CannabisOS to your customer base",
      icon: <Building className="h-6 w-6" />,
      commission: "25-30%"
    },
    {
      name: "Consultant Partner",
      description: "Use CannabisOS to manage multiple client dispensaries",
      icon: <Users className="h-6 w-6" />,
      commission: "20-25%"
    }
  ]

  const stats = [
    { label: "Active Partners", value: "500+", icon: <Users /> },
    { label: "Commission Paid", value: "$2.5M+", icon: <TrendingUp /> },
    { label: "Success Rate", value: "94%", icon: <CheckCircle /> },
    { label: "Support Response", value: "< 2hrs", icon: <Zap /> }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center mb-6">
              <Handshake className="h-16 w-16 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Partner with CannabisOS
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
              Join our partner program and grow your business with the leading dispensery management platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-blue-600 px-8 py-3 rounded-md text-lg font-semibold hover:bg-gray-100">
                Apply Now
              </Button>
              <Button variant="outline" className="border border-white text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-white hover:text-blue-600">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Partner with CannabisOS?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Industry-leading commissions, comprehensive support, and proven success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="p-3 rounded-lg bg-gray-100">
                      {benefit.icon}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold">{benefit.title}</h3>
                      <p className="text-sm text-gray-500">{benefit.highlight}</p>
                    </div>
                  </div>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Types Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Partnership Type
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Different partnership options to suit your business model
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {partnerTypes.map((type, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="p-2 rounded-lg bg-blue-100">
                      {type.icon}
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold">{type.name}</h3>
                      <Badge className="text-sm mt-1">{type.commission}</Badge>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{type.description}</p>
                  <Button className="w-full" variant="outline">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Proven Partner Success
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join hundreds of successful partners growing with CannabisOS
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center items-center mb-2">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Grow Your Business?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join our partner program and start earning commissions today
          </p>
          
          <div className="max-w-md mx-auto">
            <form onSubmit={(e) => { e.preventDefault(); }} className="space-y-4">
              <div>
                <Label htmlFor="partner-email" className="text-white">Email Address</Label>
                <Input
                  id="partner-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full"
                />
              </div>
              <Button className="w-full bg-white text-blue-600 px-6 py-3 rounded-md text-lg font-semibold hover:bg-gray-100">
                Apply to Partner Program
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
