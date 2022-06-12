import Head from 'next/head'
import Image from 'next/image'
import SideBar from '@components/sidebar'
import { getAllMemes } from "@content/fetcher"
import { MemeList, MemeCard } from '@components/ui'
import { BaseLayout } from '@components/ui/layout'


export default function Home({memes}) {
 
  
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

export function getStaticProps({params}) {
  const { data } = getAllMemes()
  
  return {
    props: {
      memes: data
    }
  }
}

Home.Layout = BaseLayout
