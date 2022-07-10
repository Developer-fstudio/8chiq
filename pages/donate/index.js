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


export default function Donate() {
   


  
  return (
    <div>
      <Head>
        <title>8Chiq : Actually Funny NFTs!</title>
        <meta name="description" content="Prime properties" />
        <link rel="icon" href="/favicon.ico" />
      </Head>      


        <div className='grid max-w-4xl mx-auto py-7 text-2xl font-semibold place-items-center'>
        <p className='mt-2 text-3xl leading-8 font-extrabold tracking-tight text-purple-500 sm:text-4xl'>Support Us</p>
        

        <div className='font-semibold text-black text-xl mt-8'>You can show your love and support this project using button bellow</div>

        <a className='flex items-center py-8 px-2'href="https://www.buymeacoffee.com/saidam017" target="_blank" rel="noreferrer">
            <img className='h-32 mr-2' src="/static/images/yellow-button.png" alt=""/>
            <span className='font-semibold text-white text-xl hidden lg:flex font-satisfy'>8Chiq</span>
        </a>

        </div>

    </div>
  )
}



Donate.Layout = BaseLayout
