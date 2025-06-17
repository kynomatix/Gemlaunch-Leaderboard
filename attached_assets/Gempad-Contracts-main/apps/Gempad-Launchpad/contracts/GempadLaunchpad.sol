// SPDX-License-Identifier: MIT
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
import './GempadWhitelist.sol';
import 'hardhat/console.sol';

contract GempadLaunchpad is ServicePayer, GempadWhitelist, ReentrancyGuardUpgradeable {
    using SafeMath for uint256;
    bool private isInitialized = false;
    uint256 public Id;

    LaunchpadDetails public launchpad;
    LiquidityDetails public liquidity;
    VestingDetails public vesting;
    Status public currentStatus;
    IERC20Extented public fundToken;

    bool public fundByTokens;

    bool private refundType; //true refund and false burn

    bool private isPrivateMode;

    bool public isAffiliate;
    uint256 public affiliateReward;

    address private feeReceiver;
    uint256 public tokenFee;

    uint8 private decimals;

    uint256 public totalRaised;
    uint256 public totalClaimed;
    uint256 public totalReferralInvest;
    uint256 public claimTime;

    address[] private investors;
    address[] private referrers;

    mapping(address => UserDetails) public userInfo;
    mapping(address => RewardDetails) public rewardInfo;

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

    struct UserDetails {
        uint256 userInvest;
        uint256 userCalimed;
        uint256 lastClaimTime;
        uint256 intervalClaimed;
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

    event Purachsed(uint256 Id, address sender, uint256 _amount, uint256 amount);
    event PublicSaleEnabled(uint256 Id, uint256 time);
    event liquidityAdded(uint256 Id, address pair, uint256 liquidity);
    event UpdateReward(uint256 Id, uint256 reward, address sender);
    event ClaimTimeUpdate(uint256 Id, uint256 time, address sender);
    event UpdateTime(uint256 Id, uint256 start, uint256 end);
    event Transfer(uint256 Id, address receiver, uint256 token);
    event RewardsCalimed(uint256 Id, address receiver, uint256 share);

    /**
     * @notice  initialize the core params of laucnhpad.
     * @dev     called by Factory
     * @param   _id  id of this laucnhpad.
     * @param   info  core params
     * @param   _liquidity  liquidity setting
     * @param   _vesting  token claim vesting
     * @param   _fundToken   purchase currency
     * @param   _isPrivateMode  public or private sale mode
     * @param   _isAffiliate   status of affiliate.
     * @param   _affiliateReward  reward percentage in bips
     * @param   _refundType  refund extra token ror burn (//true refund and false burn)
     * @param   _feeReceiver  protocol fee receiver
     * @param   _owner  owner of this launchpad.
     */
    function __GempadLaunchpad_init(
        uint256 _id,
        LaunchpadDetails memory info,
        LiquidityDetails memory _liquidity,
        VestingDetails memory _vesting,
        address _fundToken,
        bool _isPrivateMode,
        bool _isAffiliate,
        uint256 _affiliateReward,
        bool _refundType,
        address payable _feeReceiver,
        address _owner
    ) public payable initializer {
        require(!isInitialized, 'Err: Already initialized');
        ServicePayer.__ServicePayer_init(_feeReceiver, 'GempadLaunchpad');

        Id = _id;
        //set custom Investment Token
        fundByTokens = _fundToken != address(0);
        if (fundByTokens) {
            fundToken = IERC20Extented(_fundToken);
        }
        if (_isAffiliate) require(_affiliateReward <= 5e3, 'MAX reward limit exceeded');

        require(info.softCap <= info.hardCap, 'Soft-Cap should be less than or equal to hardcap');

        require(
            info.softCap >= ((info.hardCap * 25e3) / 100e3),
            'Softcap must be greater than or equal 25% of Hardcap'
        );

        require(
            info.minBuyLimit > 0 && info.minBuyLimit < info.maxBuyLimit,
            'Minimum-buy limit must be less than max-but limit'
        );

        require(info.startTime > block.timestamp && info.startTime < info.endTime, 'Invalid start time');

        if (_liquidity.isAutolisting) {
            require(
                _liquidity.liquidityPercent > 50e3 && _liquidity.liquidityPercent <= 100e3,
                'Invalid liquidity percentage'
            );
            require(_liquidity.lockTime >= 300, "Lock time can't be less than 5 minuts");

            liquidity = _liquidity;
        }
        if (_vesting.isVestingEnable) {
            require(
                _vesting.TGEPercent > 0 && _vesting.TGEPercent < 100e3,
                'Invalid Initial Release pecentage'
            );
            require(_vesting.cyclePercent > 0, 'Cycle pecentage must be greater than zero');
            require(_vesting.cycleInterval > 0, 'interval must be greater than zero');
            require(
                (_vesting.TGEPercent + _vesting.cyclePercent) <= 100e3,
                'Sum of TGE bps and cycle should be less than 100'
            );

            vesting = _vesting;
        }

        //whitelisting feature status
        isPrivateMode = _isPrivateMode;
        isAffiliate = _isAffiliate;
        affiliateReward = _affiliateReward;

        launchpad = info;

        decimals = (fundByTokens) ? IERC20Extented(_fundToken).decimals() : 18;

        // Initialize the public sale start time;
        launchpad.publicSaleTime = (_isPrivateMode) ? info.endTime : info.startTime;

        // Initialize fee and refund type
        feeReceiver = _feeReceiver;
        refundType = _refundType;
        tokenFee = IPayable(feeReceiver).getFee('GempadLaunchpad');

        _transferOwnership(_owner);
        isInitialized = true;
    }

    /**
     * @notice  user buy Tokens
     * @param   _amount  amount in purchase currency
     * @param   _referrer  address of referrer
     */
    function buyToken(uint256 _amount, address _referrer) external payable nonReentrant {
        UserDetails storage user = userInfo[msg.sender];
        require(
            block.timestamp >= launchpad.startTime && block.timestamp <= launchpad.endTime,
            'Sale is not active'
        );

        if (block.timestamp < launchpad.publicSaleTime) {
            require(_whitelist[msg.sender], 'User is not whitelisted');
        }

        require(_amount >= launchpad.minBuyLimit, 'Amount is less than min buy limit');
        require(user.userInvest + _amount <= launchpad.maxBuyLimit, 'Maximum buy limit reached');
        require((totalRaised + _amount) <= launchpad.hardCap, 'Maximum sale limit reached');

        uint256 tokenAmount = (_amount * launchpad.sellPrice) / 10 ** decimals;

        if (user.userInvest <= 0) investors.push(msg.sender);
        user.userInvest += _amount;

        // Update the total sale amount
        totalRaised += _amount;

        if (isAffiliate) {
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
        emit Purachsed(Id, msg.sender, tokenAmount, _amount);
    }

    /**
     * @notice  enable public or private sale time.
     * @param   _startTime   start time of public sale time if it is equalo to sale end time that means its priavte sale.
     */
    function enablePublicSale(uint256 _startTime) external onlyOwner {
        // require(_startTime >= block.timestamp, 'Start time must be greater than current time');
        launchpad.publicSaleTime = _startTime;

        emit PublicSaleEnabled(Id, launchpad.publicSaleTime);
    }

    /**
     * @notice  finalize the sale and withdraw sell funds and sell token balance
     */
    function finalize() external onlyOwner {
        require(
            (block.timestamp >= launchpad.endTime && totalRaised >= launchpad.softCap) ||
                totalRaised >= launchpad.softCap,
            'Sale End Time or cap not reached'
        );
        require(currentStatus != Status.CLOSED, 'Sale already finalized');

        currentStatus = Status.CLOSED;
        launchpad.finalizeTime = block.timestamp;

        if (claimTime < block.timestamp) claimTime = block.timestamp;
        uint256 feeAmount = (totalRaised * tokenFee) / 100e3;

        if (liquidity.isAutolisting) addLiquidity();
        if (isAffiliate && totalReferralInvest > 0) distributeRewards();

        _transferFunds(feeReceiver, feeAmount);

        withdrawFunds();

        withdrawTokenBalance();
    }

    /**
     * @notice  withdraw the funds raised
     */
    function withdrawFunds() internal nonReentrant {
        uint256 fee = (totalRaised * tokenFee) / 100e3;
        uint256 reward = ((totalRaised - fee) * affiliateReward) / 100e3;

        uint256 withdrawable = (isAffiliate && referrers.length > 0)
            ? (totalRaised - (fee + reward + liquidity.liquidityAdded))
            : (totalRaised - (fee + liquidity.liquidityAdded));

        _transferFunds(msg.sender, withdrawable);
    }

    /**
     * @notice  it distrbutes the total reward amount amond referrers.
     */
    function distributeRewards() internal {
        uint256 length = referrers.length;

        if (length > 0) {
            uint256 fee = (totalRaised * tokenFee) / 100e3;
            uint256 total = ((totalRaised - fee) * affiliateReward) / 100e3;

            for (uint256 i = 0; i < length; i++) {
                RewardDetails storage reward = rewardInfo[referrers[i]];

                uint256 share = (total * reward.referralInvest) / totalReferralInvest;
                reward.rewardShare = share;
            }
        }
    }

    /**
     * @notice  called referrer to claim their share of reward from total
     */
    function claimReward() external nonReentrant {
        RewardDetails storage reward = rewardInfo[msg.sender];

        require(currentStatus == Status.CLOSED, 'Sale is not closed');
        require(reward.rewardShare > 0, 'User is not referrer');

        uint256 share = reward.rewardShare;
        reward.rewardShare = 0;

        _transferFunds(msg.sender, share);

        emit RewardsCalimed(Id, msg.sender, share);
    }

    /**
     * @notice  cancel the sale
     */
    function cancel() external onlyOwner {
        require(currentStatus != Status.CANCELLED, 'Sale already cancelled');
        require(currentStatus != Status.CLOSED, 'Sale cannot be cancelled after finalize');

        currentStatus = Status.CANCELLED;
    }

    /**
     * @notice  called by the investor the claim the tokens against investment as per vesting terms
     */
    function claimTokens() external nonReentrant {
        UserDetails storage user = userInfo[msg.sender];
        uint256 userShare = getUserTokens(msg.sender);

        require(currentStatus != Status.CANCELLED, 'Sale in cancelled');
        require(currentStatus == Status.CLOSED, 'Sale is not finalized');
        require(block.timestamp > claimTime, 'Claim time not reached');

        uint256 claimableAmount = _calculateClaimableTokens(msg.sender);
        uint256 claimable = user.userCalimed + claimableAmount;

        require(claimableAmount > 0 && claimable <= userShare, 'Total tokens claimed');

        user.userCalimed += claimableAmount;

        user.lastClaimTime = block.timestamp;
        totalClaimed += claimableAmount;

        launchpad.token.transfer(msg.sender, claimableAmount);
    }

    /**
     * @notice  called by investor to get refund incase of sale cancellation or failure to reach soft cap
     */
    function claimUserRefund() external nonReentrant {
        UserDetails storage info = userInfo[msg.sender];
        require(
            (block.timestamp >= launchpad.endTime && totalRaised < launchpad.softCap) ||
                currentStatus == Status.CANCELLED,
            'Refund is not allowed'
        );
        require(info.userInvest > 0, 'User has not invested');

        uint256 refund = info.userInvest;
        info.userInvest = 0;
        _transferFunds(msg.sender, refund);
    }

    /**
     * @notice  transfer the unsold tokens to owner
     */
    function withdrawTokenBalance() internal {
        require(currentStatus == Status.CLOSED, 'Sale is not closed');

        uint256 claimable = (totalRaised * launchpad.sellPrice) / (10 ** decimals);
        uint256 balance = launchpad.token.balanceOf(address(this)).sub(claimable);

        if (refundType) {
            launchpad.token.transfer(msg.sender, balance);
        } else {
            launchpad.token.transfer(address(0x000000000000000000000000000000000000dEaD), balance);
        }
    }

    /**
     * @notice  called by owner to get refund incase of sale cancellation or failure to reach soft cap
     */
    function withdrawTokens() external nonReentrant onlyOwner {
        require(
            (block.timestamp >= launchpad.endTime && totalRaised < launchpad.softCap) ||
                currentStatus == Status.CANCELLED,
            'Sale is not cancelled or end Time not reached'
        );

        launchpad.token.transfer(msg.sender, launchpad.token.balanceOf(address(this)));
    }

    /**
     * @notice  set afflication terms
     * @param   _reward  percentage of reward in bips(3)
     */
    function setAffiliation(uint256 _reward) external onlyOwner {
        require(_reward <= 5e3, "Reward can't be greater than 5%");
        require(currentStatus != Status.CANCELLED, 'Sale is cancelled');
        require(currentStatus != Status.CLOSED, 'Sale is not active');

        isAffiliate = true;
        affiliateReward = _reward;

        emit UpdateReward(Id, _reward, msg.sender);
    }

    /**
     * @notice  update start and end time before sale start
     * @param   _startTime  .
     * @param   _endTime  .
     */
    function setTime(uint256 _startTime, uint256 _endTime) external onlyOwner {
        require(block.timestamp < launchpad.startTime, 'Sale already started');
        require(_startTime > block.timestamp && _startTime < _endTime, 'Invalid start time');

        launchpad.startTime = _startTime;
        launchpad.endTime = _endTime;

        emit UpdateTime(Id, _startTime, _endTime);
    }

    /**
     * @notice  set specific time to claim tokens
     * @param   _time  .
     */
    function setClaimTime(uint256 _time) external onlyOwner {
        require(!liquidity.isAutolisting, 'Cannot set with Auto liquidity enabled');
        require(_time >= block.timestamp, 'Claim time cannot be in past');
        require(currentStatus != Status.CANCELLED, 'Sale is Cancelled');
        require(currentStatus != Status.CLOSED, 'Sale is closed');

        claimTime = _time;

        emit ClaimTimeUpdate(Id, _time, msg.sender);
    }

    /**
     * @return  mode  the mode of sale right now
     */
    function getCurrentMode() public view returns (Mode mode) {
        mode = (block.timestamp < launchpad.startTime)
            ? Mode.PENDING //PENDING
            : (block.timestamp >= launchpad.startTime && block.timestamp < launchpad.publicSaleTime)
                ? Mode.PRIVATE //PRIVATE
                : Mode.PUBLIC; //PUBLIC
    }

    /**
     * @return status  the current sale status i,e., public private etc.
     */
    function getCurrentStatus() public view returns (Status status) {
        if ((block.timestamp < launchpad.startTime) && currentStatus != Status.CANCELLED) {
            status = Status.INCOMMING;
        } else if (
            (block.timestamp >= launchpad.startTime && currentStatus == Status.INCOMMING) &&
            (block.timestamp <= launchpad.endTime) &&
            (currentStatus != Status.CANCELLED && currentStatus != Status.CLOSED)
        ) {
            status = Status.ACTIVE;
        } else if (
            (block.timestamp >= launchpad.startTime && currentStatus == Status.INCOMMING) &&
            (block.timestamp > launchpad.endTime) &&
            (currentStatus != Status.CANCELLED && currentStatus != Status.CLOSED)
        ) {
            status = Status.CLOSED;
        } else {
            status = currentStatus;
        }
    }

    /**
     * @notice  return the total amount of tokens user will receive against investment.
     * @param   _user  .
     * @return  uint256  .
     */
    function getUserTokens(address _user) public view returns (uint256) {
        UserDetails memory user = userInfo[_user];
        return (user.userInvest * launchpad.sellPrice) / (10 ** decimals);
    }

    /**
     * @notice  the remaing amount out of total amuont of tokens.
     * @param   _user  .
     * @return  uint256 remaing amoun of tokens to claim
     */
    function getUserRemainingClaimable(address _user) public view returns (uint256) {
        UserDetails memory user = userInfo[_user];
        uint256 totalTokens = getUserTokens(_user);

        return (totalTokens - user.userCalimed);
    }

    /**
     * @return  uint256  return the total tokens sold till now
     */
    function getTotalTokensSold() public view returns (uint256) {
        return (totalRaised * launchpad.sellPrice) / (10 ** decimals);
    }

    /**
     * @return  uint256  return the total tokens offered for sell
     */
    function getTotalSaleTokens() public view returns (uint256) {
        return (launchpad.hardCap * launchpad.sellPrice) / (10 ** decimals);
    }

    /**
     * @return  uint256  return the array of referrers
     */
    function getAllReferrers() public view returns (address[] memory) {
        return referrers;
    }

    /**
     * @return  uint256  return the array of all investors
     */
    function getAllInvestors() public view returns (address[] memory) {
        return investors;
    }

    /**
     * @return  pairAddress  returnd the pair address to add liquidity.
     */
    function getTokenPair() internal view returns (address pairAddress) {
        if (fundByTokens) {
            pairAddress = IUniswapV2Factory(liquidity.router.factory()).getPair(
                address(fundToken),
                address(launchpad.token)
            );
        } else {
            pairAddress = IUniswapV2Factory(liquidity.router.factory()).getPair(
                liquidity.router.WETH(),
                address(launchpad.token)
            );
        }
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

            launchpad.token.approve(address(liquidity.router), sellTokenShare);

            if (!fundByTokens) {
                // Create a DEX pair for this token
                (amountToken, amountETH, _liquidity) = liquidity.router.addLiquidityETH{
                    value: fundTokenShare
                }(
                    address(launchpad.token),
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
                    address(launchpad.token),
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
     * @notice  to get share of sell tokens and purchase currency to create pair and add liquidity
     * @return  uint256  sell tokens share
     * @return  uint256  purchase currency share
     */
    function getTokenShare() internal view returns (uint256, uint256) {
        uint256 fee = (totalRaised * tokenFee) / 100e3;

        uint256 reward = ((totalRaised - fee) * affiliateReward) / 100e3;

        uint256 share = (isAffiliate && totalReferralInvest > 0)
            ? ((totalRaised - (fee + reward)) * liquidity.liquidityPercent) / 100e3
            : ((totalRaised - (fee)) * liquidity.liquidityPercent) / 100e3;

        uint256 tokens = (share * launchpad.listingPrice) / (10 ** decimals);

        return (share, tokens);
    }

    /**
     * @return  uint256   the amount of toekns user can withdraw as per vesting terms
     */
    function claimableTokens() external view returns (uint256) {
        return _calculateClaimableTokens(msg.sender);
    }

    /**
     * @param   _user  .
     * @return  withdrawable  the amount of tokens investor can withdraw as per vesting terms
     */
    function _calculateClaimableTokens(address _user) internal view returns (uint256 withdrawable) {
        UserDetails memory user = userInfo[_user];
        uint256 userShare = getUserTokens(_user);

        if (vesting.isVestingEnable) {
            require(
                (block.timestamp - user.lastClaimTime) >= vesting.cycleInterval,
                'Tokens are not unlocked'
            );

            uint256 tgeReleaseAmount = (vesting.TGEPercent * userShare) / 100e3;
            uint256 cycleReleaseAmount = Math.mulDiv(userShare, vesting.cyclePercent, 100e3);

            uint256 currentTotal = 0;

            if (block.timestamp >= claimTime) {
                currentTotal =
                    (((block.timestamp - claimTime) / vesting.cycleInterval) * cycleReleaseAmount) +
                    tgeReleaseAmount;
            }

            if (currentTotal > userShare) {
                withdrawable = userShare - user.userCalimed;
            } else {
                withdrawable = currentTotal - user.userCalimed;
            }
        } else {
            withdrawable = userShare;
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
}
