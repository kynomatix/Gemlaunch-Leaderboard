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

contract GempadSubscriptionPool is ServicePayer, GempadWhitelist, ReentrancyGuardUpgradeable {
    using SafeMath for uint256;
    uint256 public Id;
    bool public isInitialized = false;

    SubscriptionPoolDetails public pool;
    LiquidityDetails public liquidity;
    Status public currentStatus;

    tokenDistribution private distribution;

    IERC20Extented public fundToken;

    bool public fundByTokens;

    uint8 private decimals;

    // bool private canFinalize;
    bool private canCalculate;

    bool private isPrivateMode;
    bool private isRefund; //true refund and false burn

    address private feeReceiver;
    uint256 private tokenFee;

    uint256 public totalRaised;
    uint256 public totalContribution;

    uint256 public totalClaimed;

    address[] private investors;

    mapping(address => UserDetails) public userInfo;

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

    struct UserDetails {
        uint256 userInvest;
        uint256 userDeposit;
        uint256 userAllocation;
        uint256 userClaimed;
    }

    struct tokenDistribution {
        uint256 totalAllocated;
        uint256 surplusTokens;
        uint256 totalSurplusFunds;
        address[] leftInvestors;
        uint256[] amounts;
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

    event Purachsed(uint256 Id, address sender, uint256 _amount);
    event PublicSaleEnabled(uint256 Id, uint256 time);
    event liquidityAdded(uint256 Id, address pair, uint256 liquidity);
    event UpdateTime(uint256 Id, uint256 start, uint256 end);
    event Cancelled(uint256 Id, Status status);

    /**
     * @notice  initialization of core params
     * @param   _id  .
     * @param   info  .
     * @param   _liquidity  .
     * @param   _fundToken  .
     * @param   _isPrivateMode  .
     * @param   _isRefund  refund type burn or refund
     * @param   _feeReceiver  .
     * @param   _owner  .
     */
    function __GempadSubscriptionPool_init(
        uint256 _id,
        SubscriptionPoolDetails memory info,
        LiquidityDetails memory _liquidity,
        address _fundToken,
        bool _isPrivateMode,
        bool _isRefund,
        address payable _feeReceiver,
        address _owner
    ) public payable initializer {
        require(!isInitialized, 'Err: Already initialized');
        ServicePayer.__ServicePayer_init(_feeReceiver, 'GempadSubscriptionPool');

        Id = _id;

        //set custom Investment Token
        fundByTokens = _fundToken != address(0);
        if (fundByTokens) {
            fundToken = IERC20Extented(_fundToken);
        }

        decimals = info.token.decimals();

        require(info.listingRate < info.sellRate, 'Listing rate must be less than sell rate');
        require(
            (info.softCap >= (info.hardCap * 51e3) / 100e3) && (info.softCap < info.hardCap),
            'SoftCap must be greater than 50% of hardh cap'
        );
        require(info.userHardCap <= info.hardCap, 'Invalid User max buy limit');
        require(info.startTime > block.timestamp && info.startTime < info.endTime, 'Invalid start time');

        require(
            _liquidity.liquidityPercent > 50e3 && _liquidity.liquidityPercent <= 100e3,
            'Invalid liquidity percentage'
        );
        require(_liquidity.lockTime >= 300, "Lock time can't be less than 5 minuts");

        liquidity = _liquidity;
        pool = info;
        // Initialize the public sale start time;
        pool.publicSaleTime = (_isPrivateMode) ? info.endTime : info.startTime;
        //whitelisting feature status
        isPrivateMode = _isPrivateMode;
        isRefund = _isRefund;

        // Initialize fee and refund type
        feeReceiver = _feeReceiver;
        tokenFee = IPayable(feeReceiver).getFee('GempadSubscriptionPool');

        _transferOwnership(_owner);
        isInitialized = true;
    }

    /**
     * @notice  user buy Tokens
     * @param   _amount  amount in purchase currency
     */
    function buyToken(uint256 _amount) external payable nonReentrant {
        UserDetails storage user = userInfo[msg.sender];

        require(block.timestamp >= pool.startTime && block.timestamp <= pool.endTime, 'Sale is not active');

        if (block.timestamp < pool.publicSaleTime) {
            require(_whitelist[msg.sender], 'User is not whitelisted');
        }

        if (user.userInvest <= 0) investors.push(msg.sender);
        user.userInvest += _amount;

        // Update the total sale amount
        totalContribution += _amount;

        if (fundByTokens) {
            fundToken.transferFrom(msg.sender, address(this), _amount);
        } else {
            // Ensure that the sender has sent enough Ether
            require(msg.value == _amount, 'Insufficient funds sent');
        }
        emit Purachsed(Id, msg.sender, _amount);
    }

    /**
     * @notice  enable public or private sale time.
     * @param   _startTime   start time of public sale time if it is equalo to sale end time that means its priavte sale.
     */
    function enablePublicSale(uint256 _startTime) external onlyOwner {
        pool.publicSaleTime = _startTime;

        emit PublicSaleEnabled(Id, pool.publicSaleTime);
    }

    /**
     * @notice  cancel the sale
     */
    function cancel() external onlyOwner {
        require(currentStatus != Status.CANCELLED, 'Sale already cancelled');
        require(currentStatus != Status.CLOSED, 'Sale cannot be cancelled after finalize');

        currentStatus = Status.CANCELLED;

        emit Cancelled(Id, currentStatus);
    }

    /**
     * @notice  update the user tokens share as per total investment
     * @dev     distribution completes in three phases
     * @param   _contributors   investors
     * @return  uint256  .
     * @return  uint256  .
     * @return  address[]  .
     * @return  uint256[]  .
     */
    function updateCalculation(
        address[] memory _contributors
    ) public onlyOwner returns (uint256, uint256, address[] memory, uint256[] memory) {
        uint256 scap = (pool.softCap * 1e18) / pool.sellRate;
        require(
            (block.timestamp > pool.endTime && totalContribution >= scap) || totalContribution >= scap,
            'Sale End Time or cap not reached'
        );
        require(currentStatus != Status.CANCELLED, 'Sale in cancelled');

        // uint256 length = investors.length;
        uint256 length = _contributors.length;

        for (uint i = 0; i < length; i++) {
            // UserDetails storage user = userInfo[investors[i]];
            UserDetails storage user = userInfo[_contributors[i]];

            require(user.userInvest > 0, 'Invalid User');

            uint256 allocation = (user.userInvest * pool.hardCap) / totalContribution;
            if (allocation > pool.userHardCap) {
                allocation = pool.userHardCap;
            }

            uint256 value = (allocation * 1e18) / pool.sellRate;
            user.userDeposit = value;
            user.userAllocation = allocation;
            distribution.totalAllocated += user.userAllocation;
            totalRaised += value;

            if (user.userAllocation < pool.userHardCap && user.userDeposit < user.userInvest) {
                distribution.totalSurplusFunds += (user.userInvest - user.userDeposit);
                // distribution.leftInvestors.push(investors[i]);
                distribution.leftInvestors.push(_contributors[i]);
                distribution.amounts.push(user.userInvest - user.userDeposit);

                distribution.totalSurplusFunds += (user.userInvest - user.userDeposit);
            }
        }

        canCalculate = true;

        distribution.surplusTokens = pool.hardCap - distribution.totalAllocated;
        // distribution.totalSurplusFunds = totalContribution - totalRaised;

        return (
            distribution.totalSurplusFunds,
            distribution.surplusTokens,
            distribution.leftInvestors,
            distribution.amounts
        );
    }

    /**
     * @notice  after 1st two phases , its finnl phase where remaing user with amount in account get tokens
     * @param   _totalTokens  .
     * @param   _totalFunds  .
     * @param   _contributors  .
     * @param   _amounts  .
     */
    function calculateShare(
        uint256 _totalTokens,
        uint256 _totalFunds,
        address[] memory _contributors,
        uint256[] memory _amounts
    ) external onlyOwner nonReentrant {
        require(_contributors.length == _amounts.length, 'length mismatch');

        require(canCalculate, 'Allocation not updated');

        uint256 length = _contributors.length;

        for (uint i = 0; i < length; i++) {
            UserDetails storage user = userInfo[_contributors[i]];

            if (user.userDeposit < user.userInvest && user.userAllocation < pool.userHardCap) {
                uint256 allocation = (_amounts[i] * _totalTokens) / _totalFunds;

                if ((user.userAllocation + allocation) > pool.userHardCap) {
                    allocation = pool.userHardCap - user.userAllocation;
                }

                require(user.userAllocation + allocation <= pool.userHardCap, 'User hardCap reached');

                uint256 value = (allocation * 1e18) / pool.sellRate;

                user.userDeposit += value;

                user.userAllocation += allocation;

                distribution.totalAllocated += allocation;

                totalRaised += value;

                if (user.userAllocation < pool.userHardCap && user.userDeposit < user.userInvest) {
                    distribution.leftInvestors.push(_contributors[i]);
                }
            }
        }

        distribution.totalSurplusFunds = totalContribution - totalRaised;
        distribution.surplusTokens = pool.hardCap - distribution.totalAllocated;
    }

    /**
     * @return  uint256  totalAllocated
     * @return  uint256  surplusTokens
     * @return  uint256  totalSurplusFunds
     */
    function getDistribution() public view returns (uint256, uint256, uint256) {
        return (distribution.totalAllocated, distribution.surplusTokens, distribution.totalSurplusFunds);
    }

    /**
     * @return  tokenDistribution  surplus tokens and funds after distribution
     */
    function getSurplusData() public view returns (tokenDistribution memory) {
        return distribution;
    }

    /**
     * @notice  finalize the sale and withdraw raised funds
     */
    function finalize() external onlyOwner nonReentrant {
        uint256 scap = (pool.softCap * 1e18) / pool.sellRate;

        // require(canFinalize, 'Finalization not approved');
        require(
            (block.timestamp > pool.endTime && totalContribution >= scap) || totalContribution >= scap,
            'Sale End Time or cap not reached'
        );
        require(currentStatus != Status.CLOSED, 'Sale already finalized');
        require(currentStatus != Status.CANCELLED, 'Sale CANCELLED');

        currentStatus = Status.CLOSED;
        pool.finalizeTime = block.timestamp;

        uint256 feeAmount = (totalRaised * tokenFee) / 100e3;

        addLiquidity();

        //transfer token fee;
        _transferFunds(feeReceiver, feeAmount);

        withdrawFunds();
    }

    /**
     * @notice  withdraw the funds raised
     */
    function withdrawFunds() internal {
        uint256 amount = (fundByTokens) ? fundToken.balanceOf(address(this)) : address(this).balance;

        uint256 withdrawable = amount - (totalContribution - totalRaised);

        _transferFunds(msg.sender, withdrawable);
    }

    /**
     * @notice  called by the investor the claim the tokens against investment.
     */
    function claimTokens() external nonReentrant {
        UserDetails storage user = userInfo[msg.sender];

        require(currentStatus != Status.CANCELLED, 'Sale in cancelled');
        require(currentStatus == Status.CLOSED, 'Sale is not finalized');

        require((user.userClaimed + user.userAllocation) <= user.userAllocation, 'All tokens claimed');

        user.userClaimed = user.userAllocation;

        totalClaimed += user.userAllocation;

        uint256 allocation = (user.userAllocation * (10 ** decimals)) / 1e18;

        _transferFunds(msg.sender, (user.userInvest - user.userDeposit));

        pool.token.transfer(msg.sender, allocation);
    }

    /**
     * @notice  called by investor to get refund incase of sale cancellation or failure to reach soft cap
     */
    function claimUserRefund() external {
        UserDetails storage info = userInfo[msg.sender];
        uint256 scap = (pool.softCap * 1e18) / pool.sellRate;

        require(
            (block.timestamp >= pool.endTime && totalContribution < scap) ||
                currentStatus == Status.CANCELLED,
            'Refund is not allowed'
        );
        require(info.userInvest > 0, 'User has not invested');

        uint256 refund = info.userInvest;

        info.userInvest = 0;
        _transferFunds(msg.sender, refund);
    }

    /**
     * @notice  update start and end time before sale start
     * @param   _startTime  .
     * @param   _endTime  .
     */
    function setTime(uint256 _startTime, uint256 _endTime) external onlyOwner {
        require(block.timestamp < pool.startTime, 'Sale already started');
        require(_startTime > block.timestamp && _startTime < _endTime, 'Invalid start time');

        pool.startTime = _startTime;
        pool.endTime = _endTime;

        emit UpdateTime(Id, _startTime, _endTime);
    }

    /**
     * @notice  pout of total invested by user, how much amount left after paying for allocated tokens
     * @return  uint256  .
     */
    function getUserRemainingFunds() public pure returns (uint256) {
        UserDetails memory user;
        return user.userInvest - user.userDeposit;
    }

    /**
     * @return  pairAddress  returnd the pair address to add liquidity.
     */
    function getTokenPair() internal view returns (address pairAddress) {
        if (fundByTokens) {
            pairAddress = IUniswapV2Factory(liquidity.router.factory()).getPair(
                address(fundToken),
                address(pool.token)
            );
        } else {
            pairAddress = IUniswapV2Factory(liquidity.router.factory()).getPair(
                liquidity.router.WETH(),
                address(pool.token)
            );
        }
    }

    /**
     * @notice  to get share of sell tokens and purchase currency to create pair and add liquidity
     * @return  share  sell tokens share
     * @return  tokens  purchase currency share
     */
    function getTokenShare() internal view returns (uint256 share, uint256 tokens) {
        uint256 fee = (totalRaised * tokenFee) / 100e3;

        share = ((totalRaised - fee) * liquidity.liquidityPercent) / 100e3;

        tokens = (share * pool.listingRate) / (1e36 / 10 ** decimals);
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

            pool.token.approve(address(liquidity.router), sellTokenShare);

            if (!fundByTokens) {
                // Create a DEX pair for this token
                (amountToken, amountETH, _liquidity) = liquidity.router.addLiquidityETH{
                    value: fundTokenShare
                }(address(pool.token), sellTokenShare, 0, 0, address(this), block.timestamp);
            } else {
                fundToken.approve(address(liquidity.router), fundTokenShare);

                (amountToken, amountETH, _liquidity) = liquidity.router.addLiquidity(
                    address(pool.token),
                    address(fundToken),
                    sellTokenShare,
                    fundTokenShare,
                    0,
                    0,
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
                'Gempad liquidity'
            );

            emit liquidityAdded(Id, pairAddress, _liquidity);

            return (amountToken, amountETH, _liquidity);
        }

        return (0, 0, 0);
    }

    /**
     * @return  mode  the mode of sale right now
     */
    function getCurrentMode() public view returns (Mode mode) {
        mode = (block.timestamp < pool.startTime)
            ? Mode.PENDING //pending
            : (block.timestamp >= pool.startTime && block.timestamp < pool.publicSaleTime)
            ? Mode.PRIVATE //private
            : Mode.PUBLIC; //public
    }

    /**
     * @return  status  current selling status
     */
    function getCurrentSatus() public view returns (Status status) {
        status = (block.timestamp < pool.startTime && currentStatus != Status.CANCELLED)
            ? Status.INCOMMING
            : (currentStatus != Status.CANCELLED &&
                currentStatus != Status.CLOSED &&
                block.timestamp > pool.startTime)
            ? Status.ACTIVE
            : currentStatus;
    }

    /**
     * @return  uint256  return the array of all investors
     */
    function getAllInvestors() public view returns (address[] memory) {
        return investors;
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
