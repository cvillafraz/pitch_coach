"use client"

import { VoiceRecorder } from "@/components/ui/voice-recorder"
import { UserNav } from "@/components/auth/user-nav"
import { RequireAuth } from "@/components/auth/require-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, ArrowLeft, Lightbulb, Zap, Circle, CheckCircle, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { validateAudioBlob, sendAudioToAI } from "@/lib/audio-utils"

interface Recording {
  duration: number
  timestamp: Date
  audioUrl?: string
  uploadResult?: any
}

interface AnalysisMetric {
  id: string
  label: string
  score: number
  status: 'good' | 'needs-improvement' | 'analyzing'
  feedback: string
}

export default function AIVoicePage() {
  const [recordings, setRecordings] = useState<Recording[]>([])
  const [feedback, setFeedback] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [uploadStatus, setUploadStatus] = useState<string | null>(null)
  const [analysisMetrics, setAnalysisMetrics] = useState<AnalysisMetric[]>([
    { id: 'clarity', label: 'Clarity', score: 0, status: 'analyzing', feedback: 'Speak clearly and at a steady pace' },
    { id: 'confidence', label: 'Confidence', score: 0, status: 'analyzing', feedback: 'Project confidence through your voice' },
    { id: 'engagement', label: 'Engagement', score: 0, status: 'analyzing', feedback: 'Keep your audience engaged' },
    { id: 'structure', label: 'Structure', score: 0, status: 'analyzing', feedback: 'Follow a clear pitch structure' },
  ])

  const handleStart = () => {
    console.log('Recording started')
    setIsRecording(true)
    setFeedback(null)
    // Reset metrics to analyzing state
    setAnalysisMetrics(prev => prev.map(metric => ({
      ...metric,
      status: 'analyzing' as const,
      score: 0
    })))
  }

  const handleStop = (duration: number, audioUrl?: string, audioBlob?: Blob) => {
    setIsRecording(false)
    setRecordings((prev: Recording[]) => [...prev.slice(-4), { 
      duration, 
      timestamp: new Date(),
      audioUrl
    }])

    // Start analysis - metrics will be updated when audio processing completes
    setIsAnalyzing(true)
  }

  const updateAnalysisFromResponse = (apiResponse: any) => {
    // Extract pitch scores from the API response
    const pitchScores = apiResponse.pitch_scores || {}
    
    // Map API response to UI metrics
    const updatedMetrics = analysisMetrics.map(metric => {
      switch (metric.id) {
        case 'clarity':
          return {
            ...metric,
            score: Math.round(pitchScores.clarity || 0),
            status: (pitchScores.clarity >= 75 ? 'good' : 'needs-improvement') as 'good' | 'needs-improvement',
            feedback: `Speech clarity: ${pitchScores.clarity ? `${Math.round(pitchScores.clarity)}% - ` : ''}${pitchScores.explanation || 'Analysis complete'}`
          }
        case 'confidence':
          return {
            ...metric,
            score: Math.round(pitchScores.confidence || 0),
            status: (pitchScores.confidence >= 75 ? 'good' : 'needs-improvement') as 'good' | 'needs-improvement',
            feedback: `Speaker confidence: ${pitchScores.confidence ? `${Math.round(pitchScores.confidence)}% - ` : ''}Based on vocal tone and emotion analysis`
          }
        case 'engagement':
          return {
            ...metric,
            score: Math.round(pitchScores.tone || 0),
            status: (pitchScores.tone >= 75 ? 'good' : 'needs-improvement') as 'good' | 'needs-improvement',
            feedback: `Tone appropriateness: ${pitchScores.tone ? `${Math.round(pitchScores.tone)}% - ` : ''}How suitable your tone is for a professional pitch`
          }
        case 'structure':
          return {
            ...metric,
            score: Math.round(pitchScores.fluency || 0),
            status: (pitchScores.fluency >= 75 ? 'good' : 'needs-improvement') as 'good' | 'needs-improvement',
            feedback: `Speech fluency: ${pitchScores.fluency ? `${Math.round(pitchScores.fluency)}% - ` : ''}How smooth and natural your speech flow is`
          }
        default:
          return metric
      }
    })

    setAnalysisMetrics(updatedMetrics)
    
    // Set overall feedback from the LLM explanation
    const overallFeedback = pitchScores.explanation || 
      "Analysis complete! Review the individual metrics for detailed feedback on your pitch performance."
    setFeedback(overallFeedback)
    setIsAnalyzing(false)
  }

  const handleUploadComplete = (uploadResult: any) => {
    console.log('Upload completed:', uploadResult)
    setUploadStatus(`Audio uploaded successfully: ${uploadResult.filename}`)
    
    // Update the latest recording with upload result
    setRecordings((prev: Recording[]) => {
      const updated = [...prev]
      if (updated.length > 0) {
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          uploadResult
        }
      }
      return updated
    })

    // Clear status after 3 seconds
    setTimeout(() => setUploadStatus(null), 3000)
  }

  const handleError = (error: string) => {
    console.error('Recording error:', error)
    setUploadStatus(`Error: ${error}`)
    setTimeout(() => setUploadStatus(null), 5000)
  }

  const handleAudioReady = async (audioBlob: Blob, duration: number) => {
    console.log('Audio ready for processing:', {
      size: audioBlob.size,
      type: audioBlob.type,
      duration: duration
    })
    
    // Validate audio before processing
    const validation = validateAudioBlob(audioBlob)
    if (!validation.valid) {
      setUploadStatus(`Error: ${validation.error}`)
      setTimeout(() => setUploadStatus(null), 5000)
      return
    }
    
    setUploadStatus(`Processing audio (${validation.info.sizeInMB}MB)...`)
    
    try {
      // Send audio to AI analysis APIhttp://localhost:8000
      const result = await sendAudioToAI(audioBlob, { duration, apiEndpoint: "https://pitch-coach.onrender.com/analyze-pitch" })
      console.log('AI Analysis Result:', result)
      
      // Update analysis metrics with the API response
      if (result && result.success) {
        updateAnalysisFromResponse(result)
        setUploadStatus('✅ Audio processed successfully!')
      } else {
        throw new Error('Analysis failed - invalid response')
      }
      
      setTimeout(() => setUploadStatus(null), 3000)
      
    } catch (error) {
      console.error('Error processing audio:', error)
      setUploadStatus(`Error: ${error instanceof Error ? error.message : 'Processing failed'}`)
      setIsAnalyzing(false) // Stop the analyzing state on error
      setTimeout(() => setUploadStatus(null), 5000)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white/60 backdrop-blur-sm border-b border-gray-100">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-orange-400 rounded-lg flex items-center justify-center shadow-sm">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-light text-gray-800">PitchCoach</h1>
          </Link>
          
          <UserNav />
        </div>
      </header>

      <main className="flex h-[calc(100vh-80px)]">
        {/* Sidebar - Claude/ChatGPT Style - Left Side */}
        <div className={`${sidebarExpanded ? 'w-80' : 'w-16'} bg-white/60 backdrop-blur-sm border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out relative`}>
          {/* Sidebar Toggle Button */}
          <button
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className="absolute -right-3 top-6 z-10 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
          >
            {sidebarExpanded ? (
              <ChevronLeft className="w-3 h-3 text-gray-600" />
            ) : (
              <ChevronRight className="w-3 h-3 text-gray-600" />
            )}
          </button>

          {sidebarExpanded && (
            <>
              {/* Sidebar Header */}
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-800">Real-time Analysis</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {isRecording ? 'Analyzing your pitch...' : 'Start recording to see feedback'}
                </p>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto">
                {/* Analysis Metrics */}
                <div className="p-6 space-y-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Performance Metrics</h4>
                  {analysisMetrics.map((metric) => (
                    <div key={metric.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50/50">
                      <div className="mt-0.5">
                        {metric.status === 'analyzing' ? (
                          <Circle className="w-4 h-4 text-gray-400 animate-pulse" />
                        ) : metric.status === 'good' ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-orange-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-gray-800">{metric.label}</p>
                          {metric.score > 0 && (
                            <span className={`text-xs px-2 py-1 rounded-full ${metric.status === 'good'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-orange-100 text-orange-700'
                              }`}>
                              {metric.score}%
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600">{metric.feedback}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Feedback */}
                {(feedback || isAnalyzing) && (
                  <div className="p-6 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">AI Feedback</h4>
                    <div className="p-4 rounded-lg bg-blue-50/50 border border-blue-200">
                      {isAnalyzing ? (
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm text-blue-700">Generating feedback...</span>
                        </div>
                      ) : (
                        <p className="text-sm text-blue-800 leading-relaxed">{feedback}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Recent Recordings */}
                <div className="p-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Recordings</h4>
                  {recordings.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-4">
                      No recordings yet. Start practicing!
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {recordings.slice(-3).map((recording: Recording, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50/50 rounded-lg">
                          <div className="flex-1">
                            <p className="text-sm font-medium">Recording {recordings.length - index}</p>
                            <p className="text-xs text-gray-500">
                              {recording.timestamp.toLocaleTimeString()}
                            </p>
                            {recording.uploadResult && (
                              <p className="text-xs text-green-600 mt-1">
                                ✓ Uploaded to cloud
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-mono text-gray-600">
                              {formatTime(recording.duration)}
                            </span>
                            {recording.audioUrl && (
                              <div className="mt-1">
                                <audio controls className="w-24 h-6" style={{fontSize: '10px'}}>
                                  <source src={recording.audioUrl} type="audio/webm" />
                                  <source src={recording.audioUrl} type="audio/mp4" />
                                </audio>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tips */}
                <div className="p-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    Tips for Better Pitches
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Zap className="w-3 h-3 text-orange-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Be Passionate</p>
                        <p className="text-xs text-gray-600">Let your enthusiasm show through your voice</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Zap className="w-3 h-3 text-orange-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Use Metrics</p>
                        <p className="text-xs text-gray-600">Include specific numbers and data points</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Zap className="w-3 h-3 text-orange-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Tell a Story</p>
                        <p className="text-xs text-gray-600">Connect emotionally with your audience</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="p-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button variant="premium" size="sm" className="w-full text-xs" asChild>
                      <Link href="/personas">Practice with Personas</Link>
                    </Button>
                    <Button variant="outline" size="sm" className="w-full text-xs" asChild>
                      <Link href="/performance">View Performance</Link>
                    </Button>
                    <Button variant="outline" size="sm" className="w-full text-xs" asChild>
                      <Link href="/feedback">Detailed Feedback</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Collapsed Sidebar Icons */}
          {!sidebarExpanded && (
            <div className="flex flex-col items-center py-6 space-y-4">
              <div className="w-8 h-8 bg-gradient-to-br from-rose-400 to-orange-400 rounded-lg flex items-center justify-center">
                <Mic className="w-4 h-4 text-white" />
              </div>
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-gray-600" />
              </div>
            </div>
          )}
        </div>

        {/* Main Recording Area - Centered */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-lg w-full">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-light text-gray-800 mb-6">
                AI Pitch <span className="italic bg-gradient-to-r from-rose-400 to-orange-400 bg-clip-text text-transparent">Analyzer</span>
              </h2>
            </div>

            {/* Clean Recording Card - No Background */}
            <div className="text-center">
              <div className="mb-8">
                <h3 className="text-2xl font-light text-gray-800 mb-4 flex items-center justify-center gap-3">
                  <Mic className="w-6 h-6 text-gray-800" />
                  Record Your Pitch
                </h3>
              </div>

              <div className="flex flex-col items-center">
                <VoiceRecorder
                  onStart={handleStart}
                  onStop={handleStop}
                  onUploadComplete={handleUploadComplete}
                  onError={handleError}
                  onAudioReady={handleAudioReady}
                  autoUpload={false}
                  saveToStorage={false}
                />
                
                {uploadStatus && (
                  <div className={`mt-4 px-4 py-2 rounded-lg text-sm ${
                    uploadStatus.includes('Error') 
                      ? 'bg-red-100 text-red-700 border border-red-200'
                      : 'bg-green-100 text-green-700 border border-green-200'
                  }`}>
                    {uploadStatus}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}