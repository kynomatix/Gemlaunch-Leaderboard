// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';

contract GemAntiBot is Ownable, ReentrancyGuard {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    //min number of block requires for antibot
    uint256 public minBlockLimit = 20;
    struct Config {
        address router;
        address pair;
        uint256 limitAmount;
        uint256 amountPerBlock;
        uint256 limitTime;
        uint256 startBlock;
        uint256 disableBlock;
        uint256 preTransferTime;
    }

    mapping(address => address) public token_owner;
    mapping(address => mapping(address => bool)) public whitelists;
    mapping(address => mapping(address => bool)) public blacklists;
    mapping(address => Config) public configs;
    mapping(address => bool) public isConfigSet;

    event Whitelist(address token, address[] users, bool status);
    event Blacklist(address token, address[] users, bool status);

    constructor() {}

    /**
     * @notice  set the token owner.
     * @dev  being called by token
     * @param   owner  of token
     */
    function setTokenOwner(address owner) public {
        token_owner[msg.sender] = owner;
    }

    /**
     * @notice  add users to whitelist
     * @param   _token  address
     * @param   _whitelists  users
     */
    function addWhiteLists(address _token, address[] memory _whitelists) public {
        require(token_owner[_token] == msg.sender, 'Not Owner');
        for (uint256 i = 0; i < _whitelists.length; i++) {
            whitelists[_token][_whitelists[i]] = true;
        }

        emit Whitelist(_token, _whitelists, true);
    }

    /**
     * @notice  add users to blacklist
     * @param   _token  address
     * @param   _blacklists  users
     */
    function addBlackLists(address _token, address[] memory _blacklists) public {
        require(token_owner[_token] == msg.sender, 'Not Owner');
        for (uint256 i = 0; i < _blacklists.length; i++) {
            blacklists[_token][_blacklists[i]] = true;
        }

        emit Blacklist(_token, _blacklists, true);
    }

    /**
     * @notice  remove users from whitelist
     * @param   _token  address
     * @param   _whitelists  users
     */
    function removeWhiteLists(address _token, address[] memory _whitelists) public {
        require(token_owner[_token] == msg.sender, 'Not Owner');
        for (uint256 i = 0; i < _whitelists.length; i++) {
            whitelists[_token][_whitelists[i]] = false;
        }

        emit Whitelist(_token, _whitelists, false);
    }

    /**
     * @notice  remove users from blacklist
     * @param   _token  address
     * @param   _blacklists  users
     */
    function removeblackLists(address _token, address[] memory _blacklists) public {
        require(token_owner[_token] == msg.sender, 'Not Owner');
        for (uint256 i = 0; i < _blacklists.length; i++) {
            blacklists[_token][_blacklists[i]] = false;
        }

        emit Blacklist(_token, _blacklists, false);
    }

    /**
     * @notice  set terms of token transfer
     * @param   _token  .
     * @param   _router  .
     * @param   _pair  .
     * @param   _limitAmount  .
     * @param   _amountPerBlock  .
     * @param   _limitTime  .
     * @param   _disableBlock  .
     */
    function saveConfig(
        address _token,
        address _router,
        address _pair,
        uint256 _limitAmount,
        uint256 _amountPerBlock,
        uint256 _limitTime,
        uint256 _disableBlock
    ) public {
        require(token_owner[_token] == msg.sender, 'Not Owner');
        require(_disableBlock >= minBlockLimit, 'Min disable limit is 20');
        Config storage _config = configs[_token];
        _config.router = _router;
        _config.limitTime = _limitTime;
        _config.limitAmount = _limitAmount;
        _config.amountPerBlock = _amountPerBlock;
        _config.pair = _pair;
        _config.startBlock = block.number;
        _config.disableBlock = block.number + _disableBlock;
        isConfigSet[_token] = true;
    }

    /**
     * @notice  check for terms
     * @param   from  .
     * @param   to  .
     * @param   amount  .
     * @return  bool  .
     */
    function onPreTransferCheck(address from, address to, uint256 amount) public returns (bool) {
        Config storage _config = configs[msg.sender];
        if (block.number >= _config.disableBlock) return true;
        require(
            whitelists[msg.sender][from] == true && whitelists[msg.sender][to] == true,
            'Transfer between not whitelisted users'
        );
        require(
            blacklists[msg.sender][from] != true && blacklists[msg.sender][to] != true,
            'Transfer between blacklisted users'
        );

        uint256 currentLimitAmount = _config.limitAmount +
            (block.number - _config.startBlock) *
            _config.amountPerBlock;

        require(amount > 0 && amount <= currentLimitAmount, 'Invalid Amount');
        require(block.timestamp.sub(_config.preTransferTime) >= _config.limitTime, 'Not Transfer Time');
        _config.preTransferTime = block.timestamp;
        return true;
    }

    /**
     * @notice  minimum antiobot active time
     * @param   _minBlockLimit  .
     */
    function setMinBlockLimit(uint256 _minBlockLimit) external onlyOwner {
        require(_minBlockLimit >= 20, 'Min disable limit is 20');
        minBlockLimit = _minBlockLimit;
    }

    /**
     * @return  uint256  the current block.
     */
    function getCurrrentBlock() public view returns (uint256) {
        return block.number;
    }
}
