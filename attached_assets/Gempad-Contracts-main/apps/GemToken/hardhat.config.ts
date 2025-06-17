import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import 'hardhat-dependency-compiler';
import '@nomiclabs/hardhat-ethers';
import dotenv from 'dotenv';
dotenv.config();

const OLD_COMPILER_SETTING = {
  version: '0.6.12',
  settings: {
    evmVersion: 'istanbul',
    optimizer: {
      enabled: true,
      runs: 1_000
    }
    // metadata: {
    //   bytecodeHash: 'none'
    // }
  }
};
const LOW_OPTIMIZER_COMPILER_SETTINGS = {
  version: '0.7.6',
  settings: {
    evmVersion: 'istanbul',
    optimizer: {
      enabled: true,
      runs: 2_000
    }
    // metadata: {
    //   bytecodeHash: 'none'
    // }
  }
};

const LOWEST_OPTIMIZER_COMPILER_SETTINGS = {
  version: '0.4.6',
  settings: {
    evmVersion: 'istanbul',
    optimizer: {
      enabled: true,
      runs: 1_000
    }
    // metadata: {
    //   bytecodeHash: 'none'
    // }
  }
};

const DEFAULT_COMPILER_SETTINGS = {
  version: '0.6.6',
  settings: {
    evmVersion: 'istanbul',
    optimizer: {
      enabled: true,
      runs: 1_000_000
    }
    // metadata: {
    //   bytecodeHash: 'none'
    // }
  }
};
const HIGH_COMPILER_SETTINGS = {
  version: '0.8.0',
  settings: {
    evmVersion: 'istanbul',
    optimizer: {
      enabled: true,
      runs: 1_000_000
    }
    // metadata: {
    //   bytecodeHash: 'none'
    // }
  }
};
const LOW_COMPILER_SETTINGS = {
  version: '0.5.16',
  settings: {
    evmVersion: 'istanbul',
    optimizer: {
      enabled: true,
      runs: 1_000_000
    }
    // metadata: {
    //   bytecodeHash: 'none'
    // }
  }
};
const LOWEST_COMPILER_SETTINGS = {
  version: '0.4.18',
  settings: {
    evmVersion: 'istanbul',
    optimizer: {
      enabled: true,
      runs: 1_000_000
    }
    // metadata: {
    //   bytecodeHash: 'none'
    // }
  }
};
const INFURA_API_KEY = process.env.INFURA_API_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      allowUnlimitedContractSize: false
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`
    },
    kovan: {
      url: `https://kovan.infura.io/v3/${process.env.INFURA_API_KEY}`
    },
    fantom: {
      url: `https://rpc.testnet.fantom.network/`,
      ...(PRIVATE_KEY
        ? {
            accounts: {
              mnemonic: process.env.MNEMONIC
            }
          }
        : {})
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/62ec440605704708ae6e5eae7e31070b`,
      ...(PRIVATE_KEY
        ? {
            accounts: {
              mnemonic: process.env.MNEMONIC
            }
          }
        : {})
    },
    aGoerli: {
      url: `https://arb.getblock.io/95eb7b5c-2070-472c-b4aa-24a0210aafd2/goerli/`,
      ...(PRIVATE_KEY
        ? {
            accounts: {
              mnemonic: process.env.MNEMONIC
            }
          }
        : {})
    },
    matic: {
      url: `https://matic.getblock.io/ffffdd13-3053-4307-83ec-88a86b18b9a5/testnet/`,
      ...(PRIVATE_KEY
        ? {
            accounts: {
              mnemonic: process.env.MNEMONIC
            }
          }
        : {})
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
      ...(PRIVATE_KEY
        ? {
            accounts: {
              mnemonic: process.env.MNEMONIC
            }
          }
        : {})
    },
    bsc: {
      url: `https://go.getblock.io/ff73df48f4d849a08c3ef5dd0416fb99`,
      ...(PRIVATE_KEY
        ? {
            accounts: {
              mnemonic: process.env.MNEMONIC
            }
          }
        : {})
    },
    arbitrumRinkeby: {
      url: `https://arbitrum-rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`
    },
    arbitrum: {
      url: `https://arbitrum-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`
    },
    optimismKovan: {
      url: `https://optimism-kovan.infura.io/v3/${process.env.INFURA_API_KEY}`
    },
    optimism: {
      url: `https://optimism-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`
    }
  },

  etherscan: {
    apiKey: {
      goerli: process.env.ETHERSCAN_API_KEY!,
      bscTestnet: process.env.BSC_API_KEY!,
      ftmTestnet: process.env.FTM_API_KEY!
    }
  },

  solidity: {
    compilers: [
      {
        version: '0.8.20',
        settings: {
          evmVersion: 'istanbul',
          optimizer: {
            enabled: true,
            runs: 1_000
          }
        }
      },
      DEFAULT_COMPILER_SETTINGS,
      LOW_COMPILER_SETTINGS,
      LOWEST_COMPILER_SETTINGS,
      OLD_COMPILER_SETTING,
      HIGH_COMPILER_SETTINGS,
      LOW_OPTIMIZER_COMPILER_SETTINGS
    ]
  },
  dependencyCompiler: {
    paths: []
  }
};

export default config;
