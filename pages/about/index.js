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


export default function About() {
   


  
  return (
    <div>
      <Head>
        <title>8Chiq : Actually Funny NFTs!</title>
        <meta name="description" content="Prime properties" />
        <link rel="icon" href="/favicon.ico" />
      </Head>      


        <div className='grid max-w-4xl mx-auto py-7 text-2xl font-semibold place-items-center'>
        <p className='mt-2 text-3xl leading-8 font-extrabold tracking-tight text-purple-500 sm:text-4xl'>About Us</p>
        
        <img className='h-64 w-64 mt-16' src="/static/images/chicken_color.png" alt=""/>
        <div className='font-semibold text-black text-7xl font-satisfy mt-8'>8Chiq</div>

        <p className={`text-gray-600 mb-8 mt-16 text-xl font-normal max-w-2xl`}>8Chiq is a blockchain based meme platform, where you can mint one. interact with it  and share it across all social media. all memes and interaction (likes, dislikes, comment) are stored in the blockchain as an NFT, providing digital value and persistent. </p>
        </div>

    <div className={`py-48 bg-background`} id="team">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2
            className={`text-base text-primary font-semibold tracking-wide uppercase`}
          >
            Who are we
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-purple-500 sm:text-4xl">
            Creator
          </p>
        </div>

        <div className={`flex flex-wrap flex-col-reverse sm:flex-row`}>
          <div className={`w-full sm:w-1/2 p-6`}>
            <img className="h-6/6" src="/static/images/said.jpg" alt="freespace" />
          </div>
          <div className={`w-full sm:w-1/2 p-6 mt-20`}>
            <div className={`align-middle`}>
              <h3
                className={`text-3xl text-gray-800 font-bold leading-none mb-3`}
              >
                Said
              </h3>
              <p className={`text-gray-600 mb-8`}>Hi. My name is Said, currently developing this platform as my web3 learning journey. you chan check the code for this platform at 
                 <a className={`text-purple-600 mb-8`} href="https://github.com/said017/8chiq" target="_blank"> this github repo</a> . and check out <a className={`text-purple-600 mb-8`} href="https://www.linkedin.com/in/said-73ab6912b/" target="_blank"> my linkedin in profile</a> 
            </p>
            </div>
          </div>
        </div>
      </div>
    </div>
        
           
        


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

About.Layout = BaseLayout
