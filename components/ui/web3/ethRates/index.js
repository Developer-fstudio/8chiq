import { MEME_PRICE, useEthPrice } from "@components/hooks/useEthPrice"
import { Loader } from "@components/ui/common"
import Image from "next/image"
import { useWeb3 } from '@components/provider'
import {useEffect, useState} from 'react'
import { useWalletInfo } from '@components/hooks/web3'

export default function EthRates() {

  const { eth } = useEthPrice()
  const { web3, isLoading, marketContract , requireInstall } = useWeb3()
  const [salesCount, setSalesCount] = useState("0")
  const { network } = useWalletInfo()
  
  
  useEffect(()=> {
    if (!isLoading) {
      console.log(marketContract)
      loadTotalSales()
    } 
  }, [isLoading])


  async function loadTotalSales() {
    if ( requireInstall && !network.isSupported) {
      return
    }
    let count = await marketContract.methods.getTotalSoldCount().call()
    setSalesCount(count)
  }

    return (
      <div className="pt-4 mx-4 grid xl:grid-cols-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        <div className="flex flex-1 items-stretch text-center mb-5">
          <div className="px-8 py-10 md:p-10 border drop-shadow rounded-md">
            <div className="flex items-center">
              { eth.data ?
                <>
                  <Image
                    layout="fixed"
                    height="35"
                    width="35"
                    src="/static/images/small-eth.webp"
                  />
                <span className="text-base lg:text-xl xl:text-2xl font-bold"> = {eth.data}$</span>
                </> :
                <div className="w-full flex justify-center">
                  <Loader/>
                </div>
              }
            </div>
            <p className="pt-2 text-lg xl:text-xl text-gray-500">Current eth Price</p>
          </div>
        </div>
        <div className="flex flex-1 items-stretch text-center mb-5">
          <div className="px-8 py-10 md:p-10  border drop-shadow rounded-md">
            <div className="flex items-center">
              { !isLoading ? 
                <>
                  <span className="text-base lg:text-xl xl:text-2xl font-bold">
                      {salesCount} 
                  </span>
                    {/* <Image
                    layout="fixed"
                    height="35"
                    width="35"
                    src="/static/images/small-eth.webp"
                    /> */}
                  <span className="text-base lg:text-xl xl:text-2xl font-bold">
                    Meme(s) Sold
                  </span>
                </> : 
                <div className="w-full flex justify-center">
                  <Loader/>
                </div>
              }             
            </div>
            <p className="pt-2 text-lg xl:text-xl text-gray-500">Total Sales</p>
          </div>
        </div>
      </div>
    )
  }