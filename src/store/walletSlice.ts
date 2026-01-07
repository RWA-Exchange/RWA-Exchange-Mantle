import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Minimal types to satisfy legacy code without importing from deleted services
export type WalletAccount = { address: string; publicKey?: string };
export type ZkLoginData = any;
export type GoogleUserInfo = any;

// Wallet connection types
export enum WalletType {
  EXTENSION = 'extension',
  ZKLOGIN = 'zklogin',
  PROGRAMMATIC = 'programmatic',
}

export interface WalletState {
  isConnected: boolean;
  isConnecting: boolean;
  connectionError: string | null;
  account: WalletAccount | null;
  walletType: WalletType | null;

  // Legacy fields kept for compatibility but unused
  zkLoginData: any;
  isZkLogin: boolean;
  googleUserInfo: any;
  isWalletExtension: boolean;
  availableWallets: string[];
  isTransacting: boolean;
  lastTransactionHash: string | null;
  transactionError: string | null;
  balance: string;
  isLoadingBalance: boolean;
  ownedObjects: any[];
  autoConnect: boolean;
  preferredWallet: string | null;
}

const initialState: WalletState = {
  isConnected: false,
  isConnecting: false,
  connectionError: null,
  account: null,
  walletType: null,
  zkLoginData: null,
  isZkLogin: false,
  googleUserInfo: null,
  isWalletExtension: false,
  availableWallets: [],
  isTransacting: false,
  lastTransactionHash: null,
  transactionError: null,
  balance: '0',
  isLoadingBalance: false,
  ownedObjects: [],
  autoConnect: true,
  preferredWallet: null,
};

// Async thunks - No-ops
export const connectWallet = createAsyncThunk(
  'wallet/connect',
  async (walletType: WalletType, { rejectWithValue }) => {
    return { walletType };
  }
);

export const disconnectWallet = createAsyncThunk(
  'wallet/disconnect',
  async (_, { rejectWithValue }) => {
    localStorage.removeItem('Mantle_wallet');
    return null;
  }
);

export const loadBalance = createAsyncThunk(
  'wallet/loadBalance',
  async (address: string, { rejectWithValue }) => {
    return '0';
  }
);

export const sendTransaction = createAsyncThunk(
  'wallet/sendTransaction',
  async ({ recipient, amount }: { recipient: string; amount: string }, { rejectWithValue }) => {
    return 'transaction_hash';
  }
);

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setConnecting: (state, action: PayloadAction<boolean>) => { state.isConnecting = action.payload; },
    setConnectionError: (state, action: PayloadAction<string | null>) => { state.connectionError = action.payload; },
    setAccount: (state, action: PayloadAction<WalletAccount | null>) => {
      state.account = action.payload;
      state.isConnected = !!action.payload;
    },
    setWalletType: (state, action: PayloadAction<WalletType | null>) => { state.walletType = action.payload; },
    setZkLoginData: (state, action: PayloadAction<any>) => { state.zkLoginData = action.payload; },
    setGoogleUserInfo: (state, action: PayloadAction<any>) => { state.googleUserInfo = action.payload; },
    setWalletExtension: (state, action: PayloadAction<boolean>) => { state.isWalletExtension = action.payload; },
    setAvailableWallets: (state, action: PayloadAction<string[]>) => { state.availableWallets = action.payload; },
    setTransacting: (state, action: PayloadAction<boolean>) => { state.isTransacting = action.payload; },
    setTransactionError: (state, action: PayloadAction<string | null>) => { state.transactionError = action.payload; },
    setLastTransactionHash: (state, action: PayloadAction<string | null>) => { state.lastTransactionHash = action.payload; },
    setBalance: (state, action: PayloadAction<string>) => { state.balance = action.payload; },
    setLoadingBalance: (state, action: PayloadAction<boolean>) => { state.isLoadingBalance = action.payload; },
    setOwnedObjects: (state, action: PayloadAction<any[]>) => { state.ownedObjects = action.payload; },
    setAutoConnect: (state, action: PayloadAction<boolean>) => { state.autoConnect = action.payload; },
    setPreferredWallet: (state, action: PayloadAction<string | null>) => { state.preferredWallet = action.payload; },
    initializeFromStorage: (state) => { },
    clearWalletData: (state) => { return { ...initialState }; },
  },
  extraReducers: (builder) => {
    // simplified
  },
});

export const {
  setConnecting,
  setConnectionError,
  setAccount,
  setWalletType,
  setZkLoginData,
  setGoogleUserInfo,
  setWalletExtension,
  setAvailableWallets,
  setTransacting,
  setTransactionError,
  setLastTransactionHash,
  setBalance,
  setLoadingBalance,
  setOwnedObjects,
  setAutoConnect,
  setPreferredWallet,
  initializeFromStorage,
  clearWalletData,
} = walletSlice.actions;

export default walletSlice.reducer;
