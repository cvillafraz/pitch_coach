"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserNav } from "@/components/auth/user-nav"
import {
  Mic,
  Users,
  Play,
  BarChart3,
  Zap,
  CreditCard,
} from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchDashboard = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token

      // Get current user info
      setUser(session?.user)

      try {
        const res = await fetch(process.env.SITE_URL+"/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (res.ok) {
          const data = await res.json()
          setDashboardData(data)
        }
      } catch (e) {
        // fail silently
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  // Extract username from email (remove @gmail.com part)
  const displayName = user?.email?.split('@')[0] || 'User'

  if (loading) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white/60 backdrop-blur-sm border-b border-gray-100">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-orange-400 rounded-lg flex items-center justify-center shadow-sm">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-light text-gray-800">Micdrop</h1>
          </Link>

          <UserNav />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex-1">
              <h2 className="text-3xl font-light text-gray-800 mb-2">Welcome back, {displayName}!</h2>
              <p className="text-gray-600 text-lg">
                Ready to practice your pitch? Let's get started!
              </p>
            </div>
            <div className="flex items-center space-x-2 sm:flex-shrink-0">
              <Badge variant="outline" className="flex items-center space-x-2 bg-white/60 text-gray-700 border-gray-200 px-3 py-1">
                <Zap className="w-4 h-4" />
                <span className="font-medium">Ready to Practice</span>
              </Badge>
            </div>
          </div>
        </div>

        {/* Quick Actions - Full Width */}
        <Card className="bg-white/60 backdrop-blur-sm border-gray-200 mb-8">
          <CardHeader>
            <CardTitle className="text-gray-800 font-medium">Quick Actions</CardTitle>
            <CardDescription className="text-gray-600">Jump into your next practice session</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Button className="h-24 flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white shadow-lg transition-all duration-200" asChild>
                <Link href="/ai-voice">
                  <Play className="w-7 h-7" />
                  <span className="text-sm font-medium">Start Practice</span>
                </Link>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center space-y-2 bg-white/80 hover:bg-white border-gray-200 text-gray-700 shadow-sm transition-all duration-200"
                asChild
              >
                <Link href="/personas">
                  <Users className="w-7 h-7" />
                  <span className="text-sm font-medium">Choose Persona</span>
                </Link>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center space-y-2 bg-white/80 hover:bg-white border-gray-200 text-gray-700 shadow-sm transition-all duration-200"
                asChild
              >
                <Link href="/performance">
                  <BarChart3 className="w-7 h-7" />
                  <span className="text-sm font-medium">View Performance</span>
                </Link>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-orange-100 to-rose-100 hover:from-orange-200 hover:to-rose-200 border-orange-200 text-orange-800 shadow-sm transition-all duration-200"
                asChild
              >
                <Link href="/payments">
                  <CreditCard className="w-7 h-7" />
                  <span className="text-sm font-medium">Premium Plans</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

          {/* Left Column */}
          <div className="space-y-6">

            {/* Left Column - Stats or Info */}
            <Card className="bg-white/60 backdrop-blur-sm border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-800 font-medium">Your Progress</CardTitle>
                <CardDescription className="text-gray-600">Track your improvement over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-sm">Start practicing to see your progress stats!</p>
                </div>
              </CardContent>
            </Card>

            {/* Right Column - Recent Feedback */}
            <Card className="bg-white/60 backdrop-blur-sm border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-800 font-medium">Latest Feedback</CardTitle>
                <CardDescription className="text-gray-600">Recent insights from your practice sessions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {dashboardData?.recentFeedback?.length > 0 ? (
                  dashboardData.recentFeedback.map((feedback: any) => (
                    <div key={feedback.id} className="p-4 border border-gray-200 rounded-lg bg-white/40 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="outline" className="text-xs bg-white/60 text-gray-700 border-gray-200">
                          {feedback.category}
                        </Badge>
                        <span className="text-sm font-semibold text-gray-800 bg-gray-100 px-2 py-1 rounded">
                          {feedback.score}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2 leading-relaxed">{feedback.feedback}</p>
                      <p className="text-xs text-gray-500 font-medium">{feedback.session}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Mic className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-sm">No feedback yet.</p>
                    <p className="text-sm">Start practicing to see your progress!</p>
                  </div>
                )}
                <Button variant="outline" size="sm" className="w-full bg-white/80 hover:bg-white border-gray-200 text-gray-700 mt-4" asChild>
                  <Link href="/performance">View Detailed Feedback</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
      </main>
    </div>
  )
}