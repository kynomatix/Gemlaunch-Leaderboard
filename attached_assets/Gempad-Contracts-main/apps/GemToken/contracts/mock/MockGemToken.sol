// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol';
import '@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol';
import '@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/access/AccessControl.sol';

contract MockGemToken is ERC20, ERC20Capped, ERC20Burnable, ERC20Pausable, Ownable {
    bytes32 public constant MINTER_ROLE = keccak256('MINTER_ROLE');

    constructor() ERC20('MockGemToken', 'M_GEM') ERC20Capped(100000000e18) {
        _mint(msg.sender, 1000000 * 10 ** 18);
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }

    function pause() public {
        _pause();
    }

    function unpause() public {
        _unpause();
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 value
    ) internal override(ERC20, ERC20Pausable) {
        super._beforeTokenTransfer(from, to, value);
    }

    function _mint(address to, uint256 amount) internal override(ERC20, ERC20Capped) {
        super._mint(to, amount);
    }
}
