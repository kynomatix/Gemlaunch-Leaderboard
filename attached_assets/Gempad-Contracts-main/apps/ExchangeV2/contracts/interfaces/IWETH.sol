// SPDX-License-Identifier: UNLICENSED

pragma solidity =0.6.6;

// WETH Interface
interface IWETH {
    function deposit() external payable;

    function transfer(address to, uint256 value) external returns (bool);

    function withdraw(uint256) external;
}
