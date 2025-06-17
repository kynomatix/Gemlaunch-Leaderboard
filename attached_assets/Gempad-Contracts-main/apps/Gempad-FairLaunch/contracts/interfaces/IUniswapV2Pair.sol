// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;


//IUniswapV2Pair.sol
interface IUniswapV2Pair {

    function balanceOf(address account) external view returns (uint256);

    function approve(address spender, uint256 value) external returns (bool);

}