import { ERC20Token } from '@/state/erc20token/types';
import moment from 'moment';

export const MOCK_TOTALDEPOSITS = '12044.45';
export const MOCK_TOTALSUPPLY = '12044.45';
export const MOCK_START_TIME = 1642429321762;
export const MOCK_END_TIME = 1647526921762;

export const mockERC20Token: ERC20Token = {
  totalSupply: 12044.45,
  address: 'demo',
  name: 'Alpha Beta Club',
  owner: '',
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
  ethDepositToken: false,
  depositsEnabled: true,
  claimEnabled: false,
  startTime: currentDate.valueOf(),
  endTime: futureDate.valueOf(),
  depositTokenSymbol: 'USDC'
};

export const mockActiveERC20Token = {
  ...mockERC20Token,
  ethDepositToken: false,
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
    logo: '/images/prodTokenLogos/uniswap.webp',
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
    logo: '/images/prodTokenLogos/AAVE.webp',
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
      'https://storage.opensea.io/files/c9c0126abc74d13fc960eca04a9ceefe.svg',
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
      'https://storage.opensea.io/files/e0fee0abaae253fa23113817bfcd6bd8.svg',
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
      'https://storage.opensea.io/files/9afe11a74bd18b52cb8b75fb7c2e84ce.mp4',
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
      'https://storage.opensea.io/files/9ae3a91e5a481bdd50a5ee2e08b08760.mp4',
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
  edges: [
    {
      blockNumber: 9748684,
      blockTimestamp: 1638513806,
      contractAddress: '0xeb8f08a975ab53e34d8a0330e0d34de942c95926',
      cumulativeGasUsed: 804171,
      events: [],
      fromAddress: '0x2502947319f2166ef46f0a7c081d23c63f88112b',
      gasLimit: 51804,
      gasPrice: 1500000009,
      gasUsed: 34536,
      hash: '0xcb6159194da765bc699fc1ff563d0c16aff0fa80376085ee39fc84b0288b2b77',
      isError: false,
      isOutgoingTransaction: true,
      metadata: {
        acquisitionDate: '2022-01-25T00:00:00.000Z',
        companyName: 'Syndicate Demo Inc.',
        roundCategory: 'Seed',
        postMoneyValuation: '50000',
        memo: "As discussed over Telegram, we've decided to allocate 50,000 USD towards Syndicate Demo Inc. in exchange for 1% share of their governance token.",
        fullyDilutedOwnershipStake: '1',
        preMoneyValuation: '50000',
        numberShares: '',
        numberTokens: '100000',

        __typename: 'Financial_TransactionAnnotation',
        annotationMetadata: {},
        createdAt: '2022-01-25T00:00:00.000Z',
        fromLabel: '',
        toLabel: '',
        transactionCategory: 'INVESTMENT',
        transactionId:
          '0xcb6159194da765bc699fc1ff563d0c16aff0fa80376085ee39fc84b0288b2b77',
        updatedAt: '2022-01-14T11:07:29.954Z'
      },
      syndicateAddress: '0x2502947319f2166eF46f0a7c081D23C63f88112B',
      toAddress: '0x3b01acd0e53f7c3a636758cb19044325959f96cb',
      tokenDecimal: 6,
      tokenLogo: '/images/TestnetTokenLogos/usdcIcon.svg',
      tokenName: 'USD Coin (rinkeby)',
      tokenSymbol: 'USDC',
      value: '1300000000'
    },
    {
      blockNumber: 9737712,
      blockTimestamp: 1581848807,
      contractAddress: '0xeb8f08a975ab53e34d8a0330e0d34de942c95926',
      cumulativeGasUsed: 6875298,
      events: [],
      fromAddress: '0x2502947319f2166ef46f0a7c081d23c63f88112b',
      gasLimit: 77454,
      gasPrice: 1500011168,
      gasUsed: 51636,
      hash: '0x050e59698614b537e82c580c8026236d164356f024f6b531f0bd7511ed40d75d',
      isError: false,
      isOutgoingTransaction: true,
      metadata: {
        acquisitionDate: '2021-10-20T00:00:00.000Z',
        companyName: 'Metaverse Company',
        roundCategory: 'Series B',
        postMoneyValuation: '100000',
        memo: '',
        fullyDilutedOwnershipStake: '1.2',
        preMoneyValuation: '2000000',
        numberShares: '23456',
        numberTokens: '',

        __typename: 'Financial_TransactionAnnotation',
        annotationMetadata: {},
        createdAt: '2021-10-28T10:22:11.141Z',
        fromLabel: '',
        toLabel: '',
        transactionCategory: 'INVESTMENT',
        transactionId:
          '0x050e59698614b537e82c580c8026236d164356f024f6b531f0bd7511ed40d75d',
        updatedAt: '2022-01-11T18:20:05.191Z'
      },
      syndicateAddress: '0x2502947319f2166eF46f0a7c081D23C63f88112B',
      toAddress: '0x7cd2d1c36d287f7db66ed74477813f87ef33bf91',
      tokenDecimal: 6,
      tokenLogo: '/images/TestnetTokenLogos/usdcIcon.svg',
      tokenName: 'USD Coin (rinkeby)',
      tokenSymbol: 'USDC',
      value: '2000000000'
    },
    {
      blockNumber: 9567323,
      blockTimestamp: 1579170407,
      contractAddress: '',
      cumulativeGasUsed: 10150476,
      events: [],
      fromAddress: '0x2502947319f2166ef46f0a7c081d23c63f88112b',
      gasLimit: 21000,
      gasPrice: 1501712196,
      gasUsed: 21000,
      hash: '0xa5baf7f1fdeabc40e5773f103daa473679d4cf38c39b09fee6500481f851a17e',
      isError: false,
      isOutgoingTransaction: true,
      metadata: {
        acquisitionDate: '2021-01-05T00:00:00.000Z',
        companyName: 'NFT DAO',
        roundCategory: 'Pre-Seed',
        postMoneyValuation: '10000',
        memo: '',
        fullyDilutedOwnershipStake: '8.9',
        preMoneyValuation: '1000000',
        numberShares: '',
        numberTokens: '546789.0123',

        __typename: 'Financial_TransactionAnnotation',
        annotationMetadata: {},
        createdAt: '2022-01-01T00:00:00.000Z',
        fromLabel: '',
        toLabel: '',
        transactionCategory: 'INVESTMENT',
        transactionId:
          '0xa5baf7f1fdeabc40e5773f103daa473679d4cf38c39b09fee6500481f851a17e',
        updatedAt: '2022-01-01T00:00:00.000Z'
      },
      syndicateAddress: '0x2502947319f2166eF46f0a7c081D23C63f88112B',
      toAddress: '0x23cf727486ebc811625ae2664adb3891d2111cb2',
      tokenDecimal: 18,
      tokenLogo: '/images/ethereum-logo.svg',
      tokenName: 'Ether',
      tokenSymbol: 'ETH',
      value: '1000000000000000000'
    }
  ],
  totalCount: 3
};

