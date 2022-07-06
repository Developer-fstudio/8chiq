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
    uint256 totalEthSold = 0;

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
    // structs to hold the comments
    struct Comment {
        address addr;
        string comment;
    }

    // comment, likes and dislikes
    struct TokenLikesComment {
        uint itemId;
        mapping(address => bool) addToLike;
        mapping(address => bool) addToDislike;
        Comment[] comments;
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
        uint timeCreated;
        uint likes;
        uint dislikes;
    }

    // tokenId return which marketToken - fetch which one it is

    mapping(uint256 => MarketToken) private idToMarketToken;

    // tokenId to token likes dislike comment

    mapping(uint256 => TokenLikesComment) private idToTokenLikes;

    // listen to events for front end applications
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

    // listen to events of socials for front end applications
    event TokenSocialEvent(
        uint indexed itemId,
        uint likes,
        uint dislikes
    );

    // get the listing price
    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    // get the total sold
    function getTotalSoldCount() public view returns (uint256) {
        return _tokensSold.current();
    }

    // get the total sold in currency
    function getTotalSold() public view returns (uint256) {
        return totalEthSold;
    }

    function getCount() public view returns (uint) {
        return _tokenIds.current();
    }

    // check the owner of NFTs
    function getOwner(address nftContract, uint tokenId) public view returns (address) {
        return IERC721(nftContract).ownerOf(tokenId);
    }

    // check if tokenId exists
    function getSingleMarketToken(uint256 tokenId) public view returns (MarketToken memory) {
        return idToMarketToken[tokenId];
    }

    // check if tokenId exists
    function isTokenExists(uint256 tokenId) public view returns (bool) {
        return idToMarketToken[tokenId].isExist;
    }

    // function to return all comments
    function getComments(uint tokenId) public view returns (Comment[] memory) {
        return idToTokenLikes[tokenId].comments;
    }

    // function to check if like or dislike or neither
    function getLikeStatus(uint tokenId) public view returns (uint) {

        if (idToTokenLikes[tokenId].addToLike[msg.sender] == true) {
            return 0;
        }

        if (idToTokenLikes[tokenId].addToDislike[msg.sender] == true) {
            return 1;
        }

        return 2;
    }    

    // create function to like a meme
    function likeMeme(uint tokenId) public payable nonReentrant {
        MarketToken storage m = idToMarketToken[tokenId];
        TokenLikesComment storage mLike = idToTokenLikes[tokenId];
        if (mLike.addToLike[msg.sender] == true) {
            mLike.addToLike[msg.sender] = false;
            m.likes-=1;
        } else {
            mLike.addToLike[msg.sender] = true;
            m.likes+=1;
            if (mLike.addToDislike[msg.sender] == true) {
                m.dislikes-=1;
                mLike.addToDislike[msg.sender] = false;
            }
        }
        
        // it is a good practice to emit event after modifying value transaction
        emit TokenSocialEvent(tokenId, m.likes, m.dislikes);
    }

    // create function to dislike a meme
    function dislikeMeme(uint tokenId) public payable nonReentrant {
        MarketToken storage m = idToMarketToken[tokenId];
        TokenLikesComment storage mLike = idToTokenLikes[tokenId];
        if (mLike.addToDislike[msg.sender] == true) {
            mLike.addToDislike[msg.sender] = false;
            m.dislikes-=1;
        } else {
            mLike.addToDislike[msg.sender] = true;
            m.dislikes+=1;
            if (mLike.addToLike[msg.sender] == true) {
                m.likes-=1;
                mLike.addToLike[msg.sender] = false;
            }
        }

        // it is a good practice to emit event after modifying value transaction
        emit TokenSocialEvent(tokenId, m.likes, m.dislikes);
    }

    // create function to adda comment
    function commentMeme(uint tokenId, string calldata comment) public payable nonReentrant {
        TokenLikesComment storage mLike = idToTokenLikes[tokenId];
        mLike.comments.push(Comment(msg.sender, comment));
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
        require(msg.value >= listingPrice, 'transaction value must be equal to listing price');
        uint itemId;
        // // approve marketplace
        // IERC721(nftContract).approve(address(this),tokenId); 
        //NFT transaction
        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

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
            MarketToken storage m = idToMarketToken[tokenId];
            m.itemId = itemId;
            m.nftContract = nftContract;
            m.tokenId = tokenId;
            m.seller = payable(msg.sender);
            m.owner = payable(address(0));
            m.minter = payable(msg.sender);
            m.price = price;
            m.sold = false;
            m.isExist = true;
            m.timeCreated = block.timestamp;
            // idToMarketToken[tokenId] = MarketToken(
            //     itemId,
            //     nftContract,
            //     tokenId,
            //     payable(msg.sender),
            //     payable(address(0)),
            //     payable(msg.sender),
            //     price,
            //     false,
            //     true,
            //     block.timestamp          
            // );
        }


    

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

    // two functios to interact with contract
    // 1. create a market item but not sale

    function makeMarketItemNonSale(
        address nftContract,
        uint tokenId
    ) 
    public payable nonReentrant {
        // nonReentrant is a modifier to prevent reentry attack

        // require(price > 0, 'Price must be at least one wei');
        // require(msg.value > listingPrice, 'transaction value must be equal to listing price');
        uint itemId;
        address ownerNow = IERC721(nftContract).ownerOf(tokenId);
        require(payable(msg.sender) == ownerNow, 'You cannot manage this NFTs');
        // require(msg.value >= listingPrice, 'transaction value must be equal to listing price');

        if (isTokenExists(tokenId)) {
            // this mean token exist in marketplace before
            idToMarketToken[tokenId].seller = payable(msg.sender);
            idToMarketToken[tokenId].owner = payable(msg.sender);
            idToMarketToken[tokenId].sold = true;
          
        } else {
            // this mean token is new in market place
            _tokenIds.increment();
            itemId = _tokenIds.current();

            // referencing differently because of mapping inside struct
            MarketToken storage m = idToMarketToken[tokenId];
            m.itemId = itemId;
            m.nftContract = nftContract;
            m.tokenId = tokenId;
            m.seller = payable(msg.sender);
            m.owner = payable(msg.sender);
            m.minter = payable(msg.sender);
            m.price = 0;
            m.sold = true;
            m.isExist = true;
            m.timeCreated = block.timestamp;

            //putting it up for sale - bool - no owner
            // idToMarketToken[tokenId] = MarketToken(
            //     itemId,
            //     nftContract,
            //     tokenId,
            //     payable(msg.sender),
            //     payable(msg.sender),
            //     payable(msg.sender),
            //     0,
            //     true,
            //     true,
            //     block.timestamp           
            // );
        }


        emit MarketTokenMinted(
            itemId, 
            nftContract, 
            tokenId, 
            payable(msg.sender), 
            address(0), 
            payable(msg.sender), 
            0, 
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
        _tokensSold.increment();
        totalEthSold += price;
        idToMarketToken[currTokenId].owner = payable(msg.sender);
        idToMarketToken[currTokenId].seller = payable(msg.sender);
        idToMarketToken[currTokenId].sold = true;
        idToMarketToken[currTokenId].price = 0;


        // payable(owner).transfer(listingPrice);

    }

    // function to cancel NFT listing

    function cancelMarketSale(
        address nftContract,
        uint tokenId
    )
    public payable nonReentrant {




        // uint price = idToMarketToken[tokenId].price;
        uint currTokenId = idToMarketToken[tokenId].tokenId;

        // address ownerNow = IERC721(nftContract).ownerOf(tokenId);
        require(payable(msg.sender) == idToMarketToken[currTokenId].seller, 'You cannot manage this NFTs');


        // transfer the token from contract address to the owner back
        ERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        idToMarketToken[currTokenId].owner = payable(msg.sender);
        idToMarketToken[currTokenId].seller = payable(msg.sender);
        idToMarketToken[currTokenId].sold = true;
        idToMarketToken[currTokenId].price = 0;
        // _tokensSold.increment();

        // transfer back the listing price
        // idToMarketToken[currTokenId].seller.transfer(listingPrice);

    }

    //function to fetchMarketItems - minting, buying and selling
    // return the number of unsold items

    function fetchMarketTokens() public view returns(MarketToken[] memory) {
        uint itemCount = _tokenIds.current();
        // uint unsoldItemCount = itemCount - _tokensSold.current();
        uint currentIndex = 0;

        // looping over the number of items created (if number has not been sold populate the array)
        MarketToken[] memory items = new MarketToken[](itemCount);
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
            if(idToMarketToken[i + 1].owner == msg.sender || idToMarketToken[i + 1].owner == payable(msg.sender)) {
                itemCount += 1;
            }
        }

        // MarketToken[] memory items = new MarketToken[](itemCount);
        // for (uint i = 0; i < totalItemCount; i++) {
        //     if (idToMarketToken[i + 1].owner == msg.sender || idToMarketToken[i + 1].owner == payable(msg.sender)) {
        //         uint currentId = idToMarketToken[i + 1].itemId;
        //         // current aray
        //         MarketToken storage currenItem = idToMarketToken[currentId];
        //         items[currentIndex] = currenItem;
        //         currentIndex += 1;
        //     }
        // }

        MarketToken[] memory items = new MarketToken[](totalItemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketToken[i + 1].owner == msg.sender || idToMarketToken[i + 1].seller == msg.sender) {
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

    //function to fetchAllItems - 
    // return the number of all items

    function fetchMarketAllTokens() public view returns(MarketToken[] memory) {
        uint itemCount = _tokenIds.current();
        // uint unsoldItemCount = itemCount - _tokensSold.current();
        uint currentIndex = 0;

        // looping over the number of items created (if number has not been sold populate the array)
        MarketToken[] memory items = new MarketToken[](itemCount);
        for (uint i=0; i < itemCount; i++) {

            uint currentId = i + 1;
            MarketToken storage currentItem = idToMarketToken[currentId];
            items[currentIndex] = currentItem;
            currentIndex += 1;
        
        }
        return items;
    }



}