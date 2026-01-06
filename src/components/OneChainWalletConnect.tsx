import React, { useCallback } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useMantleWallet } from '@/hooks/useOneChainWallet';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  setConnecting,
  setAccount,
  setWalletType,
  setConnectionError,
  WalletType,
  disconnectWallet,
} from '@/store/walletSlice';

interface MantleWalletConnectProps {
  onConnect?: () => void;
  onDisconnect?: () => void;
  className?: string;
}

export const MantleWalletConnect: React.FC<MantleWalletConnectProps> = ({
  onConnect,
  onDisconnect,
  className = '',
}) => {
  const dispatch = useAppDispatch();
  const { account, isConnected, error, switchToMantle } = useMantleWallet();

  const handleConnect = useCallback(() => {
    if (isConnected && account) {
      dispatch(setAccount(account));
      dispatch(setWalletType(WalletType.EXTENSION));
      onConnect?.();
    }
  }, [isConnected, account, dispatch, onConnect]);

  const handleDisconnect = useCallback(() => {
    dispatch(disconnectWallet());
    onDisconnect?.();
  }, [dispatch, onDisconnect]);

  const handleSwitchToMantle = useCallback(async () => {
    try {
      await switchToMantle();
    } catch (error) {
      dispatch(setConnectionError('Failed to switch to Mantle network'));
    }
  }, [switchToMantle, dispatch]);

  // Update store when connection state changes
  React.useEffect(() => {
    if (isConnected && account) {
      handleConnect();
    }
  }, [isConnected, account, handleConnect]);

  // Update store with errors
  React.useEffect(() => {
    if (error) {
      dispatch(setConnectionError(error));
    }
  }, [error, dispatch]);

  return (
    <div className={`wallet-connect ${className}`}>
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
          // Note: If your app doesn't use authentication, you
          // can remove all 'authenticationStatus' checks
          const ready = mounted && authenticationStatus !== 'loading';
          const connected =
            ready &&
            account &&
            chain &&
            (!authenticationStatus ||
              authenticationStatus === 'authenticated');

          return (
            <div
              {...(!ready && {
                'aria-hidden': true,
                'style': {
                  opacity: 0,
                  pointerEvents: 'none',
                  userSelect: 'none',
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <button
                      onClick={openConnectModal}
                      type="button"
                      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
                    >
                      <span>🔗</span>
                      <span>Connect Wallet</span>
                    </button>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={openChainModal}
                        type="button"
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        Wrong network
                      </button>
                      <button
                        onClick={handleSwitchToMantle}
                        type="button"
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                      >
                        Switch to Mantle
                      </button>
                    </div>
                  );
                }

                return (
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={openChainModal}
                      style={{ display: 'flex', alignItems: 'center' }}
                      type="button"
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                    >
                      {chain.hasIcon && (
                        <div
                          style={{
                            background: chain.iconBackground,
                            width: 12,
                            height: 12,
                            borderRadius: 999,
                            overflow: 'hidden',
                            marginRight: 4,
                          }}
                        >
                          {chain.iconUrl && (
                            <img
                              alt={chain.name ?? 'Chain icon'}
                              src={chain.iconUrl}
                              style={{ width: 12, height: 12 }}
                            />
                          )}
                        </div>
                      )}
                      {chain.name}
                    </button>

                    <button
                      onClick={openAccountModal}
                      type="button"
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                    >
                      <span>{account.displayName}</span>
                      <span className="text-xs opacity-75">
                        {account.displayBalance
                          ? ` (${account.displayBalance})`
                          : ''}
                      </span>
                    </button>
                  </div>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}
    </div>
  );
};