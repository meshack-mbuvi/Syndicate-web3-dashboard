import { Token } from '@/types/token';
import { isDev } from '@/utils/environment';

export const defaultTokenDetails = isDev
  ? {
      depositToken: '0xeb8f08a975Ab53E34D8a0330E0D34de942C95926',
      depositTokenSymbol: 'USDC',
      depositTokenLogo: '/images/TestnetTokenLogos/usdcIcon.svg',
      depositTokenName: 'Testnet USDC',
      depositTokenDecimals: 6
    }
  : {
      depositToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      depositTokenSymbol: 'USDC',
      depositTokenLogo: '/images/prodTokenLogos/usd-coin-usdc.svg',
      depositTokenName: 'USD Coin',
      depositTokenDecimals: 6
    };

const rinkebyTokens: Token[] = [
  {
    symbol: 'USDC',
    name: 'Testnet USDC',
    address: '0xeb8f08a975Ab53E34D8a0330E0D34de942C95926',
    decimals: 6,
    chainId: 4,
    logoURI: '/images/TestnetTokenLogos/usdcIcon.svg'
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    address: '',
    logoURI: '/images/ethereum-logo.svg',
    decimals: 18,
    default: true
  },
  {
    name: 'Wrapped Ether',
    address: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
    symbol: 'WETH',
    decimals: 18,
    chainId: 4,
    logoURI: '/images/prodTokenLogos/wEth.svg'
  },
  {
    name: 'Dai Stablecoin',
    address: '0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735',
    symbol: 'DAI',
    decimals: 18,
    chainId: 4,
    logoURI: '/images/TestnetTokenLogos/daiIcon.svg'
  },
  {
    name: 'Maker',
    address: '0xF9bA5210F91D0474bd1e1DcDAeC4C58E359AaD85',
    symbol: 'MKR',
    decimals: 18,
    chainId: 4,
    logoURI: '/images/prodTokenLogos/maker.svg'
  },
  {
    name: 'Uniswap',
    address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    symbol: 'UNI',
    decimals: 18,
    chainId: 4,
    logoURI: '/images/prodTokenLogos/uniswap.svg'
  }
];

