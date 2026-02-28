'use client'

export const dynamic = 'force-dynamic'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Lock, Key, Eye, AlertTriangle, CheckCircle, Users, Database, Cloud, Smartphone } from 'lucide-react'

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-6">
            <Shield className="h-16 w-16 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Enterprise-Grade Security
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your data is protected with industry-leading security measures
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="h-6 w-6 mr-2 text-indigo-600" />
                Data Encryption
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                End-to-end encryption for all data in transit and at rest
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="h-6 w-6 mr-2 text-indigo-600" />
                Secure Authentication
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Multi-factor authentication and role-based access control
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-6 w-6 mr-2 text-indigo-600" />
                Regular Backups
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Automated daily backups with point-in-time recovery
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="h-6 w-6 mr-2 text-indigo-600" />
                Compliance Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                24/7 monitoring and compliance with industry standards
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-6 w-6 mr-2 text-indigo-600" />
                Access Control
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Granular permissions and audit logging for all actions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Cloud className="h-6 w-6 mr-2 text-indigo-600" />
                Cloud Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Secure cloud infrastructure with DDoS protection
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                SOC 2 Type II Compliant
              </h3>
              <p className="text-gray-600">
                Our security practices meet the highest industry standards
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
