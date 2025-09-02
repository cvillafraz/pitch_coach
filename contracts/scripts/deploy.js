const hre = require("hardhat");

async function main() {
  console.log("Deploying MicdropFarcaster contract...");

  // Get the contract factory
  const MicdropFarcaster = await hre.ethers.getContractFactory("MicdropFarcaster");

  // Deploy the contract
  const micdrop = await MicdropFarcaster.deploy();

  // Wait for deployment
  await micdrop.deployed();

  console.log(`MicdropFarcaster deployed to: ${micdrop.address}`);
  console.log(`Network: ${hre.network.name}`);
  console.log(`Deployer: ${(await hre.ethers.getSigners())[0].address}`);

  // Wait for a few block confirmations before verification
  if (hre.network.name !== "hardhat") {
    console.log("Waiting for block confirmations...");
    await micdrop.deployTransaction.wait(5);
    
    console.log("Verifying contract...");
    try {
      await hre.run("verify:verify", {
        address: micdrop.address,
        constructorArguments: [],
      });
      console.log("Contract verified successfully");
    } catch (error) {
      console.log("Verification failed:", error.message);
    }
  }

  // Print deployment summary
  console.log("\n=== Deployment Summary ===");
  console.log(`Contract Address: ${micdrop.address}`);
  console.log(`Network: ${hre.network.name}`);
  console.log(`Block Explorer: ${getBlockExplorerUrl(hre.network.name, micdrop.address)}`);
  console.log("\nNext steps:");
  console.log(`1. Update NEXT_PUBLIC_CONTRACT_ADDRESS in your .env file`);
  console.log(`2. Update web3-config.ts with the new contract address`);
  console.log(`3. Test the contract integration`);
}

function getBlockExplorerUrl(networkName, address) {
  switch (networkName) {
    case "base-sepolia":
      return `https://sepolia.basescan.org/address/${address}`;
    case "base-mainnet":
      return `https://basescan.org/address/${address}`;
    default:
      return `Contract address: ${address}`;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });