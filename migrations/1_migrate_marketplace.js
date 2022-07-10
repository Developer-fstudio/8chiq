const MemeMarketplace = artifacts.require("MemeMarketplace");
const Nft = artifacts.require("NFT");
const MemeMarketplaceV2 = artifacts.require("MemeMarketplaceV2");


module.exports = function (deployer) {
    // Deploy Marketplace, then deploy NFT, passing in Marketplace's newly deployed address

    // deployer.deploy(MemeMarketplace).then(function() {
    //     return deployer.deploy(Nft, MemeMarketplace.address);
    // });  

    deployer.deploy(MemeMarketplaceV2);
};
