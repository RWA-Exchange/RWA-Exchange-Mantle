/**
 * Test Setup Configuration
 * Sets up the testing environment for Move contracts and frontend components
 */

import { beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest';

// Mock Mantle RPC for testing
export const MOCK_RPC_URL = 'https://mock-rpc-testnet.onelabs.cc:443';
export const MOCK_PACKAGE_ID = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';

// Test wallet addresses
export const TEST_ADDRESSES = {
  PROPERTY_OWNER: '0xa1b2c3d4e5f6789012345678901234567890abcdef123456789012345678901234',
  INVESTOR_1: '0xb2c3d4e5f6789012345678901234567890abcdef123456789012345678901234a',
  INVESTOR_2: '0xc3d4e5f6789012345678901234567890abcdef123456789012345678901234ab',
  ADMIN: '0xd4e5f6789012345678901234567890abcdef123456789012345678901234abc',
};

// Mock property data for testing
export const MOCK_PROPERTY_DATA = {
  name: 'Test Luxury Villa',
  description: 'A beautiful test property for unit testing',
  imageUrl: 'https://example.com/test-property.jpg',
  location: 'Test City, Test Country',
  propertyType: 'Residential',
  totalValue: 1000000,
  totalShares: 10000,
  pricePerShare: 100,
  rentalYield: '8.5%',
};

// Mock transaction responses
export const MOCK_TRANSACTION_RESPONSE = {
  digest: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
  objectChanges: [
    {
      type: 'created',
      objectId: '0x1111222233334444555566667777888899990000aaaabbbbccccddddeeeeffff',
      objectType: 'PropertyNFT',
    },
  ],
};

// Global test setup
beforeAll(() => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.NEXT_PUBLIC_Mantle_RPC_URL = MOCK_RPC_URL;
  process.env.NEXT_PUBLIC_RWA_PACKAGE_ID = MOCK_PACKAGE_ID;
});

afterAll(() => {
  // Cleanup after all tests
});

beforeEach(() => {
  // Reset mocks before each test
  vi.clearAllMocks();
});

afterEach(() => {
  // Cleanup after each test
});

// Mock console methods to prevent sensitive data leakage in tests
export const mockConsole = () => {
  const originalConsole = { ...console };

  beforeEach(() => {
    console.log = vi.fn();
    console.error = vi.fn();
    console.warn = vi.fn();
    console.info = vi.fn();
    console.debug = vi.fn();
  });

  afterEach(() => {
    Object.assign(console, originalConsole);
  });
};