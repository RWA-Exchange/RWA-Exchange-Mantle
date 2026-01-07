import { ethers } from 'ethers';
import { logger } from '../utils/secureLogger';

const RPC_URL = process.env.NEXT_PUBLIC_MANTLE_RPC_URL || 'https://rpc.sepolia.mantle.xyz';
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_PROPERTY_NFT_ADDRESS || '';

export interface PropertyData {
  name: string;
  description: string;
  imageUrl: string;
  location: string;
  propertyType: string;
  totalValue: number;
  totalShares: number;
  pricePerShare: number;
  rentalYield: string;
}

export interface CreatePropertyResult {
  success: boolean;
  transactionHash?: string;
  propertyId?: number;
  error?: string;
}

export interface InvestResult {
  success: boolean;
  transactionHash?: string;
  sharesPurchased?: number;
  error?: string;
}

export interface TransferResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

// Property NFT ABI (essential functions only)
const PROPERTY_NFT_ABI = [
  "function createProperty((string name, string description, string imageUrl, string location, string propertyType, uint256 totalValue, uint256 totalShares, uint256 pricePerShare, string rentalYield, string metadataURI)) returns (uint256)",
  "function invest(uint256 propertyId, uint256 sharesToBuy) payable",
  "function transferShares(uint256 propertyId, address to, uint256 shares)",
  "function claimDividends(uint256 propertyId)",
  "function distributeDividends(uint256 propertyId) payable",
  "function properties(uint256) view returns (string name, string description, string imageUrl, string location, string propertyType, uint256 totalValue, uint256 totalShares, uint256 availableShares, uint256 pricePerShare, string rentalYield, bool isActive, address owner, uint256 treasury, uint256 createdAt, uint256 lastDividendDistribution)",
  "function userShares(uint256 propertyId, address user) view returns (uint256)",
  "function userInvestments(address user, uint256 index) view returns (uint256)",
  "event PropertyCreated(uint256 indexed propertyId, string name, uint256 totalValue, uint256 totalShares, uint256 pricePerShare, address indexed owner, uint256 timestamp)",
  "event InvestmentMade(uint256 indexed propertyId, address indexed investor, uint256 sharesPurchased, uint256 amountPaid, uint256 timestamp)",
  "event InvestmentTransferred(uint256 indexed propertyId, address indexed from, address indexed to, uint256 shares)"
];

