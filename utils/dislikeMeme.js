
export async function dislikeMeme(marketContract, address, tokenId) {


    console.log('masuk ke dislike')
    // console.log(marketContract.methods)
    // price = web3.utils.toWei(price)
    const data = await marketContract.methods.dislikeMeme(tokenId).send({from: address.data})
    console.log('transaksi nya cussss (dislike)')
    console.log(data)
    return data;
  }