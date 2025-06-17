// SPDX-License-Identifier: MIT

pragma solidity ^0.8.14;

import { ServicePayer, IPayable } from '@gempad/services/contracts/ServicePayer.sol';
import '@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import '@openzeppelin/contracts/utils/math/Math.sol';
import './GempadWhitelist.sol';
import 'hardhat/console.sol';

contract GempadPrivateSale is GempadWhitelist, ServicePayer, ReentrancyGuardUpgradeable {
    using SafeMath for uint256;
    bool public isInitialized = false;
    uint256 public Id;

    bool public fundByTokens;
    IERC20 public fundToken;

    IERC20 public antibotToken;
    uint256 private antibotTokenBalance;
    bool private isAntibotActive = false;
    bool private isPrivate;

    uint256 public totalSale;
    uint256 public claimedAmount;
    uint256 private lastClaimTime;

    address private feeReceiver;
    uint256 private tokenFee;

    PrivateSaleInfo public saleInfo;
    VestingInfo public vesting;
    Mode private currentMode;
    Status private currentStatus;

    mapping(address => uint256) public depositOf;
    address[] private investors;

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
    enum Status {
        PENDING,
        ACTIVE,
        CANCELLED,
        CLOSED
    }

    event AntibotInfoAdded(uint256 Id, Mode mode, address token, uint256 amount);
    event FundsDeposited(uint256 Id, address sender, uint256 amount);
    event PublicSaleEnabled(uint256 Id, uint256 saleTime);
    event Finalized(uint256 Id, Status status, uint256 finalizeTime);

    /**
     * @notice  initialze the core params
     * @param   _id  .
     * @param   _owner  .
     * @param   info  structure info
     * @param   _vesting  claim data
     * @param   _mode  mode of sale
     * @param   _feeReceiver  .
     * @param   _fundToken to receive as payment
     */
    function __GempadPrivateSale_init(
        uint256 _id,
        address _owner,
        PrivateSaleInfo memory info,
        VestingInfo memory _vesting,
        Mode _mode,
        address payable _feeReceiver,
        address _fundToken
    ) public payable initializer {
        require(!isInitialized, 'Err: Already Initialized');
        ServicePayer.__ServicePayer_init(_feeReceiver, 'GempadPrivateSale');

        require(info.softCap <= info.hardCap, 'Soft-Cap should be less than or equal to hardcap');
        require(info.softCap >= (info.hardCap / 2), 'Softcap must be greater than or equal 50% of Hardcap');

        require(info.minBuyLimit > 0 && info.minBuyLimit < info.maxBuyLimit, 'Invalid min and max buy limit');

        require(info.startTime > block.timestamp && info.startTime < info.endTime, 'Invalid start time');

        require(
            _vesting.initialRelease > 0 && _vesting.initialRelease <= 95e3,
            'Invalid Initial Release pecentage'
        );

        require(_vesting.cyclePercent > 0, 'Cycle pecentage must be greater than zero');

        require(_vesting.cycleInterval > 0, 'interval must be greater than zero');

        require(
            _vesting.initialRelease + _vesting.cyclePercent <= 100e3,
            'Sum of TGE bps and cycle should be less than 100'
        );

        //set custom Investment Token
        fundByTokens = _fundToken != address(0);
        if (fundByTokens) {
            fundToken = IERC20(_fundToken);
        }

        //whitelisting feature status
        require(_mode == Mode.PUBLIC || _mode == Mode.WHITELIST, 'Only public and private modes allowed');
        currentMode = _mode;

        saleInfo = info;
        vesting = _vesting;
        Id = _id;

        // Initialize the public sale start time;
        saleInfo.publicSaleTime = (currentMode == Mode.PUBLIC) ? saleInfo.startTime : saleInfo.endTime;
        if (saleInfo.publicSaleTime == saleInfo.endTime) isPrivate = true;
        feeReceiver = _feeReceiver;
        tokenFee = IPayable(feeReceiver).getFee('GempadPrivateSale');

        _transferOwnership(_owner);
        isInitialized = true;
    }

    /**
     * @notice user buy Tokens
     * @param _amount user wants to spend
     */
    function investFunds(uint256 _amount) external payable nonReentrant {
        require(
            block.timestamp >= saleInfo.startTime && block.timestamp <= saleInfo.endTime,
            'Sale is not active'
        );

        if (block.timestamp < saleInfo.publicSaleTime && isPrivate) {
            require(_whitelist[msg.sender], 'User is not whitelisted');
        } else if (isAntibotActive && block.timestamp < saleInfo.publicSaleTime) {
            require(hasAntibotTokenBalance(), 'Insufficient Token balance');
        }

        require(_amount >= saleInfo.minBuyLimit, 'Amount is les than min buy limit');
        require(depositOf[msg.sender] + _amount <= saleInfo.maxBuyLimit, 'Maximum buy limit reached');
        require((totalSale + _amount) <= saleInfo.hardCap, 'Maximum sale limit reached');

        if (depositOf[msg.sender] <= 0) investors.push(msg.sender);
        depositOf[msg.sender] += _amount;

        // Update the total sale amount
        totalSale += _amount;

        if (fundByTokens) {
            fundToken.transferFrom(msg.sender, address(this), _amount);
        } else {
            // Ensure that the sender has sent enough Ether
            require(msg.value == _amount, 'Insufficient funds sent');
        }

        emit FundsDeposited(Id, msg.sender, _amount);
    }

    /**
     * @notice  cancel teh sale
     */
    function cancel() external onlyOwner {
        require(currentStatus != Status.CLOSED, 'Sale cannot be cancelled after finalize');
        currentStatus = Status.CANCELLED;
    }

    /**
     * @notice finalize the sale
     */
    function finalize() external onlyOwner {
        require(currentStatus != Status.CLOSED, 'Sale already finalized');
        require(
            (block.timestamp > saleInfo.endTime && totalSale >= saleInfo.softCap) ||
                totalSale >= saleInfo.softCap,
            'Sale End Time or cap not reached'
        );

        currentStatus = Status.CLOSED;
        saleInfo.finalizeTime = block.timestamp;

        emit Finalized(Id, currentStatus, block.timestamp);
    }

    /**
     * @notice claim Tokens as per vesting rules
     */
    function claimTokens() external onlyOwner nonReentrant {
        require(currentStatus == Status.CLOSED, 'Sale in not finalized');

        uint256 claimableAmount = _calculateClaimableTokens();

        uint256 claimable = claimedAmount + claimableAmount;

        require(claimableAmount > 0 && claimable <= totalSale, 'Total funds claimed');

        uint256 feeAmount = (claimableAmount * tokenFee) / 100e3;

        claimedAmount += claimableAmount;

        lastClaimTime = block.timestamp;

        _transferFunds(feeReceiver, feeAmount);
        _transferFunds(msg.sender, (claimableAmount - feeAmount));
    }

    /**
     * @notice claim refund if sale cancelled or soft cap not reached
     */
    function claimRefund() external nonReentrant {
        require(
            (block.timestamp >= saleInfo.endTime && totalSale < saleInfo.softCap) ||
                currentStatus == Status.CANCELLED,
            'Refund is not allowed'
        );
        require(depositOf[msg.sender] > 0, 'User has not invested any funds');

        // uint256 funds = depositOf[msg.sender];
        uint256 refund = depositOf[msg.sender];
        depositOf[msg.sender] = 0;

        _transferFunds(msg.sender, refund);
    }

    /**
     * @notice set the time of public sale, and (sale end Time = private MOde)
     * @param   _startTime  of public sale
     */
    function enablePublicSale(uint256 _startTime) external onlyOwner {
        saleInfo.publicSaleTime = _startTime;

        if (_startTime == saleInfo.endTime) isPrivate = true;
        if (_startTime == saleInfo.endTime && isAntibotActive) isAntibotActive = false;

        emit PublicSaleEnabled(Id, saleInfo.publicSaleTime);
    }

    /**
     * @notice Enable the antibot bot mode that requires specific token balance
     * @param   _token  token require to have if user want to buy selling token
     * @param   _amount   balance fo antibiot token required
     */
    function enableAntibotMode(address _token, uint256 _amount) external onlyOwner {
        require(_token != address(0), 'Invalid token address');
        require(_amount > 0, 'Amount can not be zero');

        antibotToken = IERC20(_token);
        antibotTokenBalance = _amount;
        currentMode = Mode.ANTI_BOT;
        isAntibotActive = true;
        if (isPrivate) isPrivate = false;
        saleInfo.publicSaleTime = saleInfo.endTime;

        emit AntibotInfoAdded(Id, currentMode, _token, _amount);
    }

    /**
     * @notice  it returns the current mode of sale
     * @dev    time is a key player in role change
     * @return  mode   current sale mode
     */
    function getCurrentMode() public view returns (Mode mode) {
        mode = ((block.timestamp < saleInfo.publicSaleTime && isPrivate) &&
            (block.timestamp > saleInfo.startTime) || (block.timestamp < saleInfo.startTime))
            ? Mode.WHITELIST
            : ((isAntibotActive && block.timestamp < saleInfo.publicSaleTime) &&
                (block.timestamp > saleInfo.startTime))
            ? Mode.ANTI_BOT
            : Mode.PUBLIC;
    }

    /**
     * @return status  the current sale status i,e., public private etc.
     */
    function getCurrentStatus() public view returns (Status status) {
        if ((block.timestamp < saleInfo.startTime) && currentStatus != Status.CANCELLED) {
            status = Status.PENDING;
        } else if (
            (block.timestamp >= saleInfo.startTime && currentStatus == Status.PENDING) &&
            (block.timestamp <= saleInfo.endTime) &&
            (currentStatus != Status.CANCELLED && currentStatus != Status.CLOSED) 
        ) {
            status = Status.ACTIVE;
        } else if (
            (block.timestamp >= saleInfo.startTime && currentStatus == Status.PENDING) &&
            (block.timestamp > saleInfo.endTime) &&
            (currentStatus != Status.CANCELLED && currentStatus != Status.CLOSED) 
        ) {
            status = Status.CLOSED;
        } else {
            status = currentStatus;
        }
    }

    /**
     * @return  uint256   the amount of toekns user can withdraw as per vesting terms
     */
    function claimableTokens() external view returns (uint256) {
        return _calculateClaimableTokens();
    }

    /**
     * @return  uint256  return the array of all investors
     */
    function getAllInvestors() public view returns (address[] memory) {
        return investors;
    }

    /**
     * @return  withdrawable : token canbe calimed as per vesting settings
     */
    function _calculateClaimableTokens() internal view returns (uint256 withdrawable) {
        require((block.timestamp - lastClaimTime) >= vesting.cycleInterval, 'Tokens are not unlocked');

        uint256 tgeReleaseAmount = (vesting.initialRelease * totalSale) / 100e3;
        uint256 cycleReleaseAmount = Math.mulDiv(totalSale, vesting.cyclePercent, 100e3);

        uint256 currentTotal = 0;

        if (block.timestamp >= saleInfo.finalizeTime) {
            currentTotal =
                (((block.timestamp - saleInfo.finalizeTime) / vesting.cycleInterval) * cycleReleaseAmount) +
                tgeReleaseAmount;
        }

        if (currentTotal > totalSale) {
            withdrawable = totalSale - claimedAmount;
        } else {
            withdrawable = currentTotal - claimedAmount;
        }
    }

    /**
     * @notice transfer the buying currency to receiver
     * @param   _to   receiver
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
     * @return  bool  check the require antibot toen balance
     */
    function hasAntibotTokenBalance() internal view returns (bool) {
        uint256 balance = antibotToken.balanceOf(msg.sender);
        return balance >= antibotTokenBalance;
    }
}
