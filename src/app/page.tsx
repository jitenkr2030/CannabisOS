'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to landing page
    router.push('/landing')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold mb-4">Welcome to CannabisOS</h1>
        <p className="text-gray-600">Redirecting to the main page...</p>
      </div>
    </div>
  )
}
