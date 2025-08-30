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
            There was a problem signing you in. Please try again.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            asChild
            className="w-full h-12 bg-gradient-to-r from-rose-400 to-orange-400 hover:from-rose-500 hover:to-orange-500 text-white border-0 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
          >
            <Link href="/auth/login">Try Again</Link>
          </Button>
          
          <Button 
            variant="outline"
            asChild
            className="w-full h-12 bg-white/60 hover:bg-white/80 border-gray-200 text-gray-700 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
          >
            <Link href="/">Back to Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}