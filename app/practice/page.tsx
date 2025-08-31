"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, User, Clock, MessageSquare, TrendingUp, AlertCircle, CheckCircle, Circle, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { VoiceRecorder } from "@/components/ui/voice-recorder"
import { validateAudioBlob, sendAudioToAI } from "@/lib/audio-utils"

// Mock investor personas data (in a real app, this would come from an API)
const investorPersonas = {
  "tech-vc": {
    name: "Sarah Chen",
    title: "Partner at TechVentures",
    type: "VC Investor",
    avatar: "SC",
    avatarImage: "/placeholder-user.jpg", // Using existing placeholder image
    responses: [
      "That's interesting. Can you tell me more about your customer acquisition strategy?",
      "What's your monthly recurring revenue growth rate?",
      "How do you plan to scale your engineering team?",
      "What's your competitive advantage in this market?",
      "Can you walk me through your unit economics?",
    ],
  },
  "angel-investor": {
    name: "Michael Rodriguez",
    title: "Serial Entrepreneur & Angel",
    type: "Angel Investor",
    avatar: "MR",
    avatarImage: "/michael.png", // Using existing placeholder image
    responses: [
      "I love the passion I'm hearing. What's your biggest challenge right now?",
      "How did you validate this idea with customers?",
      "Tell me about your team's background.",
      "What's your go-to-market strategy?",
      "How much runway do you need to reach profitability?",
    ],
  },
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
  message: string
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  abort(): void
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null
  onend: ((this: SpeechRecognition, ev: Event) => any) | null
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null
}

interface AnalysisMetric {
  id: string
  label: string
  score: number
  status: 'good' | 'needs-improvement' | 'analyzing'
  feedback: string
}

interface Recording {
  duration: number
  timestamp: Date
  audioUrl?: string
  uploadResult?: any
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  abort(): void
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null
  onend: ((this: SpeechRecognition, ev: Event) => any) | null
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition
    webkitSpeechRecognition: new () => SpeechRecognition
  }
}

