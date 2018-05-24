const ContractsContext = require("../index")

module.exports = async function () {
	let context
	let options
	let tokenAddress

	if (web3) {
		const mandatoryContract = artifacts.require("Migrations")
		options = mandatoryContract.defaults()

		context = new ContractsContext(web3, options)
		tokenAddress = (await artifacts.require("BasicToken").deployed()).address
	} else {
		const uri = "http://localhost:/8540"
		const tokenHolder = "0x004ec07d2329997267Ec62b4166639513386F32E"
		options = {
			from: tokenHolder,
			gas: 3000000,
			gasPrice: 20
		}
		context = ContractsContext.withUri(uri, options)
		return
	}

	function SequentialAddressGenerator(seed = 1) {
		seedNumber = seed;

		this.getNextRecepient = () => {
			return {
				address: "0x" + (seedNumber++).toString().padStart(40, "0"),
				// address: web3.utils.randomHex(20),
				value: web3.toBigNumber(Math.floor(Math.random()*10000) + 1000),
				// value: web3.toBN(Math.floor(Math.random()*10000) + 1000),
			}
		}
	}
	
	const addressGenerator = new SequentialAddressGenerator(1)
	const numberOfRecepients = 10
	const recepients = Array.apply(null, {length: numberOfRecepients})
		.map(() => addressGenerator.getNextRecepient())
		.reduce((prev, el) => {
			prev.addresses.push(el.address)
			prev.values.push(el.value)
			return prev
		}, { addresses: [], values: [], })

	tokenAddress = tokenAddress || "0x" // TODO: mass-transfer compatible token	
	const token = context.getMassTransferERC20TokenAt(tokenAddress)
	
	console.log(`from: ${JSON.stringify(recepients)}`);
		

	const tx = await token.massTransfer(recepients.addresses, recepients.values, { 
		from: options.from, 
		gas: options.gas,
		gasPrice: options.gasPrice,
	})
	console.log(`${JSON.stringify(tx, null, 4)}`);
	
}

