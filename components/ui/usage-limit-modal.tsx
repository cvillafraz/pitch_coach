"use client"

import * as React from "react"
import { Crown, Zap, Check, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface UsageLimitModalProps {
  isOpen: boolean
  remainingAttempts: number
  onClose: () => void
  onUpgrade: () => void
  variant?: 'welcome' | 'limit-reached'
}

const premiumFeatures = [
  "Unlimited pitch practice sessions",
  "Advanced AI feedback and insights",
  "Detailed performance analytics",
  "Progress tracking over time",
  "Export your pitch recordings",
  "Priority customer support"
]

export function UsageLimitModal({ 
  isOpen, 
  remainingAttempts, 
  onClose, 
  onUpgrade,
  variant = 'welcome'
}: UsageLimitModalProps) {
  const isWelcome = variant === 'welcome'
  const isLimitReached = variant === 'limit-reached'

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-rose-100 to-orange-100">
            {isWelcome ? (
              <Zap className="h-6 w-6 text-rose-500" />
            ) : (
              <Crown className="h-6 w-6 text-rose-500" />
            )}
          </div>
          
          <DialogTitle className="text-xl font-semibold">
            {isWelcome ? "Welcome to PitchCoach!" : "You've reached your limit"}
          </DialogTitle>
          
          <DialogDescription className="text-base text-gray-600">
            {isWelcome ? (
              <>
                You have <span className="font-semibold text-rose-600">{remainingAttempts} free attempts</span> to practice your pitch and get AI-powered feedback.
              </>
            ) : (
              "You've used all your free attempts. Upgrade to Premium to continue practicing and improving your pitch skills."
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Attempt Counter for Welcome */}
          {isWelcome && (
            <div className="rounded-lg bg-gradient-to-r from-rose-50 to-orange-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Free attempts remaining</span>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-2 w-2 rounded-full",
                        i < remainingAttempts 
                          ? "bg-gradient-to-r from-rose-400 to-orange-400" 
                          : "bg-gray-200"
                      )}
                    />
                  ))}
                  <span className="ml-2 text-sm font-semibold text-gray-700">
                    {remainingAttempts}/3
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Premium Features */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">
              {isWelcome ? "Upgrade to Premium for:" : "Premium includes:"}
            </h4>
            <div className="grid gap-2">
              {premiumFeatures.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-2 pt-4">
            <Button 
              onClick={onUpgrade}
              className="w-full"
              size="lg"
            >
              <Crown className="mr-2 h-4 w-4" />
              Upgrade to Premium
            </Button>
            
            {isWelcome && (
              <Button 
                variant="outline" 
                onClick={onClose}
                className="w-full"
              >
                Start with free attempts
              </Button>
            )}
            
            {isLimitReached && (
              <Button 
                variant="ghost" 
                onClick={onClose}
                className="w-full text-gray-500"
              >
                Maybe later
              </Button>
            )}
          </div>

          {/* Pricing hint */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Starting at $9.99/month • Cancel anytime
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}