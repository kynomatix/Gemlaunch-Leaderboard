// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import { ServicePayer, IPayable } from '@gempad/services/contracts/ServicePayer.sol';
import '@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '../interfaces/IERC20Extented.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import './GempadDutchAuctionBeacon.sol';
import '../GempadDutchAuction.sol';

contract GempadDutchAuctionFactory is Ownable {
    using SafeERC20 for IERC20Extented;
    uint256 public IdCounter = 0;

    address[] public dutchAuctions;
    mapping(address => address[]) private userDutchAuctions;

    GempadDutchAuctionBeacon immutable beacon;

    struct AuctionDetails {
        IERC20Extented token;
        uint256 totalSaleAmount;
        uint256 startPrice;
        uint256 endPrice;
        uint256 softCap;
        uint256 hardCap;
        uint256 minBuyLimit;
        uint256 maxBuyLimit;
        uint256 startTime;
        uint256 endTime;
        uint256 finalizeTime;
        uint256 publicSaleTime;
        uint256 decreaseInterval;
    }
    struct LiquidityDetails {
        IUniswapV2Router02 router;
        uint256 liquidityPercent;
        uint256 lockTime;
        address locker;
        uint256 liquidityAdded;
    }
    struct VestingDetails {
        bool isVestingEnable;
        uint256 TGEPercent;
        uint256 cyclePercent;
        uint256 cycleInterval;
    }

    enum Mode {
        PUBLIC,
        WHITELIST,
        ANTI_BOT
    }

    event DutchAuctionCreated(
        uint256 id,
        AuctionDetails info,
        VestingDetails,
        LiquidityDetails liq,
        address dutchAuction
    );

    constructor(address _initBlueprint) {
        beacon = new GempadDutchAuctionBeacon(_initBlueprint, _msgSender());
    }

    function getAllDutchAuctions() external view returns (address[] memory) {
        return dutchAuctions;
    }

    function getUserDutchAuctions(address _user) external view returns (address[] memory) {
        return userDutchAuctions[_user];
    }

    /**
     * @notice   initailze core params of auction
     * @param   info  .
     * @param   _liquidity  add liquidaty terms
     * @param   _vesting  claim funds terms
     * @param   _fundToken  .
     * @param   _isPrivateMode  .
     * @param   _refundType  burn token balance or refund (0 refund and 1 burn)
     * @param   _feeReceiver  .
     */
    function createDutchAuction(
        AuctionDetails memory info,
        LiquidityDetails memory _liquidity,
        VestingDetails memory _vesting,
        address _fundToken,
        bool _isPrivateMode,
        bool _refundType,
        address payable _feeReceiver
    ) public payable {
        // Create a new GempadPrivateSale contract using the beacon
        uint256 _id = ++IdCounter;
        BeaconProxy dutchAuction = new BeaconProxy{ value: msg.value }(
            address(beacon),
            abi.encodeWithSelector(
                GempadDutchAuction(payable(address(0))).__GempadDutchAuction_init.selector,
                _id,
                info,
                _liquidity,
                _vesting,
                _fundToken,
                _isPrivateMode,
                _refundType,
                _feeReceiver,
                _msgSender()
            )
        );

        dutchAuctions.push(address(dutchAuction));
        userDutchAuctions[msg.sender].push(address(dutchAuction));

        uint256 tokenFee = IPayable(_feeReceiver).getFee('GempadDutchAuction');
        uint256 tokensAmount = TokenToReceive(info, _liquidity, tokenFee, _fundToken);

        uint256 before = info.token.balanceOf(address(dutchAuction));

        info.token.transferFrom(msg.sender, address(dutchAuction), tokensAmount);

        require(
            info.token.balanceOf(address(dutchAuction)) == (before + tokensAmount),
            'Insufficient token received'
        );

        emit DutchAuctionCreated(_id, info, _vesting, _liquidity, address(dutchAuction));
    }

    function TokenToReceive(
        AuctionDetails memory info,
        LiquidityDetails memory _liquidity,
        uint256 _tokenFee,
        address _fundToken
    ) private returns (uint256 tokens) {
        uint8 decimals = (_fundToken == address(0)) ? 18 : IERC20Extented(_fundToken).decimals();

        uint256 endPrice = (info.totalSaleAmount * (10 ** decimals)) / info.softCap;
        uint256 fee = (info.hardCap * _tokenFee) / 100e3;
        uint256 lToken = ((info.hardCap - fee) * endPrice) / 10 ** decimals;

        tokens = info.totalSaleAmount + (lToken * _liquidity.liquidityPercent) / 100e3;
    }

    function getDutchAuction() public view returns (address) {
        return address(beacon);
    }

    function getImplementation() public view returns (address) {
        return beacon.implementation();
    }
}
