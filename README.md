
# ![favicon-32x32](https://user-images.githubusercontent.com/19762585/174510071-6758e22d-76c8-493e-a5fe-7f9aa8ae0648.png) This is a **8Chiq**, a 9gag clone using blockchain & NFT as a backend


## <a href="https://8chiq.vercel.app/"> LIVE DEMO</a>

![Library _ Loom - 10 July 2022](https://user-images.githubusercontent.com/19762585/178131746-db744feb-5bcf-4636-a27e-b7ed94a71534.gif)




## Getting Started

First, configure the network, in _truffle-config.js_ :

```bash
  # if you are using local Ganache, adjust port accordingly
  networks: {
    development: {
     host: "127.0.0.1",     // Localhost (default: none)
     port: 7545,            // Standard Ethereum port (default: none)
     network_id: "*",       // Any network (default: none)
    }
  }
```

if you are using test network, for example, you can adjust to the right setting, in this case Goerli Test Network is used. define _infuraProjectId_ and _mnemonic_ in _.env_ :

```bash
  //Goerli
  goerli_infura_testnet: {
    provider: () => new HDWalletProvider({
      mnemonic: {
        phrase: mnemonic
      },
      providerOrUrl:
       "wss://goerli.infura.io/ws/v3/" + infuraProjectId
    }),
    network_id: 5,
    confirmations: 2,
    timeoutBlocks: 800,
    skipDryRun: true,
    chainId: 5,
    gasPrice: 30000000000
  },  
```

then, migrate the contract using truffle:

```bash
truffle migrate
# or do this if previously alredy run and do some modification to contract, just in case
truffle migrate --reset
#or migrate with spesific network configuration
truffle migrate --network=<network_name> --reset
```

Install all dependencies:

```bash
npm install
```

then, run the development server:

```bash
npm run dev
# or
yarn dev
```

## Details Features

| Features | Status | 
| --- | :---: |
| Minting Meme NFT | DONE |
| Sell the Meme on the Marketplace | DONE |
| Buy the Meme on the Marketplace | DONE |
| Cancel listing on the Marketplace | DONE |
| Activate likes and dislikes button function | DONE |
| Activate comment function | DONE |
| Contract use Testnet | DONE |

## Tools

- Truffle
- Ganache
- Next JS
- Tailwind

