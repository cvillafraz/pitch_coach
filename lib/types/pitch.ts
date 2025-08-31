// Core data models for the pitch interface
import type { User } from '@supabase/supabase-js'

export interface PitchMetrics {
  overallScore: number
  clarity: {
    score: number
    feedback: string
    suggestions: string[]
  }
  pace: {
    score: number
    wordsPerMinute: number
    feedback: string
  }
  confidence: {
    score: number
    fillerWords: number
    feedback: string
  }
  structure: {
    score: number
    hasIntro: boolean
    hasProblem: boolean
    hasSolution: boolean
    hasCall: boolean
    feedback: string
  }
  engagement: {
    score: number
    emotionalTone: string
    feedback: string
  }
}

// Additional interfaces for data processing
export interface AnalysisSession {
  id: string
  timestamp: Date
  metrics: PitchMetrics
  transcription: string
  processingTime: number
  audioBlob?: Blob
  duration: number
}

export interface AnalysisStats {
  totalAnalyses: number
  averageScore: number
  bestScore: number
  averageProcessingTime: number
  improvementTrend: number
  strongestArea: string | null
  weakestArea: string | null
}

export interface UserSession {
  user: User | null
  remainingAttempts: number
  isPremium: boolean
  hasSeenWelcome: boolean
}

// Component prop interfaces
export interface MainPitchInterfaceProps {
  // No props needed - component manages its own auth state
}

export interface RecordingPanelProps {
  onRecordingComplete: (audioBlob: Blob, duration: number) => void
  isProcessing: boolean
  disabled?: boolean
}

export interface MetricsPanelProps {
  score: number
  metrics: PitchMetrics | null
  isAuthenticated: boolean
  isProcessing: boolean
  onLoginRequired: () => void
}

export interface ScoreDisplayProps {
  score: number
  isAnimating?: boolean
  size?: 'large' | 'medium' | 'compact'
}

export interface LoginOverlayProps {
  onLogin: () => void
  isVisible: boolean
}

export interface UsageLimitModalProps {
  isOpen: boolean
  remainingAttempts: number
  onClose: () => void
  onUpgrade: () => void
}

// Export User type for external use
export type { User }