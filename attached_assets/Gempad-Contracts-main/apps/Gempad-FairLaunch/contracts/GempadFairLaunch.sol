// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;

import { ServicePayer, IPayable } from '@gempad/services/contracts/ServicePayer.sol';
import '@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import './interfaces/IERC20Extented.sol';
import './interfaces/IUniswapV2Factory.sol';
import './interfaces/IUniswapV2Pair.sol';
import './interfaces/IUniswapV2Router02.sol';
import './interfaces/IGempadVestingLock.sol';
import './GempadWhitelist.sol';
import 'hardhat/console.sol';

contract GempadFairLaunch is ServicePayer, GempadWhitelist, ReentrancyGuardUpgradeable {
    using SafeMath for uint256;
    bool public isInitialized;
    uint256 public Id;

    FairLaunchDetails public fairlaunch;
    LiquidityDetails public liquidity;
    BuybackDetails public buyBack;
    Status public currentStatus;
    IERC20Extented public fundToken;
    bool public fundByTokens;

    bool private isPrivateMode;

    address private feeReceiver;
    uint256 private tokenFee;

    uint256 public totalRaised;
    uint256 public totalClaimed;
    uint256 private totalReferralInvest;
    uint256 private tokenToReceive;
    uint256 private totalReward = 0;

    uint256 public currentPrice;

    address[] private investors;
    address[] private referrers;

    mapping(address => UserDetails) public userInfo;
    mapping(address => RewardDetails) public rewardInfo;

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

    struct UserDetails {
        uint256 userInvest;
        uint256 userCalimed;
    }
    struct RewardDetails {
        uint256 referralInvest;
        uint256 rewardShare;
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

    event Purachsed(uint256 id, address sender, uint256 _amount);
    event PublicSaleEnabled(uint256 id, uint256 time);
    event liquidityAdded(uint256 id, address pair, uint256 liquidity);
    event UpdateReward(uint256 id, uint256 reward, address sender);
    event UpdateTime(uint256 id, uint256 start, uint256 end);
    event UpdateEndTime(uint256 id, uint256 timeNow, uint256 end);
    event RewardsCalimed(uint256 id, address receiver, uint256 share);

    /**
     * @notice  initialzie the core params of fairluanch
     * @param   _id  .
     * @param   info  .
     * @param   _liquidity  adding liquidity terms
     * @param   _buyBack   buyback terms
     * @param   _fundToken  currency for purchase
     * @param   _isPrivateMode  mode of sale public or private
     * @param   _feeReceiver  protocol fee receiver
     * @param   _owner  .
     */
    function __GempadFairLaunch_init(
        uint256 _id,
        FairLaunchDetails memory info,
        LiquidityDetails memory _liquidity,
        BuybackDetails memory _buyBack,
        address _fundToken,
        bool _isPrivateMode,
        address payable _feeReceiver,
        address _owner
    ) public payable initializer {
        require(!isInitialized, 'Err: Already initialized');
        ServicePayer.__ServicePayer_init(_feeReceiver, 'GempadFairLaunch');

        Id = _id;
        //set custom Investment Token
        fundByTokens = _fundToken != address(0);
        if (fundByTokens) {
            fundToken = IERC20Extented(_fundToken);
        }

        if (info.isAffiliate) require(info.affiliateReward <= 5e3, 'MAX reward limit exceeded');

        require(info.startTime > block.timestamp && info.startTime < info.endTime, 'Invalid start time');
        require((info.endTime - info.startTime) <= 604800, 'Invalid duration');

        if (_buyBack.isBuyback) {
            require(
                _liquidity.liquidityPercent >= 30e3 && _liquidity.liquidityPercent <= 100e3,
                'Invalid liquidity percentage'
            );
            require(
                _liquidity.liquidityPercent + _buyBack.buyBackPercent > 50e3 &&
                    _liquidity.liquidityPercent + _buyBack.buyBackPercent <= 100e3,
                'Liquidity + Buyback must be greater than 50% and equal to 100%'
            );

            require(_buyBack.minDelay >= 60, 'Minimum delay is atleast 1 minute');

            require(_buyBack.maxDelay <= 300, 'Maximum delay restiricted to 5 minutes');

            _buyBack.totalBuyBackAmount = (info.softCap * _buyBack.buyBackPercent) / 100e3;

            buyBack = _buyBack;
        } else {
            require(
                _liquidity.liquidityPercent > 50e3 && _liquidity.liquidityPercent <= 100e3,
                'Invalid liquidity percentage'
            );
        }

        require(_liquidity.lockTime >= 300, "Lock time can't be less than 5 minuts");

        liquidity = _liquidity;

        fairlaunch = info;

        // Initialize the public sale start time;
        fairlaunch.publicSaleTime = (_isPrivateMode) ? info.endTime : info.startTime;

        //whitelisting feature status
        isPrivateMode = _isPrivateMode;

        // Initialize fee and refund type
        feeReceiver = _feeReceiver;
        tokenFee = IPayable(feeReceiver).getFee('GempadFairLaunch');

        uint256 fee = (info.totalsellTokens * tokenFee) / 100e3;
        tokenToReceive =
            info.totalsellTokens +
            (((info.totalsellTokens - fee) * _liquidity.liquidityPercent) / 100e3);

        _transferOwnership(_owner);
        isInitialized = true;
    }

    /**
     * @notice  for user to buy Tokens
     * @param   _amount  in terms of buying currency
     * @param   _referrer  address of referrer for this sale
     */
    function buyToken(uint256 _amount, address _referrer) external payable nonReentrant {
        UserDetails storage user = userInfo[msg.sender];

        require(
            block.timestamp >= fairlaunch.startTime && block.timestamp <= fairlaunch.endTime,
            'Sale is not active'
        );

        if (block.timestamp < fairlaunch.publicSaleTime) {
            require(_whitelist[msg.sender], 'User is not whitelisted');
        }

        if (fairlaunch.isMaxLimit) {
            require(user.userInvest + _amount <= fairlaunch.maxBuyLimit, 'Maximum buy limit reached');
        }

        if (user.userInvest <= 0) investors.push(msg.sender);
        user.userInvest += _amount;

        // Update the total sale amount
        totalRaised += _amount;

        currentPrice = fundByTokens
            ? (fairlaunch.totalsellTokens * (10 ** fundToken.decimals())) / totalRaised
            : (fairlaunch.totalsellTokens * 1e18) / totalRaised;

        if (fairlaunch.isAffiliate) {
            if (_referrer != address(0)) {
                RewardDetails storage reward = rewardInfo[_referrer];
                if (reward.referralInvest <= 0) referrers.push(_referrer);

                totalReferralInvest += _amount;
                reward.referralInvest += _amount;
            }
        }

        if (fundByTokens) {
            fundToken.transferFrom(msg.sender, address(this), _amount);
        } else {
            // Ensure that the sender has sent enough Ether
            require(msg.value == _amount, 'Insufficient funds sent');
        }
        emit Purachsed(Id, msg.sender, _amount);
    }

    /**
     * @notice  set public sale activation time.
     * @dev     set public sale start time equal to sale end time if you want to activate private mode
     * @param   _startTime  .
     */
    function enablePublicSale(uint256 _startTime) external onlyOwner {
        // require(_startTime >= block.timestamp, 'Start time must be greater than current time');
        fairlaunch.publicSaleTime = _startTime;

        emit PublicSaleEnabled(Id, fairlaunch.publicSaleTime);
    }

    /**
     * @notice  cancel the sale and update status
     */
    function cancel() external onlyOwner {
        require(currentStatus != Status.CANCELLED, 'Sale already cancelled');
        require(currentStatus != Status.CLOSED, 'Sale cannot be cancelled after finalize');

        currentStatus = Status.CANCELLED;
    }

    /**
     * @notice  finalize the sale an dtransfer funds to owner.
     */
    function finalize() external onlyOwner {
        require(
            (block.timestamp > fairlaunch.endTime && totalRaised >= fairlaunch.softCap) ||
                totalRaised >= fairlaunch.softCap,
            'Sale End Time or cap not reached'
        );
        require(currentStatus != Status.CLOSED, 'Sale already finalized');

        currentStatus = Status.CLOSED;
        fairlaunch.finalizeTime = block.timestamp;

        uint256 feeAmount = (totalRaised * tokenFee) / 100e3;

        if (fairlaunch.isAffiliate && totalReferralInvest > 0) {
            totalReward = ((totalRaised - feeAmount) * fairlaunch.affiliateReward) / 100e3;
            distributeRewards();
        }

        if (buyBack.isBuyback) {
            buyBack.totalBuyBackAmount =
                ((totalRaised - (feeAmount + totalReward)) * buyBack.buyBackPercent) /
                100e3;
        }

        addLiquidity();

        withdrawFunds();

        // transfer token fee;
        _transferFunds(feeReceiver, feeAmount);
    }

    /**
     * @notice  transfer raised funds to owner account
     */
    function withdrawFunds() internal onlyOwner {
        uint256 fee = (totalRaised * tokenFee) / 100e3;

        uint256 withdrawable = totalRaised - (fee + totalReward + liquidity.liquidityAdded);

        if (buyBack.isBuyback) {
            withdrawable = withdrawable - buyBack.totalBuyBackAmount;
        }

        _transferFunds(msg.sender, withdrawable);
    }

    /**
     * @notice  distribute total referral reward among referrers as per their contribution
     */
    function distributeRewards() internal {
        uint256 length = referrers.length;

        if (length > 0) {
            for (uint256 i = 0; i < length; i++) {
                RewardDetails storage reward = rewardInfo[referrers[i]];

                uint256 share = (totalReward * reward.referralInvest) / totalReferralInvest;

                reward.rewardShare = share;
            }
        }
    }

    /**
     * @notice  called by the referrers to claim referral reward.
     */
    function claimReward() external {
        RewardDetails storage reward = rewardInfo[msg.sender];

        require(currentStatus == Status.CLOSED, 'Sale is not closed');
        require(reward.rewardShare > 0, 'User is not referrer');

        uint256 share = reward.rewardShare;
        reward.rewardShare = 0;

        _transferFunds(msg.sender, share);

        emit RewardsCalimed(Id, msg.sender, share);
    }

    /**
     * @notice  called by the investros to claim tokens againt their investment
     */
    function claimTokens() external nonReentrant {
        UserDetails storage user = userInfo[msg.sender];
        uint256 userShare = getUserTokens(msg.sender);

        require(currentStatus != Status.CANCELLED, 'Sale in cancelled');
        require(currentStatus == Status.CLOSED, 'Sale is not finalized');

        require((user.userCalimed + userShare) <= userShare, 'All tokens claimed');

        user.userCalimed = userShare;

        totalClaimed += userShare;

        fairlaunch.token.transfer(msg.sender, userShare);
    }

    /**
     * @notice  called by investor to withdraw funds if sale fails to reach softcap or cancelled by owner.
     */
    function claimUserRefund() external {
        UserDetails storage info = userInfo[msg.sender];
        require(
            (block.timestamp >= fairlaunch.endTime && totalRaised < fairlaunch.softCap) ||
                currentStatus == Status.CANCELLED,
            'Refund is not allowed'
        );
        require(info.userInvest > 0, 'User has not invested');

        uint256 refund = info.userInvest;
        info.userInvest = 0;
        _transferFunds(msg.sender, refund);
    }

    /**
     * @notice  anyone call this function to buyback tokens from dex and burn them
     */
    function buyBackTokens() public {
        require(currentStatus == Status.CLOSED, 'Sale has not ended');
        require(block.timestamp - fairlaunch.finalizeTime >= buyBack.maxDelay, 'Buyback not initailzed');
        require(block.timestamp - buyBack.lastBuyTime >= buyBack.minDelay, 'Buyback delay not reached');
        require(buyBack.boughtBackAmount < buyBack.totalBuyBackAmount, 'Insuffcient funds');

        address[] memory path = getPathForTokens();

        // swap eth to token
        uint256[] memory data;

        uint256 buyAmount = buyBack.amountPerBuyback;

        buyAmount = ((buyBack.totalBuyBackAmount - buyBack.boughtBackAmount) < buyBack.amountPerBuyback)
            ? (buyBack.totalBuyBackAmount - buyBack.boughtBackAmount)
            : buyBack.amountPerBuyback;

        buyBack.boughtBackAmount += buyAmount;
        buyBack.lastBuyTime = block.timestamp;

        if (fundByTokens) {
            fundToken.approve(address(liquidity.router), buyAmount);

            data = liquidity.router.swapExactTokensForTokens(
                buyAmount,
                0,
                path,
                address(this),
                block.timestamp + 1800
            );
        } else {
            data = liquidity.router.swapExactETHForTokens{ value: buyAmount }(
                0,
                path,
                address(this),
                block.timestamp + 1800
            );
        }

        // burn token
        fairlaunch.token.transfer(address(0x000000000000000000000000000000000000dEaD), data[1]);
    }

    /**
     * @notice  set affliation percentage in bips(3)
     * @param   _reward  percentage in bips
     */
    function setAffiliation(uint256 _reward) external onlyOwner {
        require(_reward <= 5e3, "Reward can't be greater than 5%");
        require(currentStatus != Status.CANCELLED, 'Sale is cancelled');
        require(currentStatus != Status.CLOSED, 'Sale is not active');
        fairlaunch.affiliateReward = _reward;

        emit UpdateReward(Id, _reward, msg.sender);
    }

    /**
     * @notice  update start and end time before sale start
     * @param   _startTime  .
     * @param   _endTime  .
     */
    function setTime(uint256 _startTime, uint256 _endTime) external onlyOwner {
        require(block.timestamp < fairlaunch.startTime, 'Sale already started');
        require(_startTime > block.timestamp && _startTime < _endTime, 'Invalid start time');

        fairlaunch.startTime = _startTime;
        fairlaunch.endTime = _endTime;

        emit UpdateTime(Id, _startTime, _endTime);
    }

    /**
     * @notice  let owner update end time even after sale start
     * @param   _endTime  .
     */
    function setEndTime(uint256 _endTime) external onlyOwner {
        require(currentStatus != Status.CANCELLED, 'Sale is cancelled');
        require(currentStatus != Status.CLOSED, 'Sale is closed');
        require(_endTime > fairlaunch.startTime, 'Invalid end time');

        fairlaunch.endTime = _endTime;

        emit UpdateEndTime(Id, block.timestamp, _endTime);
    }

    /**
     * @return  mode  of the current sale  (public or private)
     */
    function getCurrentMode() public view returns (Mode mode) {
        mode = (block.timestamp < fairlaunch.startTime)
            ? Mode.PENDING //pending
            : (block.timestamp >= fairlaunch.startTime && block.timestamp < fairlaunch.publicSaleTime)
            ? Mode.PRIVATE //private
            : Mode.PUBLIC; //public
    }

    /**
     * @return  status  of the current sale
     */
    function getCurrentSatus() public view returns (Status status) {
        status = (block.timestamp < fairlaunch.startTime && currentStatus != Status.CANCELLED)
            ? Status.INCOMMING
            : (currentStatus != Status.CANCELLED &&
                currentStatus != Status.CLOSED &&
                block.timestamp > fairlaunch.startTime)
            ? Status.ACTIVE
            : currentStatus;
    }

    /**
     * @param   _user  address of usr
     * @return  tokens  amount of user tokens
     */
    function getUserTokens(address _user) public returns (uint256 tokens) {
        require(currentStatus == Status.CLOSED, 'Token will be allocated after finalize sale');

        UserDetails memory user = userInfo[_user];

        tokens = fundByTokens
            ? (user.userInvest * currentPrice) / (10 ** fundToken.decimals())
            : (user.userInvest * currentPrice) / 1e18;
    }

    /**
     * @return  address[]  returns array of referrers
     */
    function getAllReferrers() public view returns (address[] memory) {
        return referrers;
    }

    /**
     * @return  address[]  return array of investors
     */
    function getAllInvestors() public view returns (address[] memory) {
        return investors;
    }

    /**
     * @notice  In every sale specific amount is allocated or buy back purpose
     * @return  uint256  it returns the remaing amunt to buy back out of total
     */
    function remainingBuybackAmount() public view returns (uint256) {
        return buyBack.totalBuyBackAmount - buyBack.boughtBackAmount;
    }

    /**
     * @notice sell tokens and purchase currency pair
     * @return  pairAddress  .
     */
    function getTokenPair() internal view returns (address pairAddress) {
        if (fundByTokens) {
            pairAddress = IUniswapV2Factory(liquidity.router.factory()).getPair(
                address(fundToken),
                address(fairlaunch.token)
            );
        } else {
            pairAddress = IUniswapV2Factory(liquidity.router.factory()).getPair(
                liquidity.router.WETH(),
                address(fairlaunch.token)
            );
        }
    }

    /**
     * @notice  return sell tokens and purchase currency share to add liquidity
     * @return  share  purchase currency
     * @return  tokens  sell token
     */
    function getTokenShare() internal view returns (uint256 share, uint256 tokens) {
        uint256 fee = (totalRaised * tokenFee) / 100e3;

        uint256 funds = totalRaised - (fee + totalReward);

        share = (funds * liquidity.liquidityPercent) / 100e3;

        tokens = tokenToReceive - fairlaunch.totalsellTokens;
    }

    /**
     * @notice  adds the liquidity of sell token and purchase currency pair and locks the received LP tokens
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

            fairlaunch.token.approve(address(liquidity.router), sellTokenShare);

            if (!fundByTokens) {
                // Create a DEX pair for this token
                (amountToken, amountETH, _liquidity) = liquidity.router.addLiquidityETH{
                    value: fundTokenShare
                }(
                    address(fairlaunch.token),
                    sellTokenShare,
                    0, // slippage is unavoidable
                    0, // slippage is unavoidable
                    address(this),
                    block.timestamp
                );
            } else {
                fundToken.approve(address(liquidity.router), fundTokenShare);
                // Create a DEX pair for this token
                (amountToken, amountETH, _liquidity) = liquidity.router.addLiquidity(
                    address(fairlaunch.token),
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

            pair.approve(liquidity.locker, pairBalance);

            IGempadVestingLock(liquidity.locker).lock(
                owner(),
                pairAddress,
                true,
                pairBalance,
                (block.timestamp + liquidity.lockTime),
                'Gempad-FairLaunch'
            );

            return (amountToken, amountETH, _liquidity);
        }

        return (0, 0, 0);
    }

    /**
     * @notice  transfer funds
     * @dev     .
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

     * @return  address[]  .returns path for liquidity tokens
     */
    function getPathForTokens() internal view returns (address[] memory) {
        address[] memory path = new address[](2);

        path[0] = (fundByTokens) ? address(fundToken) : liquidity.router.WETH();

        path[1] = address(fairlaunch.token);

        return path;
    }
}
