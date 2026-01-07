// Application configuration
// Switch between SQLite database and blockchain

export const APP_CONFIG = {
  // Set to 'database' for SQLite, 'blockchain' for Sui/Mantle
  MODE: process.env.NEXT_PUBLIC_APP_MODE || 'database',

  // Database mode - instant functionality, no deployment needed
  USE_DATABASE: process.env.NEXT_PUBLIC_APP_MODE !== 'blockchain',

  // Blockchain configuration
  BLOCKCHAIN: {
    RPC_URL: process.env.NEXT_PUBLIC_MANTLE_RPC_URL || 'https://rpc.sepolia.mantle.xyz',
    PACKAGE_ID: process.env.NEXT_PUBLIC_PROPERTY_NFT_ADDRESS || '',
  },
};

// Helper to get the correct service
export function getPropertyService() {
  if (APP_CONFIG.USE_DATABASE) {
    return import('@/services/propertyContractDB').then(m => m.propertyContractDBService);
  } else {
    return import('@/services/propertyContract').then(m => m.propertyContractService);
  }
}
