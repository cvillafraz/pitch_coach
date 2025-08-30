"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { LogoutButton } from "@/components/auth/logout-button"
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
  const [selectedTimeframe, setSelectedTimeframe] = useState("week")

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white/60 backdrop-blur-sm border-b border-gray-100">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-orange-400 rounded-lg flex items-center justify-center shadow-sm">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-light text-gray-800">PitchCoach</h1>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-800 hover:bg-white/50" asChild>
              <Link href="/performance">Performance</Link>
            </Button>
            <Button 
              className="bg-gradient-to-r from-rose-400 to-orange-400 hover:from-rose-500 hover:to-orange-500 text-white border-0 rounded-lg shadow-sm hover:shadow-md transition-all duration-200" 
              asChild
            >
              <Link href="/practice">Practice Now</Link>
            </Button>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Welcome back, {mockDashboardData.user.name}!</h2>
              <p className="text-muted-foreground">
                You're on a {mockDashboardData.user.currentStreak}-day streak. Keep up the great work!
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Zap className="w-3 h-3" />
                <span>{mockDashboardData.user.level}</span>
              </Badge>
              <Badge variant="outline" className="flex items-center space-x-1">
                <Star className="w-3 h-3" />
                <span>{mockDashboardData.user.currentStreak} day streak</span>
              </Badge>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/40 backdrop-blur-sm border-gray-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <MessageSquare className="w-4 h-4 mr-2" />
                Total Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-rose-500">{mockDashboardData.quickStats.totalSessions}</div>
              <div className="flex items-center text-green-600 text-sm mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />+{mockDashboardData.quickStats.improvement}% this month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Target className="w-4 h-4 mr-2" />
                Average Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getScoreColor(mockDashboardData.quickStats.averageScore)}`}>
                {mockDashboardData.quickStats.averageScore}
              </div>
              <div className="text-sm text-muted-foreground mt-1">out of 100</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Practice Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {formatTime(mockDashboardData.quickStats.practiceTime)}
              </div>
              <div className="text-sm text-muted-foreground mt-1">total practice</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Award className="w-4 h-4 mr-2" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{mockDashboardData.achievements.length}</div>
              <div className="flex items-center space-x-1 mt-1">
                {mockDashboardData.achievements.slice(0, 3).map((achievement, index) => (
                  <span key={index} className="text-sm">
                    {achievement.icon}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Jump into your next practice session</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <Button className="h-20 flex flex-col items-center justify-center space-y-2" asChild>
                    <Link href="/practice">
                      <Play className="w-6 h-6" />
                      <span>Start Practice</span>
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                    asChild
                  >
                    <Link href="/personas">
                      <Users className="w-6 h-6" />
                      <span>Choose Persona</span>
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                    asChild
                  >
                    <Link href="/feedback">
                      <BarChart3 className="w-6 h-6" />
                      <span>View Feedback</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Sessions */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Sessions</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/performance" className="flex items-center space-x-1">
                      <span>View All</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockDashboardData.recentSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{session.persona}</p>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <span>{session.date}</span>
                            <Badge variant="outline" className="text-xs">
                              {session.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${getScoreColor(session.score)}`}>{session.score}</div>
                        <div className="text-xs text-muted-foreground">{formatTime(session.duration)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Weekly Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>This Week's Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {mockDashboardData.weeklyActivity.map((day, index) => (
                    <div key={index} className="text-center">
                      <div className="text-xs text-muted-foreground mb-2">{day.day}</div>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                          day.sessions > 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {day.sessions}
                      </div>
                      {day.score > 0 && <div className={`text-xs mt-1 ${getScoreColor(day.score)}`}>{day.score}</div>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Goals Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Goals</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockDashboardData.upcomingGoals.map((goal) => (
                  <div key={goal.id} className={`p-3 rounded-lg border ${getPriorityColor(goal.priority)}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{goal.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {goal.dueDate}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{goal.description}</p>
                    <Progress value={goal.progress} className="h-2" />
                    <div className="text-xs text-muted-foreground mt-1">{goal.progress}% complete</div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                  <Link href="/performance">View All Goals</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Feedback */}
            <Card>
              <CardHeader>
                <CardTitle>Latest Feedback</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockDashboardData.recentFeedback.map((feedback) => (
                  <div key={feedback.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {feedback.category}
                      </Badge>
                      <span className={`text-sm font-medium ${getScoreColor(feedback.score)}`}>{feedback.score}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{feedback.feedback}</p>
                    <p className="text-xs text-muted-foreground">{feedback.session}</p>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                  <Link href="/feedback">View Detailed Feedback</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5" />
                  <span>Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockDashboardData.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="text-lg">{achievement.icon}</div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{achievement.title}</p>
                        {achievement.recent && (
                          <Badge variant="secondary" className="text-xs mt-1">
                            New!
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4 bg-transparent" asChild>
                  <Link href="/performance">View All Achievements</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
