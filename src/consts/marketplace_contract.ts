// Mantle marketplace contract configuration

/**
 * Marketplace contract configuration for Mantle network
 * This replaces the previous Thirdweb-based marketplace setup
 */
export const MARKETPLACE_CONTRACT = {
  // Replace with actual deployed marketplace contract address on Mantle
  address: "0x0000000000000000000000000000000000000000",
  network: "Mantle-testnet", // or "Mantle-mainnet"
};

/**
 * Get the marketplace contract address
 */
export const getMarketplaceContractAddress = (): string => {
  return MARKETPLACE_CONTRACT.address;
};
