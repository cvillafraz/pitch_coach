import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, Target, TrendingUp, Users } from "lucide-react"
import Link from "next/link"

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Mic className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">PitchCoach</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Master Your Pitch with <span className="text-primary">AI-Powered</span> Practice
          </h2>
          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            Practice and refine your pitches through AI-driven simulations. Get real-time feedback, track your progress,
            and boost your confidence with personalized coaching.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="/practice">Start Practicing</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent" asChild>
              <Link href="/demo">Watch Demo</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Mic className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Speech Recognition</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Practice with realistic speech recognition that responds to your pitch in real-time
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-secondary" />
              </div>
              <CardTitle className="text-lg">Investor Personas</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Choose from VC investors, corporate customers, or create custom personas for targeted practice
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Real-Time Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get instant, actionable suggestions to improve your pitch delivery and content
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-secondary" />
              </div>
              <CardTitle className="text-lg">Performance Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Track your improvement over time with detailed analytics and scoring</CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Problem Statement */}
        <div className="bg-card rounded-lg p-8 mb-16 text-center">
          <h3 className="text-2xl font-bold text-card-foreground mb-4">
            70% of pitches fail due to poor presentation skills
          </h3>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Many startup founders struggle to effectively communicate their value propositions to investors, leading to
            missed funding opportunities. PitchCoach provides the practice environment you need to succeed.
          </p>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h3 className="text-3xl font-bold text-foreground mb-4">Ready to transform your pitch?</h3>
          <p className="text-muted-foreground mb-8 text-lg">
            Join startup founders who are already improving their pitch skills with AI-powered coaching.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-12" asChild>
              <Link href="/onboarding">Start Your Free Practice</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent" asChild>
              <Link href="/demo">Watch Demo</Link>
            </Button>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t bg-muted/50 mt-16">
          <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
            <p>&copy; 2024 PitchCoach. Empowering founders to pitch with confidence.</p>
          </div>
        </footer>
      </main>
    </div>
  )
}
