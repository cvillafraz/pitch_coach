'use client'

import { memo } from 'react'
import { MetricsPanelProps } from '@/lib/types/pitch'
import { Card } from '@/components/ui/card'
import { ScoreDisplay } from './score-display'
import { LoginOverlay } from './login-overlay'

export const MetricsPanel = memo(function MetricsPanel({ 
  score, 
  metrics, 
  isAuthenticated, 
  isProcessing, 
  onLoginRequired 
}: MetricsPanelProps) {
  return (
    <Card className="p-6 h-full bg-white/60 backdrop-blur-sm border border-gray-100 relative overflow-hidden">
      <div className="space-y-6">
        {/* Score Display at top */}
        <div className="text-center">
          <ScoreDisplay 
            score={score} 
            isAnimating={isProcessing}
            size="large"
          />
        </div>

        {/* Detailed Metrics */}
        <div className={`space-y-4 ${!isAuthenticated ? 'blur-sm opacity-50' : ''}`}>
          <h3 className="text-xl font-medium text-gray-800 mb-4">Detailed Analysis</h3>
          
          {metrics ? (
            <div className="grid gap-4">
              <div className="p-4 bg-white/40 rounded-lg border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700">Clarity</span>
                  <span className="text-lg font-semibold text-gray-800">{metrics.clarity.score}%</span>
                </div>
                <p className="text-sm text-gray-600">{metrics.clarity.feedback}</p>
              </div>

              <div className="p-4 bg-white/40 rounded-lg border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700">Pace</span>
                  <span className="text-lg font-semibold text-gray-800">{metrics.pace.score}%</span>
                </div>
                <p className="text-sm text-gray-600">{metrics.pace.feedback}</p>
                <p className="text-xs text-gray-500 mt-1">{metrics.pace.wordsPerMinute} words per minute</p>
              </div>

              <div className="p-4 bg-white/40 rounded-lg border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700">Confidence</span>
                  <span className="text-lg font-semibold text-gray-800">{metrics.confidence.score}%</span>
                </div>
                <p className="text-sm text-gray-600">{metrics.confidence.feedback}</p>
                <p className="text-xs text-gray-500 mt-1">{metrics.confidence.fillerWords} filler words</p>
              </div>

              <div className="p-4 bg-white/40 rounded-lg border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700">Structure</span>
                  <span className="text-lg font-semibold text-gray-800">{metrics.structure.score}%</span>
                </div>
                <p className="text-sm text-gray-600">{metrics.structure.feedback}</p>
              </div>

              <div className="p-4 bg-white/40 rounded-lg border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700">Engagement</span>
                  <span className="text-lg font-semibold text-gray-800">{metrics.engagement.score}%</span>
                </div>
                <p className="text-sm text-gray-600">{metrics.engagement.feedback}</p>
                <p className="text-xs text-gray-500 mt-1">Tone: {metrics.engagement.emotionalTone}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Record a pitch to see your detailed analysis</p>
            </div>
          )}
        </div>
      </div>

      {/* Login Overlay for unauthenticated users */}
      {!isAuthenticated && (
        <LoginOverlay 
          onLogin={onLoginRequired}
          isVisible={true}
        />
      )}
    </Card>
  )
})