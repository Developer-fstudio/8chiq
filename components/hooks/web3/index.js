import { useHooks } from "@components/provider/web3"

const enhanceHook = swrResponse => {
    return {
        ...swrResponse,
        hasInitialResponse: swrResponse.data || swrResponse.error
    }
}


export const useAccount = () => {
    const swrRes = enhanceHook(useHooks(hooks => hooks.useAccount)())
    return {
        account: swrRes
    }
}

export const useNetwork = () => {
    const swrRes = enhanceHook(useHooks(hooks => hooks.useNetwork)())
    return {
        network: swrRes
    }
}

export const useWalletInfo = () => {
   const { account } = useAccount()
   const { network } = useNetwork()
  
   return {
       account,
       network,
       canPurchaseMeme: !!(account.data && network.isSupported)
   }
}