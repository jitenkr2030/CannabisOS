'use client'

import PageTemplate from '@/components/PageTemplate'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Lock, Key, Eye, AlertTriangle, CheckCircle } from 'lucide-react'

export default function SecurityCenterPage() {
  return (
    <PageTemplate
      title="Security Center"
      description="Manage system security, authentication, and access control"
      pageType="admin"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Authentication Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-green-600" />
                  <span>Two-Factor Authentication</span>
                </div>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-blue-600" />
                  <span>JWT Token Security</span>
                </div>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-purple-600" />
                  <span>Session Management</span>
                </div>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Security Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="p-2 bg-yellow-50 border border-yellow-200 rounded">
                <strong>Warning:</strong> 3 failed login attempts detected
              </div>
              <div className="p-2 bg-green-50 border border-green-200 rounded">
                <strong>Info:</strong> Security scan completed successfully
              </div>
              <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                <strong>Notice:</strong> Password policy update recommended
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  )
}