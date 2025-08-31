/**
 * Audio utility functions for processing recorded audio
 */

export interface AudioProcessingOptions {
  format?: 'webm' | 'mp4' | 'wav'
  bitRate?: number
  sampleRate?: number
}

// Cache for blob to base64 conversions to avoid reprocessing
const base64Cache = new WeakMap<Blob, string>()

/**
 * Convert audio blob to base64 string for API transmission (with caching)
 */
export function blobToBase64(blob: Blob): Promise<string> {
  // Check cache first
  const cached = base64Cache.get(blob)
  if (cached) {
    return Promise.resolve(cached)
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      // Remove data:audio/webm;base64, prefix
      const base64 = result.split(',')[1]
      
      // Cache the result
      base64Cache.set(blob, base64)
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

// Cache for blob to ArrayBuffer conversions
const arrayBufferCache = new WeakMap<Blob, ArrayBuffer>()

/**
 * Convert audio blob to ArrayBuffer for binary transmission (with caching)
 */
export function blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  // Check cache first
  const cached = arrayBufferCache.get(blob)
  if (cached) {
    return Promise.resolve(cached)
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as ArrayBuffer
      
      // Cache the result
      arrayBufferCache.set(blob, result)
      resolve(result)
    }
    reader.onerror = reject
    reader.readAsArrayBuffer(blob)
  })
}

/**
 * Get audio duration from blob (approximate)
 */
export function getAudioDuration(blob: Blob): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = new Audio()
    const url = URL.createObjectURL(blob)
    
    audio.addEventListener('loadedmetadata', () => {
      URL.revokeObjectURL(url)
      resolve(audio.duration)
    })
    
    audio.addEventListener('error', () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load audio metadata'))
    })
    
    audio.src = url
  })
}

/**
 * Create FormData for multipart API requests
 */
export function createAudioFormData(
  audioBlob: Blob, 
  options: {
    filename?: string
    duration?: number
    additionalFields?: Record<string, string | number>
  } = {}
): FormData {
  const formData = new FormData()
  
  const filename = options.filename || `recording-${Date.now()}.webm`
  formData.append('audio', audioBlob, filename)
  
  if (options.duration) {
    formData.append('duration', options.duration.toString())
  }
  
  formData.append('timestamp', new Date().toISOString())
  formData.append('size', audioBlob.size.toString())
  formData.append('type', audioBlob.type)
  
  // Add any additional fields
  if (options.additionalFields) {
    Object.entries(options.additionalFields).forEach(([key, value]) => {
      formData.append(key, value.toString())
    })
  }
  
  return formData
}

/**
 * Validate audio blob before processing
 */
export function validateAudioBlob(blob: Blob): {
  valid: boolean
  error?: string
  info: {
    size: number
    type: string
    sizeInMB: number
  }
} {
  const sizeInMB = blob.size / (1024 * 1024)
  
  const info = {
    size: blob.size,
    type: blob.type,
    sizeInMB: Math.round(sizeInMB * 100) / 100
  }
  
  // Check if it's an audio file
  if (!blob.type.startsWith('audio/')) {
    return {
      valid: false,
      error: `Invalid file type: ${blob.type}. Expected audio file.`,
      info
    }
  }
  
  // Check file size (max 10MB)
  if (sizeInMB > 10) {
    return {
      valid: false,
      error: `File too large: ${sizeInMB}MB. Maximum size is 10MB.`,
      info
    }
  }
  
  // Check minimum size (at least 1KB)
  if (blob.size < 1024) {
    return {
      valid: false,
      error: `File too small: ${blob.size} bytes. Minimum size is 1KB.`,
      info
    }
  }
  
  return { valid: true, info }
}

/**
 * Example function to send audio to AI analysis API
 */
export async function sendAudioToAI(
  audioBlob: Blob,
  options: {
    duration: number
    analysisType?: 'pitch' | 'speech' | 'sentiment'
    apiEndpoint?: string
  }
): Promise<any> {
  const validation = validateAudioBlob(audioBlob)
  
  if (!validation.valid) {
    throw new Error(validation.error)
  }
  
  const formData = createAudioFormData(audioBlob, {
    duration: options.duration,
    additionalFields: {
      analysisType: options.analysisType || 'pitch'
    }
  })
  
  const endpoint = options.apiEndpoint || '/api/ai/analyze-audio'
  
  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData
  })
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`)
  }
  
  return response.json()
}