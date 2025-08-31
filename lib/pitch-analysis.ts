/**
 * Data processing and transformation utilities for pitch analysis
 */

import { PitchMetrics } from './types/pitch'

// Backend API response interfaces
export interface BackendPitchAnalysis {
  success: boolean
  filename: string
  content_type: string
  file_size: number
  duration: string
  timestamp: string
  transcription: string
  emotion_analysis: {
    dominant_emotion: string
    total_segments: number
    confidence: number
  }
  pitch_scores: {
    tone: number
    fluency: number
    clarity: number
    confidence: number
    explanation: string
    metadata: {
      model_used: string
      transcription_confidence: number
      dominant_emotion: {
        name: string
        score: number
      }
      total_segments: number
    }
  }
  raw_analysis: any
}

export interface AnalysisProgress {
  stage: 'uploading' | 'processing' | 'analyzing' | 'complete' | 'error'
  progress: number // 0-100
  message: string
  estimatedTimeRemaining?: number // seconds
}

export interface AnalysisError {
  type: 'network' | 'validation' | 'processing' | 'authentication' | 'quota' | 'unknown'
  message: string
  details?: string
  retryable: boolean
  retryAfter?: number // seconds
}

/**
 * Transform backend analysis response to frontend PitchMetrics format
 */
export function transformBackendAnalysis(backendData: BackendPitchAnalysis): PitchMetrics {
  const { pitch_scores, transcription, emotion_analysis } = backendData
  
  // Calculate overall score as weighted average
  const overallScore = Math.round(
    (pitch_scores.tone * 0.25) +
    (pitch_scores.fluency * 0.25) +
    (pitch_scores.clarity * 0.25) +
    (pitch_scores.confidence * 0.25)
  )

  // Generate suggestions based on scores
  const generateSuggestions = (score: number, category: string): string[] => {
    if (score >= 80) return [`Excellent ${category}! Keep up the great work.`]
    if (score >= 60) return [`Good ${category}. Consider minor improvements for polish.`]
    if (score >= 40) return [`${category} needs improvement. Focus on practice in this area.`]
    return [`${category} requires significant work. Consider targeted exercises.`]
  }

  // Extract structure insights from transcription
  const analyzeStructure = (text: string) => {
    const lowerText = text.toLowerCase()
    return {
      hasIntro: lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('good'),
      hasProblem: lowerText.includes('problem') || lowerText.includes('issue') || lowerText.includes('challenge'),
      hasSolution: lowerText.includes('solution') || lowerText.includes('solve') || lowerText.includes('fix'),
      hasCall: lowerText.includes('call') || lowerText.includes('contact') || lowerText.includes('reach out')
    }
  }

  const structure = analyzeStructure(transcription)
  const structureScore = Math.round(
    (Object.values(structure).filter(Boolean).length / 4) * 100
  )

  // Calculate words per minute
  const wordCount = transcription.split(/\s+/).length
  const durationMinutes = parseFloat(backendData.duration) / 60
  const wordsPerMinute = Math.round(wordCount / durationMinutes)

  return {
    overallScore,
    clarity: {
      score: Math.round(pitch_scores.clarity),
      feedback: `Your speech clarity scored ${Math.round(pitch_scores.clarity)}%. ${pitch_scores.explanation}`,
      suggestions: generateSuggestions(pitch_scores.clarity, 'clarity')
    },
    pace: {
      score: Math.round(pitch_scores.fluency),
      wordsPerMinute,
      feedback: `Speaking at ${wordsPerMinute} words per minute with ${Math.round(pitch_scores.fluency)}% fluency.`
    },
    confidence: {
      score: Math.round(pitch_scores.confidence),
      fillerWords: countFillerWords(transcription),
      feedback: `Confidence level: ${Math.round(pitch_scores.confidence)}%. Dominant emotion: ${emotion_analysis.dominant_emotion}.`
    },
    structure: {
      score: structureScore,
      ...structure,
      feedback: `Pitch structure completeness: ${structureScore}%. ${getStructureFeedback(structure)}`
    },
    engagement: {
      score: Math.round(pitch_scores.tone),
      emotionalTone: emotion_analysis.dominant_emotion,
      feedback: `Emotional engagement: ${Math.round(pitch_scores.tone)}% with ${emotion_analysis.dominant_emotion} tone.`
    }
  }
}

/**
 * Count filler words in transcription
 */
