'use client'

import { useState, useEffect } from 'react'
import { Search, Menu, X, Leaf, Shield, Users, TrendingUp, DollarSign, Calendar, FileText, Award, BarChart3, CheckCircle, ArrowRight, Star, Lock, Mail, Phone, MapPin, Building, Handshake, Gift, Zap, Target, Briefcase, Globe, CreditCard, ChevronRight, Play, Video, Download, ExternalLink } from 'lucide-react'
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  content: string
  avatar: string
  rating: number
  earnings: string
  tier: string
}

interface PartnerBenefit {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  features: string[]
}

interface PartnerTier {
  id: string
  name: string
  price: string
  commission: string
  description: string
  features: string[]
  highlighted: boolean
  badge?: string
  color: string
}

export default function PartnerLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSignupDialogOpen, setIsSignupDialogOpen] = useState(false)
  const [referralCode, setReferralCode] = useState('')

  useEffect(() => {
    // Check for referral code in URL
    const urlParams = new URLSearchParams(window.location.search)
    const ref = urlParams.get('ref')
    if (ref) {
      setReferralCode(ref)
    }
  }, [])

  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      role: 'CEO',
      company: 'GreenLeaf Consulting',
      content: 'The CannabisOS partner program has transformed my consulting business. With 25% recurring commission and white-label capabilities, I\'ve built a sustainable revenue stream while providing exceptional value to my clients.',
      avatar: 'SJ',
      rating: 5,
      earnings: '$8,000/month',
      tier: 'Gold'
    },
    {
      id: '2',
      name: 'Mike Chen',
      role: 'Founder',
      company: 'Cannabis Business Solutions',
      content: 'The onboarding support was incredible. Within 2 weeks, I had my white-label platform up and running. The commission structure is generous, and the support team is always there when I need them.',
      avatar: 'MC',
      rating: 5,
      earnings: '$5,000/month',
      tier: 'Silver'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      role: 'Principal Consultant',
      company: 'Dispensary Tech Advisors',
      content: 'As a consultant, having a white-label solution is crucial. CannabisOS allows me to present a professional platform under my brand while leveraging their powerful features. The 25% commission is industry-leading.',
      avatar: 'ER',
      rating: 5,
      earnings: '$12,000/month',
      tier: 'Platinum'
    }
  ]

  const benefits: PartnerBenefit[] = [
    {
      id: '1',
      title: '25% Recurring Commission',
      description: 'Earn 25% commission on all subscription revenue from your referrals for the lifetime of the customer',
      icon: <DollarSign className="h-6 w-6" />,
      features: [
        'Monthly commission payments',
        'Lifetime revenue from referrals',
        'Transparent tracking dashboard',
        'No hidden fees or deductions'
      ]
    },
    {
      id: '2',
      title: 'White-Label Dashboard',
      description: 'Offer CannabisOS under your own brand with custom domain, logo, and complete branding control',
      icon: <Building className="h-6 w-6" />,
      features: [
        'Custom domain (yourbrand.dispensaryos.com)',
        'Your logo and branding',
        'Custom color schemes',
        'Company information and contact details'
      ]
    },
    {
      id: '3',
      title: 'Onboarding Support',
      description: 'Get dedicated support for setting up your white-label platform and best practices for success',
      icon: <Handshake className="h-6 w-6" />,
      features: [
        'Personal onboarding specialist',
        'Technical setup assistance',
        'Training materials and videos',
        'Marketing resources and templates'
      ]
    },
    {
      id: '4',
      title: 'Partner Tiers',
      description: 'Progress through tiers with increasing benefits, higher commission rates, and exclusive features',
      icon: <Award className="h-6 w-6" />,
      features: [
        'Bronze to Platinum progression',
        'Increasing commission rates',
        'Exclusive features per tier',
        'Tier-based support levels'
      ]
    }
  ]

  const tiers: PartnerTier[] = [
    {
      id: '1',
      name: 'Bronze',
      price: 'Free',
      commission: '25%',
      description: 'Perfect for getting started with partner program',
      features: [
        '25% recurring commission',
        'Basic dashboard access',
        'Email support',
        'Marketing materials',
        'Referral tracking'
      ],
      highlighted: false,
      color: 'orange'
    },
    {
      id: '2',
      name: 'Silver',
      price: 'Free',
      commission: '25%',
      description: 'Ideal for growing consultants with active referrals',
      features: [
        'Everything in Bronze',
        'White-label enabled',
        'Priority support',
        'Custom branding options',
        'Advanced analytics',
        'API access'
      ],
      highlighted: true,
      badge: 'Most Popular',
      color: 'gray'
    },
    {
      id: '3',
      name: 'Gold',
      price: 'Free',
      commission: '25%',
      description: 'For established consultants with multiple clients',
      features: [
        'Everything in Silver',
        'Custom domain',
        'Dedicated support',
        'Advanced white-label features',
        'Commission optimization',
        'Partner success manager'
      ],
      highlighted: false,
      color: 'yellow'
    },
    {
      id: '4',
      name: 'Platinum',
      price: 'Free',
      commission: '30%',
      description: 'Elite program for top-performing partners',
      features: [
        'Everything in Gold',
        '30% commission rate',
        'White-glove support',
        'Custom integrations',
        'Revenue sharing opportunities',
        'Beta access to new features'
      ],
      highlighted: false,
      badge: 'Elite',
      color: 'purple'
    }
  ]

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    // Handle partner signup logic here
    console.log('Partner signup clicked')
  }

  const copyReferralLink = () => {
    const link = `https://cannabisos.com/partners?ref=${referralCode || 'PARTNER25'}`
    navigator.clipboard.writeText(link)
    // Show toast notification
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Leaf className="h-8 w-8 text-green-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">CannabisOS Partners</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#benefits" className="text-gray-600 hover:text-gray-900 transition-colors">Benefits</a>
              <a href="#tiers" className="text-gray-600 hover:text-gray-900 transition-colors">Partner Tiers</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">Success Stories</a>
              <a href="#faq" className="text-gray-600 hover:text-gray-900 transition-colors">FAQ</a>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setIsSignupDialogOpen(true)}
                className="hidden sm:inline-flex"
              >
                Become a Partner
              </Button>
              <Button
                onClick={() => setIsSignupDialogOpen(true)}
                className="hidden sm:inline-flex bg-green-600 hover:bg-green-700 text-white"
              >
                Start Earning 25%
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
              <a href="#benefits" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Benefits</a>
              <a href="#tiers" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Partner Tiers</a>
              <a href="#testimonials" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Success Stories</a>
              <a href="#faq" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">FAQ</a>
              <div className="border-t border-gray-200 my-2"></div>
              <Button
                variant="outline"
                onClick={() => setIsSignupDialogOpen(true)}
                className="w-full justify-start"
              >
                Become a Partner
              </Button>
              <Button
                onClick={() => setIsSignupDialogOpen(true)}
                className="w-full justify-start bg-green-600 hover:bg-green-700 text-white"
              >
                Start Earning 25%
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
                <Handshake className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Join the CannabisOS
              <span className="text-green-600"> Partner Program</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Earn 25% recurring commission with white-label dashboard and dedicated onboarding support. 
              Perfect for consultants, agencies, and cannabis industry professionals.
            </p>
            
            {/* Partner Offer Alert */}
            <Alert className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 max-w-2xl mx-auto">
              <Gift className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">🎉 Limited Time Offer</AlertTitle>
              <AlertDescription className="text-green-700">
                <strong>25% recurring commission + FREE white-label dashboard + Onboarding support</strong> - 
                No setup fees, no hidden costs. Start earning today!
              </AlertDescription>
            </Alert>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => setIsSignupDialogOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <TrendingUp className="h-5 w-5 mr-2" />
                Start Earning 25% Commission
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setIsSignupDialogOpen(true)}
              >
                <Play className="h-5 w-5 mr-2" />
                Watch Overview
              </Button>
            </div>

            {referralCode && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md mx-auto">
                <p className="text-sm text-yellow-800">
                  <strong>Referred by partner!</strong> Use referral code: <span className="font-mono bg-yellow-100 px-2 py-1 rounded">{referralCode}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section id="benefits" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Partner with CannabisOS?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Industry-leading commission rates, white-label capabilities, and dedicated support to help you succeed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit) => (
              <Card key={benefit.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      {benefit.icon}
                    </div>
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{benefit.description}</p>
                  <ul className="space-y-2">
                    {benefit.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Tiers */}
      <section id="tiers" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Choose Your Partner Tier
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Progress through tiers as you grow. All tiers start with 25% commission, with Platinum partners earning 30%.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {tiers.map((tier) => (
              <Card key={tier.id} className={`relative ${tier.highlighted ? 'ring-2 ring-green-500' : 'hover:shadow-lg transition-shadow'}`}>
                {tier.badge && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-green-500 text-white">{tier.badge}</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    tier.color === 'orange' ? 'bg-orange-100' :
                    tier.color === 'gray' ? 'bg-gray-100' :
                    tier.color === 'yellow' ? 'bg-yellow-100' :
                    'bg-purple-100'
                  }`}>
                    <Award className={`h-8 w-8 ${
                      tier.color === 'orange' ? 'text-orange-600' :
                      tier.color === 'gray' ? 'text-gray-600' :
                      tier.color === 'yellow' ? 'text-yellow-600' :
                      'text-purple-600'
                    }`} />
                  </div>
                  <CardTitle className="text-xl">{tier.name}</CardTitle>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-green-600">{tier.commission}</span>
                    <span className="text-gray-600"> commission</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{tier.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${tier.highlighted ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`}
                    variant={tier.highlighted ? "default" : "outline"}
                  >
                    Choose {tier.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Metrics */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Partner Success Metrics
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how our partners are succeeding with the CannabisOS partner program.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">$50K+</div>
              <div className="text-gray-600">Average Partner Earnings</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">500+</div>
              <div className="text-gray-600">Active Partners</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">25%</div>
              <div className="text-gray-600">Commission Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">95%</div>
              <div className="text-gray-600">Partner Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Success Stories from Our Partners
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from consultants and agencies who are thriving with the CannabisOS partner program.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                      <div className="text-sm text-green-600">{testimonial.company}</div>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 italic mb-4">"{testimonial.content}"</p>
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div>
                      <span className="text-sm text-gray-500">Earnings:</span>
                      <span className="ml-2 font-bold text-green-600">{testimonial.earnings}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {testimonial.tier} Partner
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How the Partner Program Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started in minutes and start earning commission from day one.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-xl">1</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Sign Up</h3>
              <p className="text-gray-600 text-sm">Create your free partner account and choose your tier</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-xl">2</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Refer Clients</h3>
              <p className="text-gray-600 text-sm">Share your unique referral link with cannabis businesses</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-xl">3</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Earn Commission</h3>
              <p className="text-gray-600 text-sm">Receive 25% commission on all subscription revenue</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-xl">4</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Grow Your Business</h3>
              <p className="text-gray-600 text-sm">Use white-label platform and scale your earnings</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Got questions about the partner program? We've got answers.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              <div className="border rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-2">How much commission can I earn?</h3>
                <p className="text-gray-600">Partners earn 25% recurring commission on all subscription revenue from their referrals. Platinum partners earn 30% commission. Our top partners earn over $50,000 per month.</p>
              </div>
              <div className="border rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-2">Is there a cost to join the partner program?</h3>
                <p className="text-gray-600">No! The partner program is completely free to join. There are no setup fees, hidden costs, or minimum requirements.</p>
              </div>
              <div className="border rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-2">What is white-label branding?</h3>
                <p className="text-gray-600">White-label branding allows you to offer CannabisOS under your own brand with custom domain, logo, colors, and company information. Your clients see your brand, not CannabisOS.</p>
              </div>
              <div className="border rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-2">How do I get paid?</h3>
                <p className="text-gray-600">Commissions are paid monthly via PayPal or bank transfer. You'll have access to a real-time dashboard to track your earnings and payment status.</p>
              </div>
              <div className="border rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-2">What kind of support do partners receive?</h3>
                <p className="text-gray-600">All partners receive email support. Silver, Gold, and Platinum partners receive priority support, dedicated onboarding specialists, and custom integration assistance.</p>
              </div>
              <div className="border rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-2">Can I offer CannabisOS to my existing clients?</h3>
                <p className="text-gray-600">Absolutely! Many partners migrate their existing clients to CannabisOS. The white-label platform makes it seamless to present as your own solution.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Partner Journey?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
            Join hundreds of successful consultants and agencies earning 25% commission with CannabisOS.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => setIsSignupDialogOpen(true)}
              className="bg-white text-green-600 hover:bg-gray-100"
            >
              <TrendingUp className="h-5 w-5 mr-2" />
              Become a Partner - Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setIsSignupDialogOpen(true)}
              className="border-white text-white hover:bg-white hover:text-green-600"
            >
              <ExternalLink className="h-5 w-5 mr-2" />
              Download Partner Kit
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
                <span className="text-xl font-bold">CannabisOS Partners</span>
              </div>
              <p className="text-gray-400 text-sm">
                The leading partner program for cannabis industry professionals.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Program</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Benefits</li>
                <li>Partner Tiers</li>
                <li>Commission Structure</li>
                <li>Success Stories</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Partner Dashboard</li>
                <li>Onboarding</li>
                <li>Marketing Materials</li>
                <li>Contact Support</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Partner Agreement</li>
                <li>Commission Terms</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 CannabisOS Partner Program. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Partner Signup Dialog */}
      <Dialog open={isSignupDialogOpen} onOpenChange={setIsSignupDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Join the Partner Program</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="signup" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
              <TabsTrigger value="login">Login</TabsTrigger>
            </TabsList>
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="First name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Last name"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="company">Company Name</Label>
                  <Input
                    id="company"
                    placeholder="Your company name"
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
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    placeholder="https://yourcompany.com"
                  />
                </div>
                <div>
                  <Label htmlFor="tier">Partner Tier</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bronze">Bronze</SelectItem>
                      <SelectItem value="silver">Silver</SelectItem>
                      <SelectItem value="gold">Gold</SelectItem>
                      <SelectItem value="platinum">Platinum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {referralCode && (
                  <div>
                    <Label htmlFor="referral">Referral Code</Label>
                    <Input
                      id="referral"
                      value={referralCode}
                      readOnly
                      className="bg-gray-100"
                    />
                  </div>
                )}
                <Button type="submit" className="w-full">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Start Earning 25% Commission
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
                  Login to Partner Dashboard
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  )
}