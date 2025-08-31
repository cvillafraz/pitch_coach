'use client'

import { memo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  Clock, 
  MessageSquare, 
  Target, 
  Heart,
  CheckCircle,
  XCircle,
  Lightbulb
} from 'lucide-react'
import { PitchMetrics } from '@/lib/types/pitch'
import { cn } from '@/lib/utils'

interface DetailedMetricsProps {
  metrics: PitchMetrics
}

export const DetailedMetrics = memo(function DetailedMetrics({ metrics }: DetailedMetricsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBadgeVariant = (score: number): "default" | "secondary" | "destructive" | "outline" => {
    if (score >= 80) return 'default'
    if (score >= 60) return 'secondary'
    return 'destructive'
  }

  return (
    <div className="space-y-6">
      {/* Clarity Metrics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            Clarity & Articulation
            <Badge variant={getScoreBadgeVariant(metrics.clarity.score)}>
              {metrics.clarity.score}%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Progress value={metrics.clarity.score} className="h-2" />
          <p className="text-sm text-muted-foreground">{metrics.clarity.feedback}</p>
          {metrics.clarity.suggestions && metrics.clarity.suggestions.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Lightbulb className="w-4 h-4 text-yellow-500" />
                Suggestions
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                {metrics.clarity.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-1">•</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pace Metrics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="w-5 h-5 text-purple-500" />
            Pace & Timing
            <Badge variant={getScoreBadgeVariant(metrics.pace.score)}>
              {metrics.pace.score}%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Progress value={metrics.pace.score} className="h-2" />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Words per minute:</span>
            <span className="font-medium">{metrics.pace.wordsPerMinute}</span>
          </div>
          <p className="text-sm text-muted-foreground">{metrics.pace.feedback}</p>
        </CardContent>
      </Card>

      {/* Confidence Metrics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="w-5 h-5 text-green-500" />
            Confidence & Delivery
            <Badge variant={getScoreBadgeVariant(metrics.confidence.score)}>
              {metrics.confidence.score}%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Progress value={metrics.confidence.score} className="h-2" />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Filler words:</span>
            <span className="font-medium">{metrics.confidence.fillerWords}</span>
          </div>
          <p className="text-sm text-muted-foreground">{metrics.confidence.feedback}</p>
        </CardContent>
      </Card>

      {/* Structure Metrics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="w-5 h-5 text-orange-500" />
            Structure & Organization
            <Badge variant={getScoreBadgeVariant(metrics.structure.score)}>
              {metrics.structure.score}%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Progress value={metrics.structure.score} className="h-2" />
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              {metrics.structure.hasIntro ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
              <span>Introduction</span>
            </div>
            <div className="flex items-center gap-2">
              {metrics.structure.hasProblem ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
              <span>Problem Statement</span>
            </div>
            <div className="flex items-center gap-2">
              {metrics.structure.hasSolution ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
              <span>Solution</span>
            </div>
            <div className="flex items-center gap-2">
              {metrics.structure.hasCall ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
              <span>Call to Action</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{metrics.structure.feedback}</p>
        </CardContent>
      </Card>

      {/* Engagement Metrics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Heart className="w-5 h-5 text-pink-500" />
            Engagement & Emotion
            <Badge variant={getScoreBadgeVariant(metrics.engagement.score)}>
              {metrics.engagement.score}%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Progress value={metrics.engagement.score} className="h-2" />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Emotional tone:</span>
            <span className="font-medium capitalize">{metrics.engagement.emotionalTone}</span>
          </div>
          <p className="text-sm text-muted-foreground">{metrics.engagement.feedback}</p>
        </CardContent>
      </Card>
    </div>
  )
})