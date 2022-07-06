import Head from 'next/head'
import { getAllMemes } from "@content/fetcher"
import { BaseLayout } from '@components/ui/layout'
import { useWalletInfo } from '@components/hooks/web3'
import { MarketHeader} from '@components/ui/store'
import { useState } from 'react'
import { useEthPrice } from '@components/hooks/useEthPrice'
import {create as ipfsHttpClient} from 'ipfs-http-client'
import { useRouter } from 'next/router'
import { useWeb3 } from '@components/provider'
import { Loader } from "@components/ui/common"
import axios from 'axios'

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

export default function CommmentInput({tokenId, onFinish}) {

    const [isCommenting, setIsCommenting] = useState(false)
    const [onSale, setOnSale] = useState(false)
    const { account, network, canPurchaseMeme } = useWalletInfo()
    const { web3, isLoading, nftContract, marketContract } = useWeb3()
    console.log(marketContract)
    console.log(nftContract)

    // file to upload
    const [fileUrl, setFileUrl] = useState(null)
    const [formInput, updateFormInput] = useState({address: account.data,
      comment:'', 

    })
    const router = useRouter()


    async function createComment() {
      const {address, comment } = formInput

      console.log("comment 1")

      if(!comment) return 

      console.log(comment)
      setIsCommenting(true)
      console.log("masuk ke comment")

      // we want to create a comment
      try {
        const result = await marketContract.methods.commentMeme(tokenId, formInput.comment).send({from: account.data})
      } catch {
        console.error("Purchase course: Operation has failed.")
      } 
      
      setIsCommenting(false)
      updateFormInput({...formInput, comment:""})
      onFinish()


     }

    
  
  return (
    <div>     
    <section className="grid pt-5 pr-10 pb-5 pl-10 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-5 max-w-4xl mx-auto">
      <div className='flex justify-center'>
            <div className='w-full flex flex-col pb-12'>
                <textarea
                placeholder='Leave a comment...'
                className='mt-2 border rounded p-4'
                value={formInput.comment}
                onChange={ e => {
                  updateFormInput({...formInput, comment: e.target.value})
                }} 
                />
                <button 
                disabled={!canPurchaseMeme || isCommenting === true}
                onClick={() => createComment()}
                className='font-bold mt-4 bg-purple-500 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded p-2 shadow-lg'
                >
                  { isCommenting ?
                    <div className="w-full flex justify-center m-1">
                      <Loader/>
                    </div> : <div className='m-1'>Comment</div>
                  }
                </button>
            </div>
        </div>
    </section>


    </div>
  )
}

