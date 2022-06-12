import Head from 'next/head'
import Image from 'next/image'
import SideBar from '../components/sidebar'
import styles from '../styles/Home.module.css'
import SearchBox from '../components/searchbox'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Prime Properties</title>
        <meta name="description" content="Prime properties" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      
        <nav className='bg-purple-600 shadow-lg'>
          <div className='px-4'>
              <div className='flex w-full justify-between'>
                <div className='flex space-x-7'>
                  <a className='flex items-center py-4 px-2' href='#'>
                      <img className='h-8 w-8 mr-2' src="/static/images/chicken_color.png" alt=""/>
                      <span className='font-semibold text-white text-lg hidden md:flex'>8chik</span>
                  </a>

                  <div className='hidden md:flex items-center space-x-1'>
                    <a className="py-4 px-2 border-white border-b-4 text-white font-semibold" href=""> Home</a>
                    <a className="py-4 px-2 text-gray-200 font-semibold hover:text-white transition duration-300" href=""> Donate</a>
                    <a className="py-4 px-2 text-gray-200 font-semibold hover:text-white transition duration-300" href=""> About</a>
                    <a className="py-4 px-2 text-gray-200 font-semibold hover:text-white transition duration-300" href=""> Contact</a>
                </div>

                </div>

                <div className='flex right-0 items-center space-x-2'>
                  <SearchBox />
                  <button type="button" class="py-2.5 px-5 mr-2 md:text-sm text-xs font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-purple-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-purple-700 dark:text-gray-200 dark:border-purple-600 dark:hover:text-white dark:hover:bg-gray-700">Sign In</button>
                  <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full md:text-sm text-xs px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Sign Up</button>
                </div>
              </div>
          </div>
        </nav>

        {/* Site Banner */}
        <main className='mt-10 px-4 md:mt-16'>
          <div className='sm:text-center lg:text-left'>
            <h1 className='tracking-tight font-extrabold text-4xl sm:text-5xl md:text-6xl'>
              <span class="block">8Chiq, Home of NFT Memes.</span>
              <span class="block text-purple-500">Where NFT are actually have value.</span>
            </h1>

            <p className='mt-3 text-base text-gray-500 md:text-xl md:mt-5 sm:mt-5 sm:text-lg sm:max-w-3xl lg:max-w-4xl sm:mx-auto lg:mx-0'>
              At 8Chiq everyting is meme, have you ever wonder who is the originator and owner for the very viral meme around the globe? 8Chiq can help you with that, using blockchain and NFT technology, we verify every meme and validate its ownership.
            </p>

            <div className="mt-5 sm:mt-8 sm:flex sm:justify-center">
                <div className='md:m-2'>
                  <a className="flex justify-center rounded-md bg-purple-500 text-white px-8 py-3" href="">View properties</a>
                </div>

                <div className='md:m-2'>
                <a className="flex justify-center rounded-md bg-purple-100 text-purple-700 px-8 py-3" href="">Explore locations</a>
                </div>
            </div>
          </div>

        </main>

        {/* recent properties section */}

        <div className="mt-5 flex p-10 justify-center">
          <h2 className='text-3xl text-gray-500 mb-2'>Recent Properties</h2>
        </div>

        {/* card section */}
        <div className='grid p-10 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5'>
            {/* cards */}
            <div className='rounded overflow-hidden shadow-lg'>
              <img className="w-full" src="/static/images/home1.jpg" alt=""/>
              <div className="px-6 py-4">
                <div className='font-bold text-xl mb-2'>Orchid Villa</div>
                <p className='text-gray-700'>is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
              </div>
              <div className='px-6 pt-4 pb-2'>
                <span className='inline-block text-green-300 font-bold text-sm px-3 py-1 mr-2 mb-2'>$450,000</span>
              </div>
              <div className='px-6 pt-4 pb-2'>
                <span class="iline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">7 Beds</span>
                <span class="iline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">9 Baths</span>
              </div>
              <div className='px-6 pt-4 pb-10'>
                <button class="iline-block bg-purple-500 rounded-full px-4 py-1 font-bold text-white mr-2 mb-2">View Property</button>
              </div>
            </div>

                        {/* cards */}
                        <div className='rounded overflow-hidden shadow-lg'>
              <img className="w-full" src="/static/images/home2.jpg" alt=""/>
              <div className="px-6 py-4">
                <div className='font-bold text-xl mb-2'>Orchid Villa</div>
                <p className='text-gray-700'>is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
              </div>
              <div className='px-6 pt-4 pb-2'>
                <span className='inline-block text-green-300 font-bold text-sm px-3 py-1 mr-2 mb-2'>$450,000</span>
              </div>
              <div className='px-6 pt-4 pb-2'>
                <span class="iline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">7 Beds</span>
                <span class="iline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">9 Baths</span>
              </div>
              <div className='px-6 pt-4 pb-10'>
                <button class="iline-block bg-purple-500 rounded-full px-4 py-1 font-bold text-white mr-2 mb-2">View Property</button>
              </div>
            </div>

                        {/* cards */}
                        <div className='rounded overflow-hidden shadow-lg'>
              <img className="w-full" src="/static/images/home3.jpg" alt=""/>
              <div className="px-6 py-4">
                <div className='font-bold text-xl mb-2'>Orchid Villa</div>
                <p className='text-gray-700'>is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
              </div>
              <div className='px-6 pt-4 pb-2'>
                <span className='inline-block text-green-300 font-bold text-sm px-3 py-1 mr-2 mb-2'>$450,000</span>
              </div>
              <div className='px-6 pt-4 pb-2'>
                <span class="iline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">7 Beds</span>
                <span class="iline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">9 Baths</span>
              </div>
              <div className='px-6 pt-4 pb-10'>
                <button class="iline-block bg-purple-500 rounded-full px-4 py-1 font-bold text-white mr-2 mb-2">View Property</button>
              </div>
            </div>
        </div>

        {/* Banner */}
        <div className='py-20 h-screen' style={{backgroundImage: "linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)),url('static/images/luxury.jpg')"}}>
            <div className='container mx-auto px-6 mt-40'>
                <h2 className='text-4xl font-bold text-white mb-2'>Experience Luxury Like Never Before</h2>
                <h3 className='text-2xl mb-8 text-gray-200'>50+ Exotic locations accross the globe</h3>
                <button className='text-white shadow-lg uppercase font-bold border-2 px-8 py-4 tracking-wider'>
                    Explore locations
                </button>
            </div>
        </div>

        {/* Locations */}

        <div className="mt-10 flex p-10 justify-center">
          <h2 className='text-3xl text-gray-500 mb-2'>Locations</h2>
        </div>

                {/* card section */}
                <div className='grid p-10 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5'>
            {/* cards */}
            <div className='rounded overflow-hidden shadow-lg'>
              <img className="w-full" src="/static/images/ny.jpg" alt=""/>
              <div className="px-6 py-4">
                <div className='font-bold text-xl mb-2'>New York</div>
                <p className='text-gray-700'>is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
              </div>
            </div>

                        {/* cards */}
                        <div className='rounded overflow-hidden shadow-lg'>
              <img className="w-full" src="/static/images/california.jpg" alt=""/>
              <div className="px-6 py-4">
                <div className='font-bold text-xl mb-2'>San Fransisco</div>
                <p className='text-gray-700'>is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s. is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
              </div>
            </div>

                        {/* cards */}
                        <div className='rounded overflow-hidden shadow-lg'>
              <img className="w-full" src="/static/images/ny.jpg" alt=""/>
              <div className="px-6 py-4">
                <div className='font-bold text-xl mb-2'>New York</div>
                <p className='text-gray-700'>is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s. is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
              </div>
            </div>

        </div>

                {/* Banner */}
                <div className='py-20' style={{background: "linear-gradient(315deg, #dbd4f4, #7d3df0 74%)"}}>
            <div className='container mx-auto px-6'>
                <h2 className='text-4xl font-bold text-white mb-2'>Save Upto 50% on broker commisions</h2>
                <h3 className='text-2xl mb-8 text-gray-200'>50+ Exotic locations accross the globe</h3>
                <button className='text-purple-500 rounded-2xl bg-white shadow-lg uppercase font-bold border-2 px-8 py-4 tracking-wider'>
                    Enquire
                </button>
            </div>
        </div>

        {/* Client say about us */}

        <div className="mt-10 flex p-10 justify-center">
          <h2 className='text-3xl text-gray-500 mb-2'>What client say about us?</h2>
        </div>

        <div className='p-10 grid grid-cols-1 gap-5 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3'>
          <div className='shadow-lg mx-auto w-72 bg-white rounded-xl p-4 flex flex-col justify-between'>
            <p className='text-gray-600'>
              <span className='text-purple-500 text-lg font-bold'>"</span>
              This is one of the best NFT and meme website i ever used. This is one of the best NFT and meme website i ever used
              <span className='text-purple-500 text-lg font-bold'>"</span>
            </p>

            <div className='mt-5 flex bg-purple-100 rounded-full items-center'>
              <a href="" className='block relative'>
                <img className='h-10 w-10 rounded-full mx-auto' src="static/images/avatar.png" alt=""/>
              </a>
              <div className='flex flex-col ml-2 justify-between'>
                <span className='text-sm text-purple-500 font-semibold'>Said</span>
                <span className='text-xs flex items-center'>Director</span>
              </div>
            </div>
          </div>

          <div className='shadow-lg mx-auto w-72 bg-white rounded-xl p-4 flex flex-col justify-between'>
            <p className='text-gray-600'>
              <span className='text-purple-500 text-lg font-bold'>"</span>
              This is one of the best NFT and meme website i ever used. This is one of the best NFT and meme website i ever used. This is one of the best NFT and meme website i ever used
              <span className='text-purple-500 text-lg font-bold'>"</span>
            </p>

            <div className='mt-5 flex bg-purple-100 rounded-full items-center'>
              <a href="" className='block relative'>
                <img className='h-10 w-10 rounded-full mx-auto' src="static/images/avatar.png" alt=""/>
              </a>
              <div className='flex flex-col ml-2 justify-between'>
                <span className='text-sm text-purple-500 font-semibold'>Said</span>
                <span className='text-xs flex items-center'>Director</span>
              </div>
            </div>
          </div>

          <div className='shadow-lg mx-auto w-72 bg-white rounded-xl p-4 flex flex-col justify-between'>
            <p className='text-gray-600'>
              <span className='text-purple-500 text-lg font-bold'>"</span>
              This is one of the best NFT and meme website i ever used
              <span className='text-purple-500 text-lg font-bold'>"</span>
            </p>

            <div className='mt-5 flex bg-purple-100 rounded-full items-center'>
              <a href="" className='block relative'>
                <img className='h-10 w-10 rounded-full mx-auto' src="static/images/avatar.png" alt=""/>
              </a>
              <div className='flex flex-col ml-2 justify-between'>
                <span className='text-sm text-purple-500 font-semibold'>Said</span>
                <span className='text-xs flex items-center'>Director</span>
              </div>
            </div>
          </div>
        </div>


        {/* Contact us */}

        <div className="mt-10 flex p-10 justify-center">
          <h2 className='text-3xl text-gray-500 mb-2'>Contact us</h2>
        </div>

        <div className='bg-purple-300 mt-5 flex p-10 justify-center items-center'>
            <form className='w-full max-w-lg'>
                <div className='flex'>
                    <div className='w-full md:w-1/2 px-3 mb-6 md:mb-0'>
                      <label className='block uppercase text-xs text-gray-700 font-bold mb-2 tracking-wider'>First Name</label>
                      <input type="text" className='mb-3 block w-full border border-purple-500 text-gray-700 block py-3 px-4 rounded' placeholder='Jane'></input>
                      <p className='text-sm text-purple-500 italic'>Please fill out this form</p>
                    </div>

                    <div className='w-full md:w-1/2 px-3'>
                        <label className='block uppercase text-xs text-gray-700 font-bold mb-2 tracking-wider'>last Name</label>
                        <input type="text" className='block w-full border border-purple-500 text-gray-700 block py-3 px-4 rounded' placeholder='Doe'></input>
                    </div>
                </div>
            </form>
        </div>

        
      

      

    </div>
  )
}
