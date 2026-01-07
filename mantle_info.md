Mantle Network Overview
Mantle Network is a modular Ethereum Layer 2 (L2) blockchain designed for high performance, low fees, and EVM compatibility. It uses a Validity Rollup architecture (formerly optimistic rollup) with decoupled execution, consensus, and data availability layers, making it ideal for scaling DeFi, RWAs, and other Web3 applications. It's backed by the Mantle Ecosystem, including the MNT token and tools for developers.
Official Documentation
The primary documentation hub is at https://docs.mantle.xyz/, which covers:

Network Overviews: Introduction to architecture, security, and modularity.
For Users: Guides on wallets, bridges, and network endpoints.
For Developers: Tutorials on building dApps, SDK usage, RPC methods, and integrations.
Governance and Ecosystem: Details on MNT tokenomics, staking, and DA solutions.
Additional resources include blog posts on mantle.xyz/blog/developers for tutorials like getting started on mainnet/testnet. For API-specific docs, providers like QuickNode and Alchemy offer supplementary guides.

Chain IDs

Mainnet: 5000 (0x1388 in hex).
Testnet (Mantle Sepolia Testnet): 5001.

Native Token

Mainnet: MNT (Mantle Token) – used for gas fees, governance, staking, and ecosystem incentives. It's an ERC-20 token with utilities like paying for transactions and participating in Mantle EcoFund.

Testnet: MNT (updated from earlier BIT token; modern guides and ChainList confirm MNT as the native currency symbol for testing). Note: Older docs (pre-2024) may refer to BIT, but as of 2025+, it's standardized to MNT for consistency with mainnet.





RPC Endpoints
Mantle supports standard Ethereum JSON-RPC methods. Below is a table of public and provider-specific endpoints (HTTP and WSS where available). Use API keys for premium providers to avoid rate limits.



TestnetOfficial/Public
https://rpc.testnet.mantle.xyz
wss://rpc.testnet.mantle.xyz
For development and testing.

Testnet QuickNode
https://mantle-sepolia.core.quicknode.pro/YOUR-API-KEY
wss://mantle-sepolia.core.quicknode.pro/YOUR-API-KEY
Archive support; tied to Sepolia base.




For more providers, check ChainList or dRPC for additional nodes.
Testnet Details
Mantle Testnet (also known as Mantle Sepolia Testnet) is for development and testing dApps. Key features:

Chain ID: 5001.
Native Currency: MNT (test tokens).
RPC: See table above.
Faucet: https://faucet.testnet.mantle.xyz/ – Dispenses test MNT (may require Sepolia ETH for gas fees; up to certain limits after verification). Older faucets used Goerli, but it's updated to Sepolia base.
Bridge: https://bridge.testnet.mantle.xyz/ – Bridge test ETH or MNT from Sepolia to Mantle Testnet.
Explorer: https://explorer.testnet.mantle.xyz – View transactions, addresses, and tokens.
Setup: Add to wallets via ChainList; bridge tokens to start interacting.

Compatible Wallets
As an EVM-compatible chain, Mantle works with most Ethereum wallets. Recommended:

MetaMask: Primary choice; add network manually or via ChainList.org (search "Mantle" and click "Add to MetaMask").
Trust Wallet, Rabby, Coinbase Wallet: Support via custom network addition.
Ledger/Trezor: Hardware wallets compatible through MetaMask integration.
Others: Any EVM wallet like Frame or Rainbow, as long as it supports custom chains.

Block Explorers

Mainnet:
https://explorer.mantle.xyz – Official explorer for transactions, blocks, and contracts.
https://mantlescan.xyz – Alternative for advanced scanning.

Testnet: https://explorer.testnet.mantle.xyz.

Bridges

Mainnet: https://bridge.mantle.xyz – Official bridge for transferring assets (e.g., ETH, USDT, MNT) between Ethereum and Mantle. Supports fast, low-cost transfers.
Testnet: https://bridge.testnet.mantle.xyz – For test assets from Sepolia.Third-party bridges like LayerZero or Synapse may also support Mantle for cross-chain transfers.

SDKs and Tooling

Mantle SDK: For building dApps; includes tools for smart contract deployment, testing, and integration with Mantle's modular stack (e.g., Mantle DA for data availability).
Compatible Tools: Hardhat, Foundry, Truffle (Ethereum standards work with minimal changes). Use Mantle testnets for DevOps pipelines.
APIs/Add-ons: Providers like QuickNode offer ETL tools, debug APIs, and mempool services tailored for Mantle.
Other: Native support for oracles (e.g., Chainlink), wallets plugins, and monitoring dashboards via ecosystem partners.

