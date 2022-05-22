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
    string[] photographs;
  }

  mapping (address => Account) private accounts;
  mapping (string => Photograph) private all_photographs;
  string[] private all_photograph_uuids;

  function publishPhotograph(Photograph calldata photograph) public {
    all_photographs[photograph.image_cid] = photograph;
    all_photograph_uuids.push(photograph.image_cid);
    accounts[msg.sender].photographs.push(photograph.image_cid);
  }

  function getPhotographs(address account) public view returns (Photograph[] memory){
    Photograph[] memory photographs = new Photograph[](accounts[account].photographs.length);
    for (uint i=0; i < accounts[account].photographs.length; i++){
      photographs[i] = all_photographs[accounts[account].photographs[i]];
    }
    return photographs;
  }

  function updateAccount(string calldata account_metadata_cid) public {
    accounts[msg.sender].account_metadata_cid = account_metadata_cid;
  }

  function getAccount(address account) public view returns (Account memory){
    return accounts[account];
  }

}