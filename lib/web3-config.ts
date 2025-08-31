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

// Payment configuration
export const PAYMENT_CONFIG = {
  // Your receiving wallet address (set this to your actual Base wallet)
  RECEIVER_ADDRESS: process.env.NEXT_PUBLIC_BASE_RECEIVER_ADDRESS || "0x0000000000000000000000000000000000000000",
  
  // Payment amounts in ETH
  AMOUNTS: {
    PREMIUM_SESSION: "0.001", // 0.001 ETH for premium AI voice sessions
    MONTHLY_SUBSCRIPTION: "0.05", // 0.05 ETH for monthly subscription
    YEARLY_SUBSCRIPTION: "0.5", // 0.5 ETH for yearly subscription
  },
  
  // Gas limit for transactionssss
  GAS_LIMIT: "21000",
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