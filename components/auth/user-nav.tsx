"use client"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GoogleLoginButton } from "@/components/auth/google-login-button"
import { LogOut, User, Settings, ChevronDown } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"

export function UserNav() {
    const { user, loading, signOut } = useAuth()

    if (loading) {
        return (
            <div className="flex items-center gap-3">
                <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
            </div>
        )
    }

    if (!user) {
        return <GoogleLoginButton />
    }

    // Extract name from email (remove @gmail.com part)
    const displayName = user.email?.split('@')[0] || user.user_metadata?.name || 'User'
    const avatarUrl = user.user_metadata?.avatar_url
    const initials = displayName.slice(0, 2).toUpperCase()

    return (
        <div className="flex items-center gap-3">
            {/* Username */}
            <span className="text-gray-800 font-medium">{displayName}</span>
            
            {/* Navigation icons - removed since we're using single-page architecture */}
            
            <Button variant="ghost" size="icon" className="hover:bg-white/50" onClick={signOut}>
                <LogOut className="h-4 w-4 text-gray-600" />
            </Button>
            
            {/* Avatar with dropdown for additional options */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-auto px-2 py-1 rounded-full hover:bg-white/50 transition-colors">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={avatarUrl} alt={displayName} />
                            <AvatarFallback className="bg-gradient-to-br from-rose-400 to-orange-400 text-white text-xs">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{displayName}</p>
                            <p className="text-xs leading-none text-muted-foreground">
                                {user.email}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}