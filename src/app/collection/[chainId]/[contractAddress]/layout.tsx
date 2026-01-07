import MarketplaceProvider from "@/hooks/useMarketplaceContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import type { ReactNode } from "react";

export default async function MarketplaceLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ contractAddress: string; chainId: string }>;
}) {
  const { contractAddress, chainId } = await params;
  return (
    <ErrorBoundary>
      <MarketplaceProvider
        chainId={chainId}
        contractAddress={contractAddress}
      >
        {children}
      </MarketplaceProvider>
    </ErrorBoundary>
  );
}
