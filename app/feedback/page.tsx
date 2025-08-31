"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Mic,
  TrendingUp,
  Clock,
  MessageSquare,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Play,
  Download,
} from "lucide-react"
import Link from "next/link"

// Mock feedback data (in a real app, this would come from AI analysis)
const mockFeedbackData = {
  sessionId: "session-123",
  date: "2024-01-15",
  duration: 420, // seconds
  persona: "Sarah Chen - Tech VC",
  overallScore: 78,
  categories: {
    content: {
      score: 82,
      feedback: "Strong value proposition and clear problem statement. Consider adding more specific market size data.",
      strengths: ["Clear problem definition", "Compelling value proposition", "Good use of examples"],
      improvements: ["Add market size data", "Include more competitive analysis", "Strengthen revenue model"],
    },
    delivery: {
      score: 75,
      feedback: "Good energy and confidence. Work on pacing and reducing filler words.",
      strengths: ["Confident tone", "Good eye contact", "Engaging storytelling"],
      improvements: ["Reduce filler words (um, uh)", "Slow down pace slightly", "Use more strategic pauses"],
    },
    structure: {
      score: 80,
      feedback: "Well-organized presentation with logical flow. Could benefit from stronger transitions.",
      strengths: ["Logical flow", "Clear introduction", "Good conclusion"],
      improvements: ["Smoother transitions", "Stronger opening hook", "More compelling call-to-action"],
    },
    engagement: {
      score: 74,
      feedback: "Good interaction with investor questions. Practice handling objections more confidently.",
      strengths: ["Responsive to questions", "Good listening skills", "Maintained composure"],
      improvements: [
        "Handle objections more confidently",
        "Ask more engaging questions",
        "Use more interactive elements",
      ],
    },
  },
  keyMetrics: {
    wordsPerMinute: 145,
    fillerWords: 23,
    pauseFrequency: 12,
    questionHandling: 85,
    confidenceLevel: 78,
  },
  transcript: [
    {
      speaker: "user",
      text: "Hi Sarah, thank you for taking the time to meet with me today. I'm excited to share our revolutionary AI-powered customer service platform...",
      timestamp: "00:00",
      analysis: {
        sentiment: "positive",
        confidence: 0.85,
        keyPoints: ["greeting", "value proposition"],
      },
    },
    {
      speaker: "investor",
      text: "That's interesting. Can you tell me more about your customer acquisition strategy?",
      timestamp: "01:30",
    },
    {
      speaker: "user",
      text: "Absolutely. We've identified three primary channels for customer acquisition. First, we're leveraging content marketing...",
      timestamp: "01:35",
      analysis: {
        sentiment: "confident",
        confidence: 0.78,
        keyPoints: ["customer acquisition", "marketing strategy"],
      },
    },
  ],
  recommendations: [
    {
      priority: "high",
      category: "Content",
      title: "Add Market Size Data",
      description: "Include specific TAM/SAM/SOM figures to strengthen your market opportunity narrative.",
      impact: "High",
    },
    {
      priority: "medium",
      category: "Delivery",
      title: "Reduce Filler Words",
      description: "Practice eliminating 'um' and 'uh' to sound more polished and confident.",
      impact: "Medium",
    },
    {
      priority: "medium",
      category: "Structure",
      title: "Strengthen Opening Hook",
      description: "Start with a compelling statistic or story to immediately capture attention.",
      impact: "High",
    },
    {
      priority: "low",
      category: "Engagement",
      title: "Practice Objection Handling",
      description: "Prepare responses for common investor objections in your industry.",
      impact: "Medium",
    },
  ],
}

