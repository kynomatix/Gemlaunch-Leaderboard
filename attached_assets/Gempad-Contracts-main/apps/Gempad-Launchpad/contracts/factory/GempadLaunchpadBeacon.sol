// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract GempadLaunchpadBeacon is Ownable {
    UpgradeableBeacon immutable beacon;

    address public blueprint;

    constructor(address _initBlueprint, address _owner) {
        beacon = new UpgradeableBeacon(_initBlueprint);
        blueprint = _initBlueprint;
        transferOwnership(_owner);
    }

    /**
     * @notice  new implementation contract address
     */
    function update(address _newBlueprint) public onlyOwner {
        require(_newBlueprint != address(0), 'Invalid blueprint');
        beacon.upgradeTo(_newBlueprint);
        blueprint = _newBlueprint;
    }

    function implementation() public view returns (address) {
        return beacon.implementation();
    }
}
