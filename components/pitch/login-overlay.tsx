'use client'

import { useState } from 'react'
import { LoginOverlayProps } from '@/lib/types/pitch'
import { GoogleLoginButton } from '@/components/auth/google-login-button'
import { useAuth } from '@/hooks/use-auth'

export function LoginOverlay({ onLogin, isVisible }: LoginOverlayProps) {
  const { isAuthenticating } = useAuth()
  const [loginError, setLoginError] = useState<string | null>(null)

  if (!isVisible) return null

  const handleLoginStart = () => {
    setLoginError(null)
    onLogin()
  }

  const handleLoginError = (error: Error) => {
    setLoginError(error.message || 'Login failed. Please try again.')
  }

  return (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
      <div className="text-center space-y-4 p-6">
        <h3 className="text-xl font-medium text-gray-800">
          Login to see full metrics
        </h3>
        <p className="text-gray-600 max-w-sm">
          Sign in to unlock detailed analysis and track your progress over time
        </p>
        
        {loginError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{loginError}</p>
          </div>
        )}
        
        <div className="pt-2">
          <GoogleLoginButton 
            variant="direct"
            onLoginStart={handleLoginStart}
            onLoginError={handleLoginError}
          />
        </div>

        {isAuthenticating && (
          <p className="text-sm text-gray-500">
            Redirecting to Google...
          </p>
        )}
      </div>
    </div>
  )
}