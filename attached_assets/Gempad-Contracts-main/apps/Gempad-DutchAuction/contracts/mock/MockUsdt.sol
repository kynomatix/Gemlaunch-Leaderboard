// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

/// @title TestToken
/// @author Netixsol
/// @notice g
/// @dev g
contract MockUsdt is ERC20 {
    constructor() ERC20('MockUsdt', 'USDT') {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    function decimals() public pure virtual override returns (uint8) {
        return 6;
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}
