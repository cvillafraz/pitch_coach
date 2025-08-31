'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { X, LogIn } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface LoginOverlayProps {
  isVisible: boolean
  onLogin: () => void
  onClose: () => void
}

export function LoginOverlay({ isVisible, onLogin, onClose }: LoginOverlayProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    setIsLoading(true)
    try {
      await onLogin()
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isVisible} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-rose-100 to-orange-100">
            <LogIn className="h-6 w-6 text-rose-500" />
          </div>
          
          <DialogTitle className="text-xl font-semibold">
            Sign in to continue
          </DialogTitle>
          
          <DialogDescription className="text-base text-gray-600">
            Sign in with Google to access detailed pitch analysis and save your progress.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Button 
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            <LogIn className="mr-2 h-4 w-4" />
            {isLoading ? 'Signing in...' : 'Sign in with Google'}
          </Button>
          
          <div className="text-center">
            <p className="text-xs text-gray-500">
              We'll redirect you to Google to sign in securely
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}