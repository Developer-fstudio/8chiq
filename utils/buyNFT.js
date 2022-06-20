
import axios from 'axios'

export async function buyNFT(web3, nftContract, marketContract, address, tokenId, price) {


  console.log('masuk ke buy')
  // console.log(marketContract.methods)
  price = web3.utils.toWei(price)
  console.log(web3)
  console.log(nftContract.options.address)
  console.log(address.data)
  console.log(tokenId)
  console.log(price)
  const data = await marketContract.methods.createMarketSale(nftContract.options.address, tokenId).send({from: address.data, value: price})
  console.log('transaksi nya cussss')
  console.log(data)
  return data;
}