/* function deployFunc(hre) {
  console.log("hello world");
}
module.exports.default = deployFunc; */

const {
  networkConfig,
  developmentChains,
} = require("../helpler-hardhat-config");
const { verify } = require("../utils/verify");

const { network } = require("hardhat");

//hre:hardhat run enviorment
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  let ethUsdPriceFeedAdress;
  if (developmentChains.includes(chainId)) {
    //if we in local dev
    //get a mock that we deployed
    const ethUsdAggregator = await deployments.get("MockV3Aggregator");
    ethUsdPriceFeedAdress = ethUsdAggregator.address;
  } else {
    //if we are on a testnet...etc
    ethUsdPriceFeedAdress = networkConfig[chainId]["ethUsdPriceFeed"];
  }

  const args = [ethUsdPriceFeedAdress]; //this args will go in the constroctor in fundMe.sol

  const fundMe = await deploy("FundMe", {
    contract: "FundMe",
    from: deployer,
    args: args, //put price feed address
    log: true,
    waitConfirmation: network.config.blockConfirmations || 1, //how many block should it wait
  });
  /* const deploymentTx = fundMe.deploymentTransaction();
  await deploymentTx.wait(5); */
  if (!developmentChains.includes(chainId) && process.env.ETHER_SCAN_API_KEY) {
    await verify(fundMe.address, args);
  }
  log("--------------------------------------------");
};

//when you run yarn hardhat deploy --tags mocks it run only this
module.exports.tags = ["all", "fundMe"];
