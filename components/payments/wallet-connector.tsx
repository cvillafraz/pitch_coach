"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { ethers } from "ethers"
import { CURRENT_NETWORK } from "@/lib/web3-config"

declare global {
  interface Window {
    ethereum?: any
  }
}

export interface WalletConnectorProps {
  onWalletConnected?: (address: string, provider: ethers.BrowserProvider) => void
  onWalletDisconnected?: () => void
}

export function WalletConnector({ onWalletConnected, onWalletDisconnected }: WalletConnectorProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [networkError, setNetworkError] = useState("")

  // Check if wallet is already connected on component mount
  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    if (!window.ethereum) return

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const accounts = await provider.listAccounts()
      
      if (accounts.length > 0) {
        const signer = await provider.getSigner()
        const address = await signer.getAddress()
        setAddress(address)
        setIsConnected(true)
        setProvider(provider)
        onWalletConnected?.(address, provider)
        
        // Check if on correct network
        await checkNetwork(provider)
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error)
    }
  }

  const checkNetwork = async (provider: ethers.BrowserProvider) => {
    try {
      const network = await provider.getNetwork()
      const currentChainId = Number(network.chainId)
      
      if (currentChainId !== CURRENT_NETWORK.chainId) {
        setNetworkError(`Please switch to ${CURRENT_NETWORK.name} network`)
        return false
      }
      
      setNetworkError("")
      return true
    } catch (error) {
      console.error("Error checking network:", error)
      return false
    }
  }

  const switchToBaseNetwork = async () => {
    if (!window.ethereum) return false

    try {
      // Try to switch to Base network
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: CURRENT_NETWORK.chainIdHex }],
      })
      
      setNetworkError("")
      return true
    } catch (switchError: any) {
      // If the network doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: CURRENT_NETWORK.chainIdHex,
                chainName: CURRENT_NETWORK.name,
                nativeCurrency: CURRENT_NETWORK.nativeCurrency,
                rpcUrls: [CURRENT_NETWORK.rpc],
                blockExplorerUrls: [CURRENT_NETWORK.blockExplorer],
              },
            ],
          })
          setNetworkError("")
          return true
        } catch (addError) {
          console.error("Error adding network:", addError)
          return false
        }
      }
      console.error("Error switching network:", switchError)
      return false
    }
  }

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask or another Ethereum wallet")
      return
    }

    setIsConnecting(true)
    
    try {
      // Request account access
      await window.ethereum.request({ method: "eth_requestAccounts" })
      
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      
      setProvider(provider)
      setAddress(address)
      setIsConnected(true)
      
      // Check/switch network
      const networkOk = await checkNetwork(provider)
      if (!networkOk) {
        await switchToBaseNetwork()
      }
      
      onWalletConnected?.(address, provider)
    } catch (error) {
      console.error("Error connecting wallet:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setAddress("")
    setProvider(null)
    setNetworkError("")
    onWalletDisconnected?.()
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (!window.ethereum) {
    return (
      <Card className="bg-white/60 backdrop-blur-sm border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-gray-800">
            <Wallet className="w-5 h-5" />
            <span>Wallet Required</span>
          </CardTitle>
          <CardDescription>
            Please install MetaMask or another Ethereum wallet to make payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => window.open("https://metamask.io/download/", "_blank")}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white"
          >
            Install MetaMask
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-gray-800">
          <Wallet className="w-5 h-5" />
          <span>Wallet Connection</span>
        </CardTitle>
        <CardDescription>
          Connect your wallet to make payments on Base network
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected ? (
          <Button
            onClick={connectWallet}
            disabled={isConnecting}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white"
          >
            {isConnecting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </>
            )}
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Connected</span>
              </div>
              <Badge variant="outline" className="bg-white text-green-700 border-green-300">
                {formatAddress(address)}
              </Badge>
            </div>
            
            {networkError && (
              <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-orange-600" />
                  <span className="text-sm text-orange-800">{networkError}</span>
                </div>
                <Button
                  size="sm"
                  onClick={switchToBaseNetwork}
                  variant="outline"
                  className="bg-white hover:bg-orange-50 border-orange-300 text-orange-700"
                >
                  Switch Network
                </Button>
              </div>
            )}
            
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Network:</span>
              <Badge variant="outline" className="bg-white text-gray-700 border-gray-300">
                {CURRENT_NETWORK.name}
              </Badge>
            </div>
            
            <Button
              onClick={disconnectWallet}
              variant="outline"
              size="sm"
              className="w-full bg-white hover:bg-gray-50 border-gray-300 text-gray-700"
            >
              Disconnect
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}