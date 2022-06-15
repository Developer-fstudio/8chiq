

import memes from "./memes.json"
import axios from 'axios'

export async function getAllMemes(web3, nftContract, marketContract) {


  console.log('masuk ke get data')
  console.log(marketContract.methods)
  const data = await marketContract.methods.fetchMarketAllTokens().call()

  const items = await Promise.all(data.map(async i => {
    console.log('masuk sini ga sih')
    console.log(i)
    const tokenUri = await nftContract.methods.tokenURI(i.tokenId).call()
    // we want get the token metadata - json 
    const meta = await axios.get(tokenUri)
    let price
    if (i.price === "0") {
      price = "0"
    } else {
      price = web3.utils.fromWei(i.price.toString(), 'ether')
    }
    console.log('masuk sini ga sih (2)')
    let item = {
      price,
      id: i.tokenId,
      seller: i.seller,
      owner: i.owner,
      img: meta.data.image, 
      title: meta.data.name,
      category: meta.data.category,
      like: "519",
      dislike: "102",
      age: "1h",
      comment: "297",
      description: meta.data.description
    }
    return item
  }))
  console.log('ada dong datanya sih')
  console.log(items)
  

  return {
    data: items,
    memeMap: items.reduce((a, c, i) => {
      a[c.id] = c
      a[c.id].index = i
      return a
    }, {})
  }
}
