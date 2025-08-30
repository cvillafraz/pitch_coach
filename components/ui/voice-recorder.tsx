"use client"

import { Mic, Square, Upload } from "lucide-react"
import { useState, useEffect, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"

interface VoiceRecorderProps {
  onStart?: () => void
  onStop?: (duration: number, audioUrl?: string, audioBlob?: Blob) => void
  onUploadComplete?: (uploadResult: any) => void
  onError?: (error: string) => void
  onAudioReady?: (audioBlob: Blob, duration: number) => void
  visualizerBars?: number
  className?: string
  autoUpload?: boolean
  saveToStorage?: boolean
}

export function VoiceRecorder({
  onStart,
  onStop,
  onUploadComplete,
  onError,
  onAudioReady,
  visualizerBars = 48,
  className,
  autoUpload = true,
  saveToStorage = true
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [duration, setDuration] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [audioLevels, setAudioLevels] = useState<number[]>(new Array(visualizerBars).fill(0))
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationRef = useRef<number | null>(null)

  // Check microphone permission on mount
  useEffect(() => {
    checkMicrophonePermission()
  }, [])

  const checkMicrophonePermission = async () => {
    try {
      const result = await navigator.permissions.query({ name: 'microphone' as PermissionName })
      setHasPermission(result.state === 'granted')
      
      result.onchange = () => {
        setHasPermission(result.state === 'granted')
      }
    } catch (error) {
      console.warn('Permission API not supported:', error)
      setHasPermission(null) // Unknown, will request on first use
    }
  }

  const startRecording = async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      })
      
      streamRef.current = stream
      setHasPermission(true)

      // Set up audio analysis for visualization
      const audioContext = new AudioContext()
      const analyser = audioContext.createAnalyser()
      const microphone = audioContext.createMediaStreamSource(stream)
      
      analyser.fftSize = 256
      analyser.smoothingTimeConstant = 0.8
      microphone.connect(analyser)
      analyserRef.current = analyser

      // Start audio level monitoring
      updateAudioLevels()

      // Set up MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      })
      
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { 
          type: mediaRecorder.mimeType 
        })
        
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        
        // Stop audio level monitoring
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
          animationRef.current = null
        }
        
        // Always call onStop with blob for API processing
        onStop?.(duration, url, blob)

        // Call onAudioReady for immediate processing (like sending to API)
        onAudioReady?.(blob, duration)

        // Only upload to storage if saveToStorage is true
        if (autoUpload && saveToStorage) {
          await uploadAudio(blob)
        }
      }

      mediaRecorder.start(100) // Collect data every 100ms
      setIsRecording(true)
      setDuration(0)

      // Start timer
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1)
      }, 1000)

      onStart?.()
    } catch (error) {
      console.error('Error accessing microphone:', error)
      setHasPermission(false)
      onError?.('Failed to access microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }

      // Stop stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }

      // Reset audio levels
      setAudioLevels(new Array(visualizerBars).fill(0))
    }
  }

  const updateAudioLevels = () => {
    if (!analyserRef.current || !isRecording) return

    const bufferLength = analyserRef.current.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    analyserRef.current.getByteFrequencyData(dataArray)

    // Calculate levels for visualization bars
    const barWidth = Math.floor(bufferLength / visualizerBars)
    const newLevels = []

    for (let i = 0; i < visualizerBars; i++) {
      let sum = 0
      for (let j = 0; j < barWidth; j++) {
        sum += dataArray[i * barWidth + j]
      }
      const average = sum / barWidth
      newLevels.push(Math.min(100, (average / 255) * 100))
    }

    setAudioLevels(newLevels)
    animationRef.current = requestAnimationFrame(updateAudioLevels)
  }

  const uploadAudio = async (audioBlob: Blob) => {
    try {
      setIsUploading(true)
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const filename = `pitch-recording-${timestamp}.webm`
      
      // Build query parameters
      const queryParams = new URLSearchParams({
        filename: filename,
        duration: duration.toString(),
        personaName: 'AI Coach',
        personaType: 'general'
      })
      
      const response = await fetch(`/api/audio/upload?${queryParams}`, {
        method: 'POST',
        body: audioBlob,
        headers: {
          'Content-Type': audioBlob.type,
        },
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }

      const result = await response.json()
      onUploadComplete?.(result)
    } catch (error) {
      console.error('Error uploading audio:', error)
      onError?.('Failed to upload audio recording.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleClick = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Show permission request if needed
  if (hasPermission === false) {
    return (
      <div className={cn("w-full py-4 text-center", className)}>
        <div className="max-w-xl w-full mx-auto">
          <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
            <Mic className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <p className="text-red-800 font-medium mb-2">Microphone Access Required</p>
            <p className="text-red-600 text-sm mb-4">
              Please allow microphone access to record your pitch.
            </p>
            <button
              onClick={startRecording}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Grant Access
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("w-full py-4", className)}>
      <div className="relative max-w-xl w-full mx-auto flex items-center flex-col gap-2">
        {/* Recording Button */}
        <button
          className={cn(
            "group w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-200",
            isRecording
              ? "bg-red-500 hover:bg-red-600 shadow-lg"
              : "bg-gray-100 hover:bg-gray-200 shadow-sm"
          )}
          type="button"
          onClick={handleClick}
          disabled={isUploading}
        >
          {isUploading ? (
            <Upload className="w-6 h-6 text-gray-600 animate-pulse" />
          ) : isRecording ? (
            <Square className="w-6 h-6 text-white" />
          ) : (
            <Mic className="w-6 h-6 text-gray-700" />
          )}
        </button>

        {/* Duration Display */}
        <span
          className={cn(
            "font-mono text-sm transition-all duration-300",
            isRecording
              ? "text-red-600 font-medium"
              : "text-gray-600"
          )}
        >
          {formatTime(duration)}
        </span>

        {/* Audio Visualizer */}
        <div className="h-4 w-64 flex items-center justify-center gap-0.5">
          {audioLevels.map((level, i) => (
            <div
              key={i}
              className={cn(
                "w-0.5 rounded-full transition-all duration-100",
                isRecording
                  ? "bg-red-400"
                  : "bg-gray-300"
              )}
              style={{
                height: isRecording 
                  ? `${Math.max(4, (level / 100) * 16)}px`
                  : "4px"
              }}
            />
          ))}
        </div>

        {/* Status Text */}
        <p className="h-4 text-xs text-gray-700">
          {isUploading 
            ? "Uploading..." 
            : isRecording 
              ? "Recording... Click to stop" 
              : saveToStorage 
                ? "Click to start recording" 
                : "Click to record (audio will be processed but not saved)"
          }
        </p>

        {/* Audio Playback */}
        {audioUrl && !isRecording && (
          <div className="mt-4 w-full">
            <audio controls className="w-full">
              <source src={audioUrl} type="audio/webm" />
              <source src={audioUrl} type="audio/mp4" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </div>
    </div>
  )
}