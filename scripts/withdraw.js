const { ethers, getNamedAccounts } = require("hardhat");
async function main() {
  const { deployer } = await getNamedAccounts;
  const fundMe = await ethers.getContract("FundMe", deployer);
  console.log("withdrawing Contract...");
  const transactionRespons = await fundMe.withdraw();
  await transactionRespons.wait(1);
  console.log("withdrawed");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
