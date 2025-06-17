// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

interface IGemAntiBot {
  function setTokenOwner(address owner) external;

  function onPreTransferCheck(
    address from,
    address to,
    uint256 amount
  ) external;
}
