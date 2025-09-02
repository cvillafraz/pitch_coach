const { ethers } = require("ethers");

// Generate a new random wallet
const wallet = ethers.Wallet.createRandom();

console.log("=== NEW WALLET GENERATED ===");
console.log("Address:", wallet.address);
console.log("Private Key:", wallet.privateKey);
console.log("Mnemonic:", wallet.mnemonic.phrase);
console.log("\n⚠️  SECURITY WARNING:");
console.log("- Keep your private key secret");
console.log("- Never commit it to git");
console.log("- Add to .env file only");
console.log("- Fund this wallet with Base Sepolia ETH for deployment");
console.log("\nNext steps:");
console.log("1. Add to .env: PRIVATE_KEY=" + wallet.privateKey);
console.log("2. Get testnet ETH from: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet");
console.log("3. Run: npm run deploy:sepolia");