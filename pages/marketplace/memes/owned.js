import Head from 'next/head'
import { BaseLayout } from '@components/ui/layout'
import { useWalletInfo } from '@components/hooks/web3'
import { MarketHeader, StoreCard, StoreList } from '@components/ui/store'
import { OrderModal } from '@components/ui/order'
import { useEthPrice } from '@components/hooks/useEthPrice'
import { useWeb3 } from '@components/provider'
import {useEffect, useState} from 'react'
import { getOwnedMemes } from '@content/fetcherOwned'
import { canceListNFT } from '@utils/cancelListMeme'
import { Loader } from "@components/ui/common"
import { likeMeme } from '@utils/likeMeme'
import { dislikeMeme } from '@utils/dislikeMeme'


export default function Owned() {

    const [selectedMeme, setSelectedMeme] = useState(null)
    const [cancelMeme, setCancelMeme] = useState(null)
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
    }, [isLoading, canPurchaseMeme, account.data])


    async function loadNFTs() {
      if (requireInstall || !network.isSupported) {
        setLoadingState('loaded')
        return
      }
      const { data } = await getOwnedMemes(web3, marketContract, account)
      setMemes(data)
      console.log('masuk sini')
      console.log(memes)
      setLoadingState('loaded')
    }

    // console.log('tes ke sini ga ya')
    // console.log(memes[0])

    const sellMeme = async (order, tokenId) => {
      // alert(JSON.stringify())
      setSelectedMeme(null)
      setLoadingState('selling')
      const price = web3.utils.toWei(order.price)
      let listingPrice = await marketContract.methods.getListingPrice().call()
      console.log("ini price")
      console.log(price)
      let addressOwner = await marketContract.methods.getOwner(tokenId).call()
 
      console.log(addressOwner)
      // approve market first before you can list
      // let approve = await marketContract.methods.setApprovalForAll(marketContract.options.address, true).send({from: account.data})
      // listingPrice = web3.utils.toWei(listingPrice.toString())
      let transaction = await marketContract.methods.makeMarketItem(tokenId, price, "none").send({from: account.data, value: listingPrice})
      loadNFTs()
      setLoadingState('loaded')
    }

    const cancelListMeme = async (order, tokenId) => {
      // alert(JSON.stringify(order))
      setCancelMeme(null)
      setLoadingState('selling')
      const { data } = await canceListNFT(web3, marketContract, account, tokenId)
      console.log('purchased')
      console.log(data)
      loadNFTs()
      setLoadingState('loaded')
    }
    
    const likeOrDislike = async (tokenId, like = true) => {
      // alert(JSON.stringify(order))
      setLoadingState('liking')
      console.log('masuk like or dislike')
      console.log(marketContract)
      
      if (like) {
  
        const { data } = await likeMeme(marketContract, account, tokenId)
  
      } else {
  
        const { data } = await dislikeMeme(marketContract, account, tokenId)
        
      }
      setLoadingState('loaded')
      loadNFTs()
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
                <h1 className='px-20 py-7 text-4x1'>Please Install Metamask or Changed to Goerli Test Network </h1> : <h1 className='px-20 py-7 text-4x1'>you don't own any Meme</h1> :
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
                    Footer = { () => meme.sold ? 
                      <div className='inline-block px-4 pb-5 content-end'>
                        <button 
                          onClick= {() => setSelectedMeme(meme)}
                          className="inline-block bg-purple-500 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-md px-6 py-1 font-bold text-white mr-2 mb-2"
                          disabled={!canPurchaseMeme || loadingState === "selling"}
                          >
                          { loadingState === "selling" ?
                            <div className="w-full flex justify-center m-1">
                              <Loader/>
                            </div> : <div className='m-1'>Sell</div>
                          }
                        </button>
                      </div> :
                      <div className='inline-block px-4 pb-5 content-end'>
                        <button 
                          onClick= {() => setCancelMeme(meme)}
                          className="inline-block bg-purple-500 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-md px-6 py-1 font-bold text-white mr-2 mb-2"
                          disabled={!canPurchaseMeme || loadingState === "selling"}
                          >
                          { loadingState === "selling" ?
                            <div className="w-full flex justify-center m-1">
                              <Loader/>
                            </div> : <div className='m-1'>Cancel Sell</div>
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
            onSubmit={sellMeme}
            meme={selectedMeme}
            onClose={() => setSelectedMeme(null)}
            onBuy={false}
          />
        }

        { cancelMeme &&
          <OrderModal
            onSubmit={cancelListMeme}
            meme={cancelMeme}
            onClose={() => setCancelMeme(null)}
          />
        }        
        {/* end cards section */}


    </div>
  )
}

Owned.Layout = BaseLayout
