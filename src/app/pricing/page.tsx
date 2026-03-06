'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, X, Star, Users, Zap, Shield, HeadphonesIcon } from 'lucide-react'

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  const plans = [
    {
      name: 'Basic',
      price: billingCycle === 'monthly' ? 199 : 1990,
      description: 'Perfect for small dispensaries',
      features: [
        'Up to 3 users',
        'Basic inventory management',
        'Sales tracking',
        'Email support',
        'Basic reporting'
      ],
      notIncluded: [
        'Advanced analytics',
        'API access',
        'Priority support',
        'Custom branding'
      ]
    },
    {
      name: 'Professional',
      price: billingCycle === 'monthly' ? 499 : 4990,
      description: 'Ideal for growing businesses',
      features: [
        'Up to 10 users',
        'Advanced inventory management',
        'Sales & customer management',
        'Advanced analytics',
        'API access',
        'Priority support',
        'Custom branding'
      ],
      notIncluded: [
        'White-label options',
        'Dedicated account manager',
        'Custom integrations'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: billingCycle === 'monthly' ? 999 : 9990,
      description: 'For large-scale operations',
      features: [
        'Unlimited users',
        'Complete feature set',
        'Advanced analytics',
        'API access',
        'Priority support',
        'Custom branding',
        'White-label options',
        'Dedicated account manager',
        'Custom integrations',
        'On-premise deployment option'
      ],
      notIncluded: []
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Choose the perfect plan for your dispensary
          </p>
          
          <div className="flex justify-center items-center space-x-4 mb-8">
            <span className={`text-lg ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${
                plan.popular
                  ? 'border-2 border-indigo-500 shadow-lg'
                  : 'border border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-indigo-500 text-white">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">
                    ${plan.price}
                  </span>
                  <span className="text-gray-600">
                    /{billingCycle === 'monthly' ? 'month' : 'year'}
                  </span>
                </div>
                <p className="text-gray-600 mt-2">{plan.description}</p>
              </CardHeader>
              
              <CardContent className="pt-0">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                  {plan.notIncluded.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <X className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  className={`w-full mt-8 ${
                    plan.popular
                      ? 'bg-indigo-600 hover:bg-indigo-700'
                      : 'bg-gray-900 hover:bg-gray-800'
                  } text-white`}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
