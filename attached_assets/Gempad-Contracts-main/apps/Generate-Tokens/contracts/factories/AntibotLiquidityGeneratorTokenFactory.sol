// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/proxy/Clones.sol';
import '@openzeppelin/contracts/utils/Address.sol';
import './TokenFactoryBase.sol';
import '../AntiBotLiquidityGeneratorToken.sol';
import '../../interfaces/ILiquidityGeneratorToken.sol';

contract AntibotLiquidityGeneratorTokenFactory is TokenFactoryBase {
    using Address for address payable;

    constructor(
        address factoryManager_,
        address implementation_
    ) TokenFactoryBase(factoryManager_, implementation_) {}

    function create(
        string memory name,
        string memory symbol,
        uint256 totalSupply,
        address router,
        address charity,
        uint16 taxFeeBps,
        uint16 liquidityFeeBps,
        uint16 charityBps,
        address pinkAntiBot_
    ) external payable enoughFee nonReentrant returns (address) {
        refundExcessiveFee();
        payable(feeTo).sendValue(flatFee);
        AntiBotLiquidityGeneratorToken ltoken = new AntiBotLiquidityGeneratorToken(
            msg.sender,
            name,
            symbol,
            totalSupply,
            router,
            charity,
            taxFeeBps,
            liquidityFeeBps,
            charityBps,
            pinkAntiBot_
        );
        ltoken.transferOwnership(msg.sender);
        assignTokenToOwner(msg.sender, address(ltoken), 8);
        emit TokenCreated(msg.sender, address(ltoken), 8);
        return address(ltoken);
    }
}
