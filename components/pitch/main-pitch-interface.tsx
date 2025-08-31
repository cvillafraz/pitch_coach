'use client'

import { useState, useEffect, memo, useCallback } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { usePitchAnalysis } from '@/hooks/use-pitch-analysis'

import { RecordingPanel } from './recording-panel'
import { MetricsDisplay } from './metrics-display'
import { LoginOverlay } from '@/components/ui/login-overlay'

export const MainPitchInterface = memo(function MainPitchInterface() {
  const { user, loading, signInWithGoogle } = useAuth()
  const pitchAnalysis = usePitchAnalysis()
  const [showLoginOverlay, setShowLoginOverlay] = useState(false)

  const handleRecordingComplete = useCallback(async (_audioBlob: Blob, duration: number) => {
    console.log('Recording completed and analysis started:', { duration })
  }, [])

  const handleNewRecording = useCallback(() => {
    // Clear previous analysis results
    pitchAnalysis.clearResults()
  }, [pitchAnalysis])

  const handleLoginRequired = useCallback(() => {
    setShowLoginOverlay(true)
  }, [])

  const handleLogin = useCallback(async () => {
    try {
      await signInWithGoogle()
      setShowLoginOverlay(false)
    } catch (error) {
      console.error('Login failed:', error)
    }
  }, [signInWithGoogle])

  const handleCloseLogin = useCallback(() => {
    setShowLoginOverlay(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-orange-50 to-yellow-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-yellow-50">
      {/* Main responsive layout */}
      <div className="container mx-auto pitch-layout">
        {/* Recording Panel - Left column on desktop, top on mobile */}
        <div className="flex flex-col">
          <RecordingPanel
            onRecordingComplete={handleRecordingComplete}
            isProcessing={pitchAnalysis.isAnalyzing}
            disabled={false}
          />
        </div>

        {/* Metrics Display - Right column on desktop, bottom on mobile */}
        <div className="flex flex-col">
          <MetricsDisplay
            metrics={pitchAnalysis.metrics}
            transcription={pitchAnalysis.transcription}
            processingTime={pitchAnalysis.processingTime}
            isVisible={true}
            isAuthenticated={!!user}
            onNewRecording={handleNewRecording}
            onLoginRequired={handleLoginRequired}
          />
        </div>
      </div>

      {/* Login Overlay */}
      <LoginOverlay
        isVisible={showLoginOverlay}
        onLogin={handleLogin}
        onClose={handleCloseLogin}
      />
    </div>
  )
})