import Head from 'next/head'
import Image from 'next/image'
import SideBar from '@components/sidebar'
import { getAllMemes } from "@content/fetcher"
import { MemeList, MemeCard } from '@components/ui'
import { BaseLayout } from '@components/ui/layout'
import { useWeb3 } from '@components/provider'
import {useEffect, useState} from 'react'


export default function Home() {

  const [memes, setMemes] = useState([])
  const { web3, isLoading, nftContract, marketContract } = useWeb3()
  const [loadingState, setLoadingState] = useState('not-loaded')

  // console.log(marketContract)
  // console.log(nftContract)
  // console.log("anjing")
  
 
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

  if(loadingState === 'loaded' && !memes.length) return (<h1
    className='px-20 py-7 text-4x1'>No NFts in marketplace</h1>)
  
  return (
    <div>
      <Head>
        <title>8Chiq : Actually Funny NFTs!</title>
        <meta name="description" content="Prime properties" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        {/* recent properties section */}

       
        {/* cards section */}
        <MemeList memes={memes}>

          {/* Memes Cards */}

          {meme =>
        <MemeCard
          key={meme.id}
          meme={meme}
        />
      }


        </MemeList>
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
