"use client"

import { useState, useEffect } from "react"
import { PaymentFlow } from "@/components/payments/payment-flow"
import { PaymentType } from "@/lib/web3-config"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/auth/user-nav"
import { MicdropLogo } from "@/components/ui/micdrop-logo"
import { ArrowLeft, Mic, CreditCard, Shield, Zap } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export default function PaymentsPage() {
  const [user, setUser] = useState<any>(null)
  const [paymentHistory, setPaymentHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      const supabase = createClient()
      
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        setUser(authUser)

        if (authUser) {
          // Fetch payment history
          const { data: payments } = await supabase
            .from('payments')
            .select('*')
            .eq('user_id', authUser.id)
            .order('created_at', { ascending: false })
            .limit(10)

          setPaymentHistory(payments || [])
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handlePaymentComplete = (txHash: string, paymentType: PaymentType) => {
    console.log('Payment completed:', { txHash, paymentType })
    // Optionally refresh payment history or redirect
    window.location.reload()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Mic className="w-8 h-8 mx-auto mb-4 text-gray-400 animate-pulse" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-black/60 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard" className="flex items-center space-x-2 text-gray-400 hover:text-white">
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Link>
            </Button>
            
            <MicdropLogo showText={true} variant="white" />
          </div>
          
          <UserNav />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-light text-white mb-4">Premium Plans</h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Unlock advanced AI coaching features with secure Base blockchain payments. 
            Get detailed feedback, personalized recommendations, and priority support.
          </p>
        </div>

        {/* Features Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gray-900/40 backdrop-blur-sm border-gray-800 text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white">Secure Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm">
                Pay directly with Base ETH. No intermediaries, no credit cards required. 
                Your wallet, your control.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/40 backdrop-blur-sm border-gray-800 text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white">Instant Access</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm">
                Premium features unlock immediately after payment confirmation. 
                Start practicing with advanced AI right away.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/40 backdrop-blur-sm border-gray-800 text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white">Low Fees</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm">
                Base network offers low transaction fees and fast confirmation times. 
                More value for your money.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Payment Flow */}
        <PaymentFlow onPaymentComplete={handlePaymentComplete} />

        {/* Payment History */}
        {paymentHistory.length > 0 && (
          <div className="mt-12">
            <Card className="bg-gray-900/40 backdrop-blur-sm border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Payment History</CardTitle>
                <CardDescription>Your recent transactions on Base network</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {paymentHistory.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-800/40 rounded-lg border border-gray-700">
                      <div>
                        <p className="font-medium text-white capitalize">
                          {payment.payment_type.replace('_', ' ')}
                        </p>
                        <p className="text-sm text-gray-400">
                          {new Date(payment.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-white">{payment.amount} ETH</p>
                        <p className={`text-sm capitalize ${
                          payment.status === 'confirmed' ? 'text-green-400' : 
                          payment.status === 'failed' ? 'text-red-400' : 'text-yellow-400'
                        }`}>
                          {payment.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

      </main>
    </div>
  )
}
