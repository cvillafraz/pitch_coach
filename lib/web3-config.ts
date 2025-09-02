export const BASE_CONFIG = {
  // Base mainnet
  MAINNET: {
    chainId: 8453,
    chainIdHex: "0x2105",
    name: "Base",
    rpc: "https://mainnet.base.org",
    blockExplorer: "https://basescan.org",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
  },
  // Base Sepolia testnet
  TESTNET: {
    chainId: 84532,
    chainIdHex: "0x14A34",
    name: "Base Sepolia",
    rpc: "https://sepolia.base.org",
    blockExplorer: "https://sepolia.basescan.org",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
  },
}

// Use testnet for development, mainnet for production
export const CURRENT_NETWORK = process.env.NODE_ENV === "production" ? BASE_CONFIG.MAINNET : BASE_CONFIG.TESTNET

// Smart contract configuration
export const CONTRACT_CONFIG = {
  // MicdropFarcaster smart contract address (deploy to get actual address)
  CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x742d35cc6639c21f9ec4c2c5d5e6c5d7a7f8b9c0", // Replace with actual deployed address
  
  // Contract ABI (simplified for payments)
  ABI: [
    "function purchasePremiumSession() external payable",
    "function purchaseMonthlySubscription() external payable", 
    "function purchaseYearlySubscription() external payable",
    "function hasPremiumAccess(address user) external view returns (bool)",
    "function hasActiveSubscription(address user) external view returns (bool)",
    "function getUserSubscription(address user) external view returns (uint8, uint256, uint256, bool, uint256)",
    "function usePremiumSession(address user) external",
    "event PaymentReceived(address indexed user, uint8 indexed paymentType, uint256 amount, bytes32 paymentId)",
    "event SubscriptionActivated(address indexed user, uint8 indexed subscriptionType, uint256 startTime, uint256 endTime)"
  ],
}

// Payment configuration
export const PAYMENT_CONFIG = {
  // Your receiving wallet address (set this to your actual Base wallet)
  RECEIVER_ADDRESS: process.env.NEXT_PUBLIC_BASE_RECEIVER_ADDRESS || "0x0000000000000000000000000000000000000000",
  
  // Payment amounts in ETH (must match contract values)
  AMOUNTS: {
    PREMIUM_SESSION: "0.001", // 0.001 ETH for premium AI voice sessions
    MONTHLY_SUBSCRIPTION: "0.05", // 0.05 ETH for monthly subscription
    YEARLY_SUBSCRIPTION: "0.5", // 0.5 ETH for yearly subscription
  },
  
  // Gas limit for transactions
  GAS_LIMIT: "100000", // Increased for contract interactions
}

export enum PaymentType {
  PREMIUM_SESSION = "premium_session",
  MONTHLY_SUBSCRIPTION = "monthly_subscription", 
  YEARLY_SUBSCRIPTION = "yearly_subscription",
}

export interface PaymentDetails {
  type: PaymentType
  amount: string
  description: string
}

export const getPaymentDetails = (type: PaymentType): PaymentDetails => {
  switch (type) {
    case PaymentType.PREMIUM_SESSION:
      return {
        type,
        amount: PAYMENT_CONFIG.AMOUNTS.PREMIUM_SESSION,
        description: "Premium AI Voice Session",
      }
    case PaymentType.MONTHLY_SUBSCRIPTION:
      return {
        type,
        amount: PAYMENT_CONFIG.AMOUNTS.MONTHLY_SUBSCRIPTION,
        description: "Monthly Subscription",
      }
    case PaymentType.YEARLY_SUBSCRIPTION:
      return {
        type,
        amount: PAYMENT_CONFIG.AMOUNTS.YEARLY_SUBSCRIPTION,
        description: "Yearly Subscription",
      }
    default:
      throw new Error("Invalid payment type")
  }
}