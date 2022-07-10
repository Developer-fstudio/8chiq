import Head from 'next/head'
import Image from 'next/image'
import {MemeDetail} from '@components/ui'
import { BaseLayout } from '@components/ui/layout'
import { getSingleMeme } from '@content/fetcherSingle'
import { useWalletInfo } from '@components/hooks/web3'
import { useWeb3 } from '@components/provider'
import {useEffect, useState} from 'react'
import { useRouter } from 'next/router'
import { buyNFT } from '@utils/buyNFT'
import { OrderModal } from '@components/ui/order'
import { CommentList, CommmentInput, Loader } from "@components/ui/common"
import { likeMeme } from '@utils/likeMeme'
import { dislikeMeme } from '@utils/dislikeMeme'
import CommentCustom from '@components/ui/common/comment'
import { getComments } from '@content/getComments'


export default function Meme() {

  const { account, network, canPurchaseMeme } = useWalletInfo()
  const { web3, isLoading, marketContract } = useWeb3()
  const [meme, setMeme] = useState({})
  const [comments, setComments] = useState({})
  const [isBuy, setBuy] = useState(false)
  const [loadingState, setLoadingState] = useState('not-loaded')
  const [commentState, setcommentState] = useState('not-loaded')
  const router = useRouter()
  const { slug } = router.query


  useEffect(()=> {
    if (!isLoading && web3) {
      console.log(marketContract)
      // console.log(nftContract)
      loadNFT()
    } 
  }, [isLoading, canPurchaseMeme, account.data])

  useEffect(()=> {
    if (loadingState === "loaded") {
      loadComment()
    } 
  }, [meme])

  async function loadNFT() {
    const { data } = await getSingleMeme(web3, marketContract, account, slug)
    setMeme(data)
    console.log('load NFT')
    setLoadingState('loaded')
  }

  async function loadComment() {
    const { data } = await getComments(marketContract, account.data, meme.id)
    setComments(data)
    console.log('load comment')
    setcommentState('loaded')
  }

  const purchaseMeme = async (order, tokenId) => {
    // alert(JSON.stringify(order))
    setBuy(false)
    setLoadingState('buying')
    const { data } = await buyNFT(web3, marketContract, account, tokenId, order.price)
    console.log('purchased')
    console.log(data)
    loadNFT()
    setLoadingState('loaded')
    // setBuy(false)
  }

  const likeOrDislike = async (tokenId, like = true) => {
    // alert(JSON.stringify(order))
    setLoadingState('liking')
    console.log('masuk like or dislike')
    console.log(marketContract)
    const test = await getLikeStatus(tokenId)
    if (like) {

      const { data } = await likeMeme(marketContract, account, tokenId)

    } else {

      const { data } = await dislikeMeme(marketContract, account, tokenId)
      
    }
    setLoadingState('loaded')
    loadNFT()
  }

  async function getLikeStatus(tokenId) {
    return await marketContract.methods.getLikeStatus(tokenId).call()
  }  

  if(loadingState === 'loaded' && meme === {}) return (<h1
    className='px-20 py-7 text-4x1'>No NFts in marketplace</h1>)

  return (
    <div>
      <Head>
        <title>{`8Chiq : ${meme.title}`}</title>
        <meta name="description" content="Prime properties" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      


        {/* recent properties section */}

        {/* cards section */}
        { (loadingState === 'loaded' && meme === {}) ? <h1
           className='px-20 py-7 text-4x1'>you dont own any Meme</h1> :
           loadingState === 'not-loaded' ? 
           <div className="w-full flex justify-center">
             <Loader/>
           </div> :    
          <MemeDetail 
            meme={meme}
            disabledButton={(!canPurchaseMeme || loadingState === "liking" || isLoading)}
            onClickButton={() => likeOrDislike(meme.id)}
            onClickDislikeButton={() => likeOrDislike(meme.id, false)}
            loadingStateButton={loadingState}             
            Footer = { () => 
              <div className='px-4 pb-5'>
              <div className='font-medium text-base mb-2 flex items-center'>
                <Image
                  layout="fixed"
                  height="25"
                  width="25"
                  src="/static/images/small-eth.webp"
                />
                {meme.price !== "0" ? `${meme.price} Eth` : "Not On Sale"} 
              </div>
                <button
                  disabled={(!canPurchaseMeme || meme.onSale === false || loadingState === "buying")}
                  onClick = {() => setBuy(true)}
                  className="inline-block bg-purple-500 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-md px-6 py-1 font-bold text-white mr-2 mb-2">
                  { loadingState === "buying" ?
                    <div className="w-full flex justify-center p-2">
                      <Loader/>
                    </div> : <div className='m-2'>Buy</div>
                  }
                </button>
              </div>} 
          />
        }

        { isBuy &&
          <OrderModal
            onSubmit={purchaseMeme}
            meme={meme}
            onClose={() => setBuy(false)}
          />
        }

        <CommmentInput
        tokenId={meme.id}
        onFinish={()=> loadComment()}/>

        <div className='max-w-4xl mx-auto text-xl text-gray-900 pl-10'>Comments</div>

        {  (commentState === 'loaded' && !comments.length) ? <h1
            className='max-w-4xl mx-auto text-2xl text-gray-900 p-10'>No one comment yet</h1> : 
            commentState === 'not-loaded' ? 
              <div className="w-full flex justify-center">
                <Loader/>
              </div> :
              <CommentList comments={comments}>

                {/* Memes Cards */}

                {(comment, i) =>
                  <CommentCustom
                    key={i}
                    comment={comment}
                  />
                }


              </CommentList>
          }


        
      


        
        {/* end cards section */}


    </div>
  )
}

// export async function getStaticPaths() {
//     const {data} = getAllMemes()

//     return {
//         paths: data.map(m =>({
//             params: {
//                 slug: m.id,
//             }
//         })),
//         fallback: false
//     }

// }

// export function getStaticProps({params}) {
//     const { data } = getAllMemes()
//     const meme = data.filter(m => m.id === params.slug)[0]
//     return {
//       props: {
//         meme: meme
//       }
//     }
//   }

  Meme.Layout = BaseLayout