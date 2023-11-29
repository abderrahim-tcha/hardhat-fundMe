const { ethers, deployments, getNamedAccounts } = require("hardhat");
const { expect, assert } = require("chai");
const { developmentChains } = require("../../helpler-hardhat-config");
//skip this if we are not in development chain
!developmentChains.includes(network.chainId)
  ? describe.skip
  : describe("FundMe", function () {
      let fundMe;
      let deployer;
      let MockV3Aggregator;
      const sendValue = ethers.parseEther("0.03"); //1eth worth of wei
      beforeEach(async function () {
        /* const accounts = await ethers.getSigner();
    const account0 = accounts[0]; */
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(["all"]); //deploy all the contracts with tags delared at end of code
        fundMe = await ethers.getContract("FundMe", deployer); //last deployed FundMe contract
        MockV3Aggregator = await ethers.getContract(
          "MockV3Aggregator",
          deployer
        );
      });
      describe("constructor", async function () {
        it("sets the aggregator address correctly", async function () {
          let response = await fundMe.getPriceFeed();
          assert.equal(response, MockV3Aggregator.target);
        });
      });

      describe("fund", async function () {
        it("Fails if you dont send enough ETH", async function () {
          await expect(fundMe.fund()).to.be.revertedWith("didnt send enough!"); //expect the operation to fail
        });

        /* it("Sends a amount of ETH", async function () {
      await fundMe.fund({ value: sendValue }); //expect the operation to fail
    }); */

        it("updated the amount funded data structure", async function () {
          await fundMe.fund({ value: sendValue });
          const response = await fundMe.getadressToAmountFunded(deployer);
          assert.equal(response.toString(), sendValue.toString());
        });

        it("adds funders to funders array", async function () {
          await fundMe.fund({ value: sendValue });
          const funder = await fundMe.getFunder(0);
          assert.equal(funder.toString(), deployer);
        });
      });

      describe("withdraw", async function () {
        beforeEach(async function () {
          await fundMe.fund({ value: sendValue });
        });

        it("should withdraw ETH from a single founder", async function () {
          //get eth amount that the contract have
          const startingFundMeBalance = await ethers.provider.getBalance(
            fundMe.target
          );
          //get eth amount that the deployer have
          const startingDeployerBalance = await ethers.provider.getBalance(
            deployer
          );

          const transactionRespons = await fundMe.withdraw();
          const transactionRecipt = await transactionRespons.wait(1);

          const gasCost =
            transactionRecipt.gasUsed * transactionRecipt.gasPrice;

          const endingFundMeBalance = await ethers.provider.getBalance(
            fundMe.target
          );
          const endingDeployerBalance = await ethers.provider.getBalance(
            deployer
          );

          assert.equal(endingFundMeBalance, 0); //since we withdraw should be epmty
          //and the deployer should get the amount that was in the contract
          assert.equal(
            (startingFundMeBalance + startingDeployerBalance).toString(),
            //gasCost how much gas deployer used for withdrawing
            (endingDeployerBalance + gasCost).toString()
          );
        });

        it("allow us to withdraw with multiple funders", async function () {
          const accounts = await ethers.getSigners();
          for (i = 1; i < 6; i++) {
            const fundMeConnectedContract = await fundMe.connect(accounts[i]);
            await fundMeConnectedContract.fund({ value: sendValue });

            const startingFundMeBalance = await ethers.provider.getBalance(
              fundMe.target
            );
            //get eth amount that the deployer have
            const startingDeployerBalance = await ethers.provider.getBalance(
              deployer
            );

            const transactionRespons = await fundMe.withdraw();
            const transactionRecipt = await transactionRespons.wait(1);

            const gasCost =
              transactionRecipt.gasUsed * transactionRecipt.gasPrice;

            const endingFundMeBalance = await ethers.provider.getBalance(
              fundMe.target
            );
            const endingDeployerBalance = await ethers.provider.getBalance(
              deployer
            );

            assert.equal(endingFundMeBalance, 0); //since we withdraw should be epmty
            //and the deployer should get the amount that was in the contract
            assert.equal(
              (startingFundMeBalance + startingDeployerBalance).toString(),
              //gasCost how much gas deployer used for withdrawing
              (endingDeployerBalance + gasCost).toString()
            );

            await expect(fundMe.getFunder(0)).to.be.reverted;
            for (i = 1; i < 6; i++) {
              assert.equal(
                await fundMe.getadressToAmountFunded(accounts[i].address),
                0
              );
            }
          }
        });

        it("only allow the owner to withdraw", async function () {
          //testing if another person other than deployer can withdraw
          //acount of deployer is accounts[0]
          const accounts = await ethers.getSigners();
          const attacker = accounts[1];
          const attackerConnectedContract = await fundMe.connect(attacker);
          await expect(attackerConnectedContract.withdraw()).to.be.reverted;
        });

        /* it("check founders after withdrawing should be none", async function () {
      await fundMe.withdraw();
      await expect(fundMe.funders(0)).to.be.reverted;
    }); */
      });
    });
