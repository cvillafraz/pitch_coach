/**
 * Comprehensive hook for pitch analysis with data processing, API integration,
 * loading states, and error handling
 */

import { useState, useCallback, useRef, useMemo } from 'react'
import { PitchMetrics } from '@/lib/types/pitch'
import { 
  AnalysisProgress, 
  AnalysisError, 
  AnalysisProgressTracker 
} from '@/lib/pitch-analysis'
import { pitchAnalysisService, PitchAnalysisOptions } from '@/lib/services/pitch-api'

export interface UsePitchAnalysisState {
  isAnalyzing: boolean
  progress: AnalysisProgress | null
  metrics: PitchMetrics | null
  error: AnalysisError | null
  transcription: string | null
  processingTime: number | null
  retryCount: number
}

export interface UsePitchAnalysisActions {
  analyzePitch: (audioBlob: Blob, duration: number, options?: PitchAnalysisOptions) => Promise<void>
  retry: () => Promise<void>
  cancel: () => void
  clearError: () => void
  clearResults: () => void
  testConnection: () => Promise<boolean>
}

export interface UsePitchAnalysisReturn extends UsePitchAnalysisState, UsePitchAnalysisActions {}

const initialState: UsePitchAnalysisState = {
  isAnalyzing: false,
  progress: null,
  metrics: null,
  error: null,
  transcription: null,
  processingTime: null,
  retryCount: 0
}

export function usePitchAnalysis(): UsePitchAnalysisReturn {
  const [state, setState] = useState<UsePitchAnalysisState>(initialState)
  const abortControllerRef = useRef<AbortController | null>(null)
  const lastAnalysisParamsRef = useRef<{
    audioBlob: Blob
    duration: number
    options?: PitchAnalysisOptions
  } | null>(null)

  const updateState = useCallback((updates: Partial<UsePitchAnalysisState>) => {
    setState(prev => ({ ...prev, ...updates }))
  }, [])

  const clearError = useCallback(() => {
    updateState({ error: null })
  }, [updateState])

  const clearResults = useCallback(() => {
    updateState({
      metrics: null,
      transcription: null,
      processingTime: null,
      progress: null,
      error: null,
      retryCount: 0
    })
  }, [updateState])

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    
    updateState({
      isAnalyzing: false,
      progress: null,
      error: {
        type: 'unknown',
        message: 'Analysis cancelled by user',
        retryable: false
      }
    })
  }, [updateState])

  const analyzePitch = useCallback(async (
    audioBlob: Blob,
    duration: number,
    options: PitchAnalysisOptions = {}
  ) => {
    // Store parameters for retry functionality
    lastAnalysisParamsRef.current = { audioBlob, duration, options }

    // Create abort controller for cancellation
    abortControllerRef.current = new AbortController()

    // Reset state
    updateState({
      isAnalyzing: true,
      progress: null,
      metrics: null,
      error: null,
      transcription: null,
      processingTime: null
    })

    try {
      // Set up progress tracking
      const progressCallback = (progress: AnalysisProgress) => {
        updateState({ progress })
      }

      const analysisOptions: PitchAnalysisOptions = {
        ...options,
        onProgress: progressCallback
      }

      // Perform analysis
      const result = await pitchAnalysisService.analyzePitch(
        audioBlob,
        duration,
        analysisOptions
      )

      // Check if cancelled
      if (abortControllerRef.current?.signal.aborted) {
        return
      }

      if (result.success) {
        updateState({
          isAnalyzing: false,
          metrics: result.metrics,
          transcription: result.transcription,
          processingTime: result.processingTime,
          progress: {
            stage: 'complete',
            progress: 100,
            message: `Analysis complete! Overall score: ${result.metrics.overallScore}%`
          },
          retryCount: 0
        })
      } else {
        updateState({
          isAnalyzing: false,
          error: result.error,
          progress: {
            stage: 'error',
            progress: 0,
            message: result.error.message
          }
        })
      }
    } catch (error) {
      // Handle unexpected errors
      const analysisError: AnalysisError = {
        type: 'unknown',
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
        retryable: true
      }

      updateState({
        isAnalyzing: false,
        error: analysisError,
        progress: {
          stage: 'error',
          progress: 0,
          message: analysisError.message
        }
      })
    } finally {
      abortControllerRef.current = null
    }
  }, [updateState])

  const retry = useCallback(async () => {
    if (!lastAnalysisParamsRef.current) {
      console.warn('No previous analysis to retry')
      return
    }

    const { audioBlob, duration, options } = lastAnalysisParamsRef.current
    
    updateState({ 
      retryCount: state.retryCount + 1,
      error: null 
    })

    await analyzePitch(audioBlob, duration, options)
  }, [analyzePitch, state.retryCount, updateState])

  const testConnection = useCallback(async (): Promise<boolean> => {
    try {
      const result = await pitchAnalysisService.testConnection()
      return result.success
    } catch (error) {
      console.error('Connection test failed:', error)
      return false
    }
  }, [])

  return useMemo(() => ({
    // State
    isAnalyzing: state.isAnalyzing,
    progress: state.progress,
    metrics: state.metrics,
    error: state.error,
    transcription: state.transcription,
    processingTime: state.processingTime,
    retryCount: state.retryCount,
    
    // Actions
    analyzePitch,
    retry,
    cancel,
    clearError,
    clearResults,
    testConnection
  }), [
    state.isAnalyzing,
    state.progress,
    state.metrics,
    state.error,
    state.transcription,
    state.processingTime,
    state.retryCount,
    analyzePitch,
    retry,
    cancel,
    clearError,
    clearResults,
    testConnection
  ])
}

