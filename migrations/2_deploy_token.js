var BasicToken = artifacts.require("BasicToken");

module.exports = function(deployer) {
	const INITIAL_AMOUNT = web3.toBigNumber("330005173000000000000000000")
	const TOKEN_SYMBOL = "CAV"
	const TOKEN_NAME = "Caviar"
	const DECIMALS = 18

	deployer.deploy(BasicToken, INITIAL_AMOUNT, TOKEN_NAME, DECIMALS, TOKEN_SYMBOL);
};
