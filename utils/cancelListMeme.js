
import axios from 'axios'

export async function canceListNFT(web3, nftContract, marketContract, address, tokenId) {


  console.log('masuk ke cancel listing meme')
  // console.log(marketContract.methods)
  const data = await marketContract.methods.cancelMarketSale(nftContract.options.address, tokenId).send({from: address.data})
  console.log('transaksi nya cussss')
  console.log(data)
  return data;
}