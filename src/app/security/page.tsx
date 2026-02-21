'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Lock, Eye, Database, Cloud, CheckCircle, AlertTriangle, Award, Verified } from 'lucide-react'
import Footer from '@/components/ui/Footer'

export default function SecurityPage() {
  const securityFeatures = [
    {
      icon: <Lock className="h-8 w-8" />,
      title: "End-to-End Encryption",
      description: "All data is encrypted using AES-256 encryption, both in transit and at rest.",
      details: "Military-grade encryption protects your sensitive business and customer data."
    },
    {
      icon: <Database className="h-8 w-8" />,
      title: "Secure Data Centers",
      description: "Our infrastructure is hosted in SOC 2 Type II certified data centers.",
      details: "24/7 monitoring, biometric access controls, and redundant power systems."
    },
    {
      icon: <Eye className="h-8 w-8" />,
      title: "Role-Based Access Control",
      description: "Granular permissions ensure employees only access what they need.",
      details: "Custom roles, least-privilege access, and comprehensive audit trails."
    },
    {
      icon: <Cloud className="h-8 w-8" />,
      title: "Regular Backups",
      description: "Automated daily backups with point-in-time recovery capabilities.",
      details: "Geo-redundant backups with 99.9% recovery time objective (RTO)."
    }
  ]

  const certifications = [
    {
      name: "SOC 2 Type II",
      description: "Independent audit of our security controls and processes",
      icon: <Award className="h-6 w-6" />
    },
    {
      name: "GDPR Compliant",
      description: "Full compliance with EU General Data Protection Regulation",
      icon: <Verified className="h-6 w-6" />
    },
    {
      name: "HIPAA Compliant",
      description: "Meets healthcare data protection standards",
      icon: <Shield className="h-6 w-6" />
    },
    {
      name: "PCI DSS",
      description: "Payment Card Industry Data Security Standard compliance",
      icon: <Lock className="h-6 w-6" />
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center mb-6">
              <Shield className="h-16 w-16" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Enterprise-Grade Security
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
              Bank-level security to protect your business and customer data
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                View Security Report
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Contact Security Team
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Security Built In
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive security measures at every layer
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {securityFeatures.map((feature, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">{feature.details}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Compliance & Certifications
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Independently verified and certified
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {certifications.map((cert, index) => (
              <Card key={index} className="text-center border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4">
                    {cert.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{cert.name}</h3>
                  <p className="text-sm text-gray-600">{cert.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security Stats */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">99.9%</div>
              <p className="text-gray-600">Uptime SLA</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">24/7</div>
              <p className="text-gray-600">Security Monitoring</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">256-bit</div>
              <p className="text-gray-600">Encryption</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">0</div>
              <p className="text-gray-600">Security Breaches</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}