// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol"; // Fixed path for OZ 4.x

/**
 * @title Enhanced Fraction Token for Mantle Network
 */
contract Fraction is ERC20, ERC20Permit, ERC20Votes, Ownable, Pausable {
    address public minter;
    
    string public propertyDescription;
    string public propertyLocation;
    string public imageUrl;
    uint256 public totalPropertyValue; 
    uint256 public creationTimestamp;
    
    mapping(address => uint256) public lastTransferTimestamp;
    mapping(address => bool) public frozenAccounts;
    
    event MinterUpdated(address indexed oldMinter, address indexed newMinter);
    event PropertyMetadataUpdated(string description, string location, string imageUrl);
    event AccountFrozen(address indexed account, bool frozen);
    event EmergencyPause(address indexed admin, uint256 timestamp);
    event EmergencyUnpause(address indexed admin, uint256 timestamp);

    modifier onlyMinter() {
        require(msg.sender == minter, "Only minter");
        _;
    }

    modifier notFrozen(address account) {
        require(!frozenAccounts[account], "Account frozen");
        _;
    }

    constructor(
        string memory name, 
        string memory symbol, 
        address _minter
    ) 
        ERC20(name, symbol) 
        ERC20Permit(name)
    {
        _transferOwnership(_minter); // OZ 4.x compatible
        minter = _minter;
        creationTimestamp = block.timestamp;
    }

    function mint(address to, uint256 amount) public onlyMinter whenNotPaused notFrozen(to) {
        _mint(to, amount);
        lastTransferTimestamp[to] = block.timestamp;
    }

    function burn(uint256 amount) public onlyMinter whenNotPaused {
        _burn(msg.sender, amount);
    }

    function burnFrom(address account, uint256 amount) public onlyMinter whenNotPaused {
        _spendAllowance(account, msg.sender, amount);
        _burn(account, amount);
    }

    function freezeAccount(address account, bool freeze) public onlyMinter {
        frozenAccounts[account] = freeze;
        emit AccountFrozen(account, freeze);
    }

    // --- OVERRIDES ---

    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        override(ERC20)
        whenNotPaused
        notFrozen(from)
        notFrozen(to)
    {
        super._beforeTokenTransfer(from, to, amount);
    }

    function _afterTokenTransfer(address from, address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._afterTokenTransfer(from, to, amount);
        if (from != address(0)) lastTransferTimestamp[from] = block.timestamp;
        if (to != address(0)) lastTransferTimestamp[to] = block.timestamp;
    }

    function _mint(address account, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._mint(account, amount);
    }

    function _burn(address account, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._burn(account, amount);
    }

    function nonces(address owner)
        public
        view
        override(ERC20Permit) // Fixed for OZ 4.x
        returns (uint256)
    {
        return super.nonces(owner);
    }

    // --- VIEW FUNCTIONS ---

    function getTokenInfo() external view returns (
        string memory, string memory, uint256, uint8, address, uint256, string memory, string memory, string memory, uint256
    ) {
        return (name(), symbol(), totalSupply(), decimals(), minter, totalPropertyValue, propertyDescription, propertyLocation, imageUrl, creationTimestamp);
    }

    function getFractionValue(uint256 fractionAmount) external view returns (uint256) {
        if (totalSupply() == 0) return 0;
        return (totalPropertyValue * fractionAmount) / totalSupply();
    }

    function pause() public onlyMinter { _pause(); }
    function unpause() public onlyMinter { _unpause(); }
}