export default function PracticePage() {
  const searchParams = useSearchParams()
  const personaId = searchParams.get("persona") || "tech-vc"
  const persona = investorPersonas[personaId as keyof typeof investorPersonas] || investorPersonas["tech-vc"]

  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [interimTranscript, setInterimTranscript] = useState("")
  const [conversation, setConversation] = useState<
    Array<{ speaker: "user" | "investor"; text: string; timestamp: Date }>
  >([])
  const [sessionDuration, setSessionDuration] = useState(0)
  const [isSessionActive, setIsSessionActive] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(true)
  const [currentFeedback, setCurrentFeedback] = useState<string | null>(null)
  
  // Audio analysis state
  const [recordings, setRecordings] = useState<Recording[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<string | null>(null)
  const [analysisMetrics, setAnalysisMetrics] = useState<AnalysisMetric[]>([
    { id: 'clarity', label: 'Clarity', score: 0, status: 'analyzing', feedback: 'Speak clearly and at a steady pace' },
    { id: 'confidence', label: 'Confidence', score: 0, status: 'analyzing', feedback: 'Project confidence through your voice' },
    { id: 'engagement', label: 'Engagement', score: 0, status: 'analyzing', feedback: 'Keep your audience engaged' },
    { id: 'structure', label: 'Structure', score: 0, status: 'analyzing', feedback: 'Follow a clear pitch structure' },
  ])

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const sessionStartRef = useRef<Date | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Check if speech recognition is supported
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (!SpeechRecognition) {
        setSpeechSupported(false)
        return
      }

      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = "en-US"

      recognition.onstart = () => {
        console.log("[v0] Speech recognition started")
        setIsListening(true)
      }

      recognition.onend = () => {
        console.log("[v0] Speech recognition ended")
        setIsListening(false)
      }

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = ""
        let interimTranscript = ""

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]
          if (result.isFinal) {
            finalTranscript += result[0].transcript
          } else {
            interimTranscript += result[0].transcript
          }
        }

        if (finalTranscript) {
          setTranscript((prev) => prev + finalTranscript)
          setInterimTranscript("")

          // Add user message to conversation
          setConversation((prev) => [...prev, { speaker: "user", text: finalTranscript.trim(), timestamp: new Date() }])

          // Simulate investor response after a delay
          setTimeout(
            () => {
              const responses = persona.responses
              const randomResponse = responses[Math.floor(Math.random() * responses.length)]
              setConversation((prev) => [...prev, { speaker: "investor", text: randomResponse, timestamp: new Date() }])

              // Generate mock feedback
              generateMockFeedback(finalTranscript)
            },
            1500 + Math.random() * 1000,
          )
        } else {
          setInterimTranscript(interimTranscript)
        }
      }

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("[v0] Speech recognition error:", event.error)
        setIsListening(false)
      }

      recognitionRef.current = recognition
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [persona])

  const generateMockFeedback = (text: string) => {
    const feedbackOptions = [
      "Great energy! Try to slow down slightly for better clarity.",
      "Good use of specific numbers. Consider adding more context.",
      "Strong opening! Make sure to maintain eye contact.",
      "Nice storytelling approach. Could use more concrete examples.",
      "Confident delivery! Try to pause more between key points.",
    ]
    const randomFeedback = feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)]
    setCurrentFeedback(randomFeedback)

    // Clear feedback after 5 seconds
    setTimeout(() => setCurrentFeedback(null), 5000)
  }

  // Audio recording handlers
  const handleRecordingStart = () => {
    console.log('Recording started')
    setIsRecording(true)
    setCurrentFeedback(null)
    // Reset metrics to analyzing state
    setAnalysisMetrics(prev => prev.map(metric => ({
      ...metric,
      status: 'analyzing' as const,
      score: 0
    })))
  }

  const handleRecordingStop = (duration: number, audioUrl?: string, audioBlob?: Blob) => {
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
            feedback: ""
          }
        case 'confidence':
          return {
            ...metric,
            score: Math.round(pitchScores.confidence || 0),
            status: (pitchScores.confidence >= 75 ? 'good' : 'needs-improvement') as 'good' | 'needs-improvement',
            feedback: ""
          }
        case 'engagement':
          return {
            ...metric,
            score: Math.round(pitchScores.tone || 0),
            status: (pitchScores.tone >= 75 ? 'good' : 'needs-improvement') as 'good' | 'needs-improvement',
            feedback: ""
          }
        case 'structure':
          return {
            ...metric,
            score: Math.round(pitchScores.fluency || 0),
            status: (pitchScores.fluency >= 75 ? 'good' : 'needs-improvement') as 'good' | 'needs-improvement',
            feedback: ""
          }
        default:
          return metric
      }
    })

    setAnalysisMetrics(updatedMetrics)
    
    // Set overall feedback from the LLM explanation
    const overallFeedback = pitchScores.explanation || 
      "Analysis complete! Review the individual metrics for detailed feedback on your pitch performance."
    setCurrentFeedback(overallFeedback)
    setIsAnalyzing(false)
    
    // Also add the transcription to the conversation if available
    if (apiResponse.transcription) {
      setConversation((prev) => [...prev, { 
        speaker: "user", 
        text: apiResponse.transcription, 
        timestamp: new Date() 
      }])
      
      // Generate investor response
      setTimeout(() => {
        const responses = persona.responses
        const randomResponse = responses[Math.floor(Math.random() * responses.length)]
        setConversation((prev) => [...prev, { 
          speaker: "investor", 
          text: randomResponse, 
          timestamp: new Date() 
        }])
      }, 1500 + Math.random() * 1000)
    }
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

  const handleRecordingError = (error: string) => {
    console.error('Recording error:', error)
    setUploadStatus(`Error: ${error}`)
    setTimeout(() => setUploadStatus(null), 5000)
  }

  const calculateStarRating = () => {
    // Calculate average score from all metrics
    const metricsWithScores = analysisMetrics.filter(metric => metric.score > 0)
    if (metricsWithScores.length === 0) return 0
    
    const averageScore = metricsWithScores.reduce((sum, metric) => sum + metric.score, 0) / metricsWithScores.length
    
    // Convert to 0-5 star scale
    return Math.round((averageScore / 100) * 5)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: rating }, (_, index) => (
      <span key={index} className="text-4xl">⭐</span>
    ))
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
      // Send audio to AI analysis API
      const result = await sendAudioToAI(audioBlob, { 
        duration, 
        apiEndpoint: "https://pitch-coach.onrender.com/analyze-pitch" 
      })
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

  const startListening = () => {
    if (recognitionRef.current && speechSupported) {
      recognitionRef.current.start()
      if (!isSessionActive) {
        setIsSessionActive(true)
        sessionStartRef.current = new Date()
        intervalRef.current = setInterval(() => {
          if (sessionStartRef.current) {
            const duration = Math.floor((Date.now() - sessionStartRef.current.getTime()) / 1000)
            setSessionDuration(duration)
          }
        }, 1000)
      }
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }

  const endSession = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsSessionActive(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!speechSupported) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-destructive" />
            </div>
            <CardTitle className="text-center">Speech Recognition Not Supported</CardTitle>
            <CardDescription className="text-center">
              Your browser doesn't support speech recognition. Please use Chrome, Edge, or Safari for the best
              experience.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" asChild>
              <Link href="/personas">Choose Different Practice Method</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Mic className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">PitchCoach</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{formatTime(sessionDuration)}</span>
            </div>
            <Button variant="outline" onClick={endSession} disabled={!isSessionActive}>
              End Session
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Investor Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg border-4 border-primary">
                    <Image
                      src={persona.avatarImage}
                      alt={`${persona.name} avatar`}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <CardTitle className="text-xl">{persona.name}</CardTitle>
                  <CardDescription className="text-base">{persona.title}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <Badge variant="outline" className="text-sm">{persona.type}</Badge>
              </CardContent>
            </Card>

            {/* Real-time Feedback */}
            {currentFeedback && (
              <Card className="border-secondary">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-secondary" />
                    <span>Live Feedback</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{currentFeedback}</p>
                </CardContent>
              </Card>
            )}



            {/* Upload Status */}
            {uploadStatus && (
              <Card className={`${uploadStatus.includes('Error') ? 'border-destructive' : 'border-green-500'}`}>
                <CardContent className="pt-6">
                  <p className={`text-sm ${uploadStatus.includes('Error') ? 'text-destructive' : 'text-green-600'}`}>
                    {uploadStatus}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Center Column - Speech Interface */}
          <div className="space-y-6">
            {/* Voice Recording Interface */}
            <Card>
              <CardHeader>
                <CardTitle className="text-center">AI-Powered Pitch Analysis</CardTitle>
                <CardDescription className="text-center">
                  Record your pitch to get real-time AI feedback and analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <VoiceRecorder
                  onStart={handleRecordingStart}
                  onStop={handleRecordingStop}
                  onUploadComplete={handleUploadComplete}
                  onError={handleRecordingError}
                  onAudioReady={handleAudioReady}
                  autoUpload={false}
                  saveToStorage={false}
                />
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    {isRecording ? "Recording your pitch..." : 
                     isAnalyzing ? "Analyzing with AI..." : 
                     "Click to start recording"}
                  </p>
                  {(isRecording || isAnalyzing) && (
                    <div className="flex justify-center">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-75" />
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-150" />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Speech Recognition Fallback */}
            {/* <Card>
              <CardHeader>
                <CardTitle className="text-center">Live Speech Recognition</CardTitle>
                <CardDescription className="text-center">
                  Alternative: Use browser speech recognition for conversation
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className="flex justify-center">
                  <Button
                    size="lg"
                    variant={isListening ? "destructive" : "outline"}
                    onClick={isListening ? stopListening : startListening}
                    className="w-16 h-16 rounded-full"
                  >
                    {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  </Button>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    {isListening ? "Listening for conversation..." : "Click for speech-to-text"}
                  </p>
                </div>
              </CardContent>
            </Card> */}

            {/* Live Transcript */}
            {/* <Card>
              <CardHeader>
                <CardTitle className="text-lg">Live Transcript</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="min-h-[120px] p-4 bg-muted rounded-lg">
                  <p className="text-sm">
                    {transcript}
                    {interimTranscript && <span className="text-muted-foreground italic">{interimTranscript}</span>}
                    {!transcript && !interimTranscript && (
                      <span className="text-muted-foreground">Your speech will appear here...</span>
                    )}
                  </p>
                </div>
              </CardContent>
            </Card> */}
          </div>

          {/* Right Column - Pitch Score and Conversation */}
          <div className="space-y-6">
            {/* Pitch Score */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pitch Score</CardTitle>
              </CardHeader>
              <CardContent className="text-center py-8">
                <div className="flex justify-center space-x-1 mb-2">
                  {renderStars(calculateStarRating())}
                </div>
                <p className="text-2xl font-bold text-muted-foreground">
                  {calculateStarRating()}/5
                </p>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance Metrics</CardTitle>
                <CardDescription>Real-time analysis of your pitch</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {analysisMetrics.map((metric) => (
                  <div key={metric.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="mt-0.5">
                      {metric.status === 'analyzing' ? (
                        <Circle className="w-4 h-4 text-muted-foreground animate-pulse" />
                      ) : metric.status === 'good' ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-orange-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium">{metric.label}</p>
                        {metric.score > 0 && (
                          <span className={`text-xs px-2 py-1 rounded-full ${metric.status === 'good'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-orange-100 text-orange-700'
                            }`}>
                            {metric.score}%
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{metric.feedback}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          {/* Right Column - Conversation */}
          <div>
            {/* <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Conversation</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto space-y-4">
                {conversation.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Start speaking to begin the conversation</p>
                  </div>
                ) : (
                  conversation.map((message, index) => (
                    <div key={index} className={`flex ${message.speaker === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.speaker === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          {message.speaker === "investor" ? (
                            <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                              <span className="text-xs text-secondary-foreground font-semibold">{persona.avatar}</span>
                            </div>
                          ) : (
                            <User className="w-4 h-4" />
                          )}
                          <span className="text-xs opacity-75">
                            {message.speaker === "user" ? "You" : persona.name.split(" ")[0]}
                          </span>
                        </div>
                        <p className="text-sm">{message.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card> */}
          </div>
        </div>
      </main>
    </div>
  )
}
