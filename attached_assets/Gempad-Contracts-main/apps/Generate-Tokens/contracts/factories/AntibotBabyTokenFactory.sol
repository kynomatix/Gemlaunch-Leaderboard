// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "./TokenFactoryBase.sol";
import "../AntiBotBabyToken.sol";
import "../../interfaces/IBabyToken.sol";
import "hardhat/console.sol";


contract AntibotBabyTokenFactory is TokenFactoryBase {
  using Address for address payable;

  constructor(address factoryManager_, address implementation_) TokenFactoryBase(factoryManager_, implementation_) {}

  function create(
    string memory name,
    string memory symbol,
    uint256 totalSupply,
    address[5] memory addrs, // reward, router, marketing wallet, dividendTracker, anti bot
    uint256[3] memory feeSettings, // rewards, liquidity, marketing
    uint256 minimumTokenBalanceForDividends_
  ) external payable enoughFee nonReentrant returns (address token) {
    refundExcessiveFee();
    payable(feeTo).sendValue(flatFee);
    AntiBotBabyToken btoken = new AntiBotBabyToken(
            msg.sender,
            name,
            symbol,
            totalSupply,
            addrs,
            feeSettings,
            minimumTokenBalanceForDividends_
        );
    btoken.transferOwnership(msg.sender);
    assignTokenToOwner(msg.sender, address(btoken), 6);
    emit TokenCreated(msg.sender, address(btoken), 6);
    return address(btoken);
  }
}