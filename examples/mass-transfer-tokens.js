const ContractsContext = require("../index")

module.exports = async function () {
	let context
	let options
	let tokenAddress

	/// First setup: check token presence and setup web3 and the context
	if (web3) {
		const mandatoryContract = artifacts.require("Migrations")
		options = mandatoryContract.defaults()

		context = new ContractsContext(web3, options)
		tokenAddress = (await artifacts.require("BasicToken").deployed()).address
	} else { /// here could be any custom parameters that are needed
		const truffleConfig = require("../truffle")
		const network = truffleConfig.networks["private"]
		const uri = network.network_uri_test
		const tokenHolder = network.provider.address
		options = {
			from: tokenHolder,
			gas: network.gas,
			gasPrice: network.gasPrice,
		}
		context = ContractsContext.withUri(uri, options)
		return
	}

	function SequentialAddressGenerator(seed = 1) {
		seedNumber = seed;

		this.getNextRecepient = () => {
			return {
				address: "0x" + (seedNumber++).toString().padStart(40, "0"), // for web3#v0.2.*
				// address: web3.utils.randomHex(20), // for web3#v1.*
				value: web3.toBigNumber(Math.floor(Math.random()*10000) + 1000), // for web3#v0.2.*
				// value: web3.toBN(Math.floor(Math.random()*10000) + 1000), // for web3#v1.*
			}
		}
	}
	
	/// Create address generator to produce a list of addresses and amounts of tokens
	/// that are supposed to be transferred to them
	const addressGenerator = new SequentialAddressGenerator(1)
	const numberOfRecepients = 10 /// NOTE: could be any positive number
	const recepients = Array.apply(null, {length: numberOfRecepients})
		.map(() => addressGenerator.getNextRecepient())
		.reduce((prev, el) => {
			prev.addresses.push(el.address)
			prev.values.push(el.value)
			return prev
		}, { addresses: [], values: [], })
	
	/// Check if the token address is correct or setup our own token address
	tokenAddress = tokenAddress || "0x" // TODO: mass-transfer compatible token	

	/// Get contract for a provided address and ready to call functions
	const token = context.getMassTransferERC20TokenAt(tokenAddress)

	/// Transfer tokens from tokenHolder to recepients.
	/// Amount of immediate transfers for current options (gasLimit, gasPrice and so on)
	/// could be fetched by using token.massTransfer.call approach. Returned result will be
	/// array of two items [ resultCode, amountOfSuccessfulTransfers, ]
	const tx = await token.massTransfer(recepients.addresses, recepients.values, { 
		from: options.from, 
		gas: options.gas,
		gasPrice: options.gasPrice,
	})
}

