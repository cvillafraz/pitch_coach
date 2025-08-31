'use client'

import { useEffect, useState, memo } from 'react'
import { ScoreDisplayProps } from '@/lib/types/pitch'
import { cn } from '@/lib/utils'

export const ScoreDisplay = memo(function ScoreDisplay({ score, isAnimating = false, size = 'large' }: ScoreDisplayProps) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const [isInternalAnimating, setIsInternalAnimating] = useState(false)

  // Size configurations for responsive design
  const sizeConfig = {
    large: {
      container: 'w-32 h-32', // 128px - Desktop
      text: 'text-3xl',
      radius: 58,
      strokeWidth: 6,
      labelSize: 'text-sm'
    },
    medium: {
      container: 'w-24 h-24', // 96px - Tablet
      text: 'text-2xl',
      radius: 42,
      strokeWidth: 5,
      labelSize: 'text-xs'
    },
    compact: {
      container: 'w-16 h-16', // 64px - Mobile
      text: 'text-lg',
      radius: 26,
      strokeWidth: 4,
      labelSize: 'text-xs'
    }
  }

  const config = sizeConfig[size]
  const circumference = 2 * Math.PI * config.radius

  // Score color mapping based on performance (red/yellow/green)
  const getScoreColors = (score: number) => {
    if (score >= 80) {
      return {
        text: 'text-emerald-600',
        stroke: 'stroke-emerald-500',
        gradient: 'from-emerald-400 to-green-500'
      }
    }
    if (score >= 60) {
      return {
        text: 'text-amber-600',
        stroke: 'stroke-amber-500',
        gradient: 'from-amber-400 to-yellow-500'
      }
    }
    return {
      text: 'text-red-600',
      stroke: 'stroke-red-500',
      gradient: 'from-red-400 to-rose-500'
    }
  }

  const colors = getScoreColors(animatedScore || score)

  // Smooth animation from 0% to actual score
  useEffect(() => {
    if (isAnimating) {
      setIsInternalAnimating(true)
      setAnimatedScore(0)
      
      // Start animation after a brief delay
      const startAnimation = setTimeout(() => {
        setAnimatedScore(score)
      }, 100)

      // End animation state after animation completes
      const endAnimation = setTimeout(() => {
        setIsInternalAnimating(false)
      }, 1100)

      return () => {
        clearTimeout(startAnimation)
        clearTimeout(endAnimation)
      }
    } else {
      setAnimatedScore(score)
      setIsInternalAnimating(false)
    }
  }, [score, isAnimating])

  // Calculate stroke dash offset for circular progress
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference

  return (
    <div className="flex flex-col items-center space-y-3">
      <div className={cn('relative', config.container)}>
        {/* SVG Circle Progress */}
        <svg
          className="transform -rotate-90 w-full h-full"
          viewBox={`0 0 ${(config.radius + 8) * 2} ${(config.radius + 8) * 2}`}
        >
          {/* Background circle */}
          <circle
            cx={config.radius + 8}
            cy={config.radius + 8}
            r={config.radius}
            stroke="currentColor"
            strokeWidth={config.strokeWidth}
            fill="transparent"
            className="text-gray-200 dark:text-gray-700"
          />
          
          {/* Gradient definitions for progress circle */}
          <defs>
            <linearGradient id={`scoreGradient-${size}-${score >= 80 ? 'high' : score >= 60 ? 'medium' : 'low'}`} x1="0%" y1="0%" x2="100%" y2="100%">
              {score >= 80 ? (
                <>
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </>
              ) : score >= 60 ? (
                <>
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#dc2626" />
                </>
              )}
            </linearGradient>
          </defs>
          
          {/* Progress circle with gradient */}
          <circle
            cx={config.radius + 8}
            cy={config.radius + 8}
            r={config.radius}
            stroke={`url(#scoreGradient-${size}-${score >= 80 ? 'high' : score >= 60 ? 'medium' : 'low'})`}
            strokeWidth={config.strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
            }}
          />
        </svg>
        
        {/* Score text with animation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn(
            'font-bold transition-all duration-300',
            config.text,
            colors.text,
            isInternalAnimating && 'animate-pulse'
          )}>
            {isInternalAnimating ? '...' : `${Math.round(animatedScore)}%`}
          </span>
        </div>

        {/* Subtle glow effect for high scores */}
        {animatedScore >= 80 && !isInternalAnimating && (
          <div 
            className={cn(
              'absolute inset-0 rounded-full opacity-20 animate-pulse',
              'bg-gradient-to-r from-emerald-400 to-green-500'
            )}
            style={{ filter: 'blur(8px)' }}
          />
        )}
      </div>
      
      {/* Label with responsive sizing */}
      <p className={cn(
        'font-medium text-muted-foreground text-center',
        config.labelSize
      )}>
        Overall Score
      </p>
    </div>
  )
})