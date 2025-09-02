import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <Card className="w-full max-w-md border-0 shadow-lg bg-gray-900/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-900/40 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-6 h-6 text-green-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Check Your Email</CardTitle>
          <CardDescription className="text-gray-400">We've sent you a confirmation link</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-gray-400 mb-4">
            Please check your email and click the confirmation link to activate your Micdrop account.
          </p>
          <p className="text-xs text-gray-500">
            Didn't receive the email? Check your spam folder or try signing up again.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}