import { Button } from "@/components/ui/button"
import { TestimonialSlider } from "@/components/ui/testimonial-slider"
import { HeaderNav } from "@/components/auth/header-nav"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import { MicdropLogo } from "@/components/ui/micdrop-logo"
import { Mic, Target, TrendingUp } from "lucide-react"
import Link from "next/link"

const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Founder",
    company: "TechFlow",
    content: "Micdrop helped me secure $2M in Series A funding. The AI feedback was incredibly precise and actionable.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    role: "CEO",
    company: "GreenTech Solutions",
    content: "The investor persona feature is game-changing. I practiced with different types of VCs and felt prepared for every meeting.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "Emily Watson",
    role: "Co-founder",
    company: "DataViz Pro",
    content: "My pitch confidence improved dramatically after just a week of practice. The real-time feedback is spot on.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 4,
    name: "David Kim",
    role: "Founder",
    company: "InnovateLab",
    content: "The AI simulations are incredibly realistic. I felt like I was actually pitching to real investors.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 5,
    name: "Lisa Thompson",
    role: "CEO",
    company: "EcoSmart",
    content: "Micdrop transformed my presentation skills. I went from nervous to confident in just two weeks.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
  }
]

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-black/60 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <MicdropLogo size="xxl" variant="white" />
          <div className="flex items-center space-x-3">
            <HeaderNav />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto mb-12 py-20">
          <h1 className="text-6xl md:text-8xl font-light text-white mb-6 leading-tight">
            Make your pitch{" "}
            <span className="italic bg-gradient-to-r from-rose-400 to-orange-400 bg-clip-text text-transparent">
              shine.
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-16 max-w-2xl mx-auto leading-relaxed">
            Turn ideas into a calm, confident pitch that gets money.
          </p>
          
          <div className="flex justify-center">
            <Link href="/onboarding">
              <InteractiveHoverButton 
                text="Improve my pitch"
                className="text-lg font-light"
              />
            </Link>
          </div>
        </div>

        {/* Secondary Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-24 py-16">
          <h2 className="text-4xl md:text-6xl font-light text-white mb-6 leading-tight">
            Good pitches get{" "}
            <span className="italic font-medium text-gray-100">
              money
            </span>
          </h2>
          
          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
            Real examples of confident, compelling pitches
          </p>
        </div>

        {/* Features Section */}
        <div id="features" className="grid md:grid-cols-3 gap-8 mb-24">
          <div className="text-center p-8 bg-gray-900/40 backdrop-blur-sm rounded-lg border border-gray-800">
            <Mic className="w-8 h-8 text-rose-500 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-4">Smart Recognition</h3>
            <p className="text-gray-400 leading-relaxed">
              Advanced speech recognition that understands your pitch and responds naturally
            </p>
          </div>

          <div className="text-center p-8 bg-gray-900/40 backdrop-blur-sm rounded-lg border border-gray-800">
            <Target className="w-8 h-8 text-orange-500 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-4">Instant Feedback</h3>
            <p className="text-gray-400 leading-relaxed">
              Get actionable insights to improve your delivery, content, and overall impact
            </p>
          </div>

          <div className="text-center p-8 bg-gray-900/40 backdrop-blur-sm rounded-lg border border-gray-800">
            <TrendingUp className="w-8 h-8 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-4">Track Progress</h3>
            <p className="text-gray-400 leading-relaxed">
              Monitor your improvement with detailed analytics and performance metrics
            </p>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-light text-white mb-4">
              Trusted by founders
            </h3>
            <p className="text-gray-400 text-lg">
              See how Micdrop helped secure millions in funding
            </p>
          </div>
          <TestimonialSlider testimonials={testimonials} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-black/40 backdrop-blur-sm mt-24">
        <div className="container mx-auto px-6 py-8 text-center text-gray-500">
          <p>&copy; 2025 Micdrop. Empowering founders to pitch with confidence.</p>
        </div>
      </footer>
    </div>
  )
}