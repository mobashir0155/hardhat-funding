import { HardhatRuntimeEnvironment } from "hardhat/types"
import { developmentChains, networkConfig } from "../helper-hardhat-config"
import { verify } from "../utils/verify"

const deployFundme = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts, network } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId!

    let ethUsdPriceFeedAddress
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    }
    else {
        ethUsdPriceFeedAddress = networkConfig[network.name]["ethUsdPriceFeed"]
    }

    const args = [ethUsdPriceFeedAddress]
    const fundMe = await deploy("FundMe", {
        from: deployer,
        log: true,
        args: args,
        waitConfirmations: networkConfig[network.name]["blockConfirmations"] || 2
    })
    log("-------------------------------------")
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(fundMe.address, args)
    }
}
export default deployFundme
deployFundme.tags = ["all", "fundme"]