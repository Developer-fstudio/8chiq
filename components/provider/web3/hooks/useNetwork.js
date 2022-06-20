import { useEffect } from "react"
import useSWR from "swr"

const NETWORKS = {
    1: "Ethereum Network",
    2: "Ropsten Test Network",
    4: "Rinkeby Test Network",
    5: "Goerli Test Network",
    80001: "Polygon Mumbai Test Network",
    137: "Polygon Network",
    56: "Binance Smart Network",
    1337: "Ganache"
}

const targetNetwork = NETWORKS[process.env.NEXT_PUBLIC_TARGET_CHAIN_ID]


export const handler = (web3, provider) => () => {

    const {data, error, mutate, ...swrResponse} = useSWR(() =>
        web3 ? "web3/network" : null,
        async () => {
            const chainId = await web3.eth.getChainId()
            return NETWORKS[chainId]
        } 
    )

    useEffect(()=> {
        provider && 
        provider.on("chainChanged", chainId => mutate(NETWORKS[parseInt(chainId, 16)]))
    }, [web3])

    return {
            data,
            mutate,
            target: targetNetwork,
            isSupported: data === targetNetwork,
            ...swrResponse
    }
}