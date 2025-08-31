"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { WalletConnector } from "./wallet-connector"
import { PaymentButton } from "./payment-button"
import { PaymentType } from "@/lib/web3-config"
import { ethers } from "ethers"
import { CheckCircle, CreditCard, Zap, Star } from "lucide-react"

export interface PaymentFlowProps {
  onPaymentComplete?: (txHash: string, paymentType: PaymentType) => void
  className?: string
}

export function PaymentFlow({ onPaymentComplete, className }: PaymentFlowProps) {
  const [walletAddress, setWalletAddress] = useState("")
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [selectedPayment, setSelectedPayment] = useState<PaymentType | null>(null)
  const [completedPayments, setCompletedPayments] = useState<string[]>([])

  const handleWalletConnected = (address: string, walletProvider: ethers.BrowserProvider) => {
    setWalletAddress(address)
    setProvider(walletProvider)
  }

  const handleWalletDisconnected = () => {
    setWalletAddress("")
    setProvider(null)
    setSelectedPayment(null)
  }

  const handlePaymentSuccess = async (txHash: string, paymentType: PaymentType) => {
    try {
      // Verify payment with backend
      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          txHash,
          paymentType,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setCompletedPayments(prev => [...prev, txHash])
          onPaymentComplete?.(txHash, paymentType)
        }
      }
    } catch (error) {
      console.error('Error verifying payment:', error)
    }
  }

  const paymentOptions = [
    {
      type: PaymentType.PREMIUM_SESSION,
      title: "Premium AI Session",
      description: "Get advanced AI feedback for one session",
      amount: "0.001",
      originalAmount: undefined as string | undefined,
      features: [
        "Advanced AI analysis",
        "Detailed feedback report",
        "Personalized recommendations",
      ],
      icon: <Zap className="w-6 h-6" />,
      popular: false,
    }
  ]

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Wallet Connection */}
      <WalletConnector
        onWalletConnected={handleWalletConnected}
        onWalletDisconnected={handleWalletDisconnected}
      />

      {/* Payment Options */}
      {walletAddress && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-light text-gray-800 mb-2">Choose Your Plan</h2>
            <p className="text-gray-600">Pay securely with Base ETH</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {paymentOptions.map((option) => (
              <Card
                key={option.type}
                className={`relative bg-white/60 backdrop-blur-sm border-gray-200 cursor-pointer transition-all hover:scale-105 hover:shadow-lg ${
                  option.popular ? "ring-2 ring-orange-400 ring-opacity-50" : ""
                } ${selectedPayment === option.type ? "ring-2 ring-blue-400" : ""}`}
                onClick={() => setSelectedPayment(option.type)}
              >
                {option.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-orange-400 to-rose-400 text-white px-3 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex items-center justify-center text-white">
                      {option.icon}
                    </div>
                  </div>
                  <CardTitle className="text-gray-800">{option.title}</CardTitle>
                  <CardDescription className="text-gray-600">{option.description}</CardDescription>
                  <div className="flex items-center justify-center space-x-2 mt-3">
                    <span className="text-3xl font-light text-gray-800">{option.amount} ETH</span>
                    {option.originalAmount && (
                      <span className="text-lg text-gray-500 line-through">{option.originalAmount} ETH</span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {option.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => setSelectedPayment(option.type)}
                    variant={selectedPayment === option.type ? "default" : "outline"}
                    className={`w-full ${
                      selectedPayment === option.type
                        ? "bg-gray-900 hover:bg-gray-800 text-white"
                        : "bg-white hover:bg-gray-50 border-gray-300 text-gray-700"
                    }`}
                  >
                    {selectedPayment === option.type ? "Selected" : "Select Plan"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Payment Button */}
      {selectedPayment && walletAddress && (
        <PaymentButton
          paymentType={selectedPayment}
          provider={provider}
          walletAddress={walletAddress}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={(error) => console.error("Payment error:", error)}
        />
      )}

      {/* Completed Payments */}
      {completedPayments.length > 0 && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-800">
              <CheckCircle className="w-5 h-5" />
              <span>Payment Successful</span>
            </CardTitle>
            <CardDescription className="text-green-700">
              Your payment has been confirmed on the Base network
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-green-700">
              You can now access premium features. Transaction hashes:
            </p>
            <ul className="mt-2 space-y-1">
              {completedPayments.map((txHash) => (
                <li key={txHash} className="text-xs font-mono text-green-600">
                  {txHash}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}