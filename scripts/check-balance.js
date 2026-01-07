const { ethers } = require("ethers");
require("dotenv").config({ path: ".env.local" });
require("dotenv").config(); // fallback

async function main() {
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
        console.error("❌ No PRIVATE_KEY found in .env.local");
        return;
    }

    const wallet = new ethers.Wallet(privateKey);
    console.log("🔑 Wallet Address:", wallet.address);
    console.log("=".repeat(50));

    const networks = [
        { name: "Mantle Sepolia Testnet", url: "https://rpc.sepolia.mantle.xyz" },
        { name: "Mantle Mainnet", url: "https://rpc.mantle.xyz" }
    ];

    for (const net of networks) {
        try {
            const provider = new ethers.JsonRpcProvider(net.url);
            const balance = await provider.getBalance(wallet.address);
            console.log(`🌐 ${net.name}`);
            console.log(`   RPC: ${net.url}`);
            console.log(`   💰 Balance: ${ethers.formatEther(balance)} MNT`);
        } catch (error) {
            console.log(`❌ ${net.name}: Failed to connect (${error.message})`);
        }
        console.log("-".repeat(50));
    }
}

main();
