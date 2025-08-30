"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SignUpPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to login since we only use Google OAuth now
    router.push("/auth/login")
  }, [router])

  return null
}
