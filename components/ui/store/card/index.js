import Image from "next/image"
import Link from "next/link"

export default function StoreCard({meme, Footer, disabled}) {
    return (
        <div className='rounded overflow-hidden shadow-md'>
        <div className='flex items-center px-4 py-2'>
          <a className='flex items-center' href=''>
            <img className='w-6 h-6 mr-2' src="/static/images/icons8-crazy-96.png" alt=""></img>
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
        <div className='flex'>
          <button className="inline-block rounded-lg px-4 py-1 font-bold text-green-500 md:text-md text-xs sm:text-sm mr-2 mb-2 border-2 border-green-400 flex items-center">
            <img className='w-4 h-4 md:w-6 md:h-6 mr-2' src="/static/images/thumb_up_purple_wght400.svg" alt=""></img>
            {meme.like}
          </button>
          <button className="inline-block rounded-lg px-4 py-1 font-bold text-gray-400 md:text-md text-xs sm:text-sm mr-2 mb-2 border-2 border-gray-300 flex items-center">
          <img className='w-4 h-4 md:w-6 md:h-6 mr-2' src="/static/images/thumb_down_FILL0_wght400.svg" alt=""></img>
            {meme.dislike}
            </button>
          {/* <button className="inline-block rounded-lg px-4 py-1 font-bold text-gray-400 md:text-md text-xs sm:text-sm mr-2 mb-2 border-2 border-gray-300 flex items-center">
          <img className='w-4 h-4 md:w-6 md:h-6 mr-2' src="/static/images/chat_bubble_FILL0_wght400.svg" alt=""></img>
            {meme.comment}
            </button> */}
        </div>

        <div className='flex'>

        <button className="inline-block rounded-lg px-4 py-1 font-bold text-gray-400 md:text-md text-xs sm:text-sm mr-2 mb-2 border-2 border-gray-300 flex items-center">
          <img className='w-4 h-4 md:w-6 md:h-6' src="/static/images/share_48.svg" alt=""></img>
            </button>
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