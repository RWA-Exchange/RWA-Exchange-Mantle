// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// Fixed paths for OpenZeppelin 4.x
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./PropertyNFT.sol";
import "./Fraction.sol";

/**
 * @title RWA Fractionalizer Contract for Mantle Network
 */
contract Fractionalizer is ReentrancyGuard, Pausable, Ownable {
    address payable public propertyNFTAddress;

    mapping(address => bool) public kycVerified;

    struct FractionalizationData {
        uint256 tokenId;
        uint256 totalFractions;
        string name;
        string symbol;
        uint256 pricePerFraction;
    }

    struct FractionalizedNFT {
        address fractionToken;
        uint256 totalFractions;
        address originalOwner;
        uint256 timestamp;
        bool isActive;
        uint256 pricePerFraction; 
        uint256 totalValueMNT; 
    }

    mapping(uint256 => FractionalizedNFT) public fractionalizedNFTs;
    mapping(address => uint256) public totalMNTCollected; 
    mapping(uint256 => uint256) public fractionSales; 
    
    uint256 public platformFeePercent = 250; 
    address public feeRecipient;
    uint256 public constant MAX_FEE_PERCENT = 1000; 

    event NFTFractionalized(uint256 indexed tokenId, address indexed fractionToken, uint256 totalFractions, address indexed originalOwner, uint256 pricePerFraction, uint256 timestamp);
    event NFTRedeemed(uint256 indexed tokenId, address indexed redeemer, address fractionToken, uint256 timestamp);
    event FractionPurchased(uint256 indexed tokenId, address indexed buyer, uint256 fractionsAmount, uint256 totalCostMNT, uint256 timestamp);
    event KYCStatusUpdated(address indexed user, bool status);
    event PlatformFeeUpdated(uint256 oldFee, uint256 newFee);
    event FeeRecipientUpdated(address oldRecipient, address newRecipient);

    constructor(address payable _propertyNFTAddress) {
        _transferOwnership(msg.sender); // OZ 4.x compatible
        propertyNFTAddress = _propertyNFTAddress;
        feeRecipient = msg.sender; 
    }

    // --- EMERGENCY MGMT ---
    function pause() external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }

    function setPlatformFee(uint256 _feePercent) external onlyOwner {
        require(_feePercent <= MAX_FEE_PERCENT, "Fee too high");
        emit PlatformFeeUpdated(platformFeePercent, _feePercent);
        platformFeePercent = _feePercent;
    }

    // --- CORE LOGIC ---
    function fractionalize(FractionalizationData calldata data) public nonReentrant whenNotPaused {
        require(data.totalFractions > 0 && data.totalFractions <= 10000000, "Invalid fractions count");
        require(data.pricePerFraction > 0, "Price must be > 0");
        
        PropertyNFT propertyNFT = PropertyNFT(propertyNFTAddress);
        require(propertyNFT.ownerOf(data.tokenId) == msg.sender, "Not owner");
        require(fractionalizedNFTs[data.tokenId].fractionToken == address(0), "Already fractionalized");

        // Transfer NFT to this contract (Ensure you called approve() on PropertyNFT first)
        propertyNFT.transferFrom(msg.sender, address(this), data.tokenId);

        // Deploy Fraction token (Assuming Fraction constructor takes: name, symbol, initialOwner)
        Fraction fractionToken = new Fraction(data.name, data.symbol, address(this));

        uint256 totalValueMNT = data.totalFractions * data.pricePerFraction;

        fractionalizedNFTs[data.tokenId] = FractionalizedNFT({
            fractionToken: address(fractionToken),
            totalFractions: data.totalFractions,
            originalOwner: msg.sender,
            timestamp: block.timestamp,
            isActive: true,
            pricePerFraction: data.pricePerFraction,
            totalValueMNT: totalValueMNT
        });

        fractionToken.mint(msg.sender, data.totalFractions);

        emit NFTFractionalized(data.tokenId, address(fractionToken), data.totalFractions, msg.sender, data.pricePerFraction, block.timestamp);
    }

    function purchaseFractions(uint256 tokenId, uint256 fractionsAmount) public payable nonReentrant whenNotPaused {
        FractionalizedNFT storage fnft = fractionalizedNFTs[tokenId];
        require(fnft.isActive, "Not active");
        
        uint256 totalCost = fractionsAmount * fnft.pricePerFraction;
        require(msg.value >= totalCost, "MNT low");

        Fraction fractionToken = Fraction(fnft.fractionToken);
        
        uint256 platformFee = (totalCost * platformFeePercent) / 10000;
        uint256 sellerAmount = totalCost - platformFee;

        // Note: originalOwner must have called approve() on the Fraction token for this contract
        fractionToken.transferFrom(fnft.originalOwner, msg.sender, fractionsAmount);

        if (platformFee > 0) payable(feeRecipient).transfer(platformFee);
        payable(fnft.originalOwner).transfer(sellerAmount);

        totalMNTCollected[fnft.originalOwner] += sellerAmount;
        fractionSales[tokenId] += totalCost;

        if (msg.value > totalCost) payable(msg.sender).transfer(msg.value - totalCost);

        emit FractionPurchased(tokenId, msg.sender, fractionsAmount, totalCost, block.timestamp);
    }

    function redeem(uint256 tokenId) public nonReentrant whenNotPaused {
        FractionalizedNFT storage fnft = fractionalizedNFTs[tokenId];
        require(fnft.isActive, "Not active");

        Fraction fractionToken = Fraction(fnft.fractionToken);
        require(fractionToken.balanceOf(msg.sender) == fnft.totalFractions, "Not full owner");

        address tokenAddr = fnft.fractionToken;

        // Burn fractions and return NFT
        fractionToken.transferFrom(msg.sender, address(this), fnft.totalFractions);
        fractionToken.burn(fnft.totalFractions);

        PropertyNFT(propertyNFTAddress).transferFrom(address(this), msg.sender, tokenId);

        fnft.isActive = false;
        emit NFTRedeemed(tokenId, msg.sender, tokenAddr, block.timestamp);
    }

    // --- VIEW FUNCTIONS ---
    function getAvailableFractions(uint256 tokenId) external view returns (uint256) {
        FractionalizedNFT memory fnft = fractionalizedNFTs[tokenId];
        if (!fnft.isActive) return 0;
        return Fraction(fnft.fractionToken).balanceOf(fnft.originalOwner);
    }

    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    receive() external payable {}
}