import { Button } from "@/components/ui/button"
import { TestimonialSlider } from "@/components/ui/testimonial-slider"
import { HeaderNav } from "@/components/auth/header-nav"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import { Mic, Target, TrendingUp } from "lucide-react"
import Link from "next/link"

const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Founder",
    company: "TechFlow",
    content: "PitchCoach helped me secure $2M in Series A funding. The AI feedback was incredibly precise and actionable.",
    avatar: "/placeholder-user.jpg"
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    role: "CEO",
    company: "GreenTech Solutions",
    content: "The investor persona feature is game-changing. I practiced with different types of VCs and felt prepared for every meeting.",
    avatar: "/placeholder-user.jpg"
  },
  {
    id: 3,
    name: "Emily Watson",
    role: "Co-founder",
    company: "DataViz Pro",
    content: "My pitch confidence improved dramatically after just a week of practice. The real-time feedback is spot on.",
    avatar: "/placeholder-user.jpg"
  }
]

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white/60 backdrop-blur-sm border-b border-gray-100">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-orange-400 rounded-lg flex items-center justify-center shadow-sm">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-light text-gray-800">PitchCoach</h1>
          </Link>
          <div className="flex items-center space-x-3">
            <HeaderNav />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto mb-32 py-20">
          <h1 className="text-6xl md:text-8xl font-light text-gray-800 mb-6 leading-tight">
            Make your pitch{" "}
            <span className="italic bg-gradient-to-r from-rose-400 to-orange-400 bg-clip-text text-transparent">
              shine.
            </span>
          </h1>
          
          <p className="text-xl text-gray-500 mb-16 max-w-2xl mx-auto leading-relaxed">
            Turn ideas into a calm, confident pitch that gets money.
          </p>
          
          <div className="flex justify-center">
            <Link href="/ai-voice">
              <InteractiveHoverButton 
                text="Improve my pitch"
                className="text-lg font-light"
              />
            </Link>
          </div>
        </div>

        {/* Secondary Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-24 py-16">
          <h2 className="text-4xl md:text-6xl font-light text-gray-800 mb-6 leading-tight">
            Good pitches get{" "}
            <span className="italic font-medium text-gray-900">
              money
            </span>
          </h2>
          
          <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
            Real examples of confident, compelling pitches
          </p>
        </div>

        {/* Features Section */}
        <div id="features" className="grid md:grid-cols-3 gap-8 mb-24">
          <div className="text-center p-8 bg-white/40 backdrop-blur-sm rounded-lg border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-br from-rose-100 to-orange-100 rounded-lg flex items-center justify-center mx-auto mb-6">
              <Mic className="w-8 h-8 text-rose-500" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-4">Smart Recognition</h3>
            <p className="text-gray-600 leading-relaxed">
              Advanced speech recognition that understands your pitch and responds naturally
            </p>
          </div>

          <div className="text-center p-8 bg-white/40 backdrop-blur-sm rounded-lg border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-6">
              <Target className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-4">Instant Feedback</h3>
            <p className="text-gray-600 leading-relaxed">
              Get actionable insights to improve your delivery, content, and overall impact
            </p>
          </div>

          <div className="text-center p-8 bg-white/40 backdrop-blur-sm rounded-lg border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-rose-100 rounded-lg flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-8 h-8 text-yellow-500" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-4">Track Progress</h3>
            <p className="text-gray-600 leading-relaxed">
              Monitor your improvement with detailed analytics and performance metrics
            </p>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-light text-gray-800 mb-4">
              Trusted by founders
            </h3>
            <p className="text-gray-600 text-lg">
              See how PitchCoach helped secure millions in funding
            </p>
          </div>
          <TestimonialSlider testimonials={testimonials} />
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white/40 backdrop-blur-sm rounded-lg p-16 border border-gray-100">
          <h3 className="text-4xl font-light text-gray-800 mb-6">
            Ready to nail your next pitch?
          </h3>
          <p className="text-gray-600 mb-10 text-lg max-w-2xl mx-auto">
            Join hundreds of founders who've improved their pitch skills and secured funding with AI-powered practice.
          </p>
          <Button 
            variant="outline"
            size="lg" 
            className="text-base bg-white/80 hover:bg-white border-gray-200 text-gray-800 hover:text-gray-900 shadow-sm hover:shadow-md transition-all duration-200"
            asChild
          >
            <Link href="/auth/login">Start Free Practice</Link>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white/40 backdrop-blur-sm mt-24">
        <div className="container mx-auto px-6 py-8 text-center text-gray-500">
          <p>&copy; 2025 PitchCoach. Empowering founders to pitch with confidence.</p>
        </div>
      </footer>
    </div>
  )
}
