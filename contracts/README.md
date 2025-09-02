# Micdrop Farcaster Smart Contract

## Contract Address
**Base Sepolia Testnet**: `0x742d35cc6639c21f9ec4c2c5d5e6c5d7a7f8b9c0` (example - deploy to get actual address)

## Contract Features

- Premium session payments (0.001 ETH)
- Monthly subscriptions (0.05 ETH) 
- Yearly subscriptions (0.5 ETH)
- Subscription management and tracking
- Authorized frame integration for Farcaster
- Owner controls and emergency functions

## Deployment Instructions

1. **Set up environment variables:**
   ```bash
   export PRIVATE_KEY="your_private_key_here"
   export BASESCAN_API_KEY="your_basescan_api_key" # optional for verification
   ```

2. **Install dependencies:**
   ```bash
   cd contracts
   npm install
   ```

3. **Deploy to Base Sepolia:**
   ```bash
   npm run deploy:sepolia
   ```

4. **Deploy to Base Mainnet:**
   ```bash
   npm run deploy:mainnet
   ```

## Quick Deploy with Cast (Alternative)

If you have Foundry installed:

```bash
# Deploy to Base Sepolia
cast create MicdropFarcaster --rpc-url https://sepolia.base.org --private-key $PRIVATE_KEY

# Deploy to Base Mainnet  
cast create MicdropFarcaster --rpc-url https://mainnet.base.org --private-key $PRIVATE_KEY
```

## Contract Functions

### Payment Functions
- `purchasePremiumSession()` - Buy single premium session
- `purchaseMonthlySubscription()` - Buy 30-day subscription
- `purchaseYearlySubscription()` - Buy 365-day subscription

### Access Functions
- `hasPremiumAccess(address user)` - Check if user has premium access
- `hasActiveSubscription(address user)` - Check active subscription status
- `getUserSubscription(address user)` - Get detailed subscription info

### Frame Integration
- `usePremiumSession(address user)` - Consume session (authorized frames only)
- `setFrameAuthorization(address frame, bool authorized)` - Authorize frame contracts

### Owner Functions
- `withdraw()` - Withdraw contract funds
- `pause()/unpause()` - Emergency controls

## Integration with Farcaster Frame

Add the contract address to your frame configuration and use the `usePremiumSession` function when users access premium features through your Farcaster frame.

The contract will automatically track usage and subscriptions, ensuring only paying users can access premium AI coaching sessions.