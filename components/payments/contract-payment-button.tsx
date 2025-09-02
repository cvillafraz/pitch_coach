"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, CreditCard, CheckCircle, AlertCircle } from "lucide-react"
import { ethers } from "ethers"
import { PaymentType, getPaymentDetails, CONTRACT_CONFIG, CURRENT_NETWORK } from "@/lib/web3-config"

export interface ContractPaymentButtonProps {
  paymentType: PaymentType
  provider: ethers.BrowserProvider | null
  walletAddress: string
  onPaymentSuccess?: (txHash: string, paymentType: PaymentType) => void
  onPaymentError?: (error: string) => void
  disabled?: boolean
  className?: string
}

export function ContractPaymentButton({
  paymentType,
  provider,
  walletAddress,
  onPaymentSuccess,
  onPaymentError,
  disabled,
  className,
}: ContractPaymentButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [txHash, setTxHash] = useState("")
  const [error, setError] = useState("")

  const paymentDetails = getPaymentDetails(paymentType)

  const handleContractPayment = async () => {
    if (!provider || !walletAddress) {
      const errorMsg = "Please connect your wallet first"
      setError(errorMsg)
      onPaymentError?.(errorMsg)
      return
    }

    setIsProcessing(true)
    setError("")
    setTxHash("")

    try {
      // Get signer from provider
      const signer = await provider.getSigner()

      // Check network
      const network = await provider.getNetwork()
      if (Number(network.chainId) !== CURRENT_NETWORK.chainId) {
        throw new Error(`Please switch to ${CURRENT_NETWORK.name} network`)
      }

      // Create contract instance
      const contract = new ethers.Contract(
        CONTRACT_CONFIG.CONTRACT_ADDRESS,
        CONTRACT_CONFIG.ABI,
        signer
      )

      // Check balance
      const balance = await provider.getBalance(walletAddress)
      const paymentAmount = ethers.parseEther(paymentDetails.amount)
      
      if (balance < paymentAmount) {
        throw new Error(`Insufficient balance. Need ${paymentDetails.amount} ETH`)
      }

      // Call appropriate contract function
      let tx;
      switch (paymentType) {
        case PaymentType.PREMIUM_SESSION:
          tx = await contract.purchasePremiumSession({ value: paymentAmount })
          break
        case PaymentType.MONTHLY_SUBSCRIPTION:
          tx = await contract.purchaseMonthlySubscription({ value: paymentAmount })
          break
        case PaymentType.YEARLY_SUBSCRIPTION:
          tx = await contract.purchaseYearlySubscription({ value: paymentAmount })
          break
        default:
          throw new Error("Invalid payment type")
      }

      setTxHash(tx.hash)

      // Wait for transaction confirmation
      const receipt = await tx.wait()
      
      if (receipt?.status === 1) {
        onPaymentSuccess?.(tx.hash, paymentType)
      } else {
        throw new Error("Transaction failed")
      }
    } catch (error: any) {
      const errorMessage = error.message || "Payment failed"
      setError(errorMessage)
      onPaymentError?.(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  const getExplorerUrl = (hash: string) => {
    return `${CURRENT_NETWORK.blockExplorer}/tx/${hash}`
  }

  return (
    <Card className="bg-gray-900/40 backdrop-blur-sm border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <span>{paymentDetails.description}</span>
          <Badge variant="outline" className="bg-gray-800 text-gray-300 border-gray-700">
            {paymentDetails.amount} ETH
          </Badge>
        </CardTitle>
        <CardDescription>
          Pay with smart contract on Base network
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="flex items-center space-x-2 p-3 bg-red-900/40 border border-red-800 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-sm text-red-300">{error}</span>
          </div>
        )}

        {txHash && (
          <div className="flex items-center justify-between p-3 bg-green-900/40 border border-green-800 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-green-300">Payment Sent</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(getExplorerUrl(txHash), "_blank")}
              className="bg-gray-800 hover:bg-gray-700 border-green-700 text-green-300"
            >
              View Transaction
            </Button>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>Amount:</span>
            <span className="font-medium">{paymentDetails.amount} ETH</span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>Network:</span>
            <span className="font-medium">{CURRENT_NETWORK.name}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>Contract:</span>
            <span className="font-medium text-xs">{CONTRACT_CONFIG.CONTRACT_ADDRESS.slice(0, 8)}...</span>
          </div>
        </div>

        <Button
          onClick={handleContractPayment}
          disabled={disabled || isProcessing || !provider || !walletAddress}
          className={`w-full bg-white hover:bg-gray-200 text-black ${className}`}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Pay {paymentDetails.amount} ETH (Contract)
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}