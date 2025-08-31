/**
 * Complete metrics display component for pitch analysis results
 */

'use client'

import React, { lazy, Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Target,
  MessageSquare,
  RotateCcw,
  Download,
  Share2
} from 'lucide-react'
import { PitchMetrics } from '@/lib/types/pitch'
import { cn } from '@/lib/utils'

// Lazy load the detailed metrics component
const DetailedMetrics = lazy(() => import('./detailed-metrics').then(module => ({ default: module.DetailedMetrics })))

interface MetricsDisplayProps {
  metrics: PitchMetrics | null
  transcription?: string | null
  processingTime?: number | null
  isVisible: boolean
  isAuthenticated: boolean
  onNewRecording?: () => void
  onLoginRequired?: () => void
  className?: string
}

export function MetricsDisplay({
  metrics,
  transcription,
  processingTime,
  isVisible,
  isAuthenticated,
  onNewRecording,
  onLoginRequired,
  className
}: MetricsDisplayProps) {
  if (!isVisible || !metrics) {
    return (
      <Card className={cn("h-full flex items-center justify-center bg-white/60 backdrop-blur-sm border border-gray-100", className)}>
        <CardContent className="text-center p-6">
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
              <Target className="w-8 h-8 text-gray-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-800">Ready for Analysis</h3>
              <p className="text-sm text-gray-600">
                Record your pitch to see detailed metrics and improvement suggestions.
              </p>
              {!isAuthenticated && (
                <div className="pt-4">
                  <Button
                    onClick={onLoginRequired}
                    variant="outline"
                    size="sm"
                    className="text-rose-600 border-rose-200 hover:bg-rose-50"
                  >
                    Sign in for detailed analysis
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Show login prompt if not authenticated but has metrics
  if (!isAuthenticated) {
    return (
      <Card className={cn("h-full flex items-center justify-center bg-white/60 backdrop-blur-sm border border-gray-100", className)}>
        <CardContent className="text-center p-6">
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-rose-100 flex items-center justify-center">
              <Target className="w-8 h-8 text-rose-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-800">Sign in to see results</h3>
              <p className="text-sm text-gray-600">
                Your pitch has been analyzed! Sign in to view detailed metrics and improvement suggestions.
              </p>
              <div className="pt-4">
                <Button
                  onClick={onLoginRequired}
                  className="bg-gradient-to-r from-rose-400 to-orange-400 hover:from-rose-500 hover:to-orange-500 text-white"
                >
                  Sign in to view results
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }



  return (
    <Card className={cn("h-full bg-white/60 backdrop-blur-sm border border-gray-100", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Pitch Analysis</CardTitle>
          <div className="flex items-center space-x-2">
            {processingTime && (
              <Badge variant="outline" className="text-xs">
                {(processingTime / 1000).toFixed(1)}s
              </Badge>
            )}
            <Button
              onClick={onNewRecording}
              variant="outline"
              size="sm"
              className="flex items-center space-x-1"
            >
              <RotateCcw className="h-3 w-3" />
              <span>New Recording</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 overflow-y-auto max-h-[calc(100vh-200px)]">
        {/* Overall Score */}
        <div className="text-center space-y-3">
          <div className="relative">
            <div className="w-24 h-24 mx-auto rounded-full border-8 border-gray-200 flex items-center justify-center relative">
              <div
                className={cn(
                  "absolute inset-0 rounded-full border-8 border-transparent",
                  metrics.overallScore >= 80 ? "border-t-green-500 border-r-green-500" :
                    metrics.overallScore >= 60 ? "border-t-yellow-500 border-r-yellow-500" :
                      "border-t-red-500 border-r-red-500"
                )}
                style={{
                  transform: `rotate(${(metrics.overallScore / 100) * 360}deg)`,
                  transition: 'transform 1s ease-in-out'
                }}
              />
              <span className={cn("text-2xl font-bold", getScoreColor(metrics.overallScore))}>
                {metrics.overallScore}
              </span>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Overall Score</h3>
            <p className="text-sm text-gray-600">
              {metrics.overallScore >= 80 ? 'Excellent pitch!' :
                metrics.overallScore >= 60 ? 'Good pitch with room for improvement' :
                  'Needs significant improvement'}
            </p>
          </div>
        </div>

        {/* Individual Metrics - Lazy loaded for better performance */}
        <Suspense fallback={
          <div className="space-y-4">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-2 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-2 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        }>
          <DetailedMetrics metrics={metrics} />
        </Suspense>

        {/* Transcription */}
        {transcription && (
          <div className="space-y-2">
            <h4 className="font-medium flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>Transcription</span>
            </h4>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-700 leading-relaxed">
                {transcription}
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col space-y-2 pt-4 border-t">
          <Button
            onClick={onNewRecording}
            className="w-full bg-gradient-to-r from-rose-400 to-orange-400 hover:from-rose-500 hover:to-orange-500 text-white"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Record Another Pitch
          </Button>

          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}