// SPDX-License-Identifier: MIT

pragma solidity ^0.8.14;

import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';

interface IPayable {
    function pay(string memory serviceName) external payable;

    function getFee(string memory serviceName) external returns (uint256);
}

/**
 * @title ServicePayer
 * @dev Implementation of the ServicePayer
 */
abstract contract ServicePayer is Initializable {
    function __ServicePayer_init(
        address payable receiver,
        string memory serviceName
    ) public payable onlyInitializing {
        IPayable(receiver).pay{ value: msg.value }(serviceName);
    }
}
