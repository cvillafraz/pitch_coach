"use client"

import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface MicdropLogoProps {
  className?: string
  size?: "sm" | "md" | "lg" | "xl" | "xxl"
  href?: string
  variant?: "default" | "white"
}

export function MicdropLogo({ 
  className, 
  size = "md", 
  href = "/",
  variant = "default"
}: MicdropLogoProps) {
  const sizeClasses = {
    sm: "w-20 h-10",
    md: "w-24 h-12", 
    lg: "w-28 h-14",
    xl: "w-32 h-16",
    xxl: "w-40 h-20"
  }

  const logoSrc = variant === "white" ? "/Micdrop-white-logo.png" : "/Micdrop-Logo.png"

  const LogoContent = () => (
    <div className={cn("flex items-center justify-center hover:opacity-80 transition-opacity", className)}>
      {/* Micdrop logo PNG - alterna entre normal y blanco */}
      <div className={cn("flex items-center justify-center", sizeClasses[size])}>
        <Image 
          src={logoSrc}
          alt="Micdrop Logo" 
          width={size === "sm" ? 80 : size === "md" ? 96 : size === "lg" ? 112 : size === "xl" ? 128 : 160}
          height={size === "sm" ? 40 : size === "md" ? 48 : size === "lg" ? 56 : size === "xl" ? 64 : 80}
          className="object-contain"
        />
      </div>
    </div>
  )

  if (href) {
    return (
      <Link href={href}>
        <LogoContent />
      </Link>
    )
  }

  return <LogoContent />
}