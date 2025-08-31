/**
 * Error handling components for pitch analysis
 */

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Button } from './button'
import { 
  AlertCircle, 
  Wifi, 
  Shield, 
  FileX, 
  Server, 
  Clock,
  RefreshCw,
  HelpCircle
} from 'lucide-react'
import { AnalysisError } from '@/lib/pitch-analysis'

interface AnalysisErrorProps {
  error: AnalysisError
  onRetry?: () => void
  onDismiss?: () => void
  className?: string
}

export function AnalysisErrorDisplay({ 
  error, 
  onRetry, 
  onDismiss, 
  className 
}: AnalysisErrorProps) {
  const getErrorIcon = () => {
    switch (error.type) {
      case 'network':
        return <Wifi className="h-8 w-8 text-red-500" />
      case 'authentication':
        return <Shield className="h-8 w-8 text-red-500" />
      case 'validation':
        return <FileX className="h-8 w-8 text-red-500" />
      case 'processing':
        return <Server className="h-8 w-8 text-red-500" />
      case 'quota':
        return <Clock className="h-8 w-8 text-red-500" />
      default:
        return <AlertCircle className="h-8 w-8 text-red-500" />
    }
  }

  const getErrorTitle = () => {
    switch (error.type) {
      case 'network':
        return 'Connection Failed'
      case 'authentication':
        return 'Authentication Required'
      case 'validation':
        return 'Invalid Audio File'
      case 'processing':
        return 'Processing Error'
      case 'quota':
        return 'Rate Limit Exceeded'
      default:
        return 'Analysis Failed'
    }
  }

  const getHelpText = () => {
    switch (error.type) {
      case 'network':
        return 'Check your internet connection and try again. If the problem persists, our servers may be temporarily unavailable.'
      case 'authentication':
        return 'Please log in to your account to continue with pitch analysis.'
      case 'validation':
        return 'Make sure your audio file is in a supported format (WebM, MP4, WAV) and under 50MB in size.'
      case 'processing':
        return 'Our analysis servers encountered an error. This is usually temporary - please try again in a few moments.'
      case 'quota':
        return 'You\'ve reached the rate limit for analysis requests. Please wait a moment before trying again.'
      default:
        return 'An unexpected error occurred. Please try again or contact support if the problem continues.'
    }
  }

  return (
    <Card className={`border-red-200 ${className}`}>
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-4">
          {getErrorIcon()}
        </div>
        <CardTitle className="text-red-700">{getErrorTitle()}</CardTitle>
      </CardHeader>
      
      <CardContent className="text-center space-y-4">
        <p className="text-sm text-muted-foreground">
          {error.message}
        </p>
        
        {error.details && (
          <details className="text-xs text-muted-foreground">
            <summary className="cursor-pointer hover:text-foreground">
              Technical Details
            </summary>
            <p className="mt-2 p-2 bg-gray-50 rounded text-left font-mono">
              {error.details}
            </p>
          </details>
        )}
        
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-start space-x-2">
            <HelpCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-700 text-left">
              {getHelpText()}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          {error.retryable && onRetry && (
            <Button 
              onClick={onRetry}
              variant="default"
              size="sm"
              className="flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>
                Try Again
                {error.retryAfter && ` (${error.retryAfter}s)`}
              </span>
            </Button>
          )}
          
          {onDismiss && (
            <Button 
              onClick={onDismiss}
              variant="outline"
              size="sm"
            >
              Dismiss
            </Button>
          )}
        </div>
        
        {error.retryAfter && error.retryAfter > 0 && (
          <p className="text-xs text-muted-foreground">
            Automatic retry in {error.retryAfter} seconds
          </p>
        )}
      </CardContent>
    </Card>
  )
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class AnalysisErrorBoundary extends React.Component<
  React.PropsWithChildren<{
    fallback?: React.ComponentType<{ error: Error; retry: () => void }>
    onError?: (error: Error) => void
  }>,
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Analysis Error Boundary caught an error:', error, errorInfo)
    this.props.onError?.(error)
  }

  retry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        const Fallback = this.props.fallback
        return <Fallback error={this.state.error} retry={this.retry} />
      }

      const analysisError: AnalysisError = {
        type: 'unknown',
        message: this.state.error.message || 'An unexpected error occurred',
        retryable: true
      }

      return (
        <AnalysisErrorDisplay 
          error={analysisError}
          onRetry={this.retry}
        />
      )
    }

    return this.props.children
  }
}

interface RetryableErrorProps {
  error: AnalysisError
  onRetry: () => void
  retryCount?: number
  maxRetries?: number
}

export function RetryableError({ 
  error, 
  onRetry, 
  retryCount = 0, 
  maxRetries = 3 
}: RetryableErrorProps) {
  const [isRetrying, setIsRetrying] = React.useState(false)
  const [countdown, setCountdown] = React.useState(error.retryAfter || 0)

  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleRetry = async () => {
    setIsRetrying(true)
    try {
      await onRetry()
    } finally {
      setIsRetrying(false)
    }
  }

  const canRetry = error.retryable && retryCount < maxRetries && countdown === 0

  return (
    <AnalysisErrorDisplay
      error={error}
      onRetry={canRetry ? handleRetry : undefined}
      className="max-w-md mx-auto"
    >
      {retryCount > 0 && (
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            Retry attempt {retryCount} of {maxRetries}
          </p>
        </div>
      )}
      
      {isRetrying && (
        <div className="mt-4 text-center">
          <RefreshCw className="h-4 w-4 animate-spin mx-auto" />
          <p className="text-xs text-muted-foreground mt-1">Retrying...</p>
        </div>
      )}
    </AnalysisErrorDisplay>
  )
}