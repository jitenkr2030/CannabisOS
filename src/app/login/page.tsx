'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, Mail, Lock, Leaf, Database } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSeeding, setIsSeeding] = useState(false)
  const [seedMessage, setSeedMessage] = useState('')
  const [dbStatus, setDbStatus] = useState<{ userCount: number; isSeeded: boolean } | null>(null)

  // Check database status on component mount
  useEffect(() => {
    checkDatabaseStatus()
  }, [])

  const checkDatabaseStatus = async () => {
    try {
      const response = await fetch('/api/seed')
      const data = await response.json()
      setDbStatus({
        userCount: data.userCount || 0,
        isSeeded: data.isSeeded || false
      })
    } catch (error) {
      console.error('Failed to check database status:', error)
    }
  }

  const seedDatabase = async () => {
    setIsSeeding(true)
    setSeedMessage('')
    setError('')

    try {
      const response = await fetch('/api/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (response.ok) {
        setSeedMessage('✅ Database seeded successfully! You can now login.')
        // Refresh database status
        await checkDatabaseStatus()
      } else {
        setSeedMessage(`❌ ${data.error}`)
      }
    } catch (error) {
      setSeedMessage('❌ Failed to seed database. Please try again.')
    } finally {
      setIsSeeding(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        // Store token in localStorage (for demo)
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        
        // Redirect to dashboard
        router.push('/dashboard')
      } else {
        if (data.needsSeeding) {
          setError('🌱 Database needs to be seeded. Click the "Seed Database" button below.')
        } else {
          setError(data.error || 'Login failed')
        }
      }
    } catch (err) {
      setError('Connection error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center items-center mb-6">
            <Leaf className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Sign in to CannabisOS</h2>
          <p className="mt-2 text-sm text-gray-600">
            Access your dispensery management dashboard
          </p>
        </div>

        {/* Database Status */}
        {dbStatus && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Database className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-800">
                  Database: {dbStatus.isSeeded ? `✅ Seeded (${dbStatus.userCount} users)` : '⚠️ Empty - Needs seeding'}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
            <p className="text-sm text-gray-600 text-center">
              Sign in to your account to continue
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {seedMessage && (
              <Alert className={seedMessage.includes('✅') ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                <AlertDescription className={seedMessage.includes('✅') ? 'text-green-800' : 'text-red-800'}>
                  {seedMessage}
                </AlertDescription>
              </Alert>
            )}

            {/* Seed Database Button */}
            {(!dbStatus?.isSeeded) && (
              <div className="space-y-2">
                <Button
                  onClick={seedDatabase}
                  disabled={isSeeding}
                  variant="outline"
                  className="w-full border-orange-300 text-orange-700 hover:bg-orange-50"
                >
                  {isSeeding ? (
                    <>
                      <Database className="mr-2 h-4 w-4 animate-spin" />
                      Seeding Database...
                    </>
                  ) : (
                    <>
                      <Database className="mr-2 h-4 w-4" />
                      Seed Database with Demo Users
                    </>
                  )}
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  Creates admin, manager, staff, and driver accounts (password: demo123)
                </p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Enter your email"
                  className="w-full"
                />
              </div>
              
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="Enter your password"
                  className="w-full"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading || !dbStatus?.isSeeded}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            {/* Demo Credentials */}
            {dbStatus?.isSeeded && (
              <div className="border-t pt-4">
                <p className="text-xs text-gray-500 text-center mb-2">Demo Credentials:</p>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>👤 Admin: admin@cannabisos.com / demo123</div>
                  <div>👤 Manager: manager@cannabisos.com / demo123</div>
                  <div>👤 Staff: staff@cannabisos.com / demo123</div>
                  <div>👤 Driver: driver@cannabisos.com / demo123</div>
                </div>
              </div>
            )}

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link href="/register" className="font-medium text-green-600 hover:text-green-500">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
