import { ERC20Token } from '@/state/erc20token/types';
import moment from 'moment';

export const MOCK_TOTALDEPOSITS = '12044.45';
export const MOCK_TOTALSUPPLY = '12044.45';
export const MOCK_START_TIME = 1642429321762;
export const MOCK_END_TIME = 1647526921762;

export const mockERC20Token: ERC20Token = {
  isValid: true,
  totalSupply: 12044.45,
  address: 'demo',
  name: 'Alpha Beta Club',
  owner: '0x9c6ce69f349430D31a2Bfbe5A052fc3e48AD28cf',
  tokenDecimals: 18,
  depositToken: '0xeb8f08a975Ab53E34D8a0330E0D34de942C95926',
  mintModule: '0x36d367884b5088465C0Ea2EaF52224a922DC71E6',
  symbol: '✺ABC',
  memberCount: 6,
  loading: false,
  maxMemberCount: 30,
  maxTotalSupply: 50000,
  requiredToken: '0x0000000000000000000000000000000000000000',
  depositsEnabled: true,
  claimEnabled: false,
  requiredTokenMinBalance: '0',
  maxTotalDeposits: 50000,
  startTime: 1637143634000,
  endTime: 1645092424000
};

const currentDate = moment();
const futureDate = moment(currentDate).add(3, 'M');

export const mockDepositERC20Token = {
  ...mockERC20Token,
  nativeDepositToken: false,
  depositsEnabled: true,
  claimEnabled: false,
  startTime: currentDate.valueOf(),
  endTime: futureDate.valueOf(),
  depositTokenSymbol: 'USDC',
  depositTokenDecimals: 6,
  depositTokenLogo: '/images/usdcIcon.svg'
};

export const mockActiveERC20Token = {
  ...mockERC20Token,
  nativeDepositToken: false,
  depositsEnabled: false,
  claimEnabled: false,
  startTime: 1637317202000,
  endTime: 1637921991000
};

export const mockDepositModeTokens = [
  {
    price: {
      usd: 3139.48
    },
    logo: '/images/ethereum-logo.svg',
    tokenDecimal: '18',
    tokenSymbol: 'ETH',
    tokenBalance: '3.520994431425648643',
    tokenName: 'Ethereum',
    tokenValue: 11356.016870066944
  },
  {
    price: {
      usd: 0.998976
    },
    logo: '/images/usdcIcon.svg',
    tokenDecimal: '18',
    tokenSymbol: 'USDC',
    tokenBalance: '289',
    tokenName: 'USD Coin',
    tokenValue: 0
  }
];

export const mockTokensResult = [
  ...mockDepositModeTokens,
  {
    price: {
      usd: 15.63
    },
    logo: '/images/prodTokenLogos/uniswap.svg',
    tokenDecimal: '6',
    tokenSymbol: 'UNI',
    tokenBalance: '116537.09788',
    tokenName: 'Uniswap',
    tokenValue: 0
  },
  {
    price: {
      usd: 213.21
    },
    logo: '/images/prodTokenLogos/AAVE.svg',
    tokenDecimal: '18',
    tokenSymbol: 'AAVE',
    tokenBalance: '5623',
    tokenName: 'Aave',
    tokenValue: 0
  },
  {
    price: {
      usd: 171.43
    },
    logo: '/images/prodTokenLogos/COMP.webp',
    tokenDecimal: '18',
    tokenSymbol: 'COMP',
    tokenBalance: '10000.52',
    tokenName: 'Compound',
    tokenValue: 0
  },
  {
    price: {
      usd: 0.0018349
    },
    logo: '/images/prodTokenLogos/lit.webp',
    tokenDecimal: '18',
    tokenSymbol: 'LIT',
    tokenBalance: '8322',
    tokenName: 'LIT',
    tokenValue: 0
  },
  {
    price: {
      usd: 2.47
    },
    logo: '/images/prodTokenLogos/gcr.jpeg',
    tokenDecimal: '18',
    tokenSymbol: 'GCR',
    tokenBalance: '435.52',
    tokenName: 'Global Coin Research',
    tokenValue: 0
  }
];

export const mockCollectiblesResult = [
  {
    name: 'CryptoPunk #8219',
    image:
      'https://lh3.googleusercontent.com/c2mUNM1mXC-iLI0Cx9VyLtinCC-R0yeaxSkPbXAT-LEU5PBOEQ1WGAvJkiTYWXWwgPPIkomgNgvhxeAHNeCj3z81mbrgqgIyb3JqOw',
    animation: null,
    permalink:
      'https://opensea.io/assets/0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb/8219',
    id: '8219',
    collection: {
      name: 'CryptoPunks',
      slug: 'cryptopunks'
    },
    slug: 'cryptopunks',
    description:
      'CryptoPunks launched as a fixed set of 10,000 items in mid-2017 and became one of the inspirations for the ERC-721 standard. They have been featured in places like The New York Times, Christie’s of London, Art|Basel Miami, and The PBS NewsHour.',
    floorPrice: 2.5,
    lastPurchasePrice: {
      lastPurchasePriceUSD: 8498,
      lastPurchasePriceETH: 3.5
    }
  },
  {
    name: 'taffeta, the appealing bangle',
    image:
      'https://lh3.googleusercontent.com/4JM5nMqOQ4oD6jyMpWbSGKeGJgG-NK80tI259nwm_O5dHFcEzq-05Bc6o0wK9flmwKqINKPkoerpL57f4zUoB_0HjqoqXnhucEQ-hw',
    animation: null,
    permalink:
      'https://opensea.io/assets/0x5180db8f5c931aae63c74266b211f580155ecac8/6575',
    id: '6575',
    collection: {
      name: 'Crypto Coven',
      slug: 'cryptocoven'
    },
    slug: 'cryptocoven',
    description:
      'You are a WITCH with cunning beyond measure. You pluck secrets from the universe like leaves from a tree. Your magic spawns from bone broth and broccoli. People from all places travel to linger below your balcony and bask in your beauty. FLOURISH MY FRIEND!',
    floorPrice: 1.6,
    lastPurchasePrice: {
      lastPurchasePriceUSD: 4321.84,
      lastPurchasePriceETH: 1.78
    }
  },
  {
    name: 'Woman #9517',
    image:
      'https://lh3.googleusercontent.com/KbQxvUgsipvBFfAarLpEDhqTSDyn37XH5458mxUGiIzyT06mT_hYt7yWdP1qT3T0U69KHIh8mDOcFza_geN_wc6YsPaZaW9qbAKJ',
    animation: null,
    permalink:
      'https://opensea.io/assets/0xe785e82358879f061bc3dcac6f0444462d4b5330/9517',
    id: '9517',
    collection: {
      name: 'World of Women',
      slug: 'world-of-women-nft'
    },
    slug: 'world-of-women-nft',
    description:
      'World of Women: 10,000 unique, cool and diverse Women living on the Blockchain.',
    floorPrice: 7,
    lastPurchasePrice: {
      lastPurchasePriceUSD: 14033.84,
      lastPurchasePriceETH: 4.78
    }
  },
  {
    name: 'Rug Radio X Clon',
    image:
      'https://lh3.googleusercontent.com/jWlCmq0OexehrvkV81gTrQLL1CTUYYu7HNphRzw1aqmh1ULpg0FOFViw4RXidDIHVl6gBp7kb7lBKzoykw5zA8U4HoAL424L9pIW6Q',
    animation: null,
    permalink:
      'https://opensea.io/assets/0x8ff1523091c9517bc328223d50b52ef450200339/14539',
    id: '14539',
    collection: {
      name: 'Rug Radio - Genesis NFT',
      slug: 'ruggenesis-nft'
    },
    slug: 'ruggenesis-nft',
    description:
      'The Rug Radio NFT is a Utility NFT that yields token based on the scarcity of the rug. The longer you hold the utility NFT, the more tokens you will receive.\n\nTokens yield per day:\n\nRare 1 & 2 = 11, Scarce 1 & 2 = 7, Standard = 5\n\nTo learn more about the RugRadio ecosystem, join our Discord or visit http://rug.fm/',
    floorPrice: 0.27,
    lastPurchasePrice: {
      lastPurchasePriceUSD: 607,
      lastPurchasePriceETH: 0.25
    }
  },
  {
    name: 'Bag #4765',
    image:
      'https://openseauserdata.com/files/c9c0126abc74d13fc960eca04a9ceefe.svg',
    animation: null,
    permalink:
      'https://opensea.io/assets/0xff9c1b15b16263c61d017ee9f65c50e4ae0113d7/4765',
    id: '4765',
    collection: {
      name: 'Loot (for Adventurers)',
      slug: 'lootproject'
    },
    slug: 'lootproject',
    description:
      'Loot is randomized adventurer gear generated and stored on chain. Stats, images, and other functionality are intentionally omitted for others to interpret. Feel free to use Loot in any way you want.',
    floorPrice: 2.29,
    lastPurchasePrice: {
      lastPurchasePriceUSD: 3860.52,
      lastPurchasePriceETH: 1.59
    }
  },
  {
    name: 'Runner #6651',
    image:
      'https://lh3.googleusercontent.com/aQ87u-dwedniQwsfK4QcDFpRYxmPXAmnGAuYOzgP0TuAhX0Z_-2sh5Ex3ulvFaQPQThnYcfNnGeFQiPKxtXypNGOMm01s4l9BQxw7Q',
    animation: null,
    permalink:
      'https://opensea.io/assets/0x97597002980134bea46250aa0510c9b90d87a587/6651',
    id: '6651',
    collection: {
      name: 'Chain Runners',
      slug: 'chain-runners-nft'
    },
    slug: 'chain-runners-nft',
    description:
      'Chain Runners are Mega City renegades 100% generated on chain.',
    floorPrice: 0.585,
    lastPurchasePrice: {
      lastPurchasePriceUSD: 728.4,
      lastPurchasePriceETH: 0.3
    }
  },
  {
    name: 'Poolsuite - Executive Member 233/2500',
    image:
      'https://lh3.googleusercontent.com/lhMnvlo5TQxWvRw8qMORrZjIjnr-XSUssLlasAZ0HWPv0mcHCCperdBpWZtwxG6mnzEro_TQRy5GQ38WIpUHpxdwaTtiYNuYpDxmUA',
    animation:
      'https://openseauserdata.com/files/9afe11a74bd18b52cb8b75fb7c2e84ce.mp4',
    permalink:
      'https://opensea.io/assets/0xb228d7b6e099618ca71bd5522b3a8c3788a8f172/233',
    id: '233',
    collection: {
      name: 'Poolsuite - Executive Member',
      slug: 'poolsuite-executive-member'
    },
    slug: 'poolsuite-executive-member',
    description:
      'Holding the Poolsuite Executive Member card suggests your esteemed presence within the crème de la crème of internet high society, and says a lot about the way you live your life on the web. This NFT can be connected to your account at Poolsuite.net to unlock perks, including early access to all Poolsuite projects.',
    floorPrice: 1.5,
    lastPurchasePrice: {
      lastPurchasePriceUSD: 3399.72,
      lastPurchasePriceETH: 1.4
    }
  },
  {
    name: "LIL' GUGGI PRPL HAZE #1",
    image:
      'https://lh3.googleusercontent.com/2Qc6cdnFPfwMkz1_iN13_hBXAM68wnaH1LlFFaJ7ScIILKlu4E9MhkBOUwll3-1T58m5ij9CT3GC6vDTGgtAaiuniZWqotePkb2A9A',
    animation:
      'https://openseauserdata.com/files/9ae3a91e5a481bdd50a5ee2e08b08760.mp4',
    permalink:
      'https://opensea.io/assets/0x066f2d5ead7951f0d0038c19affd500b9f02c0e5/13469',
    id: '13469',
    collection: {
      name: 'SUPERPLASTIC: Cryptojankyz',
      slug: 'cryptojankyz'
    },
    slug: 'cryptojankyz',
    description: null,
    floorPrice: 0.61,
    lastPurchasePrice: {
      lastPurchasePriceUSD: 1214,
      lastPurchasePriceETH: 0.5
    }
  },
  {
    name: 'Cool Cat #3155',
    image:
      'https://lh3.googleusercontent.com/kGd5K1UPnRVe2k_3na9U5IKsAKr2ERGHn6iSQwQBPGywEMcRWiKtFmUh85nuG0tBPKLVqaXsWqHKCEJidwa2w4oUgcITcJ7Kh-ObsA',
    animation: null,
    permalink:
      'https://opensea.io/assets/0x1a92f7381b9f03921564a437210bb9396471050c/3155',
    id: '3155',
    collection: {
      name: 'Cool Cats NFT',
      slug: 'cool-cats-nft'
    },
    slug: 'cool-cats-nft',
    description:
      'Cool Cats is a collection of 9,999 randomly generated and stylistically curated NFTs that exist on the Ethereum Blockchain. Cool Cat holders can participate in exclusive events such as NFT claims, raffles, community giveaways, and more. Remember, all cats are cool, but some are cooler than others. Visit [www.coolcatsnft.com](https://www.coolcatsnft.com/) to learn more.',
    floorPrice: 11.89,
    lastPurchasePrice: {
      lastPurchasePriceUSD: 25008.4,
      lastPurchasePriceETH: 10.3
    }
  },
  {
    name: 'One Year of Motion #8',
    image:
      'https://lh3.googleusercontent.com/zo-i2y1RCv734ZcOO203hYbg3ac2DgZ8hnp532jl0ygZs6DSS5yqogCSQndgzRqru8oclgb3yy8t7QNlBDEmFN_oH3xhW6a52VsDAw',
    animation:
      'https://litwtf.mypinata.cloud/ipfs/QmZMLMXFiXKLswGb5UM7zSnDgghKeZ9yKUUhSGsSTMZs1k/one_year_eth.html',
    permalink:
      'https://opensea.io/assets/0xfc0946b334b3ba133d239207a4d01da1b75cf51b/784',
    id: '3216',
    collection: {
      name: 'LIT Project Two: Motion',
      slug: 'lit-project-two-1'
    },
    slug: 'lit-project-two-1',
    description:
      'LIT Project Two with Robert De Niro is a dynamic NFT programmed to react to the movement of Ethereum in different time increments. Zoom in or zoom out. Reflect. Match multiple Motions for multiple perspectives. Every wallet needs a watcher.\n\nSmart contract & metadata by Transient Labs.',
    floorPrice: 0.1,
    lastPurchasePrice: {
      lastPurchasePriceUSD: 1699.6,
      lastPurchasePriceETH: 0.7
    }
  }
];

export const mockOffChainTransactionsData = {
  events: [
    {
      chainId: 5,
      ownerAddress: '0x1a83c6535d2f0aa701c950c861a43484d2a6e936',
      hash: '0x78ad7d5b3ec4ac9a5a563974f30018cf15723a0b5db01ae16053c7bd2f2e4acd',
      blockNumber: 7892425,
      timestamp: 1667594316,
      transactionIndex: 57,
      contractAddress: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
      transfers: [
        {
          chainId: 5,
          blockNumber: 7892425,
          timestamp: 1667594316,
          hash: '0x78ad7d5b3ec4ac9a5a563974f30018cf15723a0b5db01ae16053c7bd2f2e4acd',
          from: '0x1a83c6535d2f0aa701c950c861a43484d2a6e936',
          to: '0xd1b5206bd5f4fdc590d1c65a30a6dacd6476e8e4',
          contractAddress: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
          gas: '196080',
          tokenName: 'USD//C',
          tokenSymbol: 'USDC',
          tokenDecimal: 6,
          tokenLogo: '/images/TestnetTokenLogos/usdcIcon.svg',
          value: '780000'
        }
      ],
      annotation: null,
      syndicateEvents: [
        {
          eventType: 'MEMBER_DISTRIBUTED',
          id: '0x78ad7d5b3ec4ac9a5a563974f30018cf15723a0b5db01ae16053c7bd2f2e4acd-144-0x5b17a1dae9ebf4bc7a04579ae6cedf2afe7601c0',
          transactionId:
            '0x78ad7d5b3ec4ac9a5a563974f30018cf15723a0b5db01ae16053c7bd2f2e4acd',
          distributionBatch: 'c6265f07-b628-4562-b8e3-50abc4b82647'
        }
      ]
    },
    {
      chainId: 5,
      ownerAddress: '0x1a83c6535d2f0aa701c950c861a43484d2a6e936',
      hash: '0x469b3937e064ee1bd2a9a5acd60f29e7a17df49b1959f2e93436f5de08ca081d',
      blockNumber: 7892420,
      timestamp: 1667594256,
      transactionIndex: 134,
      contractAddress: '',
      transfers: [
        {
          chainId: 5,
          blockNumber: 7892420,
          timestamp: 1667594256,
          hash: '0x469b3937e064ee1bd2a9a5acd60f29e7a17df49b1959f2e93436f5de08ca081d',
          from: '0x1a83c6535d2f0aa701c950c861a43484d2a6e936',
          to: '0xd1261b73ed8ed9cd2551f9c3e97078b8b31b412b',
          contractAddress: '',
          gas: '103216',
          value: '6000000000000000'
        }
      ],
      annotation: null,
      syndicateEvents: [
        {
          eventType: 'MEMBER_DISTRIBUTED',
          id: '0x469b3937e064ee1bd2a9a5acd60f29e7a17df49b1959f2e93436f5de08ca081d-179-0x5b17a1dae9ebf4bc7a04579ae6cedf2afe7601c0',
          transactionId:
            '0x469b3937e064ee1bd2a9a5acd60f29e7a17df49b1959f2e93436f5de08ca081d',
          distributionBatch: 'c6265f07-b628-4562-b8e3-50abc4b82647'
        }
      ]
    },
    {
      chainId: 5,
      ownerAddress: '0x1a83c6535d2f0aa701c950c861a43484d2a6e936',
      hash: '0x7ea089af2d18c743c6e08ef689b80731aad6e5bb7e88d799a6e71e007a9a578c',
      blockNumber: 7727841,
      timestamp: 1665147252,
      transactionIndex: 106,
      contractAddress: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
      transfers: [
        {
          chainId: 5,
          blockNumber: 7727841,
          timestamp: 1665147252,
          hash: '0x7ea089af2d18c743c6e08ef689b80731aad6e5bb7e88d799a6e71e007a9a578c',
          from: '0xd741Bf017d6F97702897803F53E9c81FaF7d5B15',
          to: '0x1a83c6535d2f0aa701c950c861a43484d2a6e936',
          contractAddress: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
          gas: '329155',
          tokenName: 'USD//C',
          tokenSymbol: 'USDC',
          tokenDecimal: 6,
          tokenLogo: '/images/TestnetTokenLogos/usdcIcon.svg',
          value: '10000'
        }
      ],
      annotation: {
        chainId: 5,
        acquisitionDate: null,
        createdAt: '2022-10-07T13:00:38.134Z',
        updatedAt: '2022-11-07T16:36:49.890Z',
        equityStake: '',
        fromLabel: '',
        transactionId:
          '0x7ea089af2d18c743c6e08ef689b80731aad6e5bb7e88d799a6e71e007a9a578c',
        syndicateAddress: '0x1a83c6535D2f0aA701c950c861A43484D2a6E936',
        preMoneyValuation: '',
        postMoneyValuation: '',
        roundCategory: null,
        sharesAmount: '',
        toLabel: '',
        tokenAmount: '',
        transactionCategory: 'DEPOSIT',
        memo: '',
        companyName: '',
        annotationMetadata: {}
      },
      syndicateEvents: [
        {
          eventType: 'MEMBER_MINTED',
          id: '0x7ea089af2d18c743c6e08ef689b80731aad6e5bb7e88d799a6e71e007a9a578c-244',
          transactionId:
            '0x7ea089af2d18c743c6e08ef689b80731aad6e5bb7e88d799a6e71e007a9a578c',
          distributionBatch: null
        }
      ]
    },
    {
      chainId: 5,
      ownerAddress: '0x1a83c6535d2f0aa701c950c861a43484d2a6e936',
      hash: '0x7ea089af2d18c743c6e08ef689b80731aad6e5bb7e88d799a6e71e007a9a578c',
      blockNumber: 7727841,
      timestamp: 1665147252,
      transactionIndex: 106,
      contractAddress: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
      transfers: [
        {
          chainId: 5,
          blockNumber: 7727841,
          timestamp: 1665147252,
          hash: '0x7ea089af2d18c743c6e08ef689b80731aad6e5bb7e88d799a6e71e007a9a578c',
          from: '0x110BC6e5fe887beEBB260028D6C95E42a2B5269c',
          to: '0x1a83c6535d2f0aa701c950c861a43484d2a6e936',
          contractAddress: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
          gas: '329155',
          tokenName: 'USD//C',
          tokenSymbol: 'USDC',
          tokenDecimal: 6,
          tokenLogo: '/images/TestnetTokenLogos/usdcIcon.svg',
          value: '10000'
        }
      ],
      annotation: {
        chainId: 5,
        acquisitionDate: null,
        createdAt: '2022-10-07T13:00:38.134Z',
        updatedAt: '2022-11-07T16:36:49.890Z',
        equityStake: '',
        fromLabel: '',
        transactionId:
          '0x7ea089af2d18c743c6e08ef689b80731aad6e5bb7e88d799a6e71e007a9a578c',
        syndicateAddress: '0x1a83c6535D2f0aA701c950c861A43484D2a6E936',
        preMoneyValuation: '',
        postMoneyValuation: '',
        roundCategory: null,
        sharesAmount: '',
        toLabel: '',
        tokenAmount: '',
        transactionCategory: 'INVESTMENT',
        memo: '',
        companyName: '',
        annotationMetadata: {}
      },
      syndicateEvents: [
        {
          eventType: 'MEMBER_MINTED',
          id: '0x7ea089af2d18c743c6e08ef689b80731aad6e5bb7e88d799a6e71e007a9a578c-244',
          transactionId:
            '0x7ea089af2d18c743c6e08ef689b80731aad6e5bb7e88d799a6e71e007a9a578c',
          distributionBatch: null
        }
      ]
    },
    {
      chainId: 5,
      ownerAddress: '0x1a83c6535d2f0aa701c950c861a43484d2a6e936',
      hash: '0x7ea089af2d18c743c6e08ef689b80731aad6e5bb7e88d799a6e71e007a9a578c',
      blockNumber: 7727841,
      timestamp: 1665147252,
      transactionIndex: 106,
      contractAddress: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
      transfers: [
        {
          chainId: 5,
          blockNumber: 7727841,
          timestamp: 1665147252,
          hash: '0x7ea089af2d18c743c6e08ef689b80731aad6e5bb7e88d799a6e71e007a9a578c',
          from: '0xFb1F38d89628A2C12854807a15e7dBe93C84DB03',
          to: '0x1a83c6535d2f0aa701c950c861a43484d2a6e936',
          contractAddress: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
          gas: '329155',
          tokenName: 'USD//C',
          tokenSymbol: 'USDC',
          tokenDecimal: 6,
          tokenLogo: '/images/TestnetTokenLogos/usdcIcon.svg',
          value: '10000'
        }
      ],
      annotation: {
        chainId: 5,
        acquisitionDate: null,
        createdAt: '2022-10-07T13:00:38.134Z',
        updatedAt: '2022-11-07T16:36:49.890Z',
        equityStake: '',
        fromLabel: '',
        transactionId:
          '0x7ea089af2d18c743c6e08ef689b80731aad6e5bb7e88d799a6e71e007a9a578c',
        syndicateAddress: '0x1a83c6535D2f0aA701c950c861A43484D2a6E936',
        preMoneyValuation: '',
        postMoneyValuation: '',
        roundCategory: null,
        sharesAmount: '',
        toLabel: '',
        tokenAmount: '',
        transactionCategory: 'OTHER',
        memo: '',
        companyName: '',
        annotationMetadata: {}
      },
      syndicateEvents: [
        {
          eventType: 'MEMBER_MINTED',
          id: '0x7ea089af2d18c743c6e08ef689b80731aad6e5bb7e88d799a6e71e007a9a578c-244',
          transactionId:
            '0x7ea089af2d18c743c6e08ef689b80731aad6e5bb7e88d799a6e71e007a9a578c',
          distributionBatch: null
        }
      ]
    },
    {
      chainId: 5,
      ownerAddress: '0x1a83c6535d2f0aa701c950c861a43484d2a6e936',
      hash: '0x7ea089af2d18c743c6e08ef689b80731aad6e5bb7e88d799a6e71e007a9a578c',
      blockNumber: 7727841,
      timestamp: 1665147252,
      transactionIndex: 106,
      contractAddress: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
      transfers: [
        {
          chainId: 5,
          blockNumber: 7727841,
          timestamp: 1665147252,
          hash: '0x7ea089af2d18c743c6e08ef689b80731aad6e5bb7e88d799a6e71e007a9a578c',
          from: '0x7cE087be0a01eFD0f09ab8fd7B6e9ca34A3Af39b',
          to: '0x1a83c6535d2f0aa701c950c861a43484d2a6e936',
          contractAddress: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
          gas: '329155',
          tokenName: 'USD//C',
          tokenSymbol: 'USDC',
          tokenDecimal: 6,
          tokenLogo: '/images/TestnetTokenLogos/usdcIcon.svg',
          value: '10000'
        }
      ],
      annotation: {
        chainId: 5,
        acquisitionDate: null,
        createdAt: '2022-10-07T13:00:38.134Z',
        updatedAt: '2022-11-07T16:36:49.890Z',
        equityStake: '',
        fromLabel: '',
        transactionId:
          '0x7ea089af2d18c743c6e08ef689b80731aad6e5bb7e88d799a6e71e007a9a578c',
        syndicateAddress: '0x1a83c6535D2f0aA701c950c861A43484D2a6E936',
        preMoneyValuation: '',
        postMoneyValuation: '',
        roundCategory: null,
        sharesAmount: '',
        toLabel: '',
        tokenAmount: '',
        transactionCategory: 'UNCATEGORIZED',
        memo: '',
        companyName: '',
        annotationMetadata: {}
      },
      syndicateEvents: [
        {
          eventType: 'MEMBER_MINTED',
          id: '0x7ea089af2d18c743c6e08ef689b80731aad6e5bb7e88d799a6e71e007a9a578c-244',
          transactionId:
            '0x7ea089af2d18c743c6e08ef689b80731aad6e5bb7e88d799a6e71e007a9a578c',
          distributionBatch: null
        }
      ]
    },
    {
      chainId: 5,
      ownerAddress: '0x1a83c6535d2f0aa701c950c861a43484d2a6e936',
      hash: '0x7ea089af2d18c743c6e08ef689b80731aad6e5bb7e88d799a6e71e007a9a578c',
      blockNumber: 7727841,
      timestamp: 1665147252,
      transactionIndex: 106,
      contractAddress: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
      transfers: [
        {
          chainId: 5,
          blockNumber: 7727841,
          timestamp: 1665147252,
          hash: '0x7ea089af2d18c743c6e08ef689b80731aad6e5bb7e88d799a6e71e007a9a578c',
          from: '0x5b17a1dae9ebf4bc7a04579ae6cedf2afe7601c0',
          to: '0x1a83c6535d2f0aa701c950c861a43484d2a6e936',
          contractAddress: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
          gas: '329155',
          tokenName: 'USD//C',
          tokenSymbol: 'USDC',
          tokenDecimal: 6,
          tokenLogo: '/images/TestnetTokenLogos/usdcIcon.svg',
          value: '10000'
        }
      ],
      annotation: {
        chainId: 5,
        acquisitionDate: null,
        createdAt: '2022-10-07T13:00:38.134Z',
        updatedAt: '2022-11-07T16:36:49.890Z',
        equityStake: '',
        fromLabel: '',
        transactionId:
          '0x7ea089af2d18c743c6e08ef689b80731aad6e5bb7e88d799a6e71e007a9a578c',
        syndicateAddress: '0x1a83c6535D2f0aA701c950c861A43484D2a6E936',
        preMoneyValuation: '',
        postMoneyValuation: '',
        roundCategory: null,
        sharesAmount: '',
        toLabel: '',
        tokenAmount: '',
        transactionCategory: 'DEPOSIT',
        memo: '',
        companyName: '',
        annotationMetadata: {}
      },
      syndicateEvents: [
        {
          eventType: 'MEMBER_MINTED',
          id: '0x7ea089af2d18c743c6e08ef689b80731aad6e5bb7e88d799a6e71e007a9a578c-244',
          transactionId:
            '0x7ea089af2d18c743c6e08ef689b80731aad6e5bb7e88d799a6e71e007a9a578c',
          distributionBatch: null
        }
      ]
    }
  ]
};

export const mockClubMembers = [
  {
    id: '0x563c573144798fff330207b32d37537dbb517503',
    ownershipShare: '316494',
    depositAmount: '3812000000',
    tokens: '3812000000000000000000',
    members: [
      {
        id: '0x0563a7ab3da117e694c6b85f80a20ad5dbbad6b9-0x563c573144798fff330207b32d37537dbb517503',
        depositAmount: '20000000000000000',
        tokens: 200000000000000000000,
        createdAt: '0',
        member: {
          id: '',
          memberAddress: '0x0574db630bb75dbe4310fbd6eb08dc47048b6fad'
        }
      }
    ],
    totalSupply: '200000000000000000000',
    totalDeposits: '20000000000000000',
    contractAddress: '0x563c573144798fff330207b32d37537dbb517503',
    startTime: '1670502092',
    endTime: '1673180480'
  },
  {
    id: '0x563c573144798fff330207b32d37537dbb5rtehd',
    ownershipShare: '523228',
    depositAmount: '6302000000',
    tokens: '6302000000000000000000',
    members: [
      {
        id: '0x0563a7ab3da117e694c6b85f80a20ad5dbbad6b9-0x563c573144798fff330207b32d37537dbb517503',
        depositAmount: '20000000000000000',
        tokens: 200000000000000000000,
        createdAt: '0',
        member: {
          id: '',
          memberAddress: '0x0574db630bb75dbe4310fbd6eb08dc47048b6fad'
        }
      }
    ],
    totalSupply: '200000000000000000000',
    totalDeposits: '20000000000000000',
    contractAddress: '0x563c573144798fff330207b32d37537dbb517503',
    startTime: '1670502092',
    endTime: '1673180480'
  },
  {
    id: '0x563c573144798fff330207b32d37537dbb5rtehd',
    ownershipShare: '523228',
    depositAmount: '6302000000',
    tokens: '6302000000000000000000',
    members: [
      {
        id: '0x0563a7ab3da117e694c6b85f80hgfhjfhgfhnfjh-0x563c573144798fff330207b32d37537dbb517503',
        ownershipShare: '1033',
        depositAmount: '12450000',
        tokens: '12450000000000000000',
        createdAt: '0',
        member: {
          id: '',
          memberAddress: '0x0cba94a2e458ccace1cc5bac0f05c0c67d9680fd'
        }
      }
    ],
    totalSupply: '200000000000000000000',
    totalDeposits: '20000000000000000',
    contractAddress: '0x563c573144798fff330207b32d37537dbb517503',
    startTime: '1670502092',
    endTime: '1673180480'
  },
  {
    id: '0x563c573144798fff330207b32d37537dbb5rtehd',
    ownershipShare: '523228',
    depositAmount: '6302000000',
    tokens: '6302000000000000000000',
    members: [
      {
        id: '0x0563a7ab3da117e694c6b85f80hgfhjfhgfhnfjh-0x563c573144798fff330207b32d37537dbb517503',
        ownershipShare: '35618',
        depositAmount: '429000000',
        tokens: '429000000000000000000',
        createdAt: '0',
        member: {
          id: '',
          memberAddress: '0x3b01acd0e53f7c3a636758cb19044325959f96cb'
        }
      }
    ],
    totalSupply: '200000000000000000000',
    totalDeposits: '20000000000000000',
    contractAddress: '0x563c573144798fff330207b32d37537dbb517503',
    startTime: '1670502092',
    endTime: '1673180480'
  }
];

export const mockDataMintEvents = [
  {
    memberAddress: '0x005d3f75730cf16e25208bcb27ca941d33db9f8a',
    createdAt: '1665758104'
  },
  {
    memberAddress: '0x0574db630bb75dbe4310fbd6eb08dc47048b6fad',
    createdAt: '1665718104'
  },
  {
    memberAddress: '0x0cba94a2e458ccace1cc5bac0f05c0c67d9680fd',
    createdAt: '1665728304'
  },
  {
    memberAddress: '0x3b01acd0e53f7c3a636758cb19044325959f96cb',
    createdAt: '1665738304'
  },
  {
    memberAddress: '0x50ccff161ce2751fcfcdc6cf3ec9cc85c933af25',
    createdAt: '1665748304'
  },
  {
    memberAddress: '0x7cd2d1c36d287f7db66ed74477813f87ef33bf91',
    createdAt: '1665758304'
  }
];

export const mockActivityDepositTransactionsData = {
  events: [
    {
      chainId: 5,
      ownerAddress: '0x1a83c6535d2f0aa701c950c861a43484d2a6e936',
      hash: '0x78ad7d5b3ec4ac9a5a563974f30018cf15723a0b5db01ae16053c7bd2f2e4acd',
      blockNumber: 7892425,
      timestamp: 1667594316,
      transactionIndex: 57,
      contractAddress: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
      transfers: [
        {
          chainId: 5,
          blockNumber: 7892425,
          timestamp: 1667594316,
          hash: '0x78ad7d5b3ec4ac9a5a563974f30018cf15723a0b5db01ae16053c7bd2f2e4acd',
          from: '0x1a83c6535d2f0aa701c950c861a43484d2a6e936',
          to: '0xd1b5206bd5f4fdc590d1c65a30a6dacd6476e8e4',
          contractAddress: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
          gas: '196080',
          tokenName: 'USD//C',
          tokenSymbol: 'USDC',
          tokenDecimal: 6,
          tokenLogo: '/images/TestnetTokenLogos/usdcIcon.svg',
          value: '780000'
        }
      ],
      annotation: null,
      syndicateEvents: [
        {
          eventType: 'MEMBER_DISTRIBUTED',
          id: '0x78ad7d5b3ec4ac9a5a563974f30018cf15723a0b5db01ae16053c7bd2f2e4acd-144-0x5b17a1dae9ebf4bc7a04579ae6cedf2afe7601c0',
          transactionId:
            '0x78ad7d5b3ec4ac9a5a563974f30018cf15723a0b5db01ae16053c7bd2f2e4acd',
          distributionBatch: 'c6265f07-b628-4562-b8e3-50abc4b82647'
        }
      ]
    },
    {
      chainId: 5,
      ownerAddress: '0x1a83c6535d2f0aa701c950c861a43484d2a6e936',
      hash: '0x469b3937e064ee1bd2a9a5acd60f29e7a17df49b1959f2e93436f5de08ca081d',
      blockNumber: 7892420,
      timestamp: 1667594256,
      transactionIndex: 134,
      contractAddress: '',
      transfers: [
        {
          chainId: 5,
          blockNumber: 7892420,
          timestamp: 1667594256,
          hash: '0x469b3937e064ee1bd2a9a5acd60f29e7a17df49b1959f2e93436f5de08ca081d',
          from: '0x1a83c6535d2f0aa701c950c861a43484d2a6e936',
          to: '0xd1261b73ed8ed9cd2551f9c3e97078b8b31b412b',
          contractAddress: '',
          gas: '103216',
          value: '6000000000000000'
        }
      ],
      annotation: null,
      syndicateEvents: [
        {
          eventType: 'MEMBER_DISTRIBUTED',
          id: '0x469b3937e064ee1bd2a9a5acd60f29e7a17df49b1959f2e93436f5de08ca081d-179-0x5b17a1dae9ebf4bc7a04579ae6cedf2afe7601c0',
          transactionId:
            '0x469b3937e064ee1bd2a9a5acd60f29e7a17df49b1959f2e93436f5de08ca081d',
          distributionBatch: 'c6265f07-b628-4562-b8e3-50abc4b82647'
        }
      ]
    },
    {
      chainId: 5,
      ownerAddress: '0x1a83c6535d2f0aa701c950c861a43484d2a6e936',
      hash: '0x7ea089af2d18c743c6e08ef689b80731aad6e5bb7e88d799a6e71e007a9a578c',
      blockNumber: 7727841,
      timestamp: 1665147252,
      transactionIndex: 106,
      contractAddress: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
      transfers: [
        {
          chainId: 5,
          blockNumber: 7727841,
          timestamp: 1665147252,
          hash: '0x7ea089af2d18c743c6e08ef689b80731aad6e5bb7e88d799a6e71e007a9a578c',
          from: '0xd741Bf017d6F97702897803F53E9c81FaF7d5B15',
          to: '0x1a83c6535d2f0aa701c950c861a43484d2a6e936',
          contractAddress: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
          gas: '329155',
          tokenName: 'USD//C',
          tokenSymbol: 'USDC',
          tokenDecimal: 6,
          tokenLogo: '/images/TestnetTokenLogos/usdcIcon.svg',
          value: '10000'
        }
      ],
      annotation: {
        chainId: 5,
        acquisitionDate: null,
        createdAt: '2022-10-07T13:00:38.134Z',
        updatedAt: '2022-11-07T16:36:49.890Z',
        equityStake: '',
        fromLabel: '',
        transactionId:
          '0x7ea089af2d18c743c6e08ef689b80731aad6e5bb7e88d799a6e71e007a9a578c',
        syndicateAddress: '0x1a83c6535D2f0aA701c950c861A43484D2a6E936',
        preMoneyValuation: '',
        postMoneyValuation: '',
        roundCategory: null,
        sharesAmount: '',
        toLabel: '',
        tokenAmount: '',
        transactionCategory: 'DEPOSIT',
        memo: '',
        companyName: '',
        annotationMetadata: {}
      },
      syndicateEvents: [
        {
          eventType: 'MEMBER_MINTED',
          id: '0x7ea089af2d18c743c6e08ef689b80731aad6e5bb7e88d799a6e71e007a9a578c-244',
          transactionId:
            '0x7ea089af2d18c743c6e08ef689b80731aad6e5bb7e88d799a6e71e007a9a578c',
          distributionBatch: null
        }
      ]
    },
    {
      chainId: 5,
      ownerAddress: '0x1a83c6535d2f0aa701c950c861a43484d2a6e936',
      hash: '0x7ea089af2d18c743c6e08ef689b80731aad6e5bb7e88d799a6e71e007a9a578c',
      blockNumber: 7727841,
      timestamp: 1665147252,
      transactionIndex: 106,
      contractAddress: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
      transfers: [
        {
          chainId: 5,
          blockNumber: 7727841,
          timestamp: 1665147252,
          hash: '0x7ea089af2d18c743c6e08ef689b80731aad6e5bb7e88d799a6e71e007a9a578c',
          from: '0x110BC6e5fe887beEBB260028D6C95E42a2B5269c',
          to: '0x1a83c6535d2f0aa701c950c861a43484d2a6e936',
          contractAddress: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
          gas: '329155',
          tokenName: 'USD//C',
          tokenSymbol: 'USDC',
          tokenDecimal: 6,
          tokenLogo: '/images/TestnetTokenLogos/usdcIcon.svg',
          value: '10000'
        }
      ],
      annotation: {
        chainId: 5,
        acquisitionDate: null,
        createdAt: '2022-10-07T13:00:38.134Z',
        updatedAt: '2022-11-07T16:36:49.890Z',
        equityStake: '',
        fromLabel: '',
        transactionId:
          '0x7ea089af2d18c743c6e08ef689b80731aad6e5bb7e88d799a6e71e007a9a578c',
        syndicateAddress: '0x1a83c6535D2f0aA701c950c861A43484D2a6E936',
        preMoneyValuation: '',
        postMoneyValuation: '',
        roundCategory: null,
        sharesAmount: '',
        toLabel: '',
        tokenAmount: '',
        transactionCategory: 'INVESTMENT',
        memo: '',
        companyName: '',
        annotationMetadata: {}
      },
      syndicateEvents: [
        {
          eventType: 'MEMBER_MINTED',
          id: '0x7ea089af2d18c743c6e08ef689b80731aad6e5bb7e88d799a6e71e007a9a578c-244',
          transactionId:
            '0x7ea089af2d18c743c6e08ef689b80731aad6e5bb7e88d799a6e71e007a9a578c',
          distributionBatch: null
        }
      ]
    },
    {
      chainId: 5,
      ownerAddress: '0x1a83c6535d2f0aa701c950c861a43484d2a6e936',
      hash: '0x7ea089af2d18c743c6e08ef689b80731aad6e5bb7e88d799a6e71e007a9a578c',
      blockNumber: 7727841,
      timestamp: 1665147252,
      transactionIndex: 106,
      contractAddress: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
      transfers: [
        {
          chainId: 5,
          blockNumber: 7727841,
          timestamp: 1665147252,
          hash: '0x7ea089af2d18c743c6e08ef689b80731aad6e5bb7e88d799a6e71e007a9a578c',
          from: '0xFb1F38d89628A2C12854807a15e7dBe93C84DB03',
          to: '0x1a83c6535d2f0aa701c950c861a43484d2a6e936',
          contractAddress: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
          gas: '329155',
          tokenName: 'USD//C',
          tokenSymbol: 'USDC',
          tokenDecimal: 6,
          tokenLogo: '/images/TestnetTokenLogos/usdcIcon.svg',
          value: '10000'
        }
      ],
      annotation: {
        chainId: 5,
        acquisitionDate: null,
        createdAt: '2022-10-07T13:00:38.134Z',
        updatedAt: '2022-11-07T16:36:49.890Z',
        equityStake: '',
        fromLabel: '',
        transactionId:
          '0x7ea089af2d18c743c6e08ef689b80731aad6e5bb7e88d799a6e71e007a9a578c',
        syndicateAddress: '0x1a83c6535D2f0aA701c950c861A43484D2a6E936',
        preMoneyValuation: '',
        postMoneyValuation: '',
        roundCategory: null,
        sharesAmount: '',
        toLabel: '',
        tokenAmount: '',
        transactionCategory: 'OTHER',
        memo: '',
        companyName: '',
        annotationMetadata: {}
      },
      syndicateEvents: [
        {
          eventType: 'MEMBER_MINTED',
          id: '0x7ea089af2d18c743c6e08ef689b80731aad6e5bb7e88d799a6e71e007a9a578c-244',
          transactionId:
            '0x7ea089af2d18c743c6e08ef689b80731aad6e5bb7e88d799a6e71e007a9a578c',
          distributionBatch: null
        }
      ]
    },
    {
      chainId: 5,
      ownerAddress: '0x1a83c6535d2f0aa701c950c861a43484d2a6e936',
      hash: '0x7ea089af2d18c743c6e08ef689b80731aad6e5bb7e88d799a6e71e007a9a578c',
      blockNumber: 7727841,
      timestamp: 1665147252,
      transactionIndex: 106,
      contractAddress: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
      transfers: [
        {
          chainId: 5,
          blockNumber: 7727841,
          timestamp: 1665147252,
          hash: '0x7ea089af2d18c743c6e08ef689b80731aad6e5bb7e88d799a6e71e007a9a578c',
          from: '0x7cE087be0a01eFD0f09ab8fd7B6e9ca34A3Af39b',
          to: '0x1a83c6535d2f0aa701c950c861a43484d2a6e936',
          contractAddress: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
          gas: '329155',
          tokenName: 'USD//C',
          tokenSymbol: 'USDC',
          tokenDecimal: 6,
          tokenLogo: '/images/TestnetTokenLogos/usdcIcon.svg',
          value: '10000'
        }
      ],
      annotation: {
        chainId: 5,
        acquisitionDate: null,
        createdAt: '2022-10-07T13:00:38.134Z',
        updatedAt: '2022-11-07T16:36:49.890Z',
        equityStake: '',
        fromLabel: '',
        transactionId:
          '0x7ea089af2d18c743c6e08ef689b80731aad6e5bb7e88d799a6e71e007a9a578c',
        syndicateAddress: '0x1a83c6535D2f0aA701c950c861A43484D2a6E936',
        preMoneyValuation: '',
        postMoneyValuation: '',
        roundCategory: null,
        sharesAmount: '',
        toLabel: '',
        tokenAmount: '',
        transactionCategory: 'UNCATEGORIZED',
        memo: '',
        companyName: '',
        annotationMetadata: {}
      },
      syndicateEvents: [
        {
          eventType: 'MEMBER_MINTED',
          id: '0x7ea089af2d18c743c6e08ef689b80731aad6e5bb7e88d799a6e71e007a9a578c-244',
          transactionId:
            '0x7ea089af2d18c743c6e08ef689b80731aad6e5bb7e88d799a6e71e007a9a578c',
          distributionBatch: null
        }
      ]
    },
    {
      chainId: 5,
      ownerAddress: '0x1a83c6535d2f0aa701c950c861a43484d2a6e936',
      hash: '0x7ea089af2d18c743c6e08ef689b80731aad6e5bb7e88d799a6e71e007a9a578c',
      blockNumber: 7727841,
      timestamp: 1665147252,
      transactionIndex: 106,
      contractAddress: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
      transfers: [
        {
          chainId: 5,
          blockNumber: 7727841,
          timestamp: 1665147252,
          hash: '0x7ea089af2d18c743c6e08ef689b80731aad6e5bb7e88d799a6e71e007a9a578c',
          from: '0x5b17a1dae9ebf4bc7a04579ae6cedf2afe7601c0',
          to: '0x1a83c6535d2f0aa701c950c861a43484d2a6e936',
          contractAddress: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
          gas: '329155',
          tokenName: 'USD//C',
          tokenSymbol: 'USDC',
          tokenDecimal: 6,
          tokenLogo: '/images/TestnetTokenLogos/usdcIcon.svg',
          value: '10000'
        }
      ],
      annotation: {
        chainId: 5,
        acquisitionDate: null,
        createdAt: '2022-10-07T13:00:38.134Z',
        updatedAt: '2022-11-07T16:36:49.890Z',
        equityStake: '',
        fromLabel: '',
        transactionId:
          '0x7ea089af2d18c743c6e08ef689b80731aad6e5bb7e88d799a6e71e007a9a578c',
        syndicateAddress: '0x1a83c6535D2f0aA701c950c861A43484D2a6E936',
        preMoneyValuation: '',
        postMoneyValuation: '',
        roundCategory: null,
        sharesAmount: '',
        toLabel: '',
        tokenAmount: '',
        transactionCategory: 'DEPOSIT',
        memo: '',
        companyName: '',
        annotationMetadata: {}
      },
      syndicateEvents: [
        {
          eventType: 'MEMBER_MINTED',
          id: '0x7ea089af2d18c743c6e08ef689b80731aad6e5bb7e88d799a6e71e007a9a578c-244',
          transactionId:
            '0x7ea089af2d18c743c6e08ef689b80731aad6e5bb7e88d799a6e71e007a9a578c',
          distributionBatch: null
        }
      ]
    }
  ]
};

// TODO [ENG-4613]: Make mock transactions data more detailed moving forward

const combinedActivityTransactions = [
  ...mockActivityDepositTransactionsData.events,
  ...mockOffChainTransactionsData.events
];
export const mockActivityTransactionsData = {
  events: combinedActivityTransactions,
  totalCount: combinedActivityTransactions.length
};