export default function FeedbackPage() {
  const [selectedTab, setSelectedTab] = useState("overview")

  const getCategoryColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "outline"
    }
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
            <h1 className="text-xl font-bold text-foreground">Micdrop</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/practice">Practice Again</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Session Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Pitch Analysis</h2>
              <p className="text-muted-foreground">Session with {mockFeedbackData.persona}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline">{mockFeedbackData.date}</Badge>
              <Badge variant="outline">
                <Clock className="w-3 h-3 mr-1" />
                {Math.floor(mockFeedbackData.duration / 60)}m {mockFeedbackData.duration % 60}s
              </Badge>
            </div>
          </div>

          {/* Overall Score */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-foreground">Overall Score</h3>
                  <p className="text-muted-foreground">Based on content, delivery, structure, and engagement</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-primary">{mockFeedbackData.overallScore}</div>
                  <div className="text-sm text-muted-foreground">out of 100</div>
                </div>
              </div>
              <Progress value={mockFeedbackData.overallScore} className="mt-4" />
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
            <TabsTrigger value="transcript">Transcript</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(mockFeedbackData.categories).map(([category, data]) => (
                <Card key={category}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg capitalize">{category}</CardTitle>
                    <div className={`text-2xl font-bold ${getCategoryColor(data.score)}`}>{data.score}/100</div>
                  </CardHeader>
                  <CardContent>
                    <Progress value={data.score} className="mb-3" />
                    <p className="text-sm text-muted-foreground">{data.feedback}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Key Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Key Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{mockFeedbackData.keyMetrics.wordsPerMinute}</div>
                    <div className="text-sm text-muted-foreground">Words/Min</div>
                    <div className="text-xs text-green-600 mt-1">Optimal range</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{mockFeedbackData.keyMetrics.fillerWords}</div>
                    <div className="text-sm text-muted-foreground">Filler Words</div>
                    <div className="text-xs text-yellow-600 mt-1">Could improve</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{mockFeedbackData.keyMetrics.pauseFrequency}</div>
                    <div className="text-sm text-muted-foreground">Strategic Pauses</div>
                    <div className="text-xs text-green-600 mt-1">Good usage</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {mockFeedbackData.keyMetrics.questionHandling}%
                    </div>
                    <div className="text-sm text-muted-foreground">Question Handling</div>
                    <div className="text-xs text-green-600 mt-1">Strong</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {mockFeedbackData.keyMetrics.confidenceLevel}%
                    </div>
                    <div className="text-sm text-muted-foreground">Confidence Level</div>
                    <div className="text-xs text-green-600 mt-1">Good</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Detailed Analysis Tab */}
          <TabsContent value="detailed" className="space-y-6">
            {Object.entries(mockFeedbackData.categories).map(([category, data]) => (
              <Card key={category}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl capitalize">{category}</CardTitle>
                    <div className={`text-xl font-bold ${getCategoryColor(data.score)}`}>{data.score}/100</div>
                  </div>
                  <CardDescription>{data.feedback}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-green-600 mb-2 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Strengths
                      </h4>
                      <ul className="space-y-1">
                        {data.strengths.map((strength, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start">
                            <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 mr-2 flex-shrink-0" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-yellow-600 mb-2 flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Areas for Improvement
                      </h4>
                      <ul className="space-y-1">
                        {data.improvements.map((improvement, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start">
                            <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 mr-2 flex-shrink-0" />
                            {improvement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Transcript Tab */}
          <TabsContent value="transcript" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Session Transcript</span>
                </CardTitle>
                <CardDescription>Complete conversation with AI analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockFeedbackData.transcript.map((entry, index) => (
                  <div key={index} className="border-l-2 border-muted pl-4 py-2">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant={entry.speaker === "user" ? "default" : "secondary"}>
                          {entry.speaker === "user" ? "You" : "Investor"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{entry.timestamp}</span>
                      </div>
                      {entry.analysis && (
                        <Badge variant="outline" className="text-xs">
                          Confidence: {Math.round(entry.analysis.confidence * 100)}%
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm mb-2">{entry.text}</p>
                    {entry.analysis && (
                      <div className="flex flex-wrap gap-1">
                        {entry.analysis.keyPoints.map((point, pointIndex) => (
                          <Badge key={pointIndex} variant="outline" className="text-xs">
                            {point}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5" />
                  <span>Personalized Recommendations</span>
                </CardTitle>
                <CardDescription>Actionable insights to improve your next pitch</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockFeedbackData.recommendations.map((rec, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant={getPriorityColor(rec.priority)}>{rec.priority} priority</Badge>
                        <Badge variant="outline">{rec.category}</Badge>
                      </div>
                      <Badge variant="secondary">{rec.impact} impact</Badge>
                    </div>
                    <h4 className="font-semibold text-foreground mb-1">{rec.title}</h4>
                    <p className="text-sm text-muted-foreground">{rec.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="flex items-center space-x-2" asChild>
                <Link href="/practice">
                  <Play className="w-4 h-4" />
                  <span>Practice Again</span>
                </Link>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                <Download className="w-4 h-4" />
                <span>Export Report</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2 bg-transparent" asChild>
                <Link href="/dashboard">
                  <TrendingUp className="w-4 h-4" />
                  <span>View Progress</span>
                </Link>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
