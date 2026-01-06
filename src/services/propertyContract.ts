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
  "function createProperty(string name, string description, string imageUrl, string location, string propertyType, uint256 totalValue, uint256 totalShares, uint256 pricePerShare, string rentalYield, string tokenURI) returns (uint256)",
  "function invest(uint256 propertyId, uint256 sharesToBuy) payable",
  "function transferShares(uint256 propertyId, address to, uint256 shares)",
  "function claimDividends(uint256 propertyId)",
  "function distributeDividends(uint256 propertyId) payable",
  "function getPropertyInfo(uint256 propertyId) view returns (string, string, string, string, string, uint256, uint256, uint256, uint256, string, bool, address)",
  "function getUserShares(uint256 propertyId, address user) view returns (uint256)",
  "function getTreasuryBalance(uint256 propertyId) view returns (uint256)",
  "function getUserInvestments(address user) view returns (uint256[])",
  "event PropertyCreated(uint256 indexed propertyId, string name, uint256 totalValue, uint256 totalShares, uint256 pricePerShare, address indexed owner)",
  "event InvestmentMade(uint256 indexed propertyId, address indexed investor, uint256 sharesPurchased, uint256 amountPaid, uint256 timestamp)",
  "event InvestmentTransferred(uint256 indexed propertyId, address indexed from, address indexed to, uint256 shares)"
];

export class PropertyContractService {
  private provider: ethers.JsonRpcProvider;
  private contract: ethers.Contract;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(RPC_URL);
    this.contract = new ethers.Contract(CONTRACT_ADDRESS, PROPERTY_NFT_ABI, this.provider);
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
      
