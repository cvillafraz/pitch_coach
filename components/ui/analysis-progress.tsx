/**
 * Progress indicators for pitch analysis
 */

import React from 'react'
import { Progress } from './progress'
import { Card, CardContent } from './card'
import { Loader2, Upload, Brain, CheckCircle, AlertCircle } from 'lucide-react'
import { AnalysisProgress } from '@/lib/pitch-analysis'

interface AnalysisProgressProps {
  progress: AnalysisProgress
  className?: string
}

export function AnalysisProgressIndicator({ progress, className }: AnalysisProgressProps) {
  const getStageIcon = () => {
    switch (progress.stage) {
      case 'uploading':
        return <Upload className="h-5 w-5 animate-pulse" />
      case 'processing':
      case 'analyzing':
        return <Brain className="h-5 w-5 animate-pulse" />
      case 'complete':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Loader2 className="h-5 w-5 animate-spin" />
    }
  }

  const getProgressColor = () => {
    switch (progress.stage) {
      case 'complete':
        return 'bg-green-500'
      case 'error':
        return 'bg-red-500'
      default:
        return 'bg-blue-500'
    }
  }

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          {getStageIcon()}
          <div className="flex-1">
            <p className="text-sm font-medium">{progress.message}</p>
            {progress.estimatedTimeRemaining && progress.estimatedTimeRemaining > 0 && (
              <p className="text-xs text-muted-foreground">
                ~{progress.estimatedTimeRemaining}s remaining
              </p>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <Progress 
            value={progress.progress} 
            className="h-2"
            indicatorClassName={getProgressColor()}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{progress.progress}%</span>
            <span className="capitalize">{progress.stage}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface AnalysisStepsProps {
  currentStage: AnalysisProgress['stage']
  className?: string
}

export function AnalysisSteps({ currentStage, className }: AnalysisStepsProps) {
  const steps = [
    { key: 'uploading', label: 'Upload Audio', icon: Upload },
    { key: 'processing', label: 'Process Data', icon: Loader2 },
    { key: 'analyzing', label: 'AI Analysis', icon: Brain },
    { key: 'complete', label: 'Complete', icon: CheckCircle }
  ] as const

  const getStepStatus = (stepKey: string) => {
    const stepIndex = steps.findIndex(s => s.key === stepKey)
    const currentIndex = steps.findIndex(s => s.key === currentStage)
    
    if (currentStage === 'error') return 'error'
    if (stepIndex < currentIndex) return 'complete'
    if (stepIndex === currentIndex) return 'active'
    return 'pending'
  }

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {steps.map((step, index) => {
        const status = getStepStatus(step.key)
        const Icon = step.icon
        
        return (
          <React.Fragment key={step.key}>
            <div className="flex flex-col items-center space-y-2">
              <div className={`
                flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
                ${status === 'complete' ? 'bg-green-500 border-green-500 text-white' : ''}
                ${status === 'active' ? 'bg-blue-500 border-blue-500 text-white' : ''}
                ${status === 'pending' ? 'bg-gray-100 border-gray-300 text-gray-400' : ''}
                ${status === 'error' ? 'bg-red-500 border-red-500 text-white' : ''}
              `}>
                <Icon className={`h-4 w-4 ${status === 'active' ? 'animate-pulse' : ''}`} />
              </div>
              <span className={`text-xs font-medium ${
                status === 'complete' ? 'text-green-600' :
                status === 'active' ? 'text-blue-600' :
                status === 'error' ? 'text-red-600' :
                'text-gray-400'
              }`}>
                {step.label}
              </span>
            </div>
            
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 transition-colors ${
                getStepStatus(steps[index + 1].key) === 'complete' ? 'bg-green-500' :
                getStepStatus(steps[index + 1].key) === 'active' ? 'bg-blue-500' :
                'bg-gray-200'
              }`} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

interface AnalysisLoadingOverlayProps {
  progress: AnalysisProgress
  onCancel?: () => void
  className?: string
}

export function AnalysisLoadingOverlay({ 
  progress, 
  onCancel, 
  className 
}: AnalysisLoadingOverlayProps) {
  return (
    <div className={`
      fixed inset-0 bg-black/50 flex items-center justify-center z-50 
      ${className}
    `}>
      <Card className="w-full max-w-md mx-4">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold mb-2">Analyzing Your Pitch</h3>
            <p className="text-sm text-muted-foreground">
              Please wait while we process your recording...
            </p>
          </div>
          
          <AnalysisSteps currentStage={progress.stage} className="mb-6" />
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              {progress.stage !== 'error' && progress.stage !== 'complete' && (
                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
              )}
              <span className="text-sm">{progress.message}</span>
            </div>
            
            <Progress 
              value={progress.progress} 
              className="h-2"
              indicatorClassName={
                progress.stage === 'error' ? 'bg-red-500' :
                progress.stage === 'complete' ? 'bg-green-500' :
                'bg-blue-500'
              }
            />
            
            {progress.estimatedTimeRemaining && progress.estimatedTimeRemaining > 0 && (
              <p className="text-xs text-center text-muted-foreground">
                Estimated time remaining: {progress.estimatedTimeRemaining} seconds
              </p>
            )}
          </div>
          
          {onCancel && progress.stage !== 'complete' && progress.stage !== 'error' && (
            <div className="mt-6 text-center">
              <button
                onClick={onCancel}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel Analysis
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}