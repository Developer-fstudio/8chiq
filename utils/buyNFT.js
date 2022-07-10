
import axios from 'axios'

export async function buyNFT(web3, marketContract, address, tokenId, price) {


  console.log('masuk ke buy')
  // console.log(marketContract.methods)
  price = web3.utils.toWei(price)
  console.log(web3)
  console.log(address.data)
  console.log(tokenId)
  console.log(price)
  const data = await marketContract.methods.createMarketSale(tokenId).send({from: address.data, value: price})
  console.log('transaksi nya cussss')
  console.log(data)
  return data;
}