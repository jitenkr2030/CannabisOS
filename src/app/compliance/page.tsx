'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, CheckCircle, Shield, AlertTriangle, Calendar, Download, Eye, Scale, Award } from 'lucide-react'
import Footer from '@/components/ui/Footer'

export default function CompliancePage() {
  const complianceAreas = [
    {
      icon: <Scale className="h-8 w-8" />,
      title: "Health Canada Compliance",
      description: "Full compliance with Cannabis Act and regulations",
      features: [
        "Automated CRF reporting",
        "License tracking",
        "Inventory reconciliation",
        "Sales reporting"
      ]
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "State Regulations",
      description: "Compliance with all state-level cannabis regulations",
      features: [
        "Multi-state support",
        "Custom reporting formats",
        "Regulatory updates",
        "Compliance checklists"
      ]
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Audit Trails",
      description: "Complete audit trails for all transactions and changes",
      features: [
        "Immutable logs",
        "User activity tracking",
        "Data change history",
        "Compliance reporting"
      ]
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Reporting Automation",
      description: "Automated generation of all required compliance reports",
      features: [
        "Scheduled reports",
        "Custom report templates",
        "Electronic filing",
        "Archive management"
      ]
    }
  ]

  const complianceFeatures = [
    "Real-time compliance monitoring",
    "Automated regulatory updates",
    "Custom compliance workflows",
    "Risk assessment tools",
    "Compliance dashboards",
    "Alert and notification system",
    "Document management",
    "Training and certification tracking"
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-emerald-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center mb-6">
              <FileText className="h-16 w-16" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Stay Compliant, Stay in Business
            </h1>
            <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto mb-8">
              Comprehensive compliance management for the cannabis industry
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                Download Compliance Guide
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                Schedule Compliance Review
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Areas */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Compliance Coverage
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              All aspects of cannabis compliance management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {complianceAreas.map((area, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-4">
                    {area.icon}
                  </div>
                  <CardTitle className="text-xl">{area.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {area.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {area.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-600">
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

      {/* Key Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Compliance Management Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to maintain compliance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {complianceFeatures.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Risk Management */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 mb-16">
            <div className="flex items-center space-x-4 mb-4">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
              <h3 className="text-2xl font-bold text-gray-900">Risk Mitigation</h3>
            </div>
            <p className="text-gray-700 mb-6">
              Proactive risk identification and mitigation to prevent compliance issues before they occur.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Risk Assessment</h4>
                <p className="text-sm text-gray-600">Automated risk scoring and identification of potential compliance issues.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Alert System</h4>
                <p className="text-sm text-gray-600">Real-time alerts for compliance risks and regulatory changes.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Remediation</h4>
                <p className="text-sm text-gray-600">Guided remediation workflows for identified compliance issues.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}