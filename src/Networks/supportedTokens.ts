export const SUPPORTED_TOKENS = Object.freeze({
  // Ethereum Mainnet
  1: [
    {
      name: 'USDCoin',
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      symbol: 'USDC',
      decimals: 6,
      default: false,
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
      default: false,
      logoURI: '/images/prodTokenLogos/wEth.svg'
    },
    {
      name: 'Wrapped BTC',
      address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
      symbol: 'WBTC',
      decimals: 8,
      default: false,
      logoURI: '/images/prodTokenLogos/wrapped-btc.svg'
    },
    {
      name: 'Dai Stablecoin',
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      symbol: 'DAI',
      decimals: 18,
      default: false,
      logoURI: '/images/TestnetTokenLogos/daiIcon.svg'
    },
    {
      name: 'Uniswap',
      address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
      symbol: 'UNI',
      decimals: 18,
      default: false,
      logoURI: '/images/prodTokenLogos/uniswap.svg'
    },
    {
      name: '0x Protocol Token',
      address: '0xE41d2489571d322189246DaFA5ebDe1F4699F498',
      symbol: 'ZRX',
      decimals: 18,
      default: false,
      logoURI: '/images/prodTokenLogos/0x.svg'
    },
    {
      name: 'Curve DAO Token',
      address: '0xD533a949740bb3306d119CC777fa900bA034cd52',
      symbol: 'CRV',
      decimals: 18,
      default: false,
      logoURI: '/images/prodTokenLogos/curve.svg'
    },
    {
      name: 'Tether USD',
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      symbol: 'USDT',
      decimals: 6,
      default: false,
      logoURI: '/images/prodTokenLogos/tether.svg'
    },
    {
      name: 'Orchid',
      address: '0x4575f41308EC1483f3d399aa9a2826d74Da13Deb',
      symbol: 'OXT',
      decimals: 18,
      default: false,
      logoURI: '/images/prodTokenLogos/orchid.svg'
    },
    {
      name: 'Maker',
      address: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2',
      symbol: 'MKR',
      decimals: 18,
      default: false,
      logoURI: '/images/prodTokenLogos/maker.svg'
    },
    {
      name: 'ChainLink Token',
      address: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
      symbol: 'LINK',
      decimals: 18,
      default: false,
      logoURI: '/images/prodTokenLogos/chainlink.svg'
    },
    {
      name: 'Reputation Augur v1',
      address: '0x1985365e9f78359a9B6AD760e32412f4a445E862',
      symbol: 'REP',
      decimals: 18,
      default: false,
      logoURI: '/images/prodTokenLogos/augur.svg'
    },
    {
      name: 'Reputation Augur v2',
      address: '0x221657776846890989a759BA2973e427DfF5C9bB',
      symbol: 'REPv2',
      decimals: 18,
      default: false,
      logoURI: '/images/prodTokenLogos/augurV2.svg'
    },
    {
      name: 'Kyber Network Crystal',
      address: '0xdd974D5C2e2928deA5F71b9825b8b646686BD200',
      symbol: 'KNC',
      decimals: 18,
      default: false,
      logoURI: '/images/prodTokenLogos/kyber.svg'
    },
    {
      name: 'Compound',
      address: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
      symbol: 'COMP',
      decimals: 18,
      default: false,
      logoURI: '/images/prodTokenLogos/compound.svg'
    },
    {
      default: false,
      address: '0xBA11D00c5f74255f56a5E366F4F77f5A186d7f55',
      name: 'Band Protocol',
      symbol: 'BAND',
      decimals: 18,
      logoURI: '/images/prodTokenLogos/band.svg'
    },
    {
      name: 'Numeraire',
      address: '0x1776e1F26f98b1A5dF9cD347953a26dd3Cb46671',
      symbol: 'NMR',
      decimals: 18,
      default: false,
      logoURI: '/images/prodTokenLogos/numeraire.svg'
    },
    {
      name: 'UMA Voting Token v1',
      address: '0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828',
      symbol: 'UMA',
      decimals: 18,
      default: false,
      logoURI: '/images/prodTokenLogos/uma.svg'
    },
    {
      name: 'LoopringCoin V2',
      address: '0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD',
      symbol: 'LRC',
      decimals: 18,
      default: false,
      logoURI: '/images/prodTokenLogos/loopring.svg'
    },
    {
      default: false,
      address: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e',
      name: 'yearn finance',
      symbol: 'YFI',
      decimals: 18,
      logoURI: '/images/prodTokenLogos/yearn-finance.svg'
    },
    {
      name: 'Republic Token',
      address: '0x408e41876cCCDC0F92210600ef50372656052a38',
      symbol: 'REN',
      decimals: 18,
      default: false,
      logoURI: '/images/prodTokenLogos/republic.svg'
    },
    {
      name: 'Balancer',
      address: '0xba100000625a3754423978a60c9317c58a424e3D',
      symbol: 'BAL',
      decimals: 18,
      default: false,
      logoURI: '/images/prodTokenLogos/balancer.svg'
    },
    {
      default: false,
      address: '0x4fE83213D56308330EC302a8BD641f1d0113A4Cc',
      name: 'NuCypher',
      symbol: 'NU',
      decimals: 18,
      logoURI: '/images/prodTokenLogos/nucypher.svg'
    },
    {
      default: false,
      address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
      name: 'Aave',
      symbol: 'AAVE',
      decimals: 18,
      logoURI: '/images/prodTokenLogos/AAVE.svg'
    },
    {
      default: false,
      address: '0xc944E90C64B2c07662A292be6244BDf05Cda44a7',
      name: 'The Graph',
      symbol: 'GRT',
      decimals: 18,
      logoURI: '/images/prodTokenLogos/graph.svg'
    },
    {
      name: 'Bancor Network Token',
      address: '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C',
      symbol: 'BNT',
      decimals: 18,
      default: false,
      logoURI: '/images/prodTokenLogos/bancor.svg'
    },
    {
      name: 'Synthetix Network Token',
      address: '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F',
      symbol: 'SNX',
      decimals: 18,
      default: false,
      logoURI: '/images/prodTokenLogos/synthetix.svg'
    },
    {
      default: false,
      address: '0x0F5D2fB29fb7d3CFeE444a200298f468908cC942',
      name: 'Decentraland',
      symbol: 'MANA',
      decimals: 18,
      logoURI: '/images/prodTokenLogos/decentraland.svg'
    },
    {
      name: 'Loom Network',
      address: '0xA4e8C3Ec456107eA67d3075bF9e3DF3A75823DB0',
      symbol: 'LOOM',
      decimals: 18,
      default: false,
      logoURI: '/images/prodTokenLogos/loom.svg'
    },
    {
      default: false,
      address: '0x41e5560054824eA6B0732E656E3Ad64E20e94E45',
      name: 'Civic',
      symbol: 'CVC',
      decimals: 8,
      logoURI: '/images/prodTokenLogos/civic.svg'
    },
    {
      default: false,
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
      default: false,
      logoURI: '/images/prodTokenLogos/storj.svg'
    },
    {
      default: false,
      address: '0xfF20817765cB7f73d4bde2e66e067E58D11095C2',
      name: 'Amp',
      symbol: 'AMP',
      decimals: 18,
      logoURI: '/images/prodTokenLogos/amp.svg'
    },
    {
      name: 'Gnosis Token',
      address: '0x6810e776880C02933D47DB1b9fc05908e5386b96',
      symbol: 'GNO',
      decimals: 18,
      default: false,
      logoURI: '/images/prodTokenLogos/gnosis.svg'
    },
    {
      name: 'Aragon Network Token',
      address: '0x960b236A07cf122663c4303350609A66A7B288C0',
      symbol: 'ANT',
      decimals: 18,
      default: false,
      logoURI: '/images/prodTokenLogos/aragon.svg'
    },
    {
      default: false,
      address: '0x85Eee30c52B0b379b046Fb0F85F4f3Dc3009aFEC',
      name: 'Keep Network',
      symbol: 'KEEP',
      decimals: 18,
      logoURI: '/images/prodTokenLogos/keep.svg'
    },
    {
      default: false,
      address: '0x8dAEBADE922dF735c38C80C7eBD708Af50815fAa',
      name: 'tBTC',
      symbol: 'TBTC',
      decimals: 18,
      logoURI: '/images/prodTokenLogos/tBTC.svg'
    },
    {
      default: false,
      address: '0xec67005c4E498Ec7f55E092bd1d35cbC47C91892',
      name: 'Enzyme',
      symbol: 'MLN',
      decimals: 18,
      logoURI: '/images/prodTokenLogos/enzyme.svg'
    },
    {
      default: false,
      address: '0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72',
      name: 'Ethereum Name Service',
      symbol: 'ENS',
      decimals: 18,
      logoURI: '/images/prodTokenLogos/ens.svg'
    },
    {
      name: 'Synth sUSD',
      address: '0x57Ab1ec28D129707052df4dF418D58a2D46d5f51',
      symbol: 'sUSD',
      decimals: 18,
      default: false,
      logoURI: '/images/prodTokenLogos/sUSD.png'
    },
    {
      default: false,
      address: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
      name: 'Polygon',
      symbol: 'MATIC',
      decimals: 18,
      logoURI: '/images/prodTokenLogos/polygon.svg'
    }
  ],
  // Rinkeby
  4: [
    {
      symbol: 'USDC',
      name: 'Testnet USDC',
      address: '0xeb8f08a975Ab53E34D8a0330E0D34de942C95926',
      decimals: 6,
      default: false,
      logoURI: '/images/TestnetTokenLogos/usdcIcon.svg'
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      address: '',
      logoURI: '/images/chains/rinkeby.svg',
      decimals: 18,
      default: true
    },
    {
      name: 'Wrapped Ether',
      address: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
      symbol: 'WETH',
      decimals: 18,
      default: false,
      logoURI: '/images/prodTokenLogos/wEth.svg'
    },
    {
      name: 'Dai Stablecoin',
      address: '0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735',
      symbol: 'DAI',
      decimals: 18,
      default: false,
      logoURI: '/images/TestnetTokenLogos/daiIcon.svg'
    },
    {
      name: 'Maker',
      address: '0xF9bA5210F91D0474bd1e1DcDAeC4C58E359AaD85',
      symbol: 'MKR',
      decimals: 18,
      default: false,
      logoURI: '/images/prodTokenLogos/maker.svg'
    },
    {
      name: 'Uniswap',
      address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
      symbol: 'UNI',
      decimals: 18,
      default: false,
      logoURI: '/images/prodTokenLogos/uniswap.svg'
    }
  ],
  // Goerli
  5: [
    {
      symbol: 'USDC',
      name: 'Testnet USDC',
      address: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
      decimals: 6,
      default: false,
      logoURI: '/images/TestnetTokenLogos/usdcIcon.svg'
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      address: '',
      logoURI: '/images/chains/goerli.svg',
      decimals: 18,
      default: true
    },
    {
      name: 'Wrapped Ether',
      address: '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6',
      symbol: 'WETH',
      decimals: 18,
      default: false,
      logoURI: '/images/prodTokenLogos/wEth.svg'
    },
    {
      name: 'Dai Stablecoin',
      address: '0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844',
      symbol: 'DAI',
      decimals: 18,
      default: false,
      logoURI: '/images/TestnetTokenLogos/daiIcon.svg',
      price: 1.0
    },
    {
      name: 'Maker',
      address: '0xc5E4eaB513A7CD12b2335e8a0D57273e13D499f7',
      symbol: 'MKR',
      decimals: 18,
      default: false,
      logoURI: '/images/prodTokenLogos/maker.svg'
    },
    {
      name: 'Uniswap',
      address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
      symbol: 'UNI',
      decimals: 18,
      default: false,
      logoURI: '/images/prodTokenLogos/uniswap.svg'
    }
  ],
  // Matic
  137: [
    {
      symbol: 'MATIC',
      name: 'Polygon',
      address: '',
      logoURI: '/images/chains/polygon.svg',
      decimals: 18,
      default: true
    },
    {
      name: 'USDCoin',
      address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      symbol: 'USDC',
      decimals: 6,
      default: false,
      logoURI: '/images/prodTokenLogos/USDCoin.svg'
    },
    {
      name: 'Wrapped Ether',
      address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      symbol: 'WETH',
      decimals: 18,
      default: false,
      logoURI: '/images/prodTokenLogos/wEth.svg'
    },
    {
      name: 'Dai Stablecoin',
      address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
      symbol: 'DAI',
      decimals: 18,
      default: false,
      logoURI: '/images/TestnetTokenLogos/daiIcon.svg'
    },
    {
      name: '0x Protocol Token',
      address: '0x5559Edb74751A0edE9DeA4DC23aeE72cCA6bE3D5',
      symbol: 'ZRX',
      decimals: 18,
      default: false,
      logoURI: '/images/prodTokenLogos/0x.svg'
    },
    {
      name: 'Curve DAO Token',
      address: '0x172370d5Cd63279eFa6d502DAB29171933a610AF',
      symbol: 'CRV',
      decimals: 18,
      default: false,
      logoURI: '/images/prodTokenLogos/curve.svg'
    },
    {
      name: 'Uniswap',
      address: '0xb33EaAd8d922B1083446DC23f610c2567fB5180f',
      symbol: 'UNI',
      decimals: 18,
      default: false,
      logoURI: '/images/prodTokenLogos/uniswap.svg'
    },
    {
      name: 'Tether USD',
      address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
      symbol: 'USDT',
      decimals: 6,
      default: false,
      logoURI: '/images/prodTokenLogos/tether.svg'
    },
    {
      name: 'Orchid',
      address: '0x9880e3dDA13c8e7D4804691A45160102d31F6060',
      symbol: 'OXT',
      decimals: 18,
      default: false,
      logoURI: '/images/prodTokenLogos/orchid.svg'
    },
    {
      name: 'Maker',
      address: '0x6f7C932e7684666C9fd1d44527765433e01fF61d',
      symbol: 'MKR',
      decimals: 18,
      default: false,
      logoURI: '/images/prodTokenLogos/maker.svg'
    },
    {
      name: 'ChainLink Token',
      address: '0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39',
      symbol: 'LINK',
      decimals: 18,
      default: false,
      logoURI: '/images/prodTokenLogos/chainlink.svg'
    },
    {
      name: 'Reputation Augur v2',
      address: '0x6563c1244820CfBd6Ca8820FBdf0f2847363F733',
      symbol: 'REPv2',
      decimals: 18,
      default: false,
      logoURI: '/images/prodTokenLogos/augurV2.svg'
    },
    {
      name: 'Kyber Network Crystal',
      address: '0x324b28d6565f784d596422B0F2E5aB6e9CFA1Dc7',
      symbol: 'KNC',
      decimals: 18,
      default: false,
      logoURI: '/images/prodTokenLogos/kyber.svg'
    },
    {
      name: 'Compound',
      address: '0x8505b9d2254A7Ae468c0E9dd10Ccea3A837aef5c',
      symbol: 'COMP',
      decimals: 18,
      default: false,
      logoURI: '/images/prodTokenLogos/compound.svg'
    },
    {
      default: false,
      address: '0xA8b1E0764f85f53dfe21760e8AfE5446D82606ac',
      name: 'Band Protocol',
      symbol: 'BAND',
      decimals: 18,
      logoURI: '/images/prodTokenLogos/band.svg'
    },
    {
      name: 'Numeraire',
      address: '0x0Bf519071b02F22C17E7Ed5F4002ee1911f46729',
      symbol: 'NMR',
      decimals: 18,
      default: false,
      logoURI: '/images/prodTokenLogos/numeraire.svg'
    },
    {
      name: 'UMA Voting Token v1',
      address: '0x3066818837c5e6eD6601bd5a91B0762877A6B731',
      symbol: 'UMA',
      decimals: 18,
      default: false,
      logoURI: '/images/prodTokenLogos/uma.svg'
    },
    {
      name: 'LoopringCoin V2',
      address: '0x84e1670F61347CDaeD56dcc736FB990fBB47ddC1',
      symbol: 'LRC',
      decimals: 18,
      default: false,
      logoURI: '/images/prodTokenLogos/loopring.svg'
    },
    {
      default: false,
      address: '0xDA537104D6A5edd53c6fBba9A898708E465260b6',
      name: 'yearn finance',
      symbol: 'YFI',
      decimals: 18,
      logoURI: '/images/prodTokenLogos/yearn-finance.svg'
    },
    {
      name: 'Republic Token',
      address: '0x19782D3Dc4701cEeeDcD90f0993f0A9126ed89d0',
      symbol: 'REN',
      decimals: 18,
      default: false,
      logoURI: '/images/prodTokenLogos/republic.svg'
    },
    {
      name: 'Wrapped BTC',
      address: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6',
      symbol: 'WBTC',
      decimals: 8,
      default: false,
      logoURI: '/images/prodTokenLogos/wrapped-btc.svg'
    },
    {
      name: 'Balancer',
      address: '0x9a71012B13CA4d3D0Cdc72A177DF3ef03b0E76A3',
      symbol: 'BAL',
      decimals: 18,
      default: false,
      logoURI: '/images/prodTokenLogos/balancer.svg'
    },
    {
      default: false,
      address: '0xD6DF932A45C0f255f85145f286eA0b292B21C90B',
      name: 'Aave',
      symbol: 'AAVE',
      decimals: 18,
      logoURI: '/images/prodTokenLogos/AAVE.svg'
    },
    {
      default: false,
      address: '0x5fe2B58c013d7601147DcdD68C143A77499f5531',
      name: 'The Graph',
      symbol: 'GRT',
      decimals: 18,
      logoURI: '/images/prodTokenLogos/graph.svg'
    },
    {
      name: 'Bancor Network Token',
      address: '0xc26D47d5c33aC71AC5CF9F776D63Ba292a4F7842',
      symbol: 'BNT',
      decimals: 18,
      default: false,
      logoURI: '/images/prodTokenLogos/bancor.svg'
    },
    {
      name: 'Synthetix Network Token',
      address: '0x50B728D8D964fd00C2d0AAD81718b71311feF68a',
      symbol: 'SNX',
      decimals: 18,
      default: false,
      logoURI: '/images/prodTokenLogos/synthetix.svg'
    },
    {
      default: false,
      address: '0xA1c57f48F0Deb89f569dFbE6E2B7f46D33606fD4',
      name: 'Decentraland',
      symbol: 'MANA',
      decimals: 18,
      logoURI: '/images/prodTokenLogos/decentraland.svg'
    },
    {
      name: 'Loom Network',
      address: '0x66EfB7cC647e0efab02eBA4316a2d2941193F6b3',
      symbol: 'LOOM',
      decimals: 18,
      default: false,
      logoURI: '/images/prodTokenLogos/loom.svg'
    },
    {
      default: false,
      address: '0x66Dc5A08091d1968e08C16aA5b27BAC8398b02Be',
      name: 'Civic',
      symbol: 'CVC',
      decimals: 8,
      logoURI: '/images/prodTokenLogos/civic.svg'
    },
    {
      name: 'Storj Token',
      address: '0xd72357dAcA2cF11A5F155b9FF7880E595A3F5792',
      symbol: 'STORJ',
      decimals: 8,
      default: false,
      logoURI: '/images/prodTokenLogos/storj.svg'
    },
    {
      default: false,
      address: '0x0621d647cecbFb64b79E44302c1933cB4f27054d',
      name: 'Amp',
      symbol: 'AMP',
      decimals: 18,
      logoURI: '/images/prodTokenLogos/amp.svg'
    },
    {
      name: 'Gnosis Token',
      address: '0x5FFD62D3C3eE2E81C00A7b9079FB248e7dF024A8',
      symbol: 'GNO',
      decimals: 18,
      default: false,
      logoURI: '/images/prodTokenLogos/gnosis.svg'
    },
    {
      default: false,
      address: '0x42f37A1296b2981F7C3cAcEd84c5096b2Eb0C72C',
      name: 'Keep Network',
      symbol: 'KEEP',
      decimals: 18,
      logoURI: '/images/prodTokenLogos/keep.svg'
    },
    {
      default: false,
      address: '0x50a4a434247089848991DD8f09b889D4e2870aB6',
      name: 'tBTC',
      symbol: 'TBTC',
      decimals: 18,
      logoURI: '/images/prodTokenLogos/tBTC.svg'
    },
    {
      default: false,
      address: '0xbD7A5Cf51d22930B8B3Df6d834F9BCEf90EE7c4f',
      name: 'Ethereum Name Service',
      symbol: 'ENS',
      decimals: 18,
      logoURI: '/images/prodTokenLogos/ens.svg'
    },
    {
      name: 'Synth sUSD',
      address: '0xF81b4Bec6Ca8f9fe7bE01CA734F55B2b6e03A7a0',
      symbol: 'sUSD',
      decimals: 18,
      default: false,
      logoURI: '/images/prodTokenLogos/sUSD.png'
    },
    {
      name: 'Wrapped Matic',
      address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
      symbol: 'WMATIC',
      decimals: 18,
      default: false,
      logoURI: '/images/prodTokenLogos/polygon.svg'
    }
  ]
});
