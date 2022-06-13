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
import { WithContext as ReactTags } from 'react-tag-input';

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

// for tags input, define delimiters
const KeyCodes = {
  comma: 188,
  enter: 13
};
// for tags input, define delimiters
const delimiters = [KeyCodes.comma, KeyCodes.enter];

export default function Manage({memes}) {

    const [selectedMeme, setSelectedMeme] = useState(null)
    const { account, network, canPurchaseMeme } = useWalletInfo()
    const { eth } = useEthPrice()
    const { web3, isLoading, nftContract, marketContract } = useWeb3()

    // file to upload
    const [fileUrl, setFileUrl] = useState(null)
    const [formInput, updateFormInput] = useState({price: '', name:'',
      description:'', category:'Funny',
      tags: [
        { id: 'NFT', text: 'NFT' },
        { id: 'Chiq', text: 'Chiq' },
      ]})
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
      const {name, description, price} = formInput 
      if(!name || !description || !price || !fileUrl) return 
      // upload to IPFS
      const data = JSON.stringify({
          name, description, image: fileUrl
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
      

      // we want to create the token
    
      
      // list the item for sale on the marketplace 


      transaction = await contract.makeMarketItem(nftaddress, tokenId, price, {value: listingPrice})
      await transaction.wait()
      router.push('./')
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
                <input
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
                <div className="mt-4">
                  <ReactTags
                    tags={formInput.tags}
                    // suggestions={suggestions}
                    delimiters={delimiters}
                    handleDelete={handleDelete}
                    handleAddition={handleAddition}
                    handleDrag={handleDrag}
                    onClearAll={onClearAll}
                    minQueryLength={2}
                    maxLength={5}
                    autofocus={false}
                    allowDeleteFromEmptyInput={true}
                    autocomplete={true}
                    readOnly={false}
                    allowUnique={true}
                    allowDragDrop={true}
                    inline={true}
                    allowAdditionFromPaste={true}
                    editable={true}
                    clearAll={true}
                    // handleTagClick={handleTagClick}
                    inputFieldPosition="bottom"
                  />
                </div>
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
                <button onClick={createMarket}
                className='font-bold mt-4 bg-purple-500 text-white rounded p-4 shadow-lg'
                >
                    Mint NFT
                </button>
            </div>
        </div>
    </section>


    </div>
  )
}

Manage.Layout = BaseLayout