export const mockClubMembers = [
  {
    ownershipShare: '316494',
    depositAmount: '3812000000',
    tokens: '3812000000000000000000',
    member: {
      memberAddress: '0x005d3f75730cf16e25208bcb27ca941d33db9f8a'
    }
  },
  {
    ownershipShare: '523228',
    depositAmount: '6302000000',
    tokens: '6302000000000000000000',
    member: {
      memberAddress: '0x0574db630bb75dbe4310fbd6eb08dc47048b6fad'
    }
  },
  {
    ownershipShare: '1033',
    depositAmount: '12450000',
    tokens: '12450000000000000000',
    member: {
      memberAddress: '0x0cba94a2e458ccace1cc5bac0f05c0c67d9680fd'
    }
  },
  {
    ownershipShare: '35618',
    depositAmount: '429000000',
    tokens: '429000000000000000000',
    member: {
      memberAddress: '0x3b01acd0e53f7c3a636758cb19044325959f96cb'
    }
  },
  {
    ownershipShare: '24907',
    depositAmount: '300000000',
    tokens: '300000000000000000000',
    member: {
      memberAddress: '0x50ccff161ce2751fcfcdc6cf3ec9cc85c933af25'
    }
  },
  {
    ownershipShare: '98717',
    depositAmount: '1189000000',
    tokens: '1189000000000000000000',
    member: {
      memberAddress: '0x7cd2d1c36d287f7db66ed74477813f87ef33bf91'
    }
  }
];

