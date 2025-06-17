// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;

import { ServicePayer, IPayable } from '@gempad/services/contracts/ServicePayer.sol';
import '@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import '@openzeppelin/contracts/utils/math/Math.sol';
import './interfaces/IERC20Extented.sol';
import './interfaces/IUniswapV2Factory.sol';
import './interfaces/IUniswapV2Pair.sol';
import './interfaces/IUniswapV2Router02.sol';
import './interfaces/IGempadVestingLock.sol';
import './AuctionWhitelist.sol';
import 'hardhat/console.sol';

contract GempadDutchAuction is ServicePayer, AuctionWhitelist, ReentrancyGuardUpgradeable {
    using SafeMath for uint256;
    bool public isInitialized = false;
    uint256 public Id;

    AuctionDetails public auction;
    LiquidityDetails public liquidity;
    VestingDetails public vesting;
    Status public currentStatus;

    IERC20Extented public fundToken;
    bool public fundByTokens;

    bool private refundType; //0 refund and 1 burn

    bool private isPrivateMode;

    address private feeReceiver;
    uint256 public tokenFee;

    uint8 private decimals;

    uint256 public totalRaised;
    uint256 public totalClaimed;
    uint256 public totalTokensSold;
    uint256 private tokenToReceive;

    address[] public investors;

    mapping(address => UserDetails) public userInfo;

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

    struct UserDetails {
        uint256 userTokens;
        uint256 userInvest;
        uint256 userCalimed;
        uint256 lastClaimTime;
    }

    enum Status {
        INCOMMING,
        ACTIVE,
        CANCELLED,
        CLOSED
    }

    enum Mode {
        PENDING,
        PRIVATE,
        PUBLIC
    }

    event Purachsed(uint256 id, address sender, uint256 _amount, uint256 amount);
    event PublicSaleEnabled(uint256 id, uint256 time);
    event liquidityAdded(uint256 id, address pair, uint256 liquidity);
    event Cancelled(uint256 id, Status status, uint256 time);

    /**
     * @notice   initailze core params of auction
     * @param   _id  .
     * @param   info  .
     * @param   _liquidity  add liquidaty terms
     * @param   _vesting  claim funds terms
     * @param   _fundToken  .
     * @param   _isPrivateMode  .
     * @param   _refundType  burn token balance or refund (0 refund and 1 burn)
     * @param   _feeReceiver  .
     * @param   _owner  .
     */
    function __GempadDutchAuction_init(
        uint256 _id,
        AuctionDetails memory info,
        LiquidityDetails memory _liquidity,
        VestingDetails memory _vesting,
        address _fundToken,
        bool _isPrivateMode,
        bool _refundType,
        address payable _feeReceiver,
        address _owner
    ) public payable initializer {
        require(!isInitialized, 'Err: Already initialized');
        ServicePayer.__ServicePayer_init(_feeReceiver, 'GempadDutchAuction');
        //set custom Investment Token
        Id = _id;
        fundByTokens = _fundToken != address(0);
        if (fundByTokens) {
            fundToken = IERC20Extented(_fundToken);
        }
        require(info.totalSaleAmount > 0, "Total selling amount can't be zero");

        decimals = (!fundByTokens) ? 18 : IERC20Extented(_fundToken).decimals();

        require(
            info.startPrice > 0 && info.endPrice < info.startPrice,
            'End price must be less than start price'
        );

        require(info.softCap <= info.hardCap, 'Soft-Cap should be less than or equal to hardcap');

        require(
            info.softCap >= ((info.hardCap * 20e3) / 100e3),
            'Softcap must be greater than or equal 20% of Hardcap'
        );

        uint256 endPrice = (info.totalSaleAmount * (10 ** decimals)) / info.softCap;
        uint256 startPrice = (info.totalSaleAmount * (10 ** decimals)) / info.hardCap;

        require(
            ((info.softCap * endPrice) / 10 ** decimals) == info.totalSaleAmount,
            'SoftCap * endPrice = TotalSaleAmount'
        );

        require(
            ((info.hardCap * startPrice) / 10 ** decimals) == info.totalSaleAmount,
            'hardCap * startPrice = TotalSaleAmount'
        );

        require(info.minBuyLimit > 0 && info.minBuyLimit < info.maxBuyLimit, 'Invalid minimum buy limit');

        require(info.startTime > block.timestamp && info.startTime < info.endTime, 'Invalid start time');

        require(
            (info.endTime - info.startTime) > info.decreaseInterval,
            'Auction duration must be greater than decrease price interval'
        );

        require(info.decreaseInterval > 0, "Price decrease interval can't be zero");

        require(_liquidity.liquidityPercent > 50e3, 'Liquidity percentage must be greater than 50');
        require(_liquidity.lockTime >= 300, "Lock time can't be less than 5 minuts");

        if (_vesting.isVestingEnable) {
            require(
                _vesting.TGEPercent > 0 && _vesting.TGEPercent < 100e3,
                'Invalid Initial Release pecentage'
            );

            require(_vesting.cyclePercent > 0, 'Cycle pecentage must be greater than zero');

            require(_vesting.cycleInterval > 0, 'interval must be greater than zero');

            require(
                (_vesting.TGEPercent + _vesting.cyclePercent) <= 100e3,
                'Sum of TGE and cycle should be less than 100'
            );

            vesting = _vesting;
            isInitialized = true;
        }

        //whitelisting feature status
        isPrivateMode = _isPrivateMode;

        auction = info;
        liquidity = _liquidity;

        // Initialize the public sale start time;
        info.publicSaleTime = (!_isPrivateMode) ? info.startTime : info.endTime;

        // Initialize fee and refund type
        feeReceiver = _feeReceiver;
        tokenFee = IPayable(feeReceiver).getFee('GempadDutchAuction');
        refundType = _refundType;

        _transferOwnership(_owner);
    }

    /**
     * @notice  user buy Tokens
     * @param   _amount  in purchase currency
     */
    function buyToken(uint256 _amount) external payable nonReentrant {
        UserDetails storage user = userInfo[msg.sender];
        require(
            block.timestamp >= auction.startTime && block.timestamp <= auction.endTime,
            'Sale is not active'
        );

        if (block.timestamp < auction.publicSaleTime) {
            require(_whitelist[msg.sender], 'User is not whitelisted');
        }
        require(_amount >= auction.minBuyLimit, 'Amount is less than min buy limit');

        require(user.userInvest + _amount <= auction.maxBuyLimit, 'Maximum buy limit reached');

        require((totalRaised + _amount) <= auction.hardCap, 'HardCap reached');

        uint256 currentPrice = calculateCurrentPrice();

        uint256 tokenAmount = ((_amount * currentPrice) / (10 ** decimals));

        if (user.userTokens <= 0) investors.push(msg.sender);
        user.userTokens += tokenAmount;
        user.userInvest += _amount;

        // Update the total sale amount
        totalRaised += _amount;
        totalTokensSold += tokenAmount;

        if (fundByTokens) {
            fundToken.transferFrom(msg.sender, address(this), _amount);
        } else {
            // Ensure that the sender has sent enough Ether
            require(msg.value == _amount, 'Insufficient funds sent');
        }
        emit Purachsed(Id, msg.sender, tokenAmount, _amount);
    }

    /**
     * @notice  enable public or private sale time.
     * @param   _startTime   start time of public sale time if it is equalo to sale end time that means its priavte sale.
     */
    function enablePublicSale(uint256 _startTime) external onlyOwner {
        // require(_startTime >= block.timestamp, 'Start time must be greater than current time');
        auction.publicSaleTime = _startTime;

        emit PublicSaleEnabled(Id, auction.publicSaleTime);
    }

    /**
     * @notice  finalize the sale and withdraw sell funds and sell token balance
     */
    function finalize() external onlyOwner nonReentrant {
        require(
            (block.timestamp >= auction.endTime && totalRaised >= auction.softCap) ||
                totalRaised >= auction.softCap,
            'Sale End Time or cap not reached'
        );
        require(currentStatus != Status.CLOSED, 'Sale already finalized');

        currentStatus = Status.CLOSED;
        auction.finalizeTime = block.timestamp;

        uint256 feeAmount = (totalRaised * tokenFee) / 100e3;

        addLiquidity();
        _transferFunds(feeReceiver, feeAmount);
        withdrawFunds();
        withdrawTokenBalance();
    }

    /**
     * @notice  cancel the sale
     */
    function cancel() external onlyOwner {
        require(currentStatus != Status.CANCELLED, 'Sale already cancelled');
        require(currentStatus != Status.CLOSED, 'Sale cannot be cancelled after finalize');

        currentStatus = Status.CANCELLED;

        emit Cancelled(Id, currentStatus, block.timestamp);
    }

    /**
     * @notice  called by the investor the claim the tokens against investment as per vesting terms
     */
    function claimTokens() external nonReentrant {
        UserDetails storage user = userInfo[msg.sender];

        require(currentStatus != Status.CANCELLED, 'Sale in cancelled');
        require(currentStatus == Status.CLOSED, 'Sale is not finalized');

        uint256 claimableAmount = _calculateClaimableTokens(msg.sender);
        uint256 claimable = user.userCalimed + claimableAmount;

        require(claimableAmount > 0 && claimable <= user.userTokens, 'Total tokens claimed');

        user.userCalimed += claimableAmount;

        user.lastClaimTime = block.timestamp;
        totalClaimed += claimableAmount;

        auction.token.transfer(msg.sender, claimableAmount);
    }

    /**
     * @notice  called by investor to get refund incase of sale cancellation or failure to reach soft cap
     */
    function claimUserRefund() external {
        UserDetails storage info = userInfo[msg.sender];
        require(
            (block.timestamp >= auction.endTime && totalRaised < auction.softCap) ||
                currentStatus == Status.CANCELLED,
            'Refund is not allowed'
        );
        require(info.userInvest > 0, 'User has not invested');

        uint256 refund = info.userInvest;
        info.userInvest = 0;

        _transferFunds(msg.sender, refund);
    }

    /**
     * @notice  withdraw the funds raised
     */
    function withdrawFunds() internal {
        require(currentStatus == Status.CLOSED, 'Sale in not finalized');

        if (fundByTokens) {
            uint256 amount = fundToken.balanceOf(address(this));

            fundToken.transfer(msg.sender, amount);
        } else {
            payable(msg.sender).transfer(address(this).balance);
        }
    }

    /**
     * @notice  transfer the unsold tokens to owner
     */
    function withdrawTokenBalance() internal {
        uint256 balance = auction.token.balanceOf(address(this)).sub(totalTokensSold);

        if (refundType) {
            auction.token.transfer(msg.sender, balance);
        } else {
            auction.token.transfer(address(0x000000000000000000000000000000000000dEaD), balance);
        }
    }

    function withdrawTokens() external nonReentrant onlyOwner {
        require(
            (block.timestamp >= auction.endTime && totalRaised < auction.softCap) ||
                currentStatus == Status.CANCELLED,
            'Sale is not cancelled or end Time not reached'
        );

        uint256 balance = auction.token.balanceOf(address(this));

        auction.token.transfer(msg.sender, balance);
    }

    /**
     * @notice  called by owner to get refund incase of sale cancellation or failure to reach soft cap
     */
    function getCurrentMode() public view returns (Mode mode) {
        mode = (block.timestamp < auction.startTime)
            ? Mode.PENDING //pending
            : (block.timestamp >= auction.startTime && block.timestamp < auction.publicSaleTime)
            ? Mode.PRIVATE //private
            : Mode.PUBLIC; //public
    }

    /**
     * @return  status  current selling status
     */
    function getCurrentSatus() public view returns (Status status) {
        status = (block.timestamp < auction.startTime && currentStatus != Status.CANCELLED)
            ? Status.INCOMMING
            : (currentStatus != Status.CANCELLED &&
                currentStatus != Status.CLOSED &&
                block.timestamp > auction.startTime)
            ? Status.ACTIVE
            : currentStatus;
    }

    /**
     * @return  pairAddress  returnd the pair address to add liquidity.
     */
    function getTokenPair() internal view returns (address pairAddress) {
        if (fundByTokens) {
            pairAddress = IUniswapV2Factory(liquidity.router.factory()).getPair(
                address(fundToken),
                address(auction.token)
            );
        } else {
            pairAddress = IUniswapV2Factory(liquidity.router.factory()).getPair(
                liquidity.router.WETH(),
                address(auction.token)
            );
        }
    }

    /**
     * @notice  to get share of sell tokens and purchase currency to create pair and add liquidity
     * @return  uint256  sell tokens share
     * @return  uint256  purchase currency share
     */
    function getTokenShare() internal view returns (uint256, uint256) {
        uint256 currentPrice = calculateCurrentPrice();

        uint256 fee = (totalRaised * tokenFee) / 100e3;

        uint256 shareEth = ((totalRaised - fee) * liquidity.liquidityPercent) / 100e3;

        uint256 tokens = ((shareEth * currentPrice)) / (10 ** decimals);
        return (shareEth, tokens);
    }

    /**
     * @notice  add liquidity to given dex as per liquidity terms and also lock the LP tokens
     * @return  uint256  .
     * @return  uint256  .
     * @return  uint256  .
     */
    function addLiquidity() internal returns (uint256, uint256, uint256) {
        if (totalRaised > 0) {
            uint256 amountToken;
            uint256 amountETH;
            uint256 _liquidity;

            (uint256 fundTokenShare, uint256 sellTokenShare) = getTokenShare();

            auction.token.approve(address(liquidity.router), sellTokenShare);

            if (!fundByTokens) {
                // Create a DEX pair for this token
                (amountToken, amountETH, _liquidity) = liquidity.router.addLiquidityETH{
                    value: fundTokenShare
                }(
                    address(auction.token),
                    sellTokenShare,
                    0, // slippage is unavoidable
                    0, // slippage is unavoidable
                    address(this),
                    block.timestamp
                );
            } else {
                fundToken.approve(address(liquidity.router), sellTokenShare);
                fundToken.approve(address(liquidity.router), fundTokenShare);
                // Create a DEX pair for this token
                (amountToken, amountETH, _liquidity) = liquidity.router.addLiquidity(
                    address(auction.token),
                    address(fundToken),
                    sellTokenShare,
                    fundTokenShare,
                    0, // slippage is unavoidable
                    0, // slippage is unavoidable
                    address(this),
                    block.timestamp
                );
            }
            liquidity.liquidityAdded = fundTokenShare;
            address pairAddress = getTokenPair();
            IUniswapV2Pair pair = IUniswapV2Pair(pairAddress);
            uint256 pairBalance = pair.balanceOf(address(this));

            IERC20Extented(pairAddress).approve(liquidity.locker, pairBalance);

            IGempadVestingLock(liquidity.locker).lock(
                owner(),
                pairAddress,
                true,
                pairBalance,
                (block.timestamp + liquidity.lockTime),
                'Gempad liquidity'
            );

            emit liquidityAdded(Id, pairAddress, _liquidity);
            return (amountToken, amountETH, _liquidity);
        }

        return (0, 0, 0);
    }

    /**
     * @param   _user  .
     * @return  withdrawable  the amount of tokens investor can withdraw as per vesting terms
     */
    function _calculateClaimableTokens(address _user) internal view returns (uint256 withdrawable) {
        UserDetails memory user = userInfo[_user];

        if (vesting.isVestingEnable) {
            require(
                (block.timestamp - user.lastClaimTime) >= vesting.cycleInterval,
                'Tokens are not unlocked'
            );

            uint256 tgeReleaseAmount = (vesting.TGEPercent * user.userTokens) / 100e3;

            uint256 cycleReleaseAmount = Math.mulDiv(user.userTokens, vesting.cyclePercent, 100e3);

            uint256 currentTotal = 0;

            if (block.timestamp >= auction.finalizeTime) {
                currentTotal =
                    (((block.timestamp - auction.finalizeTime) / vesting.cycleInterval) *
                        cycleReleaseAmount) +
                    tgeReleaseAmount;
            }

            if (currentTotal > user.userTokens) {
                withdrawable = user.userTokens - user.userCalimed;
            } else {
                withdrawable = currentTotal - user.userCalimed;
            }
        } else {
            withdrawable = user.userTokens;
        }
    }

    /**
     * @notice  transfer purchase currency to receiver
     * @param   _to  .
     * @param   _amount  .
     */
    function _transferFunds(address _to, uint256 _amount) private {
        if (fundByTokens) {
            fundToken.transfer(_to, _amount);
        } else {
            payable(_to).transfer(_amount);
        }
    }

    /**
     * @notice  as price keep decreasing at the rate of auction terms
     * @return  uint256  the current priceof token based on time
     */
    function calculateCurrentPrice() internal view returns (uint256) {
        uint256 endPrice = (auction.totalSaleAmount * (10 ** decimals)) / auction.softCap;
        uint256 startPrice = (auction.totalSaleAmount * (10 ** decimals)) / auction.hardCap;

        uint256 totalIntervals = (auction.endTime - auction.startTime) / auction.decreaseInterval;

        uint256 reductionAmount = (endPrice - startPrice) / totalIntervals;

        uint256 intervalsElapsed = (block.timestamp - auction.startTime) / auction.decreaseInterval;

        if (intervalsElapsed > totalIntervals) {
            intervalsElapsed = totalIntervals;
        }

        if (intervalsElapsed <= 0) {
            return startPrice;
        } else {
            uint256 newPrice = startPrice + (reductionAmount * intervalsElapsed);
            return newPrice;
        }
    }
}
