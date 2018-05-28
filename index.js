const Web3 = require("web3")
const contract = require("truffle-contract")

const ERC20Artifact = require("./build/contracts/ERC20")
const BasicTokenArtifact = require("./build/contracts/BasicToken")
const MassTransferERC20Artifact = require("./build/contracts/MassTransferERC20")

const getContractAt = (web3, contractAbi, address, { from, gas, gasPrice, }) => {
	let contract
	try { // try for web3 version 1.*
		contract = new web3.eth.Contract(contractAbi, address, { 
			from: from, 
			gas: gas, 
			gasPrice: gasPrice, 
		})
	}
	catch (e) { // otherwise try for web3 version 0.2.*
		const Scheme = web3.eth.contract(contractAbi)
		contract = Scheme.at(address)	
	}

	return contract
}

/**
 * @class Context creates interface for connecting with 
 * basic smart contracts (ERC20 compatible and other)
 * @param {Web3} web3 web3.js instance
 * @param {object} options options for sending txs from contracts
 */
function Context(web3, options = null) {
	const self = this
	
	this.web3 = web3
	this.options = options || { 
		from: web3.eth.coinbase, 
		gas: 300000, 
		gasPrice: 1
	}

	this.contracts = {
		ERC20: ERC20Artifact,
		BasicToken: BasicTokenArtifact,
		MassTransferERC20: MassTransferERC20Artifact,
	}

	this.getContractAt = (contractAbi, address, options = self.options) => {
		return getContractAt(self.web3, contractAbi, address, options)
	}

	this.getERC20TokenAt = (address, options = self.options) => {
		return getContractAt(self.web3, ERC20Artifact.abi, address, options)
	}
	
	this.getMassTransferERC20TokenAt = (address, options = self.options) => {		
		return getContractAt(self.web3, MassTransferERC20Artifact.abi, address, options)
	}
}

module.exports = Context
module.exports.withUri = (uri, options) => {
	const web3 = new Web3(new Web3.providers.HttpProvider(uri))

	return new Context(web3, options)
}
