import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, ContractFactory, BigNumber } from "ethers";

describe("MyCoin", async () => {
    let Coin: ContractFactory;
    let coin: Contract;
    let signers: SignerWithAddress[] = [];
    let owner: SignerWithAddress;
    let signer1: SignerWithAddress;
    let signer2: SignerWithAddress;
    let signer3: SignerWithAddress;
    let signer4: SignerWithAddress;
    let newOwner: SignerWithAddress;

    // constant variable (pre-set)
    let NAME: string = "MyCoin";
    let SYMBOL: string = "MYC";
    let MINT_AMOUNT: number = 1000000;
    let ALLOWANCE = 100000;

    before(async () => {
        // Get signers
        [owner, signer1, signer2, signer3, signer4, newOwner] = await ethers.getSigners();

        // Deploy the Coin Smart Contract
        Coin = await ethers.getContractFactory("Coin");
        coin = await Coin.deploy(NAME, SYMBOL);
        await coin.deployed();
    })

    describe("Getters: Overall", async () => {
        it("Should be able to verify the name of smart contract", async () => {
            expect(await coin.name()).to.equal(NAME);
        })

        it("Should be able to verify the symbol of smart contract", async () => {
            expect(await coin.symbol()).to.equal(SYMBOL);
        })

        it("Should be able to verify correct owner", async () => {
            expect(await coin.owner()).to.equal(owner.address);
        })

        it("Should be able to verify the decimal", async () => {
            expect(await coin.decimals()).to.equal(18);
        })
    })

    // SETTERS: Happy Path
    describe("Setters: Minting Coins", async () => {
        it("Should be able to mint coin", async () => {
            await coin.connect(owner).mint(owner.address, MINT_AMOUNT);
        })

        it("Should be able to get the correct balance", async () => {
            let balance: BigNumber = ethers.utils.parseEther(MINT_AMOUNT.toString());
            expect(await coin.balanceOf(owner.address)).to.equal(balance.toString());
        })

        it("Should be able to get the correct total supply", async () => {
            let supply: BigNumber = ethers.utils.parseEther(MINT_AMOUNT.toString());            
            expect(await coin.totalSupply()).to.equal(supply.toString());
        })
    })

    // Inherited Functions
    describe("Inherited: transfer tokens", async () => {
        it("Should be able to approve and transfer tokens", async () => {
            let balance: BigNumber = await coin.balanceOf(owner.address);

            // Approve signer1 to be spender of owner's token
            let transferAmount: number = MINT_AMOUNT / 2;
            await coin.connect(owner).approve(signer1.address, ethers.utils.parseEther(transferAmount.toString()));

            // Get Allowance
            let allowance: BigNumber = await coin.allowance(owner.address, signer1.address);
            await expect(allowance.toString()).to.equal(ethers.utils.parseEther(transferAmount.toString()));
            
            // Transfer the owner coins to signer2 address via spender
            await coin.connect(signer1).transferFrom(owner.address, signer2.address, ethers.utils.parseEther(transferAmount.toString()));

            // Check signer2 balance
            await expect(await coin.balanceOf(signer2.address)).to.equal(ethers.utils.parseEther(transferAmount.toString()));
        })

        it("Should be able to increase allowance", async () => {
            let increaseAmount: number = ALLOWANCE * 2;
            await coin.connect(owner).increaseAllowance(signer1.address, ethers.utils.parseEther(increaseAmount.toString()));
            let allowance: BigNumber = await coin.allowance(owner.address, signer1.address);
            await expect(allowance.toString()).to.equal(ethers.utils.parseEther(increaseAmount.toString()));
        })

        it("Should be able to decrease allowance", async () => {
            let decreaseAmount: number = ALLOWANCE;
            await coin.connect(owner).decreaseAllowance(signer1.address, ethers.utils.parseEther(decreaseAmount.toString()));
            let allowance: BigNumber = await coin.allowance(owner.address, signer1.address);
            await expect(allowance.toString()).to.equal(ethers.utils.parseEther(decreaseAmount.toString()));
        })
    })
})