pragma solidity ^0.4.23;


import "../erc20/ERC20.sol";


contract MassTransferERC20 is ERC20 {
	function massTransfer(address[] addresses, uint[] values) external returns (uint errorCode, uint count);
}