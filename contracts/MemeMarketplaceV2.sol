//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// we will brin in the openzeppelin ERC721 NFT functionality

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
// security against transactions for multiple request
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';

contract MemeMarketplaceV2 is ERC721URIStorage, ReentrancyGuard {
    using Counters for Counters.Counter;
    //counter allow us to keep track of tokenIds
    Counters.Counter private _tokenIds;


    /* number of items minting, number of transactions, token that have not been sold
    keep track of tokens total number - tokenId
    arrays need to know the lentgth - help to keep track for arrays */

    Counters.Counter private _tokensSold;
    uint256 totalEthSold = 0;

    // determine who is the owner of the contract
    // charge a listing fee so the owner makes a commission

    address immutable i_contractOwner;
    // we are deploying to matic the API is the same so you can use ether the same as matic
    // they both have 18 deimal
    // mind the matic vs ether price!
    uint256 constant LISTING_PRICE = 0.025 ether;

    //OBJ: give the NFT market the ability to transact tokens or change ownership
    // setApprovalForAll allow us to do that with contract address

    // constructor set up our address
    constructor() ERC721 ('8Chiq Memes', '8Chiqs') {
        i_contractOwner = payable(msg.sender);
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
        uint category;
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
        return LISTING_PRICE;
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
    // function getOwner(uint tokenId) public view returns (address) {
    //     return IERC721(address(this)).ownerOf(tokenId);
    // }

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

    function mintToken(uint256 newItemId, string memory tokenURI) public returns(uint) {
        // _tokenIds.increment();
        // uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        // set the token URI: id and url
        _setTokenURI(newItemId, tokenURI);
        // give the marketplace the approval to transact between users
        setApprovalForAll(address(this), true);
        // mint the token and set it for sale - return the id to do so
        return newItemId;
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
        uint tokenId,
        uint price,
        string memory tokenURI,
        uint category
    ) 
    public payable nonReentrant {
        // nonReentrant is a modifier to prevent reentry attack

        require(price > 0, 'Price must be at least one wei');
        require(msg.value >= LISTING_PRICE, 'transaction value must be equal to listing price');
        uint itemId;
        // // approve marketplace
        // IERC721(nftContract).approve(address(this),tokenId); 
 

        if (isTokenExists(tokenId)) {
            // this mean token exist in marketplace before
            address ownerNow = ownerOf(tokenId);
            require(payable(msg.sender) == ownerNow, 'You cannot manage this NFTs');
            // update the status of the item
            idToMarketToken[tokenId].seller = payable(msg.sender);
            idToMarketToken[tokenId].owner = payable(address(0));
            idToMarketToken[tokenId].price = price;
            idToMarketToken[tokenId].sold = false;
            itemId = tokenId;
          
        } else {
            // this mean token is new in market place
            _tokenIds.increment();
            itemId = _tokenIds.current();
            mintToken(itemId, tokenURI);

            //putting it up for sale - bool - no owner
            MarketToken storage m = idToMarketToken[itemId];
            m.itemId = itemId;
            m.nftContract = address(this);
            m.tokenId = itemId;
            m.seller = payable(msg.sender);
            m.owner = payable(address(0));
            m.minter = payable(msg.sender);
            m.price = price;
            m.sold = false;
            m.isExist = true;
            m.timeCreated = block.timestamp;
            m.category = category;

        }

        //NFT transaction
        IERC721(address(this)).transferFrom(msg.sender, address(this), itemId);

        emit MarketTokenMinted(
            itemId, 
            address(this), 
            itemId, 
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
        uint tokenId,
        string memory tokenURI,
        uint category
    ) 
    public payable nonReentrant {
        // nonReentrant is a modifier to prevent reentry attack

        // require(price > 0, 'Price must be at least one wei');
        // require(msg.value > listingPrice, 'transaction value must be equal to listing price');
        uint itemId;

        // require(msg.value >= listingPrice, 'transaction value must be equal to listing price');

        if (isTokenExists(tokenId)) {
            // this mean token exist in marketplace before
            
            address ownerNow = ownerOf(tokenId);
            require(payable(msg.sender) == ownerNow, 'You cannot manage this NFTs');

            idToMarketToken[tokenId].seller = payable(msg.sender);
            idToMarketToken[tokenId].owner = payable(msg.sender);
            idToMarketToken[tokenId].price = 0; 
            idToMarketToken[tokenId].sold = true;
            itemId = tokenId;
          
        } else {
            // this mean token is new in market place
            _tokenIds.increment();
            itemId = _tokenIds.current();
            mintToken(itemId, tokenURI);

            // referencing differently because of mapping inside struct
            MarketToken storage m = idToMarketToken[itemId];
            m.itemId = itemId;
            m.nftContract = address(this);
            m.tokenId = itemId;
            m.seller = payable(msg.sender);
            m.owner = payable(msg.sender);
            m.minter = payable(msg.sender);
            m.price = 0;
            m.sold = true;
            m.isExist = true;
            m.timeCreated = block.timestamp;
            m.category = category;

        }

        emit MarketTokenMinted(
            itemId, 
            address(this), 
            itemId, 
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
        uint tokenId
    )
    public payable nonReentrant {
        uint price = idToMarketToken[tokenId].price;
        uint currTokenId = idToMarketToken[tokenId].tokenId;

        require(payable(msg.sender) != idToMarketToken[currTokenId].seller, 'You cannot buy your own NFT');

        require(msg.value == price, 'Please submit the asking price in order to continue');

        // transfer the amount to the seller
        idToMarketToken[currTokenId].seller.transfer(msg.value);

        // transfer the token from contract address to the buyer
        IERC721(address(this)).transferFrom(address(this), msg.sender, tokenId);

        setApprovalForAll(address(this), true);
        _tokensSold.increment();
        totalEthSold += price;
        idToMarketToken[currTokenId].owner = payable(msg.sender);
        idToMarketToken[currTokenId].seller = payable(msg.sender);
        idToMarketToken[currTokenId].sold = true;
        idToMarketToken[currTokenId].price = 0;

        payable(i_contractOwner).transfer(LISTING_PRICE);

    }

    // function to cancel NFT listing

    function cancelMarketSale(
        uint tokenId
    )
    public payable nonReentrant {

        // uint price = idToMarketToken[tokenId].price;
        uint currTokenId = idToMarketToken[tokenId].tokenId;

        // address ownerNow = IERC721(nftContract).ownerOf(tokenId);
        require(payable(msg.sender) == idToMarketToken[currTokenId].seller, 'You cannot manage this NFTs');

        // transfer the token from contract address to the owner back
        IERC721(address(this)).transferFrom(address(this), msg.sender, tokenId);
        idToMarketToken[currTokenId].owner = payable(msg.sender);
        idToMarketToken[currTokenId].seller = payable(msg.sender);
        idToMarketToken[currTokenId].sold = true;
        idToMarketToken[currTokenId].price = 0;


        // transfer back the listing price
        idToMarketToken[currTokenId].seller.transfer(LISTING_PRICE);

    }

    //function to fetchMarketItems - minting, buying and selling
    // return the number of unsold items

    function fetchMarketTokens() public view returns(MarketToken[] memory) {
        uint itemCount = _tokenIds.current();
        // uint unsoldItemCount = itemCount - _tokensSold.current();
        uint currentIndex = 0;
        uint checkingIndex = 0;

        // looping over the number of items created (if number has not been sold populate the array) 
        //  MarketToken[] memory items = new MarketToken[](itemCount);
        MarketToken[] memory items = new MarketToken[](itemCount);
        while (checkingIndex < itemCount) {
            
            if (idToMarketToken[checkingIndex + 1].isExist == true) {
                uint currentId = checkingIndex + 1;
                MarketToken storage currentItem = idToMarketToken[currentId];
                if (currentItem.owner == payable(address(0)) && currentItem.isExist == true) {
                    items[currentIndex] = currentItem;
                    currentIndex += 1;
                }

            }
            checkingIndex +=1;
        }
        return items;
    }

    // return nfts that the user has purchased

    function fetchMyNFTs() public view returns (MarketToken[] memory) {
        uint totalItemCount = _tokenIds.current();
        // a second counter for each individual user
        uint currentIndex = 0;
        uint checkingIndex = 0;
        uint itemCount = 0;

        for (uint i = 0; i < totalItemCount; i++) {
            if(idToMarketToken[i + 1].owner == msg.sender || idToMarketToken[i + 1].seller == msg.sender) {
                
                 if (idToMarketToken[i + 1].isExist == true) {
                    itemCount += 1;
                }               
            }
        }


        MarketToken[] memory items = new MarketToken[](itemCount);
        while (checkingIndex < totalItemCount) {
            if (idToMarketToken[checkingIndex + 1].owner == msg.sender || idToMarketToken[checkingIndex + 1].seller == msg.sender) {
                uint currentId = checkingIndex + 1;
                // current array
                MarketToken storage currentItem = idToMarketToken[currentId];
                if (currentItem.isExist == true) {
                    items[currentIndex] = currentItem;
                    currentIndex += 1;
                }

            }
            checkingIndex +=1;
        }
        return items;
    }


    function fetchMarketAllTokens() public view returns(MarketToken[] memory) {
        uint itemCount = _tokenIds.current();
        // uint unsoldItemCount = itemCount - _tokensSold.current();
        uint currentIndex = 0;
        uint checkingIndex = 0;

        // looping over the number of items created (if number has not been sold populate the array)
        // MarketToken[] memory items = new MarketToken[](itemCount);
        MarketToken[] memory items = new MarketToken[](itemCount);
        while (checkingIndex < itemCount) {

            uint currentId = checkingIndex + 1;
            MarketToken storage currentItem = idToMarketToken[currentId];
            if (currentItem.isExist == true) {
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
            checkingIndex +=1;
        }
        return items;
    }

     function fetchMarketCategory(
        uint category
     ) 
     public view returns(MarketToken[] memory) {
        uint totalItemCount = _tokenIds.current();
        // uint unsoldItemCount = itemCount - _tokensSold.current();
        uint currentIndex = 0;
        uint checkingIndex = 0;
        uint itemCount = 0;

        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketToken[i + 1].isExist == true && idToMarketToken[i + 1].category == category) {
                itemCount += 1;             
            }
        }


        // looping over the number of items created (if category same, the return)
        MarketToken[] memory items = new MarketToken[](itemCount);
        while (checkingIndex < totalItemCount) {

            uint currentId = checkingIndex + 1;
            MarketToken storage currentItem = idToMarketToken[currentId];
            if (currentItem.isExist == true && currentItem.category == category) {
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
            checkingIndex +=1;
        }
        return items;
    }         

    
}