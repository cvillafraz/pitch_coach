'use client'

import { useState, useRef, useCallback, memo } from 'react'
import { RecordingPanelProps } from '@/lib/types/pitch'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Mic, Square, Play, RotateCcw, Check, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePitchAnalysis } from '@/hooks/use-pitch-analysis'
import { AnalysisLoadingOverlay } from '@/components/ui/analysis-progress'
import { AnalysisErrorDisplay } from '@/components/ui/analysis-error'

type RecordingState = 'idle' | 'recording' | 'recorded' | 'playing'

export const RecordingPanel = memo(function RecordingPanel({ onRecordingComplete, isProcessing, disabled }: RecordingPanelProps) {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle')
  const [duration, setDuration] = useState(0)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [audioLevels, setAudioLevels] = useState<number[]>(new Array(32).fill(0))
  const [error, setError] = useState<string | null>(null)



  // Use the new pitch analysis hook
  const {
    isAnalyzing,
    progress,
    metrics,
    error: analysisError,
    transcription,
    analyzePitch,
    retry: retryAnalysis,
    cancel: cancelAnalysis,
    clearError,
    clearResults
  } = usePitchAnalysis()

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationRef = useRef<number | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const updateAudioLevels = useCallback(() => {
    if (!analyserRef.current || recordingState !== 'recording') return

    const bufferLength = analyserRef.current.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    analyserRef.current.getByteFrequencyData(dataArray)

    // Calculate levels for visualization bars
    const barWidth = Math.floor(bufferLength / 32)
    const newLevels = []

    for (let i = 0; i < 32; i++) {
      let sum = 0
      for (let j = 0; j < barWidth; j++) {
        sum += dataArray[i * barWidth + j]
      }
      const average = sum / barWidth
      newLevels.push(Math.min(100, (average / 255) * 100))
    }

    setAudioLevels(newLevels)
    animationRef.current = requestAnimationFrame(updateAudioLevels)
  }, [recordingState])

  const startRecording = async () => {
    try {
      setError(null)
      
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
        setAudioBlob(blob)
        setRecordingState('recorded')
        
        // Stop audio level monitoring
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
          animationRef.current = null
        }
        
        // Reset audio levels
        setAudioLevels(new Array(32).fill(0))
      }

      mediaRecorder.start(100) // Collect data every 100ms
      setRecordingState('recording')
      setDuration(0)

      // Start timer
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1)
      }, 1000)

    } catch (error) {
      console.error('Error accessing microphone:', error)
      setHasPermission(false)
      setError('Failed to access microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingState === 'recording') {
      mediaRecorderRef.current.stop()

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
    }
  }

  const playRecording = () => {
    if (audioUrl && audioRef.current) {
      setRecordingState('playing')
      audioRef.current.play()
    }
  }

  const handleAudioEnded = () => {
    setRecordingState('recorded')
  }

  const reRecord = () => {
    // Clean up previous recording
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
      setAudioUrl(null)
    }
    setAudioBlob(null)
    setRecordingState('idle')
    setDuration(0)
    setError(null)
  }

  const confirmRecording = async () => {
    if (audioBlob) {
      // Clear any previous results
      clearResults()
      
      try {
        // Start analysis
        await analyzePitch(audioBlob, duration)
        
        // Call the original callback with the audio blob and duration
        onRecordingComplete(audioBlob, duration)
      } catch (error) {
        console.error('Analysis failed:', error)
        // Still call the callback even if analysis fails
        onRecordingComplete(audioBlob, duration)
      }
    }
  }

  const handleRecordingClick = () => {
    if (recordingState === 'recording') {
      stopRecording()
    } else {
      startRecording()
    }
  }

  // Show permission request if needed
  if (hasPermission === false) {
    return (
      <Card className="p-6 h-full flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm border border-gray-100">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-800">Microphone Access Required</h3>
            <p className="text-sm text-gray-600">Please allow microphone access to record your pitch.</p>
          </div>

          <Button
            onClick={startRecording}
            className="bg-gradient-to-r from-rose-400 to-orange-400 hover:from-rose-500 hover:to-orange-500 text-white"
          >
            Grant Access
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 h-full flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm border border-gray-100">
      <div className="flex flex-col items-center justify-center text-center space-y-6 w-full max-w-sm">
        {/* Recording Button */}
        <div className="relative flex items-center justify-center">
          <button
            onClick={handleRecordingClick}
            disabled={disabled || recordingState === 'playing'}
            className={cn(
              "group w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300",
              recordingState === 'recording'
                ? "bg-red-500 hover:bg-red-600 animate-pulse shadow-lg"
                : "hover:bg-gray-100",
              (disabled || recordingState === 'playing') && "opacity-50 cursor-not-allowed"
            )}
          >
            {recordingState === 'recording' ? (
              <Square className="w-8 h-8 text-white" />
            ) : (
              <Mic className="w-10 h-10 text-black" />
            )}
          </button>
          
          {/* Recording pulse effect */}
          {recordingState === 'recording' && (
            <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-20" />
          )}
        </div>

        {/* Title and Instructions */}
        <div className="flex flex-col items-center justify-center space-y-2">
          <h2 className="text-xl font-light text-gray-800 text-center">
            {recordingState === 'idle' && 'Record Your Pitch'}
            {recordingState === 'recording' && 'Recording...'}
            {recordingState === 'recorded' && 'Recording Complete'}
            {recordingState === 'playing' && 'Playing...'}
          </h2>
          <p className="text-sm text-gray-600 text-center">
            {recordingState === 'idle' && 'Click the microphone to start'}
            {recordingState === 'recording' && 'Click the stop button when finished'}
            {(recordingState === 'recorded' || recordingState === 'playing') && 'Review your recording below'}
          </p>
          

        </div>

        {/* Duration Display */}
        <div className={cn(
          "font-mono text-lg transition-all duration-300 text-center",
          recordingState === 'recording' ? "text-red-600 font-medium" : "text-gray-600"
        )}>
          {formatTime(duration)}
        </div>

        {/* Audio Visualizer */}
        <div className="h-12 w-full flex items-center justify-center gap-1">
          {audioLevels.map((level, i) => (
            <div
              key={i}
              className={cn(
                "w-1 rounded-full transition-all duration-100",
                recordingState === 'recording'
                  ? "bg-red-400"
                  : "bg-gray-300"
              )}
              style={{
                height: recordingState === 'recording' 
                  ? `${Math.max(4, (level / 100) * 48)}px`
                  : "4px"
              }}
            />
          ))}
        </div>

        {/* Post-recording Controls */}
        {(recordingState === 'recorded' || recordingState === 'playing') && audioUrl && (
          <div className="flex flex-col items-center justify-center space-y-4 w-full">
            {/* Audio Element */}
            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={handleAudioEnded}
              className="hidden"
            />
            
            {/* Control Buttons */}
            <div className="flex justify-center items-center gap-3">
              <Button
                onClick={playRecording}
                disabled={recordingState === 'playing'}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                {recordingState === 'playing' ? 'Playing...' : 'Play'}
              </Button>
              
              <Button
                onClick={reRecord}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Re-record
              </Button>
              
              <Button
                onClick={confirmRecording}
                disabled={isAnalyzing}
                size="sm"
                className="flex items-center gap-2 bg-gradient-to-r from-rose-400 to-orange-400 hover:from-rose-500 hover:to-orange-500 text-white"
              >
                <Check className="w-4 h-4" />
                {isAnalyzing ? 'Analyzing...' : 'Confirm'}
              </Button>
            </div>
          </div>
        )}

        {/* Processing State */}
        {(isProcessing || isAnalyzing) && (
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-rose-400"></div>
            <p className="text-sm text-gray-500 text-center">
              {isAnalyzing ? 'Analyzing your pitch...' : 'Processing...'}
            </p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg w-full">
            <p className="text-sm text-red-600 text-center">{error}</p>
          </div>
        )}

        {/* Analysis Error Display */}
        {analysisError && (
          <AnalysisErrorDisplay
            error={analysisError}
            onRetry={retryAnalysis}
            onDismiss={clearError}
            className="w-full"
          />
        )}
      </div>

      {/* Analysis Loading Overlay */}
      {isAnalyzing && progress && (
        <AnalysisLoadingOverlay
          progress={progress}
          onCancel={cancelAnalysis}
        />
      )}
    </Card>
  )
})