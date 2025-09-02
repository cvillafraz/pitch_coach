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
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
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
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
              <Mic className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-xl">1. Speech Recognition</CardTitle>
            <CardDescription>
              Practice speaking naturally while our AI listens and responds in real-time
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="border-2 border-secondary/20">
          <CardHeader>
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-2">
              <Users className="w-6 h-6 text-secondary" />
            </div>
            <CardTitle className="text-xl">2. Investor Personas</CardTitle>
            <CardDescription>
              Choose from different investor types or create custom personas for targeted practice
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-xl">3. Real-Time Feedback</CardTitle>
            <CardDescription>Get instant suggestions on your delivery, content, and presentation style</CardDescription>
          </CardHeader>
        </Card>
        <Card className="border-2 border-secondary/20">
          <CardHeader>
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-2">
              <TrendingUp className="w-6 h-6 text-secondary" />
            </div>
            <CardTitle className="text-xl">4. Progress Tracking</CardTitle>
            <CardDescription>Monitor your improvement with detailed analytics and performance scores</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )

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
          return (
            <Card
              key={type.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedGoal === type.id ? "border-2 border-primary bg-primary/5" : "border hover:border-primary/50"
              }`}
              onClick={() => setSelectedGoal(type.id)}
            >
              <CardHeader className="text-center">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2 ${
                    selectedGoal === type.id ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl">{type.title}</CardTitle>
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
      <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
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
