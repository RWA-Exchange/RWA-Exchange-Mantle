const { ethers, network } = require("hardhat");
const { writeFileSync } = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();
  const networkName = network.name;
  const chainId = network.config.chainId;

  console.log("=".repeat(60));
  console.log("🚀 MANTLE RWA EXCHANGE DEPLOYMENT");
  console.log("=".repeat(60));
  console.log("Network:", networkName);
  console.log("Chain ID:", chainId);
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "MNT");
  console.log("=".repeat(60));

  const deployedContracts = {};

  try {
    // Deploy PropertyNFT (Enhanced with integrated fractional ownership)
    console.log("\n🏠 Deploying Enhanced PropertyNFT...");
    const PropertyNFT = await ethers.getContractFactory("PropertyNFT");
    const propertyNFT = await PropertyNFT.deploy(deployer.address);
    await propertyNFT.waitForDeployment();
    const propertyNFTAddress = await propertyNFT.getAddress();
    console.log("✅ PropertyNFT deployed to:", propertyNFTAddress);
    deployedContracts.PropertyNFT = propertyNFTAddress;

    // Deploy Enhanced Fractionalizer (Works alongside PropertyNFT)
    console.log("\n🔄 Deploying Enhanced Fractionalizer...");
    const Fractionalizer = await ethers.getContractFactory("Fractionalizer");
    const fractionalizer = await Fractionalizer.deploy(propertyNFTAddress);
    await fractionalizer.waitForDeployment();
    const fractionalizerAddress = await fractionalizer.getAddress();
    console.log("✅ Fractionalizer deployed to:", fractionalizerAddress);
    deployedContracts.Fractionalizer = fractionalizerAddress;

    // Note: Fraction contracts are deployed dynamically by Fractionalizer
    console.log("\n🧩 Enhanced Fraction contracts will be deployed dynamically when NFTs are fractionalized");
    console.log("   Each fraction token includes governance, permit functionality, and enhanced metadata");

    // Verify deployment by calling contract functions
    console.log("\n🔍 Verifying deployments...");

    // Verify PropertyNFT
    const propertyNFTOwner = await propertyNFT.owner();
    const isPaused = await propertyNFT.paused();
    const platformFee = await propertyNFT.platformFeePercent();
    const feeRecipient = await propertyNFT.feeRecipient();

    console.log("PropertyNFT Details:");
    console.log("  Owner:", propertyNFTOwner);
    console.log("  Paused:", isPaused);
    console.log("  Platform Fee:", platformFee.toString(), "basis points");
    console.log("  Fee Recipient:", feeRecipient);

    // Verify Fractionalizer
    const fractionalizerPropertyNFT = await fractionalizer.propertyNFTAddress();
    const fractionalizerOwner = await fractionalizer.owner();
    const fractionalizerPaused = await fractionalizer.paused();
    const fractionalizerPlatformFee = await fractionalizer.platformFeePercent();

    console.log("\nFractionalizer Details:");
    console.log("  PropertyNFT Address:", fractionalizerPropertyNFT);
    console.log("  Owner:", fractionalizerOwner);
    console.log("  Paused:", fractionalizerPaused);
    console.log("  Platform Fee:", fractionalizerPlatformFee.toString(), "basis points");

    // Test basic functionality
    console.log("\n🧪 Testing basic functionality...");

    // Test PropertyNFT name and symbol
    const nftName = await propertyNFT.name();
    const nftSymbol = await propertyNFT.symbol();
    console.log("PropertyNFT Name:", nftName);
    console.log("PropertyNFT Symbol:", nftSymbol);

    // Save deployment addresses with enhanced information
    const deploymentInfo = {
      network: networkName,
      chainId: chainId,
      deployer: deployer.address,
      timestamp: new Date().toISOString(),
      contracts: deployedContracts,
      features: {
        PropertyNFT: [
          "Enhanced fractional ownership",
          "MNT token integration",
          "Platform fee system",
          "Dividend distribution",
          "Investment tracking",
          "Portfolio analytics",
          "Emergency controls"
        ],
        Fractionalizer: [
          "Advanced fractionalization",
          "MNT-based pricing",
          "Fraction purchasing",
          "Enhanced metadata",
          "Platform fee integration",
          "KYC placeholder system"
        ],
        Fraction: [
          "ERC20 with governance (ERC20Votes)",
          "Permit functionality (gasless approvals)",
          "Enhanced metadata tracking",
          "Account freezing capability",
          "Property value calculations",
          "Percentage ownership tracking"
        ]
      },
      gasUsed: {
        PropertyNFT: "Estimated ~3.2M gas",
        Fractionalizer: "Estimated ~2.8M gas",
        FractionToken: "Deployed dynamically (~2.1M gas each)"
      }
    };

    const filename = `deployments-mantle-${networkName}-${chainId}.json`;
    writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));
    console.log(`\n📝 Deployment info saved to ${filename}`);

    console.log("\n" + "=".repeat(60));
    console.log("🎉 DEPLOYMENT COMPLETED SUCCESSFULLY");
    console.log("=".repeat(60));
    console.log("📋 Contract Summary:");
    Object.entries(deployedContracts).forEach(([name, address]) => {
      console.log(`   ${name}: ${address}`);
    });

    console.log("\n🌟 Enhanced Features Deployed:");
    console.log("   ✅ Integrated fractional ownership in PropertyNFT");
    console.log("   ✅ MNT token payments and treasury management");
    console.log("   ✅ Platform fee system with configurable rates");
    console.log("   ✅ Enhanced Fractionalizer with MNT pricing");
    console.log("   ✅ Governance-enabled Fraction tokens");
    console.log("   ✅ Comprehensive investment tracking");
    console.log("   ✅ Emergency pause/unpause controls");
    console.log("   ✅ Dividend distribution system");

    console.log("\n🔧 Next Steps:");
    console.log("   1. Update .env with contract addresses:");
    console.log(`      NEXT_PUBLIC_PROPERTY_NFT_ADDRESS=${propertyNFTAddress}`);
    console.log(`      NEXT_PUBLIC_FRACTIONALIZER_ADDRESS=${fractionalizerAddress}`);
    console.log("   2. Test property creation and investment flows");
    console.log("   3. Configure platform fees if needed");
    console.log("   4. Set up frontend integration");

    console.log("=".repeat(60));

    // Verification instructions for Mantle
    if (networkName.includes("mantle")) {
      console.log("\n🔍 To verify contracts on Mantle explorer, run:");
      console.log(`npx hardhat verify --network ${networkName} ${propertyNFTAddress} "${deployer.address}"`);
      console.log(`npx hardhat verify --network ${networkName} ${fractionalizerAddress} "${propertyNFTAddress}"`);
      console.log("\nNote: Fraction tokens will be verified automatically when created through the Fractionalizer");
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