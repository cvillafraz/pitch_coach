"use client"

import { useState, useEffect } from 'react'
import { PitchSessionService, type PitchSession } from '@/lib/supabase/pitch-sessions'

export function usePitchSessions() {
  const [sessions, setSessions] = useState<PitchSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const pitchService = new PitchSessionService()

  const fetchSessions = async (limit = 10) => {
    try {
      setLoading(true)
      setError(null)
      const userSessions = await pitchService.getUserSessions(limit)
      setSessions(userSessions)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sessions')
    } finally {
      setLoading(false)
    }
  }

  const createSession = async (data: {
    persona_name: string
    persona_type: string
    transcript?: string
    duration?: number
    audio_blob_url?: string
    audio_filename?: string
    audio_size_bytes?: number
  }) => {
    try {
      const newSession = await pitchService.createSession(data)
      if (newSession) {
        setSessions(prev => [newSession, ...prev])
        return newSession
      }
      return null
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create session')
      return null
    }
  }

  const updateSessionAudio = async (
    sessionId: string, 
    audioData: {
      audio_blob_url: string
      audio_filename: string
      audio_size_bytes: number
    }
  ) => {
    try {
      const success = await pitchService.updateSessionAudio(sessionId, audioData)
      if (success) {
        // Update local state
        setSessions(prev => prev.map(session => 
          session.id === sessionId 
            ? { 
                ...session, 
                ...audioData, 
                audio_uploaded_at: new Date().toISOString() 
              }
            : session
        ))
      }
      return success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update session audio')
      return false
    }
  }

  const updateSessionScores = async (
    sessionId: string,
    scores: {
      overall_score?: number
      content_score?: number
      delivery_score?: number
      structure_score?: number
      engagement_score?: number
      feedback_summary?: string
      recommendations?: string[]
    }
  ) => {
    try {
      const success = await pitchService.updateSessionScores(sessionId, scores)
      if (success) {
        // Update local state
        setSessions(prev => prev.map(session => 
          session.id === sessionId 
            ? { ...session, ...scores }
            : session
        ))
      }
      return success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update session scores')
      return false
    }
  }

  const deleteSession = async (sessionId: string) => {
    try {
      const success = await pitchService.deleteSession(sessionId)
      if (success) {
        setSessions(prev => prev.filter(session => session.id !== sessionId))
      }
      return success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete session')
      return false
    }
  }

  const getSessionsWithAudio = async () => {
    try {
      setLoading(true)
      setError(null)
      const audioSessions = await pitchService.getSessionsWithAudio()
      return audioSessions
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch audio sessions')
      return []
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSessions()
  }, [])

  return {
    sessions,
    loading,
    error,
    fetchSessions,
    createSession,
    updateSessionAudio,
    updateSessionScores,
    deleteSession,
    getSessionsWithAudio,
    refreshSessions: fetchSessions
  }
}