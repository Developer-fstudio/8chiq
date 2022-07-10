import Image from "next/image"
import Link from "next/link"
import { useWeb3 } from '@components/provider'
import { useWalletInfo } from '@components/hooks/web3'
import {useEffect, useState} from 'react'
import { Loader } from "@components/ui/common"
import {
  TwitterShareButton,
  TwitterIcon,
} from 'next-share'


const logoMap = {
  "Funny" : "/static/images/icons8-crazy-96.png",
  "Anime" : "/static/images/icons8-naruto-96.png",
  "Blockchain" : "/static/images/icons8-blockchain-digital-64.png",
  "Cat" : "/static/images/icons8-cat-64.png",
  "Chiq" : "/static/images/android-chrome-192x192.png"
}

export default function StoreCard({meme, Footer, disabled, disabledButton, onClickButton, onClickDislikeButton, loadingStateButton}) {

  const { isLoading, marketContract } = useWeb3()
  const { account, network, canPurchaseMeme } = useWalletInfo()


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
    console.log(status)
  }

    return (
        <div className='rounded overflow-hidden shadow-md'>
        <div className='flex items-center px-4 py-2'>
          <a className='flex items-center' href=''>
            <img className='w-6 h-6 mr-2' src={logoMap[meme.category]} alt=""></img>
            <p className='text-gray-500 text-xs'>{meme.category}</p>
          </a>
          <p className='text-gray-500 text-xs ml-1'>{meme.age}</p>
        </div>
        <div className="px-4 pb-4">
          <div className='h-12 font-bold text-xl mb-2'>{meme.title}</div>
        </div>
        <div className="w-full pb-2">
            <Link href={`/meme/${meme.id}`}>
                <a>
                    <Image className={`object-cover ${disabled && "filter grayscale"}`} width="100%" height="100%" layout="responsive" objectFit="cover" src={`${meme.img}`} alt=""/>
                </a>
            </Link>
        </div>
        <div className='flex px-4 pt-4 pb-2 justify-between'>
        <div className='flex content-center mt-2'>
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
          {/* <button className="inline-block rounded-lg px-4 py-1 font-bold text-gray-400 md:text-md text-xs sm:text-sm mr-2 mb-2 border-2 border-gray-300 flex items-center">
          <img className='w-4 h-4 md:w-6 md:h-6 mr-2' src="/static/images/chat_bubble_FILL0_wght400.svg" alt=""></img>
            {meme.comment}
            </button> */}
        </div>

        <div className='flex'>

        {/* <button className="inline-block rounded-lg px-4 py-1 font-bold text-gray-400 md:text-md text-xs sm:text-sm mr-2 mb-2 border-2 border-gray-300 flex items-center">
          <img className='w-4 h-4 md:w-6 md:h-6' src="/static/images/share_48.svg" alt=""></img>
            </button> */}
            <TwitterShareButton
              url={`http://localhost:3000/meme/${meme.id}`}
              title={'Check out this 8 Chiq meme!!! : '+ `${meme.title}`}
            >
              <TwitterIcon size={36} />
            </TwitterShareButton>
        </div>

        </div>
        {/* <div className='px-4 pb-2'>
            {
                meme.tags.map((tag, i) => <span key={i} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-600 mr-2 mb-2">{tag}</span>)
            }
        </div> */}
        <Footer/>
      </div>
    )
  }