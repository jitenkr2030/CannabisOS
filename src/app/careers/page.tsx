'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, MapPin, Mail, Phone, Building, Briefcase, GraduationCap } from 'lucide-react'
import Footer from '@/components/ui/Footer'

export default function CareersPage() {
  const openPositions = [
    {
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "Toronto, ON / Remote",
      type: "Full-time"
    },
    {
      title: "Backend Developer",
      department: "Engineering",
      location: "Toronto, ON / Remote",
      type: "Full-time"
    },
    {
      title: "Product Manager",
      department: "Product",
      location: "Toronto, ON",
      type: "Full-time"
    },
    {
      title: "Sales Representative",
      department: "Sales",
      location: "Remote",
      type: "Full-time"
    }
  ]

  const benefits = [
    "Competitive salary and equity",
    "Comprehensive health benefits",
    "Flexible work arrangements",
    "Professional development budget",
    "Unlimited vacation policy",
    "Wellness stipend",
    "401(k) with company match"
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center mb-6">
              <Briefcase className="h-16 w-16" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Join Our Team
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto mb-8">
              Help us build the future of cannabis dispensary management
            </p>
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
              View Open Positions
            </Button>
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Work at CannabisOS?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join a team that's making a real difference in the cannabis industry
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Open Positions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're always looking for talented people to join our team
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {openPositions.map((position, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold">{position.title}</h3>
                    <Badge variant="outline">{position.type}</Badge>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-2" />
                      {position.department}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {position.location}
                    </div>
                  </div>
                  <Button className="w-full mt-4">Apply Now</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Culture */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-900 text-white rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4 text-center">Our Culture</h2>
            <p className="text-gray-300 text-center mb-8">
              We're a remote-first team that values collaboration, innovation, and work-life balance
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <Users className="h-12 w-12 mx-auto mb-4 text-purple-400" />
                <h3 className="font-semibold mb-2">Collaborative</h3>
                <p className="text-gray-400 text-sm">We work together to solve complex problems</p>
              </div>
              <div>
                <GraduationCap className="h-12 w-12 mx-auto mb-4 text-purple-400" />
                <h3 className="font-semibold mb-2">Learning</h3>
                <p className="text-gray-400 text-sm">Continuous growth and development</p>
              </div>
              <div>
                <Briefcase className="h-12 w-12 mx-auto mb-4 text-purple-400" />
                <h3 className="font-semibold mb-2">Impact</h3>
                <p className="text-gray-400 text-sm">Making a difference in the cannabis industry</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}