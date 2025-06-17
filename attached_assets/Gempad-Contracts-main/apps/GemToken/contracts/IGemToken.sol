// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ISkyToken {
    function mint(address to, uint256 amount) external;
    function pause() external;
    function unpause() external;
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 value) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 value) external returns (bool);
    function transferFrom(address from, address to, uint256 value) external returns (bool);
    function increaseAllowance(address spender, uint256 addedValue) external returns (bool);
    function decreaseAllowance(address spender, uint256 subtractedValue) external returns (bool);
    function burn(uint256 amount) external;
    function burnFrom(address account, uint256 amount) external;
    function isPaused() external view returns (bool);
    function cap() external view returns (uint256);
    function addMinter(address account) external;
    function renounceMinter() external;
    function revokeMinter(address account) external;
    function grantRole(bytes32 role, address account) external;
    function revokeRole(bytes32 role, address account) external;
    function hasRole(bytes32 role, address account) external view returns (bool);
}