      // Call createProperty function
      const tx = await contractWithSigner.createProperty(
        propertyData.name,
        propertyData.description,
        propertyData.imageUrl,
        propertyData.location,
        propertyData.propertyType,
        ethers.parseEther(propertyData.totalValue.toString()),
        propertyData.totalShares,
        ethers.parseEther(propertyData.pricePerShare.toString()),
        propertyData.rentalYield,
        tokenURI
      );

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
          hash: receipt.transactionHash,
          propertyId 
        });

        return {
          success: true,
          transactionHash: receipt.transactionHash,
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
      
      // Calculate total cost in MNT
      const totalCost = ethers.parseEther((parseFloat(pricePerShare) * sharesToBuy).toString());
      
      // Call invest function with MNT payment
      const tx = await contractWithSigner.invest(propertyId, sharesToBuy, {
        value: totalCost
      });

      logger.property('Investment transaction sent', { hash: tx.hash });
      
      // Wait for transaction confirmation
      const receipt = await tx.wait();
      
      if (receipt?.status === 1) {
        logger.property('Investment successful', { 
          hash: receipt.transactionHash,
          propertyId,
          shares: sharesToBuy 
        });

        return {
          success: true,
          transactionHash: receipt.transactionHash,
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
      const tx = await contractWithSigner.transferShares(propertyId, toAddress, shares);

      logger.property('Transfer transaction sent', { hash: tx.hash });
      
      // Wait for transaction confirmation
      const receipt = await tx.wait();
      
      if (receipt?.status === 1) {
        logger.property('Share transfer successful', { 
          hash: receipt.transactionHash,
          propertyId,
          shares 
        });

        return {
          success: true,
          transactionHash: receipt.transactionHash
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
      const result = await this.contract.getPropertyInfo(propertyId);
      
      return {
        name: result[0],
        description: result[1],
        imageUrl: result[2],
        location: result[3],
        propertyType: result[4],
        totalValue: ethers.formatEther(result[5]),
        totalShares: result[6].toString(),
        availableShares: result[7].toString(),
        pricePerShare: ethers.formatEther(result[8]),
        rentalYield: result[9],
        isActive: result[10],
        owner: result[11]
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
      const shares = await this.contract.getUserShares(propertyId, userAddress);
      return parseInt(shares.toString());
    } catch (error: any) {
      logger.error('Failed to get user shares', { error: error.message, propertyId, userAddress });
      return 0;
    }
  }

  /**
   * Get user's investment portfolio
   */
  async getUserInvestments(userAddress: string): Promise<number[]> {
    try {
      const investments = await this.contract.getUserInvestments(userAddress);
      return investments.map((id: any) => parseInt(id.toString()));
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
      const tx = await contractWithSigner.claimDividends(propertyId);

      logger.property('Claim dividends transaction sent', { hash: tx.hash });
      
      // Wait for transaction confirmation
      const receipt = await tx.wait();
      
      if (receipt?.status === 1) {
        logger.property('Dividends claimed successfully', { 
          hash: receipt.transactionHash,
          propertyId 
        });

        return {
          success: true,
          transactionHash: receipt.transactionHash
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
}

// Export singleton instance
export const propertyContractService = new PropertyContractService();
      logger.info('Letting dapp-kit handle gas budget automatically');

      // Execute transaction using dapp-kit
      logger.transaction('Executing with dapp-kit');
      const result = await signAndExecuteTransaction(tx);

      logger.transaction('Successful', { digest: result.digest });

      // Extract property ID from object changes
      const createdObjects = result.objectChanges?.filter(
        (change: any) => change.type === 'created'
      );

      const propertyObject = createdObjects?.find((obj: any) =>
        obj.objectType?.includes('PropertyNFT')
      );

      logger.property('NFT Created', { objectId: propertyObject?.objectId });

      return {
        success: true,
        transactionDigest: result.digest,
        propertyId: propertyObject?.objectId,
      };
    } catch (error) {
      logger.error('Error creating property', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get property details from blockchain
   */
  async getProperty(propertyId: string) {
    try {
      const object = await this.client.getObject({
        id: propertyId,
        options: { showContent: true },
      });

      return object.data;
    } catch (error) {
      logger.error('Error fetching property', error);
      return null;
    }
  }

  /**
   * Invest in a property (buy fractional shares) using dapp-kit
   */
  async investInProperty(
    propertyId: string,
    sharesToBuy: number,
    paymentAmount: number,
    signAndExecuteTransaction: (tx: Transaction) => Promise<any>
  ): Promise<InvestResult> {
    try {
      logger.investment('Creating transaction', {
        shares: sharesToBuy,
        amount: paymentAmount
      });

      // Create transaction following helper repo pattern EXACTLY
      const tx = new Transaction();

      // Convert OCT to MIST (1 OCT = 100,000,000 MIST for OneChain)
      const paymentInMist = Math.floor(paymentAmount * 100_000_000);
      logger.investment('Payment conversion', { 
        oct: paymentAmount, 
        mist: paymentInMist 
      });

      // REAL FIX: The issue is tx.gas gets refunded! We need to use actual wallet coins
      // Instead of splitting from gas, we need to use the user's actual OCT coins
      // This is the EXACT same pattern as helper repo but they use a shared game object
      const [coin] = tx.splitCoins(tx.gas, [paymentInMist]);
      




      // Call the invest function with proper argument structure
      tx.moveCall({
        target: `${PACKAGE_ID}::property_nft::invest`,
        arguments: [
          tx.object(propertyId),       // Property NFT object (shared object)
          coin,                        // Payment coin (from splitCoins)
          tx.pure.u64(sharesToBuy),   // Number of shares to buy
        ],
      });



      // REAL FIX: Don't set gas budget at all - let wallet handle it automatically
      // The helper repo doesn't set gas budget and it works perfectly
      // Setting gas budget causes the split coin to be refunded
      // tx.setGasBudget(totalBudget); // REMOVED - this was causing the refund issue
      

      logger.info('Gas budget: Auto (wallet managed) - this should fix the payment issue');

      // Execute transaction using dapp-kit with proper error handling
      logger.transaction('Executing investment');
      const result = await signAndExecuteTransaction(tx);

      logger.investment('Successful', { digest: result.digest });

      // Extract investment ID from created objects
      const createdObjects = result.objectChanges?.filter(
        (change: any) => change.type === 'created'
      );

      const investmentObject = createdObjects?.find((obj: any) =>
        obj.objectType?.includes('Investment')
      );

      logger.investment('NFT Created', { objectId: investmentObject?.objectId });

      return {
        success: true,
        transactionDigest: result.digest,
        investmentId: investmentObject?.objectId,
        sharesPurchased: sharesToBuy,
      };
    } catch (error) {
      logger.error('Error investing in property', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Transfer investment shares to another address using dapp-kit
   */
  async transferInvestment(
    investmentId: string,
    recipientAddress: string,
    signAndExecuteTransaction: (tx: Transaction) => Promise<any>
  ): Promise<TransferResult> {
    try {
      logger.transaction('Creating transfer');
      
      const tx = new Transaction();

      tx.moveCall({
        target: `${PACKAGE_ID}::property_nft::transfer_investment`,
        arguments: [
          tx.object(investmentId),
          tx.pure.address(recipientAddress),
        ],
      });

      tx.setGasBudget(30_000_000); // 0.03 OCT
      logger.info('Gas budget set: 0.03 OCT');

      // Execute transaction using dapp-kit
      logger.transaction('Executing transfer');
      const result = await signAndExecuteTransaction(tx);

      logger.transaction('Transfer successful', { digest: result.digest });

      return {
        success: true,
        transactionDigest: result.digest,
      };
    } catch (error) {
      logger.error('Error transferring investment', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get all listed properties from blockchain with FULL details
   */
  async getAllProperties() {
    try {
      logger.blockchain('Fetching properties');
      logger.debug('Package IDs', { current: PACKAGE_ID, old: OLD_PACKAGE_ID });
      
      // Query properties from BOTH old and new package IDs
      const [newResponse, oldResponse] = await Promise.all([
        this.client.queryEvents({
          query: {
            MoveEventType: `${PACKAGE_ID}::property_nft::PropertyCreated`,
          },
          limit: 50,
        }),
        this.client.queryEvents({
          query: {
            MoveEventType: `${OLD_PACKAGE_ID}::property_nft::PropertyCreated`,
          },
          limit: 50,
        })
      ]);

      // Combine events from both packages
      const allEvents = [...newResponse.data, ...oldResponse.data];
      logger.blockchain('Found property creation events', { 
        total: allEvents.length,
        new: newResponse.data.length,
        old: oldResponse.data.length
      });

      // Fetch full details for each property
      const propertiesWithDetails = await Promise.all(
        allEvents.map(async (event: any) => {
          const parsedJson = event.parsedJson;
          const propertyId = parsedJson.property_id;
          
          logger.debug('Fetching property details', { propertyId });
          
          // Get full property details from blockchain
          const details = await this.getPropertyDetails(propertyId);
          
          if (details) {
            logger.property('Details fetched', {
              name: details.name,
              availableShares: details.availableShares,
              totalShares: details.totalShares,
              pricePerShare: details.pricePerShare
            });
            
            return {
              id: details.id,
              title: details.name,
              name: details.name,
              description: details.description,
              thumbnail: details.imageUrl,
              imageUrl: details.imageUrl,
              location: details.location,
              type: details.propertyType,
              propertyType: details.propertyType,
              totalValue: details.totalValue,
              totalShares: details.totalShares,
              availableShares: details.availableShares,
              pricePerShare: details.pricePerShare,
              rentalYield: details.rentalYield,
              isActive: details.isActive,
              owner: details.owner,
            };
          }
          
          logger.warn('Could not fetch property details', { propertyId });
          return null;
        })
      );

      // Filter out null values
      const validProperties = propertiesWithDetails.filter(p => p !== null);
      logger.blockchain('Properties loaded', { count: validProperties.length });
      
      return validProperties;
    } catch (error) {
      logger.error('Error fetching properties', error);
      return [];
    }
  }

  /**
   * Get property details with full information
   */
  async getPropertyDetails(propertyId: string) {
    try {
      const object = await this.client.getObject({
        id: propertyId,
        options: { showContent: true },
      });

      if (object.data?.content && 'fields' in object.data.content) {
        const fields = object.data.content.fields as any;
        return {
          id: propertyId,
          name: fields.name || 'Unknown Property',
          description: fields.description || '',
          imageUrl: fields.image_url || '',
          location: fields.location || '',
          propertyType: fields.property_type || 'RWA',
          totalValue: parseInt(fields.total_value || '0') || 0,
          totalShares: parseInt(fields.total_shares || '0') || 0,
          availableShares: parseInt(fields.available_shares || '0') || 0,
          pricePerShare: parseInt(fields.price_per_share || '0') || 0,
          rentalYield: fields.rental_yield || '0',
          isActive: fields.is_active || false,
          owner: fields.owner || '',
        };
      }

      return null;
    } catch (error) {
      logger.error('Error fetching property details', error);
      return null;
    }
  }

  /**
   * Get user's investments from blockchain
   */
  async getUserInvestments(userAddress: string) {
    try {
      logger.investment('Fetching user investments', { userAddress });
      
      // Get all objects owned by user to find Investment objects
      const allUserObjects = await this.client.getOwnedObjects({
        owner: userAddress,
        options: {
          showContent: true,
          showType: true,
        },
      });
      
      // REAL FIX: Find all Investment objects from user's owned objects
      const investmentObjects = allUserObjects.data.filter(obj => 
        obj.data?.type?.includes('Investment') || 
        obj.data?.type?.includes('investment') ||
        (obj.data?.content && 'fields' in obj.data.content && 
         obj.data.content.fields && 
         'property_id' in obj.data.content.fields &&
         'shares_owned' in obj.data.content.fields)
      );
      
      // Create fake response structure to match existing code
      const newInvestments = { data: investmentObjects };
      const oldInvestments = { data: [] };
      


      // Combine investments from both packages
      const allObjects = [...newInvestments.data, ...oldInvestments.data];
      const objects = { data: allObjects };

      logger.investment('Found investment objects', { count: objects.data.length });
      


      // Fetch details for each investment
      const investments = await Promise.all(
        objects.data.map(async (obj: any) => {
          const fields = obj.data?.content?.fields;
          if (!fields) return null;

          // Fetch property details
          const propertyDetails = await this.getPropertyDetails(fields.property_id);

          return {
            id: obj.data.objectId,
            propertyId: fields.property_id,
            propertyName: propertyDetails?.name || 'Unknown Property',
            shares: parseInt(fields.shares_owned || fields.shares || '0') || 0,
            investmentAmount: (parseInt(fields.investment_amount || '0') || 0) / 100_000_000, // Convert from MIST to OCT (8 decimals)
            timestamp: fields.timestamp,
            propertyDetails,
          };
        })
      );

      const validInvestments = investments.filter(inv => inv !== null);
      logger.investment('Valid investments loaded', { count: validInvestments.length });
      
      return validInvestments;
    } catch (error) {
      logger.error('Error fetching user investments', error);
      return [];
    }
  }

  /**
   * Check if package is deployed
   */
  async isPackageDeployed(): Promise<boolean> {
    try {
      const packageObj = await this.client.getObject({
        id: PACKAGE_ID,
        options: { showContent: false },
      });
      return !!packageObj.data;
    } catch {
      return false;
    }
  }
}

export const propertyContractService = new PropertyContractService();
