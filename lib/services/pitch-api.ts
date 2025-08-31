/**
 * API integration service for pitch analysis
 */

import { 
  BackendPitchAnalysis, 
  AnalysisProgressTracker, 
  AnalysisError,
  transformBackendAnalysis,
  validateAudioForAnalysis,
  parseAnalysisError
} from '../pitch-analysis'
import { PitchMetrics } from '../types/pitch'
import { createAudioFormData } from '../audio-utils'

export interface PitchAnalysisOptions {
  onProgress?: (progress: any) => void
  timeout?: number // milliseconds
  retryAttempts?: number
  retryDelay?: number // milliseconds
}

export type PitchAnalysisResult = {
  success: true
  metrics: PitchMetrics
  sessionId?: string
  processingTime: number
  transcription: string
} | {
  success: false
  error: AnalysisError
}

export class PitchAnalysisService {
  private baseUrl: string
  private defaultTimeout = 60000 // 60 seconds
  private defaultRetryAttempts = 3
  private defaultRetryDelay = 2000 // 2 seconds

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'
  }

  /**
   * Analyze pitch audio with comprehensive error handling and progress tracking
   */
  async analyzePitch(
    audioBlob: Blob,
    duration: number,
    options: PitchAnalysisOptions = {}
  ): Promise<PitchAnalysisResult> {
    const startTime = Date.now()
    const progressTracker = new AnalysisProgressTracker()
    
    if (options.onProgress) {
      progressTracker.onProgress(options.onProgress)
    }

    try {
      // Validate audio before processing
      const validationError = validateAudioForAnalysis(audioBlob)
      if (validationError) {
        progressTracker.error(validationError)
        return { success: false, error: validationError }
      }

      // Start upload phase
      progressTracker.startUpload()

      // Prepare form data
      const formData = createAudioFormData(audioBlob, {
        duration,
        filename: `pitch-${Date.now()}.webm`,
        additionalFields: {
          analysisType: 'pitch'
        }
      })

      // Upload and analyze with retry logic
      const result = await this.executeWithRetry(
        () => this.performAnalysis(formData, progressTracker),
        options.retryAttempts || this.defaultRetryAttempts,
        options.retryDelay || this.defaultRetryDelay
      )

      if (!result.success) {
        progressTracker.error(result.error)
        return result
      }

      // Transform backend response to frontend format
      const metrics = transformBackendAnalysis(result.data)
      progressTracker.complete(metrics)

      return {
        success: true,
        metrics,
        processingTime: Date.now() - startTime,
        transcription: result.data.transcription
      }

    } catch (error) {
      const analysisError = parseAnalysisError(error)
      progressTracker.error(analysisError)
      return { success: false, error: analysisError }
    }
  }

  /**
   * Perform the actual API call to analyze pitch
   */
  private async performAnalysis(
    formData: FormData,
    progressTracker: AnalysisProgressTracker
  ): Promise<{ success: true; data: BackendPitchAnalysis } | { success: false; error: AnalysisError }> {
    try {
      progressTracker.uploadComplete()

      const response = await fetch(`${this.baseUrl}/analyze-pitch`, {
        method: 'POST',
        body: formData,
        signal: AbortSignal.timeout(this.defaultTimeout)
      })

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error')
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      progressTracker.startAnalysis()

      const data: BackendPitchAnalysis = await response.json()

      if (!data.success) {
        throw new Error('Backend analysis failed')
      }

      return { success: true, data }

    } catch (error) {
      return { success: false, error: parseAnalysisError(error) }
    }
  }

  /**
   * Execute function with retry logic
   */
  private async executeWithRetry<T>(
    fn: () => Promise<T>,
    maxAttempts: number,
    delay: number
  ): Promise<T> {
    let lastError: any

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn()
      } catch (error) {
        lastError = error
        
        // Don't retry on non-retryable errors
        const analysisError = parseAnalysisError(error)
        if (!analysisError.retryable || attempt === maxAttempts) {
          throw error
        }

        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, delay * attempt))
      }
    }

    throw lastError
  }

  /**
   * Test connection to backend API
   */
  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      })

      if (!response.ok) {
        return { 
          success: false, 
          error: `Backend returned ${response.status}: ${response.statusText}` 
        }
      }

      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown connection error' 
      }
    }
  }

  /**
   * Get analysis status for async processing (if implemented)
   */
  async getAnalysisStatus(jobId: string): Promise<{
    status: 'pending' | 'processing' | 'complete' | 'failed'
    progress?: number
    result?: PitchMetrics
    error?: string
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/audio-analysis/${jobId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${await this.getAuthToken()}`
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      return {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Get authentication token for protected endpoints
   */
  private async getAuthToken(): Promise<string | null> {
    // This would integrate with your auth system
    // For now, return null as the backend doesn't require auth for analysis
    return null
  }
}

// Singleton instance
export const pitchAnalysisService = new PitchAnalysisService()

/**
 * Hook for using pitch analysis in React components
 */
export function usePitchAnalysis() {
  const analyzePitch = async (
    audioBlob: Blob,
    duration: number,
    options?: PitchAnalysisOptions
  ) => {
    return pitchAnalysisService.analyzePitch(audioBlob, duration, options)
  }

  const testConnection = async () => {
    return pitchAnalysisService.testConnection()
  }

  return {
    analyzePitch,
    testConnection
  }
}