import Head from 'next/head'
import Image from 'next/image'
import { getAllMemes } from "@content/fetcher"
import { MemeList, MemeCard } from '@components/ui'
import { BaseLayout } from '@components/ui/layout'
import { useWeb3 } from '@components/provider'
import {useEffect, useState} from 'react'
import { useWalletInfo } from '@components/hooks/web3'
import { Loader } from "@components/ui/common"
import { likeMeme } from '@utils/likeMeme'
import { dislikeMeme } from '@utils/dislikeMeme'


export default function Home() {

  const [memes, setMemes] = useState([])
  const { web3, isLoading, marketContract, requireInstall } = useWeb3()
  const [loadingState, setLoadingState] = useState('not-loaded')
  const { account, network, canPurchaseMeme } = useWalletInfo()

  // console.log(marketContract)
  // console.log(nftContract)
  // console.log("anjing")
  
 
  useEffect(()=> {
    if (!isLoading) {
      console.log(marketContract)
      // console.log(nftContract)
      loadNFTs()
    } 
  }, [isLoading, canPurchaseMeme, account.data, network.isSupported])

  async function loadNFTs() {
    if (requireInstall || !network.isSupported) {
      setLoadingState('loaded')
      return
    }
    const { data } = await getAllMemes(web3, marketContract, account)
    setMemes(data)
    console.log('masuk sini')
    console.log(memes)
    setLoadingState('loaded')
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
    loadNFTs()
  }
  
  async function getLikeStatus(tokenId) {
    return await marketContract.methods.getLikeStatus(tokenId).call()
  }

  
  return (
    <div>
      <Head>
        <title>8Chiq : Actually Funny NFTs!</title>
        <meta name="description" content="Prime properties" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        {/* recent properties section */}

        {  (loadingState === 'loaded' && !memes.length) ? 
            (requireInstall || !network.isSupported) ? 
           <h1 className='px-20 py-7 text-4x1'>Please Install Metamask or Changed to Goerli Test Network</h1> : <h1 className='px-20 py-7 text-4x1'>No NFts in marketplace</h1> :
           loadingState === 'not-loaded' ? 
            <div className="w-full flex justify-center">
              <Loader/>
            </div> :
            <MemeList memes={memes}>

              {/* Memes Cards */}

              {meme =>
            <MemeCard
              key={meme.id}
              meme={meme}
              disabledButton={(!canPurchaseMeme || loadingState === "liking" || isLoading)}
              onClickButton={() => likeOrDislike(meme.id)}
              onClickDislikeButton={() => likeOrDislike(meme.id, false)}
              loadingStateButton={loadingState}
              // Like = { () =>
              //   <button 
              //     className={`inline-block rounded-lg px-4 py-1 font-bold  md:text-md text-xs sm:text-sm mr-2 mb-2 border-2 flex items-center ${getLikeStatus(meme.id) == 2 ? "text-gray-400 border-gray-300"  : "text-green-500 border-green-400"} `}
              //     disabled={(!canPurchaseMeme || loadingState === "liking" || isLoading)}
              //     onClick={() => likeOrDislike(meme.id)}>
              //       <img className='w-4 h-4 md:w-6 md:h-6 mr-2' src="/static/images/thumb_up_purple_wght400.svg" alt=""></img>
                  
              //          { loadingState === "liking" ?
              //           <div className="w-full flex justify-center m-1">
              //             <Loader/>
              //           </div> : <div>{meme.like}</div>
              //         }
              //   </button>
                // <div className='inline-block px-4 pb-5 content-end'>
                //   <div className='font-medium text-base mb-2 flex items-center'>
                //     <Image
                //       layout="fixed"
                //       height="25"
                //       width="25"
                //       src="/static/images/small-eth.webp"
                //     />
                //     {meme.price} Eth 
                //   </div>
                //   <button 
                //     onClick= {() => setSelectedMeme(meme)}
                //     className="inline-block bg-purple-500 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-md px-6 py-1 font-bold text-white mr-2 mb-2"
                //     disabled={(!canPurchaseMeme || meme.onSale === false || loadingState === "buying")}
                //     >
                //     { loadingState === "buying" ?
                //       <div className="w-full flex justify-center m-1">
                //         <Loader/>
                //       </div> : <div className='m-1'>Buy</div>
                //     }
                //   </button>
                // </div>
              // }
            />
            }


            </MemeList>
        }
        {/* end cards section */}


    </div>
  )
}

// export async function getStaticProps({params}) {
//   const { web3, nftContract, marketContract } = useWeb3()
//   const { data } = await getAllMemes( web3, nftContract, marketContract)
  
//   return {
//     props: {
//       memes: data
//     }
//   }
// }

Home.Layout = BaseLayout
