import Head from 'next/head'
import { getAllMemes } from "@content/fetcher"
import { BaseLayout } from '@components/ui/layout'
import { useWalletInfo } from '@components/hooks/web3'
import { MarketHeader } from '@components/ui/store'
import { useState } from 'react'
import { useEthPrice } from '@components/hooks/useEthPrice'
import { CustomeButton } from '@components/ui/common'
import { OwnedMemeCard } from "@components/ui/store"
import { Message } from '@components/ui/common'

export default function Owned({memes}) {

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
      </div>

      <section className="grid grid-cols-1 max-w-7xl mx-auto">
        <OwnedMemeCard>
          <Message>
            My custom message!
          </Message>
          <CustomeButton>
            Watch the course
          </CustomeButton>
        </OwnedMemeCard>
      </section>

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

Owned.Layout = BaseLayout
