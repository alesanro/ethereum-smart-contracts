const ERC20Artifact = require("./build/contracts/ERC20")
const Web3 = require("web3")

const getContractAt = (web3, contractAbi, address, { from, gas, gasPrice, }) => {
	const contract = new web3.eth.Contract(contractAbi, address, { 
		from: from, 
		gas: gas, 
		gasPrice: gasPrice, 
	})

	return contract
}

module.exports = (uri) => {
	const web3 = new Web3(new Web3.providers.HttpProvider(uri))

	return {
		contracts: {
			ERC20: ERC20Artifact,
		},
		web3: web3,
	}

}

module.exports.getContractAt = getContractAt
module.exports.getERC20TokenAt = (web3, address, options) => {
	return getContractAt(web3, ERC20Artifact.abi, address, options)
}