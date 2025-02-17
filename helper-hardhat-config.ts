export interface networkConfigItem {
    ethUsdPriceFeed?: string
    blockConfirmations?: number
}

export interface networkConfigInfo {
    [key: string]: networkConfigItem
}
export const networkConfig: networkConfigInfo = {
    sepolia: {
        ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
        blockConfirmations: 6
    },
    hardhat: {
        blockConfirmations: 1
    }
}

export const developmentChains = ["hardhat", "localhost"]