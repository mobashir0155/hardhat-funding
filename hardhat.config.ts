import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy"
import dotenv from "dotenv"
dotenv.config()

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL
const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY || ""
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const COIN_MARKETCAP_API_KEY = process.env.COIN_MARKETCAP_API_KEY

const config: HardhatUserConfig = {
  solidity: { compilers: [{ version: "0.8.8" }, { version: "0.6.6" }] },
  //networks
  defaultNetwork: "hardhat",
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [SEPOLIA_PRIVATE_KEY],
      chainId: 11155111
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337
    }
  },

  //verify
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  },

  //gas reporter
  gasReporter: {
    enabled: true,
    coinmarketcap: COIN_MARKETCAP_API_KEY,
    noColors: true,
    currency: "USD",
    outputFile: "gas-report.txt",
    // token: "ETH"
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
      1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
    },
  },
};

export default config;
