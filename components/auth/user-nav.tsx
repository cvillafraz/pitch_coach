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
import { LogOut, User, Settings, ChevronDown, Menu } from "lucide-react"
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
            {/* Desktop: username + acciones visibles */}
            <div className="hidden sm:flex items-center gap-3">
                <span className="text-white font-bold text-lg">{displayName}</span>
                <Button variant="ghost" size="icon" className="hover:bg-white/50" asChild>
                    <Link href="/dashboard">
                        <User className="h-5 w-5 text-blue-400" />
                    </Link>
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-white/50" asChild>
                    <Link href="/performance">
                        <Settings className="h-5 w-5 text-yellow-400" />
                    </Link>
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-white/50" onClick={signOut}>
                    <LogOut className="h-5 w-5 text-red-400" />
                </Button>
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
                                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                            </div>
                        </DropdownMenuLabel>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Mobile: menú hamburguesa */}
            <div className="sm:hidden">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="hover:bg-white/50">
                            <Menu className="h-5 w-5 text-white" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={avatarUrl} alt={displayName} />
                                    <AvatarFallback className="bg-gradient-to-br from-rose-400 to-orange-400 text-white text-xs">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <p className="text-sm font-medium leading-none">{displayName}</p>
                                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard" className="flex items-center gap-2">
                                <User className="h-4 w-4 text-blue-400" /> Dashboard
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/performance" className="flex items-center gap-2">
                                <Settings className="h-4 w-4 text-yellow-400" /> Performance
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={signOut} className="text-red-500">
                            <LogOut className="mr-2 h-4 w-4" /> Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}