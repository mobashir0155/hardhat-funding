import { deployments, ethers, network } from "hardhat";
import { FundMe } from "../typechain-types";
import { assert } from "chai";
import { developmentChains } from "../helper-hardhat-config"

developmentChains.includes(network.name) ? describe.skip :
    describe("FundME", async () => {
        let fundMe: FundMe;
        let deployer: string;
        const sendAmount = ethers.parseEther("0.001")
        beforeEach(async () => {
            const accounts = await ethers.getSigners()
            deployer = accounts[0].address
            const deployment = await deployments.get("FundMe")
            fundMe = await ethers.getContractAt("FundMe", deployment.address)
        })

        describe("fund", () => {
            it("Allow people to fund", async () => {
                await fundMe.fund({ value: sendAmount })
                const fundedAmount = await fundMe.s_addressToAmountFunded(deployer)
                console.log("fundedAmount:", fundedAmount)
                assert.equal(fundedAmount, sendAmount)
            })

            it("Should withdraw", async () => {
                await fundMe.withdraw()
                const contractBlance = await ethers.provider.getBalance((await fundMe.getAddress()))
                assert.equal(contractBlance, 0n)
            })
        })
    })