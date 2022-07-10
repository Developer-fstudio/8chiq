const HDWalletProvider = require('@truffle/hdwallet-provider');
// create a file at the root of your project and name it .env -- there you can set process variables
// like the mnemomic and Infura project key below. Note: .env is ignored by git to keep your private information safe
require('dotenv').config();
const mnemonic = process.env["MNEMONIC"];
const infuraProjectId = process.env["INFURA_PROJECT_ID"];

module.exports = {

  contracts_build_directory: "./public/contracts",
  networks: {
    development: {
     host: "127.0.0.1",     // Localhost (default: none)
     port: 7545,            // Standard Ethereum port (default: none)
     network_id: "*",    // Any network (default: none)
    },
   //polygon Infura mainnet
   polygon_infura_mainnet: {
    provider: () => new HDWalletProvider({
      mnemonic: {
        phrase: mnemonic
      },
      providerOrUrl:
       "https://polygon-mainnet.infura.io/v3/" + infuraProjectId
    }),
    network_id: 137,
    confirmations: 2,
    timeoutBlocks: 200,
    skipDryRun: true,
    chainId: 137,
    gasPrice: 10000000000
  },
  //polygon Infura testnet
  polygon_infura_testnet: {
    provider: () => new HDWalletProvider({
      mnemonic: {
        phrase: mnemonic
      },
      providerOrUrl:
       "https://polygon-mumbai.infura.io/v3/" + infuraProjectId
    }),
    network_id: 80001,
    confirmations: 2,
    timeoutBlocks: 800,
    skipDryRun: true,
    chainId: 80001,
    gasPrice: 30000000000
  },
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
  },
 

  // Configure your compilers
  compilers: {
    solc: {
     version: "0.8.13",   // Fetch exact version from solc-bin (default: truffle's version)
     settings: {          // See the solidity docs for advice about optimization and evmVersion
      optimizer: {
        enabled: true,
        runs: 200
      }
     }    
    },

  }


};
