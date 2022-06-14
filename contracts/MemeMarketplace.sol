//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
// security against transactions for multiple request
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

contract MemeMarketplace is ReentrancyGuard {
    using Counters for Counters.Counter;

    /* number of items minting, number of transactions, token that have not been sold
    keep track of tokens total number - tokenId
    arrays need to know the lentgth - help to keep track for arrays */

    Counters.Counter private _tokenIds;
    Counters.Counter private _tokensSold;

    // determine who is the owner of the contract
    // charge a listing fee so the owner makes a commission

    address payable owner;
    // we are deploying to matic the API is the same so you can use ether the same as matic
    // they both have 18 deimal
    // mind the matic vs ether price!
    uint256 listingPrice = 0.045 ether;

    constructor() {
        //set the owner
        owner = payable(msg.sender);
    }

    // structs can act like objects

    struct MarketToken {
        uint itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        address payable minter;
        uint256 price;
        bool sold;
        bool isExist;
    }

    // tokenId return which marketToken - fetch which one it is

    mapping(uint256 => MarketToken) private idToMarketToken;

    // listen to events from front end applications
    event MarketTokenMinted(
        uint indexed itemId,
        address indexed nftContract,
        uint indexed tokenId,
        address seller,
        address owner,
        address minter,
        uint256 price,
        bool sold,
        bool isExist
    );

    // get the listing price
    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    // check if tokenId exists
        function isTokenExists(uint256 tokenId) public view returns (bool) {
        return idToMarketToken[tokenId].isExist;
    }

    // two functios to interact with contract
    // 1. create a market item to put it up for sale
    // 2. create a market sale for buying and selling between parties

    function makeMarketItem(
        address nftContract,
        uint tokenId,
        uint price
    ) 
    public payable nonReentrant {
        // nonReentrant is a modifier to prevent reentry attack

        require(price > 0, 'Price must be at least one wei');
        require(msg.value > listingPrice, 'transaction value must be equal to listing price');
        uint itemId;

        if (isTokenExists(tokenId)) {
            // this mean token exist in marketplace before
            idToMarketToken[tokenId].seller = payable(msg.sender);
            idToMarketToken[tokenId].owner = payable(address(0));
            idToMarketToken[tokenId].price = price;
            idToMarketToken[tokenId].sold = false;
          
        } else {
            // this mean token is new in market place
            _tokenIds.increment();
            itemId = _tokenIds.current();

            //putting it up for sale - bool - no owner
            idToMarketToken[tokenId] = MarketToken(
                itemId,
                nftContract,
                tokenId,
                payable(msg.sender),
                payable(address(0)),
                payable(msg.sender),
                price,
                false,
                true           
            );
        }


        //NFT transaction
        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        emit MarketTokenMinted(
            itemId, 
            nftContract, 
            tokenId, 
            payable(msg.sender), 
            address(0), 
            payable(msg.sender), 
            price, 
            false,
            true
        );

    }

    // function to conduct transactions and market sales

    function createMarketSale(
        address nftContract,
        uint tokenId
    )
    public payable nonReentrant {
        uint price = idToMarketToken[tokenId].price;
        uint currTokenId = idToMarketToken[tokenId].tokenId;

        require(msg.value == price, 'Please submit the asking price in order to continue');

        // transfer the amount to the seller
        idToMarketToken[currTokenId].seller.transfer(msg.value);

        // transfer the token from contract address to the buyer
        ERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        idToMarketToken[currTokenId].owner = payable(msg.sender);
        idToMarketToken[currTokenId].sold = true;
        _tokensSold.increment();

        payable(owner).transfer(listingPrice);

    }

    //function to fetchMarketItems - minting, buying and selling
    // return the number of unsold items

    function fetchMarketTokens() public view returns(MarketToken[] memory) {
        uint itemCount = _tokenIds.current();
        uint unsoldItemCount = itemCount - _tokensSold.current();
        uint currentIndex = 0;

        // looping over the number of items created (if number has not been sold populate the array)
        MarketToken[] memory items = new MarketToken[](unsoldItemCount);
        for (uint i=0; i < itemCount; i++) {
            if (idToMarketToken[i + 1].owner == address(0)) {
                uint currentId = i + 1;
                MarketToken storage currentItem = idToMarketToken[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    // return nfts that the user has purchased

    function fetchMyNFTs() public view returns (MarketToken[] memory) {
        uint totalItemCount = _tokenIds.current();
        // a second counter for each individual user
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i < totalItemCount; i++) {
            if(idToMarketToken[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }

        MarketToken[] memory items = new MarketToken[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketToken[i + 1].owner == msg.sender) {
                uint currentId = idToMarketToken[i + 1].itemId;
                // current aray
                MarketToken storage currenItem = idToMarketToken[currentId];
                items[currentIndex] = currenItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    //function for returning an array of minted nfts
    function fetchItemsCreated() public view returns(MarketToken[] memory) {
        // insted of owner, it will be the seller
        uint totalItemCount = _tokenIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketToken[i + 1].minter == msg.sender) {
                itemCount += 1;
            }
        }

        MarketToken[] memory items = new MarketToken[](itemCount);

        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketToken[i + 1].seller == msg.sender) {
                uint currentId = idToMarketToken[i + 1].itemId;
                MarketToken storage currentItem = idToMarketToken[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }



}