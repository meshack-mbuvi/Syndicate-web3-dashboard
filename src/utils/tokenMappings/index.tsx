// map token contract address to token properties that cannot be fetched
// from the token contract.
// Add Rinkeby testnet tokens here.
export const TokenMappings = {
  '0xeb8f08a975ab53e34d8a0330e0d34de942c95926': {
    name: 'USDC',
    symbol: 'USDC',
    price: '0',
    logo: '/images/TestnetTokenLogos/usdcIcon.svg'
  },
  '0xc3dbf84abb494ce5199d5d4d815b10ec29529ff8': {
    name: 'DAI',
    symbol: 'DAI',
    price: '0',
    logo: '/images/TestnetTokenLogos/daiIcon.svg'
  }
};