For the latest updates, check the official docs or Mantle's X account (@0xMantle). If building for the hackathon, focus on mainnet/testnet integrations for optimal scoring.




CLI Tools for Deploying Smart Contracts on Mantle Network
Mantle Network is fully EVM-compatible, so it supports the same popular Ethereum development tools for compiling, testing, and deploying smart contracts via the command line. There is no official Mantle-specific CLI (like a dedicated mantle deploy command) from the Mantle team. Instead, developers rely on standard tools like Hardhat and Foundry, which work seamlessly with Mantle's RPC endpoints.
These tools are widely used in Mantle tutorials, hackathons, and ecosystem projects. Here's a breakdown:
1. Hardhat (Most Common for Mantle)
Hardhat is the go-to CLI for many Mantle deployments. It's flexible, has great plugins (e.g., for verification, upgrades), and is featured in official guides.

Installation:textnpm init -y
npm install --save-dev hardhat
npx hardhat(Choose a template project.)
Configure Mantle in hardhat.config.js:JavaScriptrequire("@nomicfoundation/hardhat-toolbox"); // Or specific plugins

module.exports = {
  solidity: "0.8.20", // Your version
  networks: {
    mantleMainnet: {
      url: "https://rpc.mantle.xyz", // Or a provider like Alchemy/QuickNode
      chainId: 5000,
      accounts: [process.env.PRIVATE_KEY], // Your wallet private key
    },
    mantleTestnet: {
      url: "https://rpc.testnet.mantle.xyz",
      chainId: 5001,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
Deployment Script (e.g., scripts/deploy.js):JavaScriptasync function main() {
  const Contract = await hre.ethers.getContractFactory("YourContract");
  const contract = await Contract.deploy(); // Add constructor args if needed
  await contract.waitForDeployment();
  console.log("Deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
Deploy Command:textnpx hardhat run scripts/deploy.js --network mantleTestnet  # For testnet
npx hardhat run scripts/deploy.js --network mantleMainnet  # For mainnet
Verification (optional, via plugin):
Add @nomicfoundation/hardhat-verify and verify on Mantle Explorer.

Many Mantle tutorials (e.g., for ERC20, ERC721, ERC1155) use exactly this flow.
2. Foundry (Forge)
Foundry is faster and more modern (Rust-based), great for testing and deployment. It works perfectly on Mantle since it's EVM-compatible.

Installation:textcurl -L https://foundry.paradigm.xyz | bash
foundryup
Project Setup:textforge init my-mantle-project
Configure in foundry.toml (or via CLI flags):
Add RPC URLs via environment or directly:text[rpc_endpoints]
mantleMainnet = "https://rpc.mantle.xyz"
mantleTestnet = "https://rpc.testnet.mantle.xyz"
Deployment Script (src/YourContract.sol as usual):
Use a script in script/Deploy.s.sol:solidity// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";

contract DeployScript is Script {
    function run() external {
        vm.startBroadcast(); // Uses PRIVATE_KEY env var
        YourContract contract = new YourContract(); // Args if needed
        vm.stopBroadcast();
    }
}
Deploy Command:textforge script script/Deploy.s.sol --rpc-url mantleTestnet --broadcast --verify
forge script script/Deploy.s.sol --rpc-url mantleMainnet --broadcast --private-key YOUR_KEY

Foundry is mentioned in advanced Mantle guides and is popular for its speed.
Other Options

Remix IDE: Web-based, no CLI needed – connect MetaMask and deploy directly (great for quick tests).
Truffle: Older but supported; similar config to Hardhat.
Third-Party Starters: Templates like create-mantle-dapp on GitHub use Hardhat out-of-the-box.
Mantle SDK (@mantleio/sdk): This is a JavaScript library for interactions (e.g., bridging), not a CLI for deployment.

For the hackathon (with ~10 days left), Hardhat is recommended – it's beginner-friendly, has excellent debugging, and matches most Mantle examples. Start with a template, add Mantle networks, and deploy to testnet first (get test MNT from the faucet).
Check official docs (docs.mantle.xyz) or Mantle blog for updated guides. If you need a full example repo, let me know!