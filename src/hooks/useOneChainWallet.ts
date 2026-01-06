import { useState, useEffect, useCallback } from 'react';
import { useAccount, useConnect, useDisconnect, useBalance, useSigner } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { ethers } from 'ethers';

export interface WalletAccountWithBalance {
  address: string;
  balance?: string;
  chainId?: number;
}

export interface UseMantleWalletReturn {
  account: WalletAccountWithBalance | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  connect: () => void;
  disconnect: () => void;
  getBalance: () => Promise<string>;
  getSigner: () => Promise<ethers.Signer | null>;
  switchToMantle: () => Promise<void>;
}

export const useMantleWallet = (): UseMantleWalletReturn => {
  const [error, setError] = useState<string | null>(null);
  
  // Wagmi hooks
  const { address, isConnected: wagmiConnected, chainId } = useAccount();
  const { connect: wagmiConnect, connectors, isLoading: connectLoading } = useConnect();
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const { data: balanceData, isLoading: balanceLoading, refetch: refetchBalance } = useBalance({
    address: address,
  });
  const { openConnectModal } = useConnectModal();

  // Create account object
  const account: WalletAccountWithBalance | null = address ? {
    address,
    balance: balanceData ? ethers.formatEther(balanceData.value) : undefined,
    chainId
  } : null;

  const isConnected = wagmiConnected && !!address;
  const isLoading = connectLoading || balanceLoading;

  // Connect function that opens RainbowKit modal
  const connect = useCallback(() => {
    setError(null);
    if (openConnectModal) {
      openConnectModal();
    } else {
      // Fallback to direct connector if modal not available
      const injectedConnector = connectors.find(c => c.name === 'MetaMask' || c.name === 'Injected');
      if (injectedConnector) {
        wagmiConnect({ connector: injectedConnector });
      }
    }
  }, [openConnectModal, connectors, wagmiConnect]);

  // Disconnect function
  const disconnect = useCallback(() => {
    wagmiDisconnect();
    setError(null);
  }, [wagmiDisconnect]);

  // Get balance function
  const getBalance = useCallback(async (): Promise<string> => {
    if (!address) {
      throw new Error('No wallet connected');
    }

    try {
      const result = await refetchBalance();
      if (result.data) {
        return ethers.formatEther(result.data.value);
      }
      return '0';
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get balance';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [address, refetchBalance]);

  // Get signer function for transactions
  const getSigner = useCallback(async (): Promise<ethers.Signer | null> => {
    if (!address || typeof window === 'undefined') {
      return null;
    }

    try {
      // Get the provider from window.ethereum
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        return signer;
      }
      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get signer';
      setError(errorMessage);
      return null;
    }
  }, [address]);

  // Switch to Mantle network
  const switchToMantle = useCallback(async (): Promise<void> => {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('No wallet provider found');
    }

    try {
      // Try to switch to Mantle Sepolia Testnet
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x138B' }], // 5003 in hex
      });
    } catch (switchError: any) {
      // If the chain hasn't been added to the user's wallet, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x138B', // 5003 in hex
                chainName: 'Mantle Sepolia Testnet',
                nativeCurrency: {
                  name: 'MNT',
                  symbol: 'MNT',
                  decimals: 18,
                },
                rpcUrls: ['https://rpc.sepolia.mantle.xyz'],
                blockExplorerUrls: ['https://explorer.sepolia.mantle.xyz'],
              },
            ],
          });
        } catch (addError) {
          throw new Error('Failed to add Mantle network to wallet');
        }
      } else {
        throw new Error('Failed to switch to Mantle network');
      }
    }
  }, []);

  // Clear error when connection state changes
  useEffect(() => {
    if (isConnected) {
      setError(null);
    }
  }, [isConnected]);

  return {
    account,
    isConnected,
    isLoading,
    error,
    connect,
    disconnect,
    getBalance,
    getSigner,
    switchToMantle,
  };
};

// Type declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}
