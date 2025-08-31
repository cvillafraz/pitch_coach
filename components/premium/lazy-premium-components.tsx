'use client'

import { lazy } from 'react'

// Lazy load premium-related components for code splitting
export const LazyUsageLimitModal = lazy(() => 
  import('../ui/usage-limit-modal').then(module => ({ default: module.UsageLimitModal }))
)

// Loading fallback component for premium components
export function PremiumLoadingFallback() {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 flex items-center gap-3">
        <div className="w-6 h-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
        <span className="text-gray-700">Loading...</span>
      </div>
    </div>
  )
}