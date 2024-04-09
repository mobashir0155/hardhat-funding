import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { deployments, ethers, getNamedAccounts, network } from "hardhat";
import { FundMe, MockV3Aggregator } from "../typechain-types";
import { assert, expect } from "chai";
import { developmentChains } from "../helper-hardhat-config"
!developmentChains.includes(network.name) ? describe.skip :
    describe("FundMe", () => {

        let fundMe: FundMe;
        let deployer: string;
        let mockV3Aggregator: MockV3Aggregator;
        const sendAmount = ethers.parseEther("1")
        beforeEach(async () => {
            deployer = (await getNamedAccounts()).deployer
            await deployments.fixture(["all"])
            const fundmeAddress = (await deployments.get("FundMe")).address
            const mockAddress = (await deployments.get("MockV3Aggregator")).address
            fundMe = await ethers.getContractAt("FundMe", fundmeAddress)
            mockV3Aggregator = await ethers.getContractAt("MockV3Aggregator", mockAddress)
        })

        describe("constructor", async () => {
            it("Set aggregator address", async () => {
                const response = await fundMe.s_priceFeed()
                const aggregatorAddess = await mockV3Aggregator.getAddress()
                assert.equal(response, aggregatorAddess)
            })
        })

        describe("fund", () => {
            it("Should send more Eth", async () => {
                await expect(fundMe.fund()).to.be.revertedWith("You need to spend more ETH!")
            })

            it("Should add amount in address to amount map", async () => {
                await fundMe.fund({ value: sendAmount })
                const response = await fundMe.s_addressToAmountFunded(deployer)
                assert.equal(response, sendAmount)
            })

        })

        describe("withdraw", () => {
            beforeEach(async () => {
                await fundMe.fund({ value: sendAmount })
            })

            it("Withdraw funds as deployer", async () => {
                const startingContractBalance = await ethers.provider.getBalance((await fundMe.getAddress()))
                const startingDeployerBalance = await ethers.provider.getBalance(deployer)

                console.log("startingContractBalance:", startingContractBalance)
                console.log("startingDeployerBalance:", startingDeployerBalance)
                const withdrawAmount = await fundMe.withdraw()
                const transactionReciept = await withdrawAmount.wait(1)
                const gasUsed = transactionReciept?.gasUsed || 0n
                const gasPrice = transactionReciept?.gasPrice || 0n

                const gasCost = gasUsed * gasPrice

                console.log("gasCost:", gasCost)
                const endingContractBalance = await ethers.provider.getBalance((await fundMe.getAddress()))
                const endingDeployerBalance = await ethers.provider.getBalance(deployer)

                console.log("endingContractBalance:", endingContractBalance)
                console.log("endingDeployerBalance:", endingDeployerBalance)
                assert.equal(endingContractBalance, 0n)
                assert.equal((startingContractBalance + startingDeployerBalance).toString(), (endingDeployerBalance + gasCost).toString())
            })

            it("Withdraw funds with multiple funders", async () => {
                //setup
                const accounts = await ethers.getSigners()
                for (let i = 1; i < 6; i++) {
                    const funder = fundMe.connect(accounts[i])
                    await funder.fund({ value: sendAmount })
                }

                const startingContractBalance = await ethers.provider.getBalance((await fundMe.getAddress()))
                const startingDeployerBalance = await ethers.provider.getBalance(deployer)

                //action
                const withdrawAmount = await fundMe.withdraw()
                const transactionReciept = await withdrawAmount.wait(1)
                const gasUsed = transactionReciept?.gasUsed || 0n
                const gasPrice = transactionReciept?.gasPrice || 0n

                const gasCost = gasUsed * gasPrice

                console.log("gasCost:", gasCost)
                const endingContractBalance = await ethers.provider.getBalance((await fundMe.getAddress()))
                const endingDeployerBalance = await ethers.provider.getBalance(deployer)

                //asset
                assert.equal(endingContractBalance, 0n)
                assert.equal((startingContractBalance + startingDeployerBalance).toString(), (endingDeployerBalance + gasCost).toString())
                expect(fundMe.s_funders(0)).to.be.reverted
                for (let i = 1; i < 6; i++) {
                    assert.equal((await fundMe.s_addressToAmountFunded(accounts[i].address)), 0n)
                }

            })

            it("Only owner is allowed to withdraw", async () => {
                const accounts = await ethers.getSigners()
                const connectedAccount = fundMe.connect(accounts[1])
                await expect(connectedAccount.withdraw()).to.be.rejectedWith("FundMe__OnlyOwner")
            })
        })
    })