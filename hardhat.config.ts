import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
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
    // OneChain Testnet
    onechain_testnet: {
      url: process.env.ONECHAIN_TESTNET_RPC_URL || "https://testnet-rpc.onechain.network",
      chainId: 1001,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      timeout: 60000,
    },
    // OneChain Mainnet
    onechain_mainnet: {
      url: process.env.ONECHAIN_MAINNET_RPC_URL || "https://rpc.onechain.network",
      chainId: 1000,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      timeout: 60000,
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
      onechain_testnet: process.env.ONECHAIN_API_KEY || "your-api-key-here",
      onechain_mainnet: process.env.ONECHAIN_API_KEY || "your-api-key-here",
    },
    customChains: [
      {
        network: "onechain_testnet",
        chainId: 1001,
        urls: {
          apiURL: process.env.ONECHAIN_TESTNET_EXPLORER_API || "https://testnet-explorer.onechain.network/api",
          browserURL: process.env.ONECHAIN_TESTNET_EXPLORER || "https://testnet-explorer.onechain.network"
        }
      },
      {
        network: "onechain_mainnet",
        chainId: 1000,
        urls: {
          apiURL: process.env.ONECHAIN_MAINNET_EXPLORER_API || "https://explorer.onechain.network/api",
          browserURL: process.env.ONECHAIN_MAINNET_EXPLORER || "https://explorer.onechain.network"
        }
      }
    ]
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
};

export default config;
