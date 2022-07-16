import Head from 'next/head'
import { BaseLayout } from '@components/ui/layout'
import { useWalletInfo } from '@components/hooks/web3'
import { MarketHeader, StoreCard, StoreList } from '@components/ui/store'
import { OrderModal } from '@components/ui/order'
import { useEthPrice } from '@components/hooks/useEthPrice'
import { useWeb3 } from '@components/provider'
import {useEffect, useState} from 'react'
import { buyNFT } from '@utils/buyNFT'
import { getOnSaleMemes } from '@content/fetcherOnSale'
import Image from "next/image"
import { Loader } from "@components/ui/common"
import { likeMeme } from '@utils/likeMeme'
import { dislikeMeme } from '@utils/dislikeMeme'


export default function Marketplace() {

    const [selectedMeme, setSelectedMeme] = useState(null)
    const { account, network, canPurchaseMeme } = useWalletInfo()
    const { eth } = useEthPrice()
    const { web3, isLoading, marketContract, requireInstall } = useWeb3()
    const [memes, setMemes] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')
  

    useEffect(()=> {
      if (!isLoading) {
        console.log(marketContract)
        loadNFTs()
      } 
    }, [isLoading, canPurchaseMeme, account.data , network.isSupported])

    // useEffect(()=> {
    //   if (!isLoading) {
    //     setLoadingState('loaded')
    //   } 
    // }, [memes])


    async function loadNFTs() {
      if (requireInstall) {
        console.log("sempet masuk sini? karena require install")
        setLoadingState('loaded')
        return
      }
      
      if (!network.isSupported && network.data != null) {
        console.log("sempet masuk sini? karena network is supported")
        console.log(network)
        setLoadingState('loaded')
        return
      }
      console.log("load NFT jalan yuk")
      const { data } = await getOnSaleMemes(web3, marketContract, account)
      setMemes(data)
      setLoadingState('loaded')
    }

    const purchaseMeme = async (order, tokenId) => {
      // alert(JSON.stringify(order))
      setSelectedMeme(null)
      setLoadingState('buying')
      const { data } = await buyNFT(web3, marketContract, account, tokenId, order.price)
      console.log('purchased')
      console.log(data)
      setLoadingState('loaded')
      loadNFTs()


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

    <div className='mx-auto px-4 py-4 max-w-7xl'>
      <MarketHeader/>
    </div>

    

    


        {/* recent properties section */}
        {  (loadingState === 'loaded' && !memes.length) ? 
            (requireInstall || !network.isSupported) ? 
           <h1 className='px-20 py-7 text-4x1'>Please Install Metamask or Changed to Goerli Test Network</h1> : <h1 className='px-20 py-7 text-4x1'>No NFts in marketplace</h1> :
            loadingState === 'not-loaded' ? 
            <div className="w-full flex justify-center">
              <Loader/>
            </div> :
            <StoreList memes={memes}>

              {/* Memes Cards */}

                {meme =>
                  <StoreCard
                    key={meme.id}
                    meme={meme}
                    disabled={!canPurchaseMeme}
                    disabledButton={(!canPurchaseMeme || loadingState === "liking" || isLoading)}
                    onClickButton={() => likeOrDislike(meme.id)}
                    onClickDislikeButton={() => likeOrDislike(meme.id, false)}
                    loadingStateButton={loadingState}                   
                    Footer = { () =>
                      <div className='inline-block px-4 pb-5 content-end'>
                        <div className='font-medium text-base mb-2 flex items-center'>
                          <Image
                            layout="fixed"
                            height="25"
                            width="25"
                            src="/static/images/small-eth.webp"
                          />
                          {meme.price} Eth 
                        </div>
                        <button 
                          onClick= {() => setSelectedMeme(meme)}
                          className="inline-block bg-purple-500 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-md px-6 py-1 font-bold text-white mr-2 mb-2"
                          disabled={(!canPurchaseMeme || meme.onSale === false || loadingState === "buying")}
                          >
                          { loadingState === "buying" ?
                            <div className="w-full flex justify-center m-1">
                              <Loader/>
                            </div> : <div className='m-1'>Buy</div>
                          }
                        </button>
                      </div>
                    }
                  />
              }
          </StoreList>
           }
        


        { selectedMeme &&
        <OrderModal
          onSubmit={purchaseMeme}
          meme={selectedMeme}
          onClose={() => setSelectedMeme(null)}
        />
      }
        {/* end cards section */}


    </div>
  )
}

// export function getStaticProps({params}) {
//   const { web3, nftContract, marketContract } = useWeb3()
//   const { data } = await getAllMemes( web3, nftContract, marketContract)
  
//   return {
//     props: {
//       memes: data
//     }
//   }
// }

Marketplace.Layout = BaseLayout
