// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;
//Libraries are similar to contracts, but you can't declare any state variable and you can't send ether.
//A library is embedded into the contract if all library functions are internal.
//and it can be used as internal function example: msg.value.getPrice()
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    function getPrice(
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        (, int256 price, , , ) = priceFeed.latestRoundData(); //(,var,,,) take only value of varible if function returns more than 1 value
        return uint256(price * 1e10); //unit256(int ..etc) transforme int into unit256
    }

    function getConversionRate(
        uint256 ethAmount,
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        uint256 ethPrice = getPrice(priceFeed);
        uint256 ethAmountInUsd = (ethPrice * ethAmount) / 1e18; //returns how much usd
        return ethAmountInUsd;
    }
}
