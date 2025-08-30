"use client"

import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/auth/user-nav"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"

export function HeaderNav() {
  return <UserNav />
}