const mainnetTokens: Token[] = [
  {
    name: 'USDCoin',
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    symbol: 'USDC',
    decimals: 6,
    chainId: 1,
    logoURI: '/images/prodTokenLogos/USDCoin.svg'
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    address: '',
    logoURI: '/images/ethereum-logo.svg',
    decimals: 18,
    default: true
  },
  {
    name: 'Wrapped Ether',
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    symbol: 'WETH',
    decimals: 18,
    chainId: 1,
    logoURI: '/images/prodTokenLogos/wEth.svg'
  },
  {
    name: 'Wrapped BTC',
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    symbol: 'WBTC',
    decimals: 8,
    chainId: 1,
    logoURI: '/images/prodTokenLogos/wrapped-btc.svg'
  },
  {
    name: 'Dai Stablecoin',
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    symbol: 'DAI',
    decimals: 18,
    chainId: 1,
    logoURI: '/images/TestnetTokenLogos/daiIcon.svg'
  },
  {
    name: 'TerraUSD',
    address: '0xa47c8bf37f92aBed4A126BDA807A7b7498661acD',
    symbol: 'UST',
    decimals: 18,
    chainId: 1,
    logoURI: '/images/prodTokenLogos/terra-usd.svg'
  },
  {
    name: 'Uniswap',
    address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    symbol: 'UNI',
    decimals: 18,
    chainId: 1,
    logoURI: '/images/prodTokenLogos/uniswap.svg'
  },
  {
    name: '0x Protocol Token',
    address: '0xE41d2489571d322189246DaFA5ebDe1F4699F498',
    symbol: 'ZRX',
    decimals: 18,
    chainId: 1,
    logoURI: '/images/prodTokenLogos/0x.svg'
  },
  {
    name: 'Curve DAO Token',
    address: '0xD533a949740bb3306d119CC777fa900bA034cd52',
    symbol: 'CRV',
    decimals: 18,
    chainId: 1,
    logoURI: '/images/prodTokenLogos/curve.svg'
  },
  {
    name: 'Tether USD',
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    symbol: 'USDT',
    decimals: 6,
    chainId: 1,
    logoURI: '/images/prodTokenLogos/tether.svg'
  },
  {
    name: 'Orchid',
    address: '0x4575f41308EC1483f3d399aa9a2826d74Da13Deb',
    symbol: 'OXT',
    decimals: 18,
    chainId: 1,
    logoURI: '/images/prodTokenLogos/orchid.svg'
  },
  {
    name: 'Maker',
    address: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2',
    symbol: 'MKR',
    decimals: 18,
    chainId: 1,
    logoURI: '/images/prodTokenLogos/maker.svg'
  },
  {
    name: 'ChainLink Token',
    address: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
    symbol: 'LINK',
    decimals: 18,
    chainId: 1,
    logoURI: '/images/prodTokenLogos/chainlink.svg'
  },
  {
    name: 'Reputation Augur v1',
    address: '0x1985365e9f78359a9B6AD760e32412f4a445E862',
    symbol: 'REP',
    decimals: 18,
    chainId: 1,
    logoURI: '/images/prodTokenLogos/augur.svg'
  },
  {
    name: 'Reputation Augur v2',
    address: '0x221657776846890989a759BA2973e427DfF5C9bB',
    symbol: 'REPv2',
    decimals: 18,
    chainId: 1,
    logoURI: '/images/prodTokenLogos/augurV2.svg'
  },
  {
    name: 'Kyber Network Crystal',
    address: '0xdd974D5C2e2928deA5F71b9825b8b646686BD200',
    symbol: 'KNC',
    decimals: 18,
    chainId: 1,
    logoURI: '/images/prodTokenLogos/kyber.svg'
  },
  {
    name: 'Compound',
    address: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
    symbol: 'COMP',
    decimals: 18,
    chainId: 1,
    logoURI: '/images/prodTokenLogos/compound.svg'
  },
  {
    chainId: 1,
    address: '0xBA11D00c5f74255f56a5E366F4F77f5A186d7f55',
    name: 'Band Protocol',
    symbol: 'BAND',
    decimals: 18,
    logoURI: '/images/prodTokenLogos/band.webp'
  },
  {
    name: 'Numeraire',
    address: '0x1776e1F26f98b1A5dF9cD347953a26dd3Cb46671',
    symbol: 'NMR',
    decimals: 18,
    chainId: 1,
    logoURI: '/images/prodTokenLogos/numeraire.png'
  },
  {
    name: 'UMA Voting Token v1',
    address: '0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828',
    symbol: 'UMA',
    decimals: 18,
    chainId: 1,
    logoURI: '/images/prodTokenLogos/uma.png'
  },
  {
    name: 'LoopringCoin V2',
    address: '0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD',
    symbol: 'LRC',
    decimals: 18,
    chainId: 1,
    logoURI: '/images/prodTokenLogos/loopring.png'
  },
  {
    chainId: 1,
    address: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e',
    name: 'yearn finance',
    symbol: 'YFI',
    decimals: 18,
    logoURI: '/images/prodTokenLogos/yearn-finance.webp'
  },
  {
    name: 'Republic Token',
    address: '0x408e41876cCCDC0F92210600ef50372656052a38',
    symbol: 'REN',
    decimals: 18,
    chainId: 1,
    logoURI: '/images/prodTokenLogos/republic.png'
  },
  {
    name: 'Balancer',
    address: '0xba100000625a3754423978a60c9317c58a424e3D',
    symbol: 'BAL',
    decimals: 18,
    chainId: 1,
    logoURI: '/images/prodTokenLogos/balancer.png'
  },
  {
    chainId: 1,
    address: '0x4fE83213D56308330EC302a8BD641f1d0113A4Cc',
    name: 'NuCypher',
    symbol: 'NU',
    decimals: 18,
    logoURI: '/images/prodTokenLogos/nucypher.webp'
  },
  {
    chainId: 1,
    address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
    name: 'Aave',
    symbol: 'AAVE',
    decimals: 18,
    logoURI: '/images/prodTokenLogos/AAVE.webp'
  },
  {
    chainId: 1,
    address: '0xc944E90C64B2c07662A292be6244BDf05Cda44a7',
    name: 'The Graph',
    symbol: 'GRT',
    decimals: 18,
    logoURI: '/images/prodTokenLogos/graph.webp'
  },
  {
    name: 'Bancor Network Token',
    address: '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C',
    symbol: 'BNT',
    decimals: 18,
    chainId: 1,
    logoURI: '/images/prodTokenLogos/bancor.png'
  },
  {
    name: 'Synthetix Network Token',
    address: '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F',
    symbol: 'SNX',
    decimals: 18,
    chainId: 1,
    logoURI: '/images/prodTokenLogos/synthetix.png'
  },
  {
    chainId: 1,
    address: '0x0F5D2fB29fb7d3CFeE444a200298f468908cC942',
    name: 'Decentraland',
    symbol: 'MANA',
    decimals: 18,
    logoURI: '/images/prodTokenLogos/decentraland.webp'
  },
  {
    name: 'Loom Network',
    address: '0xA4e8C3Ec456107eA67d3075bF9e3DF3A75823DB0',
    symbol: 'LOOM',
    decimals: 18,
    chainId: 1,
    logoURI: '/images/prodTokenLogos/loom.png'
  },
  {
    chainId: 1,
    address: '0x41e5560054824eA6B0732E656E3Ad64E20e94E45',
    name: 'Civic',
    symbol: 'CVC',
    decimals: 8,
    logoURI: '/images/prodTokenLogos/civic.webp'
  },
  {
    chainId: 1,
    address: '0x0AbdAce70D3790235af448C88547603b945604ea',
    name: 'district0x',
    symbol: 'DNT',
    decimals: 18,
    logoURI: '/images/prodTokenLogos/district0x.svg'
  },
  {
    name: 'Storj Token',
    address: '0xB64ef51C888972c908CFacf59B47C1AfBC0Ab8aC',
    symbol: 'STORJ',
    decimals: 8,
    chainId: 1,
    logoURI: '/images/prodTokenLogos/storj.png'
  },
  {
    chainId: 1,
    address: '0xfF20817765cB7f73d4bde2e66e067E58D11095C2',
    name: 'Amp',
    symbol: 'AMP',
    decimals: 18,
    logoURI: '/images/prodTokenLogos/amp.webp'
  },
  {
    name: 'Gnosis Token',
    address: '0x6810e776880C02933D47DB1b9fc05908e5386b96',
    symbol: 'GNO',
    decimals: 18,
    chainId: 1,
    logoURI: '/images/prodTokenLogos/gnosis.webp'
  },
  {
    name: 'Aragon Network Token',
    address: '0x960b236A07cf122663c4303350609A66A7B288C0',
    symbol: 'ANT',
    decimals: 18,
    chainId: 1,
    logoURI: '/images/prodTokenLogos/aragon.webp'
  },
  {
    chainId: 1,
    address: '0x85Eee30c52B0b379b046Fb0F85F4f3Dc3009aFEC',
    name: 'Keep Network',
    symbol: 'KEEP',
    decimals: 18,
    logoURI: '/images/prodTokenLogos/keep.webp'
  },
  {
    chainId: 1,
    address: '0x8dAEBADE922dF735c38C80C7eBD708Af50815fAa',
    name: 'tBTC',
    symbol: 'TBTC',
    decimals: 18,
    logoURI: '/images/prodTokenLogos/tBTC.webp'
  },
  {
    chainId: 1,
    address: '0xec67005c4E498Ec7f55E092bd1d35cbC47C91892',
    name: 'Enzyme',
    symbol: 'MLN',
    decimals: 18,
    logoURI: '/images/prodTokenLogos/enzyme.webp'
  },
  {
    chainId: 1,
    address: '0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72',
    name: 'Ethereum Name Service',
    symbol: 'ENS',
    decimals: 18,
    logoURI: '/images/prodTokenLogos/ens.webp'
  },
  {
    name: 'Synth sUSD',
    address: '0x57Ab1ec28D129707052df4dF418D58a2D46d5f51',
    symbol: 'sUSD',
    decimals: 18,
    chainId: 1,
    logoURI: '/images/prodTokenLogos/sUSD.png'
  },
  {
    chainId: 1,
    address: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
    name: 'Polygon',
    symbol: 'MATIC',
    decimals: 18,
    logoURI: '/images/prodTokenLogos/polygon.webp'
  }
];

export const coinList = isDev ? rinkebyTokens : mainnetTokens;
