'use client';

import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { mantleSepoliaTestnet, mantle } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import '@rainbow-me/rainbowkit/styles.css';

// Mantle network configuration
const MANTLE_TESTNET_RPC_URL = process.env.NEXT_PUBLIC_MANTLE_TESTNET_RPC_URL || 'https://rpc.sepolia.mantle.xyz';
const MANTLE_MAINNET_RPC_URL = process.env.NEXT_PUBLIC_MANTLE_MAINNET_RPC_URL || 'https://rpc.mantle.xyz';
const WALLETCONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'your_project_id_here';

// Configure chains
const chains = [mantleSepoliaTestnet, mantle] as const;

// Configure wagmi
const config = getDefaultConfig({
  appName: 'RWA Exchange Mantle',
  projectId: WALLETCONNECT_PROJECT_ID,
  chains,
  ssr: true, // If your dApp uses server side rendering (SSR)
});

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
