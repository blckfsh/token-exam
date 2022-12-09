import { Contract, ContractFactory } from "ethers";
import { ethers } from "hardhat";
import fs from "fs";
import args from "../utils/coin";
import contract from "../data/contract.json";

async function main() {
  let Coin: ContractFactory;
  let coin: Contract;

  console.log("Deploying Coin...");
  Coin = await ethers.getContractFactory("Coin");
  coin = await Coin.deploy(args[0], args[1]);
  await coin.deployed();

  let details: any = [{
    coin: coin.address
  }];

  contract.push(details);
  
  fs.writeFile("./data/contract.json", JSON.stringify(details), err => {    
    if (err) throw err; 
  });

  console.log(`MyCoin Smart Contract was deployed to address ${coin.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
