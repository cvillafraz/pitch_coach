"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mic, TrendingUp, TrendingDown, Target, Award, BarChart3, LineChart, Clock, Users } from "lucide-react"
import Link from "next/link"

// Mock performance data (in a real app, this would come from a database)
const mockPerformanceData = {
  currentStreak: 7,
  totalSessions: 24,
  totalPracticeTime: 14400, // seconds
  averageScore: 76,
  bestScore: 89,
  improvementRate: 12, // percentage
  goals: {
    weeklyTarget: 3,
    currentWeek: 2,
    monthlyTarget: 12,
    currentMonth: 8,
  },
  recentSessions: [
    {
      id: 1,
      date: "2024-01-15",
      persona: "Sarah Chen",
      score: 78,
      duration: 420,
      categories: { content: 82, delivery: 75, structure: 80, engagement: 74 },
    },
    {
      id: 2,
      date: "2024-01-14",
      persona: "Michael Rodriguez",
      score: 72,
      duration: 380,
      categories: { content: 75, delivery: 70, structure: 74, engagement: 69 },
    },
    {
      id: 3,
      date: "2024-01-12",
      persona: "Jennifer Park",
      score: 81,
      duration: 450,
      categories: { content: 85, delivery: 78, structure: 82, engagement: 79 },
    },
    {
      id: 4,
      date: "2024-01-10",
      persona: "David Kim",
      score: 69,
      duration: 360,
      categories: { content: 72, delivery: 65, structure: 71, engagement: 68 },
    },
    {
      id: 5,
      date: "2024-01-08",
      persona: "Emma Thompson",
      score: 75,
      duration: 400,
      categories: { content: 78, delivery: 73, structure: 76, engagement: 73 },
    },
  ],
  weeklyProgress: [
    { week: "Week 1", score: 65, sessions: 2 },
    { week: "Week 2", score: 68, sessions: 3 },
    { week: "Week 3", score: 72, sessions: 4 },
    { week: "Week 4", score: 76, sessions: 3 },
  ],
  categoryTrends: {
    content: [70, 72, 75, 78, 82],
    delivery: [65, 68, 70, 73, 75],
    structure: [68, 70, 74, 76, 80],
    engagement: [62, 65, 68, 71, 74],
  },
  achievements: [
    {
      id: 1,
      title: "First Pitch",
      description: "Completed your first practice session",
      icon: "🎯",
      earned: true,
      date: "2024-01-01",
    },
    {
      id: 2,
      title: "Week Warrior",
      description: "Practiced 3 times in one week",
      icon: "🔥",
      earned: true,
      date: "2024-01-08",
    },
    {
      id: 3,
      title: "Score Master",
      description: "Achieved a score of 80 or higher",
      icon: "⭐",
      earned: true,
      date: "2024-01-12",
    },
    {
      id: 4,
      title: "Consistency King",
      description: "Practice for 7 days straight",
      icon: "👑",
      earned: true,
      date: "2024-01-15",
    },
    {
      id: 5,
      title: "Perfect Pitch",
      description: "Achieve a score of 90 or higher",
      icon: "💎",
      earned: false,
      date: null,
    },
  ],
}

