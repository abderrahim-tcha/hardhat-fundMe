require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();
require("hardhat-gas-reporter");
require("solidity-coverage"); //when you do yarn hardhat coverage : will print what solidity code you arent doing tests for
require("hardhat-deploy");

/** @type import('hardhat/config').HardhatUserConfig */
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHER_SCAN_API_KEY = process.env.ETHER_SCAN_API_KEY;

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    Sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
      blockConfirmations: 5,
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
    },
  },
  sourcify: {
    enabled: true,
  },
  etherscan: {
    apiKey: ETHER_SCAN_API_KEY,
  },
  gasReporter: {
    enabled: true,
    outputFile: "gas-report.txt",
    noColors: true,
    currency: "USD",
    //coinmarketcap: process.env.COINMARKET,
    token: "ethereum",
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    user: {
      default: 1,
    },
  },
  solidity: {
    compilers: [{ version: "0.8.19" }, { version: "0.6.6" }],
  },
};
