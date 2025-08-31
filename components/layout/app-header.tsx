"use client"

import Link from "next/link"
import { HeaderNav } from "@/components/auth/header-nav"
import { MicdropLogo } from "@/components/ui/micdrop-logo"

interface AppHeaderProps {
  showBackButton?: boolean
  backHref?: string
  backText?: string
  title?: string
}

export function AppHeader({ 
  showBackButton = false, 
  backHref = "/dashboard", 
  backText = "Dashboard",
  title = "Micdrop" 
}: AppHeaderProps) {
  return (
    <header className="bg-white/60 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <MicdropLogo showText={true} />

          {/* Navigation */}
          <div className="flex items-center space-x-3">
            <HeaderNav />
          </div>
        </div>
      </div>
    </header>
  )
}