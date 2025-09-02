"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { MicdropLogo } from "@/components/ui/micdrop-logo"
import { CheckCircle, Mic, Users, Target, TrendingUp, ArrowRight, Play } from "lucide-react"
import Link from "next/link"

const onboardingSteps = [
  {
    id: 1,
    title: "Welcome to Micdrop",
    description: "Your AI-powered pitch practice platform",
    content: "WelcomeStep",
  },
  {
    id: 2,
    title: "How It Works",
    description: "Learn the core features",
    content: "FeaturesStep",
  },
  {
    id: 3,
    title: "Choose Your Goal",
    description: "What type of pitch are you preparing?",
    content: "GoalStep",
  },
  {
    id: 4,
    title: "Ready to Start",
    description: "Let's begin your first practice session",
    content: "ReadyStep",
  },
]

const pitchTypes = [
  { id: "investor", title: "Investor Pitch", description: "Raise funding from VCs and angels", icon: TrendingUp },
  { id: "sales", title: "Sales Pitch", description: "Win customers and close deals", icon: Target },
  { id: "demo", title: "Product Demo", description: "Showcase your product features", icon: Play },
  { id: "general", title: "General Presentation", description: "Any other type of pitch", icon: Mic },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null)

  const progress = (currentStep / onboardingSteps.length) * 100

  const nextStep = () => {
    if (currentStep < onboardingSteps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const WelcomeStep = () => (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto">
        <Mic className="w-10 h-10 text-primary" />
      </div>
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-4">Welcome to Micdrop!</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          You're about to transform your pitch skills with AI-powered practice sessions. Let's get you set up in just a
          few quick steps.
        </p>
      </div>
      <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-secondary" />
          <span>Free to start</span>
        </div>
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-secondary" />
          <span>No credit card required</span>
        </div>
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-secondary" />
          <span>Instant feedback</span>
        </div>
      </div>
    </div>
  )

  const FeaturesStep = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">How Micdrop Works</h2>
        <p className="text-lg text-muted-foreground">Four powerful features to help you master your pitch</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="group border-2 border-cyan-400/20 hover:border-cyan-400/40 hover:bg-cyan-500/5 transition-all duration-300 hover:-translate-y-0.5">
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-3">
              <Mic className="w-5 h-5 text-cyan-400" />
              <CardTitle className="text-lg">1. Speech Recognition</CardTitle>
            </div>
            <CardDescription>
              Practice speaking naturally while our AI listens and responds in real-time
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="group border-2 border-emerald-400/20 hover:border-emerald-400/40 hover:bg-emerald-500/5 transition-all duration-300 hover:-translate-y-0.5">
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-emerald-400" />
              <CardTitle className="text-lg">2. Investor Personas</CardTitle>
            </div>
            <CardDescription>
              Choose from different investor types or create custom personas for targeted practice
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="group border-2 border-violet-400/20 hover:border-violet-400/40 hover:bg-violet-500/5 transition-all duration-300 hover:-translate-y-0.5">
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-violet-400" />
              <CardTitle className="text-lg">3. Real-Time Feedback</CardTitle>
            </div>
            <CardDescription>Get instant suggestions on your delivery, content, and presentation style</CardDescription>
          </CardHeader>
        </Card>
        <Card className="group border-2 border-amber-400/20 hover:border-amber-400/40 hover:bg-amber-500/5 transition-all duration-300 hover:-translate-y-0.5">
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              <CardTitle className="text-lg">4. Progress Tracking</CardTitle>
            </div>
            <CardDescription>Monitor your improvement with detailed analytics and performance scores</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )

  // Helper to keep consistent color classes without dynamic tailwind strings
  const getColorClassesForType = (id: string) => {
    switch (id) {
      case "investor":
        return {
          border: "border-emerald-400/20",
          hoverBorder: "hover:border-emerald-400/40",
          hoverBg: "hover:bg-emerald-500/5",
          icon: "text-emerald-400",
        }
      case "sales":
        return {
          border: "border-violet-400/20",
          hoverBorder: "hover:border-violet-400/40",
          hoverBg: "hover:bg-violet-500/5",
          icon: "text-violet-400",
        }
      case "demo":
        return {
          border: "border-amber-400/20",
          hoverBorder: "hover:border-amber-400/40",
          hoverBg: "hover:bg-amber-500/5",
          icon: "text-amber-400",
        }
      case "general":
      default:
        return {
          border: "border-cyan-400/20",
          hoverBorder: "hover:border-cyan-400/40",
          hoverBg: "hover:bg-cyan-500/5",
          icon: "text-cyan-400",
        }
    }
  }

  const GoalStep = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">What's Your Pitch Goal?</h2>
        <p className="text-lg text-muted-foreground">
          Choose the type of pitch you want to practice. You can always change this later.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {pitchTypes.map((type) => {
          const Icon = type.icon
          const color = getColorClassesForType(type.id)
          return (
            <Card
              key={type.id}
              className={`group cursor-pointer transition-all hover:shadow-md ${
                selectedGoal === type.id
                  ? `border-2 border-primary ring-2 ring-primary/40 bg-primary/5`
                  : `border ${color.border} ${color.hoverBorder} ${color.hoverBg}`
              } hover:-translate-y-0.5`}
              onClick={() => setSelectedGoal(type.id)}
            >
              <CardHeader className="space-y-2">
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 ${
                      selectedGoal === type.id ? "text-primary" : color.icon
                    }`}
                  />
                  <CardTitle className="text-lg">{type.title}</CardTitle>
                </div>
                <CardDescription>{type.description}</CardDescription>
              </CardHeader>
            </Card>
          )
        })}
      </div>
      {selectedGoal && (
        <div className="text-center">
          <Badge variant="secondary" className="text-sm">
            Great choice! We'll customize your experience for {pitchTypes.find((t) => t.id === selectedGoal)?.title}
          </Badge>
        </div>
      )}
    </div>
  )

  const ReadyStep = () => (
    <div className="text-center space-y-8">
      <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-10 h-10 text-secondary" />
      </div>
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-4">You're All Set!</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
          Your Micdrop account is ready. Let's start with your first practice session and see how our AI can help
          improve your pitch.
        </p>
        <div className="bg-card rounded-lg p-6 max-w-md mx-auto">
          <h3 className="font-semibold text-card-foreground mb-2">Your Setup:</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Pitch Type:</span>
              <Badge variant="outline">
                {selectedGoal ? pitchTypes.find((t) => t.id === selectedGoal)?.title : "General"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>AI Feedback:</span>
              <Badge variant="outline">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Progress Tracking:</span>
              <Badge variant="outline">Active</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <WelcomeStep />
      case 2:
        return <FeaturesStep />
      case 3:
        return <GoalStep />
      case 4:
        return <ReadyStep />
      default:
        return <WelcomeStep />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <MicdropLogo size="sm" />
          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground">
              Step {currentStep} of {onboardingSteps.length}
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="container mx-auto px-4 py-4">
        <Progress value={progress} className="h-2" />
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-8">
            {onboardingSteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {currentStep > step.id ? <CheckCircle className="w-4 h-4" /> : step.id}
                </div>
                {index < onboardingSteps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-2 ${currentStep > step.id ? "bg-primary" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="mb-12">{renderStepContent()}</div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
              Previous
            </Button>

            <div className="flex items-center space-x-4">
              {currentStep < onboardingSteps.length ? (
                <Button
                  onClick={nextStep}
                  disabled={currentStep === 3 && !selectedGoal}
                  className="flex items-center space-x-2"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button size="lg" className="flex items-center space-x-2" asChild>
                  <Link href="/practice">
                    <span>Start Practicing</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
