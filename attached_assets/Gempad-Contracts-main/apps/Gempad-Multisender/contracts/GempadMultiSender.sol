// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '../contracts/interfaces/IGempadMultiSender.sol';

contract GempadMultiSender is Ownable, IGempadMultiSender {
    using SafeERC20 for IERC20;

    event Multisent(address token, uint256 total);

    /**
     * @notice : to receive ethers
     */

    receive() external payable {
        revert();
    }

    /**
     * @notice Send tokens to multiple accounts
     * @param token address to send
     * @param ensureExactAmount enable or disbale
     * @param targets token receivers
     * @param amounts amount to send
     */
    function multisendToken(
        address token,
        bool ensureExactAmount,
        address[] calldata targets,
        uint256[] calldata amounts
    ) external payable override {
        if (token == address(0)) {
            multisendEther(targets, amounts);
        } else {
            require(targets.length == amounts.length, 'Length mismatched');
            IERC20 erc20 = IERC20(token);
            uint256 total = 0;

            // In case people want to make sure they transfer the exact
            // amount of tokens to the recipients (for example, an owner
            // might forget excluding this contract from the transfer fee
            // deduction), use this option as a safeguard
            function(IERC20, address, address, uint256) transfer = ensureExactAmount
                ? _safeTransferFromEnsureExactAmount
                : _safeTransferFrom;

            for (uint256 i = 0; i < targets.length; i++) {
                total += amounts[i];
                transfer(erc20, msg.sender, targets[i], amounts[i]);
            }

            emit Multisent(token, total);
        }
    }

    /**
     * @notice Send ethers to multiple accounts
     * @param targets ether receivers
     * @param amounts amount to send
     */
    function multisendEther(address[] calldata targets, uint256[] calldata amounts) public payable override {
        require(targets.length == amounts.length, 'Length mismatched');

        uint256 total;
        for (uint256 i = 0; i < targets.length; i++) {
            total += amounts[i];
            payable(targets[i]).transfer(amounts[i]);
        }

        // In case someone tries to claim the ether inside the contract
        // by sending a higher sum of total amount than msg.value
        require(total == msg.value, 'Total mismatched');

        emit Multisent(address(0), total);
    }

    /**
     * @notice send ethers balance to given address
     * @param to : ether receiver
     */
    function withdrawWronglySentEther(address to) external onlyOwner {
        payable(to).transfer(address(this).balance);
    }

    /**
     * @notice send ethers balance to given address
     * @param token: token address
     * @param to: token receivers
     */
    function withdrawWronglySentToken(address token, address to) external onlyOwner {
        IERC20(token).safeTransfer(to, IERC20(token).balanceOf(address(this)));
    }

    /**
     * @notice In case people want to make sure they transfer the exact mount of tokens to the recipients
        (for example, an owner might forget excluding this contract from the transfer fee deduction)
        use this option as a safeguard
     * @param token: token address
     * @param from: token sender
     * @param to: token receivers
     * @param amount: amount of token to transfer
     */
    function _safeTransferFromEnsureExactAmount(
        IERC20 token,
        address from,
        address to,
        uint256 amount
    ) private {
        uint256 balanceBefore = token.balanceOf(to);
        token.safeTransferFrom(from, to, amount);
        require(
            token.balanceOf(to) - balanceBefore == (from != to ? amount : 0), // if from is the same as to, the final balance should be the same as before the transfer
            'Not enough tokens were transfered, check tax and fee options or try setting ensureExactAmount to false'
        );
    }

    /**
     * @notice transfer from
     * @param token: token address
     * @param from: token sender
     * @param to: token receivers
     * @param amount: amount of token to transfer
     */
    function _safeTransferFrom(IERC20 token, address from, address to, uint256 amount) private {
        token.safeTransferFrom(from, to, amount);
    }
}
