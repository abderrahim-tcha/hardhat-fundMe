//staging for testing in testnet units are for localtesting
const { ethers, deployments, getNamedAccounts, network } = require("hardhat");
const { expect, assert } = require("chai");
const { developmentChains } = require("../../helpler-hardhat-config");

//skip this if we on development chain
developmentChains.includes(network.chainId)
  ? describe.skip
  : describe("FundMe", function () {
      let fundMe;
      let deployer;
      const sendValue = ethers.parseEther("0.03"); //1eth worth of wei
      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        fundMe = await ethers.getContract("FundMe", deployer); //last deployed FundMe contract
      });

      it("allows people to fund and withdraw", async function () {
        await fundMe.fund({ value: sendValue });
        await fundMe.withdraw();
        const endingBalance = await ethers.provider.getBalance(fundMe.target);
        assert.equal(endingBalance.toString(), "0");
      });
    });
