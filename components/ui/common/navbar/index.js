import { useWeb3 } from '@components/provider'
import { useAccount } from '@components/hooks/web3'
import SearchBox from '@components/searchbox'
import {CustomeButton} from '@components/ui/common'
import { useRouter } from 'next/router'
import ActiveLink from '../link'
import ActiveLinkNav from '../linknav'


export default function Navbar() {
    const { connect, web3, isLoading, requireInstall } = useWeb3()
    const { account } = useAccount()
    const { pathname } = useRouter()
    return (
        <section>
            <nav className='bg-purple-600 shadow-lg'>
                <div className='px-4'>
                    <div className='flex w-full justify-between'>
                        <div className='flex space-x-7'>
                        <a className='flex items-center py-4 px-2' href='/'>
                            <img className='h-8 w-8 mr-2' src="/static/images/chicken_color.png" alt=""/>
                            <span className='font-semibold text-white text-lg hidden lg:flex'>8Chiq</span>
                        </a>

                        <div className='hidden md:flex items-center space-x-1'>
                            <div className="px-2 lg:text-base text-sm text-gray-200 font-semibold hover:text-white transition duration-300">
                                <ActiveLinkNav href="/">
                                    <a> Home</a>
                                </ActiveLinkNav>
                            </div>
                            <div className="px-2 lg:text-base text-sm text-gray-200 font-semibold hover:text-white transition duration-300">
                                <ActiveLinkNav href="/donate">
                                    <a> Donate</a>
                                </ActiveLinkNav>
                            </div>
                            <div className="px-2 lg:text-base text-sm text-gray-200 font-semibold hover:text-white transition duration-300">
                                <ActiveLinkNav  href="/about">
                                    <a > About</a>
                                </ActiveLinkNav>
                            </div>
                            <div className="px-2 lg:text-base text-sm text-gray-200 font-semibold hover:text-white transition duration-300">
                                <ActiveLinkNav href="/marketplace">
                                    <a> Marketplace</a>                                    
                                </ActiveLinkNav>
                            </div>              
                        </div>

                        </div>

                        <div className='flex right-0 items-center space-x-2'>
                        <SearchBox />
                        <button type="button" className="py-2.5 px-3 lg:px-5 mr-2 lg:text-sm text-xs font-medium text-gray-900 focus:outline-none bg-white rounded-md border border-purple-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-purple-700 dark:text-gray-200 dark:border-purple-600 dark:hover:text-white dark:hover:bg-gray-700">Sign In</button>
                        { isLoading ? 
                            <CustomeButton 
                                variant="blue"
                                disabled={true}
                                onClick={connect}>
                                    Loading...
                            </CustomeButton> : requireInstall ?
                              <CustomeButton
                                variant="blue" 
                                onClick={() => {
                                    window.open("https://metamask.io/download.html", "_blank")           
                                }}>
                                    Install Metamask
                              </CustomeButton>  :                          
                             <CustomeButton 
                             variant="blue"
                             onClick={account.data ? null : connect}
                             hoverable={account.data ? false : true}
                             className={account.data && "cursor-default"}>
                                 {account.data ? `Hi There ${account.isAdmin ? "Admin" : ""}` : "Connect"}
                             </CustomeButton>                                            
                        }

                        </div>
                    </div>
                </div>
            </nav>
            { account.data && !pathname.includes("marketplace") &&
                <div className="flex justify-end pt-1 px-4">
                    <div className="text-white lg:text-base text-sm bg-purple-600 rounded-md p-2">
                        {account.data}
                    </div>
                </div>
            }
        </section>
    )
}