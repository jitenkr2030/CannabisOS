'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Star, Globe, DollarSign, Leaf, TrendingUp, Package, Users, Building } from 'lucide-react'
import Footer from '@/components/ui/Footer'
import { useI18n } from '@/lib/i18n/provider'
import { formatPrice } from '@/lib/i18n/utils'
import { LanguageSelector } from '@/components/ui/LanguageSelector'

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'en-CA', name: 'English (Canada)', flag: '🇨🇦' },
  { code: 'fr-CA', name: 'Français (Canada)', flag: '🇨🇦' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
]

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'CAD', symbol: '$', name: 'Canadian Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' }
]

const exchangeRates = {
  USD: 1,
  CAD: 1.35,
  EUR: 0.85
}

const translations = {
  en: {
    title: "Simple, Transparent Pricing",
    subtitle: "Choose the perfect plan for your business. Save 17% with yearly billing!",
    monthly: "Monthly",
    yearly: "Yearly",
    save: "Save",
    choosePlan: "Choose Plan",
    featured: "Most Popular",
    targetCustomer: "Target Customer"
  },
  'en-CA': {
    title: "Simple, Transparent Pricing",
    subtitle: "Choose the perfect plan for your Canadian business. Save 17% with yearly billing!",
    monthly: "Monthly",
    yearly: "Yearly",
    save: "Save",
    choosePlan: "Choose Plan",
    featured: "Most Popular",
    targetCustomer: "Target Customer"
  },
  'fr-CA': {
    title: "Tarification Simple et Transparente",
    subtitle: "Choisissez le plan parfait pour votre entreprise. Économisez 17% avec la facturation annuelle!",
    monthly: "Mensuel",
    yearly: "Annuel",
    save: "Économisez",
    choosePlan: "Choisir le Plan",
    featured: "Le Plus Populaire",
    targetCustomer: "Client Cible"
  },
  es: {
    title: "Precios Simples y Transparentes",
    subtitle: "Elige el plan perfecto para tu negocio. ¡Ahorra 17% con facturación anual!",
    monthly: "Mensual",
    yearly: "Anual",
    save: "Ahorra",
    choosePlan: "Elegir Plan",
    featured: "Más Popular",
    targetCustomer: "Cliente Objetivo"
  },
  de: {
    title: "Einfache, Transparente Preise",
    subtitle: "Wählen Sie den perfekten Plan für Ihr Unternehmen. Sparen Sie 17% mit jährlicher Abrechnung!",
    monthly: "Monatlich",
    yearly: "Jährlich",
    save: "Sparen",
    choosePlan: "Plan Wählen",
    featured: "Am Beliebtesten",
    targetCustomer: "Zielkunde"
  }
}

const pricingPlans = [
  {
    name: "Starter",
    usdMonthly: 99,
    usdYearly: 999,
    description: "Perfect for small dispensaries and single shops",
    features: [
      "POS System",
      "Inventory Management",
      "Basic Reporting",
      "Mobile App",
      "Email Support",
      "Up to 2 Users",
      "1 Store Location",
      "99.9% Uptime"
    ],
    highlighted: false,
    icon: <Leaf className="h-6 w-6" />,
    color: "text-blue-600",
    targetCustomer: "Small / single shop"
  },
  {
    name: "Basic",
    usdMonthly: 199,
    usdYearly: 1999,
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
    highlighted: false,
    icon: <Package className="h-6 w-6" />,
    color: "text-green-600",
    targetCustomer: "Growing business"
  },
  {
    name: "Growth",
    usdMonthly: 299,
    usdYearly: 2999,
    description: "Ideal for multi-location dispensaries",
    features: [
      "Everything in Basic",
      "Multi-Store Support",
      "Advanced Reporting",
      "Delivery Management",
      "QR Authentication",
      "Priority Support",
      "Up to 15 Users",
      "Up to 10 Store Locations",
      "API Access"
    ],
    highlighted: true,
    icon: <TrendingUp className="h-6 w-6" />,
    color: "text-green-600",
    targetCustomer: "Multi-location"
  },
  {
    name: "Consultant",
    usdMonthly: 399,
    usdYearly: 3999,
    description: "Complete solution for agencies and consultants",
    features: [
      "Everything in Growth",
      "Multi-Client Management",
      "White-Label Branding",
      "Client Onboarding",
      "Revenue Tracking",
      "Dedicated Account Manager",
      "Unlimited Users",
      "Unlimited Clients",
      "Custom Branding"
    ],
    highlighted: false,
    icon: <Users className="h-6 w-6" />,
    color: "text-purple-600",
    targetCustomer: "Agencies / consultants"
  },
  {
    name: "Enterprise",
    usdMonthly: 499,
    usdYearly: 4999,
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
      "Dedicated Infrastructure",
      "24/7 Phone Support"
    ],
    highlighted: false,
    icon: <Building className="h-6 w-6" />,
    color: "text-orange-600",
    targetCustomer: "Chains / large org"
  }
]

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [selectedCurrency, setSelectedCurrency] = useState('USD')
  const [isClient, setIsClient] = useState(false)

  // Handle client-side rendering
  useState(() => {
    setIsClient(true)
  }, [])

  const t = translations[selectedLanguage] || translations.en
  const currentRate = exchangeRates[selectedCurrency] || 1

  const formatPrice = (price: number) => {
    const convertedPrice = price * currentRate
    const symbol = currencies.find(c => c.code === selectedCurrency)?.symbol || '$'
    return `${symbol}${convertedPrice.toLocaleString()}`
  }

  const handleContactSales = (planName: string) => {
    if (isClient) {
      const subject = encodeURIComponent(`Interest in ${planName} plan`)
      const body = encodeURIComponent(`I'm interested in the ${planName} plan. Please contact me with more information.`)
      window.location.href = `mailto:sales@cannabisos.com?subject=${subject}&body=${body}`
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-green-600 to-emerald-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Language and Currency Selector */}
          <div className="flex justify-end mb-8 space-x-4">
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <select 
                value={selectedLanguage} 
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-white/20 border border-white/30 rounded px-3 py-1 text-white"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4" />
              <select 
                value={selectedCurrency} 
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="bg-white/20 border border-white/30 rounded px-3 py-1 text-white"
              >
                {currencies.map(curr => (
                  <option key={curr.code} value={curr.code}>
                    {curr.code} - {curr.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">{t.title}</h1>
            <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto mb-8">
              {t.subtitle}
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center mb-8">
              <span className={`mr-3 ${!isYearly ? 'text-white font-semibold' : 'text-green-200'}`}>
                {t.monthly}
              </span>
              <button
                onClick={() => setIsYearly(!isYearly)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isYearly ? 'bg-green-400' : 'bg-white/30'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isYearly ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`ml-3 ${isYearly ? 'text-white font-semibold' : 'text-green-200'}`}>
                {t.yearly}
                <span className="text-green-200 text-sm ml-1">
                  {t.save} 17%
                </span>
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
                    <Badge className="bg-green-500 text-white">{t.featured}</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    {plan.icon}
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-gray-900">
                      {formatPrice(isYearly ? plan.usdYearly : plan.usdMonthly)}
                    </span>
                    <span className="text-gray-600">
                      /{isYearly ? t.yearly : t.monthly}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{plan.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{t.targetCustomer}: {plan.targetCustomer}</p>
                </CardHeader>
                <CardContent className="px-6">
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${plan.highlighted ? 'bg-green-600 hover:bg-green-700' : ''}`}
                    onClick={() => handleContactSales(plan.name)}
                  >
                    {t.choosePlan}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
