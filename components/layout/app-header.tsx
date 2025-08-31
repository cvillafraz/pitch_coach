"use client"

import { Mic } from "lucide-react"
import Link from "next/link"
import { HeaderNav } from "@/components/auth/header-nav"

interface AppHeaderProps {
  showBackButton?: boolean
  backHref?: string
  backText?: string
  title?: string
}

export function AppHeader({ 
  showBackButton = false, 
  backHref = "/", 
  backText = "Home",
  title = "PitchCoach" 
}: AppHeaderProps) {
  return (
    <header className="bg-white/60 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-orange-400 rounded-lg flex items-center justify-center shadow-sm">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-light text-gray-800">{title}</h1>
          </Link>

          {/* Navigation */}
          <div className="flex items-center space-x-3">
            <HeaderNav />
          </div>
        </div>
      </div>
    </header>
  )
}