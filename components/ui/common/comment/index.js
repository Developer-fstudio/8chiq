import Image from "next/image"
import Link from "next/link"
import { useWeb3 } from '@components/provider'
import { useWalletInfo } from '@components/hooks/web3'
import {useEffect, useState} from 'react'
import { Loader } from "@components/ui/common"



export default function CommentCustom({comment}) {


    return (
        <div className='grid pt-5 pr-10  mb-5 pl-10 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-5 max-w-4xl'>

        
            <p className="font-semibold">{comment.address}</p>
            <p className="text-gray-500">{comment.comment}</p>

        
      </div>
    )
  }