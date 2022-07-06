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

export default function Manage() {

    const [isMinting, setIsMinting] = useState(false)
    const [onSale, setOnSale] = useState(false)
    const { account, network, canPurchaseMeme } = useWalletInfo()
    const { web3, isLoading, nftContract, marketContract } = useWeb3()
    console.log(marketContract)
    console.log(nftContract)

    // file to upload
    const [fileUrl, setFileUrl] = useState(null)
    const [formInput, updateFormInput] = useState({price: '', name:'',
      description:'', category:'Funny'
      // tags: [
      //   { id: 'NFT', text: 'NFT' },
      //   { id: 'Chiq', text: 'Chiq' },
      // ]
    })
    const router = useRouter()

    //handle delete tags
    const handleDelete = i => {
      updateFormInput({...formInput, tags : formInput.tags.filter((tag, index) => index !== i)})
      // setTags(tags.filter((tag, index) => index !== i));
    }

    // handle tags addition
    const handleAddition = tag => {
      updateFormInput({...formInput, tags : [...formInput.tags, tag]})
      // setTags([...tags, tag]);
    };
    
    // handle drag tags
    const handleDrag = (tag, currPos, newPos) => {
      const newTags = formInput.tags.slice();
  
      newTags.splice(currPos, 1);
      newTags.splice(newPos, 0, tag);
  
      // re-render
      updateFormInput({...formInput, tags : newTags})
      // setTags(newTags);
    };

    // handle clear all tags
    const onClearAll = () => {
      updateFormInput({...formInput, tags : []})
    };

    async function onChange(e) {
      const file = e.target.files[0]
      try {
      const added = await client.add(
          file, {
              progress: (prog) => console.log(`received: ${prog}`)
          })
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      setFileUrl(url)
      } catch (error) {
          console.log('Error uploading file:', error)
      }
    }

    async function createMarket() {
      const {name, description, price, category} = formInput
      if (onSale) {

        console.log('on sale, but information is not complete')
        if(!name || !description || !price || !fileUrl || !category) return 

      } else {

        console.log('not on sale, but information is not complete')
        if(!name || !description || !fileUrl || !category) return 

      }
      
      // upload to IPFS
      const data = JSON.stringify({
          name, description, category, image: fileUrl
      })
      try {
          const added = await client.add(data)
          const url = `https://ipfs.infura.io/ipfs/${added.path}`
          

          // run a function that creates sale and passes in the url 
          createSale(url)
          } catch (error) {
              console.log('Error uploading file:', error)
          }
     }

     async function createSale(url) {
      // create the items and list them on the marketplace
      
      setIsMinting(true)
      console.log("try to mint")
      let tokenId
      // we want to create the token
      try {
        const result = await nftContract.methods.mintToken(url).send({from: account.data})
        .then(async function(receipt){
          console.log(receipt)
          console.log("mint finish")
          let event = receipt.events.Transfer
          console.log(event)
          let value = event.returnValues.tokenId
          tokenId = parseInt(value)
          //test for posting to firebase
        
          console.log(value)

          if (onSale) {
            const price = web3.utils.toWei(formInput.price.toString())
            let listingPrice = await marketContract.methods.getListingPrice().call()
            console.log("ini listing price")
            console.log(listingPrice)
            // approve first
            let approve = await nftContract.methods.setApprovalForAll(marketContract.options.address, true).send({from: account.data})
            // listingPrice = web3.utils.toWei(listingPrice.toString())
            let transaction = await marketContract.methods.makeMarketItem(nftContract.options.address, tokenId, price).send({from: account.data, value: listingPrice})
          } else {
            console.log('sempat coba marketContract')
            // const price = formInput.price.toString()
            // let listingPrice = await marketContract.methods.getListingPrice().call()
            // approve first
            let approve = await nftContract.methods.setApprovalForAll(marketContract.options.address, true).send({from: account.data})
            // listingPrice = listingPrice.toString()
            let transaction =  await marketContract.methods.makeMarketItemNonSale(nftContract.options.address, tokenId).send({from: account.data})
            .then(async function(receipt){
           
             })
          }
    
    
          // transaction = await contract.makeMarketItem(nftaddress, tokenId, price, {value: listingPrice})
          // await transaction.wait()
          
          
          
          router.push('/marketplace/memes/owned')
          setIsMinting(false)
          // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
      });
      } catch {
        console.error("Purchase course: Operation has failed.")
      }
      
      // list the item for sale on the marketplace 

    }

    
 
  
  return (
    <div>
      <Head>
        <title>8Chiq : Actually Funny NFTs!</title>
        <meta name="description" content="Prime properties" />
        <link rel="icon" href="/favicon.ico" />
      </Head>      

    <div className='mx-auto px-4 py-4 max-w-7xl'>
      <MarketHeader/>
      {/* <MemeFilter /> */}
    </div>
    <section className="grid grid-cols-1 max-w-7xl mx-auto">
      <div className='flex justify-center'>
            <div className='w-1/2 flex flex-col pb-12'>
                <input
                placeholder='Asset Name'
                value={formInput.name}
                className='mt-8 border rounded p-4'
                onChange={ e => updateFormInput({...formInput, name: e.target.value})} 
                />
                <textarea
                placeholder='Asset Description'
                className='mt-2 border rounded p-4'
                value={formInput.description}
                onChange={ e => {
                  updateFormInput({...formInput, description: e.target.value})
                }} 
                />
                {/* Price and buy start */}
                <div className="mb-1 mt-2">
                  <label className="mb-2 font-bold">Sell the NFT</label>
                  <div className="text-xs text-gray-700 flex">
                    <label className="flex items-center mr-2">
                      <input
                        checked={onSale}
                        onChange={({target: {checked}}) => {
                          // setOrder({
                          //   ...order,
                          //   price: checked ? order.price : eth.pricePerItem
                          // })
                         setOnSale(checked)
                        }}
                        type="checkbox"
                        className="form-checkbox"
                      />
                    </label>
                    <span>Tick to sell the NFT</span>
                  </div>
                </div>
                <input
                disabled={!onSale}
                placeholder='Asset Price in Eth'
                className='mt-2 border rounded p-4'
                type="text"
                name="price"
                value={formInput.price}
                onChange={ e => {
                  if (isNaN(e.target.value)) { return; }
                  updateFormInput({...formInput, price: e.target.value})
                }} 
                />
                {/* Category Start */}
                <div className="mt-2 relative text-gray-700">
                  Category : 
                  <select className="ml-4 w-72 h-10 pl-3 pr-6 text-base placeholder-gray-600 border rounded-lg appearance-none focus:shadow-outline" 
                          placeholder="Regular input"
                          onChange={ e => {
                            updateFormInput({...formInput, category: e.target.value})
                          }} 
                          value={formInput.category}
                          >
                    <option value="Funny">Funny</option>
                    <option value="Anime">Anime</option>
                    <option value="Blockchain">Blockchain</option>
                    <option value="Cat">Cat</option>
                    <option value="Chiq">Chiq</option>
                  </select>
                </div>
                {/* Category End */}
                {/* Tags Start */}
                {/*  implementation later  */}
                {/* Tags End */}                
                <input
                type='file'
                name='Asset'
                className='mt-4'
                onChange={onChange} 
                /> {
                fileUrl && (
                    <img className='rounded mt-4' width='350px' src={fileUrl} />
                )}
                <button 
                disabled={!canPurchaseMeme || isMinting === true}
                onClick={createMarket}
                className='font-bold mt-4 bg-purple-500 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded p-4 shadow-lg'
                >
                  { isMinting ?
                    <div className="w-full flex justify-center m-1">
                      <Loader/>
                    </div> : <div className='m-1'>Mint Meme</div>
                  }
                </button>
            </div>
        </div>
    </section>


    </div>
  )
}

Manage.Layout = BaseLayout