export default function PerformancePage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("month")
  const [selectedCategory, setSelectedCategory] = useState("overall")

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="w-4 h-4 text-green-600" />
    if (current < previous) return <TrendingDown className="w-4 h-4 text-red-600" />
    return <div className="w-4 h-4" />
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
            <Button asChild>
              <Link href="/practice">Practice Now</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Performance Tracking</h2>
          <p className="text-muted-foreground">Monitor your progress and achieve your pitch goals</p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Current Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className="text-2xl font-bold text-primary">{mockPerformanceData.currentStreak}</div>
                <Badge variant="secondary">days</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className="text-2xl font-bold text-primary">{mockPerformanceData.totalSessions}</div>
                <div className="flex items-center text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-sm">+{mockPerformanceData.improvementRate}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Average Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className={`text-2xl font-bold ${getScoreColor(mockPerformanceData.averageScore)}`}>
                  {mockPerformanceData.averageScore}
                </div>
                <Badge variant="outline">out of 100</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Practice Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className="text-2xl font-bold text-primary">
                  {formatTime(mockPerformanceData.totalPracticeTime)}
                </div>
                <Clock className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Goals Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Goals Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Weekly Target</span>
                  <span className="text-sm text-muted-foreground">
                    {mockPerformanceData.goals.currentWeek} / {mockPerformanceData.goals.weeklyTarget}
                  </span>
                </div>
                <Progress
                  value={(mockPerformanceData.goals.currentWeek / mockPerformanceData.goals.weeklyTarget) * 100}
                  className="mb-1"
                />
                <p className="text-xs text-muted-foreground">
                  {mockPerformanceData.goals.weeklyTarget - mockPerformanceData.goals.currentWeek} sessions to go
                </p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Monthly Target</span>
                  <span className="text-sm text-muted-foreground">
                    {mockPerformanceData.goals.currentMonth} / {mockPerformanceData.goals.monthlyTarget}
                  </span>
                </div>
                <Progress
                  value={(mockPerformanceData.goals.currentMonth / mockPerformanceData.goals.monthlyTarget) * 100}
                  className="mb-1"
                />
                <p className="text-xs text-muted-foreground">
                  {mockPerformanceData.goals.monthlyTarget - mockPerformanceData.goals.currentMonth} sessions to go
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Weekly Progress Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <LineChart className="w-5 h-5" />
                    <span>Weekly Progress</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockPerformanceData.weeklyProgress.map((week, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium w-16">{week.week}</span>
                          <div className="flex-1 max-w-32">
                            <Progress value={week.score} className="h-2" />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm font-medium ${getScoreColor(week.score)}`}>{week.score}</span>
                          <Badge variant="outline" className="text-xs">
                            {week.sessions} sessions
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Category Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5" />
                    <span>Category Breakdown</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(mockPerformanceData.categoryTrends).map(([category, scores]) => {
                      const currentScore = scores[scores.length - 1]
                      const previousScore = scores[scores.length - 2]
                      return (
                        <div key={category} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium capitalize w-20">{category}</span>
                            <div className="flex-1 max-w-32">
                              <Progress value={currentScore} className="h-2" />
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`text-sm font-medium ${getScoreColor(currentScore)}`}>{currentScore}</span>
                            {getTrendIcon(currentScore, previousScore)}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="quarter">Last Quarter</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overall">Overall Score</SelectItem>
                  <SelectItem value="content">Content</SelectItem>
                  <SelectItem value="delivery">Delivery</SelectItem>
                  <SelectItem value="structure">Structure</SelectItem>
                  <SelectItem value="engagement">Engagement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Track your improvement over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <LineChart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Interactive chart would be displayed here</p>
                    <p className="text-sm">
                      Showing {selectedCategory} trends for {selectedTimeframe}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sessions Tab */}
          <TabsContent value="sessions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Sessions</CardTitle>
                <CardDescription>Your latest practice sessions and scores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPerformanceData.recentSessions.map((session) => (
                    <div key={session.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{session.persona}</p>
                            <p className="text-sm text-muted-foreground">{session.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-xl font-bold ${getScoreColor(session.score)}`}>{session.score}</div>
                          <div className="text-xs text-muted-foreground">
                            {Math.floor(session.duration / 60)}m {session.duration % 60}s
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {Object.entries(session.categories).map(([category, score]) => (
                          <div key={category} className="text-center">
                            <div className="text-sm font-medium capitalize">{category}</div>
                            <div className={`text-lg font-bold ${getScoreColor(score)}`}>{score}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5" />
                  <span>Achievements</span>
                </CardTitle>
                <CardDescription>Unlock badges as you improve your pitch skills</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockPerformanceData.achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`border rounded-lg p-4 ${
                        achievement.earned ? "bg-primary/5 border-primary/20" : "bg-muted/50 opacity-60"
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div>
                          <h4 className="font-semibold">{achievement.title}</h4>
                          {achievement.earned && achievement.date && (
                            <p className="text-xs text-muted-foreground">Earned {achievement.date}</p>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      {achievement.earned && (
                        <Badge variant="secondary" className="mt-2">
                          Unlocked
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
