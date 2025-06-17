// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

/**
 * @title GempadAirdrop, support ERC20 Tokens, airdrop erc20 token to participants
 */

import { ServicePayer, IPayable } from '@gempad/services/contracts/ServicePayer.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol';
import './interfaces/IERC20Extented.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import '@openzeppelin/contracts/utils/math/Math.sol';
import 'hardhat/console.sol';

contract GempadAirdrop is Initializable, OwnableUpgradeable, ServicePayer, ReentrancyGuardUpgradeable {
    using SafeERC20 for IERC20Extented;
    using SafeMath for uint256;
    uint256 private count;
    bool public initialized = false;

    uint256 public id;
    string public airdropName;
    IERC20Extented public token;
    uint256 public totalTokens;
    uint256 public totalClaimedTokens;
    uint256 public startTime;
    bool public ensureExactAmount;

    address private feeReceiver;
    uint256 private tokenFee;
    uint8 private decimals;

    Status private currentStatus;
    DistributionInfo public vestingInfo;

    address[] private participants;
    mapping(address => mapping(uint256 => ClaimData)) private claimInfo;

    struct ClaimData {
        uint256 claimed;
        uint256 userAllocation;
        uint256 lastClaimTime;
    }

    struct DistributionInfo {
        uint256 TGEPercent;
        uint256 cyclePercent;
        uint256 cycleInterval;
        bool isVestingEnabled;
    }

    enum Status {
        PENDING,
        ACTIVE,
        CANCELLED,
        CLOSED
    }

    event ParticipantsAdded(uint256 id, address[] receiver, uint256[] tokenAmount);
    event AllocationsRemoved(uint256 id, address[] participants, address sender);
    event VestingInfoSet(uint256 id, uint256 tge, uint256 cycle, uint256 interval, bool isVesting);
    event AirdropStarted(uint256 id, uint256 startTime, Status status);
    event ExactAmountDisabled(uint256 id, address caller, bool status);
    event AirdropCancelled(uint256 id, Status currentStatus, uint256 tokenBalance, uint256 timestamp);
    event TokensCalimed(uint256 id, uint256 amount, uint256 fee, uint256 claimTime);

    /**
     * @notice initialize the Airdrop core settings
     * @param _id :associated with this airdrop
     * @param _owner :owner of this airdrop
     * @param _tokenAddress :airdrop token
     * @param _airdropName :name
     * @param _feeReceiver : receiver of reatinga nd token fee;
     */

    function __GempadAirdrop_init(
        uint256 _id,
        address _owner,
        address _tokenAddress,
        string memory _airdropName,
        address payable _feeReceiver
    ) public payable initializer {
        require(!initialized, 'Err: Already Initialized');
        ServicePayer.__ServicePayer_init(_feeReceiver, 'GempadAirdrop');

        token = IERC20Extented(_tokenAddress);
        airdropName = _airdropName;
        ensureExactAmount = true;
        currentStatus = Status.PENDING;
        feeReceiver = _feeReceiver;

        tokenFee = IPayable(feeReceiver).getFee('GempadAirdrop');

        decimals = token.decimals();
        id = _id;

        _transferOwnership(_owner);
        initialized = true;
    }

    /**
     * @notice token receivers and their respected amount
     * @param receivers :token receivers
     * @param tokenAmounts :their respected amount
     */

    function addParticipantsAndAllocation(
        address[] memory receivers,
        uint256[] memory tokenAmounts
    ) external onlyOwner {
        require(currentStatus == Status.PENDING, 'Airdrop must not be active');
        require(receivers.length == tokenAmounts.length, 'Input arrays must have the same length');
        if (participants.length <= 0) ++count;

        uint256 length = receivers.length;
        for (uint256 i = 0; i < length; i++) {
            ClaimData storage info = claimInfo[receivers[i]][count];

            require(receivers[i] != address(0), 'Invalid address');
            require(tokenAmounts[i] > 0, 'Amount must be greater than zero');

            if (info.userAllocation <= 0) {
                participants.push(receivers[i]);
            }

            if (info.userAllocation > 0) {
                totalTokens -= info.userAllocation;
            }

            info.userAllocation = tokenAmounts[i];

            totalTokens += tokenAmounts[i];
        }

        emit ParticipantsAdded(id, receivers, tokenAmounts);
    }

    /**
     * @notice vesting setting for token claim
     * @param _TGEPercent initial release
     * @param _cyclePercent percentage release with each cycle
     * @param _cycleInterval gap between each release
     */

    function setVestingInfo(
        uint256 _TGEPercent,
        uint256 _cyclePercent,
        uint256 _cycleInterval
    ) external onlyOwner {
        require(currentStatus == Status.PENDING, 'Airdrop must not be active');
        require(_TGEPercent > 0 && _TGEPercent <= 100e3, 'TGE pecentage must be greater than zero');
        require(_cyclePercent > 0, 'Cycle pecentage must be greater than zero');
        require(_cycleInterval > 0, 'interval must be greater than zero');
        require(_TGEPercent + _cyclePercent <= 100e3, 'Sum of TGE and cycle should be less than 100');

        vestingInfo.TGEPercent = _TGEPercent;
        vestingInfo.cyclePercent = _cyclePercent;
        vestingInfo.cycleInterval = _cycleInterval;

        vestingInfo.isVestingEnabled = true;

        emit VestingInfoSet(id, _TGEPercent, _cyclePercent, _cycleInterval, vestingInfo.isVestingEnabled);
    }

    /**
     * @notice remove added receivers and tokens
     */
    function removeAllocations() external onlyOwner {
        require(currentStatus == Status.PENDING, 'Airdrop must not be active');
        address[] memory alloc = participants;

        totalTokens = 0;

        delete participants;

        emit AllocationsRemoved(id, alloc, msg.sender);
    }

    /**
     * @notice schedule airdrop or start now
     * @param _startTime :time
     */

    function startAirdrop(uint256 _startTime) external onlyOwner {
        require(currentStatus == Status.PENDING && startTime <= 0, 'Airdrop must not be active');
        require(participants.length > 0, 'Airdrop participants must be greater than zero');

        startTime = _startTime;

        _transferTokensFromOwner(); // Transfer tokens from owner to airdrop

        emit AirdropStarted(id, startTime, getCurrentStatus());
    }

    /**
     * @notice it disbale the check for exact receiving amount
     */

    function disbableEnsureExactAmount() external onlyOwner {
        require(currentStatus != Status.CLOSED, 'Airdrop must not be closed');
        ensureExactAmount = false;

        emit ExactAmountDisabled(id, msg.sender, false);
    }

    /**
     * @notice Cancel the airdrop and return tokens to owner
     */
    function cancelAirdrop() external onlyOwner {
        require(currentStatus != Status.CLOSED, 'Airdrop must not be closed');
        require(currentStatus != Status.CANCELLED, 'Airdrop must not be cancelled');
        currentStatus = Status.CANCELLED;

        uint256 tokenBalance = token.balanceOf(address(this));
        if (tokenBalance > 0) token.transfer(owner(), tokenBalance);

        emit AirdropCancelled(id, currentStatus, tokenBalance, block.timestamp);
    }

    /**
     * @notice transfer claimable tokens as per vesting rules
     */
    function claimTokens() external nonReentrant {
        ClaimData storage user = claimInfo[msg.sender][count];

        require(block.timestamp >= startTime, "Token distribution hasn't started");
        require(user.userAllocation > 0, 'User has no token allocation');

        uint256 withdrawable = _withdrawableTokens(msg.sender);
        uint256 claimable = user.claimed + withdrawable;

        require(withdrawable > 0 && claimable <= user.userAllocation, 'User has no token to claim');

        totalClaimedTokens += withdrawable;
        user.claimed += withdrawable;

        uint256 fee = (withdrawable * tokenFee) / 100e3;

        user.lastClaimTime = block.timestamp;

        _distributeTokens(feeReceiver, fee);
        _distributeTokens(msg.sender, withdrawable);

        emit TokensCalimed(id, withdrawable, fee, user.lastClaimTime);
    }

    /**
     * @return withdrawable tokens as per vesting rules
     */
    function _withdrawableTokens(address _user) internal view returns (uint256 withdrawable) {
        ClaimData memory user = claimInfo[_user][count];

        if (vestingInfo.isVestingEnabled) {
            require(
                (block.timestamp - user.lastClaimTime) >= vestingInfo.cycleInterval,
                'Tokens are not unlocked'
            );

            uint256 tgeReleaseAmount = (user.userAllocation * vestingInfo.TGEPercent) / 100e3;
            uint256 cycleReleaseAmount = Math.mulDiv(user.userAllocation, vestingInfo.cyclePercent, 100e3);

            uint256 currentTotal = 0;
            if (block.timestamp >= startTime) {
                currentTotal =
                    (((block.timestamp - startTime) / vestingInfo.cycleInterval) * cycleReleaseAmount) +
                    tgeReleaseAmount;
            }

            if (currentTotal > user.userAllocation) {
                withdrawable = user.userAllocation - user.claimed;
            } else {
                withdrawable = currentTotal - user.claimed;
            }
        } else {
            withdrawable = user.userAllocation - user.claimed;
        }
    }

    /**
     * @return withdrawable tokens as per vesting rules
     */
    function getClaimable(address _user) public view returns (uint256) {
        uint256 claimable = _withdrawableTokens(_user);
        return claimable;
    }

    /**
     * @return the user claim information e,g. allocation
     * @param _user :
     */
    function getClaimInfo(address _user) public view returns (ClaimData memory) {
        return claimInfo[_user][count];
    }

    /**
     * @return the uparticipanst array
     */
    function getParticipants() public view returns (address[] memory) {
        return participants;
    }

    /**
     * @return the user allocated tokens
     * @param _user :
     */
    function getUserAllocation(address _user) public view returns (uint256) {
        ClaimData memory info = claimInfo[_user][count];
        return info.userAllocation;
    }

    /**
     * @return the amount of tokens claimed by user
     * @param _user :
     */
    function getClaimedAmount(address _user) public view returns (uint256) {
        ClaimData memory info = claimInfo[_user][count];
        return info.claimed;
    }

    /**
     * @return remaining amount o claim out of total
     */
    function getRemainingClaimabaleAmount(address _user) public view returns (uint256) {
        ClaimData memory info = claimInfo[_user][count];
        return (info.userAllocation - info.claimed);
    }

    /**
     * @return status current airdrop status
     */
    function getCurrentStatus() public view returns (Status status) {
        if ((block.timestamp < startTime || startTime <= 0) && currentStatus != Status.CANCELLED) {
            status = Status.PENDING;
        } else if (
            (block.timestamp >= startTime && currentStatus == Status.PENDING) &&
            (currentStatus != Status.CANCELLED || currentStatus != Status.CLOSED)
        ) {
            status = Status.ACTIVE;
        } else {
            status = currentStatus;
        }
    }

    /**
     * @notice transfer the token from owner to contract
     */
    function _transferTokensFromOwner() private {
        uint256 airDropfee = (totalTokens * tokenFee) / 100e3;
        require(token.balanceOf(msg.sender) >= totalTokens + airDropfee, 'Insufficient Tokens Balance');

        uint256 toReceive = totalTokens + airDropfee;

        uint256 before = token.balanceOf(address(this));

        token.safeTransferFrom(msg.sender, address(this), totalTokens + airDropfee);

        require(token.balanceOf(address(this)) == (before + toReceive), 'Insufficient token received');
    }

    /**
     * @notice transfer tokens
     */
    function _distributeTokens(address _to, uint256 _amount) private {
        function(address, uint256) transfer = ensureExactAmount
            ? _safeTransferEnsureExactAmount
            : _safeTransfer;

        transfer(_to, _amount);
    }

    /**
     * @notice In case people want to make sure they transfer the exact amount
     * @param to: receiver of tokens
     * @param amount of tokens
     */
    function _safeTransferEnsureExactAmount(address to, uint256 amount) private {
        uint256 balanceBefore = token.balanceOf(to);
        address from = address(this);
        token.transfer(to, amount);
        require(
            token.balanceOf(to) - balanceBefore == (from != to ? amount : 0), // if from is the same as to, the final balance should be the same as before the transfer
            'Not enough tokens were transfered, check options or try setting ensureExactAmount to false'
        );
    }

    /**
     * @notice transfer
     */

    function _safeTransfer(address to, uint256 amount) private {
        token.transfer(to, amount);
    }
}
