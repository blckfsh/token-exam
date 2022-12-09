# StreaX Exam

This project is a smart contract that can mint ERC20 tokens
Installation
------------

```
npm install
```
from this directory. It will re-install the `node_modules` folder based on the dependencies on `package.json` file.

How to use?
----------

```
npm run start:local
```
from this directory. It will start the `hardhat` local node.

```
npm run test:coin
```
from this directory. it will run the `coin` test script.
```
npm run deploy:local
```
from this directory. It will deploy the smart contract in `hardhat` local node.

```
npm run deploy:goerli
```
from this directory. It will deploy the smart contract in `goerli` testnet.

```
npm run verify-coin:goerli <contract-address>
```
from this directory. It will verify the smart contract in `goerli` testnet.