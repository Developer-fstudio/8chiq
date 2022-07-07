import Image from "next/image"
import Link from "next/link"
import { useWeb3 } from '@components/provider'
import { useWalletInfo } from '@components/hooks/web3'
import {useEffect, useState} from 'react'
import { Loader } from "@components/ui/common"
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
} from 'next-share'
import { useRouter } from 'next/router'


const logoMap = {
  "Funny" : "/static/images/icons8-crazy-96.png",
  "Anime" : "/static/images/icons8-naruto-96.png",
  "Blockchain" : "/static/images/icons8-blockchain-digital-64.png",
  "Cat" : "/static/images/icons8-cat-64.png",
  "Chiq" : "/static/images/android-chrome-192x192.png"
}

export default function MemeDetail({meme, Footer, disabledButton, onClickButton, onClickDislikeButton, loadingStateButton}) {

  const { isLoading, marketContract } = useWeb3()
  const { account } = useWalletInfo()
  const router = useRouter()
  const shareLink = `http://localhost:3000${router.asPath}` 


  const [likeStatus, setLikeStatus] = useState(2)

  useEffect(()=> {
    if (!isLoading) {
      getLikeStatus(meme.id)
    } 
  }, [isLoading, loadingStateButton])

  async function getLikeStatus(tokenId) {
    const status = await marketContract.methods.getLikeStatus(tokenId).call({from: account.data})
    setLikeStatus(status)
    console.log("like status :")
    console.log(shareLink)
  }


    console.log(`the meme : ${meme}`)
    return (
      <div className="grid p-10 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-5 max-w-4xl mx-auto">
        <div className='rounded overflow-hidden shadow-md'>
          <div className='flex items-center px-4 py-2'>
            <a className='flex items-center' href=''>
              <img className='w-6 h-6 mr-2' src={logoMap[meme.category]} alt=""></img>
              <p className='text-gray-500 text-xs'>{meme.category}</p>
            </a>
            <p className='text-gray-500 text-xs ml-1'>{meme.age}</p>
          </div>
          <div className="px-4 pb-2">
            <div className='font-bold text-xl mb-2'>{meme.title}</div>
          </div>
          {/* start like, dislike, part */}
          <div className='flex px-4 pb-2 justify-between'>
          <div className='flex'>
          <button 
            className={`inline-block rounded-lg px-4 py-1 font-bold  md:text-md text-xs sm:text-sm mr-2 mb-2 border-2 flex items-center ${(likeStatus == 2 || likeStatus == 1) ? "text-gray-400 border-gray-300"  : "text-green-500 border-green-400"} `}
            disabled={disabledButton}
            onClick={onClickButton}>
              <img className='w-4 h-4 md:w-6 md:h-6 mr-2' src={(likeStatus == 2 || likeStatus == 1) ? "/static/images/thumb_up_FILL0_wght400.svg": "/static/images/thumb_up_green_wght400.svg"} alt=""></img>
              { loadingStateButton === "liking" ?
                        <div className="w-full flex justify-center m-1">
                          <Loader/>
                        </div> : <div>{meme.like}</div>
              }
          </button>
          <button 
            className={`inline-block rounded-lg px-4 py-1 font-bold  md:text-md text-xs sm:text-sm mr-2 mb-2 border-2 flex items-center ${(likeStatus == 2 || likeStatus == 0) ? "text-gray-400 border-gray-300"  : "text-red-500 border-red-400"}`}
            disabled={disabledButton}
            onClick={onClickDislikeButton}>
          <img className='w-4 h-4 md:w-6 md:h-6 mr-2' src={(likeStatus == 2 || likeStatus == 0) ? "/static/images/thumb_down_FILL0_wght400.svg": "/static/images/thumb_down_red_wght400.svg"} alt=""></img>
              { loadingStateButton === "liking" ?
                        <div className="w-full flex justify-center m-1">
                          <Loader/>
                        </div> : <div>{meme.dislike}</div>
              }
            </button>
          </div>

          <div className='flex'>
            {/* <button type="button" className="text-white bg-[#3b5998] hover:bg-[#3b5998]/90 focus:ring-4 focus:outline-none focus:ring-[#3b5998]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 mr-2 mb-2">
              <svg className="w-4 h-4 md:mr-2 -ml-1" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="facebook-f" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M279.1 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.4 0 225.4 0c-73.22 0-121.1 44.38-121.1 124.7v70.62H22.89V288h81.39v224h100.2V288z"></path></svg>
              <span className='hidden md:flex'>Facebook</span>
          </button> */}
          <div className="m-2">
            <FacebookShareButton
              url={shareLink}
              quote={'Check out this 8 Chiq meme!!! : '+ `${meme.title}`}
              hashtag={'#8chiq'}
            >
              <FacebookIcon size={48}/>
            </FacebookShareButton>
          </div>

          <div className="m-2">
            <TwitterShareButton
              url={shareLink}
              title={'Check out this 8 Chiq meme!!! : '+ `${meme.title}`}
            >
              <TwitterIcon size={48} />
            </TwitterShareButton>
          </div>

         
          {/* <button className="inline-block rounded-lg px-4 py-1 font-bold text-gray-400 md:text-md text-xs sm:text-sm mr-2 mb-2 border-2 border-gray-300 flex items-center">
            <img className='w-4 h-4 md:w-6 md:h-6' src="/static/images/share_48.svg" alt=""></img>
              </button> */}
          </div>

          </div>

          {/* end like, dislike, part */}
          {/* src={`${meme.img}`} */}
          {meme.img && 
          <div className="w-full pb-4">
            <Image width="100%" height="100%" layout="responsive" objectFit="contain" src={`${meme.img}`} alt=""/>
          </div>
          }
          

          {/* <div className='px-4 pb-2'>
              {
                  meme.tags.map((tag, i) => <span key={i} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-600 mr-2 mb-2">{tag}</span>)
              }
          </div> */}
          <Footer/>
        </div>
      </div>

    )
  }