
import axios from 'axios'

export async function getComments(marketContract, address, tokenId) {


  // console.log('masuk ke get data')
  // console.log(marketContract.methods)
  const data = await marketContract.methods.getComments(tokenId).call()
  console.log("data all market")
  console.log(data)
  const items = await Promise.all(data.map(async i => {

    let item = {
      address: i.addr,
      comment: i.comment
    }
    return item
  }))
  

  return {
    data: items,
    memeMap: items.reduce((a, c, i) => {
      a[c.id] = c
      a[c.id].index = i
      return a
    }, {})
  }
}
