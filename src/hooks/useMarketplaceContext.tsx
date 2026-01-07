"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { propertyContractService } from '@/services/propertyContract';
import { useAccount } from 'wagmi';
import { useEthersSigner } from '@/hooks/useEthersSigner';
import { NftContract } from '@/consts/nft_contracts';
import { WalletSyncUtil } from '@/utils/walletSync';

export interface MarketplaceAsset {
  id: string;
  contractAddress: string;
  tokenId: string; // Used as propertyId for Mantle
  title: string;
  description: string;
  imageUrl: string;
  price: string;
  currency: string;
  owner: string;
  isListed: boolean;
  assetType: 'property' | 'art' | 'commodity' | 'vehicle' | 'other';
  metadata: {
    location?: string;
    size?: string;
    yearBuilt?: number;
    appraisedValue?: string;
    rentalYield?: string;
    availableShares?: number;
    totalShares?: number;
    [key: string]: any;
  };
}

export interface MarketplaceListing {
  id: string;
  assetId: string;
  seller: string;
  price: string;
  currency: string;
  listingDate: Date;
  expirationDate?: Date;
  isActive: boolean;
  fractionalShares?: {
    totalShares: number;
    availableShares: number;
    pricePerShare: string;
  };
}

export interface MarketplaceTransaction {
  id: string;
  type: 'buy' | 'sell' | 'list' | 'delist';
  assetId: string;
  buyer?: string;
  seller?: string;
  price: string;
  currency: string;
  timestamp: Date;
  transactionHash: string;
  status: 'pending' | 'completed' | 'failed';
}

interface MarketplaceContextType {
  // Contract Info
  chainId: string;
  contractAddress: string;
  contract: NftContract | null;

  // Assets & Listings
  assets: MarketplaceAsset[];
  listings: MarketplaceListing[];
  transactions: MarketplaceTransaction[];

  // Loading States
  isLoading: boolean;
  isLoadingAssets: boolean;
  isLoadingListings: boolean;

  // Error States
  error: string | null;

  // Actions
  loadAssets: () => Promise<void>;
  loadListings: () => Promise<void>;
  loadTransactions: () => Promise<void>;

  // Trading Actions
  buyAsset: (assetId: string, price: string) => Promise<string>;
  sellAsset: (assetId: string, price: string) => Promise<string>;
  listAsset: (assetId: string, price: string, fractionalShares?: number) => Promise<string>;
  delistAsset: (listingId: string) => Promise<string>;

  // Investment Actions
  investInAsset: (assetId: string, amount: string) => Promise<string>;
  claimDividends: (assetId: string) => Promise<string>;

  // Utility Functions
  getAssetById: (assetId: string) => MarketplaceAsset | null;
  getListingById: (listingId: string) => MarketplaceListing | null;
  getUserAssets: (userAddress: string) => MarketplaceAsset[];
  getUserListings: (userAddress: string) => MarketplaceListing[];

  // Refresh Functions
  refresh: () => Promise<void>;
  refreshAssets: () => Promise<void>;
  refreshListings: () => Promise<void>;
}

const MarketplaceContext = createContext<MarketplaceContextType | null>(null);

interface MarketplaceProviderProps {
  children: ReactNode;
  chainId: string;
  contractAddress: string;
}

