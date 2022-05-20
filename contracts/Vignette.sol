//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract Vignette {

  struct Photograph {
    string image_cid;
    string photograph_metadata_cid;
    string copyright;
  }

  struct Account {
    string account_metadata_cid;
    uint photograph_count;
    Photograph[] photographs;
  }

  mapping (address => Account) private accounts;

  function publishPhotograph(Photograph calldata photograph) public {
    accounts[msg.sender].photographs.push(photograph);
    accounts[msg.sender].photograph_count = accounts[msg.sender].photographs.length;
  }

  function getPhotographs(address account) public view returns (Photograph[] memory){
    return accounts[account].photographs;
  }

  function updateAccount(string calldata account_metadata_cid) public {
    accounts[msg.sender].account_metadata_cid = account_metadata_cid;
  }

  function getAccount(address account) public view returns (Account memory){
    return accounts[account];
  }

}