/**
 * Hook for managing multiple analysis sessions
 */
export function usePitchAnalysisHistory() {
  const [history, setHistory] = useState<Array<{
    id: string
    timestamp: Date
    metrics: PitchMetrics
    transcription: string
    processingTime: number
  }>>([])

  const addToHistory = useCallback((
    metrics: PitchMetrics,
    transcription: string,
    processingTime: number
  ) => {
    const entry = {
      id: `analysis-${Date.now()}`,
      timestamp: new Date(),
      metrics,
      transcription,
      processingTime
    }

    setHistory(prev => [entry, ...prev.slice(0, 9)]) // Keep last 10 entries
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
  }, [])

  const removeFromHistory = useCallback((id: string) => {
    setHistory(prev => prev.filter(entry => entry.id !== id))
  }, [])

  return {
    history,
    addToHistory,
    clearHistory,
    removeFromHistory
  }
}

/**
 * Hook for analysis statistics and insights
 */
export function usePitchAnalysisStats(history: ReturnType<typeof usePitchAnalysisHistory>['history']) {
  const stats = {
    totalAnalyses: history.length,
    averageScore: history.length > 0 
      ? Math.round(history.reduce((sum, entry) => sum + entry.metrics.overallScore, 0) / history.length)
      : 0,
    bestScore: history.length > 0 
      ? Math.max(...history.map(entry => entry.metrics.overallScore))
      : 0,
    averageProcessingTime: history.length > 0
      ? Math.round(history.reduce((sum, entry) => sum + entry.processingTime, 0) / history.length)
      : 0,
    improvementTrend: history.length >= 2
      ? history[0].metrics.overallScore - history[history.length - 1].metrics.overallScore
      : 0,
    strongestArea: history.length > 0
      ? getStrongestArea(history[0].metrics)
      : null,
    weakestArea: history.length > 0
      ? getWeakestArea(history[0].metrics)
      : null
  }

  return stats
}

function getStrongestArea(metrics: PitchMetrics): string {
  const scores = {
    clarity: metrics.clarity.score,
    pace: metrics.pace.score,
    confidence: metrics.confidence.score,
    structure: metrics.structure.score,
    engagement: metrics.engagement.score
  }

  return Object.entries(scores).reduce((a, b) => scores[a[0]] > scores[b[0]] ? a : b)[0]
}

function getWeakestArea(metrics: PitchMetrics): string {
  const scores = {
    clarity: metrics.clarity.score,
    pace: metrics.pace.score,
    confidence: metrics.confidence.score,
    structure: metrics.structure.score,
    engagement: metrics.engagement.score
  }

  return Object.entries(scores).reduce((a, b) => scores[a[0]] < scores[b[0]] ? a : b)[0]
}