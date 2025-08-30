"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-orange-50 to-yellow-50 p-4">
      <Card className="w-full max-w-md border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-light text-gray-800">Authentication Error</CardTitle>
          <CardDescription className="text-gray-600 text-base">
            There was a problem signing you in. This could be due to:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
            <li>The authentication code has expired</li>
            <li>The authentication process was interrupted</li>
            <li>There was a temporary server issue</li>
          </ul>
          
          <div className="space-y-3">
            <Button 
              className="w-full bg-gradient-to-r from-rose-400 to-orange-400 hover:from-rose-500 hover:to-orange-500 text-white border-0 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
              asChild
            >
              <Link href="/auth/login">Try Again</Link>
            </Button>
            
            <Button 
              variant="outline"
              className="w-full bg-transparent"
              asChild
            >
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}