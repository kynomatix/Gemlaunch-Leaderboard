// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;



//IUniswapV2Factory.sol
interface IUniswapV2Factory {

    function getPair(address tokenA, address tokenB)
        external
        view
        returns (address pair);

    function createPair(address tokenA, address tokenB) external returns (address pair);



}