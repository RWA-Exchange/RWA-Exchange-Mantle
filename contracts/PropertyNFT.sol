// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol"; // If using OZ 4.x
import "@openzeppelin/contracts/security/Pausable.sol";        // If using OZ 4.x

/**
 * @title RWA Property NFT Contract for Mantle Network
 */
contract PropertyNFT is ERC721, ERC721URIStorage, ERC721Enumerable, Ownable, ReentrancyGuard, Pausable {
    uint256 private _nextTokenId = 1;
    
    struct PropertyData {
        string name;
        string description;
        string imageUrl;
        string location;
        string propertyType;
        uint256 totalValue;
        uint256 totalShares;
        uint256 pricePerShare;
        string rentalYield;
        string metadataURI;
    }
    
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
        uint256 treasury; 
        uint256 createdAt;
        uint256 lastDividendDistribution;
    }
    
    struct Investment {
        uint256 propertyId;
        address investor;
        uint256 sharesOwned;
        uint256 investmentAmount; 
        uint256 timestamp;
        uint256 lastDividendClaim;
    }
    
    struct PropertyMetrics {
        uint256 totalInvestments;
        uint256 totalDividendsDistributed;
        uint256 totalDividendsClaimed;
        uint256 averageInvestmentSize;
        uint256 uniqueInvestors;
    }
    
    struct PropertyInfo {
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
        uint256 createdAt;
        uint256 treasury;
    }
    
    mapping(uint256 => Property) public properties;
    mapping(uint256 => Investment[]) public propertyInvestments;
    mapping(address => uint256[]) public userInvestments;
    mapping(uint256 => mapping(address => uint256)) public userShares; 
    mapping(uint256 => PropertyMetrics) public propertyMetrics;
    
    uint256 public platformFeePercent = 250; 
    address public feeRecipient;
    uint256 public constant MAX_FEE_PERCENT = 1000; 
    uint256 public minimumInvestment = 0.001 ether; 

    event PropertyCreated(uint256 indexed propertyId, string name, uint256 totalValue, uint256 totalShares, uint256 pricePerShare, address indexed owner, uint256 timestamp);
    event InvestmentMade(uint256 indexed propertyId, address indexed investor, uint256 sharesPurchased, uint256 amountPaid, uint256 timestamp);
    event DividendDistributed(uint256 indexed propertyId, uint256 totalAmount, uint256 perShareAmount, uint256 timestamp);
    event DividendClaimed(uint256 indexed propertyId, address indexed investor, uint256 amount, uint256 timestamp);
    event InvestmentTransferred(uint256 indexed propertyId, address indexed from, address indexed to, uint256 shares);
    event PropertyStatusUpdated(uint256 indexed propertyId, bool isActive, uint256 timestamp);
    event PlatformFeeUpdated(uint256 oldFee, uint256 newFee);
    event FeeRecipientUpdated(address oldRecipient, address newRecipient);
    event MinimumInvestmentUpdated(uint256 oldMinimum, uint256 newMinimum);

    constructor(address initialOwner) ERC721("RWA Property NFT", "RWANFT") {
        _transferOwnership(initialOwner);
        feeRecipient = initialOwner;
    }

    // --- PLATFORM MGMT ---
    function setPlatformFee(uint256 _feePercent) external onlyOwner {
        require(_feePercent <= MAX_FEE_PERCENT, "Fee too high");
        emit PlatformFeeUpdated(platformFeePercent, _feePercent);
        platformFeePercent = _feePercent;
    }

    function setFeeRecipient(address _feeRecipient) external onlyOwner {
        require(_feeRecipient != address(0), "Invalid fee recipient");
        emit FeeRecipientUpdated(feeRecipient, _feeRecipient);
        feeRecipient = _feeRecipient;
    }

    function setMinimumInvestment(uint256 _minimumInvestment) external onlyOwner {
        emit MinimumInvestmentUpdated(minimumInvestment, _minimumInvestment);
        minimumInvestment = _minimumInvestment;
    }

    // --- CORE LOGIC ---
    function createProperty(PropertyData calldata data) public whenNotPaused returns (uint256) {
        require(bytes(data.name).length > 0, "Name empty");
        require(data.totalShares > 0 && data.pricePerShare > 0, "Invalid share data");
        
        uint256 tokenId = _nextTokenId++;
        
        properties[tokenId] = Property({
            name: data.name,
            description: data.description,
            imageUrl: data.imageUrl,
            location: data.location,
            propertyType: data.propertyType,
            totalValue: data.totalValue,
            totalShares: data.totalShares,
            availableShares: data.totalShares,
            pricePerShare: data.pricePerShare,
            rentalYield: data.rentalYield,
            isActive: true,
            owner: msg.sender,
            treasury: 0,
            createdAt: block.timestamp,
            lastDividendDistribution: 0
        });
        
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, data.metadataURI);
        
        emit PropertyCreated(tokenId, data.name, data.totalValue, data.totalShares, data.pricePerShare, msg.sender, block.timestamp);
        return tokenId;
    }

    function invest(uint256 propertyId, uint256 sharesToBuy) public payable nonReentrant whenNotPaused {
        require(_exists(propertyId), "Exists?");
        Property storage property = properties[propertyId];
        
        uint256 requiredAmount = sharesToBuy * property.pricePerShare;
        require(property.isActive && property.availableShares >= sharesToBuy, "Unavailable");
        require(msg.value >= requiredAmount, "MNT low");
        require(requiredAmount >= minimumInvestment, "Min invest");
        
        uint256 platformFee = (requiredAmount * platformFeePercent) / 10000;
        
        property.availableShares -= sharesToBuy;
        property.treasury += (requiredAmount - platformFee);
        
        if (userShares[propertyId][msg.sender] == 0) {
            userInvestments[msg.sender].push(propertyId);
            propertyMetrics[propertyId].uniqueInvestors++;
        }
        
        userShares[propertyId][msg.sender] += sharesToBuy;
        
        propertyInvestments[propertyId].push(Investment({
            propertyId: propertyId,
            investor: msg.sender,
            sharesOwned: sharesToBuy,
            investmentAmount: requiredAmount,
            timestamp: block.timestamp,
            lastDividendClaim: block.timestamp
        }));
        
        propertyMetrics[propertyId].totalInvestments += requiredAmount;
        
        if (platformFee > 0) payable(feeRecipient).transfer(platformFee);
        if (msg.value > requiredAmount) payable(msg.sender).transfer(msg.value - requiredAmount);
        
        emit InvestmentMade(propertyId, msg.sender, sharesToBuy, requiredAmount, block.timestamp);
    }

    function distributeDividends(uint256 propertyId) public payable nonReentrant whenNotPaused {
        require(_exists(propertyId), "Exists?");
        require(properties[propertyId].owner == msg.sender, "Owner only");
        
        properties[propertyId].treasury += msg.value;
        properties[propertyId].lastDividendDistribution = block.timestamp;
        propertyMetrics[propertyId].totalDividendsDistributed += msg.value;

        uint256 soldShares = properties[propertyId].totalShares - properties[propertyId].availableShares;
        uint256 perShare = soldShares > 0 ? msg.value / soldShares : 0;
        
        emit DividendDistributed(propertyId, msg.value, perShare, block.timestamp);
    }

    function claimDividends(uint256 propertyId) public nonReentrant whenNotPaused {
        uint256 shares = userShares[propertyId][msg.sender];
        require(shares > 0, "No shares");
        
        Property storage property = properties[propertyId];
        uint256 soldShares = property.totalShares - property.availableShares;
        uint256 dividendAmount = (property.treasury * shares) / soldShares;
        
        require(dividendAmount > 0, "Nothing to claim");
        
        property.treasury -= dividendAmount;
        propertyMetrics[propertyId].totalDividendsClaimed += dividendAmount;
        
        payable(msg.sender).transfer(dividendAmount);
        emit DividendClaimed(propertyId, msg.sender, dividendAmount, block.timestamp);
    }

    // --- OVERRIDES ---
    function _exists(uint256 tokenId) internal view override returns (bool) {
        // v4.x logic
        return super._exists(tokenId);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function pause() public onlyOwner { _pause(); }
    function unpause() public onlyOwner { _unpause(); }
    
    receive() external payable {}
}