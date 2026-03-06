'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import AdminDashboard from '@/components/dashboard/AdminDashboard'
import ManagerDashboard from '@/components/dashboard/ManagerDashboard'
import StaffDashboard from '@/components/dashboard/StaffDashboard'
import DriverDashboard from '@/components/dashboard/DriverDashboard'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Check authentication and get user data on mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token) {
      // Redirect to login if not authenticated
      router.push('/login')
      return
    }
    
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    }
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900">Loading Dashboard</h2>
          <p className="text-gray-600 mt-2">Preparing your workspace...</p>
        </div>
      </div>
    )
  }

  // Show error if no user data
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <AlertTriangle className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Error</h2>
          <p className="text-gray-600 mb-4">Unable to load user information</p>
          <Button onClick={() => router.push('/login')}>
            Return to Login
          </Button>
        </div>
      </div>
    )
  }

  // Render role-specific dashboard
  const userRole = user.role?.toUpperCase()
  
  switch (userRole) {
    case 'ADMIN':
      return <AdminDashboard user={user} onLogout={handleLogout} />
    
    case 'MANAGER':
      return <ManagerDashboard user={user} onLogout={handleLogout} />
    
    case 'STAFF':
      return <StaffDashboard user={user} onLogout={handleLogout} />
    
    case 'DRIVER':
      return <DriverDashboard user={user} onLogout={handleLogout} />
    
    default:
      // Fallback for unknown roles
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="text-orange-600 mb-4">
              <AlertTriangle className="h-12 w-12 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Role Not Recognized</h2>
            <p className="text-gray-600 mb-4">Your role ({userRole}) is not configured in the system</p>
            <Button onClick={handleLogout}>
              Logout and Contact Support
            </Button>
          </div>
        </div>
      )
  }
}