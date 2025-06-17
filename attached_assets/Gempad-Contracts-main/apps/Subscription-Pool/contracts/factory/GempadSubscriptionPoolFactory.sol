// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import { ServicePayer, IPayable } from '@gempad/services/contracts/ServicePayer.sol';
import '@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '../interfaces/IERC20Extented.sol';
import './GempadSubscriptionPoolBeacon.sol';
import '../GempadSubscriptionPool.sol';
import 'hardhat/console.sol';

contract GempadSubscriptionPoolFactory is Ownable {
    using SafeERC20 for IERC20Extented;
    uint256 public IdCounter = 0;

    address[] public subscriptionPools;
    mapping(address => address[]) private userSubscriptionPools;

    GempadSubscriptionPoolBeacon immutable beacon;

    struct SubscriptionPoolDetails {
        IERC20Extented token;
        uint256 hardCap;
        uint256 softCap;
        uint256 userHardCap;
        uint256 sellRate;
        uint256 listingRate;
        uint256 startTime;
        uint256 endTime;
        uint256 finalizeTime;
        uint256 publicSaleTime;
    }
    struct LiquidityDetails {
        IUniswapV2Router02 router;
        uint256 liquidityPercent;
        uint256 lockTime;
        address locker;
        uint256 liquidityAdded;
    }

    event SubscriptionPoolCreated(
        uint256 id,
        SubscriptionPoolDetails _info,
        LiquidityDetails liq,
        address subscriptionPool
    );

    constructor(address _initBlueprint) {
        beacon = new GempadSubscriptionPoolBeacon(_initBlueprint, _msgSender());
    }

    function getAllSubscriptionPools() external view returns (address[] memory) {
        return subscriptionPools;
    }

    function getUserSubscriptionPools(address _user) external view returns (address[] memory) {
        return userSubscriptionPools[_user];
    }

    /**
     * @notice  anyone can create a pool after paying fee
     * @param   _info  .
     * @param   _liquidity  .
     * @param   _fundToken  .
     * @param   _isprivateSale  .
     * @param   _isRefund  refund type burn or refund
     * @param   _feeReceiver  .
     */
    function createSubscriptionPool(
        SubscriptionPoolDetails memory _info,
        LiquidityDetails memory _liquidity,
        address _fundToken,
        bool _isprivateSale,
        bool _isRefund,
        address payable _feeReceiver
    ) public payable {
        // Create a new GempadPrivateSale contract using the beacon
        uint256 _id = ++IdCounter;
        BeaconProxy subscriptionPool = new BeaconProxy{ value: msg.value }(
            address(beacon),
            abi.encodeWithSelector(
                GempadSubscriptionPool(payable(address(0))).__GempadSubscriptionPool_init.selector,
                _id,
                _info,
                _liquidity,
                _fundToken,
                _isprivateSale,
                _isRefund,
                _feeReceiver,
                _msgSender()
            )
        );

        uint256 tokenFee = IPayable(_feeReceiver).getFee('GempadSubscriptionPool');
        uint256 fee = (_info.hardCap * tokenFee) / 100e3;

        uint256 liq = ((_info.hardCap - fee) * _info.listingRate) / _info.sellRate;

        uint256 tokenToReceive = _info.hardCap + ((liq * _liquidity.liquidityPercent) / 100e3);

        uint256 before = _info.token.balanceOf(address(subscriptionPool));

        _info.token.transferFrom(msg.sender, address(subscriptionPool), tokenToReceive);

        require(
            _info.token.balanceOf(address(subscriptionPool)) == (before + tokenToReceive),
            'Insufficient tokens transfered'
        );

        subscriptionPools.push(address(subscriptionPool));

        userSubscriptionPools[msg.sender].push(address(subscriptionPool));

        emit SubscriptionPoolCreated(_id, _info, _liquidity, address(subscriptionPool));
    }

    function getSubscriptionPoolBeacon() public view returns (address) {
        return address(beacon);
    }

    function getImplementation() public view returns (address) {
        return beacon.implementation();
    }
}
