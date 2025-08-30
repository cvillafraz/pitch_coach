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
import { LogOut, User, Settings } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"

export function UserNav() {
    const { user, loading, signOut } = useAuth()

    if (loading) {
        return (
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
        )
    }

    if (!user) {
        return (
            <Button
                className="bg-gradient-to-r from-rose-400 via-orange-400 to-yellow-400 hover:from-rose-500 hover:via-orange-500 hover:to-yellow-500 text-white border-0 rounded-full shadow-sm hover:shadow-md transition-all duration-200 font-medium"
                asChild
            >
                <Link href="/auth/login">Login with Google</Link>
            </Button>
        )
    }

    // Extract name from email (remove @gmail.com part)
    const displayName = user.email?.split('@')[0] || user.user_metadata?.name || 'User'
    const avatarUrl = user.user_metadata?.avatar_url
    const initials = displayName.slice(0, 2).toUpperCase()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
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
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/performance" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Performance</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}