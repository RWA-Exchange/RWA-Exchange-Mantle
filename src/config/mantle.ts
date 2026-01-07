/**
 * Mantle Network Configuration
 */

export const MANTLE_NETWORKS = {
  testnet: {
    chainId: 5003,
    name: 'Mantle Sepolia Testnet',
    rpcUrl: 'https://rpc.sepolia.mantle.xyz',
    explorerUrl: 'https://sepolia.mantlescan.xyz',
    faucetUrl: 'https://faucet.sepolia.mantle.xyz',
    nativeCurrency: {
      name: 'MNT',
      symbol: 'MNT',
      decimals: 18,
    },
  },
  mainnet: {
    chainId: 5000,
    name: 'Mantle',
    rpcUrl: 'https://rpc.mantle.xyz',
    explorerUrl: 'https://explorer.mantle.xyz',
    nativeCurrency: {
      name: 'MNT',
      symbol: 'MNT',
      decimals: 18,
    },
  },
} as const;

export const DEFAULT_NETWORK = MANTLE_NETWORKS.testnet;

export const CONTRACT_ADDRESSES = {
  5003: {
    PropertyNFT: process.env.NEXT_PUBLIC_PROPERTY_NFT_ADDRESS || '',
  },
  5000: {
    PropertyNFT: process.env.NEXT_PUBLIC_PROPERTY_NFT_ADDRESS_MAINNET || '',
  },
} as const;

export const SUPPORTED_CHAIN_IDS = [5003, 5000] as const;

export function getNetworkConfig(chainId: number) {
  return Object.values(MANTLE_NETWORKS).find(network => network.chainId === chainId);
}

export function getContractAddress(chainId: number, contractName: keyof typeof CONTRACT_ADDRESSES[5003]) {
  const addresses = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES];
  return (addresses as any)?.[contractName] || '';
}

export function isMantle(chainId: number): boolean {
  return SUPPORTED_CHAIN_IDS.includes(chainId as any);
}