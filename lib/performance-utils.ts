/**
 * Performance monitoring utilities for tracking component render times
 * and optimizing application performance
 */

// Performance monitoring for development
export const performanceMonitor = {
  startTime: (label: string) => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      performance.mark(`${label}-start`)
    }
  },

  endTime: (label: string) => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      performance.mark(`${label}-end`)
      performance.measure(label, `${label}-start`, `${label}-end`)
      
      const measure = performance.getEntriesByName(label)[0]
      if (measure) {
        console.log(`⚡ ${label}: ${measure.duration.toFixed(2)}ms`)
      }
    }
  },

  clearMarks: (label?: string) => {
    if (typeof window !== 'undefined') {
      if (label) {
        performance.clearMarks(`${label}-start`)
        performance.clearMarks(`${label}-end`)
        performance.clearMeasures(label)
      } else {
        performance.clearMarks()
        performance.clearMeasures()
      }
    }
  }
}

// Debounce utility for expensive operations
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate?: boolean
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      if (!immediate) func(...args)
    }
    
    const callNow = immediate && !timeout
    
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    
    if (callNow) func(...args)
  }
}

// Throttle utility for high-frequency events
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Memory usage monitoring
export const memoryMonitor = {
  logUsage: (label: string) => {
    if (typeof window !== 'undefined' && 'memory' in performance && process.env.NODE_ENV === 'development') {
      const memory = (performance as any).memory
      console.log(`🧠 ${label} Memory:`, {
        used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`
      })
    }
  },

  checkMemoryPressure: (): boolean => {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory
      const usageRatio = memory.usedJSHeapSize / memory.jsHeapSizeLimit
      return usageRatio > 0.8 // Alert if using more than 80% of available memory
    }
    return false
  }
}

// Bundle size analyzer for lazy loading decisions
export const bundleAnalyzer = {
  logComponentSize: (componentName: string, startTime: number) => {
    if (process.env.NODE_ENV === 'development') {
      const loadTime = performance.now() - startTime
      console.log(`📦 ${componentName} loaded in ${loadTime.toFixed(2)}ms`)
    }
  },

  measureLazyLoad: (componentName: string) => {
    const startTime = performance.now()
    return () => bundleAnalyzer.logComponentSize(componentName, startTime)
  }
}

// React performance utilities
export const reactPerformance = {
  // HOC for measuring component render time
  withPerformanceMonitoring: <P extends object>(
    WrappedComponent: React.ComponentType<P>,
    componentName: string
  ) => {
    return React.memo((props: P) => {
      React.useEffect(() => {
        performanceMonitor.startTime(`${componentName}-render`)
        return () => {
          performanceMonitor.endTime(`${componentName}-render`)
        }
      })

      return React.createElement(WrappedComponent, props)
    })
  },

  // Hook for measuring effect performance
  usePerformanceEffect: (effect: React.EffectCallback, deps: React.DependencyList, label: string) => {
    React.useEffect(() => {
      performanceMonitor.startTime(label)
      const cleanup = effect()
      performanceMonitor.endTime(label)
      return cleanup
    }, deps)
  }
}

// Audio processing optimizations
export const audioOptimizations = {
  // Optimize audio context creation
  createOptimizedAudioContext: (): AudioContext | null => {
    if (typeof window === 'undefined') return null
    
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
      const context = new AudioContextClass({
        sampleRate: 44100,
        latencyHint: 'interactive'
      })
      
      // Resume context if suspended (required by some browsers)
      if (context.state === 'suspended') {
        context.resume()
      }
      
      return context
    } catch (error) {
      console.error('Failed to create audio context:', error)
      return null
    }
  },

  // Optimize analyser node settings
  createOptimizedAnalyser: (audioContext: AudioContext) => {
    const analyser = audioContext.createAnalyser()
    analyser.fftSize = 256 // Smaller FFT size for better performance
    analyser.smoothingTimeConstant = 0.8
    analyser.minDecibels = -90
    analyser.maxDecibels = -10
    return analyser
  },

  // Batch audio level updates for better performance
  batchAudioLevelUpdates: (
    analyser: AnalyserNode,
    barCount: number,
    callback: (levels: number[]) => void
  ) => {
    let animationId: number | null = null
    let lastUpdate = 0
    const updateInterval = 33 // ~30fps
    
    const update = (timestamp: number) => {
      if (timestamp - lastUpdate >= updateInterval) {
        const bufferLength = analyser.frequencyBinCount
        const dataArray = new Uint8Array(bufferLength)
        analyser.getByteFrequencyData(dataArray)
        
        const barWidth = Math.floor(bufferLength / barCount)
        const levels = new Array(barCount)
        
        for (let i = 0; i < barCount; i++) {
          let sum = 0
          const startIndex = i * barWidth
          const endIndex = Math.min(startIndex + barWidth, bufferLength)
          
          for (let j = startIndex; j < endIndex; j++) {
            sum += dataArray[j]
          }
          
          levels[i] = Math.min(100, (sum / (endIndex - startIndex)) / 255 * 100)
        }
        
        callback(levels)
        lastUpdate = timestamp
      }
      
      animationId = requestAnimationFrame(update)
    }
    
    animationId = requestAnimationFrame(update)
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
        animationId = null
      }
    }
  }
}

// Export React import for the HOC
import React from 'react'