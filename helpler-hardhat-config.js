const networkConfig = {
  11155111: {
    name: "sepolia",
    ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
  },
  5: {
    name: "goerli",
    ethUsdPriceFeed: "0xd4a33860578de61dbabdc8bfdb98fd742fa7028e",
  },
};
const developmentChains = [31337, "localhost"];
const DECIMALES = 8; //how many 0s to add
const INITIAL_ANSWER = 200000000000; //custom price of eth for local dev
module.exports = {
  networkConfig,
  developmentChains,
  DECIMALES,
  INITIAL_ANSWER,
};