export default function MarketplaceProvider({
  children,
  chainId,
  contractAddress
}: MarketplaceProviderProps) {
  const [contract, setContract] = useState<NftContract | null>(null);
  const [assets, setAssets] = useState<MarketplaceAsset[]>([]);
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [transactions, setTransactions] = useState<MarketplaceTransaction[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);
  const [isLoadingListings, setIsLoadingListings] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { address, isConnected } = useAccount();
  const signer = useEthersSigner();

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, [contractAddress]);

  // Reload listings when assets change
  useEffect(() => {
    if (assets.length > 0) {
      loadListings();
    }
  }, [assets]);

  const loadInitialData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await loadAssets();
      await loadListings();
      await loadTransactions();
    } catch (err) {
      console.error('Failed to load initial marketplace data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load marketplace data');
    } finally {
      setIsLoading(false);
    }
  };

  const loadAssets = async (): Promise<void> => {
    setIsLoadingAssets(true);
    setError(null);

    try {
      // Get real properties from Mantle blockchain
      const properties = await propertyContractService.getAllProperties();

      const marketAssets: MarketplaceAsset[] = properties.map(p => ({
        id: p.id.toString(),
        contractAddress,
        tokenId: p.id.toString(),
        title: p.name,
        description: p.description,
        imageUrl: p.imageUrl,
        price: p.pricePerShare,
        currency: 'MNT',
        owner: p.owner,
        isListed: p.isActive,
        assetType: 'property',
        metadata: {
          location: p.location,
          size: `${p.totalShares} shares`,
          yearBuilt: 2024,
          appraisedValue: `${p.totalValue} MNT`,
          rentalYield: p.rentalYield,
          availableShares: Number(p.availableShares),
          totalShares: Number(p.totalShares),
          propertyType: p.propertyType
        }
      }));

      setAssets(marketAssets);

    } catch (err) {
      console.error('Failed to load assets:', err);
      setError(err instanceof Error ? err.message : 'Failed to load assets');
      setAssets([]);
    } finally {
      setIsLoadingAssets(false);
    }
  };

  const loadListings = async (): Promise<void> => {
    setIsLoadingListings(true);
    setError(null);

    try {
      // Create listings for all available assets
      const activeListings: MarketplaceListing[] = assets.map((asset, index) => ({
        id: `listing-${asset.id}`,
        assetId: asset.id,
        seller: asset.owner,
        price: asset.price,
        currency: asset.currency,
        listingDate: new Date(),
        isActive: asset.isListed,
        fractionalShares: asset.metadata.totalShares ? {
          totalShares: asset.metadata.totalShares,
          availableShares: asset.metadata.availableShares || asset.metadata.totalShares,
          pricePerShare: asset.price
        } : undefined
      }));

      setListings(activeListings);
    } catch (err) {
      console.error('Failed to load listings:', err);
      setError(err instanceof Error ? err.message : 'Failed to load listings');
    } finally {
      setIsLoadingListings(false);
    }
  };

  const loadTransactions = async (): Promise<void> => {
    // Placeholder for transactions
    setTransactions([]);
  };

  const buyAsset = async (assetId: string, price: string): Promise<string> => {
    // This maps to "invest" in our contract if simplified
    // But typically buyAsset implies buying from listing. 
    // For this refactor, I will map it to invest() assuming fractional purchase 
    // But buyAsset usually takes raw price. 
    // If we assume price is actually "shares" to buy? No, price is price.
    // Let's assume assetId is propertyId and we are buying 1 share for simplicity or throw error
    throw new Error("Use investInAsset for fractional properties");
  };

  const sellAsset = async (assetId: string, price: string): Promise<string> => {
    throw new Error("Secondary market selling not yet implemented on Mantle");
  };

  const listAsset = async (assetId: string, price: string, fractionalShares?: number): Promise<string> => {
    throw new Error("Listing not yet implemented");
  };

  const delistAsset = async (listingId: string): Promise<string> => {
    throw new Error("Delisting not yet implemented");
  };

  const investInAsset = async (assetId: string, amount: string): Promise<string> => {
    if (!signer) throw new Error("Wallet not connected");

    const asset = getAssetById(assetId);
    if (!asset) throw new Error("Asset not found");

    // Let's assume for now the UI passes number of shares as string in 'amount'
    const sharesToBuy = parseInt(amount);

    const result = await propertyContractService.invest(
      parseInt(assetId),
      sharesToBuy,
      asset.price, // price per share
      signer
    );

    if (result.success) {
      await refresh();
      return result.transactionHash || 'success';
    } else {
      throw new Error(result.error);
    }
  };

  const claimDividends = async (assetId: string): Promise<string> => {
    if (!signer) throw new Error("Wallet not connected");
    const result = await propertyContractService.claimDividends(parseInt(assetId), signer);
    if (result.success) return result.transactionHash || 'success';
    throw new Error(result.error);
  };

  // Utility functions
  const getAssetById = (assetId: string): MarketplaceAsset | null => {
    return assets.find(asset => asset.id === assetId) || null;
  };

  const getListingById = (listingId: string): MarketplaceListing | null => {
    return listings.find(listing => listing.id === listingId) || null;
  };

  const getUserAssets = (userAddress: string): MarketplaceAsset[] => {
    return assets.filter(asset => asset.owner.toLowerCase() === userAddress.toLowerCase());
  };

  const getUserListings = (userAddress: string): MarketplaceListing[] => {
    return listings.filter(listing => listing.seller.toLowerCase() === userAddress.toLowerCase());
  };

  const refresh = async (): Promise<void> => {
    await loadInitialData();
  };

  const refreshAssets = async (): Promise<void> => {
    await loadAssets();
  };

  const refreshListings = async (): Promise<void> => {
    await loadListings();
  };

  const contextValue: MarketplaceContextType = {
    chainId,
    contractAddress,
    contract,
    assets,
    listings,
    transactions,
    isLoading,
    isLoadingAssets,
    isLoadingListings,
    error,
    loadAssets,
    loadListings,
    loadTransactions,
    buyAsset,
    sellAsset,
    listAsset,
    delistAsset,
    investInAsset,
    claimDividends,
    getAssetById,
    getListingById,
    getUserAssets,
    getUserListings,
    refresh,
    refreshAssets,
    refreshListings,
  };

  return (
    <MarketplaceContext.Provider value={contextValue}>
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplaceContext(): MarketplaceContextType {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplaceContext must be used within a MarketplaceProvider');
  }
  return context;
}