export const mockActivityDepositTransactionsData = {
  edges: [
    {
      blockNumber: 9973048,
      blockTimestamp: 1641908532,
      contractAddress: '0xeb8f08a975ab53e34d8a0330e0d34de942c95926',
      cumulativeGasUsed: 1900506,
      events: [
        {
          __typename: 'Financial_GraphEvent',
          eventType: 'MEMBER_MINTED',
          id: '0x2cd4ae5e78ce86a8f0ae8e2ebcc93e3025675f915605fbe8518e0f0e05a0e681-18',
          transactionId:
            '0x2cd4ae5e78ce86a8f0ae8e2ebcc93e3025675f915605fbe8518e0f0e05a0e681'
        }
      ],
      fromAddress: '0x005d3f75730cf16e25208bcb27ca941d33db9f8a',
      gasLimit: 185121,
      gasPrice: -1794967283,
      gasUsed: 118478,
      hash: '0x2cd4ae5e78ce86a8f0ae8e2ebcc93e3025975f915605fbe8518e0f0e05a0e681',
      isError: false,
      isOutgoingTransaction: false,
      metadata: {
        __typename: 'Financial_TransactionAnnotation',
        acquisitionDate: null,
        annotationMetadata: {},
        companyName: '',
        createdAt: '2022-01-11T14:18:27.662Z',
        fromLabel: '',
        fullyDilutedOwnershipStake: '',
        memo: '',
        numberShares: '',
        numberTokens: '',
        postMoneyValuation: '',
        preMoneyValuation: '',
        roundCategory: null,
        toLabel: '',
        transactionCategory: 'DEPOSIT',
        transactionId:
          '0x2cd4ae5e78ce86a8f0ae8e2ebcc93e3025675f915605fbe8518e0f0e05a0e681',
        updatedAt: '2022-01-18T14:45:22.170Z'
      },
      syndicateAddress: '0x2502947319f2166eF46f0a7c081D23C63f88112B',
      toAddress: '0x2502947319f2166ef46f0a7c081d23c63f88112b',
      tokenDecimal: 6,
      tokenLogo: '/images/TestnetTokenLogos/usdcIcon.svg',
      tokenName: 'USD Coin (rinkeby)',
      tokenSymbol: 'USDC',
      value: '3812000000'
    },
    {
      blockNumber: 9973048,
      blockTimestamp: 1641908532,
      contractAddress: '0xeb8f08a975ab53e34d8a0330e0d34de942c95926',
      cumulativeGasUsed: 1900506,
      events: [
        {
          __typename: 'Financial_GraphEvent',
          eventType: 'MEMBER_MINTED',
          id: '0x2cd4ae5e78ce86a8f0ae8e2ebcc93e3025675f915605fbe8518e0f0e05a0e681-18',
          transactionId:
            '0x2cd4ae5e78ce86a8f0ae8e2ebcc93e3025675f915605fbe8518e0f0e05a0e681'
        }
      ],
      fromAddress: '0x0574db630bb75dbe4310fbd6eb08dc47048b6fad',
      gasLimit: 185121,
      gasPrice: -1794967283,
      gasUsed: 118478,
      hash: '0x2cd4ae5e78ce86a8f0ae8e2ebcc93e3055675f915605fbe8518e0f0e05a0e681',
      isError: false,
      isOutgoingTransaction: false,
      metadata: {
        __typename: 'Financial_TransactionAnnotation',
        acquisitionDate: null,
        annotationMetadata: {},
        companyName: '',
        createdAt: '2022-01-11T14:18:27.662Z',
        fromLabel: '',
        fullyDilutedOwnershipStake: '',
        memo: '',
        numberShares: '',
        numberTokens: '',
        postMoneyValuation: '',
        preMoneyValuation: '',
        roundCategory: null,
        toLabel: '',
        transactionCategory: 'DEPOSIT',
        transactionId:
          '0x2cd4ae5e78ce86a8f0ae8e2ebcc93e3025675f915605fbe8518e0f0e05a0e681',
        updatedAt: '2022-01-18T14:45:22.170Z'
      },
      syndicateAddress: '0x2502947319f2166eF46f0a7c081D23C63f88112B',
      toAddress: '0x2502947319f2166ef46f0a7c081d23c63f88112b',
      tokenDecimal: 6,
      tokenLogo: '/images/TestnetTokenLogos/usdcIcon.svg',
      tokenName: 'USD Coin (rinkeby)',
      tokenSymbol: 'USDC',
      value: '6302000000'
    },
    {
      blockNumber: 9973048,
      blockTimestamp: 1641908532,
      contractAddress: '0xeb8f08a975ab53e34d8a0330e0d34de942c95926',
      cumulativeGasUsed: 1900506,
      events: [
        {
          __typename: 'Financial_GraphEvent',
          eventType: 'MEMBER_MINTED',
          id: '0x2cd4ae5e78ce86a8f0ae8e2ebcc93e3025675f915605fbe8518e0f0e05a0e681-18',
          transactionId:
            '0x2cd4ae5e78ce86a8f0ae8e2ebcc93e3025675f915605fbe8518e0f0e05a0e681'
        }
      ],
      fromAddress: '0x0cba94a2e458ccace1cc5bac0f05c0c67d9680fd',
      gasLimit: 185121,
      gasPrice: -1794967283,
      gasUsed: 118478,
      hash: '0x2cd4ae5e78ce86a8f0ae8e2ebcc93f3025675f915605fbe8518e0f0e05a0e681',
      isError: false,
      isOutgoingTransaction: false,
      metadata: {
        __typename: 'Financial_TransactionAnnotation',
        acquisitionDate: null,
        annotationMetadata: {},
        companyName: '',
        createdAt: '2022-01-11T14:18:27.662Z',
        fromLabel: '',
        fullyDilutedOwnershipStake: '',
        memo: '',
        numberShares: '',
        numberTokens: '',
        postMoneyValuation: '',
        preMoneyValuation: '',
        roundCategory: null,
        toLabel: '',
        transactionCategory: 'DEPOSIT',
        transactionId:
          '0x2cd4ae5e78ce86a8f0ae8e2ebcc93e3025675f915605fbe8518e0f0e05a0e681',
        updatedAt: '2022-01-18T14:45:22.170Z'
      },
      syndicateAddress: '0x2502947319f2166eF46f0a7c081D23C63f88112B',
      toAddress: '0x2502947319f2166ef46f0a7c081d23c63f88112b',
      tokenDecimal: 6,
      tokenLogo: '/images/TestnetTokenLogos/usdcIcon.svg',
      tokenName: 'USD Coin (rinkeby)',
      tokenSymbol: 'USDC',
      value: '12450000'
    },
    {
      blockNumber: 9973048,
      blockTimestamp: 1641908532,
      contractAddress: '0xeb8f08a975ab53e34d8a0330e0d34de942c95926',
      cumulativeGasUsed: 1900506,
      events: [
        {
          __typename: 'Financial_GraphEvent',
          eventType: 'MEMBER_MINTED',
          id: '0x2cd4ae5e78ce86a8f0ae8e2ebcc93e3025675f915605fbe8518e0f0e05a0e681-18',
          transactionId:
            '0x2cd4ae5e78ce86a8f0ae8e2ebcc93e3025675f915605fbe8518e0f0e05a0e681'
        }
      ],
      fromAddress: '0x3b01acd0e53f7c3a636758cb19044325959f96cb',
      gasLimit: 185121,
      gasPrice: -1794967283,
      gasUsed: 118478,
      hash: '0x2cd4ae5e78ce68a8f0ae8e2ebcc93e3025675f915605fbe8518e0f0e05a0e681',
      isError: false,
      isOutgoingTransaction: false,
      metadata: {
        __typename: 'Financial_TransactionAnnotation',
        acquisitionDate: null,
        annotationMetadata: {},
        companyName: '',
        createdAt: '2022-01-11T14:18:27.662Z',
        fromLabel: '',
        fullyDilutedOwnershipStake: '',
        memo: '',
        numberShares: '',
        numberTokens: '',
        postMoneyValuation: '',
        preMoneyValuation: '',
        roundCategory: null,
        toLabel: '',
        transactionCategory: 'DEPOSIT',
        transactionId:
          '0x2cd4ae5e78ce86a8f0ae8e2ebcc93e3025675f915605fbe8518e0f0e05a0e681',
        updatedAt: '2022-01-18T14:45:22.170Z'
      },
      syndicateAddress: '0x2502947319f2166eF46f0a7c081D23C63f88112B',
      toAddress: '0x2502947319f2166ef46f0a7c081d23c63f88112b',
      tokenDecimal: 6,
      tokenLogo: '/images/TestnetTokenLogos/usdcIcon.svg',
      tokenName: 'USD Coin (rinkeby)',
      tokenSymbol: 'USDC',
      value: '429000000'
    },
    {
      blockNumber: 9973048,
      blockTimestamp: 1641908532,
      contractAddress: '0xeb8f08a975ab53e34d8a0330e0d34de942c95926',
      cumulativeGasUsed: 1900506,
      events: [
        {
          __typename: 'Financial_GraphEvent',
          eventType: 'MEMBER_MINTED',
          id: '0x2cd4ae5e78ce86a8f0ae8e2ebcc93e3025675f915605fbe8518e0f0e05a0e681-18',
          transactionId:
            '0x2cd4ae5e78ce86a8f0ae8e2ebcc93e3025675f915605fbe8518e0f0e05a0e681'
        }
      ],
      fromAddress: '0x50ccff161ce2751fcfcdc6cf3ec9cc85c933af25',
      gasLimit: 185121,
      gasPrice: -1794967283,
      gasUsed: 118478,
      hash: '0x2cd4ae5e78ce86a8f0ae8e2ebcc93e3025675f916605fbe8518e0f0e05a0e681',
      isError: false,
      isOutgoingTransaction: false,
      metadata: {
        __typename: 'Financial_TransactionAnnotation',
        acquisitionDate: null,
        annotationMetadata: {},
        companyName: '',
        createdAt: '2022-01-11T14:18:27.662Z',
        fromLabel: '',
        fullyDilutedOwnershipStake: '',
        memo: '',
        numberShares: '',
        numberTokens: '',
        postMoneyValuation: '',
        preMoneyValuation: '',
        roundCategory: null,
        toLabel: '',
        transactionCategory: 'DEPOSIT',
        transactionId:
          '0x2cd4ae5e78ce86a8f0ae8e2ebcc93e3025675f915605fbe8518e0f0e05a0e681',
        updatedAt: '2022-01-18T14:45:22.170Z'
      },
      syndicateAddress: '0x2502947319f2166eF46f0a7c081D23C63f88112B',
      toAddress: '0x2502947319f2166ef46f0a7c081d23c63f88112b',
      tokenDecimal: 6,
      tokenLogo: '/images/TestnetTokenLogos/usdcIcon.svg',
      tokenName: 'USD Coin (rinkeby)',
      tokenSymbol: 'USDC',
      value: '300000000'
    },
    {
      blockNumber: 9973048,
      blockTimestamp: 1641908532,
      contractAddress: '0xeb8f08a975ab53e34d8a0330e0d34de942c95926',
      cumulativeGasUsed: 1900506,
      events: [
        {
          __typename: 'Financial_GraphEvent',
          eventType: 'MEMBER_MINTED',
          id: '0x2cd4ae5e78ce86a8f0ae8e2ebcc93e3025675f915605fbe8518e0f0e05a0e681-18',
          transactionId:
            '0x2cd4ae5e78ce86a8f0ae8e2ebcc93e3025675f915605fbe8518e0f0e05a0e681'
        }
      ],
      fromAddress: '0x7cd2d1c36d287f7db66ed74477813f87ef33bf91',
      gasLimit: 185121,
      gasPrice: -1794967283,
      gasUsed: 118478,
      hash: '0x2cd4ae5e78ce86a8f0ae8e2ebcc93e3025675f415605fbe8518e0f0e05a0e681',
      isError: false,
      isOutgoingTransaction: false,
      metadata: {
        __typename: 'Financial_TransactionAnnotation',
        acquisitionDate: null,
        annotationMetadata: {},
        companyName: '',
        createdAt: '2022-01-11T14:18:27.662Z',
        fromLabel: '',
        fullyDilutedOwnershipStake: '',
        memo: '',
        numberShares: '',
        numberTokens: '',
        postMoneyValuation: '',
        preMoneyValuation: '',
        roundCategory: null,
        toLabel: '',
        transactionCategory: 'DEPOSIT',
        transactionId:
          '0x2cd4ae5e78ce86a8f0ae8e2ebcc93e3025675f915605fbe8518e0f0e05a0e681',
        updatedAt: '2022-01-18T14:45:22.170Z'
      },
      syndicateAddress: '0x2502947319f2166eF46f0a7c081D23C63f88112B',
      toAddress: '0x2502947319f2166ef46f0a7c081d23c63f88112b',
      tokenDecimal: 6,
      tokenLogo: '/images/TestnetTokenLogos/usdcIcon.svg',
      tokenName: 'USD Coin (rinkeby)',
      tokenSymbol: 'USDC',
      value: '1189000000'
    }
  ],
  totalCount: 6
};

const combinedActivityTransactions = [
  ...mockActivityDepositTransactionsData.edges,
  ...mockOffChainTransactionsData.edges
];
export const mockActivityTransactionsData = {
  edges: combinedActivityTransactions,
  totalCount: combinedActivityTransactions.length
};
