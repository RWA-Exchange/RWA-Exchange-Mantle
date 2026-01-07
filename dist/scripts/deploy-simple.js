"use strict";
const { ethers, network } = require("hardhat");
const { writeFileSync } = require("fs");
async function main() {
    const [deployer] = await ethers.getSigners();
    const networkName = network.name;
    const chainId = network.config.chainId;
    console.log("=".repeat(60));
    console.log("🚀 SIMPLE PROPERTY NFT DEPLOYMENT");
    console.log("=".repeat(60));
    console.log("Network:", networkName);
    console.log("Chain ID:", chainId);
    console.log("Deploying contracts with account:", deployer.address);
    console.log("Account balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "MNT");
    console.log("=".repeat(60));
    try {
        // Deploy PropertyNFT
        console.log("\n🏠 Deploying PropertyNFT...");
        const PropertyNFT = await ethers.getContractFactory("PropertyNFT");
        const propertyNFT = await PropertyNFT.deploy(deployer.address);
        await simplePropertyNFT.waitForDeployment();
        const contractAddress = await simplePropertyNFT.getAddress();
        console.log("✅ SimplePropertyNFT deployed to:", contractAddress);
        // Verify deployment by calling contract functions
        console.log("\n🔍 Verifying deployment...");
        const owner = await simplePropertyNFT.owner();
        const isPaused = await simplePropertyNFT.paused();
        const platformFee = await simplePropertyNFT.platformFeePercent();
        const feeRecipient = await simplePropertyNFT.feeRecipient();
        const name = await simplePropertyNFT.name();
        const symbol = await simplePropertyNFT.symbol();
        console.log("Contract Details:");
        console.log("  Name:", name);
        console.log("  Symbol:", symbol);
        console.log("  Owner:", owner);
        console.log("  Paused:", isPaused);
        console.log("  Platform Fee:", platformFee.toString(), "basis points (2.5%)");
        console.log("  Fee Recipient:", feeRecipient);
        // Save deployment info
        const deploymentInfo = {
            network: networkName,
            chainId: chainId,
            deployer: deployer.address,
            timestamp: new Date().toISOString(),
            contractAddress: contractAddress,
            contractName: "SimplePropertyNFT",
            features: [
                "Real World Asset (RWA) Property NFTs",
                "Fractional ownership system",
                "MNT token payments",
                "Investment tracking",
                "Dividend distribution",
                "Share transfers",
                "Platform fee system",
                "Emergency controls"
            ]
        };
        const filename = `deployment-simple-${networkName}-${Date.now()}.json`;
        writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));
        console.log(`\n📝 Deployment info saved to ${filename}`);
        console.log("\n" + "=".repeat(60));
        console.log("🎉 DEPLOYMENT COMPLETED SUCCESSFULLY");
        console.log("=".repeat(60));
        console.log("📋 Contract Address:", contractAddress);
        console.log("\n🔧 Next Steps:");
        console.log("   1. Update .env.local with contract address:");
        console.log(`      NEXT_PUBLIC_PROPERTY_NFT_ADDRESS=${contractAddress}`);
        console.log("   2. Test property creation and investment flows");
        console.log("   3. Configure platform fees if needed");
        // Verification instructions for Mantle
        if (networkName.includes("mantle")) {
            console.log("\n🔍 To verify contract on Mantle explorer, run:");
            console.log(`npx hardhat verify --network ${networkName} ${contractAddress} "${deployer.address}"`);
        }
        console.log("=".repeat(60));
        return contractAddress;
    }
    catch (error) {
        console.error("❌ Deployment failed:", error);
        throw error;
    }
}
if (require.main === module) {
    main().catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
}
module.exports = main;
