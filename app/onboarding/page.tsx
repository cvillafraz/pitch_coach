"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function OnboardingPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to main interface
    router.replace("/")
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-orange-50 to-yellow-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecting to main interface...</p>
      </div>
    </div>
  )
}