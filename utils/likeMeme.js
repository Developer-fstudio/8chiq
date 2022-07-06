
export async function likeMeme(marketContract, address, tokenId) {


  console.log('masuk ke like')
  // console.log(marketContract.methods)
  // price = web3.utils.toWei(price)
  const data = await marketContract.methods.likeMeme(tokenId).send({from: address.data})
  console.log('transaksi nya cussss (like)')
  console.log(data)
  return data;
}