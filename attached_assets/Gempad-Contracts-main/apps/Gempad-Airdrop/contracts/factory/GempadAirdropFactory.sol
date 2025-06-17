// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import './GempadAirdropBeacon.sol';
import '../GempadAirdrop.sol';
import 'hardhat/console.sol';

contract GempadAirdropFactory is Ownable {
    using SafeERC20 for IERC20;

    address[] private airdrops;
    uint256 private airdropId = 1;
    mapping(address => address[]) private userAirdrops;

    GempadAirdropBeacon immutable beacon;

    event GempadAirdropCreated(uint256 id, address token, string name, address airdrop);

    constructor(address _initBlueprint) {
        beacon = new GempadAirdropBeacon(_initBlueprint, _msgSender());
    }

    function getAllGempadAirdrop() external view returns (address[] memory) {
        return airdrops;
    }

    function getUserAirdrop(address _user) external view returns (address[] memory) {
        return userAirdrops[_user];
    }

    /**
     * @notice create new airdrop with new params
     * @param _tokenAddress :airdrop token
     * @param _airdropName :name
     * @param _feeReceiver : receiver of reatinga nd token fee;
     */

    function createGempadAirdrop(
        address _tokenAddress,
        string memory _airdropName,
        address payable _feeReceiver
    ) public payable {
        // Create a new GempadPrivateSale contract using the beacon
        uint256 _id = airdropId++;
        BeaconProxy airdrop = new BeaconProxy{ value: msg.value }(
            address(beacon),
            abi.encodeWithSelector(
                GempadAirdrop(payable(address(0))).__GempadAirdrop_init.selector,
                _id,
                _msgSender(),
                _tokenAddress,
                _airdropName,
                _feeReceiver
            )
        );

        airdrops.push(address(airdrop));
        userAirdrops[msg.sender].push(address(airdrop));

        emit GempadAirdropCreated(_id, _tokenAddress, _airdropName, address(airdrop));
    }

    function getGempadAirdropBeacon() public view returns (address) {
        return address(beacon);
    }

    function getImplementation() public view returns (address) {
        return beacon.implementation();
    }
}
