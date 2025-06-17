// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import { ServicePayer, IPayable } from '@gempad/services/contracts/ServicePayer.sol';
import '@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '../interfaces/IERC20Extented.sol';
import './GempadLaunchpadBeacon.sol';
import '../GempadLaunchpad.sol';
import 'hardhat/console.sol';

contract GempadLaunchpadFactory is Ownable {
    using SafeERC20 for IERC20Extented;

    uint256 public IdCounter = 0;

    address[] public launchpads;
    mapping(address => address[]) private userLaunchpads;

    GempadLaunchpadBeacon immutable beacon;

    struct LaunchpadDetails {
        IERC20Extented token;
        uint256 sellPrice;
        uint256 listingPrice;
        uint256 softCap;
        uint256 hardCap;
        uint256 minBuyLimit;
        uint256 maxBuyLimit;
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
        bool isAutolisting;
    }
    struct VestingDetails {
        bool isVestingEnable;
        uint256 TGEPercent;
        uint256 cyclePercent;
        uint256 cycleInterval;
    }

    event LaunchpadCreated(
        uint256 id,
        LaunchpadDetails info,
        LiquidityDetails liq,
        VestingDetails vesting,
        bool isprivateSale,
        address launchpad
    );

    constructor(address _initBlueprint) {
        beacon = new GempadLaunchpadBeacon(_initBlueprint, _msgSender());
    }

    function getAllLaunchpads() external view returns (address[] memory) {
        return launchpads;
    }

    function getUserLaunchpads(address _user) external view returns (address[] memory) {
        return userLaunchpads[_user];
    }

    /**
     * @notice  create a new luanchpad by user after paying fee.
     * @dev     called by user
     * @param   _info  core params
     * @param   _liquidity  liquidity setting
     * @param   _vesting  token claim vesting
     * @param   _fundToken   purchase currency
     * @param   _isprivateSale  public or private sale mode
     * @param   _isAffiliate   status of affiliate.
     * @param   _affiliateReward  reward percentage in bips
     * @param   _refundType  refund extra token ror burn (//true refund and false burn)
     * @param   _feeReceiver  protocol fee receiver
     */
    function createLaunchpad(
        LaunchpadDetails memory _info,
        LiquidityDetails memory _liquidity,
        VestingDetails memory _vesting,
        address _fundToken,
        bool _isprivateSale,
        bool _isAffiliate,
        uint256 _affiliateReward,
        bool _refundType,
        address payable _feeReceiver
    ) public payable {
        // Create a new GempadPrivateSale contract using the beacon
        uint256 _id = ++IdCounter;
        BeaconProxy launchpad = new BeaconProxy{ value: msg.value }(
            address(beacon),
            abi.encodeWithSelector(
                GempadLaunchpad(payable(address(0))).__GempadLaunchpad_init.selector,
                _id,
                _info,
                _liquidity,
                _vesting,
                _fundToken,
                _isprivateSale,
                _isAffiliate,
                _affiliateReward,
                _refundType,
                _feeReceiver,
                _msgSender()
            )
        );

        uint256 toReceive = getTokens(_info, _liquidity, _feeReceiver, _fundToken);

        uint256 before = _info.token.balanceOf(address(launchpad));

        _info.token.transferFrom(msg.sender, address(launchpad), toReceive);

        require(
            _info.token.balanceOf(address(launchpad)) == (before + toReceive),
            'Insufficient token received'
        );

        launchpads.push(address(launchpad));
        userLaunchpads[msg.sender].push(address(launchpad));

        emit LaunchpadCreated(_id, _info, _liquidity, _vesting, _isprivateSale, address(launchpad));
    }

    function getTokens(
        LaunchpadDetails memory _info,
        LiquidityDetails memory _liquidity,
        address _feeReceiver,
        address _fundToken
    ) private returns (uint256) {
        uint256 decimals = (_fundToken == address(0)) ? 18 : IERC20Extented(_fundToken).decimals();

        uint256 sellTokens = (_info.hardCap * _info.sellPrice) / 10 ** decimals;

        uint256 tokenFee = IPayable(_feeReceiver).getFee('GempadLaunchpad');

        uint256 fee = (sellTokens * tokenFee) / 100e3;

        uint256 list = ((sellTokens - fee) * _liquidity.liquidityPercent) / 100e3;

        uint256 listingTokens = (list * _info.listingPrice) / _info.sellPrice;

        uint256 totalReceive = sellTokens + listingTokens;

        uint256 toReceive = _liquidity.isAutolisting ? totalReceive : sellTokens;

        return toReceive;
    }

    function getLaunchpadBeacon() public view returns (address) {
        return address(beacon);
    }

    function getImplementation() public view returns (address) {
        return beacon.implementation();
    }
}
