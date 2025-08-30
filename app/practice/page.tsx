"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, User, Clock, MessageSquare, TrendingUp, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

// Mock investor personas data (in a real app, this would come from an API)
const investorPersonas = {
  "tech-vc": {
    name: "Sarah Chen",
    title: "Partner at TechVentures",
    type: "VC Investor",
    avatar: "SC",
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
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-semibold">{persona.avatar}</span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">{persona.name}</CardTitle>
                    <CardDescription>{persona.title}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Badge variant="outline">{persona.type}</Badge>
              </CardContent>
            </Card>

            {/* Session Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Session Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Duration</span>
                  <span className="font-medium">{formatTime(sessionDuration)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Exchanges</span>
                  <span className="font-medium">{Math.floor(conversation.length / 2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant={isSessionActive ? "default" : "secondary"}>
                    {isSessionActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
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
          </div>

          {/* Center Column - Speech Interface */}
          <div className="space-y-6">
            {/* Microphone Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Speech Recognition</CardTitle>
                <CardDescription className="text-center">
                  Click the microphone to start practicing your pitch
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className="flex justify-center">
                  <Button
                    size="lg"
                    variant={isListening ? "destructive" : "default"}
                    onClick={isListening ? stopListening : startListening}
                    className="w-20 h-20 rounded-full"
                  >
                    {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                  </Button>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">{isListening ? "Listening..." : "Click to start speaking"}</p>
                  {isListening && (
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

            {/* Live Transcript */}
            <Card>
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
            </Card>
          </div>

          {/* Right Column - Conversation */}
          <div>
            <Card className="h-[600px] flex flex-col">
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
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
