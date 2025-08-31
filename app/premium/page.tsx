"use client"

import * as React from "react"
import { Crown, Check, ArrowLeft, Zap, BarChart3, Download, Headphones } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

const premiumFeatures = [
  {
    icon: Zap,
    title: "Unlimited Practice Sessions",
    description: "Practice as much as you want without any restrictions"
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Detailed insights into your pitch performance and progress over time"
  },
  {
    icon: Download,
    title: "Export Recordings",
    description: "Download your pitch recordings and share them with your team"
  },
  {
    icon: Headphones,
    title: "Priority Support",
    description: "Get help when you need it with our dedicated support team"
  }
]

const pricingPlans = [
  {
    name: "Monthly",
    price: "$9.99",
    period: "per month",
    description: "Perfect for getting started",
    popular: false
  },
  {
    name: "Annual",
    price: "$99.99",
    period: "per year",
    description: "Save 17% with annual billing",
    popular: true,
    savings: "Save $20"
  }
]

export default function PremiumPage() {
  const handleUpgrade = (plan: string) => {
    // TODO: Integrate with payment processor (Stripe, etc.)
    console.log(`Upgrading to ${plan} plan`)
    // For now, just show an alert
    alert(`Upgrade to ${plan} plan - Payment integration coming soon!`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Practice
            </Button>
          </Link>
          <div className="flex items-center space-x-2">
            <Crown className="h-6 w-6 text-rose-500" />
            <span className="text-lg font-semibold text-gray-900">PitchCoach Premium</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Unlock Your Full Potential
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Take your pitch skills to the next level with unlimited practice, 
            advanced analytics, and premium features designed for serious professionals.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {premiumFeatures.map((feature, index) => (
            <Card key={index} className="p-6 text-center border-0 shadow-lg bg-white/60 backdrop-blur-sm">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-rose-100 to-orange-100">
                <feature.icon className="h-6 w-6 text-rose-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </Card>
          ))}
        </div>

        {/* Pricing Cards */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Choose Your Plan
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`p-8 relative border-0 shadow-lg ${
                  plan.popular 
                    ? 'bg-gradient-to-br from-rose-500 to-orange-500 text-white' 
                    : 'bg-white/60 backdrop-blur-sm'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center">
                  <h3 className={`text-xl font-semibold mb-2 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                    {plan.name}
                  </h3>
                  <div className="mb-4">
                    <span className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                      {plan.price}
                    </span>
                    <span className={`text-sm ${plan.popular ? 'text-rose-100' : 'text-gray-600'}`}>
                      {plan.period}
                    </span>
                  </div>
                  <p className={`text-sm mb-6 ${plan.popular ? 'text-rose-100' : 'text-gray-600'}`}>
                    {plan.description}
                  </p>
                  
                  {plan.savings && (
                    <div className="mb-4">
                      <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-semibold">
                        {plan.savings}
                      </span>
                    </div>
                  )}
                  
                  <Button 
                    onClick={() => handleUpgrade(plan.name)}
                    variant={plan.popular ? "secondary" : "default"}
                    size="lg"
                    className="w-full"
                  >
                    <Crown className="mr-2 h-4 w-4" />
                    Choose {plan.name}
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Feature Comparison */}
          <Card className="p-8 bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
              What's Included in Premium
            </h3>
            <div className="grid gap-3">
              {[
                "Unlimited pitch practice sessions",
                "Advanced AI feedback and insights",
                "Detailed performance analytics",
                "Progress tracking over time",
                "Export your pitch recordings",
                "Priority customer support",
                "Early access to new features",
                "Custom pitch templates"
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Money Back Guarantee */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-600">
              30-day money-back guarantee • Cancel anytime • No hidden fees
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}