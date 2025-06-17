// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./TokenFactoryBase.sol";
import "../../interfaces/IAntiBotStandardERC20.sol";
import "hardhat/console.sol";

contract AntiBotStandardTokenFactory is TokenFactoryBase {
  using Address for address payable;
  using SafeMath for uint256;
  constructor(address factoryManager_, address implementation_) TokenFactoryBase(factoryManager_, implementation_) {}

  function create(
    string memory name, 
    string memory symbol, 
    uint8 decimals, 
    uint256 totalSupply,
    address gemAntiBot_
  ) external payable enoughFee nonReentrant returns (address token) {
    refundExcessiveFee();
    payable(feeTo).sendValue(flatFee);
    token = Clones.clone(implementation);
    
    IAntiBotStandardERC20(token).initialize(msg.sender, name, symbol, decimals, totalSupply,gemAntiBot_);

    assignTokenToOwner(msg.sender, token, 5);
    emit TokenCreated(msg.sender, token, 5);
  }
}