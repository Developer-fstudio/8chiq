//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// we will brin in the openzeppelin ERC721 NFT functionality

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    //counter allow us to keep track of tokenIds
    Counters.Counter private _tokenIds;

    //address of marketplace for NFTs to interact
    address contractAddress;

    //OBJ: give the NFT market the ability to transact tokens or change ownership
    // setApprovalForAll allow us to do that with contract address

    // constructor set up our address
    constructor(address marketplaceAddress) ERC721 ('9Chiq Memes', '9Chiqs') {
        contractAddress = marketplaceAddress;
    }

    function mintToken(string memory tokenURI) public returns(uint) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        // set the token URI: id and url
        _setTokenURI(newItemId, tokenURI);
        // give the marketplace the approval to transact between users
        setApprovalForAll(contractAddress, true);
        // mint the token and set it for sale - return the id to do so
        return newItemId;
    }

    
}