// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import './GempadPrivateSaleBeacon.sol';
import '../GempadPrivateSale.sol';

contract GempadPrivateSaleFactory is Ownable {
    using SafeERC20 for IERC20;
    uint256 public IdCounter = 0;

    address[] private privateSales;
    mapping(address => address[]) private userSales;

    GempadPrivateSaleBeacon immutable beacon;

    struct PrivateSaleInfo {
        string name;
        uint256 softCap;
        uint256 hardCap;
        uint256 minBuyLimit;
        uint256 maxBuyLimit;
        uint256 startTime;
        uint256 endTime;
        uint256 finalizeTime;
        uint256 publicSaleTime;
    }
    struct VestingInfo {
        uint256 initialRelease;
        uint256 cyclePercent;
        uint256 cycleInterval;
    }

    enum Mode {
        PUBLIC,
        WHITELIST,
        ANTI_BOT
    }

    event PrivateSaleCreated(
        uint256 id,
        PrivateSaleInfo info,
        VestingInfo vesting,
        Mode mode,
        address fundToken,
        address privateSale
    );

    constructor(address _initBlueprint) {
        beacon = new GempadPrivateSaleBeacon(_initBlueprint, _msgSender());
    }

    function getAllPrivateSales() external view returns (address[] memory) {
        return privateSales;
    }

    function getUserPrivateSales(address _user) external view returns (address[] memory) {
        return userSales[_user];
    }

    /**
     * @notice  create new private sale with new params by any user
     * @param   info  sale core params
     * @param   _vesting  vesting setting for claim
     * @param   mode  selling type (public , private)
     * @param   feeReceiver  .
     * @param   fundToken  currency reuire to buy Tokens
     */
    function createPrivateSale(
        PrivateSaleInfo memory info,
        VestingInfo memory _vesting,
        Mode mode,
        address payable feeReceiver,
        address fundToken
    ) public payable {
        // Create a new GempadPrivateSale contract using the beacon
        uint256 id = ++IdCounter;
        BeaconProxy privateSale = new BeaconProxy{ value: msg.value }(
            address(beacon),
            abi.encodeWithSelector(
                GempadPrivateSale(payable(address(0))).__GempadPrivateSale_init.selector,
                id,
                _msgSender(),
                info,
                _vesting,
                mode,
                feeReceiver,
                fundToken
            )
        );

        privateSales.push(address(privateSale));
        userSales[msg.sender].push(address(privateSale));

        emit PrivateSaleCreated(id, info, _vesting, mode, fundToken, address(privateSale));
    }

    function getPrivateSaleBeacon() public view returns (address) {
        return address(beacon);
    }

    function getImplementation() public view returns (address) {
        return beacon.implementation();
    }
}
