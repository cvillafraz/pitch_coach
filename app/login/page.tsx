import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MicdropLogo } from "@/components/ui/micdrop-logo"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <MicdropLogo size="lg" showText={true} href="/" variant="white" />
        </div>

        <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-800">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">Welcome back</CardTitle>
            <CardDescription>Sign in to continue practicing your pitch</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" required className="bg-gray-800 border-gray-700 text-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input id="password" type="password" placeholder="Enter your password" required className="bg-gray-800 border-gray-700 text-white" />
            </div>
            <Button className="w-full" size="lg">
              Sign In
            </Button>
            <div className="text-center text-sm text-gray-400">
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}