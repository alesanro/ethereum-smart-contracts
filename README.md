[![npm version](https://badge.fury.io/js/ethereum-smart-contracts.svg)](https://badge.fury.io/js/ethereum-smart-contracts)
[![dependencies Status](https://david-dm.org/alesanro/ethereum-smart-contracts.svg)](https://david-dm.org/alesanro/ethereum-smart-contracts.svg)
[![devDependencies Status](https://david-dm.org/alesanro/ethereum-smart-contracts/dev-status.svg)](https://david-dm.org/alesanro/ethereum-smart-contracts?type=dev)
# Common information

This package provides an ability to access and use basic smart contracts without any need to compile them manually.

### List of provided smart contract interfaces:
- ERC20
- _to be continued..._

## Usage 

First of all, import a module
```javascript
const ContractsContext = require("ethereum-smart-contracts")
```

Then there might be two ways:
- load it with node uri
```javascript
const context = ContractsContext.withUri("https://mainnet.infura.io/", options)
```
- or inject `web3` instance directly
```javascript
const context = new ContractsContext(web3, options)
```

> `options` parameter should have the next layout: [see parameter `options` structure](https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#parameters). `from`, `gas` and `gasPrice` are needed to be provided, `data` is optional. 


After initial setup contracts are available to use them.
For example, to load any `ERC20`-token (let use EOS token address) you need to do
```javascript
const tokenAddress = "0x7b39940dbac110f1227d37c395675def270afcd7"
const erc20Token = context.getERC20TokenAt(tokenAddress)
```

```javascript
// to get token's total supply
const totalSupply = await erc20Token.methods.totalSupply().call()
console.log(`#> totalSupply = ${totalSupply}`)
```

```javascript
// or if you want to get user's token balance
const userAddress = "0x00000000000000000000000000000000000000b1"
const balanceOf = await erc20Token.methods.balanceOf(userAddress).call()
console.log(`#> user balance (${userAddress}) = ${balanceOf}`)
```