// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title TestToken
/// @author Netixsol
/// @notice g
/// @dev g
contract TestToken2 is ERC20 {
    constructor() ERC20("TestToken", "TTN") {
        _mint(msg.sender, 1000000 ether);
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
    
}
