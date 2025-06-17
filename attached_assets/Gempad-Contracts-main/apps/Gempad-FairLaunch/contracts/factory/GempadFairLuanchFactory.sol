// SPDX-License-Identifier: MIT

pragma solidity ^0.8.14;

import { ServicePayer, IPayable } from '@gempad/services/contracts/ServicePayer.sol';
import '@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '../interfaces/IERC20Extented.sol';
import './GempadFairLuanchBeacon.sol';
import '../GempadFairLaunch.sol';

// import "hardhat/console.sol";

contract GempadFairLuanchFactory is Ownable {
    using SafeERC20 for IERC20Extented;
    uint256 public IdCounter = 0;

    address[] public fairLaunches;
    mapping(address => address[]) private userFairLaunche;

    GempadFairLuanchBeacon immutable beacon;

    struct FairLaunchDetails {
        IERC20Extented token;
        uint256 totalsellTokens;
        uint256 softCap;
        bool isMaxLimit;
        uint256 maxBuyLimit;
        uint256 startTime;
        uint256 endTime;
        uint256 finalizeTime;
        uint256 publicSaleTime;
        bool isAffiliate;
        uint256 affiliateReward;
    }
    struct LiquidityDetails {
        IUniswapV2Router02 router;
        uint256 liquidityPercent;
        uint256 lockTime;
        address locker;
        uint256 liquidityAdded;
    }

    struct BuybackDetails {
        bool isBuyback;
        uint256 buyBackPercent;
        uint256 totalBuyBackAmount;
        uint256 boughtBackAmount;
        uint256 amountPerBuyback;
        uint256 minDelay;
        uint256 maxDelay;
        uint256 lastBuyTime;
    }

    event FairLaunchCreated(uint256 id, FairLaunchDetails _info, LiquidityDetails liq, address fairLaunch);

    constructor(address _initBlueprint) {
        beacon = new GempadFairLuanchBeacon(_initBlueprint, _msgSender());
    }

    function getAllFairLaunches() external view returns (address[] memory) {
        return fairLaunches;
    }

    function getUserFairLaunche(address _user) external view returns (address[] memory) {
        return userFairLaunche[_user];
    }

    /**
     * @notice  anyone can create anew fairlaunch after paying fee
     * @param   _info  .
     * @param   _liquidity  adding liquidity terms
     * @param   _buyBack   buyback terms
     * @param   _fundToken  currency for purchase
     * @param   _isprivateSale  mode of sale public or private
     * @param   _feeReceiver  protocol fee receiver
     */
    function createFairLaunch(
        FairLaunchDetails memory _info,
        LiquidityDetails memory _liquidity,
        BuybackDetails memory _buyBack,
        address _fundToken,
        bool _isprivateSale,
        address payable _feeReceiver
    ) public payable {
        // Create a new GempadPrivateSale contract using the beacon
        uint256 _id = ++IdCounter;
        BeaconProxy fairLaunch = new BeaconProxy{ value: msg.value }(
            address(beacon),
            abi.encodeWithSelector(
                GempadFairLaunch(payable(address(0))).__GempadFairLaunch_init.selector,
                _id,
                _info,
                _liquidity,
                _buyBack,
                _fundToken,
                _isprivateSale,
                _feeReceiver,
                _msgSender()
            )
        );
        uint256 tokenFee = IPayable(_feeReceiver).getFee('GempadFairLaunch');
        uint256 fee = (_info.totalsellTokens * tokenFee) / 100e3;
        uint256 tokens = _info.totalsellTokens +
            (((_info.totalsellTokens - fee) * _liquidity.liquidityPercent) / 100e3);

        uint256 before = _info.token.balanceOf(address(fairLaunch));

        _info.token.transferFrom(msg.sender, address(fairLaunch), tokens);

        require(
            _info.token.balanceOf(address(fairLaunch)) == (before + tokens),
            'Insufficient Tokens Received'
        );

        fairLaunches.push(address(fairLaunch));
        userFairLaunche[msg.sender].push(address(fairLaunch));

        emit FairLaunchCreated(_id, _info, _liquidity, address(fairLaunch));
    }

    function getFairLaunchBeacon() public view returns (address) {
        return address(beacon);
    }

    function getImplementation() public view returns (address) {
        return beacon.implementation();
    }
}
