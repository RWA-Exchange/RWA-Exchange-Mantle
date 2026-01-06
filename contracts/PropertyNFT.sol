// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title RWA Property NFT Contract for Mantle Network
 * @dev Enhanced tokenization of real estate properties as NFTs with integrated fractional ownership
 * @notice Optimized for Mantle Network with MNT token integration and gas-efficient operations
 */
contract PropertyNFT is ERC721, ERC721URIStorage, ERC721Enumerable, Ownable, ReentrancyGuard, Pausable {
    uint256 private _nextTokenId = 1;
    
    // Enhanced property structure for Mantle ecosystem
    struct Property {
        string name;
        string description;
        string imageUrl;
        string location;
        string propertyType;
        uint256 totalValue; // In MNT wei
        uint256 totalShares;
        uint256 availableShares;
        uint256 pricePerShare; // In MNT wei
        string rentalYield;
        bool isActive;
        address owner;
        uint256 treasury; // MNT balance in wei
        uint256 createdAt;
        uint256 lastDividendDistribution;
    }
    
    // Enhanced investment structure for tracking fractional ownership
    struct Investment {
        uint256 propertyId;
        address investor;
        uint256 sharesOwned;
        uint256 investmentAmount; // In MNT wei
        uint256 timestamp;
        uint256 lastDividendClaim;
    }
    
    // Mantle-specific features
    struct PropertyMetrics {
        uint256 totalInvestments;
        uint256 totalDividendsDistributed;
        uint256 totalDividendsClaimed;
        uint256 averageInvestmentSize;
        uint256 uniqueInvestors;
    }
    
    // Mappings
    mapping(uint256 => Property) public properties;
    mapping(uint256 => Investment[]) public propertyInvestments;
    mapping(address => uint256[]) public userInvestments;
    mapping(uint256 => mapping(address => uint256)) public userShares; // propertyId => user => shares
    mapping(uint256 => PropertyMetrics) public propertyMetrics;
    mapping(uint256 => mapping(address => uint256)) public userDividendDebt; // For dividend tracking
    
    // Platform settings
    uint256 public platformFeePercent = 250; // 2.5% platform fee
    address public feeRecipient;
    uint256 public constant MAX_FEE_PERCENT = 1000; // 10% max fee
    uint256 public minimumInvestment = 0.001 ether; // Minimum investment in MNT
    
    // Enhanced events for Mantle ecosystem
    event PropertyCreated(
        uint256 indexed propertyId,
        string name,
        uint256 totalValue,
        uint256 totalShares,
        uint256 pricePerShare,
        address indexed owner,
        uint256 timestamp
    );
    
    event InvestmentMade(
        uint256 indexed propertyId,
        address indexed investor,
        uint256 sharesPurchased,
        uint256 amountPaid,
        uint256 timestamp
    );
    
    event DividendDistributed(
        uint256 indexed propertyId,
        uint256 totalAmount,
        uint256 perShareAmount,
        uint256 timestamp
    );
    
    event DividendClaimed(
        uint256 indexed propertyId,
        address indexed investor,
        uint256 amount,
        uint256 timestamp
    );
    
    event InvestmentTransferred(
        uint256 indexed propertyId,
        address indexed from,
        address indexed to,
        uint256 shares
    );
    
    event PropertyStatusUpdated(
        uint256 indexed propertyId,
        bool isActive,
        uint256 timestamp
    );
    
    event PlatformFeeUpdated(uint256 oldFee, uint256 newFee);
    event FeeRecipientUpdated(address oldRecipient, address newRecipient);
    event MinimumInvestmentUpdated(uint256 oldMinimum, uint256 newMinimum);

    constructor(address initialOwner)
        ERC721("RWA Property NFT", "RWANFT")
        Ownable(initialOwner)
    {
        feeRecipient = initialOwner;
    }

    // Platform management functions
    function setPlatformFee(uint256 _feePercent) external onlyOwner {
        require(_feePercent <= MAX_FEE_PERCENT, "Fee too high");
        uint256 oldFee = platformFeePercent;
        platformFeePercent = _feePercent;
        emit PlatformFeeUpdated(oldFee, _feePercent);
    }

    function setFeeRecipient(address _feeRecipient) external onlyOwner {
        require(_feeRecipient != address(0), "Invalid fee recipient");
        address oldRecipient = feeRecipient;
        feeRecipient = _feeRecipient;
        emit FeeRecipientUpdated(oldRecipient, _feeRecipient);
    }

    function setMinimumInvestment(uint256 _minimumInvestment) external onlyOwner {
        uint256 oldMinimum = minimumInvestment;
        minimumInvestment = _minimumInvestment;
        emit MinimumInvestmentUpdated(oldMinimum, _minimumInvestment);
    }

    /**
     * @dev Create a new property NFT with fractional ownership capability
     * Enhanced for Mantle with better gas efficiency and metadata
     */
    function createProperty(
        string memory name,
        string memory description,
        string memory imageUrl,
        string memory location,
        string memory propertyType,
        uint256 totalValue,
        uint256 totalShares,
        uint256 pricePerShare,
        string memory rentalYield,
        string memory tokenURI
    ) public whenNotPaused returns (uint256) {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(totalShares > 0, "Total shares must be greater than 0");
        require(pricePerShare > 0, "Price per share must be greater than 0");
        require(totalValue > 0, "Total value must be greater than 0");
        require(totalShares <= 10000000, "Too many shares"); // Gas optimization
        
        uint256 tokenId = _nextTokenId++;
        
        // Create enhanced property struct
        properties[tokenId] = Property({
            name: name,
            description: description,
            imageUrl: imageUrl,
            location: location,
            propertyType: propertyType,
            totalValue: totalValue,
            totalShares: totalShares,
            availableShares: totalShares,
            pricePerShare: pricePerShare,
            rentalYield: rentalYield,
            isActive: true,
            owner: msg.sender,
            treasury: 0,
            createdAt: block.timestamp,
            lastDividendDistribution: 0
        });
        
        // Initialize metrics
        propertyMetrics[tokenId] = PropertyMetrics({
            totalInvestments: 0,
            totalDividendsDistributed: 0,
            totalDividendsClaimed: 0,
            averageInvestmentSize: 0,
            uniqueInvestors: 0
        });
        
        // Mint NFT to property creator
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        emit PropertyCreated(
            tokenId,
            name,
            totalValue,
            totalShares,
            pricePerShare,
            msg.sender,
            block.timestamp
        );
        
        return tokenId;
    }
    
    /**
     * @dev Enhanced invest function with better tracking and gas optimization
     */
    function invest(uint256 propertyId, uint256 sharesToBuy) 
        public 
        payable 
        nonReentrant 
        whenNotPaused 
    {
        require(_exists(propertyId), "Property does not exist");
        Property storage property = properties[propertyId];
        
        require(property.isActive, "Property is not active");
        require(sharesToBuy > 0, "Shares to buy must be greater than 0");
        require(property.availableShares >= sharesToBuy, "Insufficient shares available");
        
        uint256 requiredAmount = sharesToBuy * property.pricePerShare;
        require(msg.value >= requiredAmount, "Insufficient MNT sent");
        require(requiredAmount >= minimumInvestment, "Investment below minimum");
        
        // Calculate platform fee
        uint256 platformFee = (requiredAmount * platformFeePercent) / 10000;
        uint256 propertyAmount = requiredAmount - platformFee;
        
        // Update property state
        property.availableShares -= sharesToBuy;
        property.treasury += propertyAmount;
        
        // Track if this is a new investor
        bool isNewInvestor = userShares[propertyId][msg.sender] == 0;
        
        // Track user investment
        userShares[propertyId][msg.sender] += sharesToBuy;
        
        // Create investment record
        Investment memory newInvestment = Investment({
            propertyId: propertyId,
            investor: msg.sender,
            sharesOwned: sharesToBuy,
            investmentAmount: requiredAmount,
            timestamp: block.timestamp,
            lastDividendClaim: block.timestamp
        });
        
        propertyInvestments[propertyId].push(newInvestment);
        
        // Add to user's investment list if first investment in this property
        if (isNewInvestor) {
            userInvestments[msg.sender].push(propertyId);
            propertyMetrics[propertyId].uniqueInvestors++;
        }
        
        // Update metrics
        PropertyMetrics storage metrics = propertyMetrics[propertyId];
        metrics.totalInvestments += requiredAmount;
        metrics.averageInvestmentSize = metrics.totalInvestments / propertyInvestments[propertyId].length;
        
        // Transfer platform fee
        if (platformFee > 0) {
            payable(feeRecipient).transfer(platformFee);
        }
        
        // Refund excess MNT
        if (msg.value > requiredAmount) {
            payable(msg.sender).transfer(msg.value - requiredAmount);
        }
        
        emit InvestmentMade(
            propertyId,
            msg.sender,
            sharesToBuy,
            requiredAmount,
            block.timestamp
        );
    }
    
    /**
     * @dev Enhanced dividend distribution with better tracking
     */
    function distributeDividends(uint256 propertyId) 
        public 
        payable 
        nonReentrant 
        whenNotPaused 
    {
        require(_exists(propertyId), "Property does not exist");
        Property storage property = properties[propertyId];
        require(property.owner == msg.sender, "Only property owner can distribute dividends");
        require(msg.value > 0, "Dividend amount must be greater than 0");
        
        property.treasury += msg.value;
        property.lastDividendDistribution = block.timestamp;
        
        uint256 soldShares = property.totalShares - property.availableShares;
        uint256 perShareAmount = soldShares > 0 ? msg.value / soldShares : 0;
        
        // Update metrics
        propertyMetrics[propertyId].totalDividendsDistributed += msg.value;
        
        emit DividendDistributed(propertyId, msg.value, perShareAmount, block.timestamp);
    }
    
    /**
     * @dev Enhanced dividend claiming with proper tracking
     */
    function claimDividends(uint256 propertyId) 
        public 
        nonReentrant 
        whenNotPaused 
    {
        require(_exists(propertyId), "Property does not exist");
        Property storage property = properties[propertyId];
        
        uint256 userSharesOwned = userShares[propertyId][msg.sender];
        require(userSharesOwned > 0, "No shares owned in this property");
        
        uint256 soldShares = property.totalShares - property.availableShares;
        require(soldShares > 0, "No shares sold yet");
        
        uint256 dividendAmount = (property.treasury * userSharesOwned) / soldShares;
        require(dividendAmount > 0, "No dividends available");
        
        property.treasury -= dividendAmount;
        
        // Update metrics
        propertyMetrics[propertyId].totalDividendsClaimed += dividendAmount;
        
        payable(msg.sender).transfer(dividendAmount);
        
        emit DividendClaimed(propertyId, msg.sender, dividendAmount, block.timestamp);
    }
    
    /**
     * @dev Enhanced share transfer with better validation
     */
    function transferShares(
        uint256 propertyId, 
        address to, 
        uint256 shares
    ) public nonReentrant whenNotPaused {
        require(_exists(propertyId), "Property does not exist");
        require(to != address(0), "Cannot transfer to zero address");
        require(to != msg.sender, "Cannot transfer to yourself");
        require(shares > 0, "Shares must be greater than 0");
        
        uint256 senderShares = userShares[propertyId][msg.sender];
        require(senderShares >= shares, "Insufficient shares owned");
        
        // Track if recipient is new investor
        bool isNewInvestor = userShares[propertyId][to] == 0;
        
        // Update share ownership
        userShares[propertyId][msg.sender] -= shares;
        userShares[propertyId][to] += shares;
        
        // Add to recipient's investment list if first time
        if (isNewInvestor) {
            userInvestments[to].push(propertyId);
            propertyMetrics[propertyId].uniqueInvestors++;
        }
        
        emit InvestmentTransferred(propertyId, msg.sender, to, shares);
    }
    
    /**
     * @dev Enhanced property status update
     */
    function updatePropertyStatus(uint256 propertyId, bool isActive) 
        public 
        whenNotPaused 
    {
        require(_exists(propertyId), "Property does not exist");
        Property storage property = properties[propertyId];
        require(property.owner == msg.sender, "Only property owner can update status");
        
        property.isActive = isActive;
        emit PropertyStatusUpdated(propertyId, isActive, block.timestamp);
    }
    
    // Enhanced view functions
    function getPropertyInfo(uint256 propertyId) 
        public 
        view 
        returns (
            string memory name,
            string memory description,
            string memory imageUrl,
            string memory location,
            string memory propertyType,
            uint256 totalValue,
            uint256 totalShares,
            uint256 availableShares,
            uint256 pricePerShare,
            string memory rentalYield,
            bool isActive,
            address owner
        ) 
    {
        require(_exists(propertyId), "Property does not exist");
        Property memory property = properties[propertyId];
        
        return (
            property.name,
            property.description,
            property.imageUrl,
            property.location,
            property.propertyType,
            property.totalValue,
            property.totalShares,
            property.availableShares,
            property.pricePerShare,
            property.rentalYield,
            property.isActive,
            property.owner
        );
    }
    
    function getPropertyMetrics(uint256 propertyId) 
        public 
        view 
        returns (PropertyMetrics memory) 
    {
        require(_exists(propertyId), "Property does not exist");
        return propertyMetrics[propertyId];
    }
    
    function getUserShares(uint256 propertyId, address user) 
        public 
        view 
        returns (uint256) 
    {
        return userShares[propertyId][user];
    }
    
    function getTreasuryBalance(uint256 propertyId) 
        public 
        view 
        returns (uint256) 
    {
        require(_exists(propertyId), "Property does not exist");
        return properties[propertyId].treasury;
    }
    
    function getUserInvestments(address user) 
        public 
        view 
        returns (uint256[] memory) 
    {
        return userInvestments[user];
    }
    
    function getPropertyInvestments(uint256 propertyId) 
        public 
        view 
        returns (Investment[] memory) 
    {
        require(_exists(propertyId), "Property does not exist");
        return propertyInvestments[propertyId];
    }
    
    function calculateInvestmentValue(uint256 propertyId, address investor) 
        public 
        view 
        returns (uint256 currentValue, uint256 potentialDividends) 
    {
        require(_exists(propertyId), "Property does not exist");
        
        uint256 shares = userShares[propertyId][investor];
        if (shares == 0) return (0, 0);
        
        Property memory property = properties[propertyId];
        currentValue = shares * property.pricePerShare;
        
        uint256 soldShares = property.totalShares - property.availableShares;
        if (soldShares > 0) {
            potentialDividends = (property.treasury * shares) / soldShares;
        }
    }
    
    // Emergency functions
    function pause() public onlyOwner {
        _pause();
    }
    
    function unpause() public onlyOwner {
        _unpause();
    }
    
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No MNT to withdraw");
        payable(owner()).transfer(balance);
    }
    
    // Required overrides for multiple inheritance
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
    
    // Receive function to accept MNT
    receive() external payable {}
}
