import Head from 'next/head'
import Image from 'next/image'
import SideBar from '@components/sidebar'
import {MemeDetail} from '@components/ui'
import { getAllMemes } from "@content/fetcher"
import { BaseLayout } from '@components/ui/layout'

export default function Meme({meme}) {
  return (
    <div>
      <Head>
        <title>{`8Chiq : ${meme.title}`}</title>
        <meta name="description" content="Prime properties" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      


        {/* recent properties section */}

        {/* cards section */}
        <MemeDetail meme={meme}/>
        
      


        
        {/* end cards section */}


    </div>
  )
}

export async function getStaticPaths() {
    const {data} = getAllMemes()

    return {
        paths: data.map(m =>({
            params: {
                slug: m.id,
            }
        })),
        fallback: false
    }

}

export function getStaticProps({params}) {
    const { data } = getAllMemes()
    const meme = data.filter(m => m.id === params.slug)[0]
    return {
      props: {
        meme: meme
      }
    }
  }

  Meme.Layout = BaseLayout