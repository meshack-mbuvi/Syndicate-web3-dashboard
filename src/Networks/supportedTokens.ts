export const SUPPORTED_TOKENS = Object.freeze({
  // Ethereum Mainnet
  1: [
    {
      name: 'USDCoin',
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      symbol: 'USDC',
      decimals: 6,
      chainId: 1,
      logoURI: '/images/usdcIcon.svg',
      default: true
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      address: '',
      logoURI: '/images/chains/ethereum.svg',
      decimal: 18,
      default: false
    }
  ],
  // Rinkeby
  4: [
    {
      symbol: 'USDC',
      name: 'Testnet USDC',
      address: '0xeb8f08a975Ab53E34D8a0330E0D34de942C95926',
      decimals: 18,
      chainId: 4,
      logoURI: '/images/TestnetTokenLogos/usdcIcon.svg',
      default: true
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      address: '',
      logoURI: '/images/chains/rinkeby.svg',
      decimal: 18,
      default: false
    }
  ],
  // Matic
  137: [
    {
      symbol: 'MATIC',
      name: 'Polygon',
      address: '',
      logoURI: '/images/chains/polygon.svg',
      decimal: 18,
      default: true
    }
  ]
});