export class PropertyContractService {
  private provider: ethers.JsonRpcProvider;
  private contract: ethers.Contract;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(RPC_URL);
    this.contract = new ethers.Contract(CONTRACT_ADDRESS, PROPERTY_NFT_ABI, this.provider) as any;
  }

  /**
   * Create a new property NFT on Mantle blockchain
   */
  async createProperty(
    propertyData: PropertyData,
    signer: ethers.Signer,
    tokenURI: string = ''
  ): Promise<CreatePropertyResult> {
    try {
      logger.property('Creating property NFT transaction', { name: propertyData.name });

      // Connect contract with signer
      const contractWithSigner = this.contract.connect(signer);

      // Call createProperty function with struct parameter
      const propertyDataStruct = {
        name: propertyData.name,
        description: propertyData.description,
        imageUrl: propertyData.imageUrl,
        location: propertyData.location,
        propertyType: propertyData.propertyType,
        totalValue: BigInt(propertyData.totalValue),
        totalShares: BigInt(propertyData.totalShares),
        pricePerShare: ethers.parseEther(propertyData.pricePerShare.toString()), // Store in wei (MNT)
        rentalYield: propertyData.rentalYield,
        metadataURI: tokenURI
      };

      const tx = await (contractWithSigner as any).createProperty(propertyDataStruct);

      logger.property('Transaction sent', { hash: tx.hash });

      // Wait for transaction confirmation
      const receipt = await tx.wait();

      if (receipt?.status === 1) {
        // Extract property ID from events
        const propertyCreatedEvent = receipt.logs.find((log: any) => {
          try {
            const parsed = this.contract.interface.parseLog(log);
            return parsed?.name === 'PropertyCreated';
          } catch {
            return false;
          }
        });

        let propertyId;
        if (propertyCreatedEvent) {
          const parsed = this.contract.interface.parseLog(propertyCreatedEvent);
          propertyId = parsed?.args?.propertyId?.toString();
        }

        logger.property('Property created successfully', {
          hash: receipt.hash,
          propertyId
        });

        return {
          success: true,
          transactionHash: receipt.hash,
          propertyId: propertyId ? parseInt(propertyId) : undefined
        };
      } else {
        throw new Error('Transaction failed');
      }

    } catch (error: any) {
      logger.error('Property creation failed', { error: error.message });
      return {
        success: false,
        error: error.message || 'Failed to create property'
      };
    }
  }

  /**
   * Invest in a property by purchasing shares with MNT
   */
  async invest(
    propertyId: number,
    sharesToBuy: number,
    pricePerShare: string,
    signer: ethers.Signer
  ): Promise<InvestResult> {
    try {
      logger.property('Creating investment transaction', { propertyId, sharesToBuy });

      // Connect contract with signer
      const contractWithSigner = this.contract.connect(signer);

      // Calculate total cost in MNT (assuming pricePerShare is in wei/smallest unit)
      // Convert pricePerShare string to number, multiply by shares, then to wei
      const pricePerShareNum = parseFloat(pricePerShare);
      const totalCostInEther = pricePerShareNum * sharesToBuy;
      const totalCost = ethers.parseEther(totalCostInEther.toString());

      // Call invest function with MNT payment
      const tx = await (contractWithSigner as any).invest(propertyId, sharesToBuy, {
        value: totalCost
      });

      logger.property('Investment transaction sent', { hash: tx.hash });

      // Wait for transaction confirmation
      const receipt = await tx.wait();

      if (receipt?.status === 1) {
        logger.property('Investment successful', {
          hash: receipt.hash,
          propertyId,
          shares: sharesToBuy
        });

        return {
          success: true,
          transactionHash: receipt.hash,
          sharesPurchased: sharesToBuy
        };
      } else {
        throw new Error('Transaction failed');
      }

    } catch (error: any) {
      logger.error('Investment failed', { error: error.message });
      return {
        success: false,
        error: error.message || 'Failed to invest in property'
      };
    }
  }

  /**
   * Transfer shares to another address
   */
  async transferShares(
    propertyId: number,
    toAddress: string,
    shares: number,
    signer: ethers.Signer
  ): Promise<TransferResult> {
    try {
      logger.property('Creating share transfer transaction', { propertyId, toAddress, shares });

      // Connect contract with signer
      const contractWithSigner = this.contract.connect(signer);

      // Call transferShares function
      const tx = await (contractWithSigner as any).transferShares(propertyId, toAddress, shares);

      logger.property('Transfer transaction sent', { hash: tx.hash });

      // Wait for transaction confirmation
      const receipt = await tx.wait();

      if (receipt?.status === 1) {
        logger.property('Share transfer successful', {
          hash: receipt.hash,
          propertyId,
          shares
        });

        return {
          success: true,
          transactionHash: receipt.hash
        };
      } else {
        throw new Error('Transaction failed');
      }

    } catch (error: any) {
      logger.error('Share transfer failed', { error: error.message });
      return {
        success: false,
        error: error.message || 'Failed to transfer shares'
      };
    }
  }

  /**
   * Get property information from blockchain
   */
  async getPropertyInfo(propertyId: number) {
    try {
      const result = await (this.contract as any).properties(propertyId);

      return {
        name: result.name,
        description: result.description,
        imageUrl: result.imageUrl,
        location: result.location,
        propertyType: result.propertyType,
        totalValue: result.totalValue.toString(),
        totalShares: result.totalShares.toString(),
        availableShares: result.availableShares.toString(),
        pricePerShare: ethers.formatEther(result.pricePerShare), // Convert from wei to ether
        rentalYield: result.rentalYield,
        isActive: result.isActive,
        owner: result.owner,
        id: propertyId // Add ID to return object
      };
    } catch (error: any) {
      logger.error('Failed to get property info', { error: error.message, propertyId });
      throw error;
    }
  }

  /**
   * Get user's shares in a property
   */
  async getUserShares(propertyId: number, userAddress: string): Promise<number> {
    try {
      const shares = await this.contract.userShares(propertyId, userAddress);
      return parseInt(shares.toString());
    } catch (error: any) {
      logger.error('Failed to get user shares', { error: error.message, propertyId, userAddress });
      return 0;
    }
  }

  /**
   * Get user's investment portfolio with full details
   */
  async getUserInvestments(userAddress: string): Promise<any[]> {
    try {
      if (!userAddress) return [];

      const investments = [];
      let index = 0;

      // Public mapping getters for arrays require index access: contract.userInvestments(address, index)
      while (true) {
        try {
          const propertyId = await this.contract.userInvestments(userAddress, index);
          const id = Number(propertyId);

          if (!id) break;

          const info = await this.getPropertyInfo(id);
          const shares = await this.getUserShares(id, userAddress);

          investments.push({
            id: id.toString(),
            propertyId: id.toString(),
            propertyName: info.name,
            shares: shares,
            investmentAmount: shares * parseFloat(info.pricePerShare),
            timestamp: Date.now(),
            propertyDetails: info
          });

          index++;
        } catch (error) {
          // End of array reached
          break;
        }
      }

      return investments.filter(inv => inv.shares > 0);
    } catch (error: any) {
      logger.error('Failed to get user investments', { error: error.message, userAddress });
      return [];
    }
  }

  /**
   * Get treasury balance for a property
   */
  async getTreasuryBalance(propertyId: number): Promise<string> {
    try {
      const balance = await this.contract.getTreasuryBalance(propertyId);
      return ethers.formatEther(balance);
    } catch (error: any) {
      logger.error('Failed to get treasury balance', { error: error.message, propertyId });
      return '0';
    }
  }

  /**
   * Claim dividends for a property investment
   */
  async claimDividends(propertyId: number, signer: ethers.Signer): Promise<TransferResult> {
    try {
      logger.property('Claiming dividends', { propertyId });

      // Connect contract with signer
      const contractWithSigner = this.contract.connect(signer);

      // Call claimDividends function
      const tx = await (contractWithSigner as any).claimDividends(propertyId);

      logger.property('Claim dividends transaction sent', { hash: tx.hash });

      // Wait for transaction confirmation
      const receipt = await tx.wait();

      if (receipt?.status === 1) {
        logger.property('Dividends claimed successfully', {
          hash: receipt.hash,
          propertyId
        });

        return {
          success: true,
          transactionHash: receipt.hash
        };
      } else {
        throw new Error('Transaction failed');
      }

    } catch (error: any) {
      logger.error('Dividend claim failed', { error: error.message });
      return {
        success: false,
        error: error.message || 'Failed to claim dividends'
      };
    }
  }

  /**
   * Get all properties
   */
  async getAllProperties(): Promise<any[]> {
    try {
      const properties: any[] = [];

      // Properties start from ID 1 and increment
      // Try to fetch properties until we hit one that doesn't exist
      let propertyId = 1;
      const maxProperties = 100; // Safety limit

      while (propertyId <= maxProperties) {
        try {
          const property = await this.getPropertyInfo(propertyId);

          // Check if property exists and is valid
          if (property && property.name && property.totalShares > 0) {
            properties.push(property);
            propertyId++;
          } else {
            // No more properties
            break;
          }
        } catch (error: any) {
          // Property doesn't exist, we've reached the end
          break;
        }
      }

      logger.property(`Found ${properties.length} properties`);
      return properties;
    } catch (error: any) {
      logger.error('Failed to get all properties', { error: error.message });
      return [];
    }
  }
}

// Export singleton instance
export const propertyContractService = new PropertyContractService();
