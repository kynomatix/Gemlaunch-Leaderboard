// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;

import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';

abstract contract AuctionWhitelist is Initializable, OwnableUpgradeable {
    mapping(address => bool) internal _whitelist;

    event WhitelistUpdated(address[] account, address sender);

    /**
     * @notice  add users to whitelist
     * @param _participants  address of users
     */
    function addWhitelist(address[] memory _participants) external onlyOwner {
        uint256 length = _participants.length;
        for (uint256 i = 0; i < length; i++) {
            require(_participants[i] != address(0), 'Invalid address');
            require(!_whitelist[_participants[i]], 'Participant is already whitelisted');
            _whitelist[_participants[i]] = true;
        }
        emit WhitelistUpdated(_participants, msg.sender);
    }

    /**
     * @notice  remove usres from whitelist
     * @param _participants  address of users
     */
    function removeWhitelist(address[] memory _participants) external onlyOwner {
        uint256 length = _participants.length;
        for (uint256 i = 0; i < length; i++) {
            require(_participants[i] != address(0), 'Invalid address');
            require(_whitelist[_participants[i]], 'Participant is not whitelisted');
            _whitelist[_participants[i]] = false;
        }
        emit WhitelistUpdated(_participants, msg.sender);
    }

    /**
     * @return  bool return whitelist status of user
     */
    function isWhitelisted(address _address) public view returns (bool) {
        return _whitelist[_address];
    }
}
