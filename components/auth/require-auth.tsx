"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Loader2, Lock } from 'lucide-react'

interface RequireAuthProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function RequireAuth({ children, fallback }: RequireAuthProps) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error('Error getting user:', error)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return fallback || (
      <div className="flex flex-col items-center justify-center min-h-[200px] p-6">
        <div className="text-center max-w-md">
          <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Authentication Required
          </h3>
          <p className="text-gray-600 mb-6">
            Please sign in to access this feature and save your recordings.
          </p>
          <div className="space-y-3">
            <Button 
              onClick={() => router.push('/auth/login')} 
              className="w-full"
            >
              Sign In
            </Button>
            <Button 
              onClick={() => router.push('/auth/signup')} 
              variant="outline"
              className="w-full"
            >
              Create Account
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}