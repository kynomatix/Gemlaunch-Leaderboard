// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract Dxt is ERC20 {
    constructor() ERC20('Dxt', 'DT') {
        _mint(msg.sender, 1000000 * (10 ** decimals()));
    }

    function decimals() public pure virtual override returns (uint8) {
        return 9;
    }
}
