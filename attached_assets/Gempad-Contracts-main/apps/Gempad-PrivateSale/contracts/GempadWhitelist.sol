// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;

import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';

abstract contract GempadWhitelist is Initializable, OwnableUpgradeable {
    mapping(address => bool) internal _whitelist;

    event WhitelistAdded(address[] account, address sender, bool status);
    event WhitelistRemoved(address[] account, address sender, bool status);

    /**
     * @notice  whitelist the users
     * @dev     being used in private sale mode
     * @param   _participants  users to add.
     */
    function addWhitelist(address[] memory _participants) external onlyOwner {
        uint256 length = _participants.length;
        for (uint256 i = 0; i < length; i++) {
            require(_participants[i] != address(0), 'Invalid address');
            require(!_whitelist[_participants[i]], 'Participant is already whitelisted');
            _whitelist[_participants[i]] = true;
        }
        emit WhitelistAdded(_participants, msg.sender, true);
    }

    /**
     * @notice  remove the users from whitelist
     * @dev     being used in private sale mode
     * @param   _participants  users to remove.
     */
    function removeWhitelist(address[] memory _participants) external onlyOwner {
        uint256 length = _participants.length;
        for (uint256 i = 0; i < length; i++) {
            require(_participants[i] != address(0), 'Invalid address');
            require(_whitelist[_participants[i]], 'Participant is not whitelisted');
            _whitelist[_participants[i]] = false;
        }
        emit WhitelistRemoved(_participants, msg.sender, false);
    }

    /**
     * @return  bool   return the whitelist status of user
     */
    function isWhitelisted(address _address) public view returns (bool) {
        return _whitelist[_address];
    }
}
