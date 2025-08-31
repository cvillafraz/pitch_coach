'use client'

import { lazy } from 'react'

// Lazy load authentication components for code splitting
export const LazyGoogleLoginButton = lazy(() => 
  import('./google-login-button').then(module => ({ default: module.GoogleLoginButton }))
)

export const LazyUserNav = lazy(() => 
  import('./user-nav').then(module => ({ default: module.UserNav }))
)

export const LazyLogoutButton = lazy(() => 
  import('./logout-button').then(module => ({ default: module.LogoutButton }))
)

// Loading fallback component for auth components
export function AuthLoadingFallback() {
  return (
    <div className="flex items-center justify-center p-2">
      <div className="w-6 h-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
    </div>
  )
}