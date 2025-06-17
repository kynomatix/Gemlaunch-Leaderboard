// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "./TokenFactoryBase.sol";
import "../../interfaces/IBabyToken.sol";


contract BabyTokenFactory is TokenFactoryBase {
  using Address for address payable;

  constructor(address factoryManager_, address implementation_) TokenFactoryBase(factoryManager_, implementation_) {}

  function create(
    string memory name,
    string memory symbol,
    uint256 totalSupply,
    address[4] memory addrs, // reward, router, marketing wallet, dividendTracker
    uint256[3] memory feeSettings, // rewards, liquidity, marketing
    uint256 minimumTokenBalanceForDividends_
  ) external payable enoughFee nonReentrant returns (address token) {
    refundExcessiveFee();
    payable(feeTo).sendValue(flatFee);
    token = Clones.clone(implementation);
    IBabyToken(token).initialize(
      msg.sender,
      name,
      symbol,
      totalSupply,
      addrs,
      feeSettings,
      minimumTokenBalanceForDividends_
    );
    assignTokenToOwner(msg.sender, token, 2);
    emit TokenCreated(msg.sender, token, 2);
  }
}