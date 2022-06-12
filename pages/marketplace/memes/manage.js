import Head from 'next/head'
import { getAllMemes } from "@content/fetcher"
import { BaseLayout } from '@components/ui/layout'
import { useWalletInfo } from '@components/hooks/web3'
import { MarketHeader} from '@components/ui/store'
import { useState } from 'react'
import { useEthPrice } from '@components/hooks/useEthPrice'
import { MemeFilter, OwnedMemeCard } from "@components/ui/store"
import { CustomeButton } from '@components/ui/common'


export default function Manage({memes}) {

    const [selectedMeme, setSelectedMeme] = useState(null)
    const { account, network, canPurchaseMeme } = useWalletInfo()
    const { eth } = useEthPrice()

    
 
  
  return (
    <div>
      <Head>
        <title>8Chiq : Actually Funny NFTs!</title>
        <meta name="description" content="Prime properties" />
        <link rel="icon" href="/favicon.ico" />
      </Head>      

    <div className='mx-auto px-4 py-4 max-w-7xl'>
      <MarketHeader/>
      <MemeFilter />
    </div>
    <section className="grid grid-cols-1 max-w-7xl mx-auto">
      <OwnedMemeCard>
        <div className="flex mr-2 relative rounded-md">
          <input
            type="text"
            name="account"
            id="account"
            className="w-96 focus:ring-purple-500 shadow-md focus:border-purple-500 block pl-7 p-4 sm:text-sm border-gray-300 rounded-md"
            placeholder="0x2341ab..." />
          <CustomeButton>
            Verify
          </CustomeButton>
        </div>
      </OwnedMemeCard>
    </section>


    </div>
  )
}

Manage.Layout = BaseLayout