function countFillerWords(text: string): number {
  const fillerWords = ['um', 'uh', 'like', 'you know', 'so', 'actually', 'basically', 'literally']
  const words = text.toLowerCase().split(/\s+/)
  return fillerWords.reduce((count, filler) => {
    return count + words.filter(word => word.includes(filler)).length
  }, 0)
}

/**
 * Generate structure feedback based on analysis
 */
function getStructureFeedback(structure: {
  hasIntro: boolean
  hasProblem: boolean
  hasSolution: boolean
  hasCall: boolean
}): string {
  const missing = []
  if (!structure.hasIntro) missing.push('introduction')
  if (!structure.hasProblem) missing.push('problem statement')
  if (!structure.hasSolution) missing.push('solution description')
  if (!structure.hasCall) missing.push('call to action')
  
  if (missing.length === 0) {
    return 'Your pitch includes all key structural elements.'
  }
  
  return `Consider adding: ${missing.join(', ')}.`
}

/**
 * Create progress tracker for analysis stages
 */
export class AnalysisProgressTracker {
  private callbacks: ((progress: AnalysisProgress) => void)[] = []
  private currentProgress: AnalysisProgress = {
    stage: 'uploading',
    progress: 0,
    message: 'Preparing audio upload...'
  }

  onProgress(callback: (progress: AnalysisProgress) => void) {
    this.callbacks.push(callback)
  }

  updateProgress(update: Partial<AnalysisProgress>) {
    this.currentProgress = { ...this.currentProgress, ...update }
    this.callbacks.forEach(callback => callback(this.currentProgress))
  }

  startUpload() {
    this.updateProgress({
      stage: 'uploading',
      progress: 10,
      message: 'Uploading audio file...',
      estimatedTimeRemaining: 15
    })
  }

  uploadComplete() {
    this.updateProgress({
      stage: 'processing',
      progress: 30,
      message: 'Processing audio data...',
      estimatedTimeRemaining: 20
    })
  }

  startAnalysis() {
    this.updateProgress({
      stage: 'analyzing',
      progress: 60,
      message: 'Analyzing speech patterns and emotions...',
      estimatedTimeRemaining: 10
    })
  }

  complete(metrics: PitchMetrics) {
    this.updateProgress({
      stage: 'complete',
      progress: 100,
      message: `Analysis complete! Overall score: ${metrics.overallScore}%`,
      estimatedTimeRemaining: 0
    })
  }

  error(error: AnalysisError) {
    this.updateProgress({
      stage: 'error',
      progress: 0,
      message: error.message,
      estimatedTimeRemaining: undefined
    })
  }
}

/**
 * Validate audio before analysis
 */
export function validateAudioForAnalysis(blob: Blob): AnalysisError | null {
  // Check file type
  if (!blob.type.startsWith('audio/')) {
    return {
      type: 'validation',
      message: 'Invalid file type. Please upload an audio file.',
      retryable: false
    }
  }

  // Check file size (max 50MB to match backend)
  const maxSize = 50 * 1024 * 1024
  if (blob.size > maxSize) {
    return {
      type: 'validation',
      message: `File too large (${Math.round(blob.size / 1024 / 1024)}MB). Maximum size is 50MB.`,
      retryable: false
    }
  }

  // Check minimum size
  if (blob.size < 1024) {
    return {
      type: 'validation',
      message: 'Audio file too small. Please record at least 1 second of audio.',
      retryable: false
    }
  }

  return null
}

/**
 * Parse API error responses
 */
export function parseAnalysisError(error: any): AnalysisError {
  // Network errors
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return {
      type: 'network',
      message: 'Network connection failed. Please check your internet connection.',
      retryable: true,
      retryAfter: 5
    }
  }

  // HTTP errors
  if (error.status) {
    switch (error.status) {
      case 401:
        return {
          type: 'authentication',
          message: 'Authentication required. Please log in to continue.',
          retryable: false
        }
      case 413:
        return {
          type: 'validation',
          message: 'Audio file too large. Please use a smaller file.',
          retryable: false
        }
      case 429:
        return {
          type: 'quota',
          message: 'Rate limit exceeded. Please try again later.',
          retryable: true,
          retryAfter: 60
        }
      case 500:
        return {
          type: 'processing',
          message: 'Server error during analysis. Please try again.',
          retryable: true,
          retryAfter: 10
        }
      default:
        return {
          type: 'unknown',
          message: `Request failed with status ${error.status}`,
          retryable: true,
          retryAfter: 5
        }
    }
  }

  // Generic error
  return {
    type: 'unknown',
    message: error.message || 'An unexpected error occurred during analysis.',
    retryable: true,
    retryAfter: 5
  }
}