// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "./TokenFactoryBase.sol";
import "../AntiBotBuybackBabyToken.sol";


contract AntibotBuyBackBabyTokenFactory is TokenFactoryBase {
    using Address for address payable;

    constructor(address factoryManager_, address implementation_)
        TokenFactoryBase(factoryManager_, implementation_)
    {}

    function create(
        string memory name_,
        string memory symbol_,
        uint256 totalSupply_,
        address rewardToken_,
        address router_,
        address antiBot_,
        uint256[5] memory feeSettings_
    ) external payable enoughFee nonReentrant returns (address) {
        refundExcessiveFee();
        payable(feeTo).sendValue(flatFee);
        AntiBotBuybackBabyToken btoken = new AntiBotBuybackBabyToken(
            msg.sender,
            name_,
            symbol_,
            totalSupply_,
            rewardToken_,
            router_,
            antiBot_,
            feeSettings_
        );

        btoken.transferOwnership(payable(msg.sender));
        assignTokenToOwner(msg.sender, address(btoken), 7);
        emit TokenCreated(msg.sender, address(btoken), 7);
        return address(btoken);
    }
}