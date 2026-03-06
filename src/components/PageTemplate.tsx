'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Settings, LogOut } from 'lucide-react'

interface PageTemplateProps {
  title: string
  description: string
  children: React.ReactNode
  pageType: 'admin' | 'manager' | 'staff' | 'driver'
}

export default function PageTemplate({ title, description, children, pageType }: PageTemplateProps) {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  const getRoleColor = () => {
    switch (pageType) {
      case 'admin': return 'bg-purple-100 text-purple-800'
      case 'manager': return 'bg-blue-100 text-blue-800'
      case 'staff': return 'bg-green-100 text-green-800'
      case 'driver': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleLabel = () => {
    switch (pageType) {
      case 'admin': return 'Admin'
      case 'manager': return 'Manager'
      case 'staff': return 'Staff'
      case 'driver': return 'Driver'
      default: return 'User'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            <Badge className={getRoleColor()}>
              {getRoleLabel()}
            </Badge>
          </div>
          <p className="text-gray-600">{description}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => router.push('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Page Content */}
      {children}
    </div>
  )
}