"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { UserNav } from "@/components/auth/user-nav"
import {
  Mic,
  TrendingUp,
  Clock,
  Users,
  Target,
  Award,
  Play,
  BarChart3,
  Calendar,
  MessageSquare,
  ArrowRight,
  Star,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

// Mock dashboard data (in a real app, this would come from APIs)
const mockDashboardData = {
  user: {
    name: "Alex Johnson",
    joinDate: "2024-01-01",
    currentStreak: 7,
    level: "Intermediate",
  },
  quickStats: {
    totalSessions: 24,
    averageScore: 76,
    practiceTime: 14400, // seconds
    improvement: 12, // percentage
  },
  recentSessions: [
    {
      id: 1,
      date: "2024-01-15",
      persona: "Sarah Chen",
      score: 78,
      duration: 420,
      type: "VC Investor",
    },
    {
      id: 2,
      date: "2024-01-14",
      persona: "Michael Rodriguez",
      score: 72,
      duration: 380,
      type: "Angel Investor",
    },
    {
      id: 3,
      date: "2024-01-12",
      persona: "Jennifer Park",
      score: 81,
      duration: 450,
      type: "Corporate Customer",
    },
  ],
  upcomingGoals: [
    {
      id: 1,
      title: "Weekly Practice Target",
      description: "Complete 3 practice sessions this week",
      progress: 66, // 2 out of 3
      dueDate: "End of week",
      priority: "high",
    },
    {
      id: 2,
      title: "Score Improvement",
      description: "Achieve an average score of 80+",
      progress: 95, // 76/80
      dueDate: "End of month",
      priority: "medium",
    },
  ],
  recentFeedback: [
    {
      id: 1,
      category: "Content",
      feedback: "Strong value proposition. Consider adding market size data.",
      score: 82,
      session: "Sarah Chen session",
    },
    {
      id: 2,
      category: "Delivery",
      feedback: "Good energy! Work on reducing filler words.",
      score: 75,
      session: "Michael Rodriguez session",
    },
  ],
  weeklyActivity: [
    { day: "Mon", sessions: 1, score: 75 },
    { day: "Tue", sessions: 0, score: 0 },
    { day: "Wed", sessions: 1, score: 78 },
    { day: "Thu", sessions: 0, score: 0 },
    { day: "Fri", sessions: 1, score: 72 },
    { day: "Sat", sessions: 0, score: 0 },
    { day: "Sun", sessions: 1, score: 81 },
  ],
  achievements: [
    { title: "Week Warrior", icon: "🔥", recent: true },
    { title: "Score Master", icon: "⭐", recent: false },
    { title: "Consistency King", icon: "👑", recent: true },
  ],
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTimeframe, setSelectedTimeframe] = useState("week")

  useEffect(() => {
    const fetchDashboard = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token

      try {
        const res = await fetch("http://localhost:8000/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (res.ok) {
          const data = await res.json()
          setDashboardData(data)
        }
      } catch (e) {
        // fail silently, fallback to mock
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  const data = dashboardData || mockDashboardData

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-200 bg-red-50"
      case "medium":
        return "border-yellow-200 bg-yellow-50"
      case "low":
        return "border-green-200 bg-green-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  if (loading && !dashboardData) return <div>Loading...</div>

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

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-light text-gray-800">Welcome back, {data.user.name}!</h2>
              <p className="text-gray-600">
                You're on a {data.user.currentStreak}-day streak. Keep up the great work!
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="flex items-center space-x-1 bg-white/60 text-gray-700 border-gray-200">
                <Zap className="w-3 h-3" />
                <span>{data.user.level}</span>
              </Badge>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/60 backdrop-blur-sm border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <MessageSquare className="w-4 h-4 mr-2" />
                Total Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-light text-gray-800">{data.quickStats.totalSessions}</div>
              <div className="flex items-center text-green-600 text-sm mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />+{data.quickStats.improvement}% this month
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Target className="w-4 h-4 mr-2" />
                Average Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-light text-gray-800">
                {data.quickStats.averageScore}
              </div>
              <div className="text-sm text-gray-500 mt-1">out of 100</div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Practice Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-light text-gray-800">
                {formatTime(data.quickStats.practiceTime)}
              </div>
              <div className="text-sm text-gray-500 mt-1">total practice</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <Card className="bg-white/60 backdrop-blur-sm border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-800 font-medium">Quick Actions</CardTitle>
                <CardDescription className="text-gray-600">Jump into your next practice session</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <Button className="h-20 flex flex-col items-center justify-center space-y-2 bg-gray-900 hover:bg-gray-800 text-white" asChild>
                    <Link href="/ai-voice">
                      <Play className="w-6 h-6" />
                      <span>Start Practice</span>
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-white/80 hover:bg-white border-gray-200 text-gray-700"
                    asChild
                  >
                    <Link href="/personas">
                      <Users className="w-6 h-6" />
                      <span>Choose Persona</span>
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-white/80 hover:bg-white border-gray-200 text-gray-700"
                    asChild
                  >
                    <Link href="/performance">
                      <BarChart3 className="w-6 h-6" />
                      <span>View Performance</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Activity */}
            <Card className="bg-white/60 backdrop-blur-sm border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-800 font-medium">
                  <Calendar className="w-5 h-5" />
                  <span>This Week's Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {mockDashboardData.weeklyActivity.map((day, index) => (
                    <div key={index} className="text-center">
                      <div className="text-xs text-gray-500 mb-2">{day.day}</div>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                          day.sessions > 0 ? "bg-gradient-to-br from-rose-400 to-orange-400 text-white" : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {day.sessions}
                      </div>
                      {day.score > 0 && <div className="text-xs mt-1 text-gray-700">{day.score}</div>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Recent Feedback */}
            <Card className="bg-white/60 backdrop-blur-sm border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-800 font-medium">Latest Feedback</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockDashboardData.recentFeedback.map((feedback) => (
                  <div key={feedback.id} className="p-3 border border-gray-200 rounded-lg bg-white/40">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs bg-white/60 text-gray-700 border-gray-200">
                        {feedback.category}
                      </Badge>
                      <span className="text-sm font-medium text-gray-800">{feedback.score}</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-1">{feedback.feedback}</p>
                    <p className="text-xs text-gray-500">{feedback.session}</p>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full bg-white/80 hover:bg-white border-gray-200 text-gray-700" asChild>
                  <Link href="/performance">View Detailed Feedback</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
