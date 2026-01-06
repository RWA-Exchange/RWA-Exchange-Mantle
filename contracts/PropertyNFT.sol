// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title RWA Property NFT Contract for Mantle Network
 * @dev Handles tokenization of real estate properties as NFTs with fractional ownership
 * Converted from Move to Solidity for Mantle blockchain compatibility
 */
contract PropertyNFT is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard, Pausable {
    uint256 private _nextTokenId = 1;
    
    // Property structure matching Move contract functionality
    struct Property {
        string name;
        string description;
        string imageUrl;
        string location;
        string propertyType;
        uint256 totalValue;
        uint256 totalShares;
        uint256 availableShares;
        uint256 pricePerShare;
        string rentalYield;
        bool isActive;
        address owner;
        uint256 treasury; // MNT balance in wei
    }
    
    // Investment structure for tracking fractional ownership
    struct Investment {
        uint256 propertyId;
        address investor;
        uint256 sharesOwned;
        uint256 investmentAmount;
        uint256 timestamp;
    }
    
    // Mappings
    mapping(uint256 => Property) public properties;
    mapping(uint256 => Investment[]) public propertyInvestments;
    mapping(address => uint256[]) public userInvestments;
    mapping(uint256 => mapping(address => uint256)) public userShares; // propertyId => user => shares
    
    // Events matching Move contract events
    event PropertyCreated(
        uint256 indexed propertyId,
        string name,
        uint256 totalValue,
        uint256 totalShares,
        uint256 pricePerShare,
        address indexed owner
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
        uint256 perShareAmount
    );
    
    event InvestmentTransferred(
        uint256 indexed propertyId,
        address indexed from,
        address indexed to,
        uint256 shares
    );

    constructor(address initialOwner)
        ERC721("RWA Property NFT", "RWANFT")
        Ownable(initialOwner)
    {}

    /**
     * @dev Create a new property NFT with fractional ownership capability
     * Equivalent to create_property in Move contract
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
        
        uint256 tokenId = _nextTokenId++;
        
        // Create property struct
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
            treasury: 0
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
            msg.sender
        );
        
        return tokenId;
    }
    
    /**
     * @dev Invest in a property by purchasing shares with MNT
     * Equivalent to invest function in Move contract
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
        
        // Update property state
        property.availableShares -= sharesToBuy;
        property.treasury += requiredAmount;
        
        // Track user investment
        userShares[propertyId][msg.sender] += sharesToBuy;
        
        // Create investment record
        Investment memory newInvestment = Investment({
            propertyId: propertyId,
            investor: msg.sender,
            sharesOwned: sharesToBuy,
            investmentAmount: requiredAmount,
            timestamp: block.timestamp
        });
        
        propertyInvestments[propertyId].push(newInvestment);
        userInvestments[msg.sender].push(propertyId);
        
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
     * @dev Distribute dividends to all investors (only property owner)
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
        
        uint256 soldShares = property.totalShares - property.availableShares;
        uint256 perShareAmount = soldShares > 0 ? msg.value / soldShares : 0;
        
        emit DividendDistributed(propertyId, msg.value, perShareAmount);
    }
    
    /**
     * @dev Claim dividends for user's investment
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
        payable(msg.sender).transfer(dividendAmount);
    }
    
    /**
     * @dev Transfer investment shares to another address
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
        
        // Update share ownership
        userShares[propertyId][msg.sender] -= shares;
        userShares[propertyId][to] += shares;
        
        // Add to recipient's investment list if first time
        if (userShares[propertyId][to] == shares) {
            userInvestments[to].push(propertyId);
        }
        
        emit InvestmentTransferred(propertyId, msg.sender, to, shares);
    }
    
    /**
     * @dev Update property status (only property owner)
     */
    function updatePropertyStatus(uint256 propertyId, bool isActive) 
        public 
        whenNotPaused 
    {
        require(_exists(propertyId), "Property does not exist");
        Property storage property = properties[propertyId];
        require(property.owner == msg.sender, "Only property owner can update status");
        
        property.isActive = isActive;
    }
    
    // View functions
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
    
    // Emergency functions
    function pause() public onlyOwner {
        _pause();
    }
    
    function unpause() public onlyOwner {
        _unpause();
    }
    
    // Override required functions
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
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
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
