"use client"

import { createClient } from "@/lib/supabase/client"
import { useEffect, useState, useCallback } from "react"
import type { User } from "@supabase/supabase-js"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const newUser = session?.user ?? null
        setUser(newUser)
        setLoading(false)
        
        // Handle authentication events
        if (event === 'SIGNED_IN') {
          setIsAuthenticating(false)
          console.log('User signed in successfully')
        } else if (event === 'SIGNED_OUT') {
          setIsAuthenticating(false)
          // Only redirect on explicit sign out, not on session expiry
          if (window.location.pathname !== '/') {
            window.location.href = '/'
          }
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const signInWithGoogle = useCallback(async () => {
    setIsAuthenticating(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        setIsAuthenticating(false)
        throw error
      }
    } catch (error) {
      setIsAuthenticating(false)
      throw error
    }
  }, [supabase.auth])

  const signOut = useCallback(async () => {
    setIsAuthenticating(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      setIsAuthenticating(false)
      throw error
    }
  }, [supabase.auth])

  return {
    user,
    loading,
    isAuthenticating,
    signInWithGoogle,
    signOut,
    isAuthenticated: !!user
  }
}