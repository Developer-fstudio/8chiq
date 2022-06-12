import Head from 'next/head'
import { getAllMemes } from "@content/fetcher"
import { BaseLayout } from '@components/ui/layout'
import { useWalletInfo } from '@components/hooks/web3'
import { MarketHeader, StoreCard, StoreList } from '@components/ui/store'
import { useState } from 'react'
import { OrderModal } from '@components/ui/order'
import { useEthPrice } from '@components/hooks/useEthPrice'


export default function Marketplace({memes}) {

    const [selectedMeme, setSelectedMeme] = useState(null)
    const { account, network, canPurchaseMeme } = useWalletInfo()
    const { eth } = useEthPrice()

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

       
        {/* cards section */}
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

export function getStaticProps({params}) {
  const { data } = getAllMemes()
  
  return {
    props: {
      memes: data
    }
  }
}

Marketplace.Layout = BaseLayout
