require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    // Mantle Testnet
    mantle_testnet: {
      url: process.env.MANTLE_TESTNET_RPC_URL || "https://rpc.sepolia.mantle.xyz",
      chainId: 5001,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      timeout: 60000,
      gasPrice: 20000000000, // 20 gwei
    },
    // Mantle Mainnet
    mantle_mainnet: {
      url: process.env.MANTLE_MAINNET_RPC_URL || "https://rpc.mantle.xyz",
      chainId: 5000,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      timeout: 60000,
      gasPrice: 20000000000, // 20 gwei
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  etherscan: {
    apiKey: {
      mantle_testnet: process.env.MANTLE_API_KEY || "your-api-key-here",
      mantle_mainnet: process.env.MANTLE_API_KEY || "your-api-key-here",
    },
    customChains: [
      {
        network: "mantle_testnet",
        chainId: 5001,
        urls: {
          apiURL: process.env.MANTLE_TESTNET_EXPLORER_API || "https://explorer.sepolia.mantle.xyz/api",
          browserURL: process.env.MANTLE_TESTNET_EXPLORER || "https://explorer.sepolia.mantle.xyz"
        }
      },
      {
        network: "mantle_mainnet",
        chainId: 5000,
        urls: {
          apiURL: process.env.MANTLE_MAINNET_EXPLORER_API || "https://explorer.mantle.xyz/api",
          browserURL: process.env.MANTLE_MAINNET_EXPLORER || "https://explorer.mantle.xyz"
        }
      }
    ]
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
};
