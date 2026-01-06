// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title Enhanced Fraction Token for Mantle Network
 * @dev ERC20 token representing fractional ownership with governance and Mantle optimizations
 * @notice Includes permit functionality for gasless approvals and voting capabilities
 */
contract Fraction is ERC20, ERC20Permit, ERC20Votes, Ownable, Pausable {
    address public minter;
    
    // Mantle-specific metadata
    string public propertyDescription;
    string public propertyLocation;
    string public imageUrl;
    uint256 public totalPropertyValue; // In MNT wei
    uint256 public creationTimestamp;
    
    // Enhanced tracking for Mantle ecosystem
    mapping(address => uint256) public lastTransferTimestamp;
    mapping(address => bool) public frozenAccounts;
    
    // Events for enhanced tracking
    event MinterUpdated(address indexed oldMinter, address indexed newMinter);
    event PropertyMetadataUpdated(string description, string location, string imageUrl);
    event AccountFrozen(address indexed account, bool frozen);
    event EmergencyPause(address indexed admin, uint256 timestamp);
    event EmergencyUnpause(address indexed admin, uint256 timestamp);

    modifier onlyMinter() {
        require(msg.sender == minter, "Only minter can call this function");
        _;
    }

    modifier notFrozen(address account) {
        require(!frozenAccounts[account], "Account is frozen");
        _;
    }

    constructor(
        string memory name, 
        string memory symbol, 
        address _minter
    ) 
        ERC20(name, symbol) 
        ERC20Permit(name)
        Ownable(_minter)
    {
        minter = _minter;
        creationTimestamp = block.timestamp;
    }

    /**
     * @dev Enhanced mint function with Mantle optimizations
     */
    function mint(address to, uint256 amount) public onlyMinter whenNotPaused notFrozen(to) {
        require(to != address(0), "Cannot mint to zero address");
        require(amount > 0, "Amount must be greater than 0");
        
        _mint(to, amount);
        lastTransferTimestamp[to] = block.timestamp;
    }

    /**
     * @dev Enhanced burn function with proper validation
     */
    function burn(uint256 amount) public onlyMinter whenNotPaused {
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf(address(this)) >= amount, "Insufficient balance to burn");
        
        _burn(address(this), amount);
    }

    /**
     * @dev Burn tokens from a specific address (with approval)
     */
    function burnFrom(address account, uint256 amount) public onlyMinter whenNotPaused {
        require(account != address(0), "Cannot burn from zero address");
        require(amount > 0, "Amount must be greater than 0");
        
        uint256 currentAllowance = allowance(account, msg.sender);
        require(currentAllowance >= amount, "Burn amount exceeds allowance");
        
        _spendAllowance(account, msg.sender, amount);
        _burn(account, amount);
    }

    /**
     * @dev Set property metadata for enhanced NFT information
     */
    function setPropertyMetadata(
        string memory _description,
        string memory _location,
        string memory _imageUrl,
        uint256 _totalPropertyValue
    ) public onlyMinter {
        propertyDescription = _description;
        propertyLocation = _location;
        imageUrl = _imageUrl;
        totalPropertyValue = _totalPropertyValue;
        
        emit PropertyMetadataUpdated(_description, _location, _imageUrl);
    }

    /**
     * @dev Update minter address (only current minter can do this)
     */
    function updateMinter(address newMinter) public onlyMinter {
        require(newMinter != address(0), "New minter cannot be zero address");
        address oldMinter = minter;
        minter = newMinter;
        emit MinterUpdated(oldMinter, newMinter);
    }

    /**
     * @dev Freeze/unfreeze accounts for compliance
     */
    function freezeAccount(address account, bool freeze) public onlyMinter {
        require(account != address(0), "Cannot freeze zero address");
        frozenAccounts[account] = freeze;
        emit AccountFrozen(account, freeze);
    }

    /**
     * @dev Emergency pause function
     */
    function pause() public onlyMinter {
        _pause();
        emit EmergencyPause(msg.sender, block.timestamp);
    }

    /**
     * @dev Emergency unpause function
     */
    function unpause() public onlyMinter {
        _unpause();
        emit EmergencyUnpause(msg.sender, block.timestamp);
    }

    /**
     * @dev Enhanced transfer with frozen account checks
     */
    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Votes)
        whenNotPaused
        notFrozen(from)
        notFrozen(to)
    {
        super._update(from, to, value);
        
        // Update transfer timestamps for tracking
        if (from != address(0)) {
            lastTransferTimestamp[from] = block.timestamp;
        }
        if (to != address(0)) {
            lastTransferTimestamp[to] = block.timestamp;
        }
    }

    /**
     * @dev Get comprehensive token information
     */
    function getTokenInfo() external view returns (
        string memory tokenName,
        string memory tokenSymbol,
        uint256 totalSupply,
        uint8 decimals,
        address tokenMinter,
        uint256 propertyValue,
        string memory description,
        string memory location,
        string memory image,
        uint256 created
    ) {
        return (
            name(),
            symbol(),
            totalSupply(),
            decimals(),
            minter,
            totalPropertyValue,
            propertyDescription,
            propertyLocation,
            imageUrl,
            creationTimestamp
        );
    }

    /**
     * @dev Get account status information
     */
    function getAccountInfo(address account) external view returns (
        uint256 balance,
        uint256 lastTransfer,
        bool isFrozen,
        uint256 votingPower
    ) {
        return (
            balanceOf(account),
            lastTransferTimestamp[account],
            frozenAccounts[account],
            getVotes(account)
        );
    }

    /**
     * @dev Calculate fraction value in MNT
     */
    function getFractionValue(uint256 fractionAmount) external view returns (uint256) {
        if (totalSupply() == 0) return 0;
        return (totalPropertyValue * fractionAmount) / totalSupply();
    }

    /**
     * @dev Get fraction percentage of total property
     */
    function getFractionPercentage(uint256 fractionAmount) external view returns (uint256) {
        if (totalSupply() == 0) return 0;
        return (fractionAmount * 10000) / totalSupply(); // Returns basis points (1/100th of a percent)
    }

    // Required overrides for multiple inheritance
    function nonces(address owner)
        public
        view
        override(ERC20Permit, Nonces)
        returns (uint256)
    {
        return super.nonces(owner);
    }
}
