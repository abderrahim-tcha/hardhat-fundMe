//mocks is like deplucating a contract from a real blockchain network
const { network } = require("hardhat");
const {
  developmentChains,
  DECIMALES,
  INITIAL_ANSWER,
} = require("../helpler-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  if (developmentChains.includes(chainId)) {
    log("--------------------------------------------------------");
    console.log("localnetwork detected! deploying mocks");
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      log: true,
      args: [DECIMALES, INITIAL_ANSWER],
    });
    log("mock deployed");
    log("--------------------------------------------------------");
  }
};

module.exports.tags = ["all", "mocks"]; //when you run yarn hardhat deploy --tags mocks
