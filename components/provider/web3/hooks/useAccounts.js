import { useState, useEffect } from "react"
import useSWR from "swr"

export const handler = (web3, provider) => () => {

    const adminAddresses = {
        "0xfa97c10735eeedd598dc2a7643f0dba24f4a1c02155120685d29832a1e84f1d6" : true
    }
    
    const {data, mutate, ...rest} = useSWR(() => 
        web3 ? "web3/accounts" : null,
        async () => {
            const accounts = await web3.eth.getAccounts()
            return accounts[0]
        })

    useEffect(() => {
        provider &&
        provider.on("accountsChanged",
            accounts => mutate(accounts[0] ?? null) 
        )
    }, [provider])

    return {
            data,
            isAdmin: (data && adminAddresses[web3.utils.keccak256(data)]) ?? false,
            mutate,
             ...rest
    }
}