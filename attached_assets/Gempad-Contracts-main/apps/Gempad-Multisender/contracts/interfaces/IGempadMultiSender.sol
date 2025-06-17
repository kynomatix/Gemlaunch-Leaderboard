// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;


interface IGempadMultiSender {
    function multisendToken(
        address token,
        bool ensureExactAmount,
        address[] calldata targets,
        uint256[] calldata amounts
    ) external payable;

    function multisendEther(
        address[] calldata targets,
        uint256[] calldata amounts
    ) external payable;
}