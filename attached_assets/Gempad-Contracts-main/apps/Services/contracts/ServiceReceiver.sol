// SPDX-License-Identifier: MIT

pragma solidity ^0.8.14;

import 'eth-token-recover/contracts/TokenRecover.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

/**
 * @title ServiceReceiver
 * @dev Implementation of the ServiceReceiver
 */
contract ServiceReceiver is TokenRecover {
    mapping(bytes32 => uint256) private _prices;
    mapping(bytes32 => uint256) private _tokenFee;

    event Created(string serviceName, address indexed serviceAddress);

    function pay(string memory serviceName) public payable {
        require(msg.value == _prices[_toBytes32(serviceName)], 'ServiceReceiver: Insufficient fee');
        emit Created(serviceName, _msgSender());
    }

    function getPrice(string memory serviceName) public view returns (uint256) {
        return _prices[_toBytes32(serviceName)];
    }

    function getFee(string memory serviceName) public view returns (uint256) {
        return _tokenFee[_toBytes32(serviceName)];
    }

    function setPrice(string memory serviceName, uint256 amount) public onlyOwner {
        _prices[_toBytes32(serviceName)] = amount;
    }

    /**
     * @notice set fee in bips (3 decimals i,e : 100 = 100000). Apart from sale creat fee.
     * @param serviceName: its a name of service i,e., launchpad, airdrop, fairLaunch etc.
     *  [[ALERT]]: make sure that the service name should match the exact smart contract name.
     * @param _fee: token fee percentage
     */
    function setFee(string memory serviceName, uint256 _fee) public onlyOwner {
        _tokenFee[_toBytes32(serviceName)] = _fee;
    }

    function withdraw(uint256 amount) public onlyOwner {
        payable(owner()).transfer(amount);
    }

    function withdrawToken(address _token, uint256 _amount) public onlyOwner {
        require(_token != address(0), 'Err: Zero Address');
        require(_amount != 0, 'Err: Zero Amount');
        require(IERC20(_token).balanceOf(address(this)) >= _amount, 'Err: Insufficient balance');

        IERC20(_token).transfer(owner(), _amount);
    }

    function _toBytes32(string memory serviceName) private pure returns (bytes32) {
        return keccak256(abi.encode(serviceName));
    }

    receive() external payable {}
}
