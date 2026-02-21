'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Star, Zap, Shield, Users, Building, Crown, ArrowRight, Leaf, TrendingUp } from 'lucide-react'
import Footer from '@/components/ui/Footer'

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false)

  const pricingPlans = [
    {
      name: "Basic",
      monthlyPrice: "$199",
      yearlyPrice: "$1,999",
      period: "per month",
      periodYearly: "per year",
      description: "Perfect for single-location dispensaries",
      features: [
        "POS System",
        "Inventory Management",
        "Basic Reporting",
        "Mobile App",
        "Email Support",
        "Up to 3 Users",
        "1 Store Location"
      ],
      highlighted: false,
      icon: <Leaf className="h-6 w-6" />,
      color: "text-blue-600"
    },
    {
      name: "Growth",
      monthlyPrice: "$299",
      yearlyPrice: "$2,999",
      period: "per month",
      periodYearly: "per year",
      description: "Ideal for growing dispensaries with multiple locations",
      features: [
        "Everything in Basic",
        "Multi-Store Support",
        "Advanced Reporting",
        "Delivery Management",
        "QR Authentication",
        "Priority Support",
        "Up to 10 Users",
        "Up to 5 Store Locations"
      ],
      highlighted: true,
      icon: <TrendingUp className="h-6 w-6" />,
      color: "text-green-600"
    },
    {
      name: "Consultant",
      monthlyPrice: "$399",
      yearlyPrice: "$3,999",
      period: "per month",
      periodYearly: "per year",
      description: "Complete solution for cannabis compliance consultants",
      features: [
        "Everything in Growth",
        "Multi-Client Management",
        "White-Label Branding",
        "Client Onboarding",
        "Revenue Tracking",
        "Dedicated Support",
        "Unlimited Users",
        "Unlimited Clients"
      ],
      highlighted: false,
      icon: <Users className="h-6 w-6" />,
      color: "text-purple-600"
    },
    {
      name: "Enterprise",
      monthlyPrice: "$499",
      yearlyPrice: "$4,999",
      period: "per month",
      periodYearly: "per year",
      description: "Comprehensive solution for large dispensary chains",
      features: [
        "Everything in Consultant",
        "Unlimited Locations",
        "Custom Integrations",
        "Advanced Analytics",
        "API Access",
        "White-Glove Support",
        "Custom Training",
        "SLA Guarantee"
      ],
      highlighted: false,
      icon: <Building className="h-6 w-6" />,
      color: "text-orange-600"
    },
    {
      name: "Ultimate",
      monthlyPrice: "$999",
      yearlyPrice: "$9,999",
      period: "per month",
      periodYearly: "per year",
      description: "All-inclusive premium package for enterprise-level operations",
      features: [
        "Everything in Enterprise",
        "Unlimited Everything",
        "Dedicated Infrastructure",
        "24/7 Premium Support",
        "Custom Feature Development",
        "On-site Training",
        "Compliance Consulting",
        "Priority Roadmap Access",
        "Zero Downtime Guarantee"
      ],
      highlighted: true,
      icon: <Crown className="h-6 w-6" />,
      color: "text-red-600"
    }
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CEO",
      company: "GreenLeaf Dispensary",
      content: "CannabisOS transformed our operations. We save 20+ hours per week on manual tasks and our compliance is perfect.",
      rating: 5,
      plan: "Growth"
    },
    {
      name: "Mike Chen",
      role: "Founder",
      company: "Cannabis Business Solutions",
      content: "The white-label consultant portal is amazing. We manage 15+ clients from one dashboard.",
      rating: 5,
      plan: "Consultant"
    },
    {
      name: "Emily Rodriguez",
      role: "Operations Manager",
      company: "Premium Cannabis Co",
      content: "Enterprise plan gives us everything we need. The custom integrations save us thousands monthly.",
      rating: 5,
      plan: "Enterprise"
    }
  ]

  const faqs = [
    {
      question: "Can I change my plan later?",
      answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect at the next billing cycle."
    },
    {
      question: "Is there a setup fee?",
      answer: "No setup fees for any plan. We offer free onboarding and data migration for all new customers."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, and ACH transfers. Annual plans can also be paid via invoice."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely! We use bank-level encryption, are SOC 2 Type II certified, and are fully GDPR compliant."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes, you can cancel your subscription at any time. No long-term contracts or cancellation fees."
    },
    {
      question: "Do you offer a free trial?",
      answer: "Yes! We offer a 14-day free trial with full access to all features. No credit card required."
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-emerald-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto mb-8">
              Choose the perfect plan for your business. No hidden fees, no surprises.
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center mb-8">
              <span className={`mr-3 ${!isYearly ? 'text-white font-semibold' : 'text-green-200'}`}>
                Monthly
              </span>
              <button
                onClick={() => setIsYearly(!isYearly)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isYearly ? 'bg-green-500' : 'bg-green-400'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isYearly ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`ml-3 ${isYearly ? 'text-white font-semibold' : 'text-green-200'}`}>
                Yearly
                <span className="text-green-200 text-sm ml-1">Save 17%</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.highlighted ? 'ring-2 ring-green-500 scale-105' : 'hover:shadow-lg transition-shadow'} border-0 shadow-sm`}>
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-green-500 text-white">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    {plan.icon}
                  </div>
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
                        Equivalent to ${(parseInt(plan.yearlyPrice.slice(1)) / 12).toFixed(0)}/month
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
                  >
                    {plan.name === 'Consultant' ? 'Start Consulting' : `Choose ${plan.name}`}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Compare All Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Detailed comparison of all plans and features
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-4 font-semibold text-gray-900">Feature</th>
                  <th className="text-center p-4 font-semibold text-gray-900">Basic</th>
                  <th className="text-center p-4 font-semibold text-gray-900">Growth</th>
                  <th className="text-center p-4 font-semibold text-gray-900">Consultant</th>
                  <th className="text-center p-4 font-semibold text-gray-900">Enterprise</th>
                  <th className="text-center p-4 font-semibold text-gray-900">Ultimate</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-4 font-medium">Point of Sale</td>
                  <td className="p-4 text-center">✓</td>
                  <td className="p-4 text-center">✓</td>
                  <td className="p-4 text-center">✓</td>
                  <td className="p-4 text-center">✓</td>
                  <td className="p-4 text-center">✓</td>
                </tr>
                <tr className="border-b bg-gray-50">
                  <td className="p-4 font-medium">Inventory Management</td>
                  <td className="p-4 text-center">✓</td>
                  <td className="p-4 text-center">✓</td>
                  <td className="p-4 text-center">✓</td>
                  <td className="p-4 text-center">✓</td>
                  <td className="p-4 text-center">✓</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">Multi-Store Support</td>
                  <td className="p-4 text-center">-</td>
                  <td className="p-4 text-center">✓</td>
                  <td className="p-4 text-center">✓</td>
                  <td className="p-4 text-center">✓</td>
                  <td className="p-4 text-center">✓</td>
                </tr>
                <tr className="border-b bg-gray-50">
                  <td className="p-4 font-medium">White-Label Branding</td>
                  <td className="p-4 text-center">-</td>
                  <td className="p-4 text-center">-</td>
                  <td className="p-4 text-center">✓</td>
                  <td className="p-4 text-center">✓</td>
                  <td className="p-4 text-center">✓</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">Custom Integrations</td>
                  <td className="p-4 text-center">-</td>
                  <td className="p-4 text-center">-</td>
                  <td className="p-4 text-center">-</td>
                  <td className="p-4 text-center">✓</td>
                  <td className="p-4 text-center">✓</td>
                </tr>
                <tr className="border-b bg-gray-50">
                  <td className="p-4 font-medium">API Access</td>
                  <td className="p-4 text-center">-</td>
                  <td className="p-4 text-center">-</td>
                  <td className="p-4 text-center">-</td>
                  <td className="p-4 text-center">✓</td>
                  <td className="p-4 text-center">✓</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">Dedicated Infrastructure</td>
                  <td className="p-4 text-center">-</td>
                  <td className="p-4 text-center">-</td>
                  <td className="p-4 text-center">-</td>
                  <td className="p-4 text-center">-</td>
                  <td className="p-4 text-center">✓</td>
                </tr>
                <tr className="border-b bg-gray-50">
                  <td className="p-4 font-medium">24/7 Premium Support</td>
                  <td className="p-4 text-center">-</td>
                  <td className="p-4 text-center">-</td>
                  <td className="p-4 text-center">-</td>
                  <td className="p-4 text-center">-</td>
                  <td className="p-4 text-center">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Loved by dispensaries nationwide
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See what our customers have to say about CannabisOS
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-medium">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}, {testimonial.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Got questions? We've got answers.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="border rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Join 500+ dispensaries using CannabisOS to streamline their operations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}