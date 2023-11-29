// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "./priceConverter.sol";
error FundMe__notOwner();

/**@title A contract for crowd funding
 *@author ziada mohamed abd errahim
 *@notice this Contract is a demo a sample funding contract
 *@dev this implements price feeds as our library
 */

//memory constant and imutable varibles dont go to storage so they save gas
contract FundMe {
    using PriceConverter for uint256; //using the libary PriceConverter to give a unit256

    uint256 public constant MINIMUMUSD = 50 * 1e18; //if var is cst use constant to reduce gas used

    address[] private s_funders;
    mapping(address => uint256) private s_adressToAmountFunded; //s stand for storage var

    address private immutable i_owner;
    AggregatorV3Interface private s_priceFeed;

    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    function fund() public payable {
        //pay make the function take crypto

        //require like an if statment
        //second paramater revert: revert all what happend inside the function
        require(
            msg.value.getConversionRate(s_priceFeed) >= MINIMUMUSD,
            "didnt send enough!"
        ); //1e18=1*10**18 the msg.value will be in wei
        //msg.value will be called as the first paramater in getConversionRate()

        s_funders.push(msg.sender);
        s_adressToAmountFunded[msg.sender] = msg.value;
    }

    function withdraw() public onlyOwner {
        for (uint256 i = 0; i < s_funders.length; i++) {
            address funder = s_funders[i];
            s_adressToAmountFunded[funder] = 0;
        }
        s_funders = new address[](0); //reset the funders array to new address array and with 0 objects (0)

        //transfer to msg.sender aka who called the withdraw function==>the balance of this contract
        /* payable (msg.sender).transfer(address(this).balance); */
        /* bool sendSeccess=payable (msg.sender).send(address(this).balance);
       require(sendSeccess,"Send Failed"); */
        (bool callSeccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSeccess, "Call Failed");
    }

    function cheaperWithdraw() public onlyOwner {
        address[] memory funders = s_funders;
        s_funders = new address[](0); //reset the funders array to new address array and with 0 objects (0)
        //mapping cantbe in memory
        for (
            uint256 fundersIndex = 0;
            fundersIndex < funders.length;
            fundersIndex++
        ) {
            address funder = funders[fundersIndex];
            s_adressToAmountFunded[funder] = 0;
        }
        s_funders = new address[](0);
        (bool seccess, ) = i_owner.call{value: address(this).balance}("");
        require(seccess);
    }

    modifier onlyOwner() {
        //when we add the modifier to a fuction
        //like withdraw it will apply the modifier code before the _; then run the function
        //if code under _; will apply the fuction then the modifier code
        /* require(msg.sender == i_owner, "Sender Not The Owner"); */

        //can be like this for gas efficincy
        if (msg.sender != i_owner) {
            revert FundMe__notOwner();
        }
        _;
    }

    receive() external payable {
        //in case someone send cypto withou fund funtion
        fund();
    }

    fallback() external payable {
        fund();
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getFunder(uint256 index) public view returns (address) {
        return s_funders[index];
    }

    function getadressToAmountFunded(
        address funder
    ) public view returns (uint256) {
        return s_adressToAmountFunded[funder];
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }
}
