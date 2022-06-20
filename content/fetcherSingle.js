
import axios from 'axios'

export async function getSingleMeme(web3, nftContract, marketContract, address, tokenId) {


  console.log('masuk ke get single meme')
  // console.log(marketContract.methods)
  const data = await marketContract.methods.getSingleMarketToken(tokenId).call()
  console.log("data single market")
  console.log(data)
    const tokenUri = await nftContract.methods.tokenURI(tokenId).call()
    // we want get the token metadata - json 
    const meta = await axios.get(tokenUri)
    let price
    if (data.price === "0") {
      price = "0"
    } else {
      price = web3.utils.fromWei(data.price.toString(), 'ether')
    }

    // calculate in minutes first
    let Difference_In_minutes = Math.round(Difference_In_Time / (1000 * 60))
    let usedTime = `${Difference_In_minutes}m`

    if (Difference_In_minutes> 60) {

      // now calculate in hour
      let Difference_In_hour = Math.round(Difference_In_Time / (1000 * 3600))
      usedTime =`${Difference_In_hour}h`

      if (usedTime > 24) {

        // now calculate in days
        let Difference_In_days = Math.round(Difference_In_Time / (1000 * 3600 * 24))
        usedTime = `${Difference_In_days}d`
      }

    }    

    let item = {
      price,
      id: tokenId,
      seller: data.seller,
      owner: data.owner,
      img: meta.data.image, 
      title: meta.data.name,
      category: meta.data.category,
      onSale : (!data.sold && !(address.data === data.seller)),
      like: "519",
      dislike: "102",
      age: usedTime,
      comment: "297",
      description: meta.data.description
    }

  console.log('ada dong datanya sih')
  console.log(item)
  

  return {
    data: item
  }
}
