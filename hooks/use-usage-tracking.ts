"use client"

import { createClient } from "@/lib/supabase/client"
import { useEffect, useState, useCallback, useMemo } from "react"
import type { User } from "@supabase/supabase-js"

interface UsageData {
  remainingAttempts: number
  isPremium: boolean
  hasSeenWelcome: boolean
  totalAttempts: number
}

const FREE_ATTEMPT_LIMIT = 3

export function useUsageTracking(user: User | null) {
  const [usageData, setUsageData] = useState<UsageData>({
    remainingAttempts: FREE_ATTEMPT_LIMIT,
    isPremium: false,
    hasSeenWelcome: false,
    totalAttempts: 0
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  // Load usage data from localStorage and Supabase
  useEffect(() => {
    const loadUsageData = async () => {
      if (!user) {
        // For unauthenticated users, use localStorage
        const localData = localStorage.getItem('pitch-usage')
        if (localData) {
          try {
            const parsed = JSON.parse(localData)
            setUsageData(prev => ({
              ...prev,
              remainingAttempts: Math.max(0, FREE_ATTEMPT_LIMIT - (parsed.attempts || 0)),
              totalAttempts: parsed.attempts || 0
            }))
          } catch (error) {
            console.error('Error parsing local usage data:', error)
          }
        }
        setLoading(false)
        return
      }

      try {
        // For authenticated users, check Supabase
        const { data, error } = await supabase
          .from('user_usage')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
          console.error('Error loading usage data:', error)
          setLoading(false)
          return
        }

        if (data) {
          setUsageData({
            remainingAttempts: data.is_premium ? Infinity : Math.max(0, FREE_ATTEMPT_LIMIT - data.total_attempts),
            isPremium: data.is_premium || false,
            hasSeenWelcome: data.has_seen_welcome || false,
            totalAttempts: data.total_attempts || 0
          })
        } else {
          // Create initial record for new user
          const { error: insertError } = await supabase
            .from('user_usage')
            .insert({
              user_id: user.id,
              total_attempts: 0,
              is_premium: false,
              has_seen_welcome: false
            })

          if (insertError) {
            console.error('Error creating usage record:', insertError)
          }
        }
      } catch (error) {
        console.error('Error in loadUsageData:', error)
      }

      setLoading(false)
    }

    loadUsageData()
  }, [user, supabase])

  // Record a pitch attempt
  const recordAttempt = useCallback(async () => {
    if (!user) {
      // For unauthenticated users, use localStorage
      const localData = localStorage.getItem('pitch-usage')
      let currentAttempts = 0
      
      if (localData) {
        try {
          const parsed = JSON.parse(localData)
          currentAttempts = parsed.attempts || 0
        } catch (error) {
          console.error('Error parsing local usage data:', error)
        }
      }

      const newAttempts = currentAttempts + 1
      localStorage.setItem('pitch-usage', JSON.stringify({ attempts: newAttempts }))
      
      setUsageData(prev => ({
        ...prev,
        remainingAttempts: Math.max(0, FREE_ATTEMPT_LIMIT - newAttempts),
        totalAttempts: newAttempts
      }))

      return
    }

    try {
      // For authenticated users, update Supabase
      setUsageData(prev => {
        const newTotalAttempts = prev.totalAttempts + 1
        return {
          ...prev,
          remainingAttempts: prev.isPremium ? Infinity : Math.max(0, FREE_ATTEMPT_LIMIT - newTotalAttempts),
          totalAttempts: newTotalAttempts
        }
      })

      const { error } = await supabase
        .from('user_usage')
        .update({ 
          total_attempts: usageData.totalAttempts + 1,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)

      if (error) {
        console.error('Error recording attempt:', error)
        // Revert the optimistic update
        setUsageData(prev => ({
          ...prev,
          remainingAttempts: prev.isPremium ? Infinity : Math.max(0, FREE_ATTEMPT_LIMIT - (prev.totalAttempts - 1)),
          totalAttempts: prev.totalAttempts - 1
        }))
        return
      }
    } catch (error) {
      console.error('Error in recordAttempt:', error)
    }
  }, [user, usageData.totalAttempts, supabase])

  // Mark welcome as seen
  const markWelcomeSeen = useCallback(async () => {
    if (!user) {
      // For non-authenticated users, just update local state
      setUsageData(prev => ({
        ...prev,
        hasSeenWelcome: true
      }))
      return
    }

    try {
      const { error } = await supabase
        .from('user_usage')
        .update({ 
          has_seen_welcome: true,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)

      if (error) {
        console.error('Error marking welcome as seen:', error)
        return
      }

      setUsageData(prev => ({
        ...prev,
        hasSeenWelcome: true
      }))
    } catch (error) {
      console.error('Error in markWelcomeSeen:', error)
    }
  }, [user, supabase])

  // Check if user can make another attempt
  const canMakeAttempt = usageData.isPremium || usageData.remainingAttempts > 0

  // Check if user should see welcome modal (only for authenticated users)
  const shouldShowWelcome = user && !usageData.hasSeenWelcome && !loading && usageData.totalAttempts === 0

  // Check if user has hit the limit
  const hasHitLimit = !usageData.isPremium && usageData.remainingAttempts === 0

  return useMemo(() => ({
    ...usageData,
    loading,
    canMakeAttempt,
    shouldShowWelcome,
    hasHitLimit,
    recordAttempt,
    markWelcomeSeen
  }), [
    usageData,
    loading,
    canMakeAttempt,
    shouldShowWelcome,
    hasHitLimit,
    recordAttempt,
    markWelcomeSeen
  ])
}