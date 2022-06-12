
import { handler as createAcountHook } from "./useAccounts";
import { handler as createNetworkHook } from "./useNetwork";



export const setupHooks = (web3, provider) => {

    return {
        useAccount: createAcountHook(web3, provider),
        useNetwork: createNetworkHook(web3, provider)
    }
}