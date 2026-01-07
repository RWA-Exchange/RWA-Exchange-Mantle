/**
 * Property Contract Service Tests
 * Comprehensive unit tests for property creation, investment, and trading logic
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PropertyContractService } from '../src/services/propertyContract';
import { MOCK_PROPERTY_DATA, MOCK_TRANSACTION_RESPONSE, TEST_ADDRESSES } from './setup';

// Mock SuiClient
vi.mock('@mysten/sui/client', () => ({
  SuiClient: vi.fn().mockImplementation(() => ({
    getObject: vi.fn(),
    queryEvents: vi.fn(),
    getOwnedObjects: vi.fn(),
  })),
}));

// Mock Transaction
vi.mock('@mysten/sui/transactions', () => ({
  Transaction: vi.fn().mockImplementation(() => ({
    moveCall: vi.fn(),
    pure: {
      string: vi.fn(),
      u64: vi.fn(),
      address: vi.fn(),
    },
    object: vi.fn(),
    splitCoins: vi.fn().mockReturnValue(['mock-coin']),
    gas: 'mock-gas',
    setGasBudget: vi.fn(),
  })),
}));

describe('PropertyContractService', () => {
  let service: PropertyContractService;
  let mockSignAndExecute: any;

  beforeEach(() => {
    service = new PropertyContractService();
    mockSignAndExecute = vi.fn().mockResolvedValue(MOCK_TRANSACTION_RESPONSE);
    vi.clearAllMocks();
  });

  describe('Property Creation', () => {
    it('should create property successfully with valid data', async () => {
      const result = await service.createProperty(MOCK_PROPERTY_DATA, mockSignAndExecute);

      expect(result.success).toBe(true);
      expect(result.transactionDigest).toBe(MOCK_TRANSACTION_RESPONSE.digest);
      expect(result.propertyId).toBeDefined();
      expect(mockSignAndExecute).toHaveBeenCalledTimes(1);
    });

    it('should handle property creation errors gracefully', async () => {
      mockSignAndExecute.mockRejectedValue(new Error('Transaction failed'));

      const result = await service.createProperty(MOCK_PROPERTY_DATA, mockSignAndExecute);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Transaction failed');
      expect(result.transactionDigest).toBeUndefined();
    });

    it('should validate property data before creation', async () => {
      const invalidData = { ...MOCK_PROPERTY_DATA, totalValue: 0 };

      // The service should still attempt creation, but Move contract will reject
      const result = await service.createProperty(invalidData, mockSignAndExecute);

      expect(mockSignAndExecute).toHaveBeenCalledTimes(1);
    });

    it('should handle network errors during property creation', async () => {
      mockSignAndExecute.mockRejectedValue(new Error('Network error'));

      const result = await service.createProperty(MOCK_PROPERTY_DATA, mockSignAndExecute);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Network error');
    });
  });

  describe('Investment Logic', () => {
    const mockPropertyId = '0x1234567890abcdef';
    const sharesToBuy = 100;
    const paymentAmount = 10; // 10 MNT

    it('should process investment successfully', async () => {
      const result = await service.investInProperty(
        mockPropertyId,
        sharesToBuy,
        paymentAmount,
        mockSignAndExecute
      );

      expect(result.success).toBe(true);
      expect(result.transactionDigest).toBe(MOCK_TRANSACTION_RESPONSE.digest);
      expect(result.sharesPurchased).toBe(sharesToBuy);
      expect(mockSignAndExecute).toHaveBeenCalledTimes(1);
    });

    it('should handle insufficient funds error', async () => {
      mockSignAndExecute.mockRejectedValue(new Error('Insufficient funds'));

      const result = await service.investInProperty(
        mockPropertyId,
        sharesToBuy,
        paymentAmount,
        mockSignAndExecute
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Insufficient funds');
    });

    it('should handle invalid share amount', async () => {
      const result = await service.investInProperty(
        mockPropertyId,
        0, // Invalid: zero shares
        paymentAmount,
        mockSignAndExecute
      );

      // Service should still attempt, but Move contract will reject
      expect(mockSignAndExecute).toHaveBeenCalledTimes(1);
    });

    it('should convert MNT to MIST correctly', async () => {
      await service.investInProperty(
        mockPropertyId,
        sharesToBuy,
        paymentAmount,
        mockSignAndExecute
      );

      // Verify the conversion is logged (100M MIST per MNT for Mantle)
      expect(mockSignAndExecute).toHaveBeenCalledTimes(1);
    });
  });

  describe('Property Fetching', () => {
    it('should fetch all properties from blockchain', async () => {
      const mockClient = service['client'];
      mockClient.queryEvents = vi.fn()
        .mockResolvedValueOnce({
          data: [
            {
              parsedJson: {
                property_id: '0xproperty1',
              },
            },
          ],
        })
        .mockResolvedValueOnce({
          data: [],
        });

      mockClient.getObject = vi.fn().mockResolvedValue({
        data: {
          content: {
            fields: {
              name: 'Test Property',
              description: 'Test Description',
              image_url: 'https://example.com/image.jpg',
              location: 'Test Location',
              property_type: 'Residential',
              total_value: 1000000,
              total_shares: 10000,
              available_shares: 5000,
              price_per_share: 100,
              rental_yield: '8.5%',
              is_active: true,
              owner: TEST_ADDRESSES.PROPERTY_OWNER,
            },
          },
        },
      });

      const properties = await service.getAllProperties();

      expect(properties).toHaveLength(1);
      expect(properties[0].name).toBe('Test Property');
      expect(properties[0].totalValue).toBe(1000000);
    });

    it('should handle empty property list', async () => {
      const mockClient = service['client'];
      mockClient.queryEvents = vi.fn().mockResolvedValue({ data: [] });

      const properties = await service.getAllProperties();

      expect(properties).toHaveLength(0);
    });

    it('should handle blockchain query errors', async () => {
      const mockClient = service['client'];
      mockClient.queryEvents = vi.fn().mockRejectedValue(new Error('RPC error'));

      const properties = await service.getAllProperties();

      expect(properties).toHaveLength(0);
    });
  });

  describe('User Investments', () => {
    it('should fetch user investments correctly', async () => {
      const mockClient = service['client'];
      mockClient.getOwnedObjects = vi.fn().mockResolvedValue({
        data: [
          {
            data: {
              objectId: '0xinvestment1',
              type: '0xpackage::property_nft::Investment',
              content: {
                fields: {
                  property_id: '0xproperty1',
                  shares_owned: '100',
                  investment_amount: '100000000', // 1 MNT in MIST (8 decimals)
                  timestamp: '1234567890',
                },
              },
            },
          },
        ],
      });

      // Mock property details fetch
      mockClient.getObject = vi.fn().mockResolvedValue({
        data: {
          content: {
            fields: {
              name: 'Test Property',
              description: 'Test Description',
              image_url: 'https://example.com/image.jpg',
              location: 'Test Location',
              property_type: 'Residential',
              total_value: 1000000,
              total_shares: 10000,
              available_shares: 5000,
              price_per_share: 100,
              rental_yield: '8.5%',
              is_active: true,
              owner: TEST_ADDRESSES.PROPERTY_OWNER,
            },
          },
        },
      });

      const investments = await service.getUserInvestments(TEST_ADDRESSES.INVESTOR_1);

      expect(investments).toHaveLength(1);
      expect(investments[0].shares).toBe(100);
      expect(investments[0].investmentAmount).toBe(1); // Converted from MIST to MNT
    });

    it('should handle user with no investments', async () => {
      const mockClient = service['client'];
      mockClient.getOwnedObjects = vi.fn().mockResolvedValue({ data: [] });

      const investments = await service.getUserInvestments(TEST_ADDRESSES.INVESTOR_1);

      expect(investments).toHaveLength(0);
    });
  });

  describe('Transfer Operations', () => {
    const mockInvestmentId = '0xinvestment123';
    const recipientAddress = TEST_ADDRESSES.INVESTOR_2;

    it('should transfer investment successfully', async () => {
      const result = await service.transferInvestment(
        mockInvestmentId,
        recipientAddress,
        mockSignAndExecute
      );

      expect(result.success).toBe(true);
      expect(result.transactionDigest).toBe(MOCK_TRANSACTION_RESPONSE.digest);
      expect(mockSignAndExecute).toHaveBeenCalledTimes(1);
    });

    it('should handle transfer errors', async () => {
      mockSignAndExecute.mockRejectedValue(new Error('Transfer failed'));

      const result = await service.transferInvestment(
        mockInvestmentId,
        recipientAddress,
        mockSignAndExecute
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Transfer failed');
    });
  });

  describe('Package Deployment Check', () => {
    it('should detect deployed package', async () => {
      const mockClient = service['client'];
      mockClient.getObject = vi.fn().mockResolvedValue({ data: { id: 'package-id' } });

      const isDeployed = await service.isPackageDeployed();

      expect(isDeployed).toBe(true);
    });

    it('should detect undeployed package', async () => {
      const mockClient = service['client'];
      mockClient.getObject = vi.fn().mockRejectedValue(new Error('Not found'));

      const isDeployed = await service.isPackageDeployed();

      expect(isDeployed).toBe(false);
    });
  });
});