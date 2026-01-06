import { ethers, network } from "hardhat";
import { writeFileSync } from "fs";

async function main() {
  const [deployer] = await ethers.getSigners();
  const networkName = network.name;
  const chainId = network.config.chainId;

  console.log("=".repeat(50));
  console.log("MANTLE RWA EXCHANGE DEPLOYMENT");
  console.log("=".repeat(50));
  console.log("Network:", networkName);
  console.log("Chain ID:", chainId);
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "MNT");
  console.log("=".repeat(50));

  const deployedContracts: any = {};

  try {
    // Deploy PropertyNFT (now includes all functionality from Move contract)
    console.log("\n🏠 Deploying RWA PropertyNFT with integrated fractional ownership...");
    const PropertyNFT = await ethers.getContractFactory("PropertyNFT");
    const propertyNFT = await PropertyNFT.deploy(deployer.address);
    await propertyNFT.waitForDeployment();
    const propertyNFTAddress = await propertyNFT.getAddress();
    console.log("✅ PropertyNFT deployed to:", propertyNFTAddress);
    deployedContracts.PropertyNFT = propertyNFTAddress;

    // Note: The new PropertyNFT contract includes all fractional ownership functionality
    // No separate Fractionalizer contract needed - everything is integrated
    console.log("\n🎉 Integrated RWA system deployed successfully!");
    console.log("Features included:");
    console.log("- Property NFT creation");
    console.log("- Built-in fractional ownership");
    console.log("- MNT-based investments");
    console.log("- Dividend distribution");
    console.log("- Share transfers");

    // Verify deployment by calling contract functions
    console.log("\n🔍 Verifying deployment...");
    
    // Verify PropertyNFT
    const propertyNFTOwner = await propertyNFT.owner();
    console.log("PropertyNFT owner:", propertyNFTOwner);
    
    // Check if contract is paused (should be false initially)
    const isPaused = await propertyNFT.paused();
    console.log("PropertyNFT paused status:", isPaused);

    // Save deployment addresses
    const deploymentInfo = {
      network: networkName,
      chainId: chainId,
      deployer: deployer.address,
      timestamp: new Date().toISOString(),
      contracts: deployedContracts,
      features: [
        "Property NFT creation",
        "Fractional ownership",
        "MNT investments",
        "Dividend distribution",
        "Share transfers"
      ]
    };

    const filename = `deployments-${networkName}-${chainId}.json`;
    writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));
    console.log(`\n📝 Deployment info saved to ${filename}`);

    console.log("\n" + "=".repeat(50));
    console.log("DEPLOYMENT COMPLETED SUCCESSFULLY");
    console.log("=".repeat(50));
    console.log("Summary:");
    Object.entries(deployedContracts).forEach(([name, address]) => {
      console.log(`${name}: ${address}`);
    });
    console.log("=".repeat(50));

    // Verification instructions
    if (networkName.includes("mantle")) {
      console.log("\n🔍 To verify contracts on Mantle explorer, run:");
      Object.entries(deployedContracts).forEach(([name, address]) => {
        console.log(`npx hardhat verify --network ${networkName} ${address} "${deployer.address}"`);
      });
    }

  } catch (error) {
    console.error("❌ Deployment failed:", error);
    throw error;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
