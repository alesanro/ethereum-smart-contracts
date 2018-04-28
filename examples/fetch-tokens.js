const ContractsContext = require("../index")

module.exports = async function () {
	const uri = "https://mainnet.infura.io/"
	const options = {
		from: "0x4a2d3fc1587494ca2ca9cdeb457cd94be5d96a61",
		gas: 3000000,
		gasPrice: 20
	}
	
	const tokenAddresses = [
		"0x7b39940dbac110f1227d37c395675def270afcd7", // EOSG
		"0x6531f133e6deebe7f2dce5a0441aa7ef330b4e53", // TIME
	]

	const context = ContractsContext.withUri(uri, options)
	
	const tokens = []
	for (var tokenAddress of tokenAddresses) {
		const token = context.getERC20TokenAt(tokenAddress)
		tokens.push(token)
		console.log(`
		##################
		## Token '${await token.methods.symbol().call()}':
		## - name: ${await token.methods.name().call()}
		## - totalSupply: ${await token.methods.totalSupply().call()}
		## - decimals: ${await token.methods.decimals().call()}
		`)
	}
}

