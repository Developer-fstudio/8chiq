import { useWalletInfo } from "@components/hooks/web3"
import { useWeb3 } from "@components/provider"

export default function WalletBar() {

  const { requireInstall } = useWeb3()
  const { account, network } = useWalletInfo()

    return (
      <section className=" text-white bg-purple-600 rounded-lg">
        <div className="p-8">
          <h1 className="text-lg lg:text-xl xl:text-2xl">Hello, {account.data}</h1>
          <h2 className="subtitle mb-5 text-base lg:text-lg xl:text-xl">I hope you are having a great day!</h2>
          <div className="flex justify-between items-center">
            <div className="sm:flex sm:justify-center lg:justify-start">
              <div className="rounded-md shadow">
                <a href="#" className="w-full flex items-center justify-center lg:px-8 lg:py-4 px-3 py-2 border border-transparent text-xs lg:text-sm xl:text-base font-medium rounded-md text-black bg-white hover:bg-gray-100 md:py-4 md:px-10">
                  Learn how to purchase
                </a>
              </div>
            </div>
            <div>
              { network.hasInitialResponse && !network.isSupported &&
              <div className="bg-red-400 p-4 rounded-lg">
                <div className="text-xs lg:sm xl:text-base">Connected to wrong network</div>
                <div className="text-xs lg:sm xl:text-base">
                  Connect to: {` `}
                  <strong className="text-lg lg:text-xl xl:text-2xl">
                    {network.target}
                  </strong>
                </div>
              </div>
            }
            { requireInstall && 
              <div className="bg-yellow-500 p-2 md:p-4 rounded-lg text-xs lg:text-sm xl:text-base">
              Cannot connect. Please install Metamask.
            </div>

            }
            { network.data && network.isSupported &&
              <div>
                <span className="text-xs lg:sm xl:text-base">Currently on </span>
                <strong className="text-lg lg:text-xl xl:text-2xl">{network.data}</strong>
              </div>
            }
            </div>
          </div>
        </div>
      </section>
    )
  }