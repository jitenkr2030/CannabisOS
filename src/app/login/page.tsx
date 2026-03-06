'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, Mail, Lock, Leaf, User, CheckCircle } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Auto-fill demo credentials on mount
  useEffect(() => {
    setFormData({
      email: 'admin@cannabisos.com',
      password: 'demo123'
    })
  }, [])

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
        setError(data.error || 'Login failed')
      }
    } catch (err) {
      setError('Connection error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const quickLogin = (email: string, password: string) => {
    setFormData({ email, password })
    // Auto-submit after a short delay
    setTimeout(() => {
      const form = document.getElementById('login-form') as HTMLFormElement
      if (form) form.requestSubmit()
    }, 100)
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
          <div className="mt-4 p-3 bg-green-100 rounded-lg">
            <p className="text-sm text-green-800 font-medium">
              ✅ Demo credentials pre-filled below
            </p>
            <p className="text-xs text-green-600 mt-1">
              Just click "Sign in" or change credentials
            </p>
          </div>
        </div>

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
            
            {/* Demo Credentials */}
            <div className="border rounded-lg p-4 bg-green-50">
              <h3 className="text-sm font-semibold text-green-700 mb-3 flex items-center">
                <User className="h-4 w-4 mr-2" />
                Demo Credentials (Click to Auto-Fill & Login)
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => quickLogin('admin@cannabisos.com', 'demo123')}
                  className="w-full text-left p-2 text-sm bg-white border rounded hover:bg-green-100 transition-colors"
                >
                  <span className="font-medium text-green-600">👤 Admin:</span> admin@cannabisos.com / demo123
                </button>
                <button
                  onClick={() => quickLogin('manager@cannabisos.com', 'demo123')}
                  className="w-full text-left p-2 text-sm bg-white border rounded hover:bg-green-100 transition-colors"
                >
                  <span className="font-medium text-blue-600">👤 Manager:</span> manager@cannabisos.com / demo123
                </button>
                <button
                  onClick={() => quickLogin('staff@cannabisos.com', 'demo123')}
                  className="w-full text-left p-2 text-sm bg-white border rounded hover:bg-green-100 transition-colors"
                >
                  <span className="font-medium text-purple-600">👤 Staff:</span> staff@cannabisos.com / demo123
                </button>
                <button
                  onClick={() => quickLogin('driver@cannabisos.com', 'demo123')}
                  className="w-full text-left p-2 text-sm bg-white border rounded hover:bg-green-100 transition-colors"
                >
                  <span className="font-medium text-orange-600">👤 Driver:</span> driver@cannabisos.com / demo123
                </button>
              </div>
              <p className="text-xs text-green-600 mt-2 text-center">
                Click any button above to auto-fill and login
              </p>
            </div>
            
            <form id="login-form" onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
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
                  autoComplete="current-password"
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
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

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