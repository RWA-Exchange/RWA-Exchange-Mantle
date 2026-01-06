// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./PropertyNFT.sol";
import "./Fraction.sol";

/**
 * @title RWA Fractionalizer Contract for Mantle Network
 * @dev Enhanced fractionalizer with Mantle-specific optimizations and MNT integration
 * @notice This contract works alongside PropertyNFT for additional fractionalization options
 */
contract Fractionalizer is ReentrancyGuard, Pausable, Ownable {
    address public propertyNFTAddress;

    // KYC registry for compliance (placeholder for future implementation)
    mapping(address => bool) public kycVerified;

    // Enhanced fractionalization structure for Mantle
    struct FractionalizedNFT {
        address fractionToken;
        uint256 totalFractions;
        address originalOwner;
        uint256 timestamp;
        bool isActive;
        uint256 pricePerFraction; // Price in MNT wei
        uint256 totalValueMNT; // Total value in MNT
    }

    mapping(uint256 => FractionalizedNFT) public fractionalizedNFTs;
    
    // Mantle-specific features
    mapping(address => uint256) public totalMNTCollected; // Track MNT collected per user
    mapping(uint256 => uint256) public fractionSales; // Track total sales per property
    
    // Fee structure for Mantle ecosystem
    uint256 public platformFeePercent = 250; // 2.5% platform fee
    address public feeRecipient;
    uint256 public constant MAX_FEE_PERCENT = 1000; // 10% max fee

    // Enhanced events for Mantle ecosystem
    event NFTFractionalized(
        uint256 indexed tokenId, 
        address indexed fractionToken, 
        uint256 totalFractions, 
        address indexed originalOwner,
        uint256 pricePerFraction,
        uint256 timestamp
    );
    
    event NFTRedeemed(
        uint256 indexed tokenId, 
        address indexed redeemer,
        address fractionToken,
        uint256 timestamp
    );
    
    event FractionPurchased(
        uint256 indexed tokenId,
        address indexed buyer,
        uint256 fractionsAmount,
        uint256 totalCostMNT,
        uint256 timestamp
    );
    
    event KYCStatusUpdated(address indexed user, bool status);
    event EmergencyPause(address indexed admin, uint256 timestamp);
    event EmergencyUnpause(address indexed admin, uint256 timestamp);
    event PlatformFeeUpdated(uint256 oldFee, uint256 newFee);
    event FeeRecipientUpdated(address oldRecipient, address newRecipient);

    // Compliance modifier (placeholder for future KYC integration)
    modifier onlyKYC() {
        // For development, this is disabled
        // require(kycVerified[msg.sender], "KYC verification required");
        _;
    }

    constructor(address _propertyNFTAddress) Ownable(msg.sender) {
        propertyNFTAddress = _propertyNFTAddress;
        feeRecipient = msg.sender; // Default fee recipient is contract owner
    }

    // Emergency pause functions
    function pause() external onlyOwner {
        _pause();
        emit EmergencyPause(msg.sender, block.timestamp);
    }

    function unpause() external onlyOwner {
        _unpause();
        emit EmergencyUnpause(msg.sender, block.timestamp);
    }

    // Platform fee management
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

    // KYC management functions (placeholder for future compliance)
    function updateKYCStatus(address user, bool status) external onlyOwner {
        kycVerified[user] = status;
        emit KYCStatusUpdated(user, status);
    }

    function batchUpdateKYC(address[] calldata users, bool status) external onlyOwner {
        for (uint256 i = 0; i < users.length; i++) {
            kycVerified[users[i]] = status;
            emit KYCStatusUpdated(users[i], status);
        }
    }

    /**
     * @dev Enhanced fractionalization with MNT pricing for Mantle ecosystem
     */
    function fractionalize(
        uint256 tokenId, 
        uint256 totalFractions, 
        string memory name, 
        string memory symbol,
        uint256 pricePerFraction // Price per fraction in MNT wei
    ) public nonReentrant whenNotPaused onlyKYC {
        require(totalFractions > 0, "Total fractions must be greater than 0");
        require(totalFractions <= 10000000, "Total fractions cannot exceed 10,000,000"); // Increased for Mantle
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(symbol).length > 0, "Symbol cannot be empty");
        require(pricePerFraction > 0, "Price per fraction must be greater than 0");
        
        PropertyNFT propertyNFT = PropertyNFT(propertyNFTAddress);
        require(propertyNFT.ownerOf(tokenId) == msg.sender, "You are not the owner of this NFT");
        require(fractionalizedNFTs[tokenId].fractionToken == address(0), "NFT already fractionalized");

        // Transfer NFT to this contract
        propertyNFT.transferFrom(msg.sender, address(this), tokenId);

        // Deploy new fraction token with enhanced metadata
        Fraction fractionToken = new Fraction(name, symbol, address(this));

        // Calculate total value in MNT
        uint256 totalValueMNT = totalFractions * pricePerFraction;

        // Store enhanced fractionalization data
        fractionalizedNFTs[tokenId] = FractionalizedNFT({
            fractionToken: address(fractionToken),
            totalFractions: totalFractions,
            originalOwner: msg.sender,
            timestamp: block.timestamp,
            isActive: true,
            pricePerFraction: pricePerFraction,
            totalValueMNT: totalValueMNT
        });

        // Mint fraction tokens to the original owner
        fractionToken.mint(msg.sender, totalFractions);

        emit NFTFractionalized(
            tokenId, 
            address(fractionToken), 
            totalFractions, 
            msg.sender, 
            pricePerFraction,
            block.timestamp
        );
    }

    /**
     * @dev Purchase fractions with MNT - Mantle-specific feature
     */
    function purchaseFractions(uint256 tokenId, uint256 fractionsAmount) 
        public 
        payable 
        nonReentrant 
        whenNotPaused 
        onlyKYC 
    {
        FractionalizedNFT storage fnft = fractionalizedNFTs[tokenId];
        require(fnft.fractionToken != address(0), "NFT not fractionalized");
        require(fnft.isActive, "NFT fractionalization is not active");
        require(fractionsAmount > 0, "Must purchase at least 1 fraction");

        Fraction fractionToken = Fraction(fnft.fractionToken);
        require(fractionToken.balanceOf(fnft.originalOwner) >= fractionsAmount, "Insufficient fractions available");

        uint256 totalCost = fractionsAmount * fnft.pricePerFraction;
        require(msg.value >= totalCost, "Insufficient MNT sent");

        // Calculate platform fee
        uint256 platformFee = (totalCost * platformFeePercent) / 10000;
        uint256 sellerAmount = totalCost - platformFee;

        // Transfer fractions from original owner to buyer
        fractionToken.transferFrom(fnft.originalOwner, msg.sender, fractionsAmount);

        // Distribute MNT
        if (platformFee > 0) {
            payable(feeRecipient).transfer(platformFee);
        }
        payable(fnft.originalOwner).transfer(sellerAmount);

        // Update tracking
        totalMNTCollected[fnft.originalOwner] += sellerAmount;
        fractionSales[tokenId] += totalCost;

        // Refund excess MNT
        if (msg.value > totalCost) {
            payable(msg.sender).transfer(msg.value - totalCost);
        }

        emit FractionPurchased(tokenId, msg.sender, fractionsAmount, totalCost, block.timestamp);
    }

    /**
     * @dev Enhanced redeem function with MNT handling
     */
    function redeem(uint256 tokenId) public nonReentrant whenNotPaused onlyKYC {
        FractionalizedNFT storage fnft = fractionalizedNFTs[tokenId];
        require(fnft.fractionToken != address(0), "NFT not fractionalized");
        require(fnft.isActive, "NFT fractionalization is not active");

        Fraction fractionToken = Fraction(fnft.fractionToken);
        require(fractionToken.balanceOf(msg.sender) == fnft.totalFractions, "You do not own all the fractions");

        // Store fraction token address for event emission
        address fractionTokenAddress = fnft.fractionToken;

        // Transfer all fraction tokens to this contract and burn them
        fractionToken.transferFrom(msg.sender, address(this), fnft.totalFractions);
        fractionToken.burn(fnft.totalFractions);

        // Transfer the original NFT back to the redeemer
        PropertyNFT propertyNFT = PropertyNFT(propertyNFTAddress);
        propertyNFT.transferFrom(address(this), msg.sender, tokenId);

        // Mark as inactive and clean up
        fnft.isActive = false;

        emit NFTRedeemed(tokenId, msg.sender, fractionTokenAddress, block.timestamp);
    }

    // Enhanced view functions for Mantle ecosystem
    function getFractionalizationInfo(uint256 tokenId) external view returns (
        address fractionToken,
        uint256 totalFractions,
        address originalOwner,
        uint256 timestamp,
        bool isActive,
        uint256 pricePerFraction,
        uint256 totalValueMNT
    ) {
        FractionalizedNFT memory fnft = fractionalizedNFTs[tokenId];
        return (
            fnft.fractionToken,
            fnft.totalFractions,
            fnft.originalOwner,
            fnft.timestamp,
            fnft.isActive,
            fnft.pricePerFraction,
            fnft.totalValueMNT
        );
    }

    function isNFTFractionalized(uint256 tokenId) external view returns (bool) {
        return fractionalizedNFTs[tokenId].fractionToken != address(0) && 
               fractionalizedNFTs[tokenId].isActive;
    }

    function getFractionTokenAddress(uint256 tokenId) external view returns (address) {
        return fractionalizedNFTs[tokenId].fractionToken;
    }

    function getAvailableFractions(uint256 tokenId) external view returns (uint256) {
        FractionalizedNFT memory fnft = fractionalizedNFTs[tokenId];
        if (fnft.fractionToken == address(0) || !fnft.isActive) {
            return 0;
        }
        
        Fraction fractionToken = Fraction(fnft.fractionToken);
        return fractionToken.balanceOf(fnft.originalOwner);
    }

    function calculatePurchaseCost(uint256 tokenId, uint256 fractionsAmount) 
        external 
        view 
        returns (uint256 totalCost, uint256 platformFee, uint256 sellerAmount) 
    {
        FractionalizedNFT memory fnft = fractionalizedNFTs[tokenId];
        require(fnft.fractionToken != address(0), "NFT not fractionalized");
        
        totalCost = fractionsAmount * fnft.pricePerFraction;
        platformFee = (totalCost * platformFeePercent) / 10000;
        sellerAmount = totalCost - platformFee;
    }

    // Emergency withdrawal function (only owner)
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No MNT to withdraw");
        payable(owner()).transfer(balance);
    }

    // Receive function to accept MNT
    receive() external payable {}
}
