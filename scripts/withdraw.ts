import { deployments, ethers } from "hardhat"

async function main() {
    const contractAddress = (await deployments.get("FundMe")).address
    const fundMe = await ethers.getContractAt("FundMe", contractAddress)
    console.log("-------executing withdraw-------")
    const transactionResponse = await fundMe.withdraw()
    await transactionResponse.wait(1)
    console.log("-------done-------")
}

main()
    .then(() => process.exit(0))
    .catch((e) => {
        console.log("Error:", e)
        process.exit(1)
    })