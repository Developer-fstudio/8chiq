import Head from 'next/head'
import { getAllMemes } from "@content/fetcher"
import { BaseLayout } from '@components/ui/layout'
import { useWalletInfo } from '@components/hooks/web3'
import { MarketHeader, StoreCard, StoreList } from '@components/ui/store'
import { OrderModal } from '@components/ui/order'
import { useEthPrice } from '@components/hooks/useEthPrice'
import { useWeb3 } from '@components/provider'
import {useEffect, useState} from 'react'


export default function Marketplace() {

    const [selectedMeme, setSelectedMeme] = useState(null)
    const { account, network, canPurchaseMeme } = useWalletInfo()
    const { eth } = useEthPrice()
    const { web3, isLoading, nftContract, marketContract } = useWeb3()
    const [memes, setMemes] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')
  

    useEffect(()=> {
      if (!isLoading) {
        console.log(marketContract)
        console.log(nftContract)
        loadNFTs()
      } 
    }, [isLoading])

    async function loadNFTs() {
      const { data } = await getAllMemes(web3, nftContract, marketContract)
      setMemes(data)
      console.log('masuk sini')
      console.log(memes)
      setLoadingState('loaded')
    }

    const purchaseCourse = (order) => {
      alert(JSON.stringify(order))
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
        {  (loadingState === 'loaded' && !memes.length) ? <h1
           className='px-20 py-7 text-4x1'>No NFts in marketplace</h1> :
            <StoreList memes={memes}>

              {/* Memes Cards */}

                {meme =>
                  <StoreCard
                    key={meme.id}
                    meme={meme}
                    disabled={!canPurchaseMeme}
                    Footer = { () =>
                      <div className='inline-block px-4 pb-5 content-end'>
                        <button 
                          onClick= {() => setSelectedMeme(meme)}
                          className="inline-block bg-purple-500 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-md px-6 py-1 font-bold text-white mr-2 mb-2"
                          disabled={!canPurchaseMeme}
                          >
                            Buy
                        </button>
                      </div>
                    }
                  />
              }
          </StoreList>
           }
        


        { selectedMeme &&
        <OrderModal
          onSubmit={purchaseCourse